const {promisify} = require('util');
const Redis = require('redis');
const logger = require('./logger');
const Client = require('./entities/client');
const Message = require('./entities/message');

class RedisStorageService {
    constructor() {
        this._chanelAuthHash = 'auth';
        this._chanelMessages = 'messages';
        this._historyCount = 30;
    }

    async configure({dataSource}) {
        const client = Redis.createClient(dataSource);
        this._provider = {
            hget: promisify(client.hget).bind(client),
            hset: promisify(client.hset).bind(client),
            rpush: promisify(client.rpush).bind(client),
            lrange: promisify(client.lrange).bind(client)
        };
        logger.add('storage', 'configured');
    }

    async storeHandshake(clientData){
        const chatClient = Client.fromAuthData(clientData);
        await this._provider.hset(this._chanelAuthHash, chatClient.token, chatClient.toString());
        return chatClient.token;
    }

    async findAuth(token){
        return Client.fromStorage(await this._provider.hget(this._chanelAuthHash, token));
    }

    async storeMessage(messageData, client){
        const chatMessage = Message.fromNetwork(messageData, client);
        await this._provider.rpush(this._chanelMessages, chatMessage.toString());
        return chatMessage;
    }

    async getHistory(){
        const messages = await this._provider.lrange(this._chanelMessages, 0, this._historyCount);
        return await Promise.all(messages.map(async (data) => Message.fromStorage(data, this)));
    }
}

module.exports = RedisStorageService;