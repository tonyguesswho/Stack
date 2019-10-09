import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});
const notify = (to, subject, message) => {
  const mailOptions = {
    from: 'stack <no-reply@stack.com>',
    to,
    subject,
    html: message
  };
  transport.sendMail(mailOptions, error => {
    if (error) {
      console.error(error);
    }
  });
};

export default notify;
