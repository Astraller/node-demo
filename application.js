"use strict";
const config = require('./config');
const logger = require('./modules/logger');
const LocalService = require('./modules/local-service');
const StorageService = require('./modules/redis-storage-service');
const WebSocketService = require('./modules/websocket-service');
logger.configure(config);

class Application{
    constructor(){
        this.local = new LocalService(this);
        this.storage = new StorageService(config);
        this.global = new WebSocketService(this);
        this.settings = {
            messagesTimeSpan: config.time.messageReceive
        };
    }

    async launch(){
        return Promise.all([
            this.storage.configure(config),
            this.local.listen(config.port.local),
            this.global.configure(config)
        ]);
    }
}

module.exports = Application;