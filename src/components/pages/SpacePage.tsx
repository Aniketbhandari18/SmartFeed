import { getDbUserId } from "@/lib/getDbUserId";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import SpaceHeader from "../SpaceHeader";

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
    <div className="m-6">
      <SpaceHeader space={space} />
    </div>
  );
}
