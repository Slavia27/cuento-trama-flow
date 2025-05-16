
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Mail } from 'lucide-react';
import { PlotOption } from '@/types/story';

interface PlotOptionsViewProps {
  plotOptions: PlotOption[];
  selectedPlotId?: string;
  status: string;
  onResendOptions: () => void;
  onSendPaymentLink: () => void;
  isResending: boolean;
  isSendingPayment: boolean;
}

const PlotOptionsView = ({
  plotOptions,
  selectedPlotId,
  status,
  onResendOptions,
  onSendPaymentLink,
  isResending,
  isSendingPayment
}: PlotOptionsViewProps) => {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-medium">Opciones de Trama Enviadas</h4>
        
        {status === 'opciones' && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onResendOptions}
            disabled={isResending}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            {isResending ? 'Reenviando...' : 'Reenviar Opciones'}
          </Button>
        )}

        {status === 'seleccion' && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onSendPaymentLink}
            disabled={isSendingPayment}
            className="flex items-center gap-2 ml-2"
          >
            <Mail className="w-4 h-4" />
            {isSendingPayment ? 'Enviando...' : 'Enviar Enlace de Pago'}
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        {plotOptions.map((option, index) => (
          <div 
            key={option.id} 
            className={`p-4 border rounded-md ${
              selectedPlotId === option.id ? 'bg-rasti-green/20 border-rasti-green' : 'bg-muted/30'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium">Opción {index + 1}: {option.title}</p>
              {selectedPlotId === option.id && (
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
  );
};

export default PlotOptionsView;
