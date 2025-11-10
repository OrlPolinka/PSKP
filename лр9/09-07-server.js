const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

let server = http.createServer((req, res) => {

    let pathname = url.parse(req.url).pathname;

    if(req.method == 'POST' && pathname == '/upload'){
        let filePath = path.join(__dirname, 'NewImage.png');
        let fileStream = fs.createWriteStream(filePath);

        req.pipe(fileStream);

        req.on('end', () => {
            res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
            res.end(`Файл MyFile.png успешно получен и сохранён как NewImage.png`);
        });

        req.on('error', err => {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`Ошибка при получении файла: ${err.message}`);
    });
    }
    else{
        res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
        res.end('Страница не найдена');
    }
}).listen(5000);

console.log('Сервер запущен на http://localhost:5000');