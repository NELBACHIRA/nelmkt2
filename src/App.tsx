import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  Cookie, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  MessageCircle, 
  Clock, 
  ShoppingBag, 
  TrendingUp, 
  Award, 
  ChevronRight, 
  Target, 
  Rocket
} from 'lucide-react';
import { useStore } from './store';
import { AdminPanel } from './components/AdminPanel';
import { supabase } from './lib/supabase';

const SalesNotification = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({ name: '', city: '', product: '' });

  const names = ['Ana', 'Paulo', 'Beatriz', 'Carlos', 'Juliana', 'Ricardo', 'Fernanda', 'Gustavo'];
  const cities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Salvador', 'Fortaleza'];
  const products = ['E-book Finanças', 'Brigadeiro Gourmet'];

  useEffect(() => {
    const showNotification = () => {
      setData({
        name: names[Math.floor(Math.random() * names.length)],
        city: cities[Math.floor(Math.random() * cities.length)],
        product: products[Math.floor(Math.random() * products.length)]
      });
      setVisible(true);
      setTimeout(() => setVisible(false), 5000);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.5) showNotification();
    }, 15000);

    setTimeout(showNotification, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          initial={{ opacity: 0, x: -50, y: 50 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-6 left-6 z-[100] bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-[280px]"
        >
          <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
            <ShoppingBag size={24} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Venda realizada!</p>
            <p className="text-xs text-white leading-tight">
              <span className="font-bold">{data.name}</span> de {data.city} acabou de adquirir o <span className="text-emerald-400 font-bold">{data.product}</span>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AnnouncementBar = ({ text }: { text: string }) => (
  <div className="w-full bg-gradient-to-r from-red-600 to-amber-600 text-white py-2 px-4 text-center text-xs font-bold uppercase tracking-widest sticky top-0 z-50 shadow-lg">
    {text}
  </div>
);

const Badge = ({ children, color = "blue" }: { children: React.ReactNode, color?: string }) => {
  const colors: Record<string, string> = {
    red: "bg-red-500/20 text-red-400 border-red-500/30",
    amber: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    green: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colors[color]}`}>
      {children}
    </span>
  );
};

const Testimonial = ({ name, text, time }: { name: string, text: string, time: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm relative mb-4"
  >
    <div className="flex items-center gap-2 mb-2">
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold">
        {name.charAt(0)}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-slate-200">{name}</h4>
        <p className="text-[10px] text-slate-500 flex items-center gap-1">
          <Clock size={10} /> {time}
        </p>
      </div>
    </div>
    <div className="bg-white/10 rounded-tr-xl rounded-br-xl rounded-bl-xl p-3 text-sm text-slate-300">
      {text}
    </div>
  </motion.div>
);

const ProductCard = ({ product }: { product: any }) => {
  const Icon = product.category === 'Finance' ? Wallet : Cookie;
  const colorClass = product.category === 'Finance' 
    ? "bg-gradient-to-br from-emerald-500 to-teal-600" 
    : "bg-gradient-to-br from-amber-500 to-orange-600";

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md transition-all hover:border-white/20 mb-8"
    >
      <Link to={`/p/${product.slug}`} className="block">
        <div className="relative h-48 w-full overflow-hidden">
          <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
          {product.tag && (
            <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg animate-pulse">
              {product.tag}
            </div>
          )}
        </div>

        <div className="p-6 -mt-10 relative">
          <div className={`w-14 h-14 rounded-2xl ${colorClass} flex items-center justify-center shadow-xl mb-4 border border-white/20`}>
            <Icon size={28} className="text-white" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2 leading-tight">{product.title}</h3>
          <p className="text-slate-400 text-sm mb-4 leading-relaxed line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-slate-500 text-xs line-through">De R$ {product.priceFrom}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-sm text-white font-medium">Por apenas</span>
                <span className="text-2xl font-black text-white">R$ {product.priceTo}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge color="green">VER DETALHES</Badge>
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                <ShieldCheck size={10} /> 7 dias de garantia
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="w-full bg-white text-slate-950 font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95 group-hover:bg-slate-100 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              QUERO CONHECER
              <ArrowRight size={18} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const SalesPage = () => {
  const { slug } = useParams();
  const data = useStore();
  const product = data.products.find(p => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!product) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-bold text-white mb-4">Produto não encontrado</h1>
      <Link to="/" className="text-indigo-400 underline">Voltar para a página inicial</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500">
      <header className="py-20 px-6 text-center bg-gradient-to-b from-indigo-950/40 to-transparent">
        <Badge color="red">OFERTA POR TEMPO LIMITADO</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white mt-6 mb-8 leading-tight max-w-4xl mx-auto">
          {product.title}
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          {product.description}
        </p>
        <div className="flex flex-col items-center gap-4">
          <a 
            href={product.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-slate-950 text-xl font-black px-12 py-6 rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center gap-2"
          >
            QUERO COMEÇAR AGORA
            <Rocket size={24} />
          </a>
          <p className="text-[10px] text-slate-500 flex items-center gap-1 font-bold">
            <ShieldCheck size={14} className="text-emerald-500" />
            PAGAMENTO 100% SEGURO & ACESSO IMEDIATO
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-32">
        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl mb-24">
          <img src={product.image} className="w-full aspect-video object-cover" alt="Banner" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
             <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 cursor-pointer hover:scale-110 transition-transform">
                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[15px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
             </div>
          </div>
        </div>

        <section className="mb-24">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-white mb-4 italic uppercase">O que você vai receber:</h2>
              <div className="w-24 h-1 bg-indigo-500 mx-auto rounded-full"></div>
           </div>
           <div className="grid md:grid-cols-2 gap-8">
              {product.features.map((f: string, i: number) => (
                <div key={i} className="flex gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white mb-1">{f}</p>
                    <p className="text-sm text-slate-400">Método validado com suporte exclusivo para alunos via área de membros.</p>
                  </div>
                </div>
              ))}
           </div>
        </section>

        <section className="mb-24 bg-white/5 border border-white/10 p-8 md:p-16 rounded-[40px] text-center backdrop-blur-sm">
           <h2 className="text-3xl md:text-5xl font-black text-white mb-10">Tudo isso por apenas:</h2>
           
           <div className="flex flex-col items-center mb-10">
              <span className="text-slate-500 line-through text-xl mb-2">De R$ {product.priceFrom}</span>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-slate-400 uppercase tracking-widest">Por</span>
                <span className="text-7xl font-black text-white drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]">R$ {product.priceTo}</span>
              </div>
           </div>

           <a 
            href={product.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white text-2xl font-black px-12 py-6 rounded-full transition-all hover:scale-105 active:scale-95 shadow-2xl group w-full justify-center md:w-auto"
           >
              QUERO MINHA VAGA AGORA
              <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
           </a>

           <div className="mt-12 grid md:grid-cols-3 gap-8 pt-10 border-t border-white/5">
              <div className="flex flex-col items-center gap-2">
                <ShieldCheck className="text-emerald-500" size={32} />
                <p className="font-bold text-xs uppercase text-slate-300">Garantia 7 Dias</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Zap className="text-amber-500" size={32} />
                <p className="font-bold text-xs uppercase text-slate-300">Acesso Vitalício</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Target className="text-red-500" size={32} />
                <p className="font-bold text-xs uppercase text-slate-300">Foco em Resultados</p>
              </div>
           </div>
        </section>

        <section className="mb-24">
          <div className="flex items-center gap-4 mb-10">
            <MessageCircle className="text-indigo-500" size={32} />
            <h2 className="text-3xl font-black text-white">O que dizem os alunos:</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {data.testimonials.slice(0, 10).map(t => (
              <Testimonial key={t.id} {...t} />
            ))}
          </div>
        </section>

        {/* FAQ Section - Obrigatório para aprovação em plataformas */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-white mb-4 italic uppercase">Dúvidas Frequentes</h2>
            <div className="w-24 h-1 bg-indigo-500 mx-auto rounded-full"></div>
          </div>
          <div className="space-y-4">
            {[
              { q: "Como vou receber o acesso?", a: "Imediatamente após a confirmação do pagamento, você receberá um e-mail com os dados de acesso à nossa plataforma exclusiva." },
              { q: "O pagamento é seguro?", a: "Sim! Utilizamos a Perfect Pay, uma das maiores e mais seguras plataformas de pagamentos do Brasil. Seus dados estão 100% protegidos." },
              { q: "Tenho garantia?", a: "Com certeza. Você tem 7 dias de garantia incondicional. Se não gostar, devolvemos todo o seu dinheiro." },
              { q: "Preciso de muito dinheiro para começar?", a: "Não! O método foi desenhado justamente para quem está começando do zero ou com pouco orçamento." }
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <p className="text-white font-bold mb-2 flex items-center gap-2">
                  <span className="text-indigo-500 text-lg">?</span> {item.q}
                </p>
                <p className="text-slate-400 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center py-20 bg-gradient-to-t from-indigo-900/20 to-transparent rounded-[40px] border border-white/5">
           <h2 className="text-4xl font-black text-white mb-6">ÚLTIMA CHANCE!</h2>
           <p className="text-slate-400 mb-10 max-w-md mx-auto">Não deixe para amanhã a mudança financeira que você pode começar hoje por menos de R$ 10,00.</p>
           <a 
            href={product.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex bg-emerald-500 hover:bg-emerald-600 text-white text-2xl font-black px-12 py-6 rounded-full transition-all shadow-[0_0_40px_rgba(16,185,129,0.3)]"
           >
              SIM! QUERO APROVEITAR AGORA
           </a>
        </section>
      </main>

      <footer className="py-20 text-center text-slate-600 text-xs border-t border-white/5 bg-slate-950">
         <p>© {new Date().getFullYear()} - Todos os direitos reservados</p>
         <p className="mt-2">CNPJ: 00.000.000/0001-00</p>
         <div className="mt-6 max-w-2xl mx-auto px-6 opacity-40 leading-relaxed">
            Este site não é afiliado ao Facebook ou a qualquer entidade do Facebook. Uma vez que você sair do Facebook, a responsabilidade não é deles e sim do nosso site. Fazemos todos os esforços para indicar claramente e mostrar provas reais do produto.
         </div>
      </footer>
    </div>
  );
};

const HomePage = () => {
  const data = useStore();
  
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500 selection:text-white">
      <AnnouncementBar text={data.announcement} />
      <SalesNotification />
      <AdminPanel />

      <main className="max-w-lg mx-auto px-6 pt-12 pb-20">
        {/* Profile Section */}
        <section className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 animate-spin-slow">
              <div className="w-full h-full rounded-full bg-slate-950 p-1">
                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-3xl font-bold overflow-hidden">
                  <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300" alt="Avatar" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-1 right-2 bg-emerald-500 w-5 h-5 rounded-full border-4 border-slate-950"></div>
          </div>

          <h1 className="text-2xl font-black text-white mb-2 tracking-tight">{data.title}</h1>
          <p className="text-slate-400 text-sm mb-4">{data.subtitle}</p>
          
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-5 h-5 rounded-full border border-slate-900 bg-slate-700 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                </div>
              ))}
            </div>
            <span className="text-xs font-bold text-slate-300">
              ⭐ {data.rating}/5 <span className="text-slate-500 font-normal">({data.studentsCount} alunos satisfeitos)</span>
            </span>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="grid grid-cols-2 gap-3 mb-12">
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center text-center">
            <TrendingUp className="text-emerald-500 mb-2" size={24} />
            <span className="text-xs font-bold text-white uppercase tracking-tighter">Resultados Rápidos</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center text-center">
            <Award className="text-amber-500 mb-2" size={24} />
            <span className="text-xs font-bold text-white uppercase tracking-tighter">Certificado Digital</span>
          </div>
        </section>

        {/* Products */}
        <div className="space-y-4">
          {data.products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Testimonials */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <MessageCircle className="text-indigo-500" />
              <h2 className="text-lg font-bold text-white">Alunos com Resultados</h2>
            </div>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">AO VIVO</span>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {data.testimonials.map(t => (
              <Testimonial key={t.id} {...t} />
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest animate-pulse">
              Role para ver mais depoimentos ({data.testimonials.length})
            </p>
          </div>
        </section>

        {/* Extra Proof: Result Images */}
        <section className="mt-16 bg-gradient-to-b from-indigo-600/20 to-transparent p-6 rounded-3xl border border-white/10">
          <h2 className="text-center font-bold text-white mb-6 uppercase tracking-widest text-xs">Resultados Reais</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl overflow-hidden border border-white/20">
              <img src="https://images.pexels.com/photos/7063765/pexels-photo-7063765.jpeg?auto=compress&cs=tinysrgb&w=300" alt="Result 1" className="aspect-square object-cover" />
            </div>
            <div className="rounded-xl overflow-hidden border border-white/20">
              <img src="https://images.pexels.com/photos/4473398/pexels-photo-4473398.jpeg?auto=compress&cs=tinysrgb&w=300" alt="Result 2" className="aspect-square object-cover" />
            </div>
          </div>
          <p className="text-center text-[10px] text-slate-500 mt-4 italic">Prints enviados por alunos via suporte.</p>
        </section>

        {/* Footer */}
        <footer className="mt-20 text-center border-t border-white/5 pt-10">
          <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
            <Zap size={14} fill="currentColor" />
            <span className="text-[10px] font-bold tracking-widest uppercase">Powered by HighConv Technology</span>
          </div>
          <p className="text-slate-600 text-[10px]">
            &copy; {new Date().getFullYear()} Sucesso Digital. Todos os direitos reservados.<br/>
            CNPJ: 00.000.000/0001-00
          </p>
        </footer>
      </main>
    </div>
  );
};

function App() {
  const data = useStore();

  useEffect(() => {
    data.fetchData();

    // Inscrição Realtime
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        data.fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (data.isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 text-sm animate-pulse">Conectando ao Supabase...</p>
        <button 
          onClick={() => useStore.setState({ isLoading: false })}
          className="mt-8 text-xs text-slate-600 underline"
        >
          Demorando demais? Clique para forçar o carregamento offline
        </button>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/p/:slug" element={<SalesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
