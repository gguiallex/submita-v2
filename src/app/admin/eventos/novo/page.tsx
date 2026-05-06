import prisma from '@/lib/prisma';
import { criarEvento } from '../actions';

export default async function NovoEventoPage() {
    // Buscamos as opções para os menus de seleção
    const edicoes = await prisma.edicao.findMany({ orderBy: { ano: 'desc' } });
    const usuarios = await prisma.usuario.findMany({ where: { role: 'ADMIN_GERAL' } });

    return (
        <div className="max-w-2xl mx-auto p-8">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Novo Evento</h1>
                <p className="text-slate-500">Vincule um novo evento a uma edição existente.</p>
            </header>

            <form action={criarEvento} className="space-y-5 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                {/* Seleção da Edição */}
                <div>
                    <label htmlFor="edicao-select" className="block text-sm font-semibold text-slate-700 mb-2">
                        Edição Pai
                    </label>
                    <select
                        id="edicao-select" // Adicionamos o ID aqui
                        name="edicaoId"
                        className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                        required
                    >
                        <option value="">Selecione a edição...</option>
                        {edicoes.map(ed => (
                            <option key={ed.id} value={ed.id}>{ed.nome} ({ed.ano})</option>
                        ))}
                    </select>
                </div>

                {/* Título e Sigla */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Título do Evento</label>
                        <input name="titulo" type="text" placeholder="Ex: Simpósio de Tecnologia" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Sigla</label>
                        <input name="sigla" type="text" placeholder="Ex: SIMTEC" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                </div>

                {/* Seleção do Administrador */}
                <div>
                    <label htmlFor="admin-select" className="block text-sm font-semibold text-slate-700 mb-2">
                        Responsável (Admin)
                    </label>
                    <select
                        id="admin-select" // Adicionamos o ID aqui
                        name="adminId"
                        className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                        required
                    >
                        <option value="">Selecione o administrador...</option>
                        {usuarios.map(user => (
                            <option key={user.id} value={user.id}>{user.nome} ({user.email})</option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-4 pt-6">
                    <button type="submit" className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                        Criar Evento
                    </button>
                    <a href="/admin/edicoes" className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold text-center hover:bg-slate-200 transition">
                        Cancelar
                    </a>
                </div>
            </form>
        </div>
    );
}