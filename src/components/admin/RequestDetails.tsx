import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye } from 'lucide-react';
import { StoryRequest, PlotOption } from '@/types/story';
import FormDetailViewer from './FormDetailViewer';
import PlotOptionsForm from './PlotOptionsForm';
import PlotOptionsView from './PlotOptionsView';
import StatusManagement from './StatusManagement';
import { usePlotOptions } from '@/hooks/usePlotOptions';

interface RequestDetailsProps {
  selectedRequest: StoryRequest | null;
  onRequestUpdated: (updatedRequest: StoryRequest) => void;
  onStatusUpdate: (requestId: string, status: 'produccion' | 'envio' | 'completado') => void;
  onProductionDaysUpdate: (requestId: string, days: number) => void;
}

const RequestDetails = ({ 
  selectedRequest, 
  onRequestUpdated, 
  onStatusUpdate,
  onProductionDaysUpdate
}: RequestDetailsProps) => {
  const [plotOptions, setPlotOptions] = useState<PlotOption[]>([]);
  const { 
    isSending,
    isResending,
    isSendingPaymentLink,
    sendPlotOptions,
    resendPlotOptions,
    sendPaymentLink,
    fetchPlotOptions
  } = usePlotOptions();

  // Simplified effect that only fetches when selectedRequest.id changes
  useEffect(() => {
    const loadPlotOptions = async () => {
      if (selectedRequest?.id) {
        console.log("🔄 Cargando opciones de plot para:", selectedRequest.id);
        try {
          const options = await fetchPlotOptions(selectedRequest.id);
          console.log("✅ Opciones cargadas:", options);
          setPlotOptions(options);
        } catch (error) {
          console.error("❌ Error cargando opciones:", error);
          setPlotOptions([]);
        }
      } else {
        setPlotOptions([]);
      }
    };

    loadPlotOptions();
  }, [selectedRequest?.id]); // Only depend on the ID

  const handleSendPlotOptions = async (options: { title: string; description: string }[]) => {
    if (!selectedRequest) return;
    
    const success = await sendPlotOptions(selectedRequest, options);
    if (success) {
      // Update the local state to reflect changes
      const updatedRequest = {
        ...selectedRequest,
        status: 'opciones' as const,
        plotOptions: options.map((opt, idx) => ({
          id: `opt-${idx + 1}`,
          title: opt.title,
          description: opt.description,
        }))
      };
      onRequestUpdated(updatedRequest);
      setPlotOptions(updatedRequest.plotOptions || []);
    }
  };

  const handleResendOptions = async () => {
    if (!selectedRequest) return;
    await resendPlotOptions(selectedRequest);
  };

  const handleSendPaymentLink = async () => {
    if (!selectedRequest) return;
    
    const success = await sendPaymentLink(selectedRequest);
    if (success) {
      // Update the local state to reflect changes
      const updatedRequest = {
        ...selectedRequest,
        status: 'pagado' as const
      };
      onRequestUpdated(updatedRequest);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'opciones': return 'bg-blue-100 text-blue-800';
      case 'seleccion': return 'bg-purple-100 text-purple-800';
      case 'pagado': return 'bg-indigo-100 text-indigo-800';
      case 'produccion': return 'bg-orange-100 text-orange-800';
      case 'envio': return 'bg-pink-100 text-pink-800';
      case 'completado': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pendiente': return 'Pendiente';
      case 'opciones': return 'Opciones Enviadas';
      case 'seleccion': return 'Opción Seleccionada';
      case 'pagado': return 'Pagado';
      case 'produccion': return 'En Producción';
      case 'envio': return 'En Envío';
      case 'completado': return 'Completado';
      default: return status;
    }
  };

  // Find the selected plot option
  const selectedPlotOption = plotOptions.find(option => option.id === selectedRequest?.selectedPlot);

  // Add debugging for illustration style
  console.log("🔍 Debugging illustration style:", {
    selectedRequest: selectedRequest?.id,
    illustrationStyle: selectedRequest?.illustrationStyle,
    hasSelectedPlot: !!selectedPlotOption
  });

  if (!selectedRequest) {
    return (
      <div className="h-full flex items-center justify-center flex-col">
        <p className="text-muted-foreground mb-2">Selecciona una solicitud para ver detalles</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold">Detalles de la Solicitud</h3>
          <p className="text-sm text-muted-foreground">
            {new Date(selectedRequest.createdAt).toLocaleDateString()} - {selectedRequest.name}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Ver Formulario Completo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Detalles del Formulario</DialogTitle>
                <DialogDescription>
                  Respuestas completas de {selectedRequest.name} para {selectedRequest.childName}
                </DialogDescription>
              </DialogHeader>
              <FormDetailViewer formData={selectedRequest.formData} />
              <DialogFooter>
                <DialogClose asChild>
                  <Button>Cerrar</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(selectedRequest.status)}`}>
            {getStatusLabel(selectedRequest.status)}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Cliente</p>
          <p>{selectedRequest.name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Correo Electrónico</p>
          <p>{selectedRequest.email}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Niño/a</p>
          <p>{selectedRequest.childName}, {selectedRequest.childAge} años</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Tema del Cuento</p>
          <p>{selectedRequest.storyTheme}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <p className="text-sm font-medium text-muted-foreground mb-1">Intereses Especiales</p>
        <p className="p-3 bg-muted rounded-md">{selectedRequest.specialInterests}</p>
      </div>
      
      {selectedRequest.additionalDetails && (
        <div className="mb-6">
          <p className="text-sm font-medium text-muted-foreground mb-1">Detalles Adicionales</p>
          <p className="p-3 bg-muted rounded-md">{selectedRequest.additionalDetails}</p>
        </div>
      )}

      {/* Selected Plot and Illustration Style Section */}
      {(selectedPlotOption || selectedRequest.illustrationStyle) && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="text-lg font-semibold text-green-800 mb-3">Selecciones del Cliente</h4>
          
          {selectedPlotOption && (
            <div className="mb-4">
              <p className="text-sm font-medium text-green-700 mb-2">- Trama Seleccionada:</p>
              <div className="bg-white p-3 rounded border border-green-200 ml-4">
                <p className="text-green-900 font-medium mb-1">Título: "{selectedPlotOption.title}"</p>
                <p className="text-green-700 text-sm">Descripción: "{selectedPlotOption.description}"</p>
              </div>
            </div>
          )}
          
          {selectedRequest.illustrationStyle && (
            <div>
              <p className="text-sm font-medium text-green-700 mb-2">- Estilo de Ilustración Seleccionado:</p>
              <div className="bg-white p-3 rounded border border-green-200 ml-4">
                <p className="text-green-900 font-medium">"{selectedRequest.illustrationStyle}"</p>
              </div>
            </div>
          )}

          {!selectedPlotOption && !selectedRequest.illustrationStyle && (
            <div className="bg-white p-3 rounded border border-green-200">
              <p className="text-green-700 text-sm italic">Aún no se han realizado selecciones</p>
            </div>
          )}
        </div>
      )}
      
      {/* Status and Production Management for paid+ requests */}
      {(selectedRequest?.status === 'pagado' || selectedRequest?.status === 'produccion' || selectedRequest?.status === 'envio' || selectedRequest?.status === 'completado') && (
        <StatusManagement 
          status={selectedRequest.status}
          productionDays={selectedRequest.productionDays || 15}
          onUpdateStatus={(status) => onStatusUpdate(selectedRequest.id, status)}
          onUpdateProductionDays={(days) => onProductionDaysUpdate(selectedRequest.id, days)}
        />
      )}
      
      {/* Plot Options Form for new requests */}
      {selectedRequest.status === 'pendiente' && (
        <PlotOptionsForm 
          onSubmit={handleSendPlotOptions} 
          isSubmitting={isSending} 
        />
      )}
      
      {/* Plot Options View for requests with options */}
      {selectedRequest.status !== 'pendiente' && (
        <PlotOptionsView
          plotOptions={plotOptions}
          selectedPlotId={selectedRequest.selectedPlot}
          status={selectedRequest.status}
          onResendOptions={handleResendOptions}
          onSendPaymentLink={handleSendPaymentLink}
          isResending={isResending}
          isSendingPayment={isSendingPaymentLink}
        />
      )}
    </>
  );
};

export default RequestDetails;
