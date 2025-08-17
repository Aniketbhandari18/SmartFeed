import { getDbUserId } from "@/lib/getDbUserId";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import SpaceHeader from "../SpaceHeader";
import FeedbackList from "../FeedbackList";

export default async function SpacePage({ slug }: { slug: string }) {
  const dbUserId = await getDbUserId();
  const space = await prisma.space.findUnique({
    where: {
      slug: slug,
      createdById: dbUserId,
    },
  });

  if (!space) return notFound();

  console.log(space.createdAt);

  return (
    <div className="m-2 xs:m-6">
      <div className="mb-4">
        <SpaceHeader space={space} />
      </div>
      <FeedbackList spaceId={space.id} />
    </div>
  );
}
