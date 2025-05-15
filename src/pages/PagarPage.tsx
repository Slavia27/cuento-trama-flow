
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle, Info } from 'lucide-react';

const PagarPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [requestData, setRequestData] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<any>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  
  // Obtener datos de la opción seleccionada del estado de navegación o URL params
  useEffect(() => {
    console.log("Location state:", location.state);
    console.log("Search params:", Object.fromEntries(searchParams.entries()));
    
    // Intentar cargar datos del estado de navegación
    const state = location.state as { 
      requestId?: string; 
      optionId?: string;
      optionTitle?: string;
    } | undefined;
    
    // O intentar cargar datos de los query params
    const requestId = state?.requestId || searchParams.get('requestId');
    const optionId = state?.optionId || searchParams.get('optionId');
    
    if (requestId && optionId) {
      // Intentamos cargar datos de localStorage
      const savedRequests = JSON.parse(localStorage.getItem('storyRequests') || '[]');
      const request = savedRequests.find((req: any) => req.id === requestId);
      
      if (request && request.selectedPlot === optionId) {
        // Encontrar el título de la opción seleccionada
        const optionTitle = request.plotOptions?.find((opt: any) => opt.id === optionId)?.title || 
                            state?.optionTitle || 
                            searchParams.get('optionTitle') || 
                            'Opción seleccionada';
                            
        setRequestData({
          ...request,
          optionTitle
        });
        setError(null);
      } else {
        setError("No se encontró la información de tu solicitud con la opción seleccionada.");
        toast({
          title: "Error",
          description: "No se encontró la información de tu solicitud.",
          variant: "destructive",
        });
      }
    } else {
      setError("Falta información requerida. Debes seleccionar una opción primero.");
      toast({
        title: "Información requerida",
        description: "Por favor selecciona una opción de trama primero.",
        variant: "destructive",
      });
    }
  }, [location, searchParams, toast]);
  
  const handlePayment = async () => {
    if (!requestData) {
      toast({
        title: "Error",
        description: "No hay información de solicitud para procesar el pago.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setPaymentError(null);
    setProcessingStatus('Conectando con Mercado Pago...');
    
    try {
      // Llamar a nuestro edge function para crear el pago con Mercado Pago
      setProcessingStatus('Creando preferencia de pago...');
      const { data, error: invokeError } = await supabase.functions.invoke('create-payment', {
        body: {
          requestId: requestData.id,
          amount: 23788, // Monto en pesos chilenos (sin puntos ni comas)
          description: `Cuento personalizado para ${requestData.childName}`,
          customerEmail: requestData.email || 'cliente@ejemplo.com', // Usamos email del cliente o un valor por defecto
          customerName: requestData.name || 'Cliente', // Usamos nombre del cliente o un valor por defecto
          redirectUrl: `${window.location.origin}/gracias`,
        },
      });
      
      if (invokeError) {
        console.error("Edge function invoke error:", invokeError);
        throw new Error(invokeError.message || "Error al invocar la función de pago");
      }
      
      console.log("Payment response:", data);
      
      if (!data || !data.success) {
        console.error("Unsuccessful payment response:", data);
        throw new Error(data?.error || "Respuesta de pago inválida");
      }
      
      if (data.data && data.data.init_point) {
        setProcessingStatus('Redirigiendo al checkout de Mercado Pago...');
        
        // Guardamos el estado de la solicitud
        const savedRequests = JSON.parse(localStorage.getItem('storyRequests') || '[]');
        const updatedRequests = savedRequests.map((req: any) => {
          if (req.id === requestData.id) {
            return {
              ...req,
              status: 'payment_created',
              paymentId: data.data.id,
            };
          }
          return req;
        });
        
        localStorage.setItem('storyRequests', JSON.stringify(updatedRequests));
        
        // Set payment URL and redirect after a brief delay
        setPaymentUrl(data.data.init_point);
        setTimeout(() => {
          // Redirigir a la página de pago de Mercado Pago
          console.log("Redirecting to Mercado Pago:", data.data.init_point);
          window.location.href = data.data.init_point;
        }, 500);
      } else {
        throw new Error("No se pudo obtener la URL de pago");
      }
    } catch (err: any) {
      console.error("Error creating payment:", err);
      
      setPaymentError(err);
      
      // Extract error details from Supabase response if available
      if (err.response) {
        try {
          const responseData = await err.response.json();
          setPaymentError({
            message: err.message,
            status: err.response.status,
            data: responseData
          });
        } catch (e) {
          setPaymentError({
            message: err.message,
            status: err.response?.status,
            text: await err.response?.text()
          });
        }
      } else if (typeof err === 'object' && err !== null) {
        // Handle error from edge function
        setPaymentError(err);
      }
      
      setError(err.message || "Hubo un error al procesar el pago. Por favor intente nuevamente.");
      toast({
        title: "Error de pago",
        description: err.message || "Hubo un error al procesar el pago. Por favor intente nuevamente.",
        variant: "destructive",
      });
      setIsLoading(false);
      setProcessingStatus('');
    }
  };
  
  const handleManualPaymentSuccess = () => {
    // Esta función simula un pago exitoso para pruebas
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
        if (req.id === requestData.id) {
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
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {paymentError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error de Mercado Pago</AlertTitle>
            <AlertDescription>
              <p>{paymentError.message || "Error desconocido"}</p>
              {paymentError.status && <p>Estado: {paymentError.status}</p>}
              {paymentError.details && (
                <details className="mt-2">
                  <summary>Detalles técnicos</summary>
                  <pre className="text-xs mt-2 p-2 bg-black/10 rounded overflow-x-auto">
                    {JSON.stringify(paymentError.details, null, 2)}
                  </pre>
                </details>
              )}
              {paymentError.data && (
                <details className="mt-2">
                  <summary>Datos adicionales</summary>
                  <pre className="text-xs mt-2 p-2 bg-black/10 rounded overflow-x-auto">
                    {JSON.stringify(paymentError.data, null, 2)}
                  </pre>
                </details>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        {requestData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h2 className="text-xl font-medium mb-4">Resumen del pedido</h2>
              
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <p className="font-medium">Cuento personalizado</p>
                  <p className="text-muted-foreground">Historia única adaptada para {requestData.childName}</p>
                  {requestData.optionTitle && (
                    <p className="text-sm mt-2">Opción seleccionada: <span className="font-medium">{requestData.optionTitle}</span></p>
                  )}
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
                <div className="bg-muted p-4 rounded-md mb-4">
                  <p className="text-sm">Al hacer clic en "Pagar ahora", serás redirigido a Mercado Pago para completar tu compra de forma segura.</p>
                </div>
                
                {processingStatus && (
                  <Alert className="mb-4">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Procesando</AlertTitle>
                    <AlertDescription>{processingStatus}</AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  className="w-full bg-story-mint hover:bg-story-mint/80 text-black font-bold py-3"
                  onClick={handlePayment}
                  disabled={isLoading || !requestData}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    "Pagar ahora con Mercado Pago"
                  )}
                </Button>
                
                {/* Botón alternativo para pruebas - se puede eliminar en producción */}
                <Button 
                  variant="outline"
                  className="w-full mt-2 border-dashed border-muted-foreground/50 text-muted-foreground"
                  onClick={handleManualPaymentSuccess}
                  disabled={isLoading || !requestData}
                >
                  Simular pago exitoso (solo para pruebas)
                </Button>
              </div>
            </Card>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default PagarPage;
