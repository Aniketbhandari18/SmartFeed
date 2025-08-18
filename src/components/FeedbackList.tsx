"use client";

import { Feedback, Sentiment } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { FeedbackCard } from "./FeedbackCard";
import Loader from "./Loader";

type props = {
  spaceId: string;
  sentiment?: Sentiment | "all";
};

export default function FeedbackList({ spaceId }: props) {
  const LIMIT = 20;

  const [sentiment, setSentiment] = useState<Sentiment | "all">("all");
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const lastElementRef = useInfiniteScroll(isLoading, hasMore, setPage, {
    rootMargin: "200px",
  });

  useEffect(() => {
    (async () => {
      const fetchUrl = `/api/spaces/${spaceId}/feedbacks?sentiment=${sentiment}&page=${page}&limit=${LIMIT}`;

      try {
        setIsLoading(true);
        const res = await axios.get(fetchUrl);
        console.log(res);
        setFeedbacks((prevFeedbacks) => [
          ...prevFeedbacks,
          ...res.data.feedbacks,
        ]);
        setHasMore(res.data.hasMore);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, [sentiment, page]);

  useEffect(() => {
    setFeedbacks([]);
    setHasMore(true);
    setPage(1);
  }, [sentiment]);

  return (
    <div>
      {/* filter feedbacks by sentiment */}
      <div className="flex items-center gap-4">
        <div className="font-semibold">Filter by sentiment:</div>
        <Select
          onValueChange={(value) => setSentiment(value as Sentiment | "all")}
          defaultValue="all"
        >
          <SelectTrigger className="bg-white font-semibold text-gray-600">
            <SelectValue placeholder="Select sentiment" />
          </SelectTrigger>
          <SelectContent className="font-semibold">
            <SelectGroup>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="positive">Positive</SelectItem>
              <SelectItem value="negative">Negative</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* feedback list */}
      <div className="mt-4 space-y-4">
        {feedbacks.map((feedback, index) => (
          <div
            key={feedback.id}
            ref={index == feedbacks.length - 1 ? lastElementRef : undefined}
          >
            <FeedbackCard
              id={feedback.id}
              content={feedback.content}
              sentiment={feedback.sentiment}
              createdAt={feedback.createdAt}
              category={feedback.category}
              userName={feedback.userName}
              userEmail={feedback.userEmail}
            />
          </div>
        ))}
      </div>

      {/* loader */}
      {isLoading && <Loader className="mt-10" />}
    </div>
  );
}
