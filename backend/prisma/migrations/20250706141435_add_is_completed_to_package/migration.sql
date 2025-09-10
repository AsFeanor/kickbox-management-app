-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PrivateLessonPackage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "memberId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lesson_day_1" TEXT,
    "lesson_day_2" TEXT,
    "lesson_start_time_1" TEXT,
    "lesson_end_time_1" TEXT,
    "lesson_start_time_2" TEXT,
    "lesson_end_time_2" TEXT,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "PrivateLessonPackage_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PrivateLessonPackage" ("createdAt", "id", "lesson_day_1", "lesson_day_2", "lesson_end_time_1", "lesson_end_time_2", "lesson_start_time_1", "lesson_start_time_2", "memberId", "paid") SELECT "createdAt", "id", "lesson_day_1", "lesson_day_2", "lesson_end_time_1", "lesson_end_time_2", "lesson_start_time_1", "lesson_start_time_2", "memberId", "paid" FROM "PrivateLessonPackage";
DROP TABLE "PrivateLessonPackage";
ALTER TABLE "new_PrivateLessonPackage" RENAME TO "PrivateLessonPackage";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
