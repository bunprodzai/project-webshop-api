module.exports.generateToken = () => {
  const length = 20;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomToken = '';
  for (let i = 0; i < length; i++) {
    randomToken += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomToken;
};