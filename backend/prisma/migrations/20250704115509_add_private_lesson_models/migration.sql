-- CreateTable
CREATE TABLE "PrivateLessonPackage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "memberId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PrivateLessonPackage_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PrivateLessonSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "packageId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "is_postponed" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "PrivateLessonSession_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "PrivateLessonPackage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
