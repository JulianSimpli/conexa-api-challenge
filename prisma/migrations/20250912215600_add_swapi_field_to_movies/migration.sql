-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_movies" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "episode_id" INTEGER NOT NULL,
    "release_date" TEXT NOT NULL,
    "swapi" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_movies" ("episode_id", "id", "release_date", "title") SELECT "episode_id", "id", "release_date", "title" FROM "movies";
DROP TABLE "movies";
ALTER TABLE "new_movies" RENAME TO "movies";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
