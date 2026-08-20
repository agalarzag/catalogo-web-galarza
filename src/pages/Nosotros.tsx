import { useState, useEffect, useRef, type FC } from 'react';
import {
  Users,
  Heart,
  Shield,
  Handshake,
  Target,
  Eye,
  TrendingUp,
  Award,
  Clock,
  Briefcase,
} from 'lucide-react';

/* ================================================================
   ANIMATED COUNTER HOOK
   ================================================================ */

function useCountUp(target: number, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) {
      setHasStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasStarted, startOnView]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [hasStarted, target, duration]);

  return { count, ref };
}

/* ================================================================
   CORE VALUES DATA
   ================================================================ */

interface CoreValue {
  icon: FC<{ size?: number; className?: string }>;
  title: string;
  description: string;
}

const coreValues: CoreValue[] = [
  {
    icon: Users,
    title: 'Trabajo en equipo',
    description:
      'Creemos en la sinergia del grupo. Cada logro es resultado del esfuerzo compartido y la colaboración constante.',
  },
  {
    icon: Heart,
    title: 'Respeto',
    description:
      'Valoramos a cada persona: clientes, colegas y proveedores. El trato digno es la base de todas nuestras relaciones.',
  },
  {
    icon: Shield,
    title: 'Honestidad',
    description:
      'Actuamos con transparencia e integridad en cada operación, generando confianza real y duradera.',
  },
  {
    icon: Handshake,
    title: 'Vocación de servicio',
    description:
      'Nos apasiona servir. Buscamos superar expectativas con atención personalizada y soluciones a la medida.',
  },
];

/* ================================================================
   STATS DATA
   ================================================================ */

interface Stat {
  icon: FC<{ size?: number; className?: string }>;
  value: number;
  suffix?: string;
  label: string;
}

const stats: Stat[] = [
  { icon: TrendingUp, value: 325, label: 'Ingresos', suffix: '+' },
  { icon: Briefcase, value: 525, label: 'Colegas', suffix: '+' },
  { icon: Award, value: 302, label: 'Proyectos', suffix: '+' },
  { icon: Clock, value: 12, label: 'Años exp.', suffix: '+' },
];

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

