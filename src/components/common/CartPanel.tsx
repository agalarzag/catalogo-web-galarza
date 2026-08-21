import { X, Trash2, Plus, Minus, MessageCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartPanel() {
  const { cart, isCartOpen, closeCart, removeFromCart, updateQuantity, subtotal } = useCart();

  if (!isCartOpen) return null;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(val);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] transition-opacity"
        onClick={closeCart}
      />
      
      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-[100] w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-title font-bold text-xl text-secondary">
            Mi Carrito de Cotización
          </h2>
          <button 
            onClick={closeCart}
            className="text-text-muted hover:text-secondary p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <MessageCircle size={48} className="mb-4 opacity-50" />
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative">
                <img 
                  src={item.imagenes && item.imagenes.length > 0 ? item.imagenes[0] : '/products/placeholder.jpg'} 
                  alt={item.nombre}
                  className="w-20 h-20 object-contain rounded-xl border border-gray-100 p-1"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-secondary line-clamp-2 leading-tight pr-6">
                      {item.nombre}
                    </h4>
                    <p className="text-xs text-text-muted mt-1">SKU: {item.sku}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-primary">
                      {formatCurrency(item.precio)}
                    </span>
                    
                    {/* Quantity controls */}
                    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                      <button 
                        onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                        className="p-1.5 text-gray-500 hover:text-primary transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-secondary">
                        {item.cantidad}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                        className="p-1.5 text-gray-500 hover:text-primary transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Remove button */}
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-white border-t border-border shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between mb-6">
            <span className="text-gray-500 font-medium">Subtotal</span>
            <span className="text-2xl font-black text-secondary">
              {formatCurrency(subtotal)}
            </span>
          </div>
          <a
            href={`https://wa.me/51987654321?text=${encodeURIComponent("Hola, deseo cotizar mi carrito.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all ${
              cart.length === 0 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none'
                : 'bg-whatsapp hover:bg-[#128C7E] text-white shadow-lg hover:shadow-xl hover:shadow-whatsapp/30 hover:-translate-y-1'
            }`}
          >
            <MessageCircle size={20} />
            ENVIAR COTIZACIÓN
          </a>
        </div>
      </div>
    </>
  );
}
