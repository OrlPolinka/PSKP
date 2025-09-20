var http = require('http');
let currentState = 'norm';
const valueStates = ['norm', 'stop', 'test', 'idle'];

http.createServer(function(request, response){
    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    response.end(`<h1>Текущее состояние: ${currentState}</h1>`);
}).listen(5000);

console.log('Server running at http://localhost:5000');
console.log(`Текущее состояние: ${currentState}`);

process.stdin.setEncoding('utf-8');
process.stdin.on('readable', ()=>{
    let input = process.stdin.read();
    if(input != null){
        if(input.trim() == 'exit') {
            console.log('Завершение приложения');
            process.exit(0);}
        else if(valueStates.includes(input.trim())){
            currentState = input.trim();
            console.log(`Состояние изменено на ${currentState}`);
        }
        else{
            console.log('Некорректная команда');
        }
        process.stdout.write(`${currentState}\n`);
    }
});
