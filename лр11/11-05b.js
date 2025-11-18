const async = require('async');
const rpcWSC = WebSocket = require('rpc-websockets').Client;

let ws = new rpcWSC('ws://localhost:4000');
let h = (x = ws) => async.parallel({
    square: (cb) => {
        Promise.all([
            ws.call('square', [3]),
            ws.call('square', [5, 4])
        ]).then((r) => cb(null, r)).catch((e) => cb(e, null));
    },
    sum: (cb) => {
        Promise.all([
            ws.call('sum', [2]),
            ws.call('sum', [2, 4, 6, 8, 10])
        ]).then((r) => cb(null, r)).catch((e) => cb(e, null));
    },
    mul: (cb) => {
        Promise.all([
            ws.call('mul', [3]),
            ws.call('mul', [3, 5, 7, 9, 11, 13])
        ]).then((r) => cb(null, r)).catch((e) => cb(e, null));
    },
    fib: (cb) => {
        ws.login({login: 'smw', password: '777'})
        .then((login) => {
            if(login) {
                Promise.all([
                    ws.call('fib', [1]),
                    ws.call('fib', [2]),
                    ws.call('fib', [7])
                ]).then((r) => cb(null, r)).catch((e) => cb(e, null));
            }
            else cb({message1: 'login error'}, null);
        })
    },
    fact: (cb) => {
        ws.login({login: 'smw', password: '777'})
        .then((login) => {
            if(login) {
                Promise.all([
                    ws.call('fact', [0]),
                    ws.call('fact', [5]),
                    ws.call('fact', [10])
                ]).then((r) => cb(null, r)).catch((e) => cb(e, null));
            }
            else cb({message2: 'login error'}, null);
        })
    }
},
(e, r) => {
    if(e) console.log('e = ', e);
    else console.log('r = ', r);
    ws.close();
});

ws.on('open', h);