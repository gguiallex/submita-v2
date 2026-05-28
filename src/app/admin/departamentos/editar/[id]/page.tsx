import prisma from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Building2, Save } from 'lucide-react';
import { salvarDepartamento } from '../../actions';

export default async function EditarDepartamentoPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const departamento = await prisma.departamento.findUnique({
        where: { id: Number(id) },
        include: {
            UnidadeAcademica: true,
        }
    });

    if (!departamento) {
        return notFound();
    }

    const unidadesAcademicas = await prisma?.unidadeAcademica.findMany({
        orderBy: { sigla: 'asc' }
    });

    return (
        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-10">
                <Link
                    href="/admin/departamentos"
                    className="group flex items-center gap-2 text-ufla-blue text-[10px] font-black uppercase tracking-[0.2em] mb-4 hover:text-blue-900 transition-colors"
                >
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    Voltar para Listagem
                </Link>

                <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                    Editar Departamento
                </h1>
            </header>

            <form action={salvarDepartamento} className="space-y-6">
                <input type="hidden" name="id" value={departamento.id} />

                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm space-y-8">

                    {/* SIGLA */}
                    <div className="space-y-2">
                        <label
                            htmlFor="sigla"
                            className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Sigla do Departamento
                        </label>

                        <input
                            id='sigla'
                            type="text"
                            name="sigla"
                            defaultValue={departamento.sigla}
                            required
                            className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-slate-900 font-bold focus:ring-2 focus:ring-ufla-blue"
                        />
                    </div>

                    {/* NOME */}
                    <div className="space-y-2">
                        <label
                            htmlFor="nome"
                            className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Nome
                        </label>

                        <div className="relative">
                            <div className="absolute top-4 left-5 pointer-events-none">
                                <Building2 className="w-4 h-4 text-slate-300" />
                            </div>

                            <input
                                id='nome'
                                type="text"
                                name="nome"
                                defaultValue={departamento.nome}
                                required
                                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-5 text-slate-900 font-bold focus:ring-2 focus:ring-ufla-blue"
                            />
                        </div>
                    </div>

                    {/* UNIDADE ACADÊMICA */}
                    <div className="space-y-2">
                        <label
                            htmlFor="unidadeAcademicaId"
                            className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Unidade Acadêmica
                        </label>

                        <select
                            id="unidadeAcademicaId"
                            name="unidadeAcademicaId"
                            title="Selecione a Unidade Acadêmica"
                            defaultValue={String(departamento.UnidadeAcademicaId ?? '')}
                            className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-slate-900 font-bold focus:ring-2 focus:ring-ufla-blue"
                        >
                            {unidadesAcademicas.map((ua) => (
                                <option
                                    key={ua.id}
                                    value={ua.id}
                                >
                                    {ua.sigla} - {ua.nome}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                    <Link
                        href="/admin/departamentos"
                        className="px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        Cancelar
                    </Link>

                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-ufla-blue text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-900 transition-all shadow-xl shadow-blue-100 active:scale-95"
                    >
                        <Save className="w-4 h-4" />
                        Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    );
}