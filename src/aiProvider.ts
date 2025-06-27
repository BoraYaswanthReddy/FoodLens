import { createBestAIProvider } from "@juspay/neurolink";

export const aiProvider = createBestAIProvider();

if (aiProvider) {
  (aiProvider as any).logLevel = "error";
}
