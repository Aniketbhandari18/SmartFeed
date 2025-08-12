import dotenv from "dotenv";
dotenv.config({ path: "../../.env.local" });

(async () => {
  const { qdrant } = await import("@/lib/qdrant");

  try {
    const res = await qdrant.createCollection("feedbacks", {
      vectors: {
        size: 3072,
        distance: "Cosine",
      },
    });
    console.log("Created collection feedbacks", res);
  } catch (e) {
    console.error(e);
  }
})();
