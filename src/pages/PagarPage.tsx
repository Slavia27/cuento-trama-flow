
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const PagarPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { requestId, selectedOption, optionTitle } = location.state || {};
  
  const handlePayment = () => {
    // Aquí se implementaría la integración con un gateway de pago
    // Por ahora, simularemos que el pago fue exitoso
    
    const savedRequests = JSON.parse(localStorage.getItem('storyRequests') || '[]');
    const updatedRequests = savedRequests.map((req: any) => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'completed',
        };
      }
      return req;
    });
    
    localStorage.setItem('storyRequests', JSON.stringify(updatedRequests));
    
    toast({
      title: "¡Pago exitoso!",
      description: "Tu pago ha sido procesado. Pronto comenzaremos a trabajar en tu cuento personalizado.",
    });
    
    // Redirigir a una página de gracias
    navigate('/gracias');
  };
  
  if (!requestId || !selectedOption) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow container py-12 text-center">
          <h1 className="text-3xl font-bold mb-6">Información no disponible</h1>
          <p className="mb-6">No se encontró información sobre tu solicitud.</p>
          <Button onClick={() => navigate('/')}>Volver al inicio</Button>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container py-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-8">Finalizar tu Pedido</h1>
        
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Resumen de tu pedido</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span>Opción seleccionada:</span>
              <span className="font-medium">{optionTitle}</span>
            </div>
            
            <div className="flex justify-between border-b pb-2">
              <span>Servicio:</span>
              <span className="font-medium">Cuento personalizado</span>
            </div>
            
            <div className="flex justify-between border-b pb-2">
              <span>Precio:</span>
              <span className="font-medium">$49.99</span>
            </div>
            
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>$49.99</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Método de pago</h2>
          
          <p className="mb-6 text-muted-foreground">
            En una implementación real, aquí se integraría un formulario de pago con tarjeta
            o botones para diferentes métodos de pago como PayPal, Stripe, etc.
          </p>
          
          <div className="flex gap-4 mb-6">
            <div className="border rounded-md p-3 flex-1 text-center cursor-pointer hover:bg-muted/50">
              <p className="font-medium">Tarjeta de crédito</p>
            </div>
            <div className="border rounded-md p-3 flex-1 text-center cursor-pointer hover:bg-muted/50">
              <p className="font-medium">PayPal</p>
            </div>
          </div>
        </Card>
        
        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-story-blue hover:bg-story-blue/80 px-8"
            onClick={handlePayment}
          >
            Pagar ahora
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PagarPage;
