const sendMailHelper = require("../../../../helpers/sendMail");


module.exports.index = async (req, res) => {
  const { email, subject, html } = req.body;

  sendMailHelper.sendMail(email, subject, html);

  res.json({
    code: 200
  });
}