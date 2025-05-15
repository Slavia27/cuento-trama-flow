
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="w-full bg-white py-4 shadow-sm border-b">
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-story-blue flex items-center justify-center">
            <span className="text-xl font-bold text-white">C</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-story-blue via-story-pink to-story-mint bg-clip-text text-transparent">
            Cuentos Personalizados
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="font-medium hover:text-primary transition-colors">
              Inicio
            </Link>
            <Link to="/como-funciona" className="font-medium hover:text-primary transition-colors">
              Cómo Funciona
            </Link>
            <Link to="/admin" className="font-medium hover:text-primary transition-colors">
              Admin
            </Link>
          </nav>
          
          <Button className="bg-story-mint hover:bg-story-blue text-foreground font-medium transition-colors">
            <Link to="/formulario">Crear Mi Cuento</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
