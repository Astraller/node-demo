"use strict";

module.exports = {
    path: {
        log: "./log"
    },
    time: {
        logSave: 5000,
        messageReceive: 1000
    },
    port: {
        local: 25025,
        global: 25026
    },
    dataSource: {
        "server": "127.0.0.1",
        "port": 6379
    }
};