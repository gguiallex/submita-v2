import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Building2, Save, Info } from 'lucide-react';
import { salvarDepartamento } from '../../actions';

export default async function EditarDepartamentoPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    // 1. Busca os dados atuais do departamento
    const departamento = await prisma.departamento.findUnique({
        where: { id: Number(id) }
    });

    // Se não existir, retorna 404
    if (!departamento) return notFound();

    return (
        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <header className="mb-10">
                <Link 
                    href="/admin/departamentos"
                    className="group flex items-center gap-2 text-ufla-blue text-[10px] font-black uppercase tracking-[0.2em] mb-4 hover:text-blue-900 transition-colors"
                >
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    Voltar para Listagem
                </Link>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-ufla-blue text-white rounded-2xl shadow-lg shadow-blue-100">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                            Editar Departamento
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">Alterando informações de {departamento.sigla}</p>
                    </div>
                </div>
            </header>

            <form action={salvarDepartamento} className="space-y-6">
                {/* 2. CAMPO OCULTO: Essencial para a Action saber que deve dar UPDATE e não CREATE */}
                <input type="hidden" name="id" value={departamento.id} />

                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm space-y-8">
                    
                    {/* Sigla */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Sigla do Departamento
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <span className="text-slate-400 font-bold text-sm">@</span>
                            </div>
                            <input 
                                type="text" 
                                name="sigla"
                                required
                                defaultValue={departamento.sigla}
                                placeholder="Ex: DCC"
                                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-5 text-slate-900 font-bold focus:ring-2 focus:ring-ufla-blue transition-all"
                            />
                        </div>
                    </div>

                    {/* Descrição */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Descrição / Nome Completo
                        </label>
                        <textarea 
                            name="descricao"
                            required
                            rows={4}
                            defaultValue={departamento.descricao}
                            placeholder="Ex: Departamento de Ciência da Computação"
                            className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-slate-900 font-bold focus:ring-2 focus:ring-ufla-blue transition-all resize-none"
                        />
                    </div>

                    {/* Aviso de Impacto */}
                    <div className="flex items-start gap-3 bg-amber-50 p-4 rounded-2xl border border-amber-100">
                        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
                            <span className="font-bold">Atenção:</span> Ao alterar a sigla ou descrição, as mudanças serão refletidas automaticamente em todos os <span className="font-bold">autores</span> e <span className="font-bold">revisores</span> vinculados a este departamento.
                        </p>
                    </div>
                </div>

                {/* Ações */}
                <div className="flex items-center justify-end gap-4">
                    <Link 
                        href="/admin/departamentos"
                        className="px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        Descartar
                    </Link>
                    <button 
                        type="submit"
                        className="flex items-center gap-2 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-ufla-blue transition-all shadow-xl active:scale-95"
                    >
                        <Save className="w-4 h-4" />
                        Atualizar Cadastro
                    </button>
                </div>
            </form>
        </div>
    );
}