const sendmail = require('sendmail');
const http = require('http');
var url = require('url');
const fs = require('fs');
const queryString = require('querystring');
const path = require('path');

http.createServer(function(request, response){
    if(request.method == 'GET' && url.parse(request.url).pathname == '/'){
        let html = fs.readFileSync('06-02.html');
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end(html);
    }
    else if(request.method == 'POST' && url.parse(request.url).pathname == '/'){
        let body = '';
        request.on('data', chunk => {body += chunk.toString();});
        request.on('end', () => {
            let data = queryString.parse(body);

            sendmail ({
                from: data.from,
                to: data.to,
                subject: 'Message from form',
                html: data.message
            }, (err, reply) => {
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                if(err){
                    response.end(`<h1>Ошибка: ${err.message}</h1>`);
                } else{
                    response.end(`<h1>Сообщение успешно отправлено</h1>`);
                }
            });
            
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            response.end(`<h1>OK: ${data.from}, ${data.to}, ${data.message}</h1>`)
        });
    } 
    else {
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end(`<h1>Not support</h1>`);
    }
}).listen(5000);

console.log('Server running at http://localhost:5000/');
