import React, { useState } from 'react';
import { useStore } from '../store';
import { X, Save, Plus, Trash2, Settings, Lock, Layout, ShoppingBag, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const data = useStore();
  
  const [formData, setFormData] = useState({
    title: data.title,
    subtitle: data.subtitle,
    announcement: data.announcement,
    rating: data.rating,
    studentsCount: data.studentsCount,
  });

  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    priceFrom: '',
    priceTo: '',
    image: 'https://images.pexels.com/photos/29769669/pexels-photo-29769669.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    tag: '',
    viewers: '10',
    features: ['Recurso 1'],
    category: 'Finance',
    slug: '',
    checkoutUrl: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Senha padrão solicitada
      setIsAuthenticated(true);
    } else {
      alert('Senha incorreta!');
    }
  };

  const handleSaveGeneral = () => {
    data.updateData(formData);
    alert('Informações gerais salvas!');
  };

  const handleAddProduct = () => {
    if (!newProduct.title) return alert('Dê um título ao produto');
    if (!newProduct.slug) return alert('Dê um slug ao produto (ex: ebook-financeiro)');
    data.addProduct(newProduct);
    setNewProduct({
      title: '',
      description: '',
      priceFrom: '',
      priceTo: '',
      image: 'https://images.pexels.com/photos/29769669/pexels-photo-29769669.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      tag: '',
      viewers: '10',
      features: ['Recurso 1'],
      category: 'Finance',
      slug: '',
      checkoutUrl: ''
    });
    alert('Produto adicionado!');
  };

  if (!isOpen) return (
    <button 
      onClick={() => setIsOpen(true)}
      className="fixed bottom-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/20 transition-all z-[60] shadow-2xl"
    >
      <Settings className="text-white" size={24} />
    </button>
  );

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-[70] flex flex-col">
      {!isAuthenticated ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm bg-white/5 p-8 rounded-3xl border border-white/10"
          >
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-2">Painel de Acesso</h2>
            <p className="text-slate-500 text-center text-sm mb-8">Digite sua senha para continuar</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="password"
                placeholder="Senha de acesso"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-indigo-500"
                autoFocus
              />
              <button className="w-full bg-white text-slate-950 font-bold py-4 rounded-xl transition-transform active:scale-95">
                ENTRAR NO PAINEL
              </button>
            </form>
            <p className="mt-6 text-center text-[10px] text-slate-600 uppercase tracking-widest">Acesso restrito ao administrador</p>
            <button onClick={() => setIsOpen(false)} className="w-full mt-4 text-slate-500 text-xs hover:text-white transition-colors">Voltar para o site</button>
          </motion.div>
        </div>
      ) : (
        <>
          <header className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-950/50 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Settings size={20} className="text-white" />
              </div>
              <h2 className="text-lg font-bold text-white">Painel Admin</h2>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400">
              <X size={24} />
            </button>
          </header>

          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Tabs */}
            <aside className="w-full md:w-64 border-r border-white/10 p-4 space-y-2 bg-slate-950/30">
              <button 
                onClick={() => setActiveTab('general')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'general' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}
              >
                <Layout size={18} /> Aparência Geral
              </button>
              <button 
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}
              >
                <ShoppingBag size={18} /> Produtos
              </button>
              <button 
                onClick={() => setActiveTab('testimonials')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'testimonials' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}
              >
                <MessageSquare size={18} /> Depoimentos
              </button>
            </aside>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 pb-32">
              <AnimatePresence mode="wait">
                {activeTab === 'general' && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                      <h3 className="text-white font-bold mb-6">Informações da Bio</h3>
                      <div className="grid gap-6">
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Título da Bio</label>
                          <input 
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Subtítulo</label>
                          <textarea 
                            value={formData.subtitle}
                            onChange={e => setFormData({...formData, subtitle: e.target.value})}
                            className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none h-24"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Texto do Aviso (Topo)</label>
                          <input 
                            value={formData.announcement}
                            onChange={e => setFormData({...formData, announcement: e.target.value})}
                            className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Avaliação (ex: 4.9)</label>
                            <input 
                              value={formData.rating}
                              onChange={e => setFormData({...formData, rating: e.target.value})}
                              className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Total Alunos</label>
                            <input 
                              value={formData.studentsCount}
                              onChange={e => setFormData({...formData, studentsCount: e.target.value})}
                              className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
                            />
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={handleSaveGeneral}
                        className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all"
                      >
                        <Save size={18} /> Salvar Bio
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'products' && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    {/* Add New Product */}
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                      <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                        <Plus size={20} className="text-indigo-500" /> Adicionar Novo E-book
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <input 
                          placeholder="Título do Produto"
                          value={newProduct.title}
                          onChange={e => setNewProduct({...newProduct, title: e.target.value})}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white outline-none"
                        />
                        <select 
                          value={newProduct.category}
                          onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white outline-none"
                        >
                          <option value="Finance">Financeiro</option>
                          <option value="Cooking">Culinária/Renda Extra</option>
                        </select>
                        <input 
                          placeholder="Preço Original (De)"
                          value={newProduct.priceFrom}
                          onChange={e => setNewProduct({...newProduct, priceFrom: e.target.value})}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white outline-none"
                        />
                        <input 
                          placeholder="Preço Promo (Por)"
                          value={newProduct.priceTo}
                          onChange={e => setNewProduct({...newProduct, priceTo: e.target.value})}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white outline-none"
                        />
                        <input 
                          placeholder="Slug da Página (ex: ebook-financeiro)"
                          value={newProduct.slug}
                          onChange={e => setNewProduct({...newProduct, slug: e.target.value})}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white outline-none"
                        />
                        <input 
                          placeholder="Link de Checkout (Botão Compra)"
                          value={newProduct.checkoutUrl}
                          onChange={e => setNewProduct({...newProduct, checkoutUrl: e.target.value})}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white outline-none"
                        />
                        <div className="md:col-span-2">
                          <textarea 
                            placeholder="Breve descrição persuasiva..."
                            value={newProduct.description}
                            onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                            className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white outline-none h-20"
                          />
                        </div>
                        <input 
                          placeholder="URL da Imagem de Capa"
                          value={newProduct.image}
                          onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                          className="w-full md:col-span-2 bg-slate-900 border border-white/10 rounded-xl p-3 text-white outline-none"
                        />
                      </div>
                      <button 
                        onClick={handleAddProduct}
                        className="mt-6 w-full bg-white text-slate-950 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-colors"
                      >
                        ADICIONAR PRODUTO AO SITE
                      </button>
                    </div>

                    {/* Current Products List */}
                    <div className="space-y-6">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Produtos Ativos ({data.products.length})</h4>
                      {data.products.map(p => (
                        <div key={p.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
                          <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <div className="flex items-center gap-4">
                              <img src={p.image} className="w-14 h-14 rounded-xl object-cover" alt="" />
                              <div>
                                <p className="text-white font-bold">{p.title}</p>
                                <p className="text-slate-500 text-xs">ID: {p.id.substring(0,8)}...</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => data.removeProduct(p.id)}
                              className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Excluir Produto"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                              <label className="text-[10px] text-slate-500 font-bold uppercase">Título na Sales Page</label>
                              <input 
                                defaultValue={p.title}
                                onBlur={(e) => data.updateProduct(p.id, { title: e.target.value })}
                                className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-indigo-500 outline-none"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="text-[10px] text-slate-500 font-bold uppercase">Descrição Curta (Bio)</label>
                              <textarea 
                                defaultValue={p.description}
                                onBlur={(e) => data.updateProduct(p.id, { description: e.target.value })}
                                className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-indigo-500 outline-none h-16"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="text-[10px] text-slate-500 font-bold uppercase">Vantagens (separe por vírgula)</label>
                              <input 
                                defaultValue={p.features.join(', ')}
                                onBlur={(e) => data.updateProduct(p.id, { features: e.target.value.split(',').map(s => s.trim()) })}
                                className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-indigo-500 outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-500 font-bold uppercase">Preço De</label>
                              <input 
                                defaultValue={p.priceFrom}
                                onBlur={(e) => data.updateProduct(p.id, { priceFrom: e.target.value })}
                                className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-indigo-500 outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-500 font-bold uppercase">Preço Por</label>
                              <input 
                                defaultValue={p.priceTo}
                                onBlur={(e) => data.updateProduct(p.id, { priceTo: e.target.value })}
                                className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-indigo-500 outline-none"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="text-[10px] text-slate-500 font-bold uppercase">Link do Checkout (Perfect Pay)</label>
                              <input 
                                placeholder="https://app.perfectpay.com.br/checkout/..."
                                defaultValue={p.checkoutUrl}
                                onBlur={(e) => {
                                  if (e.target.value && !e.target.value.startsWith('http')) {
                                    alert('O link deve começar com https://');
                                    return;
                                  }
                                  data.updateProduct(p.id, { checkoutUrl: e.target.value });
                                }}
                                className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-sm text-indigo-400 focus:border-indigo-500 outline-none font-mono"
                              />
                            </div>
                          </div>

                          <div className="bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20">
                            <p className="text-[10px] text-indigo-400 font-bold uppercase mb-1">Link para a Perfect Pay:</p>
                            <p className="text-[11px] text-white break-all select-all font-mono">
                              {window.location.origin}/p/{p.slug}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'testimonials' && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                      <h3 className="text-white font-bold mb-4">Gerenciar Depoimentos</h3>
                      <div className="space-y-4">
                        {data.testimonials.map(t => (
                          <div key={t.id} className="bg-slate-900/50 p-4 rounded-xl border border-white/5 flex justify-between items-start">
                            <div className="flex-1 pr-4">
                              <p className="text-white font-bold text-sm mb-1">{t.name}</p>
                              <p className="text-slate-400 text-xs italic">"{t.text}"</p>
                            </div>
                            <button 
                              onClick={() => data.removeTestimonial(t.id)}
                              className="text-red-500 p-1"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
