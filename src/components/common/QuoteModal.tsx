import { useState, useEffect, type FC, type FormEvent } from 'react';
import { X, User, Phone, AtSign, FileText, Send, CheckCircle } from 'lucide-react';

/**
 * Global QuoteModal — Self-managed via CustomEvent.
 *
 * Any component in the app can open this modal by dispatching:
 *   window.dispatchEvent(new Event('openQuoteModal'))
 *
 * Rendered once in App.tsx. No prop drilling required.
 */

const OPEN_EVENT = 'openQuoteModal';

const QuoteModal: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    details: '',
  });
  const [submitted, setSubmitted] = useState(false);

  // Listen for global open events
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener(OPEN_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_EVENT, handleOpen);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setSubmitted(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', phone: '', email: '', details: '' });
      setIsOpen(false);
    }, 3000);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-secondary/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ animation: 'zoomIn 0.3s cubic-bezier(0.16,1,0.3,1)' }}
      >
        {/* ── Header ── */}
        <div className="bg-primary px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="font-title font-bold text-white text-lg">
              Solicitar Cotización
            </h2>
            <p className="text-white/60 text-xs mt-0.5">
              Completa los datos y te responderemos en 24h
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="p-6 md:p-8">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-5">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h3 className="font-title font-bold text-secondary text-xl mb-2">
                ¡Cotización solicitada!
              </h3>
              <p className="text-text-muted text-sm max-w-xs">
                Nuestro equipo revisará tu solicitud y te contactará a la
                brevedad posible.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label
                  htmlFor="quote-name"
                  className="block text-xs font-semibold uppercase tracking-widest text-text-muted mb-1.5"
                >
                  Nombre completo
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="quote-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Ej. Juan Pérez"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm text-secondary placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="quote-phone"
                  className="block text-xs font-semibold uppercase tracking-widest text-text-muted mb-1.5"
                >
                  Teléfono / WhatsApp
                </label>
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="quote-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="987 654 321"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm text-secondary placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="quote-email"
                  className="block text-xs font-semibold uppercase tracking-widest text-text-muted mb-1.5"
                >
                  Correo electrónico
                </label>
                <div className="relative">
                  <AtSign
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="quote-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="tu@email.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm text-secondary placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
              </div>

              {/* Details */}
              <div>
                <label
                  htmlFor="quote-details"
                  className="block text-xs font-semibold uppercase tracking-widest text-text-muted mb-1.5"
                >
                  Detalle de la solicitud
                </label>
                <div className="relative">
                  <FileText
                    size={16}
                    className="absolute left-3.5 top-3.5 text-gray-400"
                  />
                  <textarea
                    id="quote-details"
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Describe los productos y cantidades que necesitas..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm text-secondary placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-secondary py-3 rounded-xl font-semibold text-sm transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-accent hover:bg-accent/90 text-white py-3 rounded-xl font-title font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md hover:shadow-accent/30 active:scale-[0.98]"
                >
                  <Send size={15} />
                  Enviar Cotización
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

/** Helper to open the quote modal from anywhere */
export const openQuoteModal = () => {
  window.dispatchEvent(new Event(OPEN_EVENT));
};

export default QuoteModal;
