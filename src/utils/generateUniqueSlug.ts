import slugify from "slugify";
import prisma from "./prisma";

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
  let newSlug = `${baseSlug}-${count}`;

  while (slugSet.has(newSlug)) {
    count++;
    newSlug = `${baseSlug}-${count}`;
  }

  return newSlug;
}
