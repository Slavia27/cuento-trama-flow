
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StoryOptions from '@/components/StoryOptions';

const OpcionesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <StoryOptions />
      </main>
      
      <Footer />
    </div>
  );
};

export default OpcionesPage;
