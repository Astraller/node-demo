"use strict";
const logger = require('./logger');

/**
 * WebSocketConnection class
 */
class WebSocketConnection {
    /**
     * @param {object} socket
     * @param {Application} app
     */
    constructor(socket, app) {
        this._socket = socket;
        this._app = app;
    }

    async checkAuth() {
        logger.add('client-connection', 'connection');
        try {
            const {token} = this._socket.request._query;
            this._client = await this._app.storage.findAuth(token);
            this._socket.on('message', async (data) => this.onMessage(data));
            logger.add('client-connection', 'authorized ' + this._client.toString());
            return this.sendHistory();
        } catch (e) {
            logger.add('client-connection', 'auth fail' + e.message);
            this._socket.emit('chat-error', 'wrong token');
            this._socket.disconnect();
        }
    }

    /**
     * @param {string} messageData
     * @returns {Promise<void>}
     */
    async onMessage(messageData) {
        const currentTime = 0 + new Date();
        if(currentTime < this.lastMessageSent + this._app.settings.messagesTimeSpan){
            this._socket.emit('chatError', 'spam detected');
            return;
        }
        this.lastMessageSent = currentTime;
        const savedMessage = await this._app.storage.storeMessage(messageData, this._client);
        logger.add('client-connection', 'Message accepted: ' + messageData);
        return this._app.global.broadcast('message', savedMessage.toSend());
    }

    async sendHistory(){
        const history = await this._app.storage.getHistory();
        this._socket.emit('history', history.map((el) => el.toSend()));
    }
}

module.exports = WebSocketConnection;