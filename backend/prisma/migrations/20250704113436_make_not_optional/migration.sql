-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Member" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ad" TEXT NOT NULL,
    "soyad" TEXT NOT NULL,
    "cinsiyet" TEXT NOT NULL,
    "dogum_tarihi" DATETIME NOT NULL,
    "kayit_tarihi" DATETIME NOT NULL,
    "yas" INTEGER NOT NULL,
    "kilo" INTEGER NOT NULL,
    "telefon" TEXT NOT NULL,
    "ders_turu" TEXT NOT NULL,
    "ucret" INTEGER NOT NULL,
    "not" TEXT,
    "yas_grubu" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Member" ("ad", "cinsiyet", "createdAt", "ders_turu", "dogum_tarihi", "id", "kayit_tarihi", "kilo", "not", "soyad", "telefon", "ucret", "yas", "yas_grubu") SELECT "ad", "cinsiyet", "createdAt", "ders_turu", "dogum_tarihi", "id", "kayit_tarihi", "kilo", "not", "soyad", "telefon", "ucret", "yas", "yas_grubu" FROM "Member";
DROP TABLE "Member";
ALTER TABLE "new_Member" RENAME TO "Member";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
