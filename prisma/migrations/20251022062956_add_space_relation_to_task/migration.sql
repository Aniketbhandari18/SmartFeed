-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "public"."Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
