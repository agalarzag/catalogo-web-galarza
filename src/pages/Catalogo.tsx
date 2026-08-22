import { useState, type FC } from 'react';
import { Search, SlidersHorizontal, X, PackageSearch } from 'lucide-react';
import ProductCard from '../components/catalog/ProductCard';
import FilterSidebar, { SidebarSkeleton } from '../components/catalog/FilterSidebar';
import { useCatalogFilters, SORT_OPTIONS } from '../hooks/useCatalogFilters';

/* ── Skeleton ─── */
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

/* ================================================================
   PAGE COMPONENT
   ================================================================ */

export default function Catalogo() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const {
    products, categories, uniqueBrands, loading,
    searchQuery, setSearchQuery,
    selectedCategories, selectedBrands,
    inStockOnly, selectedPriceRange, sortBy,
    activeFilterCount,
    filteredProducts, displayedProducts,
    page, setPage,
    clearAllFilters,
    toggleCategory, toggleBrand,
    handleStockChange, handlePriceRangeChange, handleSortChange,
  } = useCatalogFilters();

  const sidebarProps = {
    categories, products, uniqueBrands,
    selectedCategories, selectedBrands,
    inStockOnly, selectedPriceRange, activeFilterCount,
    onToggleCategory: toggleCategory,
    onToggleBrand: toggleBrand,
    onStockChange: handleStockChange,
    onPriceRangeChange: handlePriceRangeChange,
    onClearAll: clearAllFilters,
  };

  return (
    <section className="min-h-screen bg-bg pb-12">
      {/* ── PAGE HEADER ─── */}
      <div
        className="relative text-white"
        style={{ backgroundImage: "url('/hero-catalogo.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-secondary/85 mix-blend-multiply" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-title font-black tracking-tight mb-2 text-white">
            Catálogo de Productos
          </h1>
          <p className="text-white/70 text-sm md:text-base max-w-xl">
            Explora nuestra amplia variedad de productos de ferretería, eléctricos, iluminación, adhesivos y mucho más.
          </p>
        </div>
      </div>

      {/* ── TOOLBAR ─── */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
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

          {/* Sort (desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer appearance-none pr-8"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
              }}
            >
              {SORT_OPTIONS.map((opt) => <option key={opt.key} value={opt.key}>{opt.label}</option>)}
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

      {/* ── MAIN CONTENT ─── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-border shadow-sm p-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
              {loading ? <SidebarSkeleton /> : <FilterSidebar {...sidebarProps} />}
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {[...Array(12)].map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="bg-gray-50 rounded-full p-6 mb-6 border border-gray-100">
                  <PackageSearch size={48} className="text-gray-300" />
                </div>
                <h3 className="font-title font-bold text-xl text-secondary mb-2">No encontramos productos</h3>
                <p className="text-text-muted text-sm max-w-sm mb-6">
                  Intenta ajustar tus filtros de búsqueda o explora todas nuestras categorías.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5"
                >
                  Limpiar todos los filtros
                </button>
              </div>
            ) : (
              <div className="space-y-12">
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {displayedProducts.map((product) => <ProductCard key={product.id} product={product} />)}
                </div>
                {displayedProducts.length < filteredProducts.length && (
                  <div className="flex justify-center">
                    <button
                      onClick={() => setPage((p) => p + 1)}
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

      {/* ── MOBILE FILTERS DRAWER ─── */}
      {mobileFiltersOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileFiltersOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-50 lg:hidden shadow-2xl flex flex-col animate-slide-in-left">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-title font-bold text-lg text-secondary flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-primary" />
                Filtros
              </h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="text-text-muted hover:text-secondary p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Sort (mobile) */}
            <div className="p-5 border-b border-border">
              <h3 className="font-title font-bold text-secondary text-sm uppercase tracking-wide mb-3">Ordenar por</h3>
              <div className="space-y-1">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => handleSortChange(opt.key)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${sortBy === opt.key ? 'bg-primary/10 text-primary font-semibold' : 'text-text-muted hover:bg-gray-50 hover:text-secondary'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <FilterSidebar {...sidebarProps} />
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
