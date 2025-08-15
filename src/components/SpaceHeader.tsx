import * as motion from "motion/react-client";
import {
  Calendar,
  Copy,
  Edit3,
  MessageSquare,
  MoreHorizontal,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { Card } from "./ui/card";
import UpdateSpaceForm from "./UpdateSpaceForm";
import { Button } from "./ui/button";
import CopyButton from "./CopyButton";
import DeleteSpaceDialog from "./DeleteSpaceDialog";
import { Space } from "@prisma/client";
import prisma from "@/lib/prisma";

export default async function SpaceHeader({ space }: { space: Space }) {
  const sentimentCounts = await prisma.feedback.groupBy({
    by: ["sentiment"],
    where: { spaceId: space.id },
    _count: true,
  });

  const positiveCount = sentimentCounts.find((group) => group.sentiment === "positive")?._count ?? 0;
  const negativeCount = sentimentCounts.find((group) => group.sentiment === "negative")?._count ?? 0;
  const neutralCount = sentimentCounts.find((group) => group.sentiment === "neutral")?._count ?? 0;
  const totalCount = positiveCount + negativeCount + neutralCount;

  const formattedDate = space.createdAt.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div>
      {/* space header */}
      <Card className="rounded-lg p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 bg-gradient-card  rounded-lg border border-border shadow-card bg-gray-50">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">{space.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Created on {formattedDate}</span>
            </div>
          </div>

          {/* action button */}
          <div className="flex flex-wrap gap-3">
            <UpdateSpaceForm space={space} redirectOnSlugChange={true}>
              <motion.div whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  title="Edit Space"
                >
                  <Edit3 className="h-4 w-4" />
                  <span className="hidden sm:block">Edit Space</span>
                </Button>
              </motion.div>
            </UpdateSpaceForm>

            <CopyButton
              value={`${process.env.NEXT_PUBLIC_APP_URL}/submit/${space.slug}`}
            >
              <motion.div whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 hover:bg-green-100 hover:text-green-600 hover:border-green-300"
                  title="Copy Submission Link"
                >
                  <Copy className="h-4 w-4" />
                  <span className="hidden sm:block">Copy Submission Link</span>
                </Button>
              </motion.div>
            </CopyButton>

            <DeleteSpaceDialog id={space.id} slug={space.slug}>
              <motion.div whileTap={{ scale: 0.98 }}>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2 text-red-600 hover:bg-red-100 hover:text-red-700"
                  title="Delete Space"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:block">Delete Space</span>
                </Button>
              </motion.div>
            </DeleteSpaceDialog>
          </div>
        </div>
      </Card>

      {/* feedbackCounts */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-gray-600 text-[16px]">
                Total Feedbacks
              </div>
              <div className="font-bold text-2xl">{totalCount}</div>
            </div>
            <div className="p-2 bg-blue-100 rounded-md">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-gray-600 text-[16px]">
                Positive
              </div>
              <div className="font-bold text-2xl">{positiveCount}</div>
            </div>
            <div className="p-2 bg-green-100 rounded-md">
              <ThumbsUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-gray-600 text-[16px]">
                Negative
              </div>
              <div className="font-bold text-2xl">{negativeCount}</div>
            </div>
            <div className="p-2 bg-red-100 rounded-md">
              <ThumbsDown className="h-5 w-5 text-red-400" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-gray-600 text-[16px]">
                Neutral
              </div>
              <div className="font-bold text-2xl">{neutralCount}</div>
            </div>
            <div className="p-2 bg-amber-100 rounded-md">
              <MoreHorizontal className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
