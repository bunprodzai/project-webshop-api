module.exports.generateNumber = (length) => {
  const characters = '0123456789';
  let randomNumber = '';
  for (let i = 0; i < length; i++) {
    randomNumber += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomNumber;
};