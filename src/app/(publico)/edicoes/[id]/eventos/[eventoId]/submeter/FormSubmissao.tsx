"use client";

import { useState } from 'react';
import { submeterTrabalho } from '../actions';
import Link from 'next/link';
import { Users, FileText, Tag, UploadCloud, ChevronLeft, Check, Hash } from 'lucide-react';

interface Tema {
    id: number;
    nome: string;
}

interface Departamento {
    id: number;
    sigla: string;
}

interface Props {
    edicaoId: string;
    eventoId: string;
    eventoSigla: string;
    temas: Tema[];
    departamentos: Departamento[];
    exigirResumo: boolean;
    exigirPdf: boolean;
    submissaoAnonima: boolean;
}

export default function FormSubmissao({
    edicaoId,
    eventoId,
    eventoSigla,
    temas,
    departamentos,
    exigirResumo,
    exigirPdf,
    submissaoAnonima
}: Props) {
    const [autores, setAutores] = useState([{ nome: '', email: '', departamento: departamentos[0]?.sigla || 'Geral' }]);
    const [temasSelecionados, setTemasSelecionados] = useState<number[]>([]);

    const adicionarAutor = () => setAutores([...autores, { nome: '', email: '', departamento: departamentos[0]?.sigla || 'Geral' }]);
    const removerAutor = (index: number) => {
        if (autores.length > 1) setAutores(autores.filter((_, i) => i !== index));
    };

    const atualizarAutor = (index: number, campo: string, valor: string) => {
        const novos = [...autores];
        novos[index] = { ...novos[index], [campo]: valor };
        setAutores(novos);
    };

    const toggleTema = (id: number) => {
        setTemasSelecionados(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    return (
        <form action={submeterTrabalho} className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-200 space-y-8 animate-in fade-in duration-500">
            {/* Header Contextual */}
            <div className="border-b border-slate-100 pb-6">
                <h2 className="text-[10px] font-black text-ufla-blue uppercase tracking-[0.3em] mb-1">Portal de Submissão</h2>
                <p className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                    {eventoSigla}
                </p>
            </div>

            {/* Campos Ocultos */}
            <input type="hidden" name="eventoId" value={eventoId} />
            <input type="hidden" name="autoresData" value={JSON.stringify(autores)} />
            <input type="hidden" name="temasData" value={JSON.stringify(temasSelecionados)} />

            {/* Título e Resumo */}
            <div className="space-y-6">
                <div>
                    <label htmlFor="titulo" className="block text-sm font-bold text-slate-700 mb-2">Título do Trabalho</label>
                    <input
                        id="titulo"
                        name="titulo"
                        type="text"
                        placeholder="Digite o título completo..."
                        className="w-full p-4 border border-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-ufla-blue text-slate-800 transition-all font-medium"
                        required
                    />
                </div>
                {exigirResumo && (
                    <div>
                        <label htmlFor="resumo" className="block text-sm font-bold text-slate-700 mb-2">
                            Resumo Acadêmico
                        </label>
                        <textarea
                            id="resumo"
                            name="resumo"
                            rows={6}
                            placeholder="Escreva o resumo acadêmico..."
                            className="w-full p-4 border border-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-ufla-blue resize-none text-slate-800 transition-all"
                            required
                        />
                    </div>
                )}
            </div>

            {/* SEÇÃO DE AUTORES (Design Original) */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-black text-slate-800 uppercase italic tracking-tighter flex items-center gap-2">
                        <Users className="w-5 h-5 text-ufla-blue" /> Equipe de Autores
                    </h3>
                    <button
                        type="button"
                        onClick={adicionarAutor}
                        className="text-[10px] bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full font-black border border-emerald-200 hover:bg-emerald-600 hover:text-white transition-all uppercase tracking-widest"
                    >
                        + Adicionar Autor
                    </button>
                </div>

                {autores.map((autor, index) => (
                    <div key={index} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 grid md:grid-cols-3 gap-4 relative animate-in fade-in slide-in-from-top-2">
                        <input
                            type="text"
                            placeholder="Nome Completo"
                            title={`Nome do autor ${index + 1}`}
                            value={autor.nome}
                            onChange={e => atualizarAutor(index, 'nome', e.target.value)}
                            className="p-3 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-ufla-blue bg-white text-slate-800"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email Institucional"
                            title={`Email do autor ${index + 1}`}
                            value={autor.email}
                            onChange={e => atualizarAutor(index, 'email', e.target.value)}
                            className="p-3 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-ufla-blue bg-white text-slate-800"
                            required
                        />
                        <div className="flex gap-2">
                            <select
                                title={`Departamento do autor ${index + 1}`}
                                value={autor.departamento}
                                onChange={e => atualizarAutor(index, 'departamento', e.target.value)}
                                className="flex-1 p-3 border border-slate-200 rounded-xl text-sm font-bold bg-white outline-none focus:ring-2 focus:ring-ufla-blue text-slate-700"
                            >
                                {departamentos.map(d => <option key={d.id} value={d.sigla}>{d.sigla}</option>)}
                                {departamentos.length === 0 && <option value="Geral">Geral</option>}
                            </select>
                            {autores.length > 1 && (
                                <button
                                    type="button"
                                    title="Remover autor"
                                    onClick={() => removerAutor(index)}
                                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                >✕</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* PDF UPLOAD (Recuperado) */}
            {exigirPdf && (
                <div className="p-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 hover:border-ufla-blue transition-all group text-center relative">
                    <label htmlFor="arquivo" className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-widest cursor-pointer">
                        <UploadCloud className="w-5 h-5 inline-block mr-2 mb-1" />
                        Documento do Trabalho (PDF)
                    </label>
                    <input
                        id="arquivo"
                        name="arquivo"
                        type="file"
                        accept=".pdf"
                        title="Selecione o arquivo PDF do seu trabalho"
                        className="w-full max-w-xs mx-auto text-sm text-slate-500 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-ufla-blue file:text-white hover:file:bg-blue-900 cursor-pointer transition-all"
                        required
                    />
                    <p className="mt-3 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                        Apenas PDF • Máx 10MB
                    </p>
                </div>
            )}

            {/* PALAVRAS-CHAVE E TEMAS (Design Antigo Restaurado) */}
            <div className="grid md:grid-cols-2 gap-8 pt-4">
                <div>
                    <label htmlFor="palavrasChave" className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <Hash className="w-4 h-4" /> Palavras-chave
                    </label>
                    <input
                        id="palavrasChave"
                        name="palavrasChave"
                        type="text"
                        placeholder="Ex: IA, Cafeicultura, UFLA"
                        className="w-full p-4 border border-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-ufla-blue text-slate-800 transition-all"
                        required
                    />
                    <p className="text-[14px] text-slate-400 mt-2 font-medium italic">Separe os termos por vírgula.</p>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                        <Tag className="w-4 h-4" /> Áreas Temáticas (Selecione um ou mais)
                    </label>
                    <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                        {temas.map(t => {
                            const ativo = temasSelecionados.includes(t.id);
                            return (
                                <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => toggleTema(t.id)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-1 ${ativo
                                        ? 'bg-ufla-blue text-white border-ufla-blue shadow-md'
                                        : 'bg-white text-slate-500 border-slate-200 hover:border-ufla-blue'
                                        }`}
                                >
                                    {ativo && <Check className="w-3 h-3" />}
                                    {t.nome}
                                </button>
                            );
                        })}
                        {temas.length === 0 && <span className="text-xs text-slate-400 italic">Nenhuma área disponível</span>}
                    </div>
                </div>
            </div>

            {/* Rodapé e Botões */}
            <div className="pt-8 border-t border-slate-100">
                <button
                    type="submit"
                    className="w-full bg-ufla-blue text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-900 transition-all shadow-xl shadow-blue-100 active:scale-[0.98]"
                >
                    ENVIAR TRABALHO PARA AVALIAÇÃO
                </button>
                <div className='text-center mt-4'>
                    <Link href={`/edicoes/${edicaoId}`} className="text-ufla-blue font-black text-[10px] uppercase tracking-widest hover:underline flex items-center justify-center gap-1">
                        <ChevronLeft className="w-3 h-3" /> Cancelar submissão
                    </Link>
                </div>
                <p className="text-center mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                    Universidade Federal de Lavras • Sistema Submita
                </p>
            </div>
        </form>
    );
}