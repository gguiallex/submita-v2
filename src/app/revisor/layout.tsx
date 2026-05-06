import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import Link from "next/link";
import { ClipboardCheck, LogOut, User } from "lucide-react";

export default async function RevisorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const usuarioId = Number(cookieStore.get("submita_session")?.value);

    const usuario = await prisma.usuario.findUnique({
        where: { id: usuarioId },
    });

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl sticky top-0 h-screen">
                <div className="p-8">
                    <h1 className="text-2xl font-black tracking-tighter italic uppercase">
                        Submita
                    </h1>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2">
                        Portal do Revisor
                    </p>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    <Link
                        href="/revisor"
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all font-bold"
                    >
                        <ClipboardCheck className="w-5 h-5" />
                        <span>Minhas Avaliações</span>
                    </Link>
                </nav>

                <div className="p-6 mt-auto border-t border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-ufla-gold font-black">
                            <User className="w-5 h-5" />
                        </div>

                        <div className="overflow-hidden">
                            <p className="text-xs font-black text-white truncate">
                                {usuario?.nome || "Revisor"}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">
                                {usuario?.email || "sem e-mail"}
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/login"
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all border border-red-500/20"
                    >
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