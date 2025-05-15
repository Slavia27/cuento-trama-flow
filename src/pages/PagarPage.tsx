
import React from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PagarPage = () => {
  const location = useLocation();
  const { requestId, selectedOption, optionTitle } = location.state || {};
  
  // Si no hay datos de selección, redirigir a la página principal
  if (!requestId || !selectedOption) {
    return <Navigate to="/" />;
  }
  
  const handleWixRedirect = () => {
    // En una implementación real, aquí redirigirías a la tienda de WIX
    // con los parámetros necesarios para identificar el producto y la opción seleccionada
    window.open('https://tutiendawix.com/producto/cuento-personalizado', '_blank');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Finalizar tu Pedido</h1>
          
          <Card className="p-8 mb-8">
            <h2 className="text-xl font-bold mb-4">Resumen de tu Selección</h2>
            
            <div className="border-t border-b py-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Producto:</span>
                <span className="font-medium">Cuento Personalizado</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Opción seleccionada:</span>
                <span className="font-medium">{optionTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID de solicitud:</span>
                <span className="font-medium">{requestId}</span>
              </div>
            </div>
            
            <p className="text-center mb-6">
              Para finalizar tu pedido, serás redirigido a nuestra tienda en WIX donde podrás realizar el pago
              y completar tu información de envío si es necesario.
            </p>
            
            <div className="flex justify-center">
              <Button className="bg-story-blue hover:bg-story-blue/80 w-full md:w-auto" onClick={handleWixRedirect}>
                Ir a WIX para Pagar
              </Button>
            </div>
          </Card>
          
          <div className="text-center">
            <p className="text-muted-foreground mb-3">
              ¿Tienes preguntas antes de completar el pago?
            </p>
            <Link to="/como-funciona" className="text-primary hover:underline">
              Consulta nuestra sección de preguntas frecuentes
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PagarPage;
