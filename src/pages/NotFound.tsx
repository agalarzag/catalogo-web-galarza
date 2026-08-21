import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-bg">
      <h1 className="text-9xl font-title font-black text-primary mb-4">404</h1>
      <h2 className="text-3xl font-title font-bold text-secondary mb-6">Página no encontrada</h2>
      <p className="text-text-muted mb-8 max-w-md">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>
      <Link 
        to="/" 
        className="bg-accent hover:bg-accent/90 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all"
      >
        Volver al Inicio
      </Link>
    </div>
  );
}
