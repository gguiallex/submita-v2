-- AlterTable
ALTER TABLE "Resposta" ADD COLUMN "revisorId" INTEGER;

-- CreateTable
CREATE TABLE "Atribuicao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "submissaoId" INTEGER NOT NULL,
    "revisorId" INTEGER NOT NULL,
    "eventoId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "notaFinal" REAL,
    "feedback" TEXT,
    "dataAtribuicao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Atribuicao_submissaoId_fkey" FOREIGN KEY ("submissaoId") REFERENCES "Submissao" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Atribuicao_revisorId_fkey" FOREIGN KEY ("revisorId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Atribuicao_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Evento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,
    "dataInicio" DATETIME,
    "dataFim" DATETIME,
    "maxRevisoresPorTrabalho" INTEGER NOT NULL DEFAULT 2,
    "maxTrabalhosPorRevisor" INTEGER NOT NULL DEFAULT 5,
    "exigirResumo" BOOLEAN NOT NULL DEFAULT true,
    "exigirPdf" BOOLEAN NOT NULL DEFAULT true,
    "submissaoAnonima" BOOLEAN NOT NULL DEFAULT false,
    "edicaoId" INTEGER NOT NULL,
    "adminId" INTEGER NOT NULL,
    CONSTRAINT "Evento_edicaoId_fkey" FOREIGN KEY ("edicaoId") REFERENCES "Edicao" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Evento_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Evento" ("adminId", "edicaoId", "id", "sigla", "titulo") SELECT "adminId", "edicaoId", "id", "sigla", "titulo" FROM "Evento";
DROP TABLE "Evento";
ALTER TABLE "new_Evento" RENAME TO "Evento";
CREATE TABLE "new_Submissao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "resumo" TEXT,
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

-- CreateIndex
CREATE UNIQUE INDEX "Atribuicao_submissaoId_revisorId_key" ON "Atribuicao"("submissaoId", "revisorId");
