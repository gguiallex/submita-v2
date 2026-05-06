import Link from 'next/link';
import { criarEdicao } from '../actions'; // Ajuste o caminho da sua action

export default function NovaEdicaoPage() {
    return (
        <div className="min-h-screen bg-slate-50 p-8 font-sans">
            <div className="max-w-2xl mx-auto">
                <header className="mb-10">
                    <Link 
                        href="/admin/edicoes" 
                        className="text-ufla-blue font-black text-[10px] uppercase tracking-widest hover:underline"
                    >
                        ← Voltar para a Gestão
                    </Link>
                    <h1 className="text-4xl font-black text-slate-900 mt-4 tracking-tighter uppercase italic">
                        Abrir Novo Ciclo
                    </h1>
                    <p className="text-slate-500 font-medium">Instancie um novo ano letivo para submissões de eventos.</p>
                </header>

                <form action={criarEdicao} className="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl space-y-8">
                    <div className="space-y-2">
                        <label className="block text-sm font-black text-slate-700 uppercase tracking-widest">
                            Ano de Referência
                        </label>
                        <input 
                            name="ano" 
                            type="number" 
                            min="2024" 
                            max="2100"
                            placeholder="Ex: 2026"
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-2xl font-black text-ufla-blue outline-none focus:ring-4 focus:ring-ufla-blue/10 transition-all"
                            required 
                        />
                        <p className="text-xs text-slate-400 font-medium italic">
                            * O ano será usado como identificador principal para todos os congressos e simpósios deste período.
                        </p>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex gap-4">
                        <button 
                            type="submit" 
                            className="flex-1 bg-ufla-blue text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-900 transition-all shadow-lg shadow-blue-100 active:scale-95"
                        >
                            Confirmar Abertura
                        </button>
                        <Link 
                            href="/admin/edicoes"
                            className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-bold text-center hover:bg-slate-200 transition-all"
                        >
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}