import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function PainelEventoPublico({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const evento = await prisma.evento.findUnique({
    where: { id: Number(id) },
    include: { edicao: true }
  });

  if (!evento) notFound();

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Banner Superior do Evento */}
      <header className="bg-ufla-blue text-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <span className="bg-ufla-green px-3 py-1 rounded-full text-xs font-bold uppercase">Inscrições Abertas</span>
          <h1 className="text-5xl font-black mt-4 tracking-tighter uppercase">{evento.sigla}</h1>
          <p className="text-xl text-blue-100 mt-2 font-medium">{evento.titulo}</p>
          <p className="text-blue-300 mt-1">{evento.edicao.ano}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto -mt-10 px-6 pb-20">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-slate-200">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4">Sobre o Evento</h2>
              <p className="text-slate-600 leading-relaxed">
                Bem-vindo ao portal de submissão do {evento.sigla}. 
                Certifique-se de que seu trabalho está formatado conforme as normas da UFLA antes de realizar o upload.
              </p>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4 text-slate-700">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">📅</div>
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400">Data Limite</p>
                    <p className="font-semibold">30 de Março, 2026</p>
                  </div>
                </div>
              </div>
            </div>

            {/* O BOTÃO QUE O HEITOR QUERIA NO DIA 19 */}
            <div className="flex flex-col justify-center items-center bg-slate-50 rounded-2xl p-8 border-2 border-dashed border-slate-200">
              <p className="text-slate-500 text-center text-sm mb-6">Pronto para enviar sua contribuição acadêmica?</p>
              <a 
                href={`/eventos/${evento.id}/submeter`}
                className="w-full bg-ufla-green text-white text-center py-4 rounded-2xl font-black text-lg hover:bg-green-700 hover:scale-105 transition shadow-lg shadow-green-100"
              >
                🚀 SUBMETER TRABALHO
              </a>
              <p className="text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-widest text-center">Formato PDF apenas</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}