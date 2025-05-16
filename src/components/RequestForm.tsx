
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  // Información personal
  parentName: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  parentEmail: z.string().email({ message: 'Por favor ingresa un correo electrónico válido.' }),
  parentPhone: z.string().min(9, { message: 'El teléfono debe tener al menos 9 dígitos.' }),
  
  // Información del niño
  childName: z.string().min(2, { message: 'El nombre del niño/a debe tener al menos 2 caracteres.' }),
  childAge: z.string().min(1, { message: 'Por favor indica la edad del niño/a.' }),
  childGender: z.string().min(1, { message: 'Por favor selecciona el género del niño/a.' }),
  
  // Detalles del cuento
  storyType: z.string().min(1, { message: 'Por favor selecciona el tipo de cuento.' }),
  specialInterests: z.string().min(1, { message: 'Por favor indica los intereses especiales del niño/a.' }),
  additionalCharacters: z.string().optional(),
  personalCharacteristics: z.string().min(1, { message: 'Por favor indica las características personales del niño/a.' }),
  
  // Información de entrega
  deliveryAddress: z.string().min(5, { message: 'Por favor ingresa una dirección de entrega válida.' }),
  commune: z.string().min(2, { message: 'Por favor ingresa la comuna de entrega.' }),
  region: z.string().min(2, { message: 'Por favor ingresa la región de entrega.' }),
  
  // Adicionales
  giftMessage: z.string().optional(),
  additionalDetails: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const RequestForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parentName: '',
      parentEmail: '',
      parentPhone: '',
      childName: '',
      childAge: '',
      childGender: '',
      storyType: '',
      specialInterests: '',
      additionalCharacters: '',
      personalCharacteristics: '',
      deliveryAddress: '',
      commune: '',
      region: '',
      giftMessage: '',
      additionalDetails: '',
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // En una implementación real, aquí enviarías los datos a tu backend o servicio
      console.log('Datos del formulario:', data);
      
      // Simulamos un tiempo de respuesta
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "¡Solicitud enviada con éxito!",
        description: "Te contactaremos en las próximas 24 horas con opciones de trama.",
      });
      
      // Guardamos en localStorage para simular persistencia
      const requests = JSON.parse(localStorage.getItem('storyRequests') || '[]');
      const newRequest = {
        id: Date.now().toString(),
        name: data.parentName,
        email: data.parentEmail,
        phone: data.parentPhone,
        childName: data.childName,
        childAge: data.childAge,
        childGender: data.childGender,
        storyType: data.storyType,
        specialInterests: data.specialInterests,
        additionalCharacters: data.additionalCharacters,
        personalCharacteristics: data.personalCharacteristics,
        deliveryAddress: data.deliveryAddress,
        commune: data.commune,
        region: data.region,
        giftMessage: data.giftMessage,
        additionalDetails: data.additionalDetails,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      requests.push(newRequest);
      localStorage.setItem('storyRequests', JSON.stringify(requests));
      
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
    <div className="container py-12 max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-3">Solicitud de Cuento Personalizado</h1>
        <p className="text-muted-foreground">
          Completa el siguiente formulario para comenzar el proceso de creación de tu cuento personalizado.
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">Información del Solicitante</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="parentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Tu nombre completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="parentEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo Electrónico</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="tu@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="parentPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono de Contacto</FormLabel>
                      <FormControl>
                        <Input placeholder="Tu número de teléfono" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">Información del Niño/a</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="childName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Niño/a</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del niño/a" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="childAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Edad del Niño/a</FormLabel>
                      <FormControl>
                        <Input placeholder="Edad" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="childGender"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Género del Niño/a</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="niña" />
                            </FormControl>
                            <FormLabel className="font-normal">Niña</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="niño" />
                            </FormControl>
                            <FormLabel className="font-normal">Niño</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="otro" />
                            </FormControl>
                            <FormLabel className="font-normal">Otro</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">Detalles para el Cuento</h2>
              
              <FormField
                control={form.control}
                name="storyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Cuento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tipo de cuento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="aventuras">Aventuras</SelectItem>
                        <SelectItem value="fantasia">Fantasía</SelectItem>
                        <SelectItem value="amistad">Amistad y Valores</SelectItem>
                        <SelectItem value="espacial">Espacial</SelectItem>
                        <SelectItem value="princesas">Princesas</SelectItem>
                        <SelectItem value="superheroes">Superhéroes</SelectItem>
                        <SelectItem value="piratas">Piratas</SelectItem>
                        <SelectItem value="animales">Animales</SelectItem>
                        <SelectItem value="navidad">Navidad</SelectItem>
                        <SelectItem value="otro">Otro (especificar en detalles adicionales)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="specialInterests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intereses Especiales del Niño/a</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="¿Qué le gusta al niño/a? ¿Tiene personajes o temas favoritos?"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="additionalCharacters"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personajes Adicionales (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="¿Quieres incluir hermanos, mascotas u otros personajes en el cuento?"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Puedes incluir nombres y características de hermanos, mascotas u otros personas importantes.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="personalCharacteristics"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Características Personales</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe la personalidad, apariencia y características especiales del niño/a"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">Información de Entrega</h2>
              <div className="grid grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="deliveryAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección de Entrega</FormLabel>
                      <FormControl>
                        <Input placeholder="Dirección completa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="commune"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comuna</FormLabel>
                        <FormControl>
                          <Input placeholder="Comuna" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Región</FormLabel>
                        <FormControl>
                          <Input placeholder="Región" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">Información Adicional</h2>
              
              <FormField
                control={form.control}
                name="giftMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensaje de Regalo (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Si es un regalo, puedes incluir un mensaje especial"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="additionalDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detalles Adicionales (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="¿Hay algo más que quieras contarnos para personalizar mejor el cuento?"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="pt-4">
              <Button type="submit" className="w-full bg-story-blue hover:bg-story-blue/80" disabled={isSubmitting}>
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
