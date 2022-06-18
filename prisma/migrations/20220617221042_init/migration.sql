-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL,
    "isPage" BOOLEAN NOT NULL,
    "mainImageId" TEXT NOT NULL,
    CONSTRAINT "Post_mainImageId_fkey" FOREIGN KEY ("mainImageId") REFERENCES "Upload" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Upload" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimetype" TEXT NOT NULL,
    "url" TEXT,
    "postId" TEXT NOT NULL,
    CONSTRAINT "Upload_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Category" (
    "name" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "_CategoryToPost" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CategoryToPost_A_fkey" FOREIGN KEY ("A") REFERENCES "Category" ("name") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CategoryToPost_B_fkey" FOREIGN KEY ("B") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Post_mainImageId_key" ON "Post"("mainImageId");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToPost_AB_unique" ON "_CategoryToPost"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToPost_B_index" ON "_CategoryToPost"("B");
