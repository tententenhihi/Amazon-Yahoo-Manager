import nodemailer from 'nodemailer';

async function sendEmail(receivedEmail, body, subjectMail) {
  let transporter = nodemailer.createTransport({
    host: process.env.GMAIL_SERVICE_HOST,
    port: process.env.GMAIL_SERVICE_PORT,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER_NAME,
      pass: process.env.GMAIL_USER_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  let content = '';
  content += `
    <div style="padding: 10px; background-color: #003375">
        <div style="padding: 10px; background-color: white;">
            ${body}
        </div>
    </div>
    `;
  let mainOptions = {
    from: 'Test',
    to: receivedEmail,
    subject: subjectMail,
    html: content
  }
  await transporter.sendMail(mainOptions);
}

module.exports = {
  sendEmail
}
