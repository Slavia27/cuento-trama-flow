
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useRequests } from '@/hooks/useRequests';
import { StoryRequest } from '@/types/story';
import RequestList from '@/components/admin/RequestList';
import RequestDetails from '@/components/admin/RequestDetails';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const AdminDashboard = () => {
  const [selectedRequest, setSelectedRequest] = useState<StoryRequest | null>(null);
  const { requests, deleteRequest, updateRequestStatus, updateProductionDays, loadRequests, isLoading } = useRequests();
  
  // Load requests when the component mounts
  useEffect(() => {
    loadRequests();
  }, []);
  
  const handleSelectRequest = (request: StoryRequest) => {
    setSelectedRequest(request);
  };
  
  const handleDeleteRequest = async (id: string) => {
    const success = await deleteRequest(id);
    if (success) {
      if (selectedRequest?.id === id) {
        setSelectedRequest(null);
      }
      loadRequests(); // Refresh requests after deletion
    } else {
      console.error("❌ No se pudo eliminar la solicitud");
    }
  };
  
  const handleRequestUpdate = (updatedRequest: StoryRequest) => {
    setSelectedRequest(updatedRequest);
  };

  const handleRefresh = () => {
    loadRequests();
  };
  
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Panel de Administración</h2>
        <Button 
          onClick={handleRefresh}
          className="px-4 py-2 flex items-center gap-2"
          disabled={isLoading}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar datos
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lista de solicitudes */}
        <div className="lg:col-span-4">
          <RequestList 
            requests={requests}
            selectedRequest={selectedRequest}
            onSelectRequest={handleSelectRequest}
            onDeleteRequest={handleDeleteRequest}
          />
        </div>
        
        {/* Detalles de la solicitud */}
        <div className="lg:col-span-8">
          <Card className="p-6 h-full overflow-y-auto">
            <RequestDetails 
              selectedRequest={selectedRequest}
              onRequestUpdated={handleRequestUpdate}
              onStatusUpdate={updateRequestStatus}
              onProductionDaysUpdate={updateProductionDays}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
