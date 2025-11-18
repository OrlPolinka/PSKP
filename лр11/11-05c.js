const async = require('async');
const rpcWSC = WebSocket = require('rpc-websockets').Client;

let ws = new rpcWSC('ws://localhost:4000');

ws.on('open', async() => {
    let login = await ws.login({login: 'smw', password: '777'});
    if(!login) throw new Error('Authorization failed');

    let [
        sq1,
        sq2,
        m1,
        f1,
        m2
    ] = await Promise.all([
        ws.call('square', [3]),
        ws.call('square', [5, 4]),
        ws.call('mul', [3, 5, 7, 9, 11, 13]),
        ws.call('fib', [7]),
        ws.call('mul', [2, 4, 6])
    ]);

    console.log(`square(3) = ${sq1}\n
                square(5,4) = ${sq2}\n
                mul(3,5,7,9,11,13) = ${m1}\n
                fib(7) = ${f1}\n
                mul(2,4,6) = ${m2}`);
    
    let s1 = await ws.call('sum', [sq1, sq2, m1]);
    console.log(`sum(square(3), square(5,4), mul(3,5,7,9,11,13)) = sum(${sq1}, ${sq2}, ${m1}) = ${s1}`);
    console.log(`fib(7) * mul(2,4,6) = ${f1[f1.length - 1]} * ${m2} = ${f1[f1.length - 1] * m2}`);
    console.log(`sum(square(3), square(5,4), mul(3,5,7,9,11,13)) + fib(7) * mul(2,4,6) = 
                ${s1} + ${f1[f1.length - 1] * m2} = ${s1 + f1[f1.length - 1] * m2}`);
});