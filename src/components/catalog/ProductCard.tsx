import { useState, type FC } from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { type Product } from '../../services/api';

interface ProductCardProps {
  product: Product;
}

/** Map tag names to visual styles */
const TAG_STYLES: Record<string, { bg: string; text: string }> = {
  'Oferta':      { bg: 'bg-red-500',    text: 'text-white' },
  'Agotado':     { bg: 'bg-gray-600',   text: 'text-white' },
  'Nuevo':       { bg: 'bg-emerald-500', text: 'text-white' },
  'Destacado':   { bg: 'bg-amber-500',  text: 'text-white' },
  'Más vendido': { bg: 'bg-primary',    text: 'text-white' },
};

const getTagStyle = (tag: string) =>
  TAG_STYLES[tag] ?? { bg: 'bg-accent', text: 'text-white' };

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const [imgError, setImgError] = useState(false);
  const hasImage = product.imagenes.length > 0 && !imgError;
  const isOutOfStock = product.stock === 0;
  const discount =
    product.precioAnterior !== null
      ? Math.round(((product.precioAnterior - product.precio) / product.precioAnterior) * 100)
      : null;

  return (
    <article className="group relative flex flex-col bg-white rounded-2xl border border-border shadow-sm hover:shadow-xl hover:shadow-primary/8 transition-all duration-300 overflow-hidden">
      {/* ──── BADGES ──── */}
      {product.etiquetas.length > 0 && (
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
          {product.etiquetas.map((tag) => {
            const style = getTagStyle(tag);
            return (
              <span
                key={tag}
                className={`${style.bg} ${style.text} text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm`}
              >
                {tag}
              </span>
            );
          })}
        </div>
      )}

      {/* ──── DISCOUNT PERCENTAGE BADGE ──── */}
      {discount !== null && discount > 0 && (
        <div className="absolute top-3 right-3 z-20 bg-red-500 text-white text-xs font-black px-2 py-1 rounded-lg shadow-md">
          -{discount}%
        </div>
      )}

      {/* ──── IMAGE AREA ──── */}
      <Link
        to={`/producto/${product.id}`}
        className="relative aspect-square overflow-hidden bg-gray-50"
      >
        {hasImage ? (
          <img
            src={product.imagenes[0]}
            alt={product.nombre}
            loading="lazy"
            className={`
              w-full h-full object-cover
              group-hover:scale-110 transition-transform duration-500 ease-out
              ${isOutOfStock ? 'opacity-50 grayscale' : ''}
            `}
            onError={() => setImgError(true)}
          />
        ) : (
          /* Fallback: accent-colored gradient with product initials */
          <div className="w-full h-full bg-gradient-to-br from-accent/20 via-primary/10 to-accent/5 flex items-center justify-center">
            <span className="text-5xl font-title font-black text-primary/20 select-none">
              {product.nombre
                .split(' ')
                .slice(0, 2)
                .map((w) => w[0])
                .join('')
                .toUpperCase()}
            </span>
          </div>
        )}

        {/* Hover overlay with quick-view icon */}
        <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/10 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <span className="bg-white/90 backdrop-blur-sm text-secondary p-3 rounded-full shadow-lg flex items-center justify-center">
              <Eye size={20} />
            </span>
          </div>
        </div>

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
            <span className="bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
              Agotado
            </span>
          </div>
        )}
      </Link>

      {/* ──── PRODUCT INFO ──── */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Brand */}
        <span className="text-[11px] font-semibold uppercase tracking-widest text-accent">
          {product.marca}
        </span>

        {/* Product name — truncated to 2 lines */}
        <Link to={`/producto/${product.id}`}>
          <h3 className="font-sans font-semibold text-sm text-secondary leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {product.nombre}
          </h3>
        </Link>

        {/* SKU */}
        <span className="text-[10px] text-text-muted tracking-wide">
          SKU: {product.sku}
        </span>

        {/* Spacer to push price & button to the bottom */}
        <div className="flex-1" />

        {/* Pricing */}
        <div className="flex items-end gap-2 mt-1">
          <span className="text-xl font-title font-black text-secondary">
            S/ {product.precio.toFixed(2)}
          </span>
          {product.precioAnterior !== null && (
            <span className="text-sm text-gray-400 line-through mb-0.5">
              S/ {product.precioAnterior.toFixed(2)}
            </span>
          )}
        </div>

        {/* Wholesale hint */}
        <span className="text-[10px] text-text-muted">
          Mayorista: <strong className="text-primary">S/ {product.precioMayorista.toFixed(2)}</strong>
        </span>

        {/* Add to Cart Button */}
        <button
          disabled={isOutOfStock}
          className={`
            mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
            font-title font-semibold text-sm tracking-wide
            transition-all duration-300
            ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-primary-dark text-white shadow-sm hover:shadow-md hover:shadow-primary/30 active:scale-[0.97]'
            }
          `}
        >
          <ShoppingCart size={16} />
          {isOutOfStock ? 'Sin Stock' : 'Agregar al Carrito'}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
