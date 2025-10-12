const sendmail = require('sendmail')();
const nodemailer = require('nodemailer');
const RECIVER = 'porlovskaya7@gmail.com';
const APP_PASSWORD = 'sqfj ddrv kues qrml'; 

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: RECIVER,
        pass: APP_PASSWORD
    }
});


function send(message){
    sendmail ({
        from: RECIVER, 
        to: RECIVER,
        subject: 'Message from m0603(sendmail)',
        html: message
    }, (err) => {
        if(err){
            console.error(`Ошибка через sendmail: ${err.message}`);

            let mailOptions = {
                from: RECIVER,
                to: RECIVER,
                subject: 'Message from m0603(nodemailer)',
                html: message
            };
            
            transporter.sendMail(mailOptions, (smtpErr, info) => {
                if(smtpErr){
                    console.error(`Ошибка через nodemailer: ${smtpErr.message}`)
                } else{
                    console.log('Сообщение отправлено успешно через nodemailer: ', info.response);
                }
            });
        } else{
            console.log(`Сообщение успешно отправлено через sendmail`);
        }
    });
}

module.exports = {send};