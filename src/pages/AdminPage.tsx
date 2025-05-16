
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminDashboard from '@/components/AdminDashboard';
import { Button } from '@/components/ui/button';
import { LinkIcon } from 'lucide-react';

const AdminPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container my-4">
          <div className="bg-rasti-blue/10 p-4 rounded-md border border-rasti-blue/20 flex items-center justify-between">
            <div>
              <h3 className="font-medium text-rasti-blue">Integración con Sistema de Gestión</h3>
              <p className="text-sm text-muted-foreground">Las solicitudes marcadas con una barra azul fueron importadas del sistema de gestión interno.</p>
            </div>
            <Button 
              variant="outline" 
              className="text-rasti-blue border-rasti-blue hover:bg-rasti-blue/10"
              onClick={() => window.open('https://lovable.dev/projects/febbb62c-9a34-4f54-aab8-2865c0b4fae8', '_blank')}
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              Ver Sistema de Gestión
            </Button>
          </div>
        </div>
        <AdminDashboard />
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPage;
