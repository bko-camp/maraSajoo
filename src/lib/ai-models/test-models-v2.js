require("dotenv").config({ quiet: true });

const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listAllModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set (.env)");
    process.exit(1);
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  // The SDK doesn't have a direct listModels, we need to use the REST API or Vertex
  // But wait, @google/generative-ai v0.x uses v1beta by default?

  console.log("Using API Key:", apiKey.substring(0, 10) + "...");
  
  // Try a very basic one
  const modelNames = ["gemini-1.5-flash-8b", "gemini-1.5-pro", "gemini-1.0-pro"];
  for (const name of modelNames) {
    try {
      const model = genAI.getGenerativeModel({ model: name });
      await model.generateContent("hi");
      console.log(`Model ${name} works!`);
      return;
    } catch (e) {
      console.log(`Model ${name} failed: ${e.message}`);
    }
  }
}

listAllModels();
