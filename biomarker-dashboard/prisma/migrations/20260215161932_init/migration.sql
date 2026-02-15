-- CreateTable
CREATE TABLE "BiomarkerCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Biomarker" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "normalMin" REAL,
    "normalMax" REAL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Biomarker_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BiomarkerCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Reading" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "biomarkerId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "date" DATETIME NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Reading_biomarkerId_fkey" FOREIGN KEY ("biomarkerId") REFERENCES "Biomarker" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Reading_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BiomarkerCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "BiomarkerCategory_name_key" ON "BiomarkerCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Biomarker_name_key" ON "Biomarker"("name");
