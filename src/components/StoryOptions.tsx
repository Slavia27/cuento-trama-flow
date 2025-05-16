
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

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
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
          selectedPlot: requestData.selected_plot || null,
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
    
    try {
      if (!requestId) return;
      
      setIsSubmitting(true);
      console.log(`Guardando selección de trama: ${selectedOption} para la solicitud: ${requestId}`);
      
      // Actualizar la selección en Supabase
      const { error: updateError } = await supabase
        .from('story_requests')
        .update({ 
          status: 'seleccion',
          selected_plot: selectedOption 
        })
        .eq('request_id', requestId);
      
      if (updateError) {
        console.error("Error al actualizar la selección:", updateError);
        throw new Error(updateError.message);
      }

      console.log("Selección guardada correctamente");
      const selectedOptionData = request?.plotOptions?.find(opt => opt.id === selectedOption);
      
      toast({
        title: "¡Selección guardada!",
        description: "Tu selección ha sido guardada. A continuación, podrás realizar el pago para continuar.",
      });
      
      // Redirect to payment page with proper state
      navigate('/pagar', { 
        state: { 
          requestId,
          optionId: selectedOption,
          optionTitle: selectedOptionData?.title
        } 
      });
    } catch (err: any) {
      console.error("Error saving selection:", err);
      setError("Hubo un error al guardar tu selección. Por favor intenta nuevamente.");
      toast({
        title: "Error",
        description: "Hubo un error al guardar tu selección. Por favor intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
        value={selectedOption || ""} 
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
            'Confirmar Selección y Continuar'
          )}
        </Button>
      </div>
    </div>
  );
};

export default StoryOptions;
