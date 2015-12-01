var nodemailer = require('nodemailer');
var credential = require('../credential/credential');

var mymail = credential();

module.exports = function(tosb){
    console.log('mymail.mymail.user='+mymail.mymail.user);
    var transporter = nodemailer.createTransport({
        service: 'QQ',
        secureConnection:true,//use SSL
        port:465,
        auth: {
            user: mymail.mymail.user,
            pass: mymail.mymail.password
        }
    });

    var fromme = mymail.mymail.user;

    return{
        send:function(tosb){ 
            var mailOptions = {
                from:fromme, 
                to: tosb, 
                subject: 'Hello',
                html: '<h1>Hello,welcome to penmanbox</h1>\n<p>ginny try to create a wonderful world for people her love!</p><p>Start your journey now!</p>' ,// html body
                generateTextFromHtml:true
            };  

            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    console.log(error);
                }else{
                    console.log('Message sent: ' + info.response);
                }
            });
        },
        emailError:function(message,filename,exception){
            var body = '<h1>pen man box has a little problem</h1>'+'message:<br><pre>'+message+'</pre><br>';
            if(exception)
                body += 'exception:<br><pre>'+exception+'</pre></br>';
            if(filename)
                body += 'filename:<br><pre>'+filename+'</pre></br>';
            var mailOptions = {
                from:fromme, 
                to: tosb, 
                subject: 'penmanbox error',
                html: body,
                generateTextFromHtml:true
            };
            transporter.sendMail(mailOptions,function(err){
                if(err)
                    console.error('Unable to send email:'+error);
            })
        }

        
    }
}