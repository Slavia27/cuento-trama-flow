
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StoryRequest } from '@/types/story';

interface PlotOptionsFormProps {
  onSubmit: (options: { title: string; description: string }[]) => void;
  isSubmitting: boolean;
}

const PlotOptionsForm = ({ onSubmit, isSubmitting }: PlotOptionsFormProps) => {
  const [plotOptions, setPlotOptions] = useState<{ title: string; description: string }[]>([
    { title: '', description: '' },
    { title: '', description: '' },
    { title: '', description: '' },
  ]);

  const handlePlotOptionChange = (index: number, field: 'title' | 'description', value: string) => {
    const newOptions = [...plotOptions];
    newOptions[index][field] = value;
    setPlotOptions(newOptions);
  };

  const handleSubmit = () => {
    onSubmit(plotOptions);
  };

  return (
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
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Enviando...' : 'Enviar Opciones al Cliente'}
      </Button>
    </div>
  );
};

export default PlotOptionsForm;
