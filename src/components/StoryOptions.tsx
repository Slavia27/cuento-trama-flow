
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

        console.log("🔍 Buscando solicitud con ID:", requestId);

        // Buscar directamente por request_id (que es el campo que usamos en los enlaces)
        const { data: requestData, error: requestError } = await supabase
          .from('story_requests')
          .select('*')
          .eq('request_id', requestId)
          .single();
        
        console.log("🔍 Resultado de búsqueda:", requestData);
        if (requestError) console.error("🔍 Error en búsqueda:", requestError);

        if (requestError || !requestData) {
          console.error("❌ No se encontró la solicitud con request_id:", requestId);
          setError(`No se encontró la solicitud. ID buscado: ${requestId}. Verifica el enlace e intenta nuevamente.`);
          setLoading(false);
          return;
        }

        const foundRequest = requestData;
        console.log("✅ Solicitud encontrada:", foundRequest);

        // Obtener las opciones de trama para esta solicitud
        console.log("🔍 Buscando opciones para request_id:", foundRequest.request_id);
        
        const { data: optionsData, error: optionsError } = await supabase
          .from('plot_options')
          .select('*')
          .eq('request_id', foundRequest.request_id);
        
        if (optionsError) {
          console.error("❌ Error al obtener las opciones de trama:", optionsError);
          setError("Error al cargar las opciones de trama. Por favor intenta nuevamente.");
          setLoading(false);
          return;
        }

        console.log("🔍 Opciones de trama encontradas:", optionsData);

        // Formatear los datos para el componente
        const formattedRequest: StoryRequest = {
          id: foundRequest.request_id,
          name: foundRequest.name,
          childName: foundRequest.child_name,
          status: foundRequest.status as StoryStatus,
          selectedPlot: foundRequest.selected_plot || undefined,
          plotOptions: optionsData && optionsData.length > 0 
            ? optionsData.map(opt => ({
                id: opt.option_id,
                title: opt.title,
                description: opt.description
              }))
            : []
        };
        
        console.log("✅ Request formateado final:", formattedRequest);
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
        console.error("❌ Error general al cargar la solicitud:", err);
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
    
    if (!requestId || !request) {
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
      console.log(`🔄 Guardando selección de trama: ${selectedOption} para la solicitud: ${request.id}`);
      
      // PASO 1: Actualizar la solicitud principal
      console.log("🔄 PASO 1: Actualizando story_requests...");
      const { data: updateData, error: updateError } = await supabase
        .from('story_requests')
        .update({ 
          selected_plot: selectedOption,
          status: 'seleccion'
        })
        .eq('request_id', request.id)
        .select();
      
      if (updateError) {
        console.error("❌ Error al actualizar la solicitud:", updateError);
        throw new Error(`Error al actualizar solicitud: ${updateError.message}`);
      }
      
      console.log("✅ Solicitud actualizada exitosamente:", updateData);
      
      // PASO 2: Desmarcar todas las opciones anteriores
      console.log("🔄 PASO 2: Desmarcando todas las opciones...");
      const { error: unmarkError } = await supabase
        .from('plot_options')
        .update({ is_selected: false })
        .eq('request_id', request.id);
      
      if (unmarkError) {
        console.error("❌ Error al desmarcar opciones:", unmarkError);
        throw new Error(`Error al desmarcar opciones: ${unmarkError.message}`);
      }
      
      console.log("✅ Opciones desmarcadas exitosamente");
      
      // PASO 3: Marcar la opción seleccionada
      console.log("🔄 PASO 3: Marcando opción seleccionada...");
      const { data: markData, error: markError } = await supabase
        .from('plot_options')
        .update({ is_selected: true })
        .eq('option_id', selectedOption)
        .eq('request_id', request.id)
        .select();
      
      if (markError) {
        console.error("❌ Error al marcar opción seleccionada:", markError);
        throw new Error(`Error al marcar opción: ${markError.message}`);
      }
      
      console.log("✅ Opción marcada exitosamente:", markData);
      
      // PASO 4: Verificar que la actualización fue exitosa
      console.log("🔄 PASO 4: Verificando actualización...");
      const { data: verifyRequest, error: verifyRequestError } = await supabase
        .from('story_requests')
        .select('status, selected_plot')
        .eq('request_id', request.id)
        .single();
      
      if (verifyRequestError) {
        console.error("❌ Error al verificar solicitud:", verifyRequestError);
        throw new Error(`Error al verificar solicitud: ${verifyRequestError.message}`);
      }
      
      const { data: verifyOptions, error: verifyOptionsError } = await supabase
        .from('plot_options')
        .select('option_id, is_selected')
        .eq('request_id', request.id)
        .eq('is_selected', true);
      
      if (verifyOptionsError) {
        console.error("❌ Error al verificar opciones:", verifyOptionsError);
        throw new Error(`Error al verificar opciones: ${verifyOptionsError.message}`);
      }
      
      console.log("🔍 Verificación - Solicitud:", verifyRequest);
      console.log("🔍 Verificación - Opciones marcadas:", verifyOptions);
      
      // Verificar que todo se guardó correctamente
      if (verifyRequest.selected_plot !== selectedOption) {
        throw new Error(`La selección no se guardó en story_requests. Esperado: ${selectedOption}, Obtenido: ${verifyRequest.selected_plot}`);
      }
      
      if (!verifyOptions || verifyOptions.length === 0) {
        throw new Error("No se encontró ninguna opción marcada como seleccionada");
      }
      
      const selectedOptionInDB = verifyOptions.find(opt => opt.option_id === selectedOption);
      if (!selectedOptionInDB) {
        throw new Error(`La opción ${selectedOption} no está marcada como seleccionada en la base de datos`);
      }
      
      console.log("✅ Verificación exitosa - Todo se guardó correctamente");
      
      // Encontrar los datos de la opción seleccionada
      const optionData = request?.plotOptions?.find(opt => opt.id === selectedOption);
      setSelectedOptionData(optionData || null);
      
      // Actualizar el estado local
      setRequest({
        ...request,
        status: 'seleccion',
        selectedPlot: selectedOption
      });
      
      // Marcar la selección como exitosa
      setSelectionSuccessful(true);
      
      console.log("✅ Selección guardada exitosamente");
      
      toast({
        title: "¡Selección guardada!",
        description: "Tu selección ha sido guardada exitosamente.",
      });
      
    } catch (err: any) {
      console.error("❌ Error al guardar la selección:", err);
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
        requestId: request?.id,
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
            onClick={handleContinueToPay}
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
