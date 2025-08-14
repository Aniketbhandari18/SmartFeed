import prisma from "@/lib/prisma";
import slugify from "slugify";

export async function generateUniqueSlug(name: string) {
  const baseSlug = slugify(name, { lower: true, strict: true });

  const existingSlugs = await prisma.space.findMany({
    where: {
      slug: {
        startsWith: baseSlug,
      },
    },
    select: {
      slug: true,
    },
  });

  if (!existingSlugs.length) return baseSlug;

  const slugSet = new Set(existingSlugs.map((s) => s.slug));
  let count = 1;
  let newSlug = baseSlug;

  while (slugSet.has(newSlug)) {
    count++;
    newSlug = `${baseSlug}-${count}`;
  }

  return newSlug;
}
