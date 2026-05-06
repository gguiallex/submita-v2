-- CreateTable
CREATE TABLE "_UsuarioEspecialidades" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_UsuarioEspecialidades_A_fkey" FOREIGN KEY ("A") REFERENCES "Tema" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UsuarioEspecialidades_B_fkey" FOREIGN KEY ("B") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_UsuarioEspecialidades_AB_unique" ON "_UsuarioEspecialidades"("A", "B");

-- CreateIndex
CREATE INDEX "_UsuarioEspecialidades_B_index" ON "_UsuarioEspecialidades"("B");
