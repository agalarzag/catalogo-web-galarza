import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';
import QuoteModal from './components/common/QuoteModal';
import NotFound from './pages/NotFound';
import { Phone } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Header />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />

      {/* Global QuoteModal — listens for openQuoteModal events from anywhere */}
      <QuoteModal />

      {/* WhatsApp Floating Button (RF-16) */}
      <a
        href="https://wa.me/51987654321?text=Hola%2C%20quisiera%20solicitar%20una%20cotizaci%C3%B3n"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-6 right-6 z-[100] bg-[#25D366] hover:bg-[#128C7E] text-white w-14 h-14 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
      >
        <Phone size={28} />
      </a>
    </div>
  )
}

export default App;