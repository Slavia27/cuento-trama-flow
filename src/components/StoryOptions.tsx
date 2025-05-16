
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

type StoryRequest = {
  id: string;
  name: string;
  childName: string;
  status: string;
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
  
  // Cargar la solicitud y opciones desde localStorage (simula base de datos)
  useEffect(() => {
    const loadRequest = () => {
      const savedRequests = JSON.parse(localStorage.getItem('storyRequests') || '[]');
      const foundRequest = savedRequests.find((req: StoryRequest) => req.id === requestId);
      
      if (foundRequest && foundRequest.plotOptions && foundRequest.plotOptions.length > 0) {
        setRequest(foundRequest);
        if (foundRequest.selectedPlot) {
          setSelectedOption(foundRequest.selectedPlot);
        }
        setError(null);
      } else {
        // Si no se encuentra o no tiene opciones, redireccionar
        navigate('/');
        toast({
          title: "Error",
          description: "No se encontraron opciones para esta solicitud.",
          variant: "destructive",
        });
      }
      
      setLoading(false);
    };
    
    loadRequest();
  }, [requestId, navigate, toast]);
  
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
            status: 'option_selected',
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
  
  if (!request) {
    return (
      <div className="container py-12 text-center">
        <p>No se encontró la solicitud.</p>
      </div>
    );
  }
  
  return (
    <div className="container py-12 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-3">Opciones de Trama</h1>
        <p className="text-muted-foreground">
          Hola {request.name}, estas son las opciones que hemos creado especialmente para {request.childName}.
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
        {request.plotOptions?.map((option) => (
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
