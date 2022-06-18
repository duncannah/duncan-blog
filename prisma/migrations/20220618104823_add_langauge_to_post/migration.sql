-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL,
    "isPage" BOOLEAN NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "mainImageId" TEXT,
    CONSTRAINT "Post_mainImageId_fkey" FOREIGN KEY ("mainImageId") REFERENCES "Upload" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("content", "createdAt", "id", "isPage", "mainImageId", "published", "slug", "title", "updatedAt") SELECT "content", "createdAt", "id", "isPage", "mainImageId", "published", "slug", "title", "updatedAt" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");
CREATE UNIQUE INDEX "Post_mainImageId_key" ON "Post"("mainImageId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
