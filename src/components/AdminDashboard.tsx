
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useRequests } from '@/hooks/useRequests';
import { StoryRequest } from '@/types/story';
import RequestList from '@/components/admin/RequestList';
import RequestDetails from '@/components/admin/RequestDetails';

const AdminDashboard = () => {
  const [selectedRequest, setSelectedRequest] = useState<StoryRequest | null>(null);
  const { requests, deleteRequest, updateRequestStatus, updateProductionDays } = useRequests();
  
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
  
  return (
    <div className="container py-10">
      <h2 className="text-3xl font-bold mb-8">Panel de Administración</h2>
      
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
