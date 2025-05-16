
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
        
        <section className="container py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-rasti-darkgray">¿Listo para crear un cuento único?</h2>
            <p className="text-lg text-gray-600 mb-8">
              No esperes más para regalar una experiencia inolvidable. Los cuentos personalizados son 
              el regalo perfecto para cualquier ocasión especial.
            </p>
            <Button size="lg" className="bg-rasti-red hover:bg-rasti-red/90 text-white font-semibold px-8 py-6 text-lg">
              <Link to="/formulario">Comenzar mi Cuento</Link>
            </Button>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container px-4">
            <h2 className="text-3xl font-bold mb-10 text-center text-rasti-darkgray">¿Por qué elegir nuestros cuentos?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-rasti-blue">
                <div className="w-14 h-14 bg-rasti-blue/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rasti-blue">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-rasti-darkgray">Personalización Completa</h3>
                <p className="text-gray-600">
                  Cada cuento está diseñado específicamente para el niño o niña, incluyendo sus gustos, 
                  intereses y características personales.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-rasti-red">
                <div className="w-14 h-14 bg-rasti-red/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rasti-red">
                    <path d="M17 6.1H3"></path>
                    <path d="M21 12.1H3"></path>
                    <path d="M15.1 18H3"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-rasti-darkgray">Proceso Colaborativo</h3>
                <p className="text-gray-600">
                  Trabajamos juntos para crear la historia perfecta, ofreciéndote opciones de trama 
                  para que elijas la que más te guste.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-rasti-green">
                <div className="w-14 h-14 bg-rasti-green/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rasti-green">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-rasti-darkgray">Experiencia Educativa</h3>
                <p className="text-gray-600">
                  No es solo un libro, es una experiencia que creará recuerdos duraderos, fomentará 
                  el amor por la lectura y ayudará en el aprendizaje.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="container py-16 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-rasti-blue/10 rounded-xl p-8 lg:p-12">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-rasti-darkgray">Testimonios de padres y niños</h2>
              <p className="text-lg text-gray-600 mb-6">
                Descubre lo que dicen las familias que ya han disfrutado de nuestros cuentos personalizados.
              </p>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-rasti-red/20 rounded-full flex items-center justify-center text-rasti-red font-bold text-xl">
                    L
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold">Laura García</h4>
                    <p className="text-sm text-gray-500">Mamá de Sofía, 6 años</p>
                  </div>
                </div>
                <p className="italic text-gray-600">
                  "El cuento personalizado que crearon para mi hija Sofía superó todas mis expectativas. 
                  Ella se emocionó tanto al verse como protagonista de su propia historia. ¡Ahora pide 
                  leerlo todas las noches antes de dormir!"
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-3 grid-rows-3 gap-3 w-full max-w-sm">
                <div className="bg-rasti-red rounded-md h-24 col-span-2 row-span-2 flex items-center justify-center text-white font-bold p-4 text-center">
                  Cuentos con valores
                </div>
                <div className="bg-rasti-yellow rounded-md h-24 flex items-center justify-center text-rasti-darkgray font-bold">
                  +500
                </div>
                <div className="bg-rasti-yellow rounded-md h-24 flex items-center justify-center text-rasti-darkgray font-bold">
                  Cuentos
                </div>
                <div className="bg-rasti-blue rounded-md h-24 col-span-2 flex items-center justify-center text-white font-bold">
                  Niños felices
                </div>
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
