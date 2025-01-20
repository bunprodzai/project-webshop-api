
// module.exports.requireAuthAdmin = async (req, res, next) => {
//   if (req.headers.authorization) {
//     const token = req.headers.authorization.split(" ")[1];

//     const admin = await Admin.findOne({
//       deleted: false,
//       token: token
//     }).select("-password");

//     if (!admin) {
//       res.json({
//         code: 400,
//         message: "Token không hợp lệ!!"
//       })
//       return ;
//     }

//     req.admin = admin;

//     next();
//   } else {
//     res.json({
//       code: 400,
//       message: "Vui lòng gửi kèm token - Admin"
//     });
//   }
// }