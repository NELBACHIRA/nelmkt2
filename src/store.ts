import { create } from 'zustand';
import { supabase } from './lib/supabase';
import { initialTestimonials } from './data/testimonials';

export interface Product {
  id: string;
  title: string;
  description: string;
  priceFrom: string;
  priceTo: string;
  image: string;
  tag?: string;
  viewers: string;
  features: string[];
  category: string;
  slug: string;
  checkoutUrl: string;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  time: string;
  avatar?: string;
}

interface SiteData {
  announcement: string;
  title: string;
  subtitle: string;
  rating: string;
  studentsCount: string;
  products: Product[];
  testimonials: Testimonial[];
  isLoading: boolean;
  
  fetchData: () => Promise<void>;
  updateData: (newData: Partial<Omit<SiteData, 'products' | 'testimonials'>>) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Omit<Product, 'id'>>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  addTestimonial: (testimonial: Omit<Testimonial, 'id'>) => Promise<void>;
  removeTestimonial: (id: string) => Promise<void>;
}

export const useStore = create<SiteData>((set, get) => ({
  announcement: "Carregando...",
  title: "Carregando...",
  subtitle: "Carregando...",
  rating: "5.0",
  studentsCount: "0",
  products: [],
  testimonials: [],
  isLoading: true,

  fetchData: async () => {
    console.log("Iniciando busca de dados...");
    
    // Safety timeout: se em 6 segundos não carregar, libera a tela
    setTimeout(() => {
      if (get().isLoading) {
        console.warn("Busca de dados demorando demais, liberando tela...");
        set({ isLoading: false });
      }
    }, 6000);

    try {
      // Fetch Settings with a timeout or faster check
      const { data: settings, error: settingsError } = await supabase.from('site_settings').select('*').single();
      
      if (settings) {
        set({ 
          announcement: settings.announcement || "PROMOÇÃO POR TEMPO LIMITADO",
          title: settings.title || "Sucesso Financeiro & Lucro",
          subtitle: settings.subtitle || "Transforme sua realidade com métodos práticos.",
          rating: settings.rating || "4.9",
          studentsCount: settings.students_count || "1.240+"
        });
      } else if (settingsError) {
        console.warn("Settings not found, using defaults. Did you run the SQL?");
        set({
          announcement: "PROMOÇÃO POR TEMPO LIMITADO",
          title: "Sucesso Financeiro & Lucro",
          subtitle: "Transforme sua realidade com métodos práticos.",
          rating: "4.9",
          studentsCount: "1.240+"
        });
      }

      // Fetch Products
      const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: true });
      if (products && products.length > 0) {
        const mappedProducts = products.map(p => ({
          ...p,
          priceFrom: p.price_from,
          priceTo: p.price_to,
          checkoutUrl: p.checkout_url
        }));
        set({ products: mappedProducts });
      } else {
        // Default products if none in DB
        set({ products: [
          {
            id: '1',
            title: "E-book: Os Primeiros R$ 1.000",
            description: "O guia definitivo para quem está sempre sem dinheiro e quer construir sua primeira reserva financeira em tempo recorde.",
            priceFrom: "97,00",
            priceTo: "9,90",
            image: "https://images.pexels.com/photos/29769669/pexels-photo-29769669.jpeg",
            tag: "MAIS VENDIDO",
            viewers: "14",
            features: ["Domine seus gastos invisíveis", "A regra dos 7 dias para poupar", "Planilha de controle simplificada"],
            category: "Finance",
            slug: "os-primeiros-1000",
            checkoutUrl: ""
          },
          {
            id: '2',
            title: "Brigadeiro Gourmet Lucrativo",
            description: "Aprenda a criar um negócio altamente lucrativo da cozinha da sua casa com pouco investimento e lucro imediato.",
            priceFrom: "67,00",
            priceTo: "9,90",
            image: "https://images.pexels.com/photos/9285188/pexels-photo-9285188.jpeg",
            tag: "RENDA RÁPIDA",
            viewers: "27",
            features: ["Receitas exclusivas e testadas", "Guia de precificação real", "Estratégias de venda no Instagram"],
            category: "Cooking",
            slug: "brigadeiro-gourmet",
            checkoutUrl: ""
          }
        ]});
      }

      // Fetch Testimonials
      const { data: testimonials } = await supabase.from('testimonials').select('*').order('created_at', { ascending: true });
      if (testimonials && testimonials.length > 0) {
        set({ testimonials });
      } else {
        set({ testimonials: initialTestimonials });
      }

    } catch (error) {
      console.error("Erro ao carregar dados do Supabase:", error);
      // Ensure we don't stay loading forever on critical failure
      set({ isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },

  updateData: async (newData) => {
    set(newData as any);
    const { error } = await supabase
      .from('site_settings')
      .update({
        announcement: newData.announcement,
        title: newData.title,
        subtitle: newData.subtitle,
        rating: newData.rating,
        students_count: newData.studentsCount
      })
      .eq('id', 1);
    if (error) console.error("Erro ao salvar configurações no Supabase:", error);
  },

  updateProduct: async (id: string, updates: Partial<Omit<Product, 'id'>>) => {
    // Map UI to DB snake_case
    const dbUpdates: any = {
      title: updates.title,
      description: updates.description,
      price_from: updates.priceFrom,
      price_to: updates.priceTo,
      image: updates.image,
      tag: updates.tag,
      viewers: updates.viewers,
      features: updates.features,
      category: updates.category,
      slug: updates.slug,
      checkout_url: updates.checkoutUrl
    };

    // Remove undefined keys
    Object.keys(dbUpdates).forEach(key => dbUpdates[key] === undefined && delete dbUpdates[key]);

    const { error } = await supabase
      .from('products')
      .update(dbUpdates)
      .eq('id', id);

    if (!error) {
      set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
      }));
    } else {
      console.error("Erro ao atualizar produto no Supabase:", error);
    }
  },

  addProduct: async (product) => {
    // Mapping camelCase from UI to snake_case for DB
    const dbProduct = {
      title: product.title,
      description: product.description,
      price_from: product.priceFrom,
      price_to: product.priceTo,
      image: product.image,
      tag: product.tag,
      viewers: product.viewers,
      features: product.features,
      category: product.category,
      slug: product.slug,
      checkout_url: product.checkoutUrl
    };

    const { data, error } = await supabase
      .from('products')
      .insert([dbProduct])
      .select();
    
    if (data) {
      // Map back to UI format
      const newProd = {
        ...data[0],
        priceFrom: data[0].price_from,
        priceTo: data[0].price_to,
        checkoutUrl: data[0].checkout_url
      };
      set((state) => ({ products: [...state.products, newProd] }));
    }
    if (error) console.error("Erro ao adicionar produto:", error);
  },

  removeProduct: async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      set((state) => ({ products: state.products.filter(p => p.id !== id) }));
    }
  },

  addTestimonial: async (testimonial) => {
    const { data, error } = await supabase
      .from('testimonials')
      .insert([testimonial])
      .select();

    if (data) {
      set((state) => ({ testimonials: [...state.testimonials, data[0]] }));
    }
    if (error) console.error(error);
  },

  removeTestimonial: async (id) => {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (!error) {
      set((state) => ({ testimonials: state.testimonials.filter(t => t.id !== id) }));
    }
  },
}));

