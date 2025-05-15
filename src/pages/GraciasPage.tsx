
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const GraciasPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12">
        <Card className="max-w-2xl mx-auto p-8 text-center">
          <div className="w-16 h-16 bg-story-mint/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">¡Gracias por tu solicitud!</h1>
          
          <p className="text-lg text-muted-foreground mb-6">
            Hemos recibido tu información y estamos emocionados de crear un cuento personalizado especial.
            En las próximas 24 horas, te enviaremos un correo electrónico con las opciones de trama para que puedas elegir la que más te guste.
          </p>
          
          <p className="text-muted-foreground mb-8">
            Por favor, revisa tu bandeja de entrada (y carpeta de spam por si acaso) para no perderte nuestro correo.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="border-story-blue hover:bg-story-blue/10">
              <Link to="/">Volver al Inicio</Link>
            </Button>
            <Button className="bg-story-blue hover:bg-story-blue/80">
              <Link to="/como-funciona">Ver Cómo Funciona</Link>
            </Button>
          </div>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default GraciasPage;
