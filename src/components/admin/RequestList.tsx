
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StoryRequest } from '@/types/story';
import RequestItem from './RequestItem';

interface RequestListProps {
  requests: StoryRequest[];
  selectedRequest: StoryRequest | null;
  onSelectRequest: (request: StoryRequest) => void;
  onDeleteRequest: (id: string) => void;
}

const RequestList = ({ requests, selectedRequest, onSelectRequest, onDeleteRequest }: RequestListProps) => {
  const getStatusLabel = (status: string): string => {
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

  const statusTabs = ['pendiente', 'opciones', 'seleccion', 'pagado', 'produccion', 'envio', 'completado'];
  
  return (
    <Card className="p-4 h-full">
      <h3 className="text-xl font-bold mb-4">Solicitudes</h3>
      
      <Tabs defaultValue="pendiente">
        <TabsList className="grid w-full grid-cols-7 mb-4">
          {statusTabs.map(status => (
            <TabsTrigger key={status} value={status}>{getStatusLabel(status)}</TabsTrigger>
          ))}
        </TabsList>
        
        {statusTabs.map(statusTab => (
          <TabsContent key={statusTab} value={statusTab} className="space-y-2 max-h-[500px] overflow-y-auto">
            {requests.filter(req => req.status === statusTab).map(request => (
              <RequestItem
                key={request.id}
                request={request}
                isSelected={selectedRequest?.id === request.id}
                onSelect={onSelectRequest}
                onDelete={onDeleteRequest}
              />
            ))}
            
            {requests.filter(req => req.status === statusTab).length === 0 && (
              <p className="text-center text-muted-foreground py-4">No hay solicitudes en estado {getStatusLabel(statusTab)}.</p>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
};

export default RequestList;
