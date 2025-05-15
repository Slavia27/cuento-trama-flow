
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

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
  
  // Cargar la solicitud y opciones desde localStorage (simula base de datos)
  useEffect(() => {
    const loadRequest = () => {
      const savedRequests = JSON.parse(localStorage.getItem('storyRequests') || '[]');
      const foundRequest = savedRequests.find((req: StoryRequest) => req.id === requestId);
      
      if (foundRequest && (foundRequest.status === 'options_sent' || foundRequest.status === 'option_selected')) {
        setRequest(foundRequest);
        if (foundRequest.selectedPlot) {
          setSelectedOption(foundRequest.selectedPlot);
        }
      } else {
        // Si no se encuentra o no tiene opciones, redireccionar
        navigate('/');
        toast({
          title: "Error",
          description: "No se encontraron opciones para esta solicitud o ya ha sido procesada.",
          variant: "destructive",
        });
      }
      
      setLoading(false);
    };
    
    loadRequest();
  }, [requestId, navigate, toast]);
  
  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };
  
  const handleConfirmSelection = () => {
    if (!selectedOption) {
      toast({
        title: "Error",
        description: "Por favor selecciona una opción antes de continuar.",
        variant: "destructive",
      });
      return;
    }
    
    // En una implementación real, aquí enviarías la selección al backend
    // Por ahora, solo actualizamos en localStorage
    
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
    
    toast({
      title: "¡Selección guardada!",
      description: "Tu selección ha sido guardada. A continuación, podrás realizar el pago para continuar.",
    });
    
    // Simular redirección a WIX para pago
    navigate('/pagar', { 
      state: { 
        requestId,
        selectedOption,
        optionTitle: request?.plotOptions?.find(opt => opt.id === selectedOption)?.title
      } 
    });
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
      
      <div className="space-y-6 mb-8">
        {request.plotOptions?.map((option) => (
          <Card
            key={option.id}
            className={`p-6 cursor-pointer transition-all duration-300 ${
              selectedOption === option.id
                ? 'border-story-blue border-2 shadow-md'
                : 'hover:border-story-blue/50 hover:shadow-md'
            }`}
            onClick={() => handleOptionSelect(option.id)}
          >
            <div className="flex items-start gap-4">
              <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 mt-1 ${
                selectedOption === option.id
                  ? 'border-story-blue bg-story-blue'
                  : 'border-gray-300'
              }`}>
                {selectedOption === option.id && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                <p className="text-muted-foreground">{option.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center">
        <Button
          className="bg-story-blue hover:bg-story-blue/80 px-8"
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
