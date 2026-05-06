import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  console.log('--- 🌱 Iniciando Seed Completa do Submita V2 ---');

  // 1. Limpeza Total (Ordem importa por causa das FKs)
  await db.resposta.deleteMany();
  await db.pergunta.deleteMany();
  await db.autor.deleteMany();
  await db.submissao.deleteMany();
  await db.revisorEvento.deleteMany();
  await db.tema.deleteMany();
  await db.evento.deleteMany();
  await db.usuario.deleteMany();
  await db.departamento.deleteMany();
  await db.edicao.deleteMany();

  console.log('-> Cadastrando Departamentos...');
  const dcc = await db.departamento.create({ data: { sigla: 'DCC', descricao: 'Dep. de Ciência da Computação' } });
  const dae = await db.departamento.create({ data: { sigla: 'DAE', descricao: 'Dep. de Administração e Economia' } });
  const dbi = await db.departamento.create({ data: { sigla: 'DBI', descricao: 'Dep. de Biologia' } });

  console.log('-> Cadastrando Usuários (Admin e Revisores)...');
  const adminGeral = await db.usuario.create({
    data: { nome: 'Heitor Orientador', email: 'heitor@ufla.br', role: 'ADMIN_GERAL', departamentoId: dcc.id },
  });

  const rev1 = await db.usuario.create({
    data: { nome: 'Dra. Ana Paula', email: 'ana.paula@ufla.br', role: 'REVISOR', departamentoId: dbi.id },
  });

  const rev2 = await db.usuario.create({
    data: { nome: 'Dr. Carlos Mendes', email: 'carlos.mendes@ufla.br', role: 'REVISOR', departamentoId: dae.id },
  });

  console.log('-> Criando Ciclo Acadêmico e Eventos...');
  const edicao2026 = await db.edicao.create({ data: { ano: 2026 } });

  const ciufla = await db.evento.create({
    data: {
      titulo: 'Congresso de Iniciação Científica da UFLA',
      sigla: 'CIUFLA',
      edicaoId: edicao2026.id,
      adminId: adminGeral.id,
    },
  });

  const conex = await db.evento.create({
    data: {
      titulo: 'Congresso de Extensão da UFLA',
      sigla: 'CONEX',
      edicaoId: edicao2026.id,
      adminId: adminGeral.id,
    },
  });

console.log('-> Criando e Vinculando Temas Globais...');
  const temasData = [
    { nome: 'Inteligência Artificial' },
    { nome: 'Sistemas de Informação' },
    { nome: 'Cafeicultura' },
    { nome: 'Educação Inclusiva' },
    { nome: 'Gestão Pública' },
  ];

  for (const t of temasData) {
    await db.tema.create({
      data: {
        nome: t.nome,
        // Ajustado de 'eventos' para 'evento' conforme o erro do seu Prisma
        evento: {
          connect: t.nome === 'Educação Inclusiva' 
            ? [{ id: conex.id }] 
            : [{ id: ciufla.id }, { id: conex.id }]
        }
      }
    });
  }

  // Pegando IDs dos temas para especialidades
  const temaIA = await db.tema.findUnique({ where: { nome: 'Inteligência Artificial' } });
  const temaGestao = await db.tema.findUnique({ where: { nome: 'Gestão Pública' } });

  console.log('-> Atribuindo Especialidades aos Revisores...');
  await db.usuario.update({
    where: { id: adminGeral.id },
    data: { especialidades: { connect: [{ id: temaIA?.id }] } }
  });

  console.log('-> Configurando Questionários (Baremas)...');
  const perguntas = [
    { texto: "Originalidade e Inovação", tipo: "NOTA", eventoId: ciufla.id, ordem: 1 },
    { texto: "Rigor Metodológico", tipo: "NOTA", eventoId: ciufla.id, ordem: 2 },
    { texto: "Relevância para a Sociedade", tipo: "NOTA", eventoId: conex.id, ordem: 1 },
    { texto: "Parecer Técnico Final", tipo: "TEXTO", eventoId: ciufla.id, ordem: 3 },
  ];

  for (const p of perguntas) {
    await db.pergunta.create({ data: p });
  }

  console.log('--- ✅ Seed Profissional Finalizado! ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });