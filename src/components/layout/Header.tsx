import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, Phone, ChevronDown, Package } from 'lucide-react';
import { openQuoteModal } from '../common/QuoteModal';
import { getProducts, type Product } from '../../services/api';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Autocomplete state (crash-proofed)
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const searchContainerRef = useRef<HTMLFormElement>(null);

  // Fetch all products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts();
        setAllProducts(Array.isArray(products?.data) ? products.data : (Array.isArray(products) ? products : []));
      } catch (error) {
        console.error("Error fetching products for autocomplete", error);
        setAllProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // Filter products based on search query with strict safety checks
  useEffect(() => {
    try {
      if (searchQuery?.trim().length > 1) {
        const query = searchQuery.toLowerCase().trim();
        const productList = Array.isArray(allProducts) ? allProducts : [];
        
        const filtered = productList.filter(
          (p) => 
            p?.nombre?.toLowerCase().includes(query) || 
            p?.sku?.toLowerCase().includes(query)
        ).slice(0, 5); // Take top 5
        setSuggestions(filtered);
      } else {
        setSuggestions([]);
      }
    } catch (e) {
      console.error("Error filtering suggestions", e);
      setSuggestions([]);
    }
  }, [searchQuery, allProducts]);

  // Click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery?.trim()) {
      navigate(`/catalogo?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (product: Product) => {
    if (product?.nombre) {
      setSearchQuery(product.nombre);
      setShowSuggestions(false);
      navigate(`/catalogo?q=${encodeURIComponent(product.nombre)}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="w-full font-sans">
      {/* 1. TOP BAR: Contacto y Redes */}
      <div className="hidden md:flex bg-gray-100 text-text-muted py-1.5 px-4 md:px-8 text-xs justify-between items-center border-b border-border">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Phone size={14} className="text-primary" /> 
            Atención al cliente: <strong className="text-secondary">+51 987 654 321</strong>
          </span>
          <span className="text-gray-300">|</span>
          <span>Envíos a todo el Perú 🚚</span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="font-medium">Síguenos:</span>
          <a href="#" className="hover:text-primary transition-colors text-text-muted">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="#" className="hover:text-primary transition-colors text-text-muted">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <div className="bg-white py-5 px-4 md:px-8 flex items-center justify-between gap-4 lg:gap-8">
        
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img 
            src="/brand/logo.png" 
            alt="Chamo Import Logo" 
            className="h-12 md:h-16 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.insertAdjacentHTML('beforeend', '<span class="text-3xl font-title font-black tracking-tight text-primary">CHAMO<span class="text-secondary">IMPORT</span></span>');
            }}
          />
        </Link>

        {/* Buscador Central con Autocompletado */}
        <form 
          ref={searchContainerRef}
          onSubmit={handleSearch} 
          className="hidden lg:flex flex-1 max-w-3xl relative group"
        >
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value ?? '')}
            onFocus={() => setShowSuggestions(true)}
            placeholder="¿Qué estás buscando hoy? (Ej. Taladro, Cables, Pegamento...)" 
            className="w-full py-3 px-6 pr-14 bg-white border-2 border-primary/20 rounded-full focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium text-secondary shadow-sm placeholder-gray-400 leading-tight"
          />
          <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary-dark text-white w-10 h-10 rounded-full transition-colors flex items-center justify-center">
            <Search size={18} />
          </button>

          {/* Autocomplete Dropdown (Safe Render) */}
          {showSuggestions && suggestions?.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-white shadow-xl rounded-xl mt-2 overflow-hidden z-50 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
              {suggestions.map((product) => (
                <li 
                  key={product?.id}
                  onClick={() => handleSuggestionClick(product)}
                  className="px-5 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors border-b border-gray-50 last:border-none"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Search size={14} />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-secondary font-semibold text-sm truncate">{product?.nombre}</span>
                    <span className="text-gray-400 text-xs font-mono">SKU: {product?.sku}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </form>

        {/* Acciones */}
        <div className="hidden lg:flex items-center gap-4">
          <button 
            onClick={openQuoteModal}
            className="bg-accent hover:bg-accent/90 text-white px-6 py-2.5 rounded-full font-title font-semibold text-sm transition-all shadow-sm hover:shadow-md hover:shadow-accent/40"
          >
            SOLICITAR COTIZACIÓN
          </button>
          
          <button className="group relative flex items-center gap-3 bg-secondary hover:bg-secondary/90 text-white px-5 py-2.5 rounded-full transition-all shadow-sm hover:shadow-md">
            <ShoppingCart size={20} className="text-accent group-hover:scale-110 transition-transform" />
            <div className="flex flex-col items-start leading-tight">
              <span className="text-[10px] text-gray-300 font-medium uppercase tracking-wider">Mi Carrito</span>
              <span className="text-sm font-bold">S/ 0.00</span>
            </div>
            <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[11px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
              0
            </span>
          </button>
        </div>

        {/* Botones Móviles */}
        <div className="flex lg:hidden items-center gap-3">
          <button className="relative text-secondary p-2 bg-gray-100 rounded-full">
            <ShoppingCart size={22} />
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">0</span>
          </button>
          <button 
            className="text-secondary p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* 3. NAVIGATION BAR */}
      <nav className="hidden lg:flex bg-secondary text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto w-full flex items-center">
          
          <div className="relative group bg-primary px-6 py-3.5 flex items-center gap-2 cursor-pointer font-title font-semibold text-sm tracking-wide">
            <Menu size={18} />
            TODAS LAS CATEGORÍAS
            <ChevronDown size={16} className="ml-2 group-hover:rotate-180 transition-transform duration-300" />
            
            <div className="absolute top-full left-0 w-64 bg-white text-secondary shadow-xl rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-100 flex flex-col py-2">
              <Link to="/catalogo?categoria=herramientas" className="px-5 py-2.5 hover:bg-gray-50 hover:text-primary font-medium transition-colors border-b border-gray-50">🛠️ Herramientas</Link>
              <Link to="/catalogo?categoria=electricos" className="px-5 py-2.5 hover:bg-gray-50 hover:text-primary font-medium transition-colors border-b border-gray-50">⚡ Eléctricos</Link>
              <Link to="/catalogo?categoria=adhesivos" className="px-5 py-2.5 hover:bg-gray-50 hover:text-primary font-medium transition-colors border-b border-gray-50">🧴 Adhesivos y Cintas</Link>
              <Link to="/catalogo?categoria=iluminacion" className="px-5 py-2.5 hover:bg-gray-50 hover:text-primary font-medium transition-colors border-b border-gray-50">💡 Iluminación</Link>
              <Link to="/catalogo" className="px-5 py-2.5 hover:bg-gray-50 hover:text-primary font-bold transition-colors text-primary text-center text-xs uppercase mt-1">Ver todo el catálogo</Link>
            </div>
          </div>

          <div className="flex gap-8 px-8 text-sm font-medium">
            <Link to="/" className="hover:text-accent transition-colors py-3.5 border-b-2 border-transparent hover:border-accent">Inicio</Link>
            <Link to="/nosotros" className="hover:text-accent transition-colors py-3.5 border-b-2 border-transparent hover:border-accent">Nosotros</Link>
            <Link to="/catalogo" className="hover:text-accent transition-colors py-3.5 border-b-2 border-transparent hover:border-accent flex items-center gap-1">Tienda <span className="bg-accent text-white text-[9px] px-1.5 py-0.5 rounded-sm ml-1 font-bold">NUEVO</span></Link>
            <Link to="/contacto" className="hover:text-accent transition-colors py-3.5 border-b-2 border-transparent hover:border-accent">Contáctanos</Link>
          </div>
        </div>
      </nav>

      {/* Menú Móvil Desplegable */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute w-full bg-white z-50 shadow-2xl border-t border-gray-100">
          <div className="p-4 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value ?? '')}
                placeholder="Buscar productos..." 
                className="w-full py-2.5 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
              <button type="submit" className="absolute left-3 top-3">
                <Search size={18} className="text-gray-400" />
              </button>
            </form>
            
            <nav className="flex flex-col border-t border-gray-100 pt-2">
              <Link to="/" className="py-3 font-medium text-secondary hover:text-primary border-b border-gray-50">Inicio</Link>
              <Link to="/catalogo" className="py-3 font-medium text-secondary hover:text-primary border-b border-gray-50">Tienda</Link>
              <Link to="/catalogo?categoria=herramientas" className="py-3 pl-4 font-medium text-gray-500 hover:text-primary border-b border-gray-50 text-sm">- Categorías</Link>
              <Link to="/nosotros" className="py-3 font-medium text-secondary hover:text-primary border-b border-gray-50">Nosotros</Link>
              <Link to="/contacto" className="py-3 font-medium text-secondary hover:text-primary">Contáctanos</Link>
            </nav>

            <div className="pt-2 flex flex-col gap-3">
              <button onClick={() => { openQuoteModal(); setIsMobileMenuOpen(false); }} className="w-full bg-accent text-white py-3 rounded-lg font-bold text-center">SOLICITAR COTIZACIÓN</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}