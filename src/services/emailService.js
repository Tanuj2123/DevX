const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.APP_PASSWORD,  
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

module.exports = transporter;

const sendEmail = async(to,subject,text,html)=>{
    try {
        const info = await transporter.sendMail({
        from: '"DevX Team" <tanujk389@gmail.com>', // sender address
        to: to, // list of recipients
        subject: subject, // subject line
        text: text, // plain text body
        html: html, // HTML body
    });
    } catch (err) {
        console.error("Error while sending mail:", err);
    }
}


module.exports = sendEmail;