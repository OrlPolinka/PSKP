var http = require('http');
var fs = require('fs');


http.createServer(function(request, response){
    if(request.url == '/api/name'){
       
        response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
        response.end('Орловская Полина Валерьевна');
    }
        
    else{
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end('<h1>Hello World</h1>\n');
    }
}).listen(5000);

console.log('Server running at http://localhost:5000');