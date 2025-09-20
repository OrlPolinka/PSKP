const { request } = require('express');
var http = require('http');
let url = require('url');
var fs = require('fs');


function factorial(n, callback) {
    if (n < 0) return callback(null);
    let result = 1;
    let i = 2;

    function step() {
        if (i <= n) {
            result *= i;
            i++;
            process.nextTick(step);
        } else {
            callback(result);
        }
    }

    process.nextTick(step);
    
}

http.createServer(function(request, response){
    let parsedUrl = url.parse(request.url, true);
    let pathName = parsedUrl.pathname;
    let query = parsedUrl.query;

    if(pathName =='/') {
        let html = fs.readFileSync('./03-03.html');
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end(html);
    }
    else if(pathName == '/fact' && 'k' in query){
        let k = parseInt(query.k);
        if(isNaN(k)){
            response.writeHead(400, {'Content-Type': 'text/plain; charset=utf-8'});
            response.end('Параметр k должен быть числом');
        }
        else{
            factorial(k, (fact) => {
            if(fact == null){
                response.writeHead(400, {'Content-Type': 'text/plain; charset=utf-8'});
                response.end('Факториал не определен');
            }
            else{
                response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                response.end(JSON.stringify({k: k, fact: fact}));
            }});
        }
        
    }
    else {
        response.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
        response.end('Страница не найдена');
    }
}).listen(5000);

console.log('Server running at http://localhost:5000/')