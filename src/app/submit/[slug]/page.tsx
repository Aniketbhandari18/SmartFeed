import SubmitFeedbackPage from "@/components/pages/SubmitFeedbackPage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  console.log("slug:", slug);

  return <SubmitFeedbackPage slug={slug} />;
}
