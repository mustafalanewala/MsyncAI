"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const generative_ai_1 = require("@google/generative-ai");
dotenv_1.default.config();
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error('API key not found in environment variables');
    process.exit(1);
}
const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
const prompt = 'Write a code for todo app with html css';
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield model.generateContent(prompt);
            const fullText = result.response.text();
            // Simulate streaming by splitting the result into chunks
            const chunkSize = 100; // You can adjust this size
            for (let i = 0; i < fullText.length; i += chunkSize) {
                const chunk = fullText.slice(i, i + chunkSize);
                console.log(chunk); // Print each chunk
                yield new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
            }
        }
        catch (error) {
            console.error('Error generating content:', error);
        }
    });
}
main();
