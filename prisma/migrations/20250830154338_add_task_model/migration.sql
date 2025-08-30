-- CreateEnum
CREATE TYPE "public"."Priority" AS ENUM ('high', 'medium', 'low');

-- CreateEnum
CREATE TYPE "public"."TaskCategory" AS ENUM ('bug_fix', 'feature', 'UI', 'performance', 'enhancement', 'other');

-- CreateTable
CREATE TABLE "public"."Task" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "public"."Priority" NOT NULL,
    "category" "public"."TaskCategory" NOT NULL,
    "completed" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);