export default function Nosotros() {
  return (
    <div className="bg-bg">
      {/* ──── CINEMATIC HERO SECTION ──── */}
      <div 
        className="relative w-full pt-32 pb-40 flex items-center justify-center text-white" 
        style={{ backgroundImage: "url('/hero-nosotros.png')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        {/* Semi-transparent Overlay */}
        <div className="absolute inset-0 bg-secondary/80"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 text-center pt-10">
          <span className="text-accent font-bold tracking-[0.2em] uppercase text-sm md:text-base drop-shadow-md mb-6 block">
            Descubre nuestra esencia
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-title font-black tracking-tighter text-white mb-6 drop-shadow-2xl">
            Sobre Nosotros
          </h1>
          <p className="text-white/90 text-lg md:text-2xl max-w-3xl mx-auto font-light leading-relaxed drop-shadow-md">
            Conoce la historia, los valores y la pasión que nos impulsan a ser
            tu mejor aliado en el mundo ferretero.
          </p>
          
          <div className="flex items-center justify-center gap-3 mt-12">
            <span className="w-16 h-1 bg-accent rounded-full shadow-[0_0_15px_rgba(255,140,0,0.5)]" />
            <span className="w-3 h-3 bg-accent rounded-full shadow-[0_0_15px_rgba(255,140,0,0.5)]" />
            <span className="w-16 h-1 bg-accent rounded-full shadow-[0_0_15px_rgba(255,140,0,0.5)]" />
          </div>
        </div>
      </div>

      {/* ──── FLOATING STATS BANNER (Overlapping Hero) ──── */}
      <section className="relative z-20 -mt-24 mb-20 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat) => {
            const { count, ref } = useCountUp(stat.value, 2200);

            return (
              <div
                key={stat.label}
                ref={ref}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl p-6 text-center shadow-lg hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300">
                  <stat.icon size={22} className="text-primary" />
                </div>
                <span className="block text-4xl md:text-5xl font-title font-black text-secondary tracking-tight">
                  {count}
                  <span className="text-accent">{stat.suffix}</span>
                </span>
                <span className="block mt-2 text-secondary/80 text-xs md:text-sm font-semibold uppercase tracking-widest">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ──── WHO WE ARE (Modern Staggered Grid) ──── */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-50 rounded-l-[100px] -z-10 transform translate-x-1/4"></div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left – Text Content (Span 5) */}
            <div className="lg:col-span-5 relative z-10">
              <span className="text-accent font-bold text-sm uppercase tracking-[0.2em] mb-4 block">
                Nuestra historia
              </span>
              <h2 className="text-4xl md:text-5xl font-title font-black text-secondary mb-8 leading-tight">
                ¿Quiénes <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Somos?</span>
              </h2>
              <div className="space-y-6 text-text-muted text-lg leading-relaxed font-light">
                <p>
                  <strong className="text-secondary font-semibold">Chamo Import</strong> es
                  una empresa líder en el rubro ferretero, dedicada a la
                  distribución y venta de productos de alta calidad para
                  construcción, electricidad, iluminación, gasfitería y mucho
                  más.
                </p>
                <p>
                  Desde nuestros inicios, nos hemos comprometido con ofrecer las
                  mejores marcas del mercado a precios competitivos, respaldados
                  por un servicio al cliente excepcional que nos diferencia.
                </p>
                <p>
                  Contamos con un amplio catálogo de productos que abarca desde
                  herramientas profesionales hasta materiales eléctricos y
                  adhesivos industriales, siempre apostando por la innovación y
                  la calidad.
                </p>
              </div>

              {/* Accent highlight block */}
              <div className="mt-10 p-6 bg-gray-50 border-l-4 border-accent rounded-r-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="absolute top-0 right-0 w-16 h-16 bg-accent/5 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
                <p className="text-secondary font-medium italic text-base md:text-lg">
                  "Nuestro objetivo es ser el socio estratégico que cada
                  profesional y hogar necesita, facilitando el acceso a productos
                  de primer nivel."
                </p>
              </div>
            </div>

            {/* Right – Core Values Staggered Grid (Span 7) */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              {/* Subtle background blob */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 blur-3xl rounded-full -z-10"></div>
              
              <div className="space-y-6 md:mt-12">
                {coreValues.slice(0, 2).map((value, idx) => (
                  <article
                    key={value.title}
                    className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group"
                  >
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-gray-50 rounded-full group-hover:bg-primary/5 transition-colors duration-300 -z-10"></div>
                    <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center mb-6 shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-300">
                      <value.icon size={28} />
                    </div>
                    <h3 className="font-title font-bold text-secondary text-xl mb-3">
                      {value.title}
                    </h3>
                    <p className="text-text-muted leading-relaxed font-light">
                      {value.description}
                    </p>
                  </article>
                ))}
              </div>
              <div className="space-y-6">
                {coreValues.slice(2, 4).map((value, idx) => (
                  <article
                    key={value.title}
                    className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group"
                  >
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-gray-50 rounded-full group-hover:bg-primary/5 transition-colors duration-300 -z-10"></div>
                    <div className="w-14 h-14 rounded-2xl bg-accent text-white flex items-center justify-center mb-6 shadow-lg shadow-accent/30 group-hover:scale-110 transition-transform duration-300">
                      <value.icon size={28} />
                    </div>
                    <h3 className="font-title font-bold text-secondary text-xl mb-3">
                      {value.title}
                    </h3>
                    <p className="text-text-muted leading-relaxed font-light">
                      {value.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──── MISSION & VISION (Cinematic Cards) ──── */}
      <section className="py-20 md:py-32 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-16 md:mb-24">
            <span className="text-accent font-bold text-sm uppercase tracking-[0.2em] mb-4 block">
              Lo que nos define
            </span>
            <h2 className="text-4xl md:text-5xl font-title font-black text-secondary">
              Misión y Visión
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Misión Card */}
            <article className="relative bg-white rounded-[2.5rem] p-10 md:p-14 border border-gray-100 shadow-2xl shadow-gray-200/50 hover:shadow-primary/20 hover:-translate-y-3 transition-all duration-500 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-3xl bg-primary text-white flex items-center justify-center mb-8 shadow-xl shadow-primary/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Target size={36} strokeWidth={1.5} />
                </div>
                <h3 className="font-title font-black text-secondary text-3xl md:text-4xl mb-6">
                  Nuestra Misión
                </h3>
                <p className="text-text-muted text-lg leading-relaxed font-light">
                  Proveer productos ferreteros de la más alta calidad a precios
                  competitivos, brindando un servicio al cliente excepcional que
                  facilite la realización de proyectos de construcción,
                  mantenimiento y mejora del hogar, contribuyendo al desarrollo
                  de nuestra comunidad.
                </p>
              </div>
            </article>

            {/* Visión Card */}
            <article className="relative bg-white rounded-[2.5rem] p-10 md:p-14 border border-gray-100 shadow-2xl shadow-gray-200/50 hover:shadow-accent/20 hover:-translate-y-3 transition-all duration-500 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-colors duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-3xl bg-accent text-white flex items-center justify-center mb-8 shadow-xl shadow-accent/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Eye size={36} strokeWidth={1.5} />
                </div>
                <h3 className="font-title font-black text-secondary text-3xl md:text-4xl mb-6">
                  Nuestra Visión
                </h3>
                <p className="text-text-muted text-lg leading-relaxed font-light">
                  Ser reconocidos como la empresa ferretera líder en la región,
                  destacándose por la excelencia en servicio, innovación
                  constante y la confianza de nuestros clientes, expandiendo
                  nuestra presencia a nivel nacional con un modelo de negocio
                  sostenible y orientado al futuro.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
