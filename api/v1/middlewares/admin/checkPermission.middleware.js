module.exports.checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.role || !req.role.permissions.includes(permission)) {
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền truy cập!",
      });
    }
    next();
  };
};
