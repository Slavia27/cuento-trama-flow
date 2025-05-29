import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

// Type definitions moved to a separate file
import { StoryRequest, StoryStatus } from '@/types/story';

export const useRequests = () => {
  const [requests, setRequests] = useState<StoryRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadRequests = useCallback(async () => {
    try {
      console.log("Fetching story requests from Supabase...");
      setIsLoading(true);
      
      // Get all requests from Supabase with explicit ordering
      const { data, error } = await supabase
        .from('story_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message);
      }

      if (!data) {
        console.log("No data returned from Supabase");
        setRequests([]);
        return;
      }

      console.log("Raw data from Supabase:", data);

      // Convert data to our StoryRequest format
      const formattedRequests: StoryRequest[] = data.map(req => ({
        id: req.request_id || req.id,
        name: req.name,
        email: req.email,
        childName: req.child_name,
        childAge: req.child_age,
        storyTheme: req.story_theme,
        specialInterests: req.special_interests || '',
        additionalDetails: req.additional_details || undefined,
        status: (req.status || 'pendiente') as StoryStatus,
        createdAt: req.created_at,
        selectedPlot: req.selected_plot || undefined,
        productionDays: req.production_days || 15,
        formData: req.form_data
      }));
      
      setRequests(formattedRequests);
      console.log("Loaded requests:", formattedRequests);
    } catch (error) {
      console.error("Error loading requests:", error);
      toast({
        title: "Error",
        description: "Error al cargar las solicitudes. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadRequests();
    
    // Subscribe to changes in story_requests table with improved real-time handling
    const channel = supabase
      .channel('story_requests_realtime')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'story_requests' 
        }, 
        (payload) => {
          console.log("Realtime update received:", payload);
          
          if (payload.eventType === 'UPDATE') {
            const updatedRecord = payload.new;
            console.log("Updated record:", updatedRecord);
            
            // Update the specific request in the state immediately using both possible ID fields
            setRequests(prev => {
              const recordId = updatedRecord.request_id || updatedRecord.id;
              const updatedRequests = prev.map(req => {
                if (req.id === recordId) {
                  const updatedRequest = {
                    ...req,
                    status: updatedRecord.status as StoryStatus,
                    selectedPlot: updatedRecord.selected_plot || undefined,
                    productionDays: updatedRecord.production_days || 15
                  };
                  console.log("Updating request in state:", updatedRequest);
                  return updatedRequest;
                }
                return req;
              });
              
              console.log("Updated requests state:", updatedRequests);
              return updatedRequests;
            });
            
            // Show toast notification for important status changes
            if (updatedRecord.status === 'seleccion' && updatedRecord.selected_plot) {
              console.log("Plot selection detected, showing toast");
              toast({
                title: "¡Selección realizada!",
                description: `${updatedRecord.name} ha seleccionado una opción de trama.`,
              });
            }
          } else if (payload.eventType === 'INSERT') {
            // For new inserts, add to the beginning of the list
            const newRecord = payload.new;
            const newRequest: StoryRequest = {
              id: newRecord.request_id || newRecord.id,
              name: newRecord.name,
              email: newRecord.email,
              childName: newRecord.child_name,
              childAge: newRecord.child_age,
              storyTheme: newRecord.story_theme,
              specialInterests: newRecord.special_interests || '',
              additionalDetails: newRecord.additional_details || undefined,
              status: (newRecord.status || 'pendiente') as StoryStatus,
              createdAt: newRecord.created_at,
              selectedPlot: newRecord.selected_plot || undefined,
              productionDays: newRecord.production_days || 15,
              formData: newRecord.form_data
            };
            
            setRequests(prev => [newRequest, ...prev]);
            
            toast({
              title: "Nueva solicitud",
              description: `${newRecord.name} ha enviado una nueva solicitud.`,
            });
          } else if (payload.eventType === 'DELETE') {
            // Remove the deleted request
            const deletedRecord = payload.old;
            const deletedId = deletedRecord.request_id || deletedRecord.id;
            setRequests(prev => prev.filter(req => req.id !== deletedId));
          }
        }
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
      });
      
    return () => {
      console.log("Removing realtime channel");
      supabase.removeChannel(channel);
    };
  }, [loadRequests, toast]);

  const deleteRequest = async (id: string) => {
    try {
      console.log("Attempting to delete request with ID:", id);
      
      // First try to find the request in our local state to get the proper database ID
      const requestToDelete = requests.find(req => req.id === id);
      if (!requestToDelete) {
        console.error("Request not found in local state:", id);
        toast({
          title: "Error",
          description: "No se encontró la solicitud a eliminar",
          variant: "destructive",
        });
        return false;
      }

      // Delete from Supabase using both possible ID columns for maximum compatibility
      const { error } = await supabase
        .from('story_requests')
        .delete()
        .or(`request_id.eq.${id},id.eq.${id}`);
        
      if (error) {
        console.error("Supabase delete error:", error);
        throw error;
      }
      
      console.log("Successfully deleted from Supabase, updating local state");
      
      // Update local state immediately
      setRequests(prev => prev.filter(req => req.id !== id));
      
      toast({
        title: "Solicitud eliminada",
        description: "La solicitud ha sido eliminada correctamente.",
      });

      return true;
    } catch (err) {
      console.error("Error al eliminar la solicitud:", err);
      toast({
        title: "Error",
        description: "No se pudo eliminar la solicitud",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateRequestStatus = async (requestId: string, newStatus: StoryStatus) => {
    try {
      // Update using both possible ID fields for compatibility
      const { error } = await supabase
        .from('story_requests')
        .update({ status: newStatus })
        .or(`request_id.eq.${requestId},id.eq.${requestId}`);
        
      if (error) throw error;
      
      // Update the local state with the new status
      setRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      ));
      
      const statusLabels: Record<string, string> = {
        'produccion': 'Producción',
        'envio': 'Envío',
        'completado': 'Completado',
        'pendiente': 'Pendiente',
        'opciones': 'Opciones',
        'seleccion': 'Seleccionada',
        'pagado': 'Pagado'
      };
      
      toast({
        title: "Estado actualizado",
        description: `La solicitud ha sido actualizada al estado: ${statusLabels[newStatus] || newStatus}.`,
      });
      
      return true;
    } catch (err) {
      console.error("Error al actualizar el estado:", err);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la solicitud",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateProductionDays = async (requestId: string, days: number) => {
    try {
      // Update using both possible ID fields for compatibility
      const { error } = await supabase
        .from('story_requests')
        .update({ production_days: days })
        .or(`request_id.eq.${requestId},id.eq.${requestId}`);
        
      if (error) throw error;
      
      // Update the local state
      setRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, productionDays: days } : req
      ));
      
      toast({
        title: "Días de producción actualizados",
        description: `Se han establecido ${days} días hábiles para la producción del cuento.`,
      });
      
      return true;
    } catch (err) {
      console.error("Error al actualizar los días de producción:", err);
      toast({
        title: "Error",
        description: "No se pudieron actualizar los días de producción",
        variant: "destructive",
      });
      return false;
    }
  };

  return { 
    requests, 
    isLoading, 
    deleteRequest,
    updateRequestStatus,
    updateProductionDays,
    loadRequests
  };
};
