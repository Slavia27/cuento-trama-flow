
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PlotOption, StoryRequest } from '@/types/story';

export const usePlotOptions = () => {
  const [isSending, setIsSending] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isSendingPaymentLink, setIsSendingPaymentLink] = useState(false);
  const { toast } = useToast();

  const sendPlotOptions = async (
    request: StoryRequest,
    plotOptions: { title: string; description: string }[]
  ) => {
    if (plotOptions.some(opt => !opt.title || !opt.description)) {
      toast({
        title: "Error",
        description: "Todas las opciones deben tener título y descripción.",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      setIsSending(true);

      // Prepare plot options for email
      const optionsWithIds = plotOptions.map((opt, idx) => ({
        id: `opt-${idx + 1}`,
        title: opt.title,
        description: opt.description,
      }));
      
      // Send email using edge function
      const { data, error } = await supabase.functions.invoke('send-plot-options', {
        body: {
          to: request.email,
          name: request.name,
          childName: request.childName,
          requestId: request.id,
          plotOptions: optionsWithIds,
        }
      });

      if (error) {
        throw new Error(error.message);
      }
      
      toast({
        title: "Opciones enviadas",
        description: `Se han enviado las opciones de trama para ${request.childName} por correo electrónico.`,
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error al enviar opciones",
        description: error.message || "No se pudieron enviar las opciones por correo electrónico.",
        variant: "destructive",
      });
      console.error("Error sending plot options:", error);
      return false;
    } finally {
      setIsSending(false);
    }
  };

  const resendPlotOptions = async (request: StoryRequest) => {
    try {
      setIsResending(true);
      
      // Get options from database
      const { data, error } = await supabase
        .from('plot_options')
        .select('*')
        .eq('request_id', request.id);
        
      if (error) throw new Error(error.message);
      
      if (!data || data.length === 0) {
        // Si no hay opciones en la base de datos pero el estado es 'opciones', 
        // permitir reenviar con un mensaje genérico
        if (request.status === 'opciones' || request.status === 'seleccion' || request.status === 'pagado') {
          // Usar las opciones del request si existen
          const optionsToSend = request.plotOptions || [
            { id: "opt-1", title: "Opción 1", description: "Por favor contacta al administrador si necesitas más detalles sobre esta opción." }
          ];
          
          // Send email using edge function
          const { error: invokeError } = await supabase.functions.invoke('send-plot-options', {
            body: {
              to: request.email,
              name: request.name,
              childName: request.childName,
              requestId: request.id,
              plotOptions: optionsToSend,
              resend: true
            }
          });

          if (invokeError) {
            throw new Error(invokeError.message);
          }
          
          toast({
            title: "Correo reenviado",
            description: `Se han reenviado las opciones de trama para ${request.childName} por correo electrónico.`,
          });
          
          return true;
        } else {
          throw new Error("No se encontraron opciones para reenviar");
        }
      }
      
      const plotOptions = data.map(opt => ({
        id: opt.option_id,
        title: opt.title,
        description: opt.description
      }));
      
      // Send email using edge function
      const { error: invokeError } = await supabase.functions.invoke('send-plot-options', {
        body: {
          to: request.email,
          name: request.name,
          childName: request.childName,
          requestId: request.id,
          plotOptions,
          resend: true
        }
      });

      if (invokeError) {
        throw new Error(invokeError.message);
      }
      
      toast({
        title: "Correo reenviado",
        description: `Se han reenviado las opciones de trama para ${request.childName} por correo electrónico.`,
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error al reenviar opciones",
        description: error.message || "No se pudieron reenviar las opciones por correo electrónico.",
        variant: "destructive",
      });
      console.error("Error resending plot options:", error);
      return false;
    } finally {
      setIsResending(false);
    }
  };

  const sendPaymentLink = async (request: StoryRequest) => {
    if (!request || !request.selectedPlot) {
      toast({
        title: "Error",
        description: "No se ha seleccionado ninguna opción",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      setIsSendingPaymentLink(true);
      
      // Find the title of the selected option
      const { data, error } = await supabase
        .from('plot_options')
        .select('*')
        .eq('option_id', request.selectedPlot)
        .eq('request_id', request.id)
        .single();
      
      if (error || !data) {
        // Si no encontramos la opción seleccionada en la base de datos, usar la del request
        const selectedOption = request.plotOptions?.find(opt => opt.id === request.selectedPlot);
        if (!selectedOption) {
          throw new Error("No se encontró la opción seleccionada");
        }
        
        // Send payment link email
        const { error: invokeError } = await supabase.functions.invoke('send-payment-link', {
          body: {
            to: request.email,
            name: request.name,
            childName: request.childName,
            requestId: request.id,
            optionId: request.selectedPlot,
            optionTitle: selectedOption.title,
          }
        });
        
        if (invokeError) {
          throw new Error(invokeError.message);
        }
      } else {
        // Send payment link email
        const { error: invokeError } = await supabase.functions.invoke('send-payment-link', {
          body: {
            to: request.email,
            name: request.name,
            childName: request.childName,
            requestId: request.id,
            optionId: request.selectedPlot,
            optionTitle: data.title,
          }
        });

        if (invokeError) {
          throw new Error(invokeError.message);
        }
      }
      
      // Update status to paid
      const { error: updateError } = await supabase
        .from('story_requests')
        .update({ status: 'pagado' })
        .eq('request_id', request.id);
        
      if (updateError) throw new Error(updateError.message);
      
      toast({
        title: "Enlace de pago enviado",
        description: `Se ha enviado un enlace de pago para ${request.childName} por correo electrónico.`,
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error al enviar enlace de pago",
        description: error.message || "No se pudo enviar el enlace de pago por correo electrónico.",
        variant: "destructive",
      });
      console.error("Error sending payment link:", error);
      return false;
    } finally {
      setIsSendingPaymentLink(false);
    }
  };

  const fetchPlotOptions = async (requestId: string) => {
    try {
      const { data, error } = await supabase
        .from('plot_options')
        .select('*')
        .eq('request_id', requestId);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        return data.map(opt => ({
          id: opt.option_id,
          title: opt.title,
          description: opt.description
        }));
      }
      
      return [];
    } catch (err) {
      console.error("Error loading plot options:", err);
      return [];
    }
  };

  return {
    isSending,
    isResending,
    isSendingPaymentLink,
    sendPlotOptions,
    resendPlotOptions,
    sendPaymentLink,
    fetchPlotOptions
  };
};
