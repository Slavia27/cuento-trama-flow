
import React from 'react';
import { Json } from '@/integrations/supabase/types';
import { FormData } from '@/types/story';

interface FormDetailViewerProps {
  formData?: FormData | Json;
}

const FormDetailViewer: React.FC<FormDetailViewerProps> = ({ formData }) => {
  if (!formData) {
    return <p className="text-center text-muted-foreground py-4">No hay datos de formulario disponibles.</p>;
  }

  const renderFormData = () => {
    // Create an array of [key, value] pairs to easily map through
    const formEntries = Object.entries(formData).map(([key, value]) => {
      let label = key;
      // Convert camelCase to readable format
      label = label.replace(/([A-Z])/g, ' $1').toLowerCase();
      label = label.charAt(0).toUpperCase() + label.slice(1);
      
      // Format the value based on its type
      let formattedValue: React.ReactNode = value;
      
      if (Array.isArray(value)) {
        formattedValue = (
          <ul className="list-disc pl-5">
            {value.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        );
      } else if (typeof value === 'boolean') {
        formattedValue = value ? 'Sí' : 'No';
      } else if (value === null || value === undefined) {
        formattedValue = 'No proporcionado';
      }
      
      return { label, value: formattedValue };
    });
    
    return (
      <div className="space-y-4 max-h-[60vh] overflow-y-auto p-2">
        {formEntries.map((entry, index) => (
          <div key={index} className="border-b pb-2">
            <p className="font-medium text-sm text-muted-foreground">{entry.label}</p>
            <div className="mt-1">{entry.value}</div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="space-y-2">
      {renderFormData()}
    </div>
  );
};

export default FormDetailViewer;
