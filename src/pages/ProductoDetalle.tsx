import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProducts, type Product } from '../services/api';
import ProductCard from '../components/catalog/ProductCard';
import { ShoppingCart, MessageCircle, ChevronRight, PackageSearch } from 'lucide-react';
import { openQuoteModal } from '../components/common/QuoteModal';

export default function ProductoDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await getProducts();
        const products: Product[] = Array.isArray(response?.data) 
          ? response.data 
          : Array.isArray(response) ? response : [];
        
        const found = products.find(p => p.id === id);
        
        if (found) {
          setProduct(found);
          // Related products (same category, different ID)
          const related = products
            .filter(p => p.categoria === found.categoria && p.id !== id)
            .slice(0, 4);
          setRelatedProducts(related);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
    // Scroll to top when changing products
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-bg">
        <div className="bg-gray-100 rounded-full p-8 mb-6">
          <PackageSearch size={64} className="text-gray-400" />
        </div>
        <h2 className="text-3xl font-title font-bold text-secondary mb-4">
          Producto no encontrado
        </h2>
        <p className="text-text-muted mb-8 max-w-md">
          {error ? "Hubo un error al cargar el producto." : "El producto que buscas ya no existe o el enlace es incorrecto."}
        </p>
        <button 
          onClick={() => navigate('/catalogo')}
          className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all"
        >
          Volver al Catálogo
        </button>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(val);

  const mainImage = (product.imagenes && product.imagenes.length > 0) 
    ? product.imagenes[0] 
    : '/products/placeholder.jpg';

  const isOutOfStock = product.stock === 0;

  return (
    <div className="min-h-screen bg-bg py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center text-xs font-medium text-text-muted mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
          <ChevronRight size={14} className="mx-1" />
          <Link to="/catalogo" className="hover:text-primary transition-colors">Catálogo</Link>
          <ChevronRight size={14} className="mx-1" />
          <Link to={`/catalogo?categoria=${product.categoria}`} className="hover:text-primary transition-colors capitalize">
            {product.categoria.replace('cat-', '')}
          </Link>
          <ChevronRight size={14} className="mx-1" />
          <span className="text-secondary truncate">{product.nombre}</span>
        </nav>

        {/* Top Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left Column: Image */}
            <div className="p-8 lg:p-12 flex items-center justify-center bg-gray-50/50">
              <div className="relative w-full max-w-md aspect-square bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex items-center justify-center">
                <img 
                  src={mainImage} 
                  alt={product.nombre}
                  className="w-full h-full object-contain p-4 transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgNDAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YzZjRGNiIvPjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmaWxsPSIjOWNhM2FmIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+U2luIGltYWdlbjwvdGV4dD48L3N2Zz4=';
                  }}
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.destacado && (
                    <span className="bg-accent text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      Destacado
                    </span>
                  )}
                  {product.etiquetas?.map((tag) => (
                    <span key={tag} className="bg-secondary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Details */}
            <div className="p-8 lg:p-12 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-gray-100">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                {product.marca}
              </span>
              
              <h1 className="text-3xl md:text-4xl font-title font-black text-secondary mb-3 leading-tight">
                {product.nombre}
              </h1>
              
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                <span className="text-sm font-mono text-gray-400 bg-gray-50 px-3 py-1 rounded-lg border border-gray-200">
                  SKU: {product.sku}
                </span>
                <span className={`text-sm font-bold px-4 py-1.5 rounded-full ${isOutOfStock ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                  {isOutOfStock ? "Agotado" : "Stock disponible"}
                </span>
              </div>

              {/* Price Block */}
              <div className="mb-8 space-y-2">
                {product.precioAnterior && (
                  <div className="text-sm text-gray-400 line-through font-medium">
                    Antes: {formatCurrency(product.precioAnterior)}
                  </div>
                )}
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-black text-primary tracking-tight">
                    {formatCurrency(product.precio)}
                  </span>
                  <span className="text-sm font-bold text-text-muted uppercase tracking-wider pb-1.5">
                    Unitario
                  </span>
                </div>
                {product.precioMayorista && (
                  <div className="inline-block mt-3 bg-secondary text-white px-4 py-2 rounded-lg text-sm font-bold border-l-4 border-accent">
                    Precio por mayor: <span className="text-accent ml-1 text-lg">{formatCurrency(product.precioMayorista)}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <button 
                  disabled={isOutOfStock}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all ${
                    isOutOfStock 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-primary hover:bg-primary-dark text-white shadow-lg hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1'
                  }`}
                  onClick={() => {
                    // Logic to add to cart goes here
                    openQuoteModal();
                  }}
                >
                  <ShoppingCart size={20} />
                  {isOutOfStock ? 'SIN STOCK' : 'AGREGAR AL CARRITO'}
                </button>
                
                <a 
                  href={`https://wa.me/51987654321?text=${encodeURIComponent(`Hola, me interesa el producto ${product.sku} - ${product.nombre}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:shadow-[#25D366]/30 transition-all hover:-translate-y-1"
                >
                  <MessageCircle size={20} />
                  COTIZAR POR WHATSAPP
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Specs */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 lg:p-12 border-b md:border-b-0 md:border-r border-gray-100">
              <h3 className="text-xl font-title font-bold text-secondary mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-accent rounded-full"></span>
                Descripción del Producto
              </h3>
              <p className="text-text-muted leading-relaxed">
                {product.descripcion}
              </p>
            </div>
            <div className="p-8 lg:p-12 bg-gray-50/30">
              <h3 className="text-xl font-title font-bold text-secondary mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                Especificaciones Técnicas
              </h3>
              
              {product.especificaciones && Object.keys(product.especificaciones).length > 0 ? (
                <div className="grid grid-cols-1 gap-y-3">
                  {Object.entries(product.especificaciones).map(([key, value]) => (
                    <div key={key} className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-200 last:border-0">
                      <span className="sm:w-1/3 font-semibold text-secondary text-sm">{key}</span>
                      <span className="sm:w-2/3 text-text-muted text-sm mt-1 sm:mt-0">{value as React.ReactNode}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No hay especificaciones adicionales para este producto.</p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section: Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-title font-black text-secondary mb-8 flex items-center justify-between">
              Productos Relacionados
              <Link to={`/catalogo?categoria=${product.categoria}`} className="text-sm font-bold text-primary hover:text-primary-dark flex items-center gap-1 transition-colors">
                Ver más <ChevronRight size={16} />
              </Link>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
