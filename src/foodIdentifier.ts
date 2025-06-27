import { AIProviderFactory } from '@juspay/neurolink';
import { uploadImage } from './imageUploader';

export async function identifyFood(image: Buffer): Promise<string> {
  const imageUrl = await uploadImage(image);

  const model = AIProviderFactory.createProvider("google-ai", "gemini-2.5-pro");

  const prompt = "Can you identify the food in the image? Just tell the name of the food without any additional information.";

  const imagePart = {
    url: imageUrl,
    temperature: 0.001,
  };

  const result = await (await model).generateText({
    prompt: prompt,
    context: [imagePart],
  } as any);

  if (!result || !result.text) {
    throw new Error("Failed to identify food from image.");
  }

  return result.text.trim();
}
