import { GoogleGenerativeAI } from "@google/generative-ai";

export async function identifyFood(image: Buffer): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY as string);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

  const prompt = "Can you identify the food in the image? Just tell the name of the food without any additional information.";

  const imagePart = {
    inlineData: {
      data: image.toString("base64"),
      mimeType: "image/jpeg",
    },
  };

  const result = await model.generateContent([prompt, imagePart as any]);
  const response = result.response;
  const text = response.text();

  if (!text) {
    throw new Error("Failed to identify food from image.");
  }

  return text.trim();
}