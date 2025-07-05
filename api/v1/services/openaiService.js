const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getAdvice(userQuestion, products) {
  const prompt = `
Khách hỏi: "${userQuestion}"
Dưới đây là dữ liệu sản phẩm từ DB:
${JSON.stringify(products, null, 2)}
Hãy gợi ý và trả lời một cách thân thiện, ngắn gọn.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Bạn là một nhân viên tư vấn bán hàng thời trang thân thiện." },
      { role: "user", content: prompt }
    ]
  });
  return response.choices[0].message.content;
}
module.exports = { getAdvice };
