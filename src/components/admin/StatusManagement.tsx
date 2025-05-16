
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface StatusManagementProps {
  status: string;
  productionDays: number;
  onUpdateStatus: (status: 'produccion' | 'envio' | 'completado') => void;
  onUpdateProductionDays: (days: number) => void;
}

const StatusManagement = ({ 
  status, 
  productionDays, 
  onUpdateStatus, 
  onUpdateProductionDays 
}: StatusManagementProps) => {
  const [days, setDays] = useState(productionDays);

  // Function to calculate business days (excluding weekends)
  const addBusinessDays = (date: Date, days: number): Date => {
    let result = new Date(date);
    let count = 0;
    
    while (count < days) {
      result.setDate(result.getDate() + 1);
      if (result.getDay() !== 0 && result.getDay() !== 6) {
        // Not Saturday or Sunday
        count++;
      }
    }
    
    return result;
  };

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDays(Number(e.target.value));
  };

  const handleUpdateDays = () => {
    onUpdateProductionDays(days);
  };

  return (
    <>
      {/* Status Management */}
      <div className="mb-6 p-4 border rounded-md bg-muted/30">
        <h4 className="text-lg font-medium mb-3">Estado de la Solicitud</h4>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={status === 'produccion' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onUpdateStatus('produccion')}
            className={status === 'produccion' ? 'bg-orange-500 hover:bg-orange-600' : ''}
          >
            En Producción
          </Button>
          <Button
            variant={status === 'envio' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onUpdateStatus('envio')}
            className={status === 'envio' ? 'bg-pink-500 hover:bg-pink-600' : ''}
          >
            En Envío
          </Button>
          <Button
            variant={status === 'completado' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onUpdateStatus('completado')}
            className={status === 'completado' ? 'bg-green-500 hover:bg-green-600' : ''}
          >
            Completado
          </Button>
        </div>
      </div>

      {/* Production Days */}
      <div className="mb-6 p-4 border rounded-md bg-muted/30">
        <h4 className="text-lg font-medium mb-3">Producción</h4>
        <div className="flex items-center gap-4">
          <div className="flex-grow">
            <p className="text-sm mb-1">Días hábiles de producción:</p>
            <Input 
              type="number" 
              min="1"
              max="60"
              value={days}
              onChange={handleDaysChange}
              className="w-full"
            />
          </div>
          <Button 
            onClick={handleUpdateDays}
            className="mt-5 bg-rasti-green hover:bg-rasti-green/80 text-white"
          >
            Actualizar
          </Button>
        </div>
        
        <div className="mt-3 text-sm text-muted-foreground">
          <p>
            Fecha estimada de entrega: {format(
              addBusinessDays(new Date(), productionDays),
              "dd 'de' MMMM, yyyy", 
              { locale: es }
            )}
          </p>
        </div>
      </div>
    </>
  );
};

export default StatusManagement;
