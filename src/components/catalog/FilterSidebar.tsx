import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Category, Product } from '../../services/api';

/* ================================================================
   PRICE RANGE UTILITIES  (co-located — consumed only by this file)
   ================================================================ */

export interface PriceRange {
  label: string;
  min: number;
  max: number;
}

export const PRICE_RANGES: PriceRange[] = [
  { label: 'Menos de S/ 10',  min: 0,   max: 10 },
  { label: 'S/ 10 – S/ 50',  min: 10,  max: 50 },
  { label: 'S/ 50 – S/ 100', min: 50,  max: 100 },
  { label: 'S/ 100 – S/ 200',min: 100, max: 200 },
  { label: 'Más de S/ 200',  min: 200, max: Infinity },
];

/* ================================================================
   SIDEBAR SKELETON
   ================================================================ */

export const SidebarSkeleton = () => (
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
   PROPS
   ================================================================ */

export interface FilterSidebarProps {
  /** Source data */
  categories: Category[];
  products:   Product[];
  uniqueBrands: string[];

  /** Derived filter state (from URL) */
  selectedCategories: string[];
  selectedBrands:     string[];
  inStockOnly:        boolean;
  selectedPriceRange: number | null;
  activeFilterCount:  number;

  /** Mutators — each writes directly to the URL via updateParams in parent */
  onToggleCategory:   (id: string) => void;
  onToggleBrand:      (brand: string) => void;
  onStockChange:      (checked: boolean) => void;
  onPriceRangeChange: (idx: number | null) => void;
  onClearAll:         () => void;
}

/* ================================================================
   COMPONENT
   ================================================================ */

export default function FilterSidebar({
  categories,
  products,
  uniqueBrands,
  selectedCategories,
  selectedBrands,
  inStockOnly,
  selectedPriceRange,
  activeFilterCount,
  onToggleCategory,
  onToggleBrand,
  onStockChange,
  onPriceRangeChange,
  onClearAll,
}: FilterSidebarProps) {
  /* ── Local UI-only state for accordion sections ─── */
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);
  const [brandsExpanded, setBrandsExpanded] = useState(true);
  const [priceExpanded, setPriceExpanded] = useState(true);

  return (
    <div className="space-y-6">
      {/* ── Active Filters Summary ─── */}
      {activeFilterCount > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-text-muted">
            {activeFilterCount} filtro{activeFilterCount > 1 ? 's' : ''} activo{activeFilterCount > 1 ? 's' : ''}
          </span>
          <button
            onClick={onClearAll}
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
          onChange={(e) => onStockChange(e.target.checked)}
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
          onClick={() => setCategoriesExpanded((v) => !v)}
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
                  onChange={() => onToggleCategory(cat.id)}
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
          onClick={() => setBrandsExpanded((v) => !v)}
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
                  onChange={() => onToggleBrand(brand)}
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
          onClick={() => setPriceExpanded((v) => !v)}
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
                onClick={() => onPriceRangeChange(selectedPriceRange === idx ? null : idx)}
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
}
