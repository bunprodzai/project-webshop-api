const SettingGeneral = require("../../models/settings-general.model");


module.exports.index = async (req, res) => {
  try {
    
    const settings = await SettingGeneral.findOne();

    res.json({
      code: 200,
      message: "Setting General",
      settings: settings
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi"
    });
  }
}