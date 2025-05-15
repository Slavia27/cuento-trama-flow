
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminDashboard from '@/components/AdminDashboard';

const AdminPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <AdminDashboard />
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPage;
