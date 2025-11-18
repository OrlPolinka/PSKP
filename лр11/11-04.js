const fs = require('fs');
const WebSocket = require('ws');

const wsserver = new WebSocket.Server({port: 4000, path: '/wsserver'});
wsserver.on('connection', (wss) => {
    let n = 0;

    wss.on('message', (data) => {
        console.log('on message: ', JSON.parse(data));
        let x = JSON.parse(data).client;
        wss.send(JSON.stringify({server: ++n, client: x, timestamp: new Date().toISOString()}));
    });
});
wsserver.on('error', (e) => {console.log('ws server error', e)});
console.log(`ws server: host:${wsserver.options.host}, port: ${wsserver.options.port}, path: ${wsserver.options.path}`);
