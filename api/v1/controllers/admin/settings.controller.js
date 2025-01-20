const SettingGeneral = require("../../models/settings-general.model");

// [GET] /settings/general
module.exports.general = async (req, res) => {
  if (req.role.permissions.includes("settings_general")) {
    const setting = await SettingGeneral.find({});
    
    res.json({
      code: 200,
      message: "Trang cài đặt chung",
      setting: setting
    });
  } else {
    res.json({
      code: 403,
      message: "Bạn không có quyền này"
    });
    return;
  }
}

// [PATCH] /settings/general
module.exports.generalPatch = async (req, res) => {
  if (req.role.permissions.includes("settings_general")) {
    const redcord = await SettingGeneral.findOne({});

    if (redcord) {
      await SettingGeneral.updateOne({
        _id: redcord.id
      }, req.body);
    } else {
      const setting = new SettingGeneral(req.body);
      await setting.save();
    }

    res.json({
      code: 200,
      message: "Cập nhật thành công"
    })
  } else {
    res.json({
      code: 403,
      message: "Bạn không có quyền này"
    })
    return;
  }
}