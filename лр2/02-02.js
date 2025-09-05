var http = require('http');
var fs = require('fs');

http.createServer(function(request, response){
    if(request.url == '/png'){
        const fname = './image/pic.png';
        let png = null;
        fs.stat(fname, (err, stat)=>{
            if(err){
                console.log('error: ', err);
            }
            else{
                png = fs.readFileSync(fname);
                response.writeHead(200, {'Content-Type': 'image/png', 'Content-Length': stat.size});
                response.end(png, 'binary');
            }
        })
       
    }
    else{
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end('<h1>Hello World</h1>\n');
}
}).listen(5000);

console.log('Server running at http://localhost:5000');