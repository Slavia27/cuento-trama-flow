
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

// Type definitions moved to a separate file
import { StoryRequest, StoryStatus } from '@/types/story';

export const useRequests = () => {
  const [requests, setRequests] = useState<StoryRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadRequests = async () => {
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
        id: req.request_id || req.id,  // Use request_id if available, otherwise fall back to id
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
  };

  useEffect(() => {
    loadRequests();
    
    // Subscribe to changes in story_requests table
    const channel = supabase
      .channel('story_requests_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'story_requests' }, 
        (payload) => {
          console.log("Realtime update received:", payload);
          loadRequests();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const deleteRequest = async (id: string) => {
    try {
      const { error } = await supabase
        .from('story_requests')
        .delete()
        .eq('request_id', id);
        
      if (error) throw error;
      
      // Update local state
      const updatedRequests = requests.filter(req => req.id !== id);
      setRequests(updatedRequests);
      
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
      const { error } = await supabase
        .from('story_requests')
        .update({ status: newStatus })
        .eq('request_id', requestId);
        
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
      const { error } = await supabase
        .from('story_requests')
        .update({ production_days: days })
        .eq('request_id', requestId);
        
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
