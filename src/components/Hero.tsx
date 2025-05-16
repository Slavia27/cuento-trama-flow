
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative bg-white overflow-hidden">
      {/* Franja decorativa superior */}
      <div className="h-2 bg-gradient-to-r from-story-blue via-story-pink to-story-yellow"></div>
      
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-story-dark">
              Cuentos personalizados para 
              <span className="block mt-2 text-story-blue"> momentos especiales</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600">
              Creamos historias únicas adaptadas a cada niño y niña. Tú nos cuentas el contexto, 
              nosotros te ofrecemos opciones de tramas, y creamos el cuento perfecto.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-story-pink hover:bg-story-pink/90 text-white font-semibold">
                <Link to="/formulario">Comenzar Mi Cuento</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-story-blue text-story-blue hover:bg-story-blue/10">
                <Link to="/como-funciona">Cómo Funciona</Link>
              </Button>
            </div>
          </div>
          
          <div className="relative order-1 lg:order-2 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Imagen principal, simulando el estilo de Rasti con formas */}
              <div className="aspect-[4/3] rounded-2xl bg-story-blue/10 overflow-hidden shadow-xl relative">
                <div className="absolute w-40 h-40 bg-story-yellow rounded-full -bottom-10 -left-10 opacity-40"></div>
                <div className="absolute w-32 h-32 bg-story-pink rounded-full top-10 -right-10 opacity-30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 mx-auto mb-4 bg-story-mint rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-story-dark">Cuentos Mágicos</h3>
                    <p className="mt-2 text-gray-600">Historias que cobran vida con la imaginación</p>
                  </div>
                </div>
              </div>
              
              {/* Elementos decorativos flotantes */}
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-story-mint rounded-lg rotate-12 shadow-lg opacity-80 floating"></div>
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-story-pink rounded-lg -rotate-6 shadow-lg opacity-80 floating" style={{animationDelay: "1s"}}></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Franja decorativa inferior */}
      <div className="h-2 bg-gradient-to-r from-story-yellow via-story-pink to-story-blue"></div>
    </div>
  );
};

export default Hero;
