const express = require("express");
const fs = require('fs');
const bp = require("body-parser");
const qr = require("qrcode");
const app = express();
const yaml = require('js-yaml');
const WebSocket = require('ws');

// Loading base_url from configuration file config.yaml
let config = yaml.load(fs.readFileSync(__dirname + '/../config.yaml', 'utf8'));
const base_url = config.base_url;
const webserver_port = config.webserver_port;
const websocket_port = config.websocket_port;

app.set("view engine", "ejs");
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());

app.get("/", (req, res) => {
    
    session_id = Math.floor(Math.random() * 10000);

    const connect_url = base_url + "/send/" + session_id;
    qr.toDataURL(connect_url, (err, src) => {
        if (err) res.send("Error occured");
      
        // Let us return the QR code image as our response and set it to be the source used in the webpage
        res.render("listen", { src, session_id });
    });
});

app.get("/send/:session_id", (req, res) => {
    const session = req.params.session_id;
    res.render("send", { session });
});

app.use('/js', express.static(__dirname + '/../ressources/js'));

app.listen(webserver_port, () => console.log("Listen at " + base_url + ":" + webserver_port));

let wss = new WebSocket.Server({ server: app.listen(websocket_port) });

// Create a list a session manager
let session_manager = [];

wss.on('connection', (ws) => {

    var client = ws._socket.remoteAddress + ":" + ws._socket.remotePort;

    // Gestion d'une nouvelle connexion
    ws.on('open', function() {
        // Display source IP and port of the client
        console.log("New client connected: " + client);
    });
  
    ws.on('message', function(message) {

        //current_session = new SessionManager(ws, message);
        console.log(`Received from ${client}:\n${message}`);
  
        // Decode message as json object
        let msg = JSON.parse(message);

        if (msg.type === "send") {
            console.log("Add sender to: " + msg.session_id);
            ws.session_id = msg.session_id;
            // Check if a session is registred in session manager
            if (session_manager[msg.session_id] === undefined) {
                console.log("Session not found");
                return;
            } else {
                console.log("Session found");
                session_manager[msg.session_id].send(JSON.stringify(msg));
                /*msg.type = "listen";
                ws.send(JSON.stringify(msg));*/
            }
        }

        if (msg.type === "listen") {
            console.log("Add listener " + client + " for session " + msg.session_id);
            ws.session_id = msg.session_id;
            // Add session to session manager
            session_manager[msg.session_id] = ws;
        }

        if (msg.input !== undefined) {
            // Check if a session is registred in session manager
            if (session_manager[msg.session_id] === undefined) {
                console.log("No listener for " + msg.session_id);
                return;
            } else {
                console.log("Seding data to " + msg.session_id);
                console.log("Send: " + message);
                session_manager[msg.session_id].send(JSON.stringify(msg));
            }
        }
  
    });
  
  });
  
