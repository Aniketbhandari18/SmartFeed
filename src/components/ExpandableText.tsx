"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function ExpandableText({
  content,
  lines = 2,
}: {
  content: string;
  lines?: number;
}) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    // Check if text is overflowing (clamped)
    const checkClamped = () => {
      setIsClamped(el.scrollHeight > el.clientHeight + 1); // +1 for safety
    };

    checkClamped();
    window.addEventListener("resize", checkClamped);
    return () => window.removeEventListener("resize", checkClamped);
  }, [content]);

  return (
    <div>
      <p
        ref={textRef}
        className={`text-sm leading-relaxed ${
          isExpanded ? "" : `line-clamp-${lines}`
        }`}
      >
        {content}
      </p>

      {isClamped && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 p-0 h-auto text-primary hover:text-primary-glow font-medium text-xs"
        >
          {isExpanded ? "Show less" : "Show more"}
        </Button>
      )}
    </div>
  );
}
