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

    await qdrant.createPayloadIndex("feedbacks", {
      field_name: "id",
      field_schema: "keyword",
    });
    console.log("Created payload index for id")

    await qdrant.createPayloadIndex("feedbacks", {
      field_name: "spaceId",
      field_schema: "keyword",
    });

    console.log("Created payload index for spaceId");

    await qdrant.createPayloadIndex("feedbacks", {
      field_name: "sentiment",
      field_schema: "keyword",
    });

    console.log("Created payload index for sentiment field");

    await qdrant.createPayloadIndex("feedbacks", {
      field_name: "category",
      field_schema: "keyword",
    });

    console.log("Created payload index for category field");

    await qdrant.createPayloadIndex("feedbacks", {
      field_name: "createdAt",
      field_schema: "datetime",
    });
    
    console.log("Created payload index for createdAt field");
  } catch (e) {
    console.error(e);
  }
})();
