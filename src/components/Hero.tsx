
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative bg-white overflow-hidden">
      {/* Franja decorativa superior */}
      <div className="h-2 bg-gradient-to-r from-rasti-blue via-rasti-red to-rasti-yellow"></div>
      
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-rasti-darkgray">
              Cuentos personalizados para 
              <span className="block mt-2 text-rasti-blue"> momentos especiales</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600">
              Creamos historias únicas adaptadas a cada niño y niña. Con un enfoque educativo y divertido, 
              nuestros cuentos fomentan la creatividad y el aprendizaje.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-rasti-red hover:bg-rasti-red/90 text-white font-semibold">
                <Link to="/formulario">Comenzar Mi Cuento</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-rasti-blue text-rasti-blue hover:bg-rasti-blue/10">
                <Link to="/como-funciona">Cómo Funciona</Link>
              </Button>
            </div>
          </div>
          
          <div className="relative order-1 lg:order-2 flex justify-center">
            <div className="relative w-full max-w-lg">
              {/* Bloques de colores estilo Rasti */}
              <div className="grid grid-cols-4 grid-rows-4 gap-3">
                <div className="col-span-2 row-span-2 bg-rasti-red rounded-md shadow-md">
                  <div className="h-full flex items-center justify-center p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                    </svg>
                  </div>
                </div>
                <div className="bg-rasti-yellow rounded-md shadow-md floating" style={{animationDelay: "0.5s"}}>
                  <div className="h-full flex items-center justify-center text-white font-bold">
                    A
                  </div>
                </div>
                <div className="bg-rasti-blue rounded-md shadow-md floating" style={{animationDelay: "0.2s"}}>
                  <div className="h-full flex items-center justify-center text-white font-bold">
                    B
                  </div>
                </div>
                <div className="bg-rasti-green rounded-md shadow-md floating" style={{animationDelay: "0.3s"}}>
                  <div className="h-full flex items-center justify-center text-white font-bold">
                    C
                  </div>
                </div>
                <div className="bg-rasti-blue rounded-md shadow-md floating" style={{animationDelay: "0.6s"}}>
                  <div className="h-full flex items-center justify-center text-white font-bold">
                    D
                  </div>
                </div>
                <div className="col-span-2 bg-rasti-green rounded-md shadow-md">
                  <div className="h-full flex items-center justify-center text-white font-bold">
                    CUENTO
                  </div>
                </div>
                <div className="col-span-3 bg-rasti-yellow rounded-md shadow-md">
                  <div className="h-full flex items-center justify-center text-white font-bold">
                    PERSONALIZADO
                  </div>
                </div>
                <div className="bg-rasti-red rounded-md shadow-md floating" style={{animationDelay: "0.4s"}}>
                  <div className="h-full flex items-center justify-center text-white font-bold">
                    !
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Franja decorativa inferior */}
      <div className="h-2 bg-gradient-to-r from-rasti-yellow via-rasti-red to-rasti-blue"></div>
    </div>
  );
};

export default Hero;
