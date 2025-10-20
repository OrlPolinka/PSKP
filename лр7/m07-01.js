const fs = require('fs');
const path = require('path');

const mimeTypes = {
    html: 'text/html',
    css: 'text/css',
    js: 'text/javascript',
    png: 'image/png',
    docx: 'application/msword',
    json: 'application/json',
    xml: 'application/xml',
    mp4: 'video/mp4'
};

module.exports = function(staticRoot) {
    return function(req, res){
        if(req.method != 'GET') {
            res.writeHead(405, {'Content-Type': 'text/plain'});
            return res.end('Method not allowed');
        }

        let filePath = path.join(staticRoot, req.url);
        let ext = path.extname(filePath).slice(1);

        if(!mimeTypes[ext]) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            return res.end('File not found');
        }

        fs.readFile(filePath, (err, data) => {
            if(err) {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                return res.end('File not found');
            }

            res.writeHead(200, {'Content-Type': mimeTypes[ext]});
            res.end(data);
        });
    };
};