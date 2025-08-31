"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Calendar,
  ThumbsUp,
  ThumbsDown,
  Mail,
  MoreHorizontal,
  FilePlus,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getNameInitials } from "@/utils/getNameInitials";
import { ExpandableText } from "./ExpandableText";
import { format, formatDistanceToNow } from "date-fns";
import SimilarFeedbackList from "./SimilarFeedbackList";
import TaskForm from "./TaskForm";
import { addTask } from "@/actions/taskActions/addTask";

interface FeedbackCardProps {
  spaceId: string
  id: string;
  content: string;
  sentiment: "positive" | "negative" | "neutral";
  createdAt: Date;
  category: string;
  userName: string;
  userEmail: string;
}

export const FeedbackCard = ({
  spaceId,
  id,
  content,
  sentiment,
  createdAt,
  category,
  userName,
  userEmail,
}: FeedbackCardProps) => {
  const [showSimilar, setShowSimilar] = useState(false);

  const getSentimentConfig = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return {
          icon: ThumbsUp,
          color: "bg-green-100 text-green-600 border-green-600",
          label: "Positive",
        };
      case "negative":
        return {
          icon: ThumbsDown,
          color: "bg-red-100 text-red-400 border-red-400",
          label: "Negative",
        };
      default:
        return {
          icon: MoreHorizontal,
          color: "bg-amber-100 text-amber-600 border-amber-600",
          label: "Neutral",
        };
    }
  };

  const sentimentConfig = getSentimentConfig(sentiment);
  const Icon = sentimentConfig.icon;

  const relativeTime = formatDistanceToNow(createdAt, { addSuffix: true });
  const absoluteTime = format(createdAt, "dd MMM yyyy, hh:mm a");

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-all duration-200 bg-card border border-border py-4">
      <CardContent className="p-0">
        {/* Header with user info and sentiment */}
        <div className="flex justify-between items-center px-4 pb-4 border-b border-border bg-card/50">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10 border-2 border-primary/10">
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {getNameInitials(userName)}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <h4 className="font-medium text-foreground text-sm">
                  {userName}
                </h4>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {userEmail}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end justify-between gap-1">
            <Badge
              variant="outline"
              className={`gap-1 text-xs ${sentimentConfig.color}`}
            >
              <Icon className="h-3 w-3" />
              {sentimentConfig.label}
            </Badge>
            <div className="flex items-center gap-1 font-semibold text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span title={absoluteTime}>{relativeTime}</span>
            </div>
          </div>
        </div>

        {/* Feedback content */}
        <div className="p-4 pb-0">
          <div className="bg-muted/30 rounded-lg p-4 border border-border/50 mb-4 italic">
            <ExpandableText content={content} />
          </div>

          <div className="flex justify-between items-center">
            <div className="">
              <Badge variant="secondary" className="text-xs">
                {category}
              </Badge>
            </div>

            <div className="flex justify-end gap-1 sm:gap-2 border-border/50">
              <TaskForm spaceId={spaceId} onSubmit={addTask}>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 text-xs"
                >
                  <FilePlus className="h-4 w-4" />
                  Create Task
                </Button>
              </TaskForm>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSimilar(!showSimilar)}
                className="flex items-center gap-1 text-xs"
              >
                <Search className="h-4 w-4" />
                {showSimilar ? "Hide Similar" : "View Similar"}
                {showSimilar ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>

          {/* Similar Feedbacks Section */}
          {showSimilar && <SimilarFeedbackList spaceId={spaceId} feedbackId={id} />}
        </div>
      </CardContent>
    </Card>
  );
};
