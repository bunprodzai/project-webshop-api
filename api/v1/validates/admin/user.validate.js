// module.exports.registerPost = (req, res, next) => {
//   if(!req.body.fullName){
//     req.flash("error", `Họ tên không được để trống!`);
//     res.redirect("back");
//     return ;
//   }

//   if(!req.body.email){
//     req.flash("error", `Email không được để trống!`);
//     res.redirect("back");
//     return ;
//   }

//   if(!req.body.password){
//     req.flash("error", `Password không được để trống!`);
//     res.redirect("back");
//     return ;
//   }

//   next();
// }

module.exports.editPatch = async (req, res, next) => {
  if (req.body.fullName == '') {
    res.json({
      code: 400,
      message: "Vui lòng nhập tên"
    });
    return;
  }

  if (req.body.email == '') {
    res.json({
      code: 400,
      message: "Vui lòng nhập Email"
    });
    return;
  }

  next();
}