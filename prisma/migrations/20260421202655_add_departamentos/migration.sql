/*
  Warnings:

  - You are about to drop the column `nome` on the `Edicao` table. All the data in the column will be lost.
  - Added the required column `eventoId` to the `Tema` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Departamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sigla" TEXT NOT NULL,
    "descricao" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "RevisorEvento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "eventoId" INTEGER NOT NULL,
    CONSTRAINT "RevisorEvento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RevisorEvento_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Autor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "submissaoId" INTEGER NOT NULL,
    "departamentoId" INTEGER NOT NULL,
    CONSTRAINT "Autor_submissaoId_fkey" FOREIGN KEY ("submissaoId") REFERENCES "Submissao" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Autor_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "Departamento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pergunta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "texto" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "eventoId" INTEGER NOT NULL,
    CONSTRAINT "Pergunta_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Resposta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "valor" TEXT NOT NULL,
    "perguntaId" INTEGER NOT NULL,
    "submissaoId" INTEGER NOT NULL,
    CONSTRAINT "Resposta_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "Pergunta" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Resposta_submissaoId_fkey" FOREIGN KEY ("submissaoId") REFERENCES "Submissao" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_RevisorTemas" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_RevisorTemas_A_fkey" FOREIGN KEY ("A") REFERENCES "RevisorEvento" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_RevisorTemas_B_fkey" FOREIGN KEY ("B") REFERENCES "Tema" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_SubmissaoTemas" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_SubmissaoTemas_A_fkey" FOREIGN KEY ("A") REFERENCES "Submissao" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_SubmissaoTemas_B_fkey" FOREIGN KEY ("B") REFERENCES "Tema" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Edicao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ano" INTEGER NOT NULL
);
INSERT INTO "new_Edicao" ("ano", "id") SELECT "ano", "id" FROM "Edicao";
DROP TABLE "Edicao";
ALTER TABLE "new_Edicao" RENAME TO "Edicao";
CREATE UNIQUE INDEX "Edicao_ano_key" ON "Edicao"("ano");
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
    CONSTRAINT "Submissao_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Submissao" ("createdAt", "eventoId", "id", "palavrasChave", "resumo", "status", "titulo") SELECT "createdAt", "eventoId", "id", "palavrasChave", "resumo", "status", "titulo" FROM "Submissao";
DROP TABLE "Submissao";
ALTER TABLE "new_Submissao" RENAME TO "Submissao";
CREATE TABLE "new_Tema" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "eventoId" INTEGER NOT NULL,
    CONSTRAINT "Tema_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tema" ("id", "nome") SELECT "id", "nome" FROM "Tema";
DROP TABLE "Tema";
ALTER TABLE "new_Tema" RENAME TO "Tema";
CREATE TABLE "new_Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'AUTOR',
    "departamentoId" INTEGER,
    CONSTRAINT "Usuario_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "Departamento" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Usuario" ("email", "id", "nome", "role") SELECT "email", "id", "nome", "role" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Departamento_sigla_key" ON "Departamento"("sigla");

-- CreateIndex
CREATE UNIQUE INDEX "_RevisorTemas_AB_unique" ON "_RevisorTemas"("A", "B");

-- CreateIndex
CREATE INDEX "_RevisorTemas_B_index" ON "_RevisorTemas"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SubmissaoTemas_AB_unique" ON "_SubmissaoTemas"("A", "B");

-- CreateIndex
CREATE INDEX "_SubmissaoTemas_B_index" ON "_SubmissaoTemas"("B");
