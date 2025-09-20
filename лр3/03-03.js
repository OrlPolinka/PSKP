const { request } = require('express');
var http = require('http');
let url = require('url');
var fs = require('fs');


function factorial(n){
    if(n < 0) return null;
    else if(n == 0 || n == 1) return 1;
    else return n * factorial(n - 1);
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
            let fact = factorial(k);
            if(fact == null){
                response.writeHead(400, {'Content-Type': 'text/plain; charset=utf-8'});
                response.end('Факториал не определен');
            }
            else{
                response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                response.end(JSON.stringify({k: k, fact: fact}));
            }
        }
        
    }
    else {
        response.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
        response.end('Страница не найдена');
    }
}).listen(5000);

console.log('Server running at http://localhost:5000/')