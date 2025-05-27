import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle } from 'lucide-react';

type StoryOption = {
  id: string;
  title: string;
  description: string;
};

type StoryStatus = 'pendiente' | 'opciones' | 'seleccion' | 'pagado' | 'produccion' | 'envio' | 'completado';

type StoryRequest = {
  id: string;
  name: string;
  childName: string;
  status: StoryStatus;
  plotOptions?: StoryOption[];
  selectedPlot?: string;
};

const StoryOptions = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [request, setRequest] = useState<StoryRequest | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectionSuccessful, setSelectionSuccessful] = useState(false);
  const [selectedOptionData, setSelectedOptionData] = useState<StoryOption | null>(null);
  
  // Cargar solicitud y opciones desde Supabase
  useEffect(() => {
    const loadRequest = async () => {
      setLoading(true);
      
      try {
        if (!requestId) {
          setError("ID de solicitud no válido");
          setLoading(false);
          return;
        }

        console.log("Cargando solicitud con ID:", requestId);

        // Obtener la solicitud de Supabase
        const { data: requestData, error: requestError } = await supabase
          .from('story_requests')
          .select('*')
          .eq('request_id', requestId)
          .single();
        
        if (requestError || !requestData) {
          console.error("Error al obtener la solicitud:", requestError);
          setError("No se encontró la solicitud. Verifica el enlace e intenta nuevamente.");
          setLoading(false);
          return;
        }

        console.log("Datos de la solicitud obtenidos:", requestData);

        // Obtener las opciones de trama para esta solicitud
        const { data: optionsData, error: optionsError } = await supabase
          .from('plot_options')
          .select('*')
          .eq('request_id', requestId);
        
        if (optionsError) {
          console.error("Error al obtener las opciones de trama:", optionsError);
          setError("Error al cargar las opciones de trama. Por favor intenta nuevamente.");
          setLoading(false);
          return;
        }

        console.log("Opciones de trama obtenidas:", optionsData);

        // Formatear los datos para el componente
        const formattedRequest: StoryRequest = {
          id: requestData.request_id,
          name: requestData.name,
          childName: requestData.child_name,
          status: requestData.status as StoryStatus,
          selectedPlot: requestData.selected_plot || undefined,
          plotOptions: optionsData && optionsData.length > 0 
            ? optionsData.map(opt => ({
                id: opt.option_id,
                title: opt.title,
                description: opt.description
              }))
            : []
        };
        
        setRequest(formattedRequest);
        
        if (formattedRequest.selectedPlot) {
          setSelectedOption(formattedRequest.selectedPlot);
          
          // Si ya hay una opción seleccionada, buscarla en las opciones disponibles
          const selected = formattedRequest.plotOptions?.find(opt => opt.id === formattedRequest.selectedPlot);
          if (selected) {
            setSelectedOptionData(selected);
          }
        }
        
        if (formattedRequest.plotOptions?.length === 0) {
          setError("Esta solicitud no tiene opciones de trama configuradas aún. Por favor, contacta al administrador.");
        }
        
      } catch (err) {
        console.error("Error al cargar la solicitud:", err);
        setError("Error al cargar la solicitud. Por favor intenta nuevamente.");
        toast({
          title: "Error",
          description: "Error al cargar la solicitud. Por favor intenta nuevamente.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadRequest();
  }, [requestId, toast]);
  
  const handleOptionSelect = (optionId: string) => {
    console.log("Opción seleccionada:", optionId);
    setSelectedOption(optionId);
    setError(null);
  };
  
  const handleConfirmSelection = async () => {
    if (!selectedOption) {
      setError("Por favor selecciona una opción antes de continuar.");
      toast({
        title: "Error",
        description: "Por favor selecciona una opción antes de continuar.",
        variant: "destructive",
      });
      return;
    }
    
    if (!requestId) {
      setError("ID de solicitud no válido");
      toast({
        title: "Error",
        description: "ID de solicitud no válido.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      console.log(`Guardando selección de trama: ${selectedOption} para la solicitud: ${requestId}`);
      
      // Update the selection in the database without expecting a return value
      const { error: updateError } = await supabase
        .from('story_requests')
        .update({
          selected_plot: selectedOption,
          status: 'seleccion'
        })
        .eq('request_id', requestId);
      
      if (updateError) {
        console.error("Error al actualizar la base de datos:", updateError);
        throw new Error(`Error de base de datos: ${updateError.message}`);
      }
      
      console.log("Actualización exitosa");
      
      // Verify the update was successful
      const { data: verifyData, error: verifyError } = await supabase
        .from('story_requests')
        .select('status, selected_plot')
        .eq('request_id', requestId)
        .single();
      
      if (verifyError) {
        console.error("Error al verificar actualización:", verifyError);
      } else {
        console.log("Verificación de actualización:", verifyData);
      }
      
      // Find the selected option data
      const optionData = request?.plotOptions?.find(opt => opt.id === selectedOption);
      setSelectedOptionData(optionData || null);
      
      // Update local state
      if (request) {
        setRequest({
          ...request,
          status: 'seleccion',
          selectedPlot: selectedOption
        });
      }
      
      // Mark selection as successful
      setSelectionSuccessful(true);
      
      toast({
        title: "¡Selección guardada!",
        description: "Tu selección ha sido guardada exitosamente.",
      });
      
    } catch (err: any) {
      console.error("Error saving selection:", err);
      const errorMessage = err.message || "Hubo un error al guardar tu selección. Por favor intenta nuevamente.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleContinueToPay = () => {
    navigate('/pagar', { 
      state: { 
        requestId,
        optionId: selectedOption,
        optionTitle: selectedOptionData?.title
      } 
    });
  };
  
  if (loading) {
    return (
      <div className="container py-12 text-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-rasti-blue" />
          <p>Cargando opciones...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container py-12 max-w-xl mx-auto">
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="text-center">
          <Button onClick={() => navigate('/')} className="bg-rasti-blue hover:bg-rasti-blue/80">
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }
  
  if (!request || !request.plotOptions || request.plotOptions.length === 0) {
    return (
      <div className="container py-12 text-center">
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Sin opciones disponibles</AlertTitle>
          <AlertDescription>No hay opciones de trama disponibles para esta solicitud.</AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/')} className="bg-rasti-blue hover:bg-rasti-blue/80">
          Volver al inicio
        </Button>
      </div>
    );
  }
  
  // Si ya se ha seleccionado una opción anteriormente, mostrar mensaje y redirigir
  if (request?.status === 'seleccion' || request?.status === 'pagado' || 
      request?.status === 'produccion' || request?.status === 'envio' || 
      request?.status === 'completado') {
    
    return (
      <div className="container py-12 max-w-xl mx-auto">
        <Alert className="mb-6">
          <AlertTitle>Opción ya seleccionada</AlertTitle>
          <AlertDescription>
            Ya has seleccionado una opción para esta solicitud.
          </AlertDescription>
        </Alert>
        <div className="text-center">
          <Button 
            onClick={() => {
              const selectedOptionData = request.plotOptions?.find(opt => opt.id === request.selectedPlot);
              navigate('/pagar', { 
                state: { 
                  requestId: request.id,
                  optionId: request.selectedPlot,
                  optionTitle: selectedOptionData?.title
                } 
              });
            }} 
            className="bg-rasti-blue hover:bg-rasti-blue/80"
          >
            {request.status === 'seleccion' ? 'Ir a Pagar' : 'Volver al inicio'}
          </Button>
        </div>
      </div>
    );
  }

  // Pantalla de confirmación después de seleccionar correctamente
  if (selectionSuccessful) {
    return (
      <div className="container py-12 max-w-xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4">¡Trama seleccionada correctamente!</h2>
          <p className="mb-6">
            Has seleccionado exitosamente la opción: <span className="font-medium">{selectedOptionData?.title}</span>
          </p>
          <p className="mb-8 text-muted-foreground">
            Ahora puedes continuar al proceso de pago para finalizar tu pedido.
          </p>
          <Button 
            onClick={() => navigate('/pagar', { 
              state: { 
                requestId,
                optionId: selectedOption,
                optionTitle: selectedOptionData?.title
              } 
            })}
            className="bg-rasti-blue hover:bg-rasti-blue/80 w-full max-w-sm"
            size="lg"
          >
            Continuar al pago
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-12 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-3">Opciones de Trama</h1>
        <p className="text-muted-foreground">
          Hola {request?.name}, estas son las opciones que hemos creado especialmente para {request?.childName}.
          Por favor, selecciona la que más te guste.
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <RadioGroup 
        value={selectedOption} 
        onValueChange={handleOptionSelect}
        className="space-y-6 mb-8"
      >
        {request?.plotOptions?.map((option) => (
          <Card
            key={option.id}
            className={`p-6 cursor-pointer transition-all duration-300 ${
              selectedOption === option.id
                ? 'border-rasti-blue border-2 shadow-md'
                : 'hover:border-rasti-blue/50 hover:shadow-md'
            }`}
          >
            <div className="flex items-start gap-4">
              <RadioGroupItem 
                value={option.id} 
                id={option.id}
                className="mt-1"
              />
              
              <div>
                <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                <p className="text-muted-foreground">{option.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </RadioGroup>
      
      <div className="flex justify-center">
        <Button
          className="bg-rasti-blue hover:bg-rasti-blue/80 text-white px-8"
          onClick={handleConfirmSelection}
          disabled={!selectedOption || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            'Confirmar Selección'
          )}
        </Button>
      </div>
    </div>
  );
};

export default StoryOptions;
