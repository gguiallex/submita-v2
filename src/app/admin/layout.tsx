// src/app/admin/layout.tsx
import React from 'react';
import Link from 'next/link';
// Importando os ícones
import { Calendar, Users, LayoutDashboard, LogOut, Settings, PlusCircle, Building2, Paperclip } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <aside className="w-72 bg-ufla-blue text-white flex flex-col shadow-2xl z-20 sticky top-0 h-screen">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-ufla-gold rounded-lg rotate-12 flex-shrink-0 shadow-lg shadow-black/20" />
            <h1 className="text-2xl font-black tracking-tighter italic uppercase">
              Submita
            </h1>
          </div>
          <p className="text-[10px] text-blue-200/60 font-black uppercase tracking-[0.2em] mt-2">
            UFLA • Gestão Acadêmica
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          <Link href="/admin/edicoes" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all font-bold group">
            <Calendar className="w-5 h-5 text-blue-300 group-hover:text-white transition-colors" strokeWidth={2.5} />
            <span>Edições</span>
          </Link>

          <Link /*href="/admin/temas"*/ href="/admin/unidadesAcademicas" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all font-medium text-blue-100 group">
            <Building2 className="w-5 h-5 opacity-70 group-hover:opacity-100" strokeWidth={2} />
            <span>Unidade Acadêmica</span>
          </Link>

          <Link href="/admin/departamentos" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all font-medium text-blue-100 group">
            <PlusCircle className="w-5 h-5 opacity-70 group-hover:opacity-100" strokeWidth={2} />
            <span>Departamentos</span>
          </Link>

          <Link href="/admin/temas" /*href="/admin/unidadesAcademicas"*/ className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all font-medium text-blue-100 group">
            <Paperclip className="w-5 h-5 opacity-70 group-hover:opacity-100" strokeWidth={2} />
            <span>Temas</span>
          </Link>

          {/*<Link href="/admin/revisores" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all font-medium text-blue-100 group">
            <Users className="w-5 h-5 opacity-70 group-hover:opacity-100" strokeWidth={2} />
            <span>Revisores</span>
          </Link>*/}
        </nav>

        <div className="p-6 mt-auto border-t border-white/5 bg-blue-950/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center font-bold border border-white/10 text-ufla-gold">
              H
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black text-white truncate">Heitor Orientador</p>
              <p className="text-[10px] text-blue-300 truncate">heitor@ufla.br</p>
            </div>
          </div>
          <Link href="/login" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all border border-red-500/20">
            <LogOut className="w-3 h-3" />
            Sair
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}