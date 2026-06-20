import { BrevoClient } from "@getbrevo/brevo";

export const brevo = new BrevoClient({
  apiKey: () => {
    const key = process.env.BREVO_API_KEY;

    if (!key) {
      throw new Error("BREVO_API_KEY is not set");
    }

    return key;
  },

  timeoutInSeconds: 30,
  maxRetries: 3,
});