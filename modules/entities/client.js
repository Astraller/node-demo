"use strict";

const uuid = require('uuid/v4');

class Client{
    constructor(name, { accessLevel = 'user' }){
        this.name = name;
        this.accessLevel = accessLevel;
        this.token = uuid();
    }

    toString(){
        return JSON.stringify({
            username: this.name,
            token: this.token,
            accessLevel: this.accessLevel
        });
    }
}

class ClientBuilder{
    static fromStorage(data){
        const clientData = JSON.parse(data);
        const client = this.fromAuthData(clientData);
        client.token = clientData.token;
        return client;
    }
    static fromAuthData({username, accessLevel}){
        return new Client(username, { accessLevel });
    }
}

module.exports = ClientBuilder;