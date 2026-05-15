require("dotenv").config({ quiet: true });

const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set (.env)");
    process.exit(1);
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  // Note: There isn't a direct listModels in the simple SDK wrapper sometimes, 
  // but we can try to find what works.
  console.log("Checking model availability...");
  try {
    const result = await model.generateContent("test");
    console.log("gemini-1.5-flash works!");
  } catch (e) {
    console.error("gemini-1.5-flash failed:", e.message);
  }

  try {
    const model2 = genAI.getGenerativeModel({ model: "gemini-pro" });
    await model2.generateContent("test");
    console.log("gemini-pro works!");
  } catch (e) {
    console.error("gemini-pro failed:", e.message);
  }
}

listModels();
