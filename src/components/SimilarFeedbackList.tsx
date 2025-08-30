import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ExpandableText } from "./ExpandableText";
import { ChatLoader } from "./chat/chat-loader";
import { Button } from "./ui/button";
import { CirclePlus } from "lucide-react";

type Props = {
  spaceId: string;
  feedbackId: string;
};

type similarFeedbackType = {
  id: string;
  payload: {
    content: string;
  };
};

const LIMIT = 5;

export default function SimilarFeedbackList({ spaceId, feedbackId }: Props) {
  const [similarFeedbacks, setSimilarFeedbacks] = useState<similarFeedbackType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  //fetch similar feedbacks
  useEffect(() => {
    (async () => {
      const fetchUrl = `/api/spaces/${spaceId}/feedbacks/${feedbackId}/similar?page=${page}&limit=${LIMIT}`;

      try {
        setIsLoading(true);
        const res = await axios.get(fetchUrl);
        console.log("res");
        console.log(res.data.similarFeedbacks);

        setSimilarFeedbacks((prevFeedbacks) => [
          ...prevFeedbacks,
          ...res.data.similarFeedbacks,
        ]);
        setHasMore(res.data.hasMore);
      } catch (error) {
        console.log(error);
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, [page]);

  return (
    <div className="transition-all duration-300 ease-in-out">
      <div className="mt-3 border-t border-border/60 pt-3 space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">
          Similar Feedbacks
        </h4>
        <div className="space-y-2 pl-4 border-l-2 border-border/90 ml-2">
          {similarFeedbacks.map((item) => (
            <div
              key={item.id}
              className="p-2 rounded-lg bg-muted/40 border border-border/50 text-sm text-foreground hover:bg-muted/60 transition italic"
            >
              <ExpandableText content={item.payload.content} />
            </div>
          ))}
        </div>

        {similarFeedbacks.length === 0 && !isLoading && (
          <p className="text-sm text-muted-foreground italic">
            No similar feedbacks found.
          </p>
        )}

        {isLoading && <ChatLoader />}

        {hasMore && !isLoading && (
          <Button variant="link" onClick={() => setPage((prev) => prev + 1)}>
            <CirclePlus />
            load more
          </Button>
        )}
      </div>
    </div>
  );
}
