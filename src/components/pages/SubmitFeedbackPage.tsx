"use client";

import { useState } from "react";
import FeedbackForm from "../FeedbackForm";
import { Space } from "@prisma/client";

type props = {
  slug: string;
  space: Pick<Space, "title" | "description" | "externalLink">;
};

export default function SubmitFeedbackPage({ slug, space }: props) {
  const [submitted, setSubmitted] = useState(false);

  if (!submitted) {
    return (
      <FeedbackForm slug={slug} space={space} setSubmitted={setSubmitted} />
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center pb-8">
      <div className="flex flex-col items-center">
        <div className="bg-emerald-500 rounded-full mb-3 p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-19 w-19 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <p className="text-2xl font-bold">Feedback Submitted</p>
        <p className="text-lg text-muted-foreground text-center">
          Thanks for sharing your feedback with us
        </p>
      </div>
    </div>
  );
}
