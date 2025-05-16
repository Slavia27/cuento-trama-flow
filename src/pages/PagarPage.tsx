
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface LocationState {
  requestId: string;
  optionId: string;
  optionTitle: string;
}

const PagarPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const state = location.state as LocationState;
  
  useEffect(() => {
    if (!state?.requestId || !state?.optionId) {
      setError("No se encontró la información de tu solicitud con la opción seleccionada.");
    }
  }, [state]);
  
  const handleMockPayment = async () => {
    if (!state?.requestId) return;
    
    setLoading(true);
    
    try {
      console.log("Procesando pago simulado para la solicitud:", state.requestId);
      
      // En un entorno real, aquí se conectaría con el API de pagos
      // Para esta simulación, simplemente actualizamos el estado en Supabase
      
      const { error } = await supabase
        .from('story_requests')
        .update({ 
          status: 'pagado' 
        })
        .eq('request_id', state.requestId);
      
      if (error) throw error;
      
      console.log("Pago simulado procesado correctamente");
      
      setConfirmed(true);
      toast({
        title: "¡Pago procesado!",
        description: "Tu pago ha sido procesado correctamente. Comenzaremos a trabajar en tu cuento personalizado.",
      });
      
      // Redirigir después de unos segundos
      setTimeout(() => {
        navigate('/gracias');
      }, 3000);
      
    } catch (err: any) {
      console.error("Error al procesar el pago simulado:", err);
      setError("Hubo un problema al procesar tu pago. Por favor, inténtalo nuevamente.");
      toast({
        title: "Error en el pago",
        description: "No se pudo procesar tu pago. Por favor, inténtalo nuevamente o contacta con soporte.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container max-w-2xl mx-auto px-4">
          {error ? (
            <Card className="p-6 text-center">
              <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
              <p className="mb-6">{error}</p>
              <Button onClick={() => navigate('/')} className="bg-rasti-blue">
                Volver al inicio
              </Button>
            </Card>
          ) : confirmed ? (
            <Card className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">¡Pago Confirmado!</h2>
              <p className="mb-6">
                Tu pago ha sido procesado correctamente. Comenzaremos a trabajar en tu cuento personalizado.
              </p>
              <p className="text-sm text-muted-foreground">
                Serás redirigido en unos momentos...
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-center">Completar tu Compra</h1>
              
              <Card className="p-6">
                <h2 className="font-semibold text-xl mb-4">Resumen de tu Pedido</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Opción seleccionada:</span>
                    <span className="font-medium">{state?.optionTitle || "Opción no disponible"}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">ID de solicitud:</span>
                    <span className="font-medium">{state?.requestId || "No disponible"}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Producto:</span>
                    <span className="font-medium">Cuento Personalizado</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>$24.990 CLP</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button 
                    className="w-full bg-rasti-blue"
                    onClick={handleMockPayment}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      'Pagar Ahora'
                    )}
                  </Button>
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Este es un simulador de pago para propósitos de demostración. En un entorno real, aquí se conectaría con una pasarela de pago.
                  </p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PagarPage;
