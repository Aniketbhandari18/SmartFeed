import prisma from "@/lib/prisma";
import FeedbackForm from "../FeedbackForm";
import { notFound } from "next/navigation";

export default async function SubmitFeedbackPage({ slug }: { slug: string }) {
  const space = await prisma.space.findUnique({
    where: { slug },
    select: {
      title: true,
      description: true,
      externalLink: true,
    },
  });

  if (!space) return notFound();

  return <FeedbackForm slug={slug} space={space} />;
}
