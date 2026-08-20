import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    title: "OFERTA FERRETERA",
    subtitle: "Hasta 30% de descuento en herramientas de alto rendimiento",
    image: "/banner-1.png",
    cta: "Ver Herramientas",
    link: "/catalogo?categoria=cat-herramientas"
  },
  {
    id: 2,
    title: "ILUMINA TU PROYECTO",
    subtitle: "Descubre nuestra nueva línea de paneles LED y focos inteligentes",
    image: "/banner-2.png",
    cta: "Descubrir Iluminación",
    link: "/catalogo?categoria=cat-iluminacion"
  },
  {
    id: 3,
    title: "CAMPAÑA ESCOLAR",
    subtitle: "Equipa a los más pequeños con los mejores útiles del mercado",
    image: "/banner-3.png",
    cta: "Ver Catálogo Escolar",
    link: "/catalogo?categoria=cat-escolar"
  }
];

export default function Banner() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Lógica de autoavance (RF-02)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); // Cambia cada 5 segundos
    return () => clearInterval(timer);
  }, [isPaused]);

  const next = () => setCurrent(current === slides.length - 1 ? 0 : current + 1);
  const prev = () => setCurrent(current === 0 ? slides.length - 1 : current - 1);

  return (
    <div 
      className="relative w-full h-[350px] md:h-[450px] lg:h-[550px] overflow-hidden group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      <div 
        className="flex transition-transform duration-700 ease-out h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div 
            key={slide.id} 
            className="min-w-full h-full flex items-center justify-center text-white px-8 relative"
            style={{ backgroundImage: `url(${slide.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            {/* Overlay background to ensure text contrast */}
            <div className="absolute inset-0 bg-secondary/70 mix-blend-multiply"></div>
            
            <div className="text-center max-w-3xl animate-in fade-in zoom-in duration-700 relative z-10">
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-title font-black mb-4 tracking-tight leading-tight">{slide.title}</h2>
              <p className="text-lg md:text-2xl mb-8 opacity-90 font-medium">{slide.subtitle}</p>
              <Link to={slide.link} className="bg-white text-secondary font-bold py-3.5 px-10 rounded-full hover:bg-accent hover:text-white transition-all duration-300 shadow-lg hover:shadow-accent/50 inline-block transform hover:-translate-y-1">
                {slide.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Controles Manuales (RF-02) */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md z-20">
        <ChevronLeft size={28} />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md z-20">
        <ChevronRight size={28} />
      </button>

      {/* Puntos Indicadores (RF-02) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, idx) => (
          <button 
            key={idx} 
            onClick={() => setCurrent(idx)}
            className={`transition-all duration-300 rounded-full ${current === idx ? 'w-8 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/80'}`}
          />
        ))}
      </div>
    </div>
  );
}