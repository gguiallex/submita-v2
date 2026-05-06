/*
  Warnings:

  - A unique constraint covering the columns `[nome]` on the table `Tema` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Tema_nome_key" ON "Tema"("nome");
