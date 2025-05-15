
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

// Simulación de un formulario de pago simple
const PagarPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Obtener datos de la opción seleccionada del estado de navegación
  useEffect(() => {
    const state = location.state as { optionId?: string } | undefined;
    if (state && state.optionId) {
      setSelectedOption(state.optionId);
      
      // Simulamos cargar datos del localStorage (en una app real usaríamos la BD)
      const savedRequests = JSON.parse(localStorage.getItem('storyRequests') || '[]');
      const request = savedRequests.find((req: any) => 
        req.selectedPlot === state.optionId
      );
      
      if (!request) {
        toast({
          title: "Error",
          description: "No se encontró la información de tu solicitud.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Información requerida",
        description: "Por favor selecciona una opción de trama primero.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [location, navigate, toast]);
  
  const handlePayment = () => {
    setIsLoading(true);
    
    // Simulamos un proceso de pago
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "¡Pago procesado!",
        description: "Tu pago ha sido procesado correctamente. Comenzaremos a trabajar en tu cuento personalizado.",
      });
      
      // Actualizar el estado de la solicitud a completado
      const savedRequests = JSON.parse(localStorage.getItem('storyRequests') || '[]');
      const updatedRequests = savedRequests.map((req: any) => {
        if (req.selectedPlot === selectedOption) {
          return {
            ...req,
            status: 'completed',
          };
        }
        return req;
      });
      
      localStorage.setItem('storyRequests', JSON.stringify(updatedRequests));
      
      // Redirigir a una página de agradecimiento
      navigate('/gracias', { state: { fromPayment: true } });
    }, 2000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container py-10">
        <h1 className="text-3xl font-bold mb-6">Finalizar tu compra</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-medium mb-4">Resumen del pedido</h2>
            
            <div className="space-y-4">
              <div className="border-b pb-4">
                <p className="font-medium">Cuento personalizado</p>
                <p className="text-muted-foreground">Historia única adaptada a los intereses y características de tu niño/a</p>
              </div>
              
              <div className="py-4 border-b">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p>$19.990</p>
                </div>
                <div className="flex justify-between mt-2">
                  <p>IVA</p>
                  <p>$3.798</p>
                </div>
              </div>
              
              <div className="flex justify-between pt-4 font-bold">
                <p>Total</p>
                <p>$23.788</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-medium mb-4">Información de pago</h2>
            
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-md">
                <p className="text-sm">Esta es una demostración. En una aplicación real, aquí se integraría un procesador de pagos como Stripe, PayPal, WebPay, etc.</p>
              </div>
              
              <Button 
                className="w-full bg-story-mint hover:bg-story-mint/80 text-black font-bold py-3"
                onClick={handlePayment}
                disabled={isLoading}
              >
                {isLoading ? "Procesando..." : "Pagar ahora"}
              </Button>
            </div>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PagarPage;
