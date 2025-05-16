
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-story-blue py-3 shadow-md text-white">
      <div className="container flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <span className="text-xl font-bold text-story-blue">C</span>
          </div>
          <span className="text-2xl font-bold font-montserrat">
            Cuentos Personalizados
          </span>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden flex items-center" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6">
            <Link to="/" className="font-medium hover:text-story-yellow transition-colors">
              Inicio
            </Link>
            <Link to="/como-funciona" className="font-medium hover:text-story-yellow transition-colors">
              Cómo Funciona
            </Link>
            <Link to="/admin" className="font-medium hover:text-story-yellow transition-colors">
              Admin
            </Link>
          </nav>
          
          <Button className="bg-story-pink hover:bg-story-pink/90 text-white font-semibold">
            <Link to="/formulario">Crear Mi Cuento</Link>
          </Button>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-story-blue z-50 shadow-lg md:hidden">
            <nav className="flex flex-col py-4">
              <Link 
                to="/" 
                className="px-4 py-2 hover:bg-story-blue/80"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link 
                to="/como-funciona" 
                className="px-4 py-2 hover:bg-story-blue/80"
                onClick={() => setIsMenuOpen(false)}
              >
                Cómo Funciona
              </Link>
              <Link 
                to="/admin" 
                className="px-4 py-2 hover:bg-story-blue/80"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
              <Link 
                to="/formulario" 
                className="px-4 py-2 bg-story-pink hover:bg-story-pink/90 mx-4 mt-2 text-center rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Crear Mi Cuento
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
