"use client";

import { ReactNode } from "react";
import toast from "react-hot-toast";

type props = {
  value: string;
  children: ReactNode;
};

export default function CopyButton({ value, children }: props) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };

  return <span onClick={handleCopy}>{children}</span>;
}
