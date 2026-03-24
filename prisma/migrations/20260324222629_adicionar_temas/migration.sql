-- CreateTable
CREATE TABLE "Tema" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Tema_nome_key" ON "Tema"("nome");
