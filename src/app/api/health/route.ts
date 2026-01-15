import prisma from "@/lib/prisma";
import { qdrant } from "@/lib/qdrant";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Ping prisma
    await prisma.user.count();

    // Ping qdrant
    await qdrant.getCollections();

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      { success: false, error: "Services unhealthy" },
      { status: 503 }
    );
  }
}
