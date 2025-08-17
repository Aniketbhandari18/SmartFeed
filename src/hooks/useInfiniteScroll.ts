import { Dispatch, SetStateAction, useCallback, useRef } from "react";

const useInfiniteScroll = (
  isLoading: boolean,
  hasMore: boolean,
  setPage: Dispatch<SetStateAction<number>>,
  options?: { root?: Element | null; rootMargin?: string; threshold?: number }
) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { root = null, rootMargin = "0px", threshold = 0 } = options ?? {};

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading || !hasMore) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setPage((prevPage) => prevPage + 1);
          }
        },
        { root, rootMargin, threshold }
      );

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [isLoading, hasMore]
  );

  return lastElementRef;
};

export default useInfiniteScroll;
