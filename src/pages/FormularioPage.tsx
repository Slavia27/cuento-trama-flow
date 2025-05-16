
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RequestForm from '@/components/RequestForm';

const FormularioPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-story-blue mb-4">Formulario de Solicitud</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              En Cuentos Rasti creamos historias personalizadas que conectan con tus hijos. 
              Completa el formulario y comenzaremos a crear una experiencia única.
            </p>
          </div>
        </div>
        <RequestForm />
      </main>
      
      <Footer />
    </div>
  );
};

export default FormularioPage;
