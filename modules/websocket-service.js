"use strict";

const SocketIO = require('socket.io');
const WebSocketConnection = require('./websocket-connection');
const logger = require('./logger');

class WebSocketService{
    constructor(app){
        this._app = app;
    }
    async configure({port:{global: wsPort}}){
        this._provider = SocketIO(wsPort, {path: "/"});
        this._provider.on('connect', (socket) => this.onConnection(socket));
        logger.add('global', 'configured ', wsPort);
    }
    async onConnection(socket){
        logger.add('global', 'connection');
        let connection = new WebSocketConnection(socket, this._app);
        socket.on('disconnect', () => {
            connection = null;
        });
        try{
            return await connection.checkAuth();
        }catch (e) {
            logger.add('global', 'problem ', e.toString());
        }
    }
    broadcast(type, message){
        this._provider.emit(type, message);
    }
}

module.exports = WebSocketService;