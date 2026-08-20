import { useState, type FC, type FormEvent, useRef, useEffect } from 'react';
import {
  Send,
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  User,
  AtSign,
  MessageSquare,
  CheckCircle,
} from 'lucide-react';

/* ================================================================
   FAQ DATA
   ================================================================ */

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: '¿Cuáles son los horarios de atención?',
    answer:
      'Atendemos de lunes a viernes de 8:00 a.m. a 6:00 p.m. y los sábados de 8:00 a.m. a 1:00 p.m. Los domingos y feriados permanecemos cerrados.',
  },
  {
    question: '¿Realizan envíos a todo el Perú?',
    answer:
      'Sí, realizamos envíos a nivel nacional a través de las principales agencias de transporte. Los costos varían según el destino y peso del pedido. Para Lima Metropolitana ofrecemos delivery el mismo día.',
  },
  {
    question: '¿Cuál es el pedido mínimo para precio mayorista?',
    answer:
      'El pedido mínimo para acceder a precios mayoristas es de S/ 500.00. Para volúmenes mayores a S/ 2,000.00 ofrecemos descuentos adicionales y condiciones especiales de pago.',
  },
  {
    question: '¿Aceptan devoluciones?',
    answer:
      'Sí, aceptamos devoluciones dentro de los 7 días posteriores a la compra, siempre que el producto se encuentre en su empaque original y sin uso. Los productos eléctricos tienen garantía directa del fabricante.',
  },
  {
    question: '¿Puedo solicitar una cotización personalizada?',
    answer:
      'Por supuesto. Puedes solicitar una cotización a través de nuestro formulario, por correo electrónico o por WhatsApp. Respondemos cotizaciones en un máximo de 24 horas hábiles.',
  },
];

/* ================================================================
   ACCORDION ITEM (Sleek Borderless)
   ================================================================ */

const AccordionItem: FC<{
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ item, isOpen, onToggle }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div className="border-b border-gray-100 last:border-none group">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left transition-colors"
      >
        <span
          className={`font-semibold text-base leading-snug transition-colors duration-300 ${
            isOpen ? 'text-primary' : 'text-secondary group-hover:text-primary'
          }`}
        >
          {item.question}
        </span>
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            isOpen ? 'bg-primary/10 text-primary' : 'bg-gray-50 text-gray-400 group-hover:bg-primary/5'
          }`}
        >
          <ChevronDown
            size={18}
            className={`transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>
      <div
        className="overflow-hidden transition-[height] duration-300 ease-in-out"
        style={{ height }}
      >
        <div ref={contentRef} className="pb-6">
          <p className="text-text-muted text-base leading-relaxed font-light">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
};

/* ================================================================
   CONTACT INFO DATA
   ================================================================ */

interface ContactInfo {
  icon: FC<{ size?: number; className?: string }>;
  label: string;
  value: string;
  href?: string;
}

const contactDetails: ContactInfo[] = [
  {
    icon: MapPin,
    label: 'Sede Principal',
    value: 'Av. Industrial 1234, Lima',
  },
  {
    icon: Phone,
    label: 'Teléfono',
    value: '+51 987 654 321',
    href: 'tel:+51987654321',
  },
  {
    icon: Mail,
    label: 'Correo',
    value: 'ventas@chamoimport.com',
    href: 'mailto:ventas@chamoimport.com',
  },
  {
    icon: Clock,
    label: 'Horario',
    value: 'L-V: 8am-6pm | Sáb: 8am-1pm',
  },
];

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

export default function Contacto() {
  const [openFaq, setOpenFaq] = useState<number | null>(0); // First open by default
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 4000);
  };

  return (
    <div className="bg-bg min-h-screen">
      {/* ──── ELEGANT HERO ──── */}
      <section 
        className="relative w-full py-24 flex flex-col items-center justify-center text-center text-white" 
        style={{ backgroundImage: "url('/hero-contacto.png')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-secondary/80"></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          <span className="text-accent font-bold tracking-[0.2em] uppercase text-sm block mb-4">
            Soporte al cliente
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-title font-black text-white tracking-tight mb-4">
            Hablemos.
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-xl mx-auto font-light">
            Estamos listos para resolver tus dudas y potenciar tus proyectos.
          </p>
        </div>
      </section>

      {/* ──── CLEAN MAIN SECTION ──── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* ── LEFT: Contact Form Card ──── */}
          <article className="bg-white text-secondary shadow-xl rounded-2xl p-8 md:p-10 border border-gray-100">
            <h2 className="font-title font-bold text-secondary text-3xl mb-3">
              Envíanos un mensaje
            </h2>
            <p className="text-text-muted text-base font-light mb-8">
              Completa tus datos y un asesor especializado te contactará en breve.
            </p>

            {formSubmitted ? (
              /* Success State */
              <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <CheckCircle size={40} className="text-green-500" />
                </div>
                <h3 className="font-title font-bold text-secondary text-2xl mb-3">
                  ¡Mensaje enviado!
                </h3>
                <p className="text-text-muted text-base font-light max-w-[250px]">
                  Hemos recibido tu consulta exitosamente.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative group">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Nombre completo"
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 text-secondary placeholder-gray-400 focus:bg-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>

                <div className="relative group">
                  <AtSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Correo electrónico"
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 text-secondary placeholder-gray-400 focus:bg-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>

                <div className="relative group">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Teléfono (Opcional)"
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 text-secondary placeholder-gray-400 focus:bg-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>

                <div className="relative group">
                  <MessageSquare size={18} className="absolute left-4 top-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="¿En qué podemos ayudarte?"
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 text-secondary placeholder-gray-400 focus:bg-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-accent hover:bg-accent/90 text-white py-4 rounded-2xl font-title font-bold text-base flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-accent/30 active:scale-[0.98] mt-2"
                >
                  <Send size={18} />
                  Enviar Mensaje
                </button>
              </form>
            )}
          </article>

          {/* ── RIGHT: Map & Info & FAQ ──── */}
          <div className="flex flex-col gap-8">
            
            {/* Contact Info Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex flex-col gap-6">
                {contactDetails.map((detail) => (
                  <div key={detail.label} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-gray-50 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <detail.icon size={20} />
                    </div>
                    <div>
                      <span className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-0.5">
                        {detail.label}
                      </span>
                      {detail.href ? (
                        <a href={detail.href} className="text-secondary font-bold text-base hover:text-primary transition-colors">
                          {detail.value}
                        </a>
                      ) : (
                        <span className="text-secondary font-bold text-base">
                          {detail.value}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rounded Map */}
            <div className="h-64 rounded-2xl overflow-hidden shadow-md border border-gray-100">
              <iframe
                title="Ubicación de Chamo Import"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.958!2d-77.027!3d-12.046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDAyJzQ1LjYiUyA3N8KwMDEnMzcuMiJX!5e0!3m2!1ses!2spe!4v1609459200000!5m2!1ses!2spe"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Borderless FAQ */}
            <div className="bg-white rounded-2xl p-8 shadow-xl shadow-gray-200/40 border border-gray-100">
              <h3 className="font-title font-bold text-secondary text-xl mb-4">
                Preguntas Frecuentes
              </h3>
              <div>
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    item={faq}
                    isOpen={openFaq === index}
                    onToggle={() =>
                      setOpenFaq(openFaq === index ? null : index)
                    }
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
