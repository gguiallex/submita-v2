import { realizarLogin } from './actions';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 font-sans">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-slate-200">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-black text-ufla-blue tracking-tighter italic">
            SUBMITA <span className="text-ufla-gold text-2xl">2.0</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Portal Administrativo</p>
        </header>

        <form action={realizarLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">E-mail Institucional</label>
            <input 
              name="email" 
              type="email" 
              placeholder="admin@ufla.br"
              className="w-full p-4 border border-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-ufla-blue transition-all"
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Senha</label>
            <input 
              name="senha" 
              type="password" 
              placeholder="••••••••"
              className="w-full p-4 border border-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-ufla-blue transition-all"
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-ufla-blue text-white py-4 rounded-2xl font-bold hover:bg-blue-900 transition-transform active:scale-95 shadow-lg shadow-blue-200"
          >
            Entrar no Sistema
          </button>
        </form>

        <footer className="mt-8 text-center">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">
            Universidade Federal de Lavras
          </p>
        </footer>
      </div>
    </div>
  );
}