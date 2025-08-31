import { ApiError } from "@/lib/apiError";
import { getDbUserId } from "@/lib/getDbUserId";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ spaceId: string }> }
) {
  try {
    const { spaceId } = await params;

    const space = await prisma.space.findUnique({
      where: { id: spaceId },
    });

    if (!space) {
      throw new ApiError("Space doesn't exist", 400);
    }

    const dbUserId = await getDbUserId();
    if (space.createdById !== dbUserId) {
      throw new ApiError("Unauthorized", 401);
    }

    const tasks = await prisma.task.findMany({
      where: { spaceId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      { message: "Tasks fetched successfully", tasks: tasks },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { message: "Error fetching tasks" },
      { status: 500 }
    );
  }
}
