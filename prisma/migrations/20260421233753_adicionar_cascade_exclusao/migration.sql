-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Evento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,
    "edicaoId" INTEGER NOT NULL,
    "adminId" INTEGER NOT NULL,
    CONSTRAINT "Evento_edicaoId_fkey" FOREIGN KEY ("edicaoId") REFERENCES "Edicao" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Evento_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Evento" ("adminId", "edicaoId", "id", "sigla", "titulo") SELECT "adminId", "edicaoId", "id", "sigla", "titulo" FROM "Evento";
DROP TABLE "Evento";
ALTER TABLE "new_Evento" RENAME TO "Evento";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
