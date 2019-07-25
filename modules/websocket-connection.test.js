const Client = require('./entities/client');
const Message = require('./entities/message')
const Connection = require('./websocket-connection');

const SocketMock = {
    _emits: [],

    on: () => {},
    request: {
        _query: {
            token: 'just.a.mock'
        }
    },
    emit: (type, data) => {
        SocketMock._emits.push({ type, data });
    },
    disconnect: () => {}
};

const ClientInst = Client.fromAuthData({username: 'tester'});

const AppMock = {
    storage: {
        findAuth: () => ClientInst,
        getHistory: () => [
            Message.fromNetwork('test message', ClientInst)
        ]
    }
};

describe('connection test', () => {
   it('isset', () => {
       expect(Connection).toBeDefined();
   });
   it('instantiate', () => {
       const instance = new Connection(SocketMock, AppMock);
       expect(instance).toBeDefined();
       expect(instance._app).toBeDefined();
       expect(instance._socket).toBeDefined();
   });
   it('check auth', async () => {
       const instance = new Connection(SocketMock, AppMock);
       await instance.checkAuth();
       expect(instance._client).toBeDefined();
       expect(SocketMock._emits).toEqual([{
           "data": [{
                   "author": "tester",
                   "text": "test message",
                   "time": expect.stringMatching(/.*/)
               }],
           "type": "history"
       }]);
   });
});