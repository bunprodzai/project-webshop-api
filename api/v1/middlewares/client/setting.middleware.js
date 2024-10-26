const SettingGeneral = require("../../models/settings-general.model");

module.exports.settingGeneral = async (req, res, next) => {

  const setting = await SettingGeneral.findOne({});

  if (setting) {
    req.setting = setting;
  }

  next();
}