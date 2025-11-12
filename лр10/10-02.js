const WebSocket = require('ws');

let interval;
let k = 0;
let socket = new WebSocket('ws://localhost:4000/wsserver');
socket.onopen = () => {
    console.log('socket.onopen');
    interval = setInterval(() => {
        if(socket.readyState == WebSocket.OPEN)
            socket.send(`10-01-client: ${++k}`);
    }, 3000);

    setTimeout(() => {
        clearInterval(interval);
        socket.close();
    }, 25000);
};

            
socket.onclose = (e) => {console.log('socket.onclose', e);};
socket.onmessage = (e) => {console.log('socket.onmessage', e.data);};
socket.onerror = function(error) {alert("Ошибка " + error.message);};