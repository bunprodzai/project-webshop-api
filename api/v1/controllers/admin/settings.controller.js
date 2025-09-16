const SettingGeneral = require("../../models/settings-general.model");

// [GET] /settings/general
module.exports.general = async (req, res) => {
  const setting = await SettingGeneral.find({});

  res.json({
    code: 200,
    message: "Trang cài đặt chung",
    setting: setting
  });
}

// [PATCH] /settings/general
module.exports.generalPatch = async (req, res) => {
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
  });
}