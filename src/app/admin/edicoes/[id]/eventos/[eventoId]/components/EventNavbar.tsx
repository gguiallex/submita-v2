"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    Eye,
    ListTree,
    Settings2,
    ClipboardCheck,
    FileSearch,
    UserCheck,
    Users,
    BarChart3
} from "lucide-react";

type Props = {
    edicaoId: string;
    eventoId: string;
};

export function EventNavbar({
    edicaoId,
    eventoId
}: Props) {

    const pathname = usePathname();

    const base = `/admin/edicoes/${edicaoId}/eventos/${eventoId}`;

    const links = [
        {
            href: base,
            label: "Visão Geral",
            icon: Eye,
            active: "bg-blue-600 text-white shadow-lg shadow-blue-100",
            hover: "hover:bg-blue-600 hover:text-white"
        },
        {
            href: `${base}/temas`,
            label: "Áreas",
            icon: ListTree,
            active: "bg-emerald-600 text-white shadow-lg shadow-emerald-100",
            hover: "hover:bg-emerald-600 hover:text-white"
        },
        {
            href: `${base}/revisores`,
            label: "Revisores",
            icon: Users,
            active: "bg-purple-600 text-white shadow-lg shadow-purple-100",
            hover: "hover:bg-purple-600 hover:text-white"
        },
        {
            href: `${base}/atribuicoes`,
            label: "Atribuição",
            icon: UserCheck,
            active: "bg-orange-600 text-white shadow-lg shadow-orange-100",
            hover: "hover:bg-orange-600 hover:text-white"
        },
        {
            href: `${base}/trabalhos`,
            label: "Trabalhos",
            icon: FileSearch,
            active: "bg-amber-600 text-white shadow-lg shadow-amber-100",
            hover: "hover:bg-amber-600 hover:text-white"
        },
        {
            href: `${base}/questionario`,
            label: "Barema",
            icon: ClipboardCheck,
            active: "bg-indigo-600 text-white shadow-lg shadow-indigo-100",
            hover: "hover:bg-indigo-600 hover:text-white"
        },
        {
            href: `${base}/relatorios`,
            label: "Relatórios",
            icon: BarChart3,
            active: "bg-red-600 text-white shadow-lg shadow-indigo-100",
            hover: "hover:bg-red-600 hover:text-white"
        },
        {
            href: `${base}/editar`,
            label: "Configurações",
            icon: Settings2,
            active: "bg-slate-600 text-white shadow-lg shadow-slate-100",
            hover: "hover:bg-slate-600 hover:text-white"
        }
    ];

    return (
        <nav className="mb-10 bg-white border border-slate-200 rounded-[2rem] p-3 shadow-sm">
            <div className="flex flex-wrap gap-2">
                {links.map((item) => {

                    const Icon = item.icon;

                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                flex items-center gap-2
                                px-4 py-4
                                rounded-2xl
                                text-[10px]
                                font-black
                                uppercase
                                tracking-widest
                                transition-all
                                active:scale-95
                                
                                ${isActive
                                    ? item.active
                                    : `bg-slate-50 text-slate-500 ${item.hover}`
                                }
                            `}
                        >
                            <Icon className="w-4 h-4" />
                            {item.label}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}