var nodemailer = require('nodemailer');
module.exports.sendEmail = function ( to , subject , html , done) {
    return done(true); // Temp For Spamming
    nodemailer.createTransport({
        service: 'hotmail',
        auth: {
          user: 'riseuptest@hotmail.com',
          pass: 'Test123456789'
        }
    }).sendMail({
        from: 'riseuptest@hotmail.com',
        to: to ,
        subject: subject,
        html: html , 
    } , ( err , result ) => {
        if(err) {
            return done(false);
        } else {
            return done(true);
        }
    });
}