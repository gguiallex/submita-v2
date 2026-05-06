-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pergunta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventoId" INTEGER NOT NULL,
    "texto" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "obrigatoria" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "opcoes" TEXT,
    CONSTRAINT "Pergunta_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Pergunta" ("eventoId", "id", "texto", "tipo") SELECT "eventoId", "id", "texto", "tipo" FROM "Pergunta";
DROP TABLE "Pergunta";
ALTER TABLE "new_Pergunta" RENAME TO "Pergunta";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
