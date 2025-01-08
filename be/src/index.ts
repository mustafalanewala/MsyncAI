import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('API key not found in environment variables');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const prompt = 'Write a code for todo app with html css';

async function main() {
  try {
    const result = await model.generateContent(prompt);
    const fullText = result.response.text();

    // Gemini dont have streaming available for free so doing it manually
    // Simulating streaming by splitting the result into chunks
    const chunkSize = 500;
    for (let i = 0; i < fullText.length; i += chunkSize) {
      const chunk = fullText.slice(i, i + chunkSize);
      console.log(chunk);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  } catch (error) {
    console.error('Error generating content:', error);
  }
}

main();
