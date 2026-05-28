import { salvarUA } from "../actions";
import Link from "next/link";
import { ArrowLeft, Building2, Save } from "lucide-react";

export default async function NovaUAPage({
    params
}: {
    params: Promise<{ id?: string }>
}) {
    const { id } = await params;
    
    return (
        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header de Navegação */}
            <header className="mb-10">
                <Link 
                    href="/admin/unidadesAcademicas"
                    className="group flex items-center gap-2 text-ufla-blue text-[10px] font-black uppercase tracking-[0.2em] mb-4 hover:text-blue-900 transition-colors"
                >
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    Voltar para Listagem
                </Link>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                    {id ? 'Editar' : 'Novo'} Unidade Acadêmica
                </h1>
            </header>

            <form action={salvarUA} className="space-y-6">
                {/* Campo oculto para ID em caso de edição */}
                {id && <input type="hidden" name="id" value={id} />}

                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm space-y-8">
                    
                    {/* Seção da Sigla */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Sigla da Unidade Acadêmica
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <span className="text-slate-400 font-bold text-sm">@</span>
                            </div>
                            <input 
                                type="text" 
                                name="sigla"
                                required
                                placeholder="Ex: ICET, ESAL, FCSA..."
                                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-5 text-slate-900 font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-ufla-blue transition-all"
                            />
                        </div>
                        <p className="text-[9px] text-slate-400 ml-1 italic">A sigla deve ser única no sistema.</p>
                    </div>

                    {/* Seção do Nome */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Nome
                        </label>
                        <div className="relative">
                            <div className="absolute top-4 left-5 pointer-events-none">
                                <Building2 className="w-4 h-4 text-slate-300" />
                            </div>
                            <input 
                                type="text"
                                name="nome"
                                required
                                placeholder="Ex: Instituto de Ciências Exatas e Tecnológicas"
                                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-5 text-slate-900 font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-ufla-blue transition-all resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Ações do Formulário */}
                <div className="flex items-center justify-end gap-4">
                    <Link 
                        href="/admin/unidadesAcademicas"
                        className="px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        Cancelar
                    </Link>
                    <button 
                        type="submit"
                        className="flex items-center gap-2 bg-ufla-blue text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-900 transition-all shadow-xl shadow-blue-100 active:scale-95"
                    >
                        <Save className="w-4 h-4" />
                        Salvar Unidade Acadêmica
                    </button>
                </div>
            </form>
        </div>
    );
}