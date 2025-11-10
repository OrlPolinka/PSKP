const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const xml2js = require('xml2js');
const builder = require('xmlbuilder');
const Busboy = require('busboy');
const mime = require('mime-types');

let server = http.createServer(function(req, res){
    let parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;
    let query = parsedUrl.query;

    if(req.method == 'GET'){
        if(pathname == '/connection'){
            res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
            res.end(`KeepAliveTimeout = ${server.KeepAliveTimeout}`);
        }
        else if(pathname == '/connection/set'){
            let newTimeout = parseInt(query.set);
            if (!isNaN(newTimeout)){
                server.KeepAliveTimeout = newTimeout;
                res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
                res.end(`Новое значение для KeepAliveTimeout = ${server.KeepAliveTimeout}`);
            } else{
                res.writeHead(400, {'Content-Type': 'text/plain; charset=utf-8'});
                res.end('Ошибка: параметр set должен быть числом');
            }
        }
        else if(pathname == '/headers'){
            res.setHeader('X-Custom-Header', 'Users-Server');
            res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
            let output = 'Заголовки запросов:\n';
            for(let key in req.headers){
                output += `${key}: ${req.headers[key]}\n`;
            }
            output += 'Заголовки ответов:\n';
            let resHeaders = res.getHeaders();
            for(let key in resHeaders){
                output += `${key}: ${resHeaders[key]}\n`;
            }
            res.end(output);
        }
        else if(pathname == '/parameter'){
            let x = parseFloat(query.x);
            let y = parseFloat(query.y);

            if(!isNaN(x) && !isNaN(y)){
                let output = `Сумма: ${x} + ${y} = ${x + y}\n
                    Разность: ${x} - ${y} = ${x - y}\n
                    Произведение: ${x} * ${y} = ${x * y}\n
                    Частное: ${x} / ${y} = ${x / y}\n`;
                res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
                res.end(output);
            }
            else{
                res.writeHead(400, {'Content-Type': 'text/plain; charset=utf-8'});
                res.end('Ошибка: x и y должны быть числами');
            }
        }
        else if(pathname.startsWith('/parameter/')){
            let parts = pathname.split('/');
            let x = parseFloat(parts[2]);
            let y = parseFloat(parts[3]);

            if(!isNaN(x) && !isNaN(y)){
                let output = `Сумма: ${x} + ${y} = ${x + y}\n
                    Разность: ${x} - ${y} = ${x - y}\n
                    Произведение: ${x} * ${y} = ${x * y}\n
                    Частное: ${x} / ${y} = ${x / y}\n`;
                res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
                res.end(output);
            }
            else{
                res.writeHead(400, {'Content-Type': 'text/plain; charset=utf-8'});
                res.end(`Ошибка: URI = ${pathname}`);
            }
        }
        else if(pathname == '/close'){
            res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
            res.end('Сервер закроется через 10 секунд');
            setTimeout(() => {
                server.close(() => {
                    console.log('Сервер остановлен');
                });
            }, 10000);
        }
        else if(pathname == '/socket'){
            res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
            res.end(`ip-адрес клиента: ${req.socket.remoteAddress}, порт клиента: ${req.socket.remotePort}\n
                ip-адрес сервера: ${req.socket.localAddress}, порт сервера: ${req.socket.localPort}`);
        }
        else if(pathname == '/req-data'){
            let body = '';
            let words = 0;
            req.on('data', chunk => {
                words++;
                console.log(`Получен фрагмент: ${chunk.length} символов`);
                body += chunk;
            });
            req.on('end', () => {
                res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
                res.end(`Получено сообщение длиной ${body.length} символов\nВ сообщении количество порций: ${words}`);
            });
        }
        else if(pathname == '/resp-status'){
            let code = parseInt(query.code);
            let mess = query.mess || 'нет сообщения';
            if(!isNaN(code)){
                res.writeHead(code, {'Content-Type': 'text/plain; charset=utf-8'});
                res.end(`Статус: ${code}: ${mess}`);
            }
            else{
                res.writeHead(400, {'Content-Type': 'text/plain; charset=utf-8'});
                res.end(`Ошибка: параметр code должен быть числом`);
            }
        }
        else if(pathname == '/formparameter'){
            fs.readFile('./form.html', (err, data) => {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(data);
            });
        }
        else if(pathname == '/files'){
            fs.readdir('./static', (err, files) => {
                res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'X-static-files-count': files.length });
                res.end(`Файлов в static: ${files.length}`);
            });
        }
        else if (pathname.startsWith('/files/')) {
            let filename = pathname.split('/')[2];
            if (!filename) {
                res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
                return res.end('Ошибка: имя файла не указано');
            }

            let filePath = path.join(__dirname, 'static', filename);
            let mimeType = mime.lookup(filename) || 'application/octet-stream';

            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end('Файл не найден');
                } else {
                    res.writeHead(200, { 'Content-Type': mimeType });
                    res.end(data);
                }
            });
        }
        else if(pathname == '/upload'){
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`
                <form method="POST" action="/upload" enctype="multipart/form-data">
                    <input type="file" name="file"><br>
                    <input type="submit" value="Загрузить">
                </form>
            `);
        }
    }
    else if(req.method == 'POST'){
        if(pathname == '/formparameter'){
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                let params = new URLSearchParams(body);
                let output = '';
                for(let [key, value] of params.entries()){
                    output += `${key}: ${value}\n`;
                }
                res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
                res.end(output);
            });
        }
        else if(pathname == '/json'){
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                try{
                    let data = JSON.parse(body);

                    let x = parseFloat(data.x);
                    let y = parseFloat(data.y);
                    let s = data.s;
                    let m = Array.isArray(data.m) ? data.m : [];
                    let o = data.o;

                    let response = {
                        '_comment': 'Ответ. Лабораторная работа 8/10',
                        'x_plus_y': x + y,
                        'Concatenation_s_o': s + ': ' + Object.values(o).join(', '),
                        'Length_m': m.length,
                    };

                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(response, null, 2));
                }
                catch(err){
                    res.writeHead(400, {'Content-Type': 'text/plain; charset=utf-8'});
                    res.end('Ошибка: некорректный JSON');
                }
            });
        }
        else if(pathname == '/xml'){
            let body = '';

            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                xml2js.parseString(body, {explicitArray: false}, (err, result) => {
                    if(err || !result?.request){
                        res.writeHead(400, {'Content-Type': 'text/plain; charset=utf-8'});
                        return res.end('Ошибка: некорректный XML');
                    }

                    let request = result.request;
                    let requestId = request.$?.id || 'unknown';

                    let xElements = Array.isArray(request.x) ? request.x : [request.x];
                    let xValues = xElements.map(el => el.$?.value).filter(v => v !== undefined);

                    let mElements = Array.isArray(request.m) ? request.m : [request.m];
                    let mValues = mElements.map(el => el.$?.value).filter(v => v !== undefined);

                    let numericSum = xValues.map(v => parseFloat(v))
                        .filter(v => !isNaN(v)).reduce((acc, val) => acc + val, 0);

                    let concat = mValues.join('');

                    let xmlResponse = builder.create('response')
                        .att('id', requestId)
                        .ele('sum')
                        .att('element', 'x')
                        .att('result', numericSum.toString()).up()
                        .ele('concat')
                        .att('element', 'm')
                        .att('result', concat).end({pretty: true});

                    res.writeHead(200, {'Content-Type': 'application/xml'});
                    res.end(xmlResponse);
                });
            });
        }
        else if(pathname == '/upload'){
            let busboy = Busboy({headers: req.headers});
            busboy.on('file', (fieldname, file, info) => {
                let { filename } = info;
                console.log('Получен файл:', filename);

                if (typeof filename !== 'string') {
                    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
                    return res.end('Ошибка: имя файла не определено');
                }
                
                let savePath = path.join(__dirname, 'static', filename);
                file.pipe(fs.createWriteStream(savePath));
            });
            busboy.on('finish', () => {
                res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Файл загружен');
            });
            req.pipe(busboy); 
        }
        
    }
    
}).listen(5000);

console.log('Server running at http://localhost:5000/');
