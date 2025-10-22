import SubmitFeedbackPage from "@/components/pages/SubmitFeedbackPage";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  console.log("slug:", slug);

  const space = await prisma.space.findUnique({
    where: { slug },
    select: {
      title: true,
      description: true,
      externalLink: true,
    },
  });

  if (!space) return notFound();

  return <SubmitFeedbackPage slug={slug} space={space} />;
}
