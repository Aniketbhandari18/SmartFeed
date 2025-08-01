-- CreateTable
CREATE TABLE "public"."Space" (
    "id" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "externalLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Space_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Space_slug_key" ON "public"."Space"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Space_name_createdById_key" ON "public"."Space"("name", "createdById");

-- AddForeignKey
ALTER TABLE "public"."Space" ADD CONSTRAINT "Space_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
