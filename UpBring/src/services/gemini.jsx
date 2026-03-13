import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function analyzeCandidate(text) {
  // 1. Configure the model with JSON MimeType
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const prompt = `
    Analyze the provided Resume and GitHub README content.
    Return a JSON object with this structure:
    {
      "profile": { "name": "" },
      "institution": "",
      "skills": [{ "skill": "", "proficiency": 0-10 }],
      "showcase": [{ "title": "", "description": "" }],
      "suitable_roles": []
    }
    Content: ${text}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const output = response.text();
    console.log("Raw Gemini Output:", output);

    return JSON.parse(output);

  } catch (error) {
    // 2. Specific handling for Rate Limits
    if (error.message?.includes("429") || error.status === 429) {
      console.error("RATE LIMIT EXCEEDED: You've sent too many requests. Wait 60 seconds.");
      throw new Error("API_LIMIT"); // Throw a specific string to catch in App.jsx
    }

    console.error("Gemini Error:", error);
    return {
      profile: { name: "Error" },
      institution: "",
      skills: [],
      showcase: [],
      suitable_roles: []
    };
  }
}