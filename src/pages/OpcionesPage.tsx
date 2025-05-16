
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StoryOptions from '@/components/StoryOptions';

const OpcionesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <StoryOptions />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OpcionesPage;
