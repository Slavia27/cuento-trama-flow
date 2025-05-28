
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, RotateCcw, CreditCard } from 'lucide-react';
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
  const selectedPlot = plotOptions.find(option => option.id === selectedPlotId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold">Opciones de Trama</h4>
        <div className="flex gap-2">
          {status === 'opciones' && (
            <Button
              onClick={onResendOptions}
              disabled={isResending}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RotateCcw className={`h-4 w-4 ${isResending ? 'animate-spin' : ''}`} />
              {isResending ? 'Reenviando...' : 'Reenviar Opciones'}
            </Button>
          )}
          {status === 'seleccion' && (
            <Button
              onClick={onSendPaymentLink}
              disabled={isSendingPayment}
              variant="default"
              size="sm"
              className="flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              {isSendingPayment ? 'Enviando...' : 'Enviar Enlace de Pago'}
            </Button>
          )}
        </div>
      </div>

      {/* Selected Plot Display */}
      {selectedPlot && status === 'seleccion' && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg text-green-800">Opción Seleccionada</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <h5 className="font-semibold text-green-900 mb-2">{selectedPlot.title}</h5>
            <p className="text-green-700 text-sm">{selectedPlot.description}</p>
          </CardContent>
        </Card>
      )}

      {/* All Plot Options */}
      <div className="grid gap-3">
        {plotOptions.map((option) => (
          <Card key={option.id} className={`${option.id === selectedPlotId ? 'ring-2 ring-green-500' : ''}`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{option.title}</CardTitle>
                {option.id === selectedPlotId && (
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Seleccionada
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>{option.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {plotOptions.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No se han enviado opciones de trama aún.</p>
        </div>
      )}
    </div>
  );
};

export default PlotOptionsView;
