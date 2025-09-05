var http = require('http');
var fs = require('fs');

http.createServer(function(request, response){
    if(request.url == '/html'){
        let html = fs.readFileSync('./index.html');
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end(html);
    }
    else{
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end('<h1>Hello World</h1>\n');
    }
}).listen(5000);

console.log('Server running at http://localhost:5000');