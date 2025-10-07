



import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from '@google/generative-ai'



const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = 'AIzaSyBPu5GvtZ5pA-RW5cD8OadmmdVXmeId2Qk';

async function runChat(prompt) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME })

    const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048

    }


    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        }

    ];
    const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: [

        ],
    });

    
   try {
        
        const result = await chat.sendMessage(prompt);
        const response = result.response;
        console.log("Gemini says:", response.text());
        const text = await response.text();
        return text;
    } catch (error) {
        console.error("API sorğusunda xəta baş verdi:", error);
        
        return "Üzr istəyirik, bir problem yarandı. Zəhmət olmasa, bir az sonra yenidən cəhd edin.";
    }

}
export default runChat;