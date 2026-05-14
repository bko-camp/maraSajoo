
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testV3() {
  const genAI = new GoogleGenerativeAI("AIzaSyC_Bl9yxA_wa7HhkIzBQ-tGHX8m6vqdZaU");
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  try {
    const result = await model.generateContent("hi");
    console.log("Success:", result.response.text());
  } catch (e) {
    console.error("Failed:", e.message);
  }
}

testV3();
