
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProcessSteps from '@/components/ProcessSteps';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ComoFuncionaPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container py-10">
          <h1 className="text-3xl font-bold text-center mb-8">¿Cómo Funciona?</h1>
          
          <ProcessSteps />
          
          <div className="max-w-3xl mx-auto mt-16">
            <h2 className="text-2xl font-bold mb-4">Preguntas Frecuentes</h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border">
                <h3 className="text-xl font-bold mb-2">¿Cuánto tiempo toma crear un cuento personalizado?</h3>
                <p className="text-muted-foreground">
                  El proceso completo generalmente toma entre 1 y 2 semanas desde que envías el formulario inicial 
                  hasta que recibes el cuento final. Ofrecemos las opciones de trama en 24 horas después de recibir 
                  tu formulario.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border">
                <h3 className="text-xl font-bold mb-2">¿Puedo solicitar cambios una vez elegida la trama?</h3>
                <p className="text-muted-foreground">
                  Sí, ofrecemos una ronda de revisiones después de que elijas tu trama preferida. Esto nos permite 
                  afinar los detalles para asegurar que el cuento sea exactamente como lo deseas.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border">
                <h3 className="text-xl font-bold mb-2">¿Qué formatos están disponibles para el cuento final?</h3>
                <p className="text-muted-foreground">
                  Ofrecemos cuentos en formato digital (PDF) y en formato impreso con encuadernación de calidad. 
                  También contamos con opciones de ilustración que pueden variar según el paquete elegido.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border">
                <h3 className="text-xl font-bold mb-2">¿Puedo comprar cuentos adicionales con la misma historia?</h3>
                <p className="text-muted-foreground">
                  Sí, una vez creada la historia, puedes solicitar copias adicionales con un descuento especial. 
                  Esto es ideal para regalar a familiares o amigos.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Button size="lg" className="bg-story-blue hover:bg-story-blue/80">
                <Link to="/formulario">Comenzar Mi Cuento</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ComoFuncionaPage;
