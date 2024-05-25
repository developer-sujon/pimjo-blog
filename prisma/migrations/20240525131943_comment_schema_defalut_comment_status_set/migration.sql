/*
  Warnings:

  - The values [ARCHIVED] on the enum `CommentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CommentStatus_new" AS ENUM ('PUBLIC', 'PRIVATE');
ALTER TABLE "Comment" ALTER COLUMN "status" TYPE "CommentStatus_new" USING ("status"::text::"CommentStatus_new");
ALTER TYPE "CommentStatus" RENAME TO "CommentStatus_old";
ALTER TYPE "CommentStatus_new" RENAME TO "CommentStatus";
DROP TYPE "CommentStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "status" SET DEFAULT 'PUBLIC';
