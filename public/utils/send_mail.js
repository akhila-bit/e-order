const nodemailer = require("nodemailer");

// const { EMAIL_SENDER, MAIL_HOST, MAIL_USER, MAIL_PASS } = process.env;
const MAIL_PASS = "uctr xyac pwzy bboi";
const MAIL_USER = "akhila.automate@gmail.com";
const MAIL_HOST = "smtp.gmail.com";
const sendEmail = async (to, subject, html) => {
  try {
    const transport = nodemailer.createTransport({
      host: MAIL_HOST,
      port: 587,
      secure: false,
      requireTLS: false,

      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transport.sendMail({
      from: "akhila",
      to,
      subject,
      html,
    });
  } catch (error) {
    console.log(error + "ghfjfhjgj");
  }
};
module.exports = sendEmail;
