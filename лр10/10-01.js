const http = require('http');
const fs = require('fs');
const url = require('url');

http.createServer((req, res) => {
    const pathname = url.parse(req.url).pathname;

    if(req.method == 'GET' && pathname == '/start'){
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(fs.readFileSync('./10-01.html'));
    }
    else{
        res.writeHead(400, {'Content-Type': 'text/plain; charset=utf-8'});
        res.end('Bad Request');
    }
}).listen(3000);

console.log('Server running at http://localhost:3000/');


const WebSocket = require('ws');
const wsserver = new WebSocket.Server({port: 4000, path: '/wsserver'});
wsserver.on('connection', (ws) => {
    let mes;
    let k = 0;
    ws.on('message', message => {
        console.log(`Received message => ${message}`);
        let parts = message.toString().split(':');
        let n = parseInt(parts[parts.length - 1].trim());
        if(!isNaN(n)){
            mes = n;
        }
    });
    setInterval(() => {ws.send(`10-01-server: ${mes} -> ${++k}`)}, 5000);
});
wsserver.on('error', (e) => {console.log('ws server error', e)});
console.log(`ws server: host:${wsserver.options.host}, port: ${wsserver.options.port}, path: ${wsserver.options.path}`);
