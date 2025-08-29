import { ApiError } from "@/lib/apiError";
import { getDbUserId } from "@/lib/getDbUserId";
import prisma from "@/lib/prisma";
import { qdrant } from "@/lib/qdrant";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ spaceId: string; feedbackId: string }> }
) {
  try {
    const { spaceId, feedbackId } = await params;

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
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "5");

    const feedback = await qdrant.retrieve("feedbacks", {
      ids: [feedbackId],
      with_vector: true,
      with_payload: false,
    });

    // get similar feedbacks
    const result = await qdrant.query("feedbacks", {
      query: feedback[0].vector,
      offset: (page - 1) * limit,
      limit: limit + 1, // +1 to calculate hasMore field
      filter: {
        must: [
          {
            key: "spaceId",
            match: { value: spaceId },
          },
        ],
        must_not: [
          {
            key: "id",
            match: { value: feedbackId },
          },
        ],
      },
      score_threshold: 0.8,
      with_payload: {
        include: ["content"],
      },
    });

    const hasMore = result.points.length === limit + 1;
    const similarFeedbacks = result.points.slice(0, limit);

    return NextResponse.json(
      {
        message: "Similar feedbacks fetched successfully",
        similarFeedbacks,
        hasMore,
      },
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

    return NextResponse.json({ message: "Error occurred" }, { status: 500 });
  }
}
