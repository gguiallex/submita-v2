import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Deixamos vazio para ele pegar do seu .env ou config automaticamente
const db = new PrismaClient();

async function main() {
  console.log('--- 🌱 Iniciando Seed do Submita 2.0 (TS) ---');

  const senhaHash = await bcrypt.hash('admin123', 10);
  
  console.log('-> Cadastrando administrador...');
  const adminGeral = await db.usuario.upsert({
    where: { email: 'admin@ufla.br' },
    update: {},
    create: {
      nome: 'Admin',
      email: 'admin@ufla.br',
      role: 'ADMIN_GERAL',
    },
  });

  console.log('-> Criando edição 2026/1...');
  const edicao2026 = await db.edicao.create({
    data: {
      nome: 'Primeiro Semestre 2026',
      ano: 2026,
    },
  });

  const temasNomes = ['Banco de Dados', 'IA', 'Segurança'];

  console.log('-> Cadastrando temas...');
  for (const nome of temasNomes) {
    // Verifique se no seu schema.prisma o nome é "Tema" (maiúsculo)
    // Se for, aqui no código o Prisma gera como "tema" (minúsculo)
    // @ts-ignore -> Adicione isso se o VS Code continuar reclamando, só para rodarmos o seed
    await db.tema.create({
      data: { nome },
    });
  }

  console.log('-> Vinculando evento...');
  await db.evento.create({
    data: {
      titulo: 'CIUFLA 2026',
      sigla: 'CIUFLA',
      edicaoId: edicao2026.id,
      adminId: adminGeral.id,
    },
  });

  console.log('--- ✅ Seed finalizado! ---');
}

main().catch(console.error).finally(() => db.$disconnect());