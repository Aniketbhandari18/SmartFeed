import SubmitFeedbackPage from "@/components/pages/SubmitFeedbackPage";
import { use } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  console.log("slug:", slug);

  return <SubmitFeedbackPage slug={slug} />;
}
