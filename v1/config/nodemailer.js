const { createTransport } = require("nodemailer");

const transporter = createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.NM_USER,
    pass: process.env.NM_PASS,
  },
});

module.exports = { transporter };
