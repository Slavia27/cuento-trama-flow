
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-story-blue/20 via-story-pink/20 to-story-mint/20 py-16 md:py-24">
      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Cuentos personalizados para 
            <span className="bg-gradient-to-r from-story-blue via-story-pink to-story-purple bg-clip-text text-transparent"> momentos especiales</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground">
            Creamos historias únicas adaptadas a tus necesidades. Tú nos cuentas el contexto, 
            nosotros te ofrecemos opciones de tramas, y creamos el cuento perfecto para ti.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button size="lg" className="bg-story-blue hover:bg-story-blue/80 text-white">
              <Link to="/formulario">Comenzar Ahora</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-story-pink hover:bg-story-pink/10">
              <Link to="/como-funciona">Cómo Funciona</Link>
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <div className="aspect-square max-w-md mx-auto">
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-story-blue rounded-2xl rotate-12 opacity-80 floating"></div>
            <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-story-pink rounded-2xl -rotate-6 opacity-80" style={{animationDelay: "1s"}}></div>
            <div className="absolute bottom-0 left-1/3 w-36 h-36 bg-story-mint rounded-2xl rotate-45 opacity-80 floating" style={{animationDelay: "2s"}}></div>
            <div className="absolute top-1/4 right-0 w-24 h-24 bg-story-yellow rounded-full opacity-80 floating" style={{animationDelay: "0.5s"}}></div>
            <div className="absolute bottom-1/4 left-0 w-20 h-20 bg-story-purple rounded-full opacity-80 floating" style={{animationDelay: "1.5s"}}></div>
          </div>
        </div>
      </div>
      
      <div className="absolute -bottom-16 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </div>
  );
};

export default Hero;
