import prisma from '@/lib/prisma';
import { Search, UserPlus, Trash2, Mail, Building, Users } from 'lucide-react';
import { excluirRevisorMestre } from './actions';
import FormRevisorMestre from './FormRevisorMestre';

export default async function BancaMestrePage({
    searchParams
}: {
    searchParams: Promise<{ q?: string; error?: string }>
}) {
    const { q } = await searchParams;

    const revisores = await prisma.usuario.findMany({
        where: {
            role: 'REVISOR',
            OR: [
                { nome: { contains: q || '' } },
                { email: { contains: q || '' } }
            ]
        },
        include: { 
            departamento: true, 
            especialidades: true,
            _count: { select: { revisoesAtribuidas: true } } 
        },
        orderBy: { nome: 'asc' }
    });

    const departamentos = await prisma.departamento.findMany({ orderBy: { sigla: 'asc' } });
    const temasGlobais = await prisma.tema.findMany({ orderBy: { nome: 'asc' } });

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <header className="mb-12">
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                    Banca Mestre
                </h1>
                <p className="text-slate-500 font-medium mt-3 text-lg">
                    Gestão global de especialistas e suas áreas de domínio
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lateral: Cadastro de Revisor (Client Component) */}
                <aside className="space-y-6">
                    <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl">
                        <h2 className="text-[10px] font-black text-blue-300 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <UserPlus className="w-4 h-4" /> Novo Revisor
                        </h2>
                        
                        <FormRevisorMestre 
                            departamentos={departamentos} 
                            temasGlobais={temasGlobais} 
                        />
                    </div>
                </aside>

                {/* Listagem principal */}
                <div className="lg:col-span-2 space-y-6">
                    <form method="GET" className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-ufla-blue transition-colors" />
                        <input 
                            name="q"
                            defaultValue={q}
                            placeholder="Pesquisar por nome ou e-mail..."
                            className="w-full bg-white border border-slate-200 rounded-3xl py-5 pl-14 pr-6 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-ufla-blue/10 transition-all shadow-sm"
                        />
                    </form>

                    <div className="grid gap-4">
                        {revisores.map((rev) => (
                            <div key={rev.id} className="group bg-white border border-slate-200 rounded-[2.5rem] p-6 hover:border-ufla-blue transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-5">
                                        {/* Avatar Icon */}
                                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 font-black text-xl group-hover:bg-blue-50 group-hover:text-ufla-blue transition-all">
                                            {rev.nome.charAt(0).toUpperCase()}
                                        </div>
                                        
                                        <div>
                                            <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-tight leading-tight">
                                                {rev.nome}
                                            </h3>
                                            
                                            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {rev.email}</span>
                                                <span className="flex items-center gap-1"><Building className="w-3 h-3" /> {rev.departamento?.sigla || 'S/D'}</span>
                                            </div>
                                            
                                            {/* Especialidades do Revisor - Casting para evitar erro de tipagem */}
                                            <div className="flex flex-wrap gap-1 mt-3">
                                                {(rev.especialidades as any[]).map((esp) => (
                                                    <span 
                                                        key={esp.id} 
                                                        className="bg-slate-100 text-slate-500 text-[9px] font-black px-2 py-1 rounded-lg uppercase border border-slate-200"
                                                    >
                                                        #{esp.nome}
                                                    </span>
                                                ))}
                                                {(rev.especialidades as any[]).length === 0 && (
                                                    <span className="text-[9px] font-bold text-slate-300 uppercase italic">Nenhuma especialidade</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-[9px] font-black bg-blue-50 text-ufla-blue px-3 py-1 rounded-full border border-blue-100 uppercase tracking-widest shadow-sm">
                                            {rev._count.revisoesAtribuidas} Atribuições
                                        </span>
                                        
                                        {/* Action de Exclusão */}
                                        <form action={async () => { 'use server'; await excluirRevisorMestre(rev.id); }}>
                                            <button 
                                                title={`Excluir revisor ${rev.nome}`}
                                                className="text-slate-200 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {revisores.length === 0 && (
                            <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                                <Users className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                                    Nenhum revisor encontrado
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}