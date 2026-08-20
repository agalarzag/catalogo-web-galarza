import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, type Category } from '../../services/api';

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtenemos los datos simulando la red
    getCategories().then(data => {
      setCategories(data);
      setLoading(false);
    });
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-title font-bold text-secondary mb-2">Explora por Categorías</h2>
          <p className="text-text-muted">Encuentra exactamente lo que necesitas para tu proyecto.</p>
        </div>
        <Link to="/catalogo" className="hidden md:flex font-bold text-primary hover:text-accent transition-colors">
          Ver todo el catálogo →
        </Link>
      </div>

      {loading ? (
        // Skeletons de carga (RF-17)
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse flex flex-col gap-3">
              <div className="bg-gray-200 rounded-2xl aspect-square w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
          ))}
        </div>
      ) : (
        // Grilla real (RF-03)
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              to={`/catalogo?categoria=${cat.id}`}
              className="group flex flex-col items-center gap-3 text-center"
            >
              <div className="relative w-full aspect-square rounded-2xl bg-gray-100 overflow-hidden shadow-sm group-hover:shadow-lg transition-all duration-300 border border-border">
                {/* Fallback de imagen usando color de acento si la imagen falla */}
                <div className="absolute inset-0 bg-accent/5 group-hover:bg-primary/10 transition-colors z-10"></div>
                <div className="absolute inset-0 flex items-center justify-center text-4xl">
                  📦
                </div>
                {/* Imagen real (reemplazará al emoji si existe la ruta válida) */}
                <img 
                  src={cat.imagen} 
                  alt={cat.nombre} 
                  className="absolute inset-0 w-full h-full object-cover z-20 group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              </div>
              <h3 className="font-title font-semibold text-text group-hover:text-primary transition-colors text-sm md:text-base">
                {cat.nombre}
              </h3>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}