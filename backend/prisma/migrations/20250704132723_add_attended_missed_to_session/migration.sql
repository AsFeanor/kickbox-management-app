-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PrivateLessonSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "packageId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "is_postponed" BOOLEAN NOT NULL DEFAULT false,
    "postponed_to_session_id" INTEGER,
    "is_attended" BOOLEAN NOT NULL DEFAULT false,
    "is_missed" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "PrivateLessonSession_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "PrivateLessonPackage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PrivateLessonSession_postponed_to_session_id_fkey" FOREIGN KEY ("postponed_to_session_id") REFERENCES "PrivateLessonSession" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_PrivateLessonSession" ("date", "end_time", "id", "is_postponed", "packageId", "postponed_to_session_id", "start_time") SELECT "date", "end_time", "id", "is_postponed", "packageId", "postponed_to_session_id", "start_time" FROM "PrivateLessonSession";
DROP TABLE "PrivateLessonSession";
ALTER TABLE "new_PrivateLessonSession" RENAME TO "PrivateLessonSession";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
