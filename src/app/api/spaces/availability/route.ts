import { getDbUserId } from "@/lib/getDbUserId";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const name = searchParams.get("name");

  if (!name || name.trim() === "") {
    return NextResponse.json({ available: false });
  }

  const dbUserId = await getDbUserId();

  const existingSpaceName = await prisma.space.findUnique({
    where: {
      name_createdById: {
        name: name.trim(),
        createdById: dbUserId,
      },
    },
  });

  return NextResponse.json({ available: !Boolean(existingSpaceName) });
}
