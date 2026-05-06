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
    CONSTRAINT "Pergunta_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Pergunta" ("eventoId", "id", "obrigatoria", "opcoes", "ordem", "texto", "tipo") SELECT "eventoId", "id", "obrigatoria", "opcoes", "ordem", "texto", "tipo" FROM "Pergunta";
DROP TABLE "Pergunta";
ALTER TABLE "new_Pergunta" RENAME TO "Pergunta";
CREATE TABLE "new_Submissao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "resumo" TEXT NOT NULL,
    "palavrasChave" TEXT NOT NULL,
    "arquivoUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SUBMETIDO',
    "mediaFinal" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventoId" INTEGER NOT NULL,
    CONSTRAINT "Submissao_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Submissao" ("arquivoUrl", "createdAt", "eventoId", "id", "mediaFinal", "palavrasChave", "resumo", "status", "titulo") SELECT "arquivoUrl", "createdAt", "eventoId", "id", "mediaFinal", "palavrasChave", "resumo", "status", "titulo" FROM "Submissao";
DROP TABLE "Submissao";
ALTER TABLE "new_Submissao" RENAME TO "Submissao";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
