import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ArrowRight, ShieldCheck, Zap, Truck } from 'lucide-react';
import { openQuoteModal } from '../common/QuoteModal';

export default function Footer() {
  return (
    <footer className="relative bg-secondary text-white pt-24 pb-8 px-4 md:px-8 font-sans mt-20">
      
      {/* 🚀 INNOVACIÓN: Banner Flotante Pre-Footer (Llamado a la acción) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-5xl bg-secondary rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
        <div>
          <h2 className="text-2xl md:text-3xl font-title font-bold text-white mb-2">¿Listo para abastecer tu negocio?</h2>
          <p className="text-white/90 font-medium">Accede a precios mayoristas exclusivos y despachos a nivel nacional.</p>
        </div>
        <button 
          onClick={openQuoteModal}
          className="group flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-full font-bold transition-all duration-300 shadow-lg"
        >
          Solicitar Cotización 
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-12 mb-12 mt-8 md:mt-0">
        
        {/* Columna 1: Marca y Propuesta de Valor */}
        <div className="space-y-6">
          <div className="flex items-center">
            <img 
              src="/brand/logo.png" 
              alt="Chamo Import Logo" 
              className="h-12 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement?.insertAdjacentHTML('beforeend', '<span class="text-3xl font-title font-black tracking-tight text-white">CHAMO<span class="text-accent">IMPORT</span></span>');
              }}
            />
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Especialistas en ferretería, iluminación y artículos eléctricos. Potenciamos el crecimiento de tu proyecto con herramientas de alta precisión y calidad garantizada.
          </p>
          {/* Redes Sociales con SVGs nativos */}
          <div className="flex gap-4">
            <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:-translate-y-1 transition-all duration-300">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:-translate-y-1 transition-all duration-300">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
          </div>
        </div>

        {/* Columna 2: Navegación Rápida */}
        <div>
          <h3 className="font-title font-semibold text-lg mb-6 text-white flex items-center gap-2">
            <ShieldCheck size={20} className="text-accent" /> Atención al Cliente
          </h3>
          <ul className="space-y-3 text-sm text-gray-400">
            {['Preguntas frecuentes', 'Términos y condiciones', 'Políticas de privacidad', 'Libro de reclamaciones'].map((item, i) => (
              <li key={i}>
                <Link to="#" className="group flex items-center gap-2 hover:text-accent transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/30 group-hover:bg-accent transition-colors"></span>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Columna 3: Contacto Directo */}
        <div>
          <h3 className="font-title font-semibold text-lg mb-6 text-white flex items-center gap-2">
            <Zap size={20} className="text-accent" /> Contacto Directo
          </h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex items-start gap-3 hover:text-white transition-colors cursor-default">
              <div className="bg-white/10 p-2 rounded-lg text-accent"><Phone size={16} /></div>
              <div>
                <p className="font-medium text-white">+51 987 654 321</p>
                <p className="text-xs">Ventas corporativas (L-S)</p>
              </div>
            </li>
            <li className="flex items-start gap-3 hover:text-white transition-colors cursor-default">
              <div className="bg-white/10 p-2 rounded-lg text-accent"><Mail size={16} /></div>
              <div>
                <p className="font-medium text-white">cotizaciones@chamoimport.com</p>
                <p className="text-xs">Respuesta en 24h</p>
              </div>
            </li>
            <li className="flex items-start gap-3 hover:text-white transition-colors cursor-default">
              <div className="bg-white/10 p-2 rounded-lg text-accent"><Clock size={16} /></div>
              <div>
                <p className="font-medium text-white">Horario de Atención</p>
                <p className="text-xs">L-V: 8am-6pm | Sáb: 8am-1pm</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Columna 4: Logística y Pagos */}
        <div>
          <h3 className="font-title font-semibold text-lg mb-6 text-white flex items-center gap-2">
            <Truck size={20} className="text-accent" /> Logística
          </h3>
          <div className="flex items-start gap-3 text-sm text-gray-400 mb-6">
             <div className="bg-white/10 p-2 rounded-lg text-accent"><MapPin size={16} /></div>
             <p>Galería Cuzco, Jr. Cusco 716,<br/>Lima 15001, Perú</p>
          </div>
          
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Medios de Pago Aceptados</h4>
          <div className="flex gap-2">
            {['VISA', 'MASTERCARD', 'AMEX', 'YAPE'].map((pago, i) => (
              <div key={i} className="bg-white/10 border border-white/20 text-white text-[10px] font-bold px-3 py-1.5 rounded hover:bg-white hover:text-secondary cursor-default transition-colors">
                {pago}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Línea Divisoria y Copyright */}
      <div className="border-t border-white/10 pt-8 mt-8 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-4">
        <p>Copyright © 2026 <strong className="text-gray-300">ChamoImport S.R.L.</strong> Todos los derechos reservados.</p>
        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
           <ShieldCheck size={16} className="text-green-400" />
           <span>Transacciones 100% Seguras (SSL)</span>
        </div>
      </div>
    </footer>
  );
}