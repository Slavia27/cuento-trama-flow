
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminDashboard from '@/components/AdminDashboard';
import { Settings, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-6">
        <div className="container">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Panel de Administración</h1>
          </div>
          
          <div className="bg-rasti-blue/10 p-4 rounded-md border border-rasti-blue/20 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-rasti-blue">Sistema de Gestión Integrado</h3>
                <p className="text-sm text-muted-foreground">
                  Administra todas las solicitudes de cuentos personalizados, envía opciones de tramas y gestiona pagos desde un único panel.
                </p>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="dashboard" className="mb-6">
            <TabsList>
              <TabsTrigger value="dashboard">Solicitudes</TabsTrigger>
              <TabsTrigger value="settings">Configuración</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard">
              <AdminDashboard />
            </TabsContent>
            <TabsContent value="settings">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Configuración del Sistema</h2>
                
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2">Configuración de Correos Electrónicos</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure las plantillas de correo electrónico para enviar opciones de trama
                      y enlaces de pago.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2">Configuración de Plazos</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure los días hábiles predeterminados para la producción de cuentos.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPage;
