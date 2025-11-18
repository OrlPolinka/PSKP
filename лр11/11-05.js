const rpcWSS = require('rpc-websockets').Server;

let server = new rpcWSS({port: 4000, host: 'localhost'});

server.setAuth((l) => {
    return (l.login == 'smw' && l.password == '777');
});

server.register('sum', (params) => {
    let sum = 0;
    for(let i = 0; i < params.length; i++){
        let s = parseFloat(params[i]);
        if(!isNaN(s)){
            sum += s;
        }
    };
    return sum;
}).public();

server.register('square', (params) => {
    if(params.length == 1){
        let r = parseFloat(params[0]);
        if(!isNaN(r)){
            return Math.PI * r * r;
        }
        else{
            throw new Error('Invalid radius');
        }
    }
    else if(params.length == 2){
        let a = parseFloat(params[0]);
        let b = parseFloat(params[1]);
        if(!isNaN(a) && !isNaN(b)){
            return a * b;
        }
        else{
            throw new Error('Invalid parameters');
        }
    }
    else {
        throw new Error('Incorrect number of parameters')
    }
}).public();

server.register('mul', (params) => {
    let mul = 1;
    for(let i = 0; i < params.length; i++){
        let s = parseFloat(params[i]);
        if(!isNaN(s)){
            mul *= s;
        }
    };
    return mul;
}).public();

server.register('fib', (params) => {
    if(params.length > 1){
        throw new Error('Incorrect number of parameters');
    }

    let n = parseInt(params[0]);
    if(!isNaN(n)){
        let arr = [];
        for(let i = 0; i < n; i++){
            if(i == 0) arr.push(0);
            else if(i == 1) arr.push(1);
            else arr.push(arr[i - 1] + arr[i - 2]);
        };
        return arr;
    }
    else{
        throw new Error('Invalid parameter');
    }
    
}).protected();

server.register('fact', (params) => {
    if(params.length > 1){
        throw new Error('Incorrect number of parameters');
    }

    let n = parseInt(params[0]);
    if(!isNaN(n)){
        if(n == 0 || n == 1) return 1;
        let res = 1;
        for(let i = 2; i <= n; i++){
            res *= i;
        };
        return res;
    }
    else{
        throw new Error('Invalid parameter');
    }
    
}).protected();