/*
  Warnings:

  - You are about to drop the column `eventoId` on the `Tema` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_EventoTemas" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_EventoTemas_A_fkey" FOREIGN KEY ("A") REFERENCES "Evento" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EventoTemas_B_fkey" FOREIGN KEY ("B") REFERENCES "Tema" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tema" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
);
INSERT INTO "new_Tema" ("id", "nome") SELECT "id", "nome" FROM "Tema";
DROP TABLE "Tema";
ALTER TABLE "new_Tema" RENAME TO "Tema";
CREATE UNIQUE INDEX "Tema_nome_key" ON "Tema"("nome");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_EventoTemas_AB_unique" ON "_EventoTemas"("A", "B");

-- CreateIndex
CREATE INDEX "_EventoTemas_B_index" ON "_EventoTemas"("B");
