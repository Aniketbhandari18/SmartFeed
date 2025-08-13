"use server";

import { Category, Sentiment } from "@prisma/client";
import { gemini } from "../gemini";

export const classifyFeedback = async (feedback: string) => {
  try {
    const prompt = `
      Given the feedback: "${feedback}", classify it and respond in JSON with two fields:
  
      1. "sentiment": should be "positive", "neutral", or "negative"
      2. "category": choose one of ["praise", "complaint", "bug_report", "feature_request", "other"]
  
      Respond ONLY in this JSON format:
      {
        "sentiment": "...",
        "category": "..."
      }
    `;

    const result = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = result.text;
    console.log("text:", text);

    if (!text) {
      throw new Error("Failed to classify feedback");
    }

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const parsed = JSON.parse(cleaned);

    const sentiment = parsed.sentiment as Sentiment;
    const category = parsed.category as Category;

    console.log("sentiment:", sentiment);
    console.log("category:", category);

    return { sentiment, category };
  } catch (error) {
    throw new Error("Error classifying feedback");
  }
};
