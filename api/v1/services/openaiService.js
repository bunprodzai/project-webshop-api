const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getAdvice(userQuestion, products) {
  const prompt = `
    Khách vừa hỏi: "${userQuestion}"

    Dưới đây là dữ liệu sản phẩm từ cơ sở dữ liệu:
    ${JSON.stringify(products, null, 2)}

    Yêu cầu bạn:
    1. Dựa trên câu hỏi của khách, lọc ra các sản phẩm phù hợp (có thể chọn từ nhiều danh mục nếu cần).
    2. Viết câu trả lời thân thiện, mở đầu bằng một lời chào ngắn gọn và dẫn dắt khách quan tâm.
    3. Sau phần chào, hiển thị các sản phẩm dưới dạng HTML có style cơ bản để vừa với khung chat:
      - Mỗi sản phẩm là một <div> có padding nhỏ và border nhẹ.
      - Ảnh sản phẩm có chiều rộng tối đa 100%, bo góc nhẹ.
      - Tên sản phẩm in đậm, giá hiển thị kèm giảm giá nếu có.
      - Thêm nút hoặc link "Xem chi tiết" dẫn đến link sản phẩm.
    4. Không viết thêm giải thích ngoài HTML (kết quả trả về chỉ là HTML để render trực tiếp).
    5. HTML phải gọn, dễ đọc và phù hợp khi render trong khung chat nhỏ (max width ~300px).

    Trả về kết quả duy nhất là chuỗi HTML chứa nội dung đã format sẵn.
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
