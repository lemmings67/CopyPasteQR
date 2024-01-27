

export class SessionManager{
    // Constructor with ws argument to be used for the websocket connection
    constructor(ws, session_id){
        this.master_ws = ws;
        this.session_id = session_id;
    }

    // add a new client to the session
    add_client(ws){
        this.client_ws = ws;
    }
}