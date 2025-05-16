import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const goalItems = [
  {
    id: "manejar-emociones",
    label: "Ayudarlo/a a manejar sus emociones",
  },
  {
    id: "reforzar-confianza",
    label: "Reforzar su confianza",
  },
  {
    id: "reflexion",
    label: "Ofrecerle un espacio seguro para reflexionar",
  },
  {
    id: "conexion-emocional",
    label: "Generar una conexión emocional",
  },
  {
    id: "dialogar",
    label: "Dar espacio para dialogar",
  },
  {
    id: "desarrollo-habilidades",
    label: "Fomentar el desarrollo de habilidades",
  },
  {
    id: "otras-perspectivas",
    label: "Mostrarle otras perspectivas de la situación para que se sienta representado",
  },
];

const formSchema = z.object({
  // Información básica
  codigoPedido: z.string().min(1, { message: 'El código de pedido es requerido.' }),
  nombreCompleto: z.string().min(1, { message: 'El nombre completo es requerido.' }),
  nombreHijo: z.string().min(1, { message: 'El nombre del hijo/a es requerido.' }),
  edadHijo: z.string().min(1, { message: 'La edad es requerida.' }),
  conQuienVive: z.string().min(1, { message: 'Este campo es requerido.' }),
  personalidadHijo: z.string().min(1, { message: 'Este campo es requerido.' }),
  
  // Contexto familiar
  dinamicaFamiliar: z.string().min(1, { message: 'Este campo es requerido.' }),
  cambiosRecientes: z.string().min(1, { message: 'Este campo es requerido.' }),
  
  // Situación actual
  situacionTrabajo: z.string().min(1, { message: 'Este campo es requerido.' }),
  cuandoOcurre: z.string().min(1, { message: 'Este campo es requerido.' }),
  porQueOcurre: z.string().min(1, { message: 'Este campo es requerido.' }),
  aquienAfecta: z.string().min(1, { message: 'Este campo es requerido.' }),
  
  // Desafíos identificados
  preocupacionPadres: z.string().min(1, { message: 'Este campo es requerido.' }),
  aspectosDificiles: z.string().min(1, { message: 'Este campo es requerido.' }),
  conductaHijo: z.string().min(1, { message: 'Este campo es requerido.' }),
  
  // Acciones intentadas
  accionesIntentadas: z.string().min(1, { message: 'Este campo es requerido.' }),
  resultadosAcciones: z.string().min(1, { message: 'Este campo es requerido.' }),
  enseñanzaHistoria: z.string().min(1, { message: 'Este campo es requerido.' }),
  
  // Objetivos
  objetivos: z.array(z.string()).refine((value) => value.length > 0, {
    message: "Debes seleccionar al menos un objetivo",
  }),
  otrosObjetivos: z.string().optional(),
  
  // Personalización
  rutinaHijo: z.string().min(1, { message: 'Este campo es requerido.' }),
  interesesHijo: z.string().min(1, { message: 'Este campo es requerido.' }),
  cosasNoLeGustan: z.string().min(1, { message: 'Este campo es requerido.' }),
  tradicionesValores: z.string().min(1, { message: 'Este campo es requerido.' }),
  expresionesFamiliares: z.string().min(1, { message: 'Este campo es requerido.' }),
  
  // Otros
  temasEvitar: z.string().min(1, { message: 'Este campo es requerido.' }),
});

type FormValues = z.infer<typeof formSchema>;

const RequestForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codigoPedido: '',
      nombreCompleto: '',
      nombreHijo: '',
      edadHijo: '',
      conQuienVive: '',
      personalidadHijo: '',
      dinamicaFamiliar: '',
      cambiosRecientes: '',
      situacionTrabajo: '',
      cuandoOcurre: '',
      porQueOcurre: '',
      aquienAfecta: '',
      preocupacionPadres: '',
      aspectosDificiles: '',
      conductaHijo: '',
      accionesIntentadas: '',
      resultadosAcciones: '',
      enseñanzaHistoria: '',
      objetivos: [],
      otrosObjetivos: '',
      rutinaHijo: '',
      interesesHijo: '',
      cosasNoLeGustan: '',
      tradicionesValores: '',
      expresionesFamiliares: '',
      temasEvitar: '',
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log('Datos del formulario:', data);
      
      // Simulamos un tiempo de respuesta
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Creamos el objeto de solicitud con todos los datos
      const storyRequest = {
        id: `req-${Date.now()}`,
        name: data.nombreCompleto,
        email: "cliente@example.com", // Podríamos agregar campo de email al formulario
        childName: data.nombreHijo,
        childAge: data.edadHijo,
        storyTheme: data.situacionTrabajo,
        specialInterests: data.interesesHijo,
        additionalDetails: data.otrosObjetivos || '',
        status: 'pending',
        createdAt: new Date().toISOString(),
        formData: data, // Guardamos todos los datos del formulario
      };
      
      // Guardamos en localStorage para simular persistencia
      const requests = JSON.parse(localStorage.getItem('storyRequests') || '[]');
      requests.push(storyRequest);
      localStorage.setItem('storyRequests', JSON.stringify(requests));
      
      toast({
        title: "¡Solicitud enviada con éxito!",
        description: "Te contactaremos en las próximas 24 horas con opciones de trama.",
      });
      
      navigate('/gracias');
    } catch (error) {
      toast({
        title: "Error al enviar la solicitud",
        description: "Por favor intenta nuevamente más tarde.",
        variant: "destructive",
      });
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container py-8 max-w-4xl">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Información básica */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">Información Básica</h2>
              
              <FormField
                control={form.control}
                name="codigoPedido"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>1. Código de pedido *</FormLabel>
                    <FormDescription>
                      Busca el código de pedido en el correo de confirmación de compra y regístralo a continuación.
                    </FormDescription>
                    <FormControl>
                      <Input placeholder="Código de pedido" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="nombreCompleto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>2. Nombre completo de quién completa el formulario *</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu nombre completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="nombreHijo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>3. ¿Cómo se llama tu hijo o hija? *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del niño/a" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="edadHijo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>4. ¿Qué edad tiene? *</FormLabel>
                    <FormControl>
                      <Input placeholder="Edad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="conQuienVive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>5. ¿Con quién vive? *</FormLabel>
                    <FormDescription>
                      Ambos padres, un padre/madre, otros personas significativas
                    </FormDescription>
                    <FormControl>
                      <Textarea placeholder="Describe con quién vive" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="personalidadHijo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>6. ¿Cómo describirías brevemente la personalidad de tu hijo? *</FormLabel>
                    <FormDescription>
                      Esta pregunta proporciona contexto valioso para la caracterización de personajes con los que el niño pueda identificarse
                    </FormDescription>
                    <FormControl>
                      <Textarea placeholder="Describe la personalidad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Contexto Familiar */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">Contexto Familiar</h2>
              
              <FormField
                control={form.control}
                name="dinamicaFamiliar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>7. Cuéntame un poco sobre tu familia: ¿Cómo es la dinámica familiar? ¿Algún aspecto relevante a mencionar? *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe la dinámica familiar" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cambiosRecientes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>8. ¿Algún cambio importante en la vida de tu hijo recientemente? *</FormLabel>
                    <FormDescription>
                      Ej. mudanza, llegada de un hermano, cambio de colegio, otros
                    </FormDescription>
                    <FormControl>
                      <Textarea placeholder="Describe cambios importantes recientes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Situación Actual */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">Situación Actual</h2>
              
              <FormField
                control={form.control}
                name="situacionTrabajo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>9. ¿Qué situación estás enfrentando que te gustaría trabajar con esta historia? *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe la situación" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cuandoOcurre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>10. ¿Cuándo ocurre? *</FormLabel>
                    <FormDescription>
                      Momentos del día, situaciones particulares, con alguna persona o contexto en específico
                    </FormDescription>
                    <FormControl>
                      <Textarea placeholder="Describe cuándo ocurre la situación" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="porQueOcurre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>11. ¿Por qué crees que podría estar ocurriendo? *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe posibles razones" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="aquienAfecta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>12. Además del niño, ¿A quién afecta esta situación? *</FormLabel>
                    <FormDescription>
                      Padres, cuidadores, colegios, otros
                    </FormDescription>
                    <FormControl>
                      <Textarea placeholder="Describe a quién afecta" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Desafíos Identificados */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">Desafíos Identificados</h2>
              
              <FormField
                control={form.control}
                name="preocupacionPadres"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>13. ¿Qué es lo que a uds como padres les cuesta o preocupa de esta situación? *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe preocupaciones" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="aspectosDificiles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>14. ¿Qué aspectos de esta situación han sido más difíciles para tu hijo/a? *</FormLabel>
                    <FormDescription>
                      Emociones fuertes, dificultades para comunicarse, falta de herramientas para manejarlo, otro
                    </FormDescription>
                    <FormControl>
                      <Textarea placeholder="Describe aspectos difíciles" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="conductaHijo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>15. ¿Cuál es la conducta de tu hijo frente a esto? *</FormLabel>
                    <FormDescription>
                      Ej. Se siente frustrado, se aísla, tiene reacciones intensas
                    </FormDescription>
                    <FormControl>
                      <Textarea placeholder="Describe la conducta" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Acciones Intentadas */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">Acciones Intentadas</h2>
              
              <FormField
                control={form.control}
                name="accionesIntentadas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>16. ¿Qué has intentado hacer para abordar esta situación hasta ahora? *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe acciones intentadas" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="resultadosAcciones"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>17. ¿Hay algo que haya funcionado bien? ¿Qué crees que no ha dado resultado? *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe resultados" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="enseñanzaHistoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>18. ¿Qué te gustaría que la historia le enseñara o mostrara a tu hijo? *</FormLabel>
                    <FormDescription>
                      Ej Manejar emociones, resolver conflictos, adaptarse a cambios, entender una situación, otro.
                    </FormDescription>
                    <FormControl>
                      <Textarea placeholder="Describe lo que quieres que aprenda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Objetivos */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">Objetivos</h2>
              
              <FormField
                control={form.control}
                name="objetivos"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>19. ¿Qué esperas lograr con este cuento personalizado? *</FormLabel>
                      <FormDescription>
                        Te recordamos que los cuentos Rasti son un recurso que permite dialogar, conectar,
                      </FormDescription>
                    </div>
                    {goalItems.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="objetivos"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                    <div className="pt-2">
                      <FormField
                        control={form.control}
                        name="otrosObjetivos"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Otros:</FormLabel>
                            <FormControl>
                              <Input placeholder="Otros objetivos" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Personalización */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">Personalización</h2>
              <p className="text-sm text-gray-500 mb-4">
                Las siguientes preguntas están orientadas a recabar información relevante para la personalización 
                del cuento de tal manera de encontrar atributos relevantes que permitan generar interés en el niño 
                y también lograr el proceso de identificación con los personajes del cuento.
              </p>
              
              <FormField
                control={form.control}
                name="rutinaHijo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>20. ¿Cuáles son los momentos más importantes de la rutina de tu hijo? ¿Qué cosas crees que son claves en su día a día que puedan ser representadas en el cuento? *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe rutina e intereses importantes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="interesesHijo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>21. ¿Cuáles son sus intereses o cosas que lo hacen vibrar? *</FormLabel>
                    <FormDescription>
                      Actividades, colores, animales, juegos, lugares, etc
                    </FormDescription>
                    <FormControl>
                      <Textarea placeholder="Describe intereses" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cosasNoLeGustan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>22. ¿Qué cosas no le gustan? *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe lo que no le gusta" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tradicionesValores"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>23. ¿Hay tradiciones, valores o creencias familiares importantes que les gustaría ver reflejados en el cuento? *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe tradiciones y valores" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="expresionesFamiliares"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>24. ¿Existen expresiones, canciones o dichos que son significativos en su familia? *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe expresiones significativas" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Otros */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">Otros</h2>
              
              <FormField
                control={form.control}
                name="temasEvitar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>25. ¿Hay algún tema o situación que preferirías evitar en el cuento? *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe temas a evitar" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="pt-6 bg-white">
              <Button 
                type="submit" 
                className="w-full bg-story-blue hover:bg-story-blue/80 text-lg py-6" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RequestForm;
