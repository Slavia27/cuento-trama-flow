
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
      case 'opciones': return 'Opciones';
      case 'seleccion': return 'Seleccionada';
      case 'pagado': return 'Pagado';
      case 'produccion': return 'Producción';
      case 'envio': return 'Envío';
      case 'completado': return 'Completado';
      default: return status;
    }
  };

  const statusTabs = ['pendiente', 'opciones', 'seleccion', 'pagado', 'produccion', 'envio', 'completado'];
  
  return (
    <Card className="p-4 h-full">
      <h3 className="text-xl font-bold mb-4">Solicitudes</h3>
      
      <Tabs defaultValue="pendiente" className="w-full">
        <TabsList className="w-full bg-muted p-1 mb-4">
          <div className="flex flex-wrap gap-1 w-full">
            {statusTabs.map(status => (
              <TabsTrigger 
                key={status} 
                value={status} 
                className="flex-1 min-w-[80px] text-xs px-2 py-2 rounded-sm transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                {getStatusLabel(status)}
              </TabsTrigger>
            ))}
          </div>
        </TabsList>
        
        {statusTabs.map(statusTab => (
          <TabsContent key={statusTab} value={statusTab} className="space-y-2 max-h-[500px] overflow-y-auto mt-4">
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
