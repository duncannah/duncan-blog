/*
  Warnings:

  - The primary key for the `Post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Post` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new__CategoryToPost" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CategoryToPost_A_fkey" FOREIGN KEY ("A") REFERENCES "Category" ("name") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CategoryToPost_B_fkey" FOREIGN KEY ("B") REFERENCES "Post" ("slug") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__CategoryToPost" ("A", "B") SELECT "A", "B" FROM "_CategoryToPost";
DROP TABLE "_CategoryToPost";
ALTER TABLE "new__CategoryToPost" RENAME TO "_CategoryToPost";
CREATE UNIQUE INDEX "_CategoryToPost_AB_unique" ON "_CategoryToPost"("A", "B");
CREATE INDEX "_CategoryToPost_B_index" ON "_CategoryToPost"("B");
CREATE TABLE "new_Post" (
    "slug" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL,
    "isPage" BOOLEAN NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "mainImageId" TEXT,
    CONSTRAINT "Post_mainImageId_fkey" FOREIGN KEY ("mainImageId") REFERENCES "Upload" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("content", "createdAt", "isPage", "language", "mainImageId", "published", "slug", "title", "updatedAt") SELECT "content", "createdAt", "isPage", "language", "mainImageId", "published", "slug", "title", "updatedAt" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE UNIQUE INDEX "Post_mainImageId_key" ON "Post"("mainImageId");
CREATE TABLE "new_Upload" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimetype" TEXT NOT NULL,
    "url" TEXT,
    "postId" TEXT NOT NULL,
    CONSTRAINT "Upload_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("slug") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Upload" ("createdAt", "id", "mimetype", "name", "postId", "size", "updatedAt", "url") SELECT "createdAt", "id", "mimetype", "name", "postId", "size", "updatedAt", "url" FROM "Upload";
DROP TABLE "Upload";
ALTER TABLE "new_Upload" RENAME TO "Upload";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
