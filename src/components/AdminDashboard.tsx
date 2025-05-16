
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useRequests } from '@/hooks/useRequests';
import { StoryRequest } from '@/types/story';
import RequestList from '@/components/admin/RequestList';
import RequestDetails from '@/components/admin/RequestDetails';

const AdminDashboard = () => {
  const [selectedRequest, setSelectedRequest] = useState<StoryRequest | null>(null);
  const { requests, deleteRequest, updateRequestStatus, updateProductionDays, loadRequests } = useRequests();
  
  const handleSelectRequest = (request: StoryRequest) => {
    setSelectedRequest(request);
  };
  
  const handleDeleteRequest = (id: string) => {
    const success = deleteRequest(id);
    if (success && selectedRequest?.id === id) {
      setSelectedRequest(null);
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
        <button 
          onClick={handleRefresh}
          className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
        >
          Actualizar datos
        </button>
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
