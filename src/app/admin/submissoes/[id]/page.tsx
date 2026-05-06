import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { salvarAvaliacao } from './actions';

export default async function AvaliarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const submissao = await prisma.submissao.findUnique({
    where: { id: Number(id) },
    include: { tema: true, evento: true }
  });

  if (!submissao) notFound();

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <a href={`/admin/eventos/${submissao.eventoId}`} className="text-ufla-blue hover:underline text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            ← Voltar para a Lista
          </a>
          <h1 className="text-4xl font-black text-slate-900 mt-2 tracking-tight uppercase italic leading-none">
            Avaliar Submissão
          </h1>
          <p className="text-slate-500 font-medium italic mt-1 text-sm">
            Protocolo: <span className="text-slate-800 font-bold">#SUB-{submissao.id.toString().padStart(4, '0')}</span>
          </p>
        </div>

        {/* Badge da Área Temática */}
        <div className="bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
          <span className="text-[10px] font-black text-slate-400 uppercase block leading-none mb-1">Área Temática</span>
          <span className="text-sm font-bold text-slate-700">{submissao.tema?.nome || 'Não definida'}</span>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-8">

        {/* COLUNA DA ESQUERDA: TRABALHO (Col-8) */}
        <div className="lg:col-span-8 space-y-6">

          {/* Informações do Texto */}
          <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-[10px] font-black text-ufla-blue uppercase tracking-widest mb-2 italic">Título do Trabalho</h2>
            <p className="text-2xl font-black text-slate-800 leading-tight mb-6">{submissao.titulo}</p>

            <h2 className="text-[10px] font-black text-ufla-blue uppercase tracking-widest mb-2 italic">Resumo Acadêmico</h2>
            <p className="text-slate-600 leading-relaxed text-justify whitespace-pre-wrap bg-slate-50 p-6 rounded-2xl border border-slate-100 font-medium mb-6">
              {submissao.resumo}
            </p>

            {/* PALAVRAS-CHAVE COMO TAGS */}
            <h2 className="text-[10px] font-black text-ufla-blue uppercase tracking-widest mb-3 italic">Palavras-chave</h2>
            <div className="flex flex-wrap gap-2">
              {submissao.palavrasChave.split(',').map((palavra, index) => (
                <span key={index} className="bg-ufla-blue/10 text-ufla-blue px-3 py-1 rounded-lg text-xs font-bold border border-ufla-blue/20">
                  {palavra.trim()}
                </span>
              ))}
            </div>
          </section>

          {/* VISUALIZADOR DE PDF (Simulado ou Real) */}
          <section className="bg-slate-800 rounded-3xl overflow-hidden shadow-inner border-4 border-slate-700">
            <div className="bg-slate-700 p-4 flex justify-between items-center">
              <span className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-ufla-blue rounded-full animate-pulse"></span>
                Visualização do Documento (PDF)
              </span>
            </div>

            <div className="aspect-[3/4] w-full bg-slate-900 flex flex-col items-center justify-center text-center p-12">
              {/* Ícone Grande de PDF */}
              <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 border border-slate-700 shadow-xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
              </div>

              <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">Arquivo: {submissao.arquivoUrl}</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8">
                O documento está disponível para download. Por motivos de segurança do servidor, a visualização direta via frame foi desabilitada.
              </p>

              <a
                href={`/uploads/${submissao.arquivoUrl}`}
                download
                className="bg-ufla-blue text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-900 transition-all shadow-lg active:scale-95"
              >
                Baixar PDF para Avaliação ↓
              </a>
            </div>
          </section>
        </div>

        {/* COLUNA DA DIREITA: AVALIAÇÃO (Col-4) */}
        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl sticky top-8 border-t-8 border-t-ufla-blue">
            <div className="text-center mb-8">
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Banca Avaliadora</h2>
              <div className="h-1 w-12 bg-ufla-blue mx-auto mt-2 rounded-full"></div>
            </div>

            <form action={salvarAvaliacao} className="space-y-5">
              <input type="hidden" name="id" value={submissao.id} />
              <input type="hidden" name="eventoId" value={submissao.eventoId} />

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Originalidade</label>
                <input
                  name="originalidade" type="number" step="0.1" min="0" max="10" placeholder="0.0"
                  className="w-full bg-transparent text-2xl font-black text-slate-800 outline-none border-b-2 border-slate-200 focus:border-ufla-blue transition-colors"
                  required
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Metodologia</label>
                <input
                  name="metodologia" type="number" step="0.1" min="0" max="10" placeholder="0.0"
                  className="w-full bg-transparent text-2xl font-black text-slate-800 outline-none border-b-2 border-slate-200 focus:border-ufla-blue transition-colors"
                  required
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Redação</label>
                <input
                  name="redacao" type="number" step="0.1" min="0" max="10" placeholder="0.0"
                  className="w-full bg-transparent text-2xl font-black text-slate-800 outline-none border-b-2 border-slate-200 focus:border-ufla-blue transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-ufla-blue text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-900 transition-all shadow-xl shadow-blue-100 mt-4 active:scale-95"
              >
                Registrar Notas →
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-[10px] text-slate-400 text-center uppercase font-black leading-tight">
                Status: <span className="text-ufla-blue italic">Aguardando Lançamento</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}