require("dotenv").config({ quiet: true });

const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testV3() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set (.env)");
    process.exit(1);
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  try {
    const result = await model.generateContent("hi");
    console.log("Success:", result.response.text());
  } catch (e) {
    console.error("Failed:", e.message);
  }
}

testV3();
