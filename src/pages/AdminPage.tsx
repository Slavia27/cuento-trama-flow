
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminDashboard from '@/components/AdminDashboard';
import { Button } from '@/components/ui/button';
import { LinkIcon, Settings, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-6">
        <div className="container">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Panel de Administración</h1>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="text-rasti-blue border-rasti-blue hover:bg-rasti-blue/10"
                onClick={() => window.open('https://lovable.dev/projects/febbb62c-9a34-4f54-aab8-2865c0b4fae8', '_blank')}
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                Sistema de Gestión
              </Button>
              <Button 
                variant="outline"
                className="text-gray-600 border-gray-300"
                onClick={() => window.open('https://docs.google.com/forms/d/1m70Z8pvi1xcV0ZNSRQcPLXL9udv285WoaTA-oK5qe6c/edit', '_blank')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Ver Formulario
              </Button>
            </div>
          </div>
          
          <div className="bg-rasti-blue/10 p-4 rounded-md border border-rasti-blue/20 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-rasti-blue">Flujo de Trabajo Integrado</h3>
                <p className="text-sm text-muted-foreground">
                  Este panel integra pedidos desde el formulario web y el sistema de gestión interno.
                  Las solicitudes marcadas con una barra azul fueron importadas del sistema de gestión.
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
                <p className="text-muted-foreground mb-6">
                  La configuración avanzada del sistema está disponible en el Sistema de Gestión.
                  Use el botón "Sistema de Gestión" en la parte superior para acceder.
                </p>
                
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2">Integración con Google Forms</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Las respuestas del formulario de Google son procesadas automáticamente e importadas al sistema.
                    </p>
                    <Button 
                      variant="outline"
                      className="text-gray-600 border-gray-300"
                      onClick={() => window.open('https://docs.google.com/forms/d/1m70Z8pvi1xcV0ZNSRQcPLXL9udv285WoaTA-oK5qe6c/edit', '_blank')}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Ver Respuestas del Formulario
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2">Configuración de Correos Electrónicos</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure las plantillas de correo electrónico para enviar opciones de trama
                      y enlaces de pago en el Sistema de Gestión.
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
