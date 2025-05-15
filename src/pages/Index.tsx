
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProcessSteps from '@/components/ProcessSteps';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        
        <ProcessSteps />
        
        <section className="container py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">¿Listo para crear un cuento único?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              No esperes más para regalar una experiencia inolvidable. Los cuentos personalizados son 
              el regalo perfecto para cualquier ocasión especial.
            </p>
            <Button size="lg" className="bg-story-pink hover:bg-story-pink/80">
              <Link to="/formulario">Comenzar mi Cuento</Link>
            </Button>
          </div>
        </section>
        
        <section className="bg-gradient-to-br from-story-blue/10 to-story-mint/10 py-16">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="story-card border-story-blue">
                <h3 className="text-xl font-bold mb-3">Personalización Completa</h3>
                <p className="text-muted-foreground">
                  Cada cuento está diseñado específicamente para el niño o niña, incluyendo sus gustos, 
                  intereses y características personales.
                </p>
              </div>
              
              <div className="story-card border-story-pink">
                <h3 className="text-xl font-bold mb-3">Proceso Colaborativo</h3>
                <p className="text-muted-foreground">
                  Trabajamos juntos para crear la historia perfecta, ofreciéndote opciones de trama 
                  para que elijas la que más te guste.
                </p>
              </div>
              
              <div className="story-card border-story-mint">
                <h3 className="text-xl font-bold mb-3">Experiencia Memorable</h3>
                <p className="text-muted-foreground">
                  No es solo un libro, es una experiencia que creará recuerdos duraderos y fomentará 
                  el amor por la lectura.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
