import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Navbar Minimalista */}
      <nav className="bg-white border-b border-slate-200 p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black text-ufla-blue tracking-tighter italic">
            SUBMITA <span className="text-ufla-gold">2.0</span>
          </h1>
          <Link 
            href="/login" 
            className="text-sm font-bold text-slate-600 hover:text-ufla-blue transition"
          >
            Acesso Administrativo →
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="max-w-3xl">
          <span className="bg-ufla-green/10 text-ufla-green px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-block">
            Universidade Federal de Lavras
          </span>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-none mb-6">
            Gestão Inteligente de <br /> 
            <span className="text-ufla-blue">Eventos Científicos</span>
          </h2>
          <p className="text-xl text-slate-500 mb-10 font-medium leading-relaxed">
            Submeta seus trabalhos, acompanhe avaliações e consulte resultados 
            das edições institucionais de forma simples e rápida.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link 
              href="/edicoes" 
              className="bg-ufla-blue text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-900 transition shadow-xl shadow-blue-100 flex items-center justify-center gap-3"
            >
              🚀 VER EVENTOS ABERTOS
            </Link>
            
            {/*<div className="bg-white text-slate-400 px-10 py-5 rounded-2xl font-bold border border-slate-200 flex items-center justify-center italic">
              Em breve: Certificados Online
            </div>*/}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-10 border-t border-slate-200 text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
          Desenvolvido para a Bolsa Institucional 2 • UFLA 2026
        </p>
      </footer>
    </div>
  );
}