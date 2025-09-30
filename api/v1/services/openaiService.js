const OpenAI = require("openai");
require("dotenv").config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Hàm gọi AI
async function getAdvice(prompt) {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // hoặc "gpt-4o" nếu bạn có quyền
      messages: [
        {
          role: "system",
          content: "Bạn là nhân viên tư vấn bán hàng online, trả lời tự nhiên, ngắn gọn, thân thiện.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7, // tăng tính tự nhiên
      max_tokens: 500,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Lỗi OpenAI:", error);
    return "Xin lỗi, hiện tại hệ thống tư vấn đang bận. Bạn vui lòng thử lại sau nhé!";
  }
}

module.exports = { getAdvice };
