import { useEffect, useState, useMemo, type FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  PackageSearch,
} from 'lucide-react';
import {
  getProducts,
  getCategories,
  type Product,
  type Category,
} from '../services/api';
import ProductCard from '../components/catalog/ProductCard';

/* ================================================================
   SKELETON COMPONENTS
   ================================================================ */

const ProductCardSkeleton: FC = () => (
  <div className="animate-pulse flex flex-col bg-white rounded-2xl border border-border overflow-hidden">
    <div className="aspect-square bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-3 bg-gray-200 rounded w-16" />
      <div className="space-y-1.5">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>
      <div className="h-3 bg-gray-200 rounded w-20" />
      <div className="h-6 bg-gray-200 rounded w-28 mt-2" />
      <div className="h-10 bg-gray-200 rounded-xl w-full mt-3" />
    </div>
  </div>
);

const SidebarSkeleton: FC = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-5 bg-gray-200 rounded w-32" />
    {[...Array(6)].map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <div className="h-4 w-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded flex-1" />
      </div>
    ))}
    <div className="h-px bg-gray-200 my-4" />
    <div className="h-5 bg-gray-200 rounded w-28" />
    <div className="h-10 bg-gray-200 rounded-lg w-full" />
    <div className="h-10 bg-gray-200 rounded-lg w-full" />
  </div>
);

/* ================================================================
   TEXT NORMALIZATION
   ================================================================ */

const normalize = (str: string) =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

/* ================================================================
   PRICE RANGE UTILITIES
   ================================================================ */

interface PriceRange {
  label: string;
  min: number;
  max: number;
}

const PRICE_RANGES: PriceRange[] = [
  { label: 'Menos de S/ 10',       min: 0,    max: 10 },
  { label: 'S/ 10 – S/ 50',        min: 10,   max: 50 },
  { label: 'S/ 50 – S/ 100',       min: 50,   max: 100 },
  { label: 'S/ 100 – S/ 200',      min: 100,  max: 200 },
  { label: 'Más de S/ 200',        min: 200,  max: Infinity },
];

/* ================================================================
   SORT OPTIONS
   ================================================================ */

type SortKey = 'relevancia' | 'precio-asc' | 'precio-desc' | 'nombre-asc';

interface SortOption {
  key: SortKey;
  label: string;
}

const SORT_OPTIONS: SortOption[] = [
  { key: 'relevancia',  label: 'Relevancia' },
  { key: 'precio-asc',  label: 'Precio: Menor a Mayor' },
  { key: 'precio-desc', label: 'Precio: Mayor a Menor' },
  { key: 'nombre-asc',  label: 'Nombre: A – Z' },
];

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

export default function Catalogo() {
  const [searchParams, setSearchParams] = useSearchParams();

  /* ── Data State ─── */
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  /* ── Filter State derived from URL (single source of truth) ─── */
  const selectedCategories = useMemo(
    () => searchParams.getAll('categoria'),
    [searchParams]
  );
  const selectedBrands = useMemo(
    () => searchParams.getAll('marca'),
    [searchParams]
  );
  const inStockOnly = searchParams.get('stock') === '1';
  const selectedPriceRange = useMemo(() => {
    const v = searchParams.get('precio');
    return v !== null ? Number(v) : null;
  }, [searchParams]);
  const sortBy = (searchParams.get('orden') as SortKey) ?? 'relevancia';

  /* ── Search query (local + debounced, synced to URL) ─── */
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') ?? '');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(() => searchParams.get('q') ?? '');

  /* ── Pagination State (RF-09) ─── */
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  /* ── UI State ─── */
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);
  const [brandsExpanded, setBrandsExpanded] = useState(true);
  const [priceExpanded, setPriceExpanded] = useState(true);

  /* ── Fetch data on mount ─── */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setProducts(productsData || []);
      setCategories(categoriesData || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  /* ── Helper: update searchParams while keeping unrelated params intact ─── */
  const updateParams = (updater: (next: URLSearchParams) => void) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        updater(next);
        return next;
      },
      { replace: true }
    );
  };

  /* ── Extract unique brands ─── */
  const uniqueBrands = useMemo(() => {
    const brands = products.map(p => p.marca);
    return Array.from(new Set(brands)).sort();
  }, [products]);

  /* ── Debounce Search (RF-06) ─── */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  /* ── Reset Pagination when filters change ─── */
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery, selectedCategories, selectedBrands, inStockOnly, selectedPriceRange, sortBy]);

  /* ── Filtered & sorted products (memoized) ─── */
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.categoria));
    }

    // Brands filter
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.marca));
    }

    // Stock filter
    if (inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    // Search filter (by name, SKU, or BRAND)
    if (debouncedSearchQuery.trim()) {
      const q = normalize(debouncedSearchQuery.trim());
      result = result.filter(
        (p) =>
          normalize(p.nombre).includes(q) ||
          normalize(p.sku).includes(q) ||
          normalize(p.marca).includes(q)
      );
    }

    // Price range filter
    if (selectedPriceRange !== null) {
      const range = PRICE_RANGES[selectedPriceRange];
      result = result.filter(
        (p) => p.precio >= range.min && p.precio < range.max
      );
    }

    // Sorting
    switch (sortBy) {
      case 'precio-asc':
        result.sort((a, b) => a.precio - b.precio);
        break;
      case 'precio-desc':
        result.sort((a, b) => b.precio - a.precio);
        break;
      case 'nombre-asc':
        result.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'relevancia':
      default:
        // Featured products first, then by ID to ensure stable sort
        result.sort((a, b) => {
          if (a.destacado && !b.destacado) return -1;
          if (!a.destacado && b.destacado) return 1;
          return a.id.localeCompare(b.id);
        });
        break;
    }

    return result;
  }, [products, selectedCategories, selectedBrands, inStockOnly, debouncedSearchQuery, selectedPriceRange, sortBy]);

  /* ── Displayed Products (Pagination) ─── */
  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, page * ITEMS_PER_PAGE);
  }, [filteredProducts, page]);

  /* ── Active filter count (for badge) ─── */
  const activeFilterCount = selectedCategories.length + selectedBrands.length + (inStockOnly ? 1 : 0) + (selectedPriceRange !== null ? 1 : 0);

  /* ── Clear all filters ─── */
  const clearAllFilters = () => {
    setSearchQuery('');
    setSearchParams({}, { replace: true });
  };

  const toggleCategory = (catId: string) => {
    updateParams((next) => {
      const current = next.getAll('categoria');
      next.delete('categoria');
      if (current.includes(catId)) {
        current.filter((c) => c !== catId).forEach((c) => next.append('categoria', c));
      } else {
        [...current, catId].forEach((c) => next.append('categoria', c));
      }
    });
  };

  const toggleBrand = (brand: string) => {
    updateParams((next) => {
      const current = next.getAll('marca');
      next.delete('marca');
      if (current.includes(brand)) {
        current.filter((b) => b !== brand).forEach((b) => next.append('marca', b));
      } else {
        [...current, brand].forEach((b) => next.append('marca', b));
      }
    });
  };

  /* ================================================================
     SIDEBAR CONTENT (shared between desktop & mobile)
     ================================================================ */
  const FilterContent: FC = () => (
    <div className="space-y-6">
      {/* ── Active Filters Summary ─── */}
      {activeFilterCount > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-text-muted">
            {activeFilterCount} filtro{activeFilterCount > 1 ? 's' : ''} activo{activeFilterCount > 1 ? 's' : ''}
          </span>
          <button
            onClick={clearAllFilters}
            className="text-xs text-red-500 hover:text-red-700 font-semibold transition-colors"
          >
            Limpiar todo
          </button>
        </div>
      )}

      {/* ── STOCK FILTER ─── */}
      <label className="flex items-center gap-3 cursor-pointer group">
        <input 
          type="checkbox" 
          checked={inStockOnly}
          onChange={(e) =>
            updateParams((next) => {
              if (e.target.checked) next.set('stock', '1');
              else next.delete('stock');
            })
          }
          className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 transition-colors cursor-pointer"
        />
        <span className="text-sm font-medium text-secondary group-hover:text-primary transition-colors">
          Solo disponibles (Con Stock)
        </span>
      </label>

      {/* ── DIVIDER ─── */}
      <div className="h-px bg-border" />

      {/* ── CATEGORY FILTER ─── */}
      <div>
        <button
          onClick={() => setCategoriesExpanded(!categoriesExpanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-title font-bold text-secondary text-sm uppercase tracking-wide">
            Categorías
          </h3>
          {categoriesExpanded ? (
            <ChevronUp size={16} className="text-text-muted" />
          ) : (
            <ChevronDown size={16} className="text-text-muted" />
          )}
        </button>

        {categoriesExpanded && (
          <div className="mt-4 space-y-2.5">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={selectedCategories.includes(cat.id)}
                  onChange={() => toggleCategory(cat.id)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 transition-colors cursor-pointer"
                />
                <span className="text-sm font-medium text-text-muted group-hover:text-secondary transition-colors flex-1">
                  {cat.nombre}
                </span>
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
                  {products.filter((p) => p.categoria === cat.id).length}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* ── DIVIDER ─── */}
      <div className="h-px bg-border" />

      {/* ── BRAND FILTER ─── */}
      <div>
        <button
          onClick={() => setBrandsExpanded(!brandsExpanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-title font-bold text-secondary text-sm uppercase tracking-wide">
            Marcas
          </h3>
          {brandsExpanded ? (
            <ChevronUp size={16} className="text-text-muted" />
          ) : (
            <ChevronDown size={16} className="text-text-muted" />
          )}
        </button>

        {brandsExpanded && (
          <div className="mt-4 space-y-2.5 max-h-48 overflow-y-auto pr-2">
            {uniqueBrands.map((brand) => (
              <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 transition-colors cursor-pointer"
                />
                <span className="text-sm font-medium text-text-muted group-hover:text-secondary transition-colors flex-1">
                  {brand}
                </span>
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
                  {products.filter((p) => p.marca === brand).length}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* ── DIVIDER ─── */}
      <div className="h-px bg-border" />

      {/* ── PRICE RANGE FILTER ─── */}
      <div>
        <button
          onClick={() => setPriceExpanded(!priceExpanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-title font-bold text-secondary text-sm uppercase tracking-wide">
            Rango de Precio
          </h3>
          {priceExpanded ? (
            <ChevronUp size={16} className="text-text-muted" />
          ) : (
            <ChevronDown size={16} className="text-text-muted" />
          )}
        </button>

        {priceExpanded && (
          <div className="mt-3 space-y-1">
            {PRICE_RANGES.map((range, idx) => (
              <button
                key={idx}
                onClick={() =>
                  updateParams((next) => {
                    if (selectedPriceRange === idx) next.delete('precio');
                    else next.set('precio', String(idx));
                  })
                }
                className={`
                  w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    selectedPriceRange === idx
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-text-muted hover:bg-gray-50 hover:text-secondary'
                  }
                `}
              >
                {range.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  /* ================================================================
     RENDER
     ================================================================ */
  return (
    <section className="min-h-screen bg-bg pb-12">
      {/* ── PAGE HEADER ─── */}
      <div 
        className="relative text-white" 
        style={{ backgroundImage: "url('/hero-catalogo.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-secondary/85 mix-blend-multiply"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-title font-black tracking-tight mb-2 text-white">
            Catálogo de Productos
          </h1>
          <p className="text-white/70 text-sm md:text-base max-w-xl">
            Explora nuestra amplia variedad de productos de ferretería, eléctricos,
            iluminación, adhesivos y mucho más.
          </p>
        </div>
      </div>

      {/* ── TOOLBAR ─── */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, SKU o Marca..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-secondary placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Sort Dropdown (desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) =>
                updateParams((next) => {
                  if (e.target.value === 'relevancia') next.delete('orden');
                  else next.set('orden', e.target.value);
                })
              }
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer appearance-none pr-8"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
              }}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-secondary hover:bg-gray-100 transition-colors relative"
          >
            <SlidersHorizontal size={16} />
            Filtros
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Results count */}
          {!loading && (
            <span className="hidden sm:block text-xs text-text-muted whitespace-nowrap ml-auto font-medium">
              Mostrando {displayedProducts.length} de {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* ── MAIN CONTENT AREA ─── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex gap-8">
          {/* ────── DESKTOP SIDEBAR ────── */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-border shadow-sm p-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
              {loading ? <SidebarSkeleton /> : <FilterContent />}
            </div>
          </aside>

          {/* ────── PRODUCT GRID ────── */}
          <div className="flex-1 min-w-0">
            {loading ? (
              /* Loading Skeletons (RF-17) */
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {[...Array(12)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : displayedProducts.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="bg-gray-50 rounded-full p-6 mb-6 border border-gray-100">
                  <PackageSearch size={48} className="text-gray-300" />
                </div>
                <h3 className="font-title font-bold text-xl text-secondary mb-2">
                  No encontramos productos
                </h3>
                <p className="text-text-muted text-sm max-w-sm mb-6">
                  Intenta ajustar tus filtros de búsqueda o explora todas nuestras categorías para encontrar lo que necesitas.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5"
                >
                  Limpiar todos los filtros
                </button>
              </div>
            ) : (
              /* Product Grid & Load More */
              <div className="space-y-12">
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {displayedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                
                {/* Pagination Load More Button */}
                {displayedProducts.length < filteredProducts.length && (
                  <div className="flex justify-center">
                    <button
                      onClick={() => setPage((prev) => prev + 1)}
                      className="bg-white border-2 border-gray-200 hover:border-primary text-secondary hover:text-primary px-8 py-3 rounded-full font-bold transition-all shadow-sm hover:shadow-md"
                    >
                      Cargar más productos
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MOBILE FILTERS MODAL ─── */}
      {mobileFiltersOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-50 lg:hidden shadow-2xl flex flex-col animate-slide-in-left">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-title font-bold text-lg text-secondary flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-primary" />
                Filtros
              </h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="text-text-muted hover:text-secondary p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 border-b border-border">
              <h3 className="font-title font-bold text-secondary text-sm uppercase tracking-wide mb-3">
                Ordenar por
              </h3>
              <div className="space-y-1">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() =>
                      updateParams((next) => {
                        if (opt.key === 'relevancia') next.delete('orden');
                        else next.set('orden', opt.key);
                      })
                    }
                    className={`
                      w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${
                        sortBy === opt.key
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-text-muted hover:bg-gray-50 hover:text-secondary'
                      }
                    `}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <FilterContent />
            </div>

            <div className="p-5 border-t border-border bg-gray-50">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-primary hover:bg-primary-dark text-white py-3.5 rounded-xl font-title font-semibold text-sm transition-all shadow-sm hover:shadow-md"
              >
                Ver {filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
