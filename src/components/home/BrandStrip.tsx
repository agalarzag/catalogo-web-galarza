import { type FC } from 'react';

/** Brands data with display name and brand color for hover effect */
interface Brand {
  name: string;
  color: string;
}

const brands: Brand[] = [
  { name: 'Truper',    color: '#E31937' },
  { name: 'Stanley',   color: '#FFD100' },
  { name: 'Philips',   color: '#0B5ED7' },
  { name: '3M',        color: '#FF0000' },
  { name: 'Schneider', color: '#3DCD58' },
  { name: 'Pavco',     color: '#005BAA' },
  { name: 'Sika',      color: '#E42B23' },
  { name: 'Opalux',    color: '#FF8C00' },
  { name: 'Indeco',    color: '#1B3A6B' },
  { name: 'Pedrollo',  color: '#0054A6' },
  { name: 'Bticino',   color: '#00A651' },
  { name: 'Artesco',   color: '#E63946' },
];

const BrandLogo: FC<{ brand: Brand }> = ({ brand }) => (
  <div className="group/brand flex-shrink-0 flex items-center justify-center px-6 md:px-10 py-4 cursor-default select-none">
    <span
      className="
        text-xl md:text-2xl font-title font-black tracking-tight
        text-gray-400 opacity-40
        group-hover/brand:opacity-100
        group-hover/brand:scale-110
        transition-all duration-500 ease-out
      "
      style={{
        /* On hover, the CSS variable is overridden via the inline style;
           Tailwind's group-hover applies the opacity/scale transitions */
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = brand.color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = '';
      }}
    >
      {brand.name}
    </span>
  </div>
);

const BrandStrip: FC = () => {
  return (
    <section className="relative bg-white border-y border-border overflow-hidden py-2">
      {/* Gradient fade edges */}
      <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      {/* Section heading (hidden visually, kept for accessibility) */}
      <h2 className="sr-only">Marcas que trabajamos</h2>

      {/* Marquee track */}
      <div className="flex animate-marquee hover:[animation-play-state:paused]">
        {/* Duplicate the list twice for seamless loop */}
        {[...brands, ...brands].map((brand, index) => (
          <BrandLogo key={`${brand.name}-${index}`} brand={brand} />
        ))}
      </div>
    </section>
  );
};

export default BrandStrip;
