-- CreateTable
CREATE TABLE "Member" (
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
    "not" TEXT NOT NULL,
    "yas_grubu" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
