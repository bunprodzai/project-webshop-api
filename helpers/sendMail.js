// const nodemailer = require("nodemailer");

// module.exports.sendMail = (email, subject, html) => {
//   const  transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS
//     }
//   });

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: subject,
//     html: html
//   };

//   transporter.sendMail(mailOptions, function(error, info){
//     if(error) {
//       console.log(error);
//     } else {
//       console.log("Email sent: " + info.response);
//       // do something userfull
//     }
//   });
// }

const nodemailer = require("nodemailer");

module.exports.sendMail = (email, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Bắt buộc phải là true nếu dùng port 465
    auth: {
      user: process.env.EMAIL_USER, // ví dụ: 'yourgmail@gmail.com'
      pass: process.env.EMAIL_PASS  // là App Password (16 ký tự) chứ không phải mật khẩu Gmail thường
    }
  });

  const mailOptions = {
    from: `"Bunz Web" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: html
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error("❌ Error sending email:", error);
    } else {
      console.log("✅ Email sent:", info.response);
    }
  });
};
