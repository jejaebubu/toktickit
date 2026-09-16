-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_requesterId_fkey";

-- AlterTable: ticket ownership & requester "Problem Appears Resolved" intent
ALTER TABLE "Ticket" ADD COLUMN     "ownerId" INTEGER;
ALTER TABLE "Ticket" ADD COLUMN     "requesterIndicatedResolved" BOOLEAN NOT NULL DEFAULT false;

-- Data-preserving rename (Handout §5.0 / §5.2): convert RequesterUser -> User
-- WITHOUT dropping existing Lab 2 user rows.
ALTER TABLE "RequesterUser" RENAME TO "User";
ALTER INDEX "RequesterUser_email_key" RENAME TO "User_email_key";

-- Add Lab 3 columns to the existing table.
-- passwordHash / updatedAt have NO schema default, so backfill first, then set NOT NULL
-- (avoids introducing drift-inducing defaults on the preserved rows).
ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT;
ALTER TABLE "User" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'REQUESTER';
ALTER TABLE "User" ADD COLUMN "mustChangePassword" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "User" ADD COLUMN "updatedAt" TIMESTAMP(3);

UPDATE "User" SET "passwordHash" = '' WHERE "passwordHash" IS NULL;
ALTER TABLE "User" ALTER COLUMN "passwordHash" SET NOT NULL;

UPDATE "User" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "updatedAt" IS NULL;
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET NOT NULL;

-- CreateTable
CREATE TABLE "PublicComment" (
    "id" SERIAL NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublicComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InternalNote" (
    "id" SERIAL NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InternalNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: staff queue search/filter performance (Issue #44)
CREATE INDEX "Ticket_ownerId_idx" ON "Ticket"("ownerId");
CREATE INDEX "Ticket_status_idx" ON "Ticket"("status");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicComment" ADD CONSTRAINT "PublicComment_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicComment" ADD CONSTRAINT "PublicComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalNote" ADD CONSTRAINT "InternalNote_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalNote" ADD CONSTRAINT "InternalNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;