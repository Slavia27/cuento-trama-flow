
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-story-blue/10 py-8 mt-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Cuentos Personalizados</h3>
            <p className="text-muted-foreground">
              Creamos cuentos únicos y personalizados adaptados a tus necesidades y preferencias.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/como-funciona" className="text-muted-foreground hover:text-primary transition-colors">
                  Cómo Funciona
                </Link>
              </li>
              <li>
                <Link to="/formulario" className="text-muted-foreground hover:text-primary transition-colors">
                  Crear Mi Cuento
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contacto</h3>
            <p className="text-muted-foreground">
              ¿Preguntas o comentarios? Escríbenos a{' '}
              <a href="mailto:contacto@cuentospersonalizados.com" className="text-primary hover:underline">
                contacto@cuentospersonalizados.com
              </a>
            </p>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>© {currentYear} Cuentos Personalizados. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
