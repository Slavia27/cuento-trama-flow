
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RequestForm from '@/components/RequestForm';

const FormularioPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <RequestForm />
      </main>
      
      <Footer />
    </div>
  );
};

export default FormularioPage;
