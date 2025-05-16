
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

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
  
  // Load request and options from localStorage
  useEffect(() => {
    const loadRequest = () => {
      try {
        const savedRequests = JSON.parse(localStorage.getItem('storyRequests') || '[]');
        console.log("All saved requests:", savedRequests);
        
        const foundRequest = savedRequests.find((req: StoryRequest) => req.id === requestId);
        console.log("Found request:", foundRequest);
        
        if (foundRequest) {
          // Make sure plotOptions exists and has items
          if (!foundRequest.plotOptions || foundRequest.plotOptions.length === 0) {
            setError("No se encontraron opciones de trama para esta solicitud.");
            setLoading(false);
            return;
          }
          
          setRequest(foundRequest);
          if (foundRequest.selectedPlot) {
            setSelectedOption(foundRequest.selectedPlot);
          }
        } else {
          // If request not found, show error and don't redirect yet
          setError("No se encontró la solicitud.");
          toast({
            title: "Error",
            description: "No se encontró la solicitud especificada.",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("Error loading request:", err);
        setError("Error al cargar la solicitud. Por favor intente nuevamente.");
        toast({
          title: "Error",
          description: "Error al cargar la solicitud. Por favor intente nuevamente.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadRequest();
  }, [requestId, toast]);
  
  const handleOptionSelect = (optionId: string) => {
    console.log("Option selected:", optionId);
    setSelectedOption(optionId);
    setError(null);
  };
  
  const handleConfirmSelection = () => {
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
      // En una implementación real, aquí enviarías la selección al backend
      // Por ahora, solo actualizamos en localStorage
      console.log("Saving selection:", selectedOption);
      
      const savedRequests = JSON.parse(localStorage.getItem('storyRequests') || '[]');
      const updatedRequests = savedRequests.map((req: StoryRequest) => {
        if (req.id === requestId) {
          return {
            ...req,
            status: 'seleccion' as StoryStatus,
            selectedPlot: selectedOption,
          };
        }
        return req;
      });
      
      localStorage.setItem('storyRequests', JSON.stringify(updatedRequests));

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
    } catch (err) {
      console.error("Error saving selection:", err);
      setError("Hubo un error al guardar tu selección. Por favor intenta nuevamente.");
      toast({
        title: "Error",
        description: "Hubo un error al guardar tu selección. Por favor intenta nuevamente.",
        variant: "destructive",
      });
    }
  };
  
  if (loading) {
    return (
      <div className="container py-12 text-center">
        <p>Cargando opciones...</p>
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
          disabled={!selectedOption}
        >
          Confirmar Selección y Continuar
        </Button>
      </div>
    </div>
  );
};

export default StoryOptions;
