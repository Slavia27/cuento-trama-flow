
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

type StoryRequest = {
  id: string;
  name: string;
  email: string;
  childName: string;
  childAge: string;
  storyTheme: string;
  specialInterests: string;
  additionalDetails?: string;
  status: 'pending' | 'options_sent' | 'option_selected' | 'completed';
  createdAt: string;
  plotOptions?: { id: string; title: string; description: string }[];
  selectedPlot?: string;
};

const AdminDashboard = () => {
  const [requests, setRequests] = useState<StoryRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<StoryRequest | null>(null);
  const [plotOptions, setPlotOptions] = useState<{ title: string; description: string }[]>([
    { title: '', description: '' },
    { title: '', description: '' },
    { title: '', description: '' },
  ]);
  const { toast } = useToast();
  
  // Cargar solicitudes de localStorage (simulando una base de datos)
  useEffect(() => {
    const savedRequests = JSON.parse(localStorage.getItem('storyRequests') || '[]');
    setRequests(savedRequests as StoryRequest[]);
  }, []);
  
  // Guardar solicitudes en localStorage cuando se actualizan
  useEffect(() => {
    if (requests.length > 0) {
      localStorage.setItem('storyRequests', JSON.stringify(requests));
    }
  }, [requests]);
  
  const handleSelectRequest = (request: StoryRequest) => {
    setSelectedRequest(request);
    setPlotOptions(request.plotOptions || [
      { title: '', description: '' },
      { title: '', description: '' },
      { title: '', description: '' },
    ]);
  };
  
  const handlePlotOptionChange = (index: number, field: 'title' | 'description', value: string) => {
    const newOptions = [...plotOptions];
    newOptions[index][field] = value;
    setPlotOptions(newOptions);
  };
  
  const handleSendOptions = () => {
    // Validar que todas las opciones tengan título y descripción
    if (plotOptions.some(opt => !opt.title || !opt.description)) {
      toast({
        title: "Error",
        description: "Todas las opciones deben tener título y descripción.",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedRequest) return;
    
    // En una implementación real, aquí enviarías un correo al cliente con las opciones
    // Por ahora, solo actualizamos el estado
    const updatedRequests = requests.map(req => {
      if (req.id === selectedRequest.id) {
        return {
          ...req,
          status: 'options_sent' as const,
          plotOptions: plotOptions.map((opt, idx) => ({
            id: `opt-${idx + 1}`,
            title: opt.title,
            description: opt.description,
          })),
        };
      }
      return req;
    });
    
    setRequests(updatedRequests);
    setSelectedRequest(prev => prev ? {
      ...prev,
      status: 'options_sent' as const,
      plotOptions: plotOptions.map((opt, idx) => ({
        id: `opt-${idx + 1}`,
        title: opt.title,
        description: opt.description,
      })),
    } : null);
    
    toast({
      title: "Opciones enviadas",
      description: `Se han enviado las opciones de trama para ${selectedRequest.childName}.`,
    });
  };
  
  return (
    <div className="container py-10">
      <h2 className="text-3xl font-bold mb-8">Panel de Administración</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lista de solicitudes */}
        <div className="lg:col-span-4">
          <Card className="p-4 h-full">
            <h3 className="text-xl font-bold mb-4">Solicitudes</h3>
            
            <Tabs defaultValue="pending">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="pending" className="flex-1">Pendientes</TabsTrigger>
                <TabsTrigger value="options_sent" className="flex-1">Opciones Enviadas</TabsTrigger>
                <TabsTrigger value="completed" className="flex-1">Completados</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pending" className="space-y-2 max-h-[500px] overflow-y-auto">
                {requests.filter(req => req.status === 'pending').map(request => (
                  <div
                    key={request.id}
                    className={`p-3 rounded-lg border cursor-pointer hover:bg-muted transition-colors ${
                      selectedRequest?.id === request.id ? 'bg-muted border-primary' : ''
                    }`}
                    onClick={() => handleSelectRequest(request)}
                  >
                    <p className="font-medium">{request.name}</p>
                    <p className="text-sm text-muted-foreground">Niño/a: {request.childName}, {request.childAge} años</p>
                    <p className="text-sm text-muted-foreground">Tema: {request.storyTheme}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                
                {requests.filter(req => req.status === 'pending').length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No hay solicitudes pendientes.</p>
                )}
              </TabsContent>
              
              <TabsContent value="options_sent" className="space-y-2 max-h-[500px] overflow-y-auto">
                {requests.filter(req => req.status === 'options_sent').map(request => (
                  <div
                    key={request.id}
                    className={`p-3 rounded-lg border cursor-pointer hover:bg-muted transition-colors ${
                      selectedRequest?.id === request.id ? 'bg-muted border-primary' : ''
                    }`}
                    onClick={() => handleSelectRequest(request)}
                  >
                    <p className="font-medium">{request.name}</p>
                    <p className="text-sm text-muted-foreground">Niño/a: {request.childName}, {request.childAge} años</p>
                    <p className="text-sm text-muted-foreground">Tema: {request.storyTheme}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                
                {requests.filter(req => req.status === 'options_sent').length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No hay solicitudes con opciones enviadas.</p>
                )}
              </TabsContent>
              
              <TabsContent value="completed" className="space-y-2 max-h-[500px] overflow-y-auto">
                {requests.filter(req => req.status === 'completed').map(request => (
                  <div
                    key={request.id}
                    className={`p-3 rounded-lg border cursor-pointer hover:bg-muted transition-colors ${
                      selectedRequest?.id === request.id ? 'bg-muted border-primary' : ''
                    }`}
                    onClick={() => handleSelectRequest(request)}
                  >
                    <p className="font-medium">{request.name}</p>
                    <p className="text-sm text-muted-foreground">Niño/a: {request.childName}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                
                {requests.filter(req => req.status === 'completed').length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No hay solicitudes completadas.</p>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
        
        {/* Detalles de la solicitud */}
        <div className="lg:col-span-8">
          <Card className="p-6 h-full">
            {selectedRequest ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Detalles de la Solicitud</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedRequest.status === 'pending' ? 'bg-story-yellow/20 text-amber-700' :
                    selectedRequest.status === 'options_sent' ? 'bg-story-blue/20 text-blue-700' :
                    'bg-story-mint/20 text-green-700'
                  }`}>
                    {selectedRequest.status === 'pending' ? 'Pendiente' :
                     selectedRequest.status === 'options_sent' ? 'Opciones Enviadas' :
                     'Completado'}
                  </span>
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
                
                {/* Formulario de opciones de trama */}
                {selectedRequest.status === 'pending' && (
                  <div className="mt-6">
                    <h4 className="text-lg font-medium mb-4">Opciones de Trama</h4>
                    
                    <div className="space-y-6">
                      {plotOptions.map((option, index) => (
                        <div key={index} className="p-4 border rounded-md bg-muted/30">
                          <p className="font-medium mb-2">Opción {index + 1}</p>
                          
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm mb-1">Título</p>
                              <input
                                type="text"
                                value={option.title}
                                onChange={(e) => handlePlotOptionChange(index, 'title', e.target.value)}
                                className="w-full rounded-md border border-input p-2 text-sm"
                                placeholder={`Título de la opción ${index + 1}`}
                              />
                            </div>
                            
                            <div>
                              <p className="text-sm mb-1">Descripción</p>
                              <Textarea
                                value={option.description}
                                onChange={(e) => handlePlotOptionChange(index, 'description', e.target.value)}
                                className="min-h-[80px]"
                                placeholder={`Descripción de la trama para la opción ${index + 1}`}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className="mt-4 w-full bg-story-blue hover:bg-story-blue/80"
                      onClick={handleSendOptions}
                    >
                      Enviar Opciones al Cliente
                    </Button>
                  </div>
                )}
                
                {/* Vista de opciones enviadas */}
                {selectedRequest.status !== 'pending' && selectedRequest.plotOptions && (
                  <div className="mt-6">
                    <h4 className="text-lg font-medium mb-4">Opciones de Trama Enviadas</h4>
                    
                    <div className="space-y-4">
                      {selectedRequest.plotOptions.map((option, index) => (
                        <div 
                          key={option.id} 
                          className={`p-4 border rounded-md ${
                            selectedRequest.selectedPlot === option.id ? 'bg-story-mint/20 border-story-mint' : 'bg-muted/30'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">Opción {index + 1}: {option.title}</p>
                            {selectedRequest.selectedPlot === option.id && (
                              <span className="px-2 py-1 bg-story-mint/30 text-xs rounded-full">
                                Seleccionada
                              </span>
                            )}
                          </div>
                          <p className="text-sm">{option.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex items-center justify-center flex-col">
                <p className="text-muted-foreground mb-2">Selecciona una solicitud para ver detalles</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
