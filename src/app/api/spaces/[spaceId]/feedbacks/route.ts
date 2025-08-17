import { ApiError } from "@/lib/apiError";
import { getDbUserId } from "@/lib/getDbUserId";
import prisma from "@/lib/prisma";
import { Sentiment } from "@prisma/client";
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

    const searchParams = request.nextUrl.searchParams;
    const sentiment = searchParams.get("sentiment") ?? "all";
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");

    if (!["all", "positive", "negative", "neutral"].includes(sentiment)) {
      throw new ApiError("Invalid sentiment", 400);
    }

    const result = await prisma.feedback.findMany({
      where: {
        spaceId,
        ...(sentiment !== "all" ? { sentiment: sentiment as Sentiment } : {}),
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit + 1, // +1 to calculate hasMore field
    });

    const hasMore = result.length === limit + 1;
    const feedbacks = result.slice(0, limit);

    return NextResponse.json({
      message: "Feedback fetched successfully",
      feedbacks,
      hasMore,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
