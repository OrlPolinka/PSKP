const http = require('http');
const {sql, poolPromise} = require('./db');
const fs = require('fs');

const PORT = 3000;

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

let routMap = {
    faculties: {table: 'FACULTY', key: 'FACULTY'},
    pulpits: {table: 'PULPIT', key: 'PULPIT'},
    subjects: {table: 'SUBJECT', key: 'SUBJECT'},
    auditoriumstypes: {table: 'AUDITORIUM_TYPE', key: 'AUDITORIUM_TYPE'},
    auditoriums: {table: 'AUDITORIUM', key: 'AUDITORIUM'},
};

let server = http.createServer(async (req, res) => {
    let url = req.url;
    let method = req.method;

    let pool;
    try{
        pool = await poolPromise;
    } catch(e) {
        return sendJSON(res, 500, { error: 'DB connection failed: ' + e.message });
    }

    if(method == 'GET' && url == '/'){
        try{
            let html = fs.readFileSync('./index.html');
            return sendHTML(res, html);
        }
        catch (e) {
            return sendJSON(res, 500, { error: 'index.html not found' });
        }
    }
    
    if(method == 'GET'){
        let m = url.match(/^\/api\/(\w+)$/);
        if(m){
            let entity = m[1];
            let route = routMap[entity];
            if(!route){
                return sendJSON(res, 404, { error: 'Unknown entity' });
            }

            try{
                let result = await pool.request().query(`select * from ${route.table}`);
                return sendJSON(res, 200, result.recordset);
            }
            catch (e){
                return sendJSON(res, 500, { error: e.message });
            }
        }
    }

    else if(method == 'POST'){
        let m = url.match(/^\/api\/(\w+)$/);
        if(m){
            let entity = m[1];
            let route = routMap[entity];
            if(!route){
                return sendJSON(res, 404, { error: 'Unknown entity' });
            }

            try{
                let data = await parseBody(req);

                let request = pool.request();
                if(entity == 'faculties'){
                    await request
                        .input('FACULTY', sql.Char(10), data.FACULTY)
                        .input('FACULTY_NAME', sql.VarChar(50), data.FACULTY_NAME)
                        .query('insert into FACULTY (FACULTY, FACULTY_NAME) values (@FACULTY, @FACULTY_NAME)');
                } else if(entity == 'pulpits'){
                    await request
                        .input('PULPIT', sql.Char(20), data.PULPIT)
                        .input('PULPIT_NAME', sql.VarChar(100), data.PULPIT_NAME)
                        .input('FACULTY', sql.Char(10), data.FACULTY)
                        .query('insert into PULPIT (PULPIT, PULPIT_NAME, FACULTY) values (@PULPIT, @PULPIT_NAME, @FACULTY)');
                } else if (entity === 'subjects') {
                    await request
                        .input('SUBJECT', sql.Char(10), data.SUBJECT)
                        .input('SUBJECT_NAME', sql.VarChar(100), data.SUBJECT_NAME)
                        .input('PULPIT', sql.Char(20), data.PULPIT)
                        .query('insert into SUBJECT (SUBJECT, SUBJECT_NAME, PULPIT) values (@SUBJECT, @SUBJECT_NAME, @PULPIT)');
                } else if (entity === 'teachers') {
                    await request
                        .input('TEACHER', sql.Char(10), data.TEACHER)
                        .input('TEACHER_NAME', sql.VarChar(100), data.TEACHER_NAME)
                        .input('PULPIT', sql.Char(20), data.PULPIT)
                        .query('insert into TEACHER (TEACHER, TEACHER_NAME, PULPIT) values (@TEACHER, @TEACHER_NAME, @PULPIT)');
                } else if (entity === 'auditoriumstypes') {
                    await request
                        .input('AUDITORIUM_TYPE', sql.Char(10), data.AUDITORIUM_TYPE)
                        .input('AUDITORIUM_TYPENAME', sql.VarChar(30), data.AUDITORIUM_TYPENAME)
                        .query('insert into AUDITORIUM_TYPE (AUDITORIUM_TYPE, AUDITORIUM_TYPENAME) values (@AUDITORIUM_TYPE, @AUDITORIUM_TYPENAME)');
                } else if (entity === 'auditoriums') {
                    await request
                        .input('AUDITORIUM', sql.Char(20), data.AUDITORIUM)
                        .input('AUDITORIUM_TYPE', sql.Char(10), data.AUDITORIUM_TYPE)
                        .input('AUDITORIUM_CAPACITY', sql.Int, data.AUDITORIUM_CAPACITY)
                        .input('AUDITORIUM_NAME', sql.VarChar(50), data.AUDITORIUM_NAME)
                        .query('insert into AUDITORIUM (AUDITORIUM, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY, AUDITORIUM_NAME) values (@AUDITORIUM, @AUDITORIUM_TYPE, @AUDITORIUM_CAPACITY, @AUDITORIUM_NAME)');
                }
                else {
                    return sendJSON(res, 404, { error: 'Unknown entity' });
                }

                return sendJSON(res, 201, data);
            } catch(e){
                return sendJSON(res, 400, { error: e.message });
            }
        }
    }

    if(method == 'PUT'){
        let m = url.match(/^\/api\/(\w+)$/);
        if(m){
            let entity = m[1];
            let route = routMap[entity];
            if(!route){
                return sendJSON(res, 404, { error: 'Unknown entity' });
            }
            
            try{
                let data = await parseBody(req);
                let request = pool.request();

                if(entity == 'faculties'){
                    await request
                        .input('FACULTY', sql.Char(10), data.FACULTY)
                        .input('FACULTY_NAME', sql.VarChar(50), data.FACULTY_NAME)
                        .query('update FACULTY set FACULTY_NAME = @FACULTY_NAME where FACULTY = @FACULTY');
                } else if(entity == 'pulpits'){
                    await request
                        .input('PULPIT', sql.Char(20), data.PULPIT)
                        .input('PULPIT_NAME', sql.VarChar(100), data.PULPIT_NAME)
                        .input('FACULTY', sql.Char(10), data.FACULTY)
                        .query('update PULPIT set PULPIT_NAME = @PULPIT_NAME, FACULTY = @FACULTY where PULPIT = @PULPIT');
                } else if (entity === 'subjects') {
                    await request
                        .input('SUBJECT', sql.Char(10), data.SUBJECT)
                        .input('SUBJECT_NAME', sql.VarChar(100), data.SUBJECT_NAME)
                        .input('PULPIT', sql.Char(20), data.PULPIT)
                        .query('update SUBJECT set SUBJECT_NAME = @SUBJECT_NAME, PULPIT = @PULPIT where SUBJECT = @SUBJECT');
                } else if (entity === 'teachers') {
                    await request
                        .input('TEACHER', sql.Char(10), data.TEACHER)
                        .input('TEACHER_NAME', sql.VarChar(100), data.TEACHER_NAME)
                        .input('PULPIT', sql.Char(20), data.PULPIT)
                        .query('update TEACHER set TEACHER_NAME = @TEACHER_NAME, PULPIT = @PULPIT where TEACHER = @TEACHER');
                } else if (entity === 'auditoriumstypes') {
                    await request
                        .input('AUDITORIUM_TYPE', sql.Char(10), data.AUDITORIUM_TYPE)
                        .input('AUDITORIUM_TYPENAME', sql.VarChar(30), data.AUDITORIUM_TYPENAME)
                        .query('update AUDITORIUM_TYPE set AUDITORIUM_TYPENAME = @AUDITORIUM_TYPENAME where AUDITORIUM_TYPE = @AUDITORIUM_TYPE');
                } else if (entity === 'auditoriums') {
                    await request
                        .input('AUDITORIUM', sql.Char(20), data.AUDITORIUM)
                        .input('AUDITORIUM_TYPE', sql.Char(10), data.AUDITORIUM_TYPE)
                        .input('AUDITORIUM_CAPACITY', sql.Int, data.AUDITORIUM_CAPACITY)
                        .input('AUDITORIUM_NAME', sql.VarChar(50), data.AUDITORIUM_NAME)
                        .query('update AUDITORIUM set AUDITORIUM_TYPE = @AUDITORIUM_TYPE, AUDITORIUM_CAPACITY = @AUDITORIUM_CAPACITY, AUDITORIUM_NAME = @AUDITORIUM_NAME where AUDITORIUM = @AUDITORIUM');
                } 
                else {
                    return sendJSON(res, 404, { error: 'Unknown entity' });
                }

                return sendJSON(res, 201, data);
            } catch(e){
                return sendJSON(res, 400, { error: e.message });
            }               
            
        }
    }

    if(method == 'DELETE'){
        let m = url.match(/^\/api\/([^\/]+)\/(.+)$/);
        if(m){
            let entity = m[1];
            let id = decodeURIComponent(m[2]);
            let route = routMap[entity];
            if(!route){
                return sendJSON(res, 404, { error: 'Unknown entity' });
            }

            try{
                let ifblock;
                for(let i in routMap){
                    ifblock = await pool.request()
                        .input(route.key, sql.NVarChar(100), id)
                        .query(`select * from ${route.table} where ${route.key} = @${route.key}`);
                }
                if(ifblock){
                    return sendJSON(res, 200, "Нельзя удалить, так как является внешним ключом");
                }
                await pool.request()
                    .input(route.key, sql.NVarChar(100), id)
                    .query(`delete from ${route.table} where ${route.key} = @${route.key}`);

                return sendJSON(res, 200, before.recordset.length ? before.recordset : [{ deleted: id }]);
      
            }
            catch(e){
                return sendJSON(res, 500, { error: e.message });
            }
        }
    }

    return sendJSON(res, 404, { error: 'Route not found' });
}).listen(PORT);

console.log(`Server running at http://localhost:${PORT}`);