const http = require('http');
const path = require('path');
const serverStatic = require('./m07-01');

let staticDir = path.join(__dirname, 'static');
let handler = serverStatic(staticDir);

let server = http.createServer((req, res) => {
    handler(req, res);
}).listen(5000);

console.log('Server running at http://localhost:5000/07-01.html');