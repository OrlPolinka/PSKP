var http = require('http');
var url = require('url');
var util = require('util');
var fs = require('fs');
var ee = require('events');
var data = require('./db');
var db = new data.DB();

let requestCount = 0;
let commitCount = 0;
let stopTimer = null;
let commitInterval = null;
let statsTimer = null;
let stats = {
    start: null,
    end: null,
    requests: 0,
    commits: 0
};

function countRequest(){
    requestCount++;
    if(stats.start && !stats.end) stats.requests++;
}

function countCommit(){
    commitCount++;
    if(stats.start && !stats.end) stats.commits++;
}


process.stdin.setEncoding('utf-8');
process.stdin.on('data', line => {
    let [cmd, arg] = line.trim().split(' ');

    if (cmd === 'sd'){
        if(stopTimer) clearTimeout(stopTimer);
        if(arg){
            stopTimer = setTimeout(()=>{
                console.log('Server stoped');
                process.exit(0);
            }, parseInt(arg)*1000);
            stopTimer.unref();  //не блокирует выход
        } else{
            stopTimer = null;
        }
    }

    else if(cmd === 'sc'){
        if(commitInterval) clearInterval(commitInterval);
        if(arg) {
            commitInterval = setInterval(() => db.commit(), parseInt(arg) * 1000);
            commitInterval.unref();
        } else{
            commitInterval = null;
        }
    }

    else if(cmd === 'ss'){
        if(statsTimer) clearTimeout(statsTimer);
        if(arg){
            stats.start = new Date();
            stats.end = null;
            stats.requests = 0;
            stats.commits = 0;
            statsTimer = setTimeout(() => {
                stats.end = new Date();
            }, parseInt(arg)*1000);
            statsTimer.unref();
        }
        else{
            stats.start = null;
            stats.end = null;
            stats.requests = 0;
            stats.commits = 0;
        }
    }
});


db.on('COMMIT', countCommit);
db.on('GET', (req, res)=>{
    countRequest();
    console.log('DB.GET'); 
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(db.select()));});
db.on('POST', (req, res)=>{
    countRequest();
    console.log('DB.POST');
    req.on('data', data=>{
        let r = JSON.parse(data);
        db.insert(r);
        res.end(JSON.stringify(r));
    });
});
db.on('PUT', (req, res)=>{
    countRequest();
    console.log('DB.PUT');
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
        let r = JSON.parse(body);
        let result = db.update(r);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(result || {error: 'Not found'}));
    });
});
db.on('DELETE', (req, res)=>{
    countRequest();
    console.log('DB.DELETE');
    let query = url.parse(req.url, true).query;
    let id = parseInt(query.id);
    let result = db.delete(id);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(result || {error: 'Not found'}));
});

http.createServer(function(request, response){
    if(url.parse(request.url).pathname == '/'){
        countRequest();
        let html = fs.readFileSync('05-01.html');
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end(html);
    }
    else if(url.parse(request.url).pathname == '/api/db'){
        countRequest();
        db.emit(request.method, request, response);
    }
    else if(url.parse(request.url).pathname == '/api/ss'){
        countRequest();
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({
            start: stats.start,
            end: stats.end,
            requests: stats.requests,
            commits: stats.commits
        }));
    }
}).listen(5000);

console.log('Server running at http://localhost:5000/');
console.log('Server running at http://localhost:5000/api/ss');