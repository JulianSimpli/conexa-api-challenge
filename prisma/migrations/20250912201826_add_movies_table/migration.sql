-- CreateTable
CREATE TABLE "movies" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "episode_id" INTEGER NOT NULL,
    "release_date" TEXT NOT NULL
);
