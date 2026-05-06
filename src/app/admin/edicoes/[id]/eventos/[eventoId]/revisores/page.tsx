import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft, UserPlus, Mail, Building2, Trash2 } from 'lucide-react';
// 1. CORREÇÃO: Certifique-se de que o caminho da importação está correto
import { adicionarRevisorAction } from './actions'; 

export default async function RevisoresEventoPage({
    params
}: {
    params: Promise<{ id: string, eventoId: string }>
}) {
    const { id, eventoId } = await params;

    const evento = await prisma.evento.findUnique({
        where: { id: Number(eventoId) },
        include: {
            temas: true,
            revisores: {
                include: {
                    usuario: { include: { departamento: true } },
                    temas: true
                }
            }
        }
    });

    const departamentos = await prisma.departamento.findMany();

    if (!evento) return <div className="p-8 text-center font-bold text-red-500">Evento não encontrado</div>;

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-10">
                <Link 
                    href={`/admin/edicoes/${id}/eventos/${eventoId}`}
                    className="group flex items-center gap-2 text-ufla-blue text-[10px] font-black uppercase tracking-[0.2em] mb-4 hover:text-blue-900 transition-colors"
                >
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    Voltar para o Dashboard
                </Link>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                    Corpo de Revisores
                </h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lista de Revisores */}
                <div className="lg:col-span-2 space-y-4">
                    {evento.revisores.map((revisor) => (
                        <div key={revisor.id} className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-ufla-blue font-black italic text-xl uppercase">
                                        {revisor.usuario.nome.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-800 uppercase tracking-tight">{revisor.usuario.nome}</h3>
                                        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase mt-1">
                                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {revisor.usuario.email}</span>
                                            <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {revisor.usuario.departamento?.sigla}</span>
                                        </div>
                                    </div>
                                </div>
                                {/* CORREÇÃO: Botão com título para acessibilidade */}
                                <button 
                                    title="Remover Revisor"
                                    aria-label={`Remover revisor ${revisor.usuario.nome}`}
                                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Formulário de Cadastro */}
                <aside className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl h-fit">
                    <div className="flex items-center gap-3 mb-8">
                        <UserPlus className="w-6 h-6 text-blue-400" />
                        <h2 className="text-xl font-black uppercase italic tracking-tighter">Novo Revisor</h2>
                    </div>

                    <form action={adicionarRevisorAction} className="space-y-5">
                        <input type="hidden" name="eventoId" value={eventoId} />
                        <input type="hidden" name="temasIds" value="[]" /> {/* Placeholder para o JSON de temas */}
                        
                        {/* CORREÇÃO: Labels vinculados com 'htmlFor' + ID nos inputs */}
                        <div>
                            <label htmlFor="nome" className="text-[10px] font-black uppercase tracking-widest text-blue-300 mb-2 block">
                                Nome Completo
                            </label>
                            <input 
                                id="nome"
                                name="nome" 
                                required 
                                title="Digite o nome completo do revisor"
                                placeholder="Nome do revisor"
                                className="w-full bg-white/10 border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-blue-400 transition-all text-white" 
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-blue-300 mb-2 block">
                                E-mail Institucional
                            </label>
                            <input 
                                id="email"
                                name="email" 
                                type="email" 
                                required 
                                title="Digite o e-mail institucional"
                                placeholder="email@ufla.br"
                                className="w-full bg-white/10 border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-blue-400 transition-all text-white" 
                            />
                        </div>

                        <div>
                            <label htmlFor="departamentoId" className="text-[10px] font-black uppercase tracking-widest text-blue-300 mb-2 block">
                                Departamento
                            </label>
                            <select 
                                id="departamentoId"
                                name="departamentoId" 
                                required 
                                title="Selecione o departamento"
                                className="w-full bg-white/10 border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-blue-400 transition-all text-white appearance-none"
                            >
                                <option value="" disabled className="text-slate-900">Selecione...</option>
                                {departamentos.map(d => (
                                    <option key={d.id} value={d.id} className="text-slate-900">{d.sigla}</option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-400 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg mt-4 active:scale-95">
                            Adicionar Revisor
                        </button>
                    </form>
                </aside>
            </div>
        </div>
    );
}