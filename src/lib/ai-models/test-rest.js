require("dotenv").config({ quiet: true });

async function testRest() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set (.env)");
    process.exit(1);
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log("Response Status:", res.status);
    if (data.models) {
      console.log("Models found:", data.models.map(m => m.name));
    } else {
      console.log("No models found. Response:", JSON.stringify(data));
    }
  } catch (e) {
    console.error("Fetch failed:", e.message);
  }
}

testRest();
