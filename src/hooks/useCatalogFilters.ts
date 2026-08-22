import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories, type Product, type Category } from '../services/api';
import { PRICE_RANGES } from '../components/catalog/FilterSidebar';

/* ================================================================
   TYPES
   ================================================================ */

export type SortKey = 'relevancia' | 'precio-asc' | 'precio-desc' | 'nombre-asc';

export interface SortOption {
  key: SortKey;
  label: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { key: 'relevancia',  label: 'Relevancia' },
  { key: 'precio-asc',  label: 'Precio: Menor a Mayor' },
  { key: 'precio-desc', label: 'Precio: Mayor a Menor' },
  { key: 'nombre-asc',  label: 'Nombre: A – Z' },
];

/* ================================================================
   NORMALIZATION UTILITY
   Strips accents so "lapices" matches "Lápices"
   ================================================================ */

export const normalize = (str: string) =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

/* ================================================================
   HOOK
   ================================================================ */

export function useCatalogFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  /* ── Data ─── */
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  /* ── Pagination ─── */
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  /* ── Fetch on mount ─── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      if (!cancelled) {
        setProducts(productsData || []);
        setCategories(categoriesData || []);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  /* ── URL helper ─── */
  const updateParams = useCallback(
    (updater: (next: URLSearchParams) => void) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          updater(next);
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  /* ── Filter state — derived from URL (single source of truth) ─── */
  const selectedCategories = useMemo(() => searchParams.getAll('categoria'), [searchParams]);
  const selectedBrands     = useMemo(() => searchParams.getAll('marca'),     [searchParams]);
  const inStockOnly        = searchParams.get('stock') === '1';
  const selectedPriceRange = useMemo(() => {
    const v = searchParams.get('precio');
    return v !== null ? Number(v) : null;
  }, [searchParams]);
  const sortBy = (searchParams.get('orden') as SortKey) ?? 'relevancia';

  /* ── Search: local controlled value, fully synced with URL ─── */
  // Derive input value directly from URL so external navigation (Header search) is reflected
  const searchQuery = searchParams.get('q') ?? '';

  const setSearchQuery = useCallback(
    (value: string) => {
      updateParams((next) => {
        if (value) next.set('q', value);
        else next.delete('q');
      });
    },
    [updateParams]
  );

  /* ── Debounced search (for filtering only — URL update is immediate) ─── */
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(id);
  }, [searchQuery]);

  /* ── Unique brands ─── */
  const uniqueBrands = useMemo(
    () => Array.from(new Set(products.map((p) => p.marca))).sort(),
    [products]
  );

  /* ── Reset pagination when any filter changes ─── */
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, selectedCategories, selectedBrands, inStockOnly, selectedPriceRange, sortBy]);

  /* ── Filtered & sorted products ─── */
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategories.length > 0)
      result = result.filter((p) => selectedCategories.includes(p.categoria));

    if (selectedBrands.length > 0)
      result = result.filter((p) => selectedBrands.includes(p.marca));

    if (inStockOnly)
      result = result.filter((p) => p.stock > 0);

    if (debouncedQuery.trim()) {
      // normalize BOTH sides so accented chars never block a match
      const q = normalize(debouncedQuery.trim());
      result = result.filter(
        (p) =>
          normalize(p.nombre).includes(q) ||
          normalize(p.sku).includes(q)    ||
          normalize(p.marca).includes(q)
      );
    }

    if (selectedPriceRange !== null) {
      const range = PRICE_RANGES[selectedPriceRange];
      result = result.filter((p) => p.precio >= range.min && p.precio < range.max);
    }

    switch (sortBy) {
      case 'precio-asc':  result.sort((a, b) => a.precio - b.precio); break;
      case 'precio-desc': result.sort((a, b) => b.precio - a.precio); break;
      case 'nombre-asc':  result.sort((a, b) => a.nombre.localeCompare(b.nombre)); break;
      case 'relevancia':
      default:
        result.sort((a, b) => {
          if (a.destacado && !b.destacado) return -1;
          if (!a.destacado && b.destacado) return 1;
          return a.id.localeCompare(b.id);
        });
    }

    return result;
  }, [products, selectedCategories, selectedBrands, inStockOnly, debouncedQuery, selectedPriceRange, sortBy]);

  /* ── Pagination slice ─── */
  const displayedProducts = useMemo(
    () => filteredProducts.slice(0, page * ITEMS_PER_PAGE),
    [filteredProducts, page]
  );

  /* ── Derived counts ─── */
  const activeFilterCount =
    selectedCategories.length +
    selectedBrands.length +
    (inStockOnly ? 1 : 0) +
    (selectedPriceRange !== null ? 1 : 0);

  /* ── Mutators ─── */
  const clearAllFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const toggleCategory = useCallback(
    (catId: string) =>
      updateParams((next) => {
        const cur = next.getAll('categoria');
        next.delete('categoria');
        (cur.includes(catId) ? cur.filter((c) => c !== catId) : [...cur, catId])
          .forEach((c) => next.append('categoria', c));
      }),
    [updateParams]
  );

  const toggleBrand = useCallback(
    (brand: string) =>
      updateParams((next) => {
        const cur = next.getAll('marca');
        next.delete('marca');
        (cur.includes(brand) ? cur.filter((b) => b !== brand) : [...cur, brand])
          .forEach((b) => next.append('marca', b));
      }),
    [updateParams]
  );

  const handleStockChange = useCallback(
    (checked: boolean) =>
      updateParams((next) => {
        if (checked) next.set('stock', '1');
        else next.delete('stock');
      }),
    [updateParams]
  );

  const handlePriceRangeChange = useCallback(
    (idx: number | null) =>
      updateParams((next) => {
        if (idx === null) next.delete('precio');
        else next.set('precio', String(idx));
      }),
    [updateParams]
  );

  const handleSortChange = useCallback(
    (key: string) =>
      updateParams((next) => {
        if (key === 'relevancia') next.delete('orden');
        else next.set('orden', key);
      }),
    [updateParams]
  );

  return {
    /* data */
    products, categories, uniqueBrands, loading,
    /* filter state */
    searchQuery, setSearchQuery,
    selectedCategories, selectedBrands,
    inStockOnly, selectedPriceRange, sortBy,
    activeFilterCount,
    /* computed products */
    filteredProducts, displayedProducts,
    /* pagination */
    page, setPage,
    /* mutators */
    clearAllFilters,
    toggleCategory, toggleBrand,
    handleStockChange, handlePriceRangeChange, handleSortChange,
  };
}
