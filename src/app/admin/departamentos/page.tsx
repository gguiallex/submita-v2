import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Building2, Plus, Trash2, Edit } from 'lucide-react';
import { excluirDepartamento } from './actions';

export default async function DepartamentosPage() {
    const departamentos = await prisma.departamento.findMany({
        orderBy: { sigla: 'asc' }
    });

    return (
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                        Departamentos
                    </h1>
                    <p className="text-slate-500 font-medium mt-3 text-lg">
                        Estrutura institucional da UFLA
                    </p>
                </div>

                <Link
                    href="/admin/departamentos/novo"
                    className="flex items-center gap-2 bg-ufla-blue text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-900 transition-all shadow-xl shadow-blue-100"
                >
                    <Plus className="w-4 h-4" strokeWidth={3} />
                    Novo Departamento
                </Link>
            </header>

            <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 w-32">Sigla</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Descrição Completa</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {departamentos.map((dep) => (
                            <tr key={dep.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-6">
                                    <span className="font-black text-ufla-blue italic text-lg leading-none">
                                        {dep.sigla}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-slate-600 font-bold tracking-tight">
                                    {dep.descricao}
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center justify-end gap-2">
                                        {/* Link de Edição com Acessibilidade */}
                                        <Link 
                                            href={`/admin/departamentos/editar/${dep.id}`}
                                            title="Editar Departamento"
                                            aria-label={`Editar departamento ${dep.sigla}`}
                                            className="p-3 bg-slate-100 text-slate-400 rounded-xl hover:bg-ufla-blue hover:text-white transition-all"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>

                                        {/* Botão de Exclusão usando Form Action (Padrão Server Components) */}
                                        <form action={async () => {
                                            'use server';
                                            await excluirDepartamento(dep.id);
                                        }}>
                                            <button 
                                                type="submit"
                                                title="Excluir Departamento"
                                                aria-label={`Excluir departamento ${dep.sigla}`}
                                                className="p-3 bg-slate-100 text-slate-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {departamentos.length === 0 && (
                    <div className="py-24 text-center">
                        <Building2 className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
                            Nenhum departamento cadastrado.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}