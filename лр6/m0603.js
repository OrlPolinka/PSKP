const sendmail = require('sendmail')();
const RECIVER = 'porlovskaya7@gmail.com';

function send(message){
    sendmail ({
        from: RECIVER,
        to: RECIVER,
        subject: 'Message from m0603',
        html: message
    }, (err, reply) => {
        if(err){
            console.error(`Ошибка: ${err.message}`);
        } else{
            console.log(`Сообщение успешно отправлено`);
        }
    });
}

module.exports = {send};