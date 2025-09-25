"use server";

import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({});

export async function getTitleSuggestion(feedback: string) {
  try {
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      system:
        "You are an assistant that generates short, clear, and actionable task titles.",
      prompt: `Generate a concise task title based on this feedback:\n"${feedback}"\nOnly return the title without extra explanation.`,
    });

    console.log("Generated Title:", text);
    return text;
  } catch (error) {
    console.log("Error generating title:", error);
    return "";
  }
}
