const http = require('http');
const MongoClient = require('mongodb').MongoClient;

const PORT = 3000;
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'BSTU';

let db, faculty, pulpit;

async function init(){
    await client.connect();
    db = client.db(dbName);
    faculty = db.collection('faculty');
    pulpit = db.collection('pulpit');
    console.log('MongoDB connected');
}
init();

let sendJSON = (res, status, data) => {
    res.writeHead(status, {'Content-Type': 'application/json; charset=utf-8'});
    res.end(JSON.stringify(data));
};

let sendHTML = (res, htmlBuffer) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(htmlBuffer);
};

let parseBody = (req) => new Promise((res, rej) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
        try { res(JSON.parse(body || '{}')); }
        catch (err) { rej(err); }
    });
});

let server = http.createServer(async (req, res) => {
    let url = req.url;
    let method = req.method;
    
    if(method == 'GET'){
        if(url == '/api/faculties'){
            try{
                let result = await faculty.find().toArray();
                return sendJSON(res, 200, result);
            }
            catch (e){
                return sendJSON(res, 500, { error: e.message });
            }
        }   
        if(url == '/api/pulpits'){
            try{
                let result = await pulpit.find().toArray();
                return sendJSON(res, 200, result);
            }
            catch (e){
                return sendJSON(res, 500, { error: e.message });
            }
        }   
    }
    else if(method == 'POST'){
        if(url == '/api/faculties'){
            try{
                let data = await parseBody(req);

                await faculty.insertOne(data);
                return sendJSON(res, 200, data);
            }
            catch (e){
                return sendJSON(res, 500, { error: e.message });
            }
        }   
        if(url == '/api/pulpits'){
            try{
                let data = await parseBody(req);

                await pulpit.insertOne(data);
                return sendJSON(res, 200, data);
            }
            catch (e){
                return sendJSON(res, 500, { error: e.message });
            }
        }   
    }
    else if(method == 'PUT'){
        if(url == '/api/faculties'){
            try{
                let data = await parseBody(req);

                await faculty.updateOne(
                    {faculty: data.faculty},
                    {$set: {faculty_name: data.faculty_name}}
                );
                return sendJSON(res, 200, data);
            }
            catch (e){
                return sendJSON(res, 500, { error: e.message });
            }
        }   
        if(url == '/api/pulpits'){
            try{
                let data = await parseBody(req);

                await pulpit.updateOne(
                    {pulpit: data.pulpit},
                    {$set: {pulpit_name: data.pulpit_name, faculty: data.faculty}}
                );
                return sendJSON(res, 200, data);
            }
            catch (e){
                return sendJSON(res, 500, { error: e.message });
            }
        }   
    }
    else if(method == 'DELETE'){
        let m = url.match(/^\/api\/(faculties|pulpits)\/(.+)$/)
        if (m) {
            let entity = m[1];
            let code = decodeURIComponent(m[2]);

            try{
                if(entity == 'faculties'){
                    let findblock = await pulpit.findOne({faculty: code});
                    if(findblock){
                        return sendJSON(res, 400, { error: 'Нельзя удалить факультет: существуют кафедры, связанные с ним' });
                    }
                    let result = await faculty.deleteOne(
                        {faculty: code}
                    );
                    return sendJSON(res, 200, { deleted: code });
                }
                if(entity == 'pulpits'){
                    
                    let result = await pulpit.deleteOne(
                        {pulpit: code}
                    );
                    return sendJSON(res, 200, { deleted: code });
                }
                
            }
            catch (e){
                return sendJSON(res, 500, { error: e.message });
            }
        }
    }

    
    return sendJSON(res, 404, { error: 'Route not found' });
}).listen(PORT);

console.log(`Server running at http://localhost:${PORT}`);