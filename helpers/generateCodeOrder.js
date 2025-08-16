// module.exports.generateOrd = () => {
//   const length = 13;
//   const characters = '0123456789';
//   let randomToken = 'ORD';
//   for (let i = 0; i < length; i++) {
//     randomToken += characters.charAt(Math.floor(Math.random() * characters.length));
//   }
//   return randomToken;
// };

module.exports.generateOrd = () => {
  const now = new Date();

  const pad = (n) => n.toString().padStart(2, '0');

  const day = pad(now.getDate());
  const month = pad(now.getMonth() + 1); // tháng bắt đầu từ 0
  const year = now.getFullYear();

  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  const orderCode = `ORD${hours}${minutes}${seconds}${day}${month}${year}`;
  return orderCode;
};