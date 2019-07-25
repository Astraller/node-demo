"use strict";

class Message {
    constructor(text, author) {
        this.text = text;
        this.author = author;
        this.time = (new Date()).toUTCString()
    }

    toString(){
        return JSON.stringify({
           text: this.text,
           author: this.author.token,
           time: this.time
        });
    }

    toSend(){
        return {
            text: this.text,
            author: this.author.name,
            time: this.time
        };
    }
}

class MessageBuilder {
    static fromNetwork(text, client) {
        return new Message(text, client);
    }

    static async fromStorage(data, storage) {
        const message = JSON.parse(data);
        const client = await storage.findAuth(message.author);
        const instance = this.fromNetwork(message.text, client);
        instance.time = message.time;
        return instance;
    }
}

module.exports = MessageBuilder;