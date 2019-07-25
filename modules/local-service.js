"use strict";

const net = require("net");
const logger = require('./logger');

class LocalService{
    constructor(app){
        this._app = app;
        this._provider = net.createServer((socket) => this.acceptConnection(socket));
        logger.add('local', 'configured');
    }

    acceptConnection(socket){
        logger.add('local', 'connection');
        socket.on("data", async (incoming) => {
           try{
               const incomingData = JSON.parse(incoming);
               const token = await this._app.storage.storeHandshake(incomingData);
               socket.write(JSON.stringify({success: true, token}));
           } catch (error){
               logger.add('local', error.message);
               socket.write(JSON.stringify({success: false, reason: 'bad client data'}));
           }
           socket.destroy();
        });
    }

    listen(port){
        this._provider.listen(port);
    }
}

module.exports = LocalService;