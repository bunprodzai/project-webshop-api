module.exports.generateOrd = () => {
  const length = 13;
  const characters = '0123456789';
  let randomToken = 'ORD';
  for (let i = 0; i < length; i++) {
    randomToken += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomToken;
};