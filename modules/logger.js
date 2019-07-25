"use strict";

const fs = require('fs').promises;

class Logger {
    constructor() {
        this.stack = [];
    }

    /**
     * @param {string} logPath
     * @param {number} logSaveTime
     */
    configure({path: {log: logPath}, time: {logSave: logSaveTime}}){
        this.path = logPath;
        setInterval(() => this.write, logSaveTime);
    }

    /**
     * @param {string} type
     * @param {string|Array} message
     */
    add(type, ...message) {
        if(message.length === 1){
            message = message[0];
        }else{
            message = JSON.stringify(message);
        }
        this.stack.push({
            type,
            message,
            time: (new Date()).toUTCString()
        });
        console.log(`[${type}] ${message}`);
    }

    write() {
        if (this.stack.length < 1) return;
        Promise.all(this.stack.map(this.saveLog));
        console.log(`Write ${this.stack.length} log records`);
        this.stack = [];
    }

    /**
     * @param {object} data
     * @returns {Promise<void>}
     */
    async saveLog(data) {
        const path = `${this.path}/${data.type}.log`;
        return fs.writeFile(path, `[${data.time}] ${data.message}`);
    }
}

module.exports = new Logger();