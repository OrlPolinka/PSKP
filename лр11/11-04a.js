const WebSocket = require('ws');

let x = process.argv[2].toString() || 'Client_A';

let socket = new WebSocket('ws://localhost:4000/wsserver');

socket.on('open', () => {
    socket.on('message', data => {
        console.log('on message: ', JSON.parse(data));
    });
    let k = 0;
    setInterval(() => {
        socket.send(JSON.stringify({client: x, timestamp: new Date().toISOString()}));
    }, 3000);
});

            
socket.onclose = (e) => {console.log('socket.onclose', e);};
socket.onmessage = (e) => {console.log('socket.onmessage', e.data);};
socket.onerror = function(error) {alert("Ошибка " + error.message);};