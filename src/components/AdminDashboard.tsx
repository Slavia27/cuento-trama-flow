import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, Mail, FileDown, ArrowDownToLine, Eye, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type FormData = {
  codigoPedido: string;
  nombreCompleto: string;
  nombreHijo: string;
  edadHijo: string;
  conQuienVive: string;
  personalidadHijo: string;
  dinamicaFamiliar: string;
  cambiosRecientes: string;
  situacionTrabajo: string;
  cuandoOcurre: string;
  porQueOcurre: string;
  aquienAfecta: string;
  preocupacionPadres: string;
  aspectosDificiles: string;
  conductaHijo: string;
  accionesIntentadas: string;
  resultadosAcciones: string;
  enseñanzaHistoria: string;
  objetivos: string[];
  otrosObjetivos?: string;
  rutinaHijo: string;
  interesesHijo: string;
  cosasNoLeGustan: string;
  tradicionesValores: string;
  expresionesFamiliares: string;
  temasEvitar: string;
};

type StoryStatus = 'pendiente' | 'opciones' | 'seleccion' | 'pagado' | 'produccion' | 'envio' | 'completado';

type StoryRequest = {
  id: string;
  name: string;
  email: string;
  childName: string;
  childAge: string;
  storyTheme: string;
  specialInterests: string;
  additionalDetails?: string;
  status: StoryStatus;
  createdAt: string;
  plotOptions?: { id: string; title: string; description: string }[];
  selectedPlot?: string;
  productionDays?: number;
  formData?: FormData;
};

const AdminDashboard = () => {
  const [requests, setRequests] = useState<StoryRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<StoryRequest | null>(null);
  const [plotOptions, setPlotOptions] = useState<{ title: string; description: string }[]>([
    { title: '', description: '' },
    { title: '', description: '' },
    { title: '', description: '' },
  ]);
  const [isSending, setIsSending] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isSendingPaymentLink, setIsSendingPaymentLink] = useState(false);
  const [productionDays, setProductionDays] = useState(15);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const { toast } = useToast();
  
  // Cargar solicitudes de localStorage (simulando una base de datos)
  useEffect(() => {
    const loadAndUpdateRequests = () => {
      try {
        const savedRequests = JSON.parse(localStorage.getItem('storyRequests') || '[]');
        
        // Update any legacy status values to match the new status flow
        const updatedRequests = savedRequests.map((req: any) => {
          const typedRequest: StoryRequest = { ...req };
          
          // Convert old status values to new ones
          if (req.status === 'pending') {
            typedRequest.status = 'pendiente';
          } 
          else if (req.status === 'options_sent') {
            typedRequest.status = 'opciones';
          }
          else if (req.status === 'option_selected' || req.status === 'payment_created' || req.status === 'payment_pending') {
            typedRequest.status = 'seleccion';
          }
          else if (req.status === 'completed') {
            typedRequest.status = 'completado';
          }
          // If it's already using the new status values, keep them
          else if (['pendiente', 'opciones', 'seleccion', 'pagado', 'produccion', 'envio', 'completado'].includes(req.status)) {
            // Make sure to cast it to StoryStatus type for type safety
            typedRequest.status = req.status as StoryStatus;
          }
          // Default fallback
          else {
            typedRequest.status = 'pendiente';
          }
          
          return typedRequest;
        });
        
        // Save the updated requests back to localStorage
        if (JSON.stringify(updatedRequests) !== JSON.stringify(savedRequests)) {
          localStorage.setItem('storyRequests', JSON.stringify(updatedRequests));
        }
        
        setRequests(updatedRequests);
        console.log("Loaded requests:", updatedRequests);
      } catch (error) {
        console.error("Error loading requests:", error);
        toast({
          title: "Error",
          description: "Error al cargar las solicitudes",
          variant: "destructive",
        });
      }
    };
    
    loadAndUpdateRequests();
  }, [toast]);
  
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
    
    // Si el pedido tiene días de producción establecidos, actualizar el estado
    if (request.productionDays) {
      setProductionDays(request.productionDays);
    } else {
      setProductionDays(15); // Valor predeterminado
    }
  };
  
  const handlePlotOptionChange = (index: number, field: 'title' | 'description', value: string) => {
    const newOptions = [...plotOptions];
    newOptions[index][field] = value;
    setPlotOptions(newOptions);
  };

  const handleDeleteRequest = (id: string) => {
    const updatedRequests = requests.filter(req => req.id !== id);
    setRequests(updatedRequests);
    
    if (selectedRequest?.id === id) {
      setSelectedRequest(null);
    }
    
    toast({
      title: "Solicitud eliminada",
      description: "La solicitud ha sido eliminada correctamente.",
    });
  };
  
  const handleSendOptions = async () => {
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
    
    try {
      setIsSending(true);

      // Preparar las opciones de trama para enviar por correo
      const optionsWithIds = plotOptions.map((opt, idx) => ({
        id: `opt-${idx + 1}`,
        title: opt.title,
        description: opt.description,
      }));
      
      // Enviar correo electrónico usando la función edge
      const { data, error } = await supabase.functions.invoke('send-plot-options', {
        body: {
          to: selectedRequest.email,
          name: selectedRequest.name,
          childName: selectedRequest.childName,
          requestId: selectedRequest.id,
          plotOptions: optionsWithIds,
        }
      });

      if (error) {
        throw new Error(error.message);
      }
      
      // Actualizar el estado de la solicitud
      const updatedRequests = requests.map(req => {
        if (req.id === selectedRequest.id) {
          return {
            ...req,
            status: 'opciones' as StoryStatus,
            plotOptions: optionsWithIds,
          };
        }
        return req;
      });
      
      setRequests(updatedRequests);
      setSelectedRequest(prev => prev ? {
        ...prev,
        status: 'opciones',
        plotOptions: optionsWithIds,
      } : null);
      
      toast({
        title: "Opciones enviadas",
        description: `Se han enviado las opciones de trama para ${selectedRequest.childName} por correo electrónico.`,
      });
    } catch (error: any) {
      toast({
        title: "Error al enviar opciones",
        description: error.message || "No se pudieron enviar las opciones por correo electrónico.",
        variant: "destructive",
      });
      console.error("Error sending plot options:", error);
    } finally {
      setIsSending(false);
    }
  };
  
  const handleResendOptions = async () => {
    if (!selectedRequest || !selectedRequest.plotOptions) return;
    
    try {
      setIsResending(true);
      
      // Enviar correo electrónico usando la función edge - Agregado el parámetro resend: true
      const { data, error } = await supabase.functions.invoke('send-plot-options', {
        body: {
          to: selectedRequest.email,
          name: selectedRequest.name,
          childName: selectedRequest.childName,
          requestId: selectedRequest.id,
          plotOptions: selectedRequest.plotOptions,
          resend: true // Indicamos que es un reenvío
        }
      });

      if (error) {
        throw new Error(error.message);
      }
      
      toast({
        title: "Correo reenviado",
        description: `Se han reenviado las opciones de trama para ${selectedRequest.childName} por correo electrónico.`,
      });
    } catch (error: any) {
      toast({
        title: "Error al reenviar opciones",
        description: error.message || "No se pudieron reenviar las opciones por correo electrónico.",
        variant: "destructive",
      });
      console.error("Error resending plot options:", error);
    } finally {
      setIsResending(false);
    }
  };
  
  const handleSendPaymentLink = async () => {
    if (!selectedRequest || !selectedRequest.selectedPlot) return;
    
    try {
      setIsSendingPaymentLink(true);
      
      // Encontrar el título de la opción seleccionada
      const selectedOption = selectedRequest.plotOptions?.find(opt => opt.id === selectedRequest.selectedPlot);
      if (!selectedOption) {
        throw new Error("No se encontró la opción seleccionada");
      }
      
      // Enviar correo electrónico con enlace de pago
      const { data, error } = await supabase.functions.invoke('send-payment-link', {
        body: {
          to: selectedRequest.email,
          name: selectedRequest.name,
          childName: selectedRequest.childName,
          requestId: selectedRequest.id,
          optionId: selectedRequest.selectedPlot,
          optionTitle: selectedOption.title,
        }
      });

      if (error) {
        throw new Error(error.message);
      }
      
      // Actualizar estado a pagado (esto simula que el pago ya fue recibido)
      const updatedRequests = requests.map(req => {
        if (req.id === selectedRequest.id) {
          return {
            ...req,
            status: 'pagado' as StoryStatus,
          };
        }
        return req;
      });
      
      setRequests(updatedRequests);
      setSelectedRequest(prev => prev ? {
        ...prev,
        status: 'pagado',
      } : null);
      
      toast({
        title: "Enlace de pago enviado",
        description: `Se ha enviado un enlace de pago para ${selectedRequest.childName} por correo electrónico.`,
      });
    } catch (error: any) {
      toast({
        title: "Error al enviar enlace de pago",
        description: error.message || "No se pudo enviar el enlace de pago por correo electrónico.",
        variant: "destructive",
      });
      console.error("Error sending payment link:", error);
    } finally {
      setIsSendingPaymentLink(false);
    }
  };

  const handleUpdateProductionState = (newState: StoryStatus) => {
    if (!selectedRequest) return;
    
    // Actualizar el estado de la solicitud
    const updatedRequests = requests.map(req => {
      if (req.id === selectedRequest.id) {
        return {
          ...req,
          status: newState,
        };
      }
      return req;
    });
    
    setRequests(updatedRequests);
    setSelectedRequest(prev => prev ? {
      ...prev,
      status: newState,
    } : null);
    
    const statusLabels = {
      'produccion': 'Producción',
      'envio': 'Envío',
      'completado': 'Completado'
    };
    
    toast({
      title: "Estado actualizado",
      description: `La solicitud ha sido actualizada al estado: ${statusLabels[newState]}.`,
    });
  };
  
  const handleUpdateProductionDays = () => {
    if (!selectedRequest) return;
    
    // Actualizar los días de producción para la solicitud seleccionada
    const updatedRequests = requests.map(req => {
      if (req.id === selectedRequest.id) {
        return {
          ...req,
          productionDays,
        };
      }
      return req;
    });
    
    setRequests(updatedRequests);
    
    // Actualizar la solicitud seleccionada
    setSelectedRequest(prev => prev ? {
      ...prev,
      productionDays,
    } : null);
    
    toast({
      title: "Días de producción actualizados",
      description: `Se han establecido ${productionDays} días hábiles para la producción del cuento.`,
    });
  };
  
  // Componente para mostrar todos los detalles del formulario
  const FormDetailView = ({ formData }: { formData?: FormData }) => {
    if (!formData) return <p>No hay datos de formulario disponibles</p>;

    return (
      <div className="space-y-6 max-h-[70vh] overflow-y-auto p-2">
        <div>
          <h3 className="text-lg font-semibold mb-2 border-b pb-1">Información Básica</h3>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Código de pedido</TableCell>
                <TableCell>{formData.codigoPedido}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Nombre completo</TableCell>
                <TableCell>{formData.nombreCompleto}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Nombre del hijo/a</TableCell>
                <TableCell>{formData.nombreHijo}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Edad</TableCell>
                <TableCell>{formData.edadHijo}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Con quién vive</TableCell>
                <TableCell>{formData.conQuienVive}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Personalidad</TableCell>
                <TableCell>{formData.personalidadHijo}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 border-b pb-1">Contexto Familiar</h3>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Dinámica familiar</TableCell>
                <TableCell>{formData.dinamicaFamiliar}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Cambios recientes</TableCell>
                <TableCell>{formData.cambiosRecientes}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 border-b pb-1">Situación Actual</h3>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Situación a trabajar</TableCell>
                <TableCell>{formData.situacionTrabajo}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Cuándo ocurre</TableCell>
                <TableCell>{formData.cuandoOcurre}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Por qué ocurre</TableCell>
                <TableCell>{formData.porQueOcurre}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">A quién afecta</TableCell>
                <TableCell>{formData.aquienAfecta}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 border-b pb-1">Desafíos Identificados</h3>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Preocupación de padres</TableCell>
                <TableCell>{formData.preocupacionPadres}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Aspectos difíciles</TableCell>
                <TableCell>{formData.aspectosDificiles}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Conducta del hijo</TableCell>
                <TableCell>{formData.conductaHijo}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 border-b pb-1">Acciones Intentadas</h3>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Acciones intentadas</TableCell>
                <TableCell>{formData.accionesIntentadas}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Resultados de acciones</TableCell>
                <TableCell>{formData.resultadosAcciones}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Enseñanza deseada</TableCell>
                <TableCell>{formData.enseñanzaHistoria}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 border-b pb-1">Objetivos</h3>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Objetivos seleccionados</TableCell>
                <TableCell>
                  <ul className="list-disc pl-5">
                    {formData.objetivos.map((obj, idx) => (
                      <li key={idx}>{obj}</li>
                    ))}
                  </ul>
                  {formData.otrosObjetivos && (
                    <div className="mt-2">
                      <strong>Otros: </strong>{formData.otrosObjetivos}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 border-b pb-1">Personalización</h3>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Rutina</TableCell>
                <TableCell>{formData.rutinaHijo}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Intereses</TableCell>
                <TableCell>{formData.interesesHijo}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Lo que no le gusta</TableCell>
                <TableCell>{formData.cosasNoLeGustan}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Tradiciones y valores</TableCell>
                <TableCell>{formData.tradicionesValores}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Expresiones significativas</TableCell>
                <TableCell>{formData.expresionesFamiliares}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 border-b pb-1">Otros</h3>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Temas a evitar</TableCell>
                <TableCell>{formData.temasEvitar}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  // Función para obtener el estilo de la etiqueta de estado
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'opciones':
        return 'bg-blue-100 text-blue-800';
      case 'seleccion':
        return 'bg-purple-100 text-purple-800';
      case 'pagado':
        return 'bg-indigo-100 text-indigo-800';
      case 'produccion':
        return 'bg-orange-100 text-orange-800';
      case 'envio':
        return 'bg-pink-100 text-pink-800';
      case 'completado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Función para mostrar el texto del estado
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'Pendiente';
      case 'opciones':
        return 'Opciones Enviadas';
      case 'seleccion':
        return 'Opción Seleccionada';
      case 'pagado':
        return 'Pagado';
      case 'produccion':
        return 'En Producción';
      case 'envio':
        return 'En Envío';
      case 'completado':
        return 'Completado';
      default:
        return status;
    }
  };
  
  return (
    <div className="container py-10">
      <h2 className="text-3xl font-bold mb-8">Panel de Administración</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lista de solicitudes */}
        <div className="lg:col-span-4">
          <Card className="p-4 h-full">
            <h3 className="text-xl font-bold mb-4">Solicitudes</h3>
            
            <Tabs defaultValue="pendiente">
              <TabsList className="grid w-full grid-cols-7 mb-4">
                <TabsTrigger value="pendiente">Pendientes</TabsTrigger>
                <TabsTrigger value="opciones">Opciones</TabsTrigger>
                <TabsTrigger value="seleccion">Selección</TabsTrigger>
                <TabsTrigger value="pagado">Pagado</TabsTrigger>
                <TabsTrigger value="produccion">Producción</TabsTrigger>
                <TabsTrigger value="envio">Envío</TabsTrigger>
                <TabsTrigger value="completado">Completados</TabsTrigger>
              </TabsList>
              
              {['pendiente', 'opciones', 'seleccion', 'pagado', 'produccion', 'envio', 'completado'].map((statusTab) => (
                <TabsContent key={statusTab} value={statusTab} className="space-y-2 max-h-[500px] overflow-y-auto">
                  {requests.filter(req => req.status === statusTab).map(request => (
                    <div
                      key={request.id}
                      className={`p-3 rounded-lg border cursor-pointer hover:bg-muted transition-colors ${
                        selectedRequest?.id === request.id ? 'bg-muted border-primary' : ''
                      }`}
                    >
                      <div className="flex justify-between">
                        <div className="flex-grow" onClick={() => handleSelectRequest(request)}>
                          <p className="font-medium">{request.name}</p>
                          <p className="text-sm text-muted-foreground">Niño/a: {request.childName}, {request.childAge} años</p>
                          <p className="text-sm text-muted-foreground">Tema: {request.storyTheme}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[800px]">
                              <DialogHeader>
                                <DialogTitle>Detalles del Formulario</DialogTitle>
                                <DialogDescription>
                                  Respuestas completas de {request.name} para {request.childName}
                                </DialogDescription>
                              </DialogHeader>
                              <FormDetailView formData={request.formData} />
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button>Cerrar</Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-destructive hover:text-destructive/90"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Confirmar eliminación</DialogTitle>
                                <DialogDescription>
                                  ¿Estás seguro que deseas eliminar la solicitud de {request.childName}? Esta acción no se puede deshacer.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">Cancelar</Button>
                                </DialogClose>
                                <Button 
                                  variant="destructive" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteRequest(request.id);
                                  }}
                                >
                                  Eliminar
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {requests.filter(req => req.status === statusTab).length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No hay solicitudes en estado {getStatusLabel(statusTab)}.</p>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </Card>
        </div>
        
        {/* Detalles de la solicitud */}
        <div className="lg:col-span-8">
          <Card className="p-6 h-full overflow-y-auto">
            {selectedRequest ? (
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
                        <FormDetailView formData={selectedRequest.formData} />
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
                
                {/* Cambiar estado del pedido - nuevo componente para etapas de producción */}
                {(selectedRequest?.status === 'pagado' || selectedRequest?.status === 'produccion' || selectedRequest?.status === 'envio' || selectedRequest?.status === 'completado') && (
                  <div className="mb-6 p-4 border rounded-md bg-muted/30">
                    <h4 className="text-lg font-medium mb-3">Estado de la Solicitud</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={selectedRequest.status === 'produccion' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleUpdateProductionState('produccion')}
                        className={selectedRequest.status === 'produccion' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                      >
                        En Producción
                      </Button>
                      <Button
                        variant={selectedRequest.status === 'envio' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleUpdateProductionState('envio')}
                        className={selectedRequest.status === 'envio' ? 'bg-pink-500 hover:bg-pink-600' : ''}
                      >
                        En Envío
                      </Button>
                      <Button
                        variant={selectedRequest.status === 'completado' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleUpdateProductionState('completado')}
                        className={selectedRequest.status === 'completado' ? 'bg-green-500 hover:bg-green-600' : ''}
                      >
                        Completado
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Sección para días de producción */}
                {(selectedRequest?.status === 'pagado' || selectedRequest?.status === 'produccion' || selectedRequest?.status === 'envio' || selectedRequest?.status === 'completado') && (
                  <div className="mb-6 p-4 border rounded-md bg-muted/30">
                    <h4 className="text-lg font-medium mb-3">Producción</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex-grow">
                        <p className="text-sm mb-1">Días hábiles de producción:</p>
                        <Input 
                          type="number" 
                          min="1"
                          max="60"
                          value={productionDays}
                          onChange={(e) => setProductionDays(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <Button 
                        onClick={handleUpdateProductionDays}
                        className="mt-5 bg-rasti-green hover:bg-rasti-green/80 text-white"
                      >
                        Actualizar
                      </Button>
                    </div>
                    
                    {selectedRequest.productionDays && (
                      <div className="mt-3 text-sm text-muted-foreground">
                        <p>
                          Fecha estimada de entrega: {format(
                            addBusinessDays(new Date(), selectedRequest.productionDays),
                            "dd 'de' MMMM, yyyy", 
                            { locale: es }
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Formulario de opciones de trama */}
                {selectedRequest.status === 'pendiente' && (
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
                      className="mt-4 w-full bg-rasti-blue hover:bg-rasti-blue/80"
                      onClick={handleSendOptions}
                      disabled={isSending}
                    >
                      {isSending ? 'Enviando...' : 'Enviar Opciones al Cliente'}
                    </Button>
                  </div>
                )}
                
                {/* Vista de opciones enviadas */}
                {selectedRequest.status !== 'pendiente' && selectedRequest.plotOptions && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium">Opciones de Trama Enviadas</h4>
                      
                      {selectedRequest.status === 'opciones' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleResendOptions}
                          disabled={isResending}
                          className="flex items-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          {isResending ? 'Reenviando...' : 'Reenviar Opciones'}
                        </Button>
                      )}

                      {selectedRequest.status === 'seleccion' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleSendPaymentLink}
                          disabled={isSendingPaymentLink}
                          className="flex items-center gap-2 ml-2"
                        >
                          <Mail className="w-4 h-4" />
                          {isSendingPaymentLink ? 'Enviando...' : 'Enviar Enlace de Pago'}
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      {selectedRequest.plotOptions.map((option, index) => (
                        <div 
                          key={option.id} 
                          className={`p-4 border rounded-md ${
                            selectedRequest.selectedPlot === option.id ? 'bg-rasti-green/20 border-rasti-green' : 'bg-muted/30'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">Opción {index + 1}: {option.title}</p>
                            {selectedRequest.selectedPlot === option.id && (
                              <span className="px-2 py-1 bg-rasti-green/30 text-xs rounded-full">
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

// Función auxiliar para calcular días hábiles (excluyendo fines de semana)
function addBusinessDays(date: Date, days: number): Date {
  let result = new Date(date);
  let count = 0;
  
  while (count < days) {
    result.setDate(result.getDate() + 1);
    if (result.getDay() !== 0 && result.getDay() !== 6) {
      // No es sábado ni domingo
      count++;
    }
  }
  
  return result;
}

export default AdminDashboard;
