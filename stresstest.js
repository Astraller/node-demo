"use strict";
const config = require("./config");

const IO = require("socket.io-client");
const net = require("net");

const clientsCount = 100;

for (let i = 0; i < clientsCount; i++) {
    const client = new net.Socket();
    let token = null;
    client.connect(config.port.local, () => {
        const data = JSON.stringify({
            username: "Bot " + i
        });
        console.log('[net]Bot' + i + ' send:', data);
        client.write(data);
    });
    client.on('data', (data) =>{
        console.log('[net]Bot' + i + ':', data.toString());
        const netData = JSON.parse(data.toString());
        if(!netData.success){
            console.log('[net]Bot' + i + ' have a problem: ', netData.reason);
        }
        token = netData.token;
        client.destroy(); // kill client after server's response

        const url = `ws://localhost:${config.port.global}/?token=${token}`;
        const curWs = new IO.connect(url);
        curWs.on('error', (err) => {
            console.log('[net]Bot' + i + ' have a problem: ', err);
        });
        curWs.on('chatError', (err) => {
            console.log('[net]Bot' + i + ' have an internal problem: ', err);
        });
        curWs.on('connect', () => {
            console.log('[ws]Bot' + i + ':', 'connected');
            curWs.emit('message', 'hello world');
            curWs.emit('message', 'test spam');
        });
        curWs.on('message', (data) => {
            console.log('[ws]Bot' + i + ' got message:', data);
        });
        curWs.on('history', (data) => {
            console.log('[ws]Bot' + i + ' got history of messages:', data);
        });
    });
}