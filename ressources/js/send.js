// Connexion au serveur websocket
const socket = new WebSocket('wss://' + location.host);

// Connection opened
socket.addEventListener('open', function (event) {
    document.getElementById("status").innerHTML = "Connect&eacute;"
    document.getElementById("status").className = "badge badge-success"
    
    var json = {
        "session_id": document.getElementById("session_id").innerHTML,
        "type": "send"
    };

    socket.send(JSON.stringify(json));
});

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
});

// function to send data to the server
function send_data(){
    
    var input = {};

    // Get all div from input
    var master_div = document.getElementById("input");
    
    // Parse all divs to prepare values
    var divs = master_div.getElementsByTagName("div");
    for (var i = 0; i < divs.length; i++) {
        // Write to id to console log
        console.log(divs[i].id);
        
        // Add div id to json object
        input[divs[i].id] = {
            "type": document.getElementById(divs[i].id + "-type").value,
            "value": document.getElementById(divs[i].id + "-value").value
        };
    } 

    // Create json object to send 
    var json = {
        "session_id": document.getElementById("session_id").innerHTML,
        "input": input
    };

    // Send json object
    socket.send(JSON.stringify(json));

}