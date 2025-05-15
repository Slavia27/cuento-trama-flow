
import React from 'react';
import { Card } from '@/components/ui/card';

const ProcessSteps = () => {
  const steps = [
    {
      number: 1,
      title: 'Completa el formulario',
      description: 'Cuéntanos sobre el contexto y los detalles para personalizar tu cuento.',
      color: 'bg-story-blue',
    },
    {
      number: 2,
      title: 'Elige tu trama',
      description: 'En un plazo de 24 horas, recibirás 3 opciones de trama para elegir.',
      color: 'bg-story-pink',
    },
    {
      number: 3,
      title: 'Realiza el pago',
      description: 'Una vez seleccionada la trama, procede al pago para activar tu pedido.',
      color: 'bg-story-mint',
    },
    {
      number: 4,
      title: 'Recibe tu cuento',
      description: 'Crearemos y entregaremos tu cuento personalizado según las especificaciones acordadas.',
      color: 'bg-story-purple',
    }
  ];

  return (
    <section className="py-16 container">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-3">Cómo Funciona</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          El proceso es simple y personalizado para crear el cuento perfecto para ti
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step) => (
          <Card key={step.number} className="story-card border-t-4" style={{ borderTopColor: step.color.replace('bg-', '') === 'bg-story-blue' ? '#A5D8FF' : step.color.replace('bg-', '') === 'bg-story-pink' ? '#FFD6E7' : step.color.replace('bg-', '') === 'bg-story-mint' ? '#B9E6C9' : '#D8B4FE' }}>
            <div className={`${step.color} w-12 h-12 rounded-full flex items-center justify-center mb-4 text-white font-bold text-lg`}>
              {step.number}
            </div>
            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ProcessSteps;
