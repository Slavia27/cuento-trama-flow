import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const GraciasPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  // Handle Mercado Pago return parameters
  useEffect(() => {
    // Check if we're returning from Mercado Pago
    const paymentStatus = searchParams.get('status');
    const externalReference = searchParams.get('external_reference');
    const paymentId = searchParams.get('payment_id') || searchParams.get('preference_id');
    
    if (paymentStatus && externalReference) {
      console.log("Payment return:", { 
        status: paymentStatus, 
        reference: externalReference,
        paymentId: paymentId 
      });
      
      // Update the request status in localStorage based on payment result
      if (externalReference) {
        const savedRequests = JSON.parse(localStorage.getItem('storyRequests') || '[]');
        const updatedRequests = savedRequests.map((req: any) => {
          if (req.id === externalReference) {
            return {
              ...req,
              status: paymentStatus === 'approved' ? 'completed' : 'payment_' + paymentStatus,
              paymentStatus,
              paymentId,
              paymentTimestamp: new Date().toISOString(),
            };
          }
          return req;
        });
        
        localStorage.setItem('storyRequests', JSON.stringify(updatedRequests));
        
        // Show toast based on payment result
        if (paymentStatus === 'approved') {
          toast({
            title: "¡Pago aprobado!",
            description: "Tu pago ha sido procesado correctamente.",
          });
        } else if (paymentStatus === 'pending') {
          toast({
            title: "Pago pendiente",
            description: "Tu pago está pendiente de confirmación.",
            variant: "default",
          });
        } else if (paymentStatus === 'in_process') {
          toast({
            title: "Pago en proceso",
            description: "Tu pago está siendo procesado.",
            variant: "default",
          });
        } else {
          toast({
            title: "Pago no completado",
            description: "Hubo un problema con el procesamiento del pago.",
            variant: "destructive",
          });
        }
      }
    }
  }, [searchParams, toast]);
  
  // Determine if payment was successful
  const getPaymentStatus = () => {
    const fromState = location.state?.fromPayment;
    const paymentStatus = searchParams.get('status');
    
    if (fromState) return 'approved';
    if (!paymentStatus) return 'no_payment';
    return paymentStatus;
  };
  
  const paymentStatus = getPaymentStatus();
  const isProcessingPayment = paymentStatus === 'pending' || paymentStatus === 'in_process';
  const isPaymentSuccessful = paymentStatus === 'approved';
  const isPaymentRejected = paymentStatus === 'rejected';
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12">
        <Card className="max-w-2xl mx-auto p-8 text-center">
          {isPaymentSuccessful ? (
            <>
              <div className="w-16 h-16 bg-story-mint/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-story-mint" />
              </div>
              
              <h1 className="text-3xl font-bold mb-4">¡Gracias por tu compra!</h1>
              
              <p className="text-lg text-muted-foreground mb-6">
                Hemos recibido tu pago y comenzaremos a trabajar en tu cuento personalizado.
                Te notificaremos cuando esté listo para su descarga.
              </p>
              
              {searchParams.get('payment_id') && (
                <p className="mb-4 p-2 bg-muted rounded-md">
                  ID de Pago: <strong>{searchParams.get('payment_id')}</strong>
                </p>
              )}
            </>
          ) : isProcessingPayment ? (
            <>
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
              
              <h1 className="text-3xl font-bold mb-4">Pago en procesamiento</h1>
              
              <p className="text-lg text-muted-foreground mb-6">
                Tu pago está siendo procesado. Una vez confirmado, comenzaremos a trabajar en tu cuento personalizado.
                Te notificaremos cuando todo esté listo.
              </p>
              
              {searchParams.get('preference_id') && (
                <p className="mb-4 p-2 bg-muted rounded-md">
                  ID de Preferencia: <strong>{searchParams.get('preference_id')}</strong>
                </p>
              )}
            </>
          ) : isPaymentRejected ? (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              
              <h1 className="text-3xl font-bold mb-4">Pago rechazado</h1>
              
              <p className="text-lg text-muted-foreground mb-6">
                Lo sentimos, tu pago ha sido rechazado. Por favor, intenta nuevamente con otro método de pago
                o contacta a tu entidad bancaria.
              </p>
              
              <Button className="bg-story-blue hover:bg-story-blue/80 mb-4">
                <Link to="/pagar">Intentar pagar nuevamente</Link>
              </Button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-story-mint/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">¡Gracias por tu solicitud!</h1>
              
              <p className="text-lg text-muted-foreground mb-6">
                Hemos recibido tu información y estamos emocionados de crear un cuento personalizado especial.
                En las próximas 24 horas, te enviaremos un correo electrónico con las opciones de trama para que puedas elegir la que más te guste.
              </p>
            </>
          )}
          
          <p className="text-muted-foreground mb-8">
            Por favor, revisa tu bandeja de entrada (y carpeta de spam por si acaso) para no perderte nuestros correos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="border-story-blue hover:bg-story-blue/10">
              <Link to="/">Volver al Inicio</Link>
            </Button>
            <Button className="bg-story-blue hover:bg-story-blue/80">
              <Link to="/como-funciona">Ver Cómo Funciona</Link>
            </Button>
          </div>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default GraciasPage;
