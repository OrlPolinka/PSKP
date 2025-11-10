const http = require('http');

let server = http.createServer((req, res) => {

    if(req.method == 'POST' && req.url == '/process'){
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try{
                let data = JSON.parse(body);
                let x = parseFloat(data.x);
                let y = parseFloat(data.y);
                let s = data.s;

                if(isNaN(x) || isNaN(y) || typeof(s) != 'string'){
                    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
                    return res.end('Ошибка: x и y должны быть числами, s — строкой');
                }

                let response = `Сервер получил x = ${x}, y = ${y}, s = ${s}`;
                res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
                res.end(response);
            } catch(err){
                res.writeHead(400, {'Content-Type': 'text/plain; charset=utf-8'});
                res.end('Ошибка: некорректный JSON');
            }
        });
    }
    else{
        res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
        res.end('Страница не найдена');
    }
}).listen(5000);

console.log('Сервер запущен на http://localhost:5000');