import { useEffect, useState, useMemo, useCallback, type FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  List,
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
    {/* Image placeholder */}
    <div className="aspect-square bg-gray-200" />
    {/* Content */}
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

  /* ── Filter State ─── */
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('categoria')
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>('relevancia');

  /* ── UI State ─── */
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);
  const [priceExpanded, setPriceExpanded] = useState(true);

  /* ── Fetch data on mount ─── */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setLoading(false);
    };
    fetchData();
  }, []);

  /* ── Sync URL param → selectedCategory ─── */
  useEffect(() => {
    const catParam = searchParams.get('categoria');
    if (catParam) {
      setSelectedCategory(catParam);
    }
  }, [searchParams]);

  /* ── Update URL when category changes ─── */
  const handleCategoryChange = useCallback(
    (catId: string | null) => {
      setSelectedCategory(catId);
      if (catId) {
        setSearchParams({ categoria: catId });
      } else {
        setSearchParams({});
      }
    },
    [setSearchParams]
  );

  /* ── Filtered & sorted products (memoized) ─── */
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory) {
      result = result.filter((p) => p.categoria === selectedCategory);
    }

    // Search filter (by name or SKU)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
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
        // Featured products first, then by id
        result.sort((a, b) => {
          if (a.destacado && !b.destacado) return -1;
          if (!a.destacado && b.destacado) return 1;
          return 0;
        });
        break;
    }

    return result;
  }, [products, selectedCategory, searchQuery, selectedPriceRange, sortBy]);

  /* ── Active filter count (for badge) ─── */
  const activeFilterCount = [
    selectedCategory !== null,
    selectedPriceRange !== null,
    searchQuery.trim().length > 0,
  ].filter(Boolean).length;

  /* ── Clear all filters ─── */
  const clearAllFilters = () => {
    setSearchQuery('');
    handleCategoryChange(null);
    setSelectedPriceRange(null);
    setSortBy('relevancia');
  };

  /* ── Get the readable category name ─── */
  const getCategoryName = (catId: string) =>
    categories.find((c) => c.id === catId)?.nombre ?? catId;

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
          <div className="mt-3 space-y-1">
            {/* "Todas" option */}
            <button
              onClick={() => handleCategoryChange(null)}
              className={`
                w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  selectedCategory === null
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-text-muted hover:bg-gray-50 hover:text-secondary'
                }
              `}
            >
              Todas las categorías
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`
                  w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    selectedCategory === cat.id
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-text-muted hover:bg-gray-50 hover:text-secondary'
                  }
                `}
              >
                {cat.nombre}
                {/* Count */}
                <span className="ml-auto float-right text-xs opacity-60">
                  {products.filter((p) => p.categoria === cat.id).length}
                </span>
              </button>
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
                  setSelectedPriceRange(selectedPriceRange === idx ? null : idx)
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
    <section className="min-h-screen bg-bg">
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

          {/* Breadcrumb-style active filters */}
          {selectedCategory && !loading && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-white/50 text-xs">Filtrado por:</span>
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                {getCategoryName(selectedCategory)}
                <button
                  onClick={() => handleCategoryChange(null)}
                  className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                >
                  <X size={12} />
                </button>
              </span>
            </div>
          )}
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
              placeholder="Buscar por nombre o SKU..."
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
              onChange={(e) => setSortBy(e.target.value as SortKey)}
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
            <span className="hidden sm:block text-xs text-text-muted whitespace-nowrap ml-auto">
              {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* ── MAIN CONTENT AREA ─── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex gap-8">
          {/* ────── DESKTOP SIDEBAR ────── */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-20 bg-white rounded-2xl border border-border shadow-sm p-6">
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
            ) : filteredProducts.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-gray-100 rounded-full p-6 mb-6">
                  <PackageSearch size={48} className="text-gray-400" />
                </div>
                <h3 className="font-title font-bold text-xl text-secondary mb-2">
                  No encontramos productos
                </h3>
                <p className="text-text-muted text-sm max-w-sm mb-6">
                  Intenta ajustar tus filtros de búsqueda o explora todas nuestras categorías.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-md"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              /* Product Grid */
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MOBILE FILTERS MODAL ─── */}
      {mobileFiltersOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileFiltersOpen(false)}
          />
          {/* Panel */}
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-50 lg:hidden shadow-2xl flex flex-col animate-slide-in-left">
            {/* Modal Header */}
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

            {/* Mobile Sort (shown in modal for mobile) */}
            <div className="p-5 border-b border-border">
              <h3 className="font-title font-bold text-secondary text-sm uppercase tracking-wide mb-3">
                Ordenar por
              </h3>
              <div className="space-y-1">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setSortBy(opt.key)}
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

            {/* Filters */}
            <div className="flex-1 overflow-y-auto p-5">
              <FilterContent />
            </div>

            {/* Apply button */}
            <div className="p-5 border-t border-border">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-title font-semibold text-sm transition-all shadow-sm hover:shadow-md"
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
