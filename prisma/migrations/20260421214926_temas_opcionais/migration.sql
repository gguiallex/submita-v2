-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tema" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "eventoId" INTEGER,
    CONSTRAINT "Tema_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Tema" ("eventoId", "id", "nome") SELECT "eventoId", "id", "nome" FROM "Tema";
DROP TABLE "Tema";
ALTER TABLE "new_Tema" RENAME TO "Tema";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
