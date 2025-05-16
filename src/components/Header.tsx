
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-rasti-blue py-3 sticky top-0 z-50">
      <div className="container flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-6 h-6 bg-rasti-red rounded-sm"></div>
            <div className="w-6 h-6 bg-rasti-yellow rounded-sm"></div>
            <div className="w-6 h-6 bg-rasti-green rounded-sm"></div>
          </div>
          <span className="text-2xl font-bold font-montserrat text-white">
            Cuentos Personalizados
          </span>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden flex items-center" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isMenuOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
        </button>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6">
            <Link to="/" className="font-medium text-white hover:text-rasti-yellow transition-colors">
              Inicio
            </Link>
            <Link to="/como-funciona" className="font-medium text-white hover:text-rasti-yellow transition-colors">
              Cómo Funciona
            </Link>
            <Link to="/quienes-somos" className="font-medium text-white hover:text-rasti-yellow transition-colors">
              Quiénes Somos
            </Link>
            <Link to="/admin" className="font-medium text-white hover:text-rasti-yellow transition-colors">
              Admin
            </Link>
          </nav>
          
          <Link to="/formulario">
            <Button className="bg-rasti-red hover:bg-rasti-red/90 text-white font-semibold">
              Crear Mi Cuento
            </Button>
          </Link>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-rasti-blue z-50 shadow-lg md:hidden">
            <nav className="flex flex-col py-4">
              <Link 
                to="/" 
                className="px-4 py-2 text-white hover:bg-rasti-blue/80"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link 
                to="/como-funciona" 
                className="px-4 py-2 text-white hover:bg-rasti-blue/80"
                onClick={() => setIsMenuOpen(false)}
              >
                Cómo Funciona
              </Link>
              <Link 
                to="/quienes-somos" 
                className="px-4 py-2 text-white hover:bg-rasti-blue/80"
                onClick={() => setIsMenuOpen(false)}
              >
                Quiénes Somos
              </Link>
              <Link 
                to="/admin" 
                className="px-4 py-2 text-white hover:bg-rasti-blue/80"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
              <Link 
                to="/formulario" 
                className="px-4 py-2 bg-rasti-red hover:bg-rasti-red/90 mx-4 mt-2 text-center rounded"
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
