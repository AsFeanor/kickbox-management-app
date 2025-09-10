/*
  Warnings:

  - You are about to drop the `GroupPackage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "GroupPackage_memberId_categoryId_startDate_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GroupPackage";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Member" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ad" TEXT NOT NULL,
    "soyad" TEXT NOT NULL,
    "cinsiyet" TEXT NOT NULL,
    "kayit_tarihi" DATETIME NOT NULL,
    "yas" INTEGER NOT NULL,
    "kilo" INTEGER NOT NULL,
    "telefon" TEXT NOT NULL,
    "ders_turu" TEXT NOT NULL,
    "ucret" INTEGER NOT NULL,
    "not" TEXT,
    "yas_grubu" TEXT,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "payment_due_date" DATETIME,
    "last_payment_reminder" DATETIME,
    "current_package_start_date" DATETIME,
    "current_package_total_sessions" INTEGER,
    "current_package_attended_sessions" INTEGER NOT NULL DEFAULT 0,
    "package_is_active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Member" ("ad", "cinsiyet", "createdAt", "ders_turu", "id", "kayit_tarihi", "kilo", "last_payment_reminder", "not", "paid", "payment_due_date", "soyad", "telefon", "ucret", "yas", "yas_grubu") SELECT "ad", "cinsiyet", "createdAt", "ders_turu", "id", "kayit_tarihi", "kilo", "last_payment_reminder", "not", "paid", "payment_due_date", "soyad", "telefon", "ucret", "yas", "yas_grubu" FROM "Member";
DROP TABLE "Member";
ALTER TABLE "new_Member" RENAME TO "Member";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
