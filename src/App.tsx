import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';
import QuoteModal from './components/common/QuoteModal';

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
          <Route path="*" element={<div className="p-20 text-center text-2xl font-bold text-secondary">Página en construcción 🚧</div>} />
        </Routes>
      </main>

      <Footer />

      {/* Global QuoteModal — listens for openQuoteModal events from anywhere */}
      <QuoteModal />
    </div>
  )
}

export default App;