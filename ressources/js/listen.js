// Connexion au serveur websocket
var socket = new WebSocket('wss://' + location.host);

// Create a connect function 
function connect() {
    // Connection opened
    socket.addEventListener('open', function (event) {
        document.getElementById("status").innerHTML = "Connect&eacute;"
        document.getElementById("status").className = "badge badge-success"
        
        var json = {
            "session_id": document.getElementById("session_id").innerHTML,
            "type": "listen"
        };
    
        socket.send(JSON.stringify(json));
    });
}

// Connection opened
socket.addEventListener('open', function (event) {
    document.getElementById("status").innerHTML = "En attente de l'émetteur"
    document.getElementById("status").className = "badge badge-primary"
    
    var json = {
        "session_id": document.getElementById("session_id").innerHTML,
        "type": "listen"
    };

    socket.send(JSON.stringify(json));
});

// Auto-reconnect if connection is closed by server
socket.addEventListener('close', function (event) {
    document.getElementById("status").innerHTML = "D&eacute;connect&eacute;"
    document.getElementById("status").className = "badge badge-danger"
    
    // Try to reconnect after 5 seconds
    setTimeout(function(){ 
        socket = new WebSocket('wss://' + location.host);
    }, 5000);
});

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
    
    // Decoding json message
    // msg value example : {"session_id":"1234","input":{"input1":{"type":"2","value":"testazfz"},"input2":{"type":"3","value":"zfazfzfaz"}}}
    let msg = JSON.parse(event.data);
    
    if (msg.session_id !== document.getElementById("session_id").innerHTML) {
        console.log("Session id not match");
        return;
    }

    if (msg.type === "send") {
        document.getElementById("status").innerHTML = "Connecté"
        document.getElementById("status").className = "badge badge-success"
    }

    // Check if input is defined and not empty to continue
    if (msg.input !== undefined && Object.keys(msg.input).length !== 0) {
        // For all input in msg.input
        for (var input in msg.input) {
            // Write to id to console log
            console.log(input);
    
            // Add div id to json object
            //document.getElementById(input + "-type").value = msg.input[input].type;
            document.getElementById(input + "-value").value = msg.input[input].value;
        }
    }
    
});



