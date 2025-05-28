
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
  // Si no hay opciones, mostrar mensaje con botón para reenviar
  if (plotOptions.length === 0) {
    return (
      <div className="mt-6 p-4 border rounded-md bg-amber-50 text-amber-800">
        <p>No se encontraron opciones de trama para esta solicitud. 
          <span className="block mt-2">
            Puedes utilizar el botón "Reenviar Opciones" para reenviar el correo al cliente.
          </span>
        </p>
        <div className="mt-4 flex gap-2">
          {(status === 'opciones' || status === 'seleccion' || status === 'pagado') && (
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
              className="flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              {isSendingPayment ? 'Enviando...' : 'Enviar Enlace de Pago'}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-medium">Opciones de Trama Enviadas</h4>
        
        <div className="flex gap-2">
          {(status === 'opciones' || status === 'seleccion' || status === 'pagado' || status === 'produccion') && (
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
              className="flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              {isSendingPayment ? 'Enviando...' : 'Enviar Enlace de Pago'}
            </Button>
          )}
        </div>
      </div>
      
      {/* Show selection status when there's a selected plot */}
      {selectedPlotId && status === 'seleccion' && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-green-800 font-medium">
              El cliente ha seleccionado una opción de trama
            </p>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Opción seleccionada ID: {selectedPlotId}
          </p>
        </div>
      )}
      
      <div className="space-y-4">
        {plotOptions.map((option, index) => (
          <div 
            key={option.id} 
            className={`p-4 border rounded-md transition-all ${
              selectedPlotId === option.id 
                ? 'bg-rasti-green/20 border-rasti-green shadow-md' 
                : 'bg-muted/30'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium">Opción {index + 1}: {option.title}</p>
              {selectedPlotId === option.id && (
                <span className="px-3 py-1 bg-rasti-green text-white text-xs rounded-full font-medium">
                  ✓ Seleccionada por el cliente
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
