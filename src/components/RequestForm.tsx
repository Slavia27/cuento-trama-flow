
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
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor ingresa un correo electrónico válido.' }),
  phone: z.string().min(9, { message: 'El teléfono debe tener al menos 9 dígitos.' }),
  childName: z.string().min(2, { message: 'El nombre del niño/a debe tener al menos 2 caracteres.' }),
  childAge: z.string().min(1, { message: 'Por favor indica la edad del niño/a.' }),
  storyTheme: z.string().min(1, { message: 'Por favor selecciona un tema para el cuento.' }),
  specialInterests: z.string().min(1, { message: 'Por favor indica los intereses especiales del niño/a.' }),
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
      name: '',
      email: '',
      phone: '',
      childName: '',
      childAge: '',
      storyTheme: '',
      specialInterests: '',
      additionalDetails: '',
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    // Simulamos envío y guardado de datos
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
        ...data,
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu número de teléfono" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                name="storyTheme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tema del Cuento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tema" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="aventuras">Aventuras</SelectItem>
                        <SelectItem value="fantasia">Fantasía</SelectItem>
                        <SelectItem value="amistad">Amistad</SelectItem>
                        <SelectItem value="familia">Familia</SelectItem>
                        <SelectItem value="animales">Animales</SelectItem>
                        <SelectItem value="superheroes">Superhéroes</SelectItem>
                        <SelectItem value="espacial">Espacial</SelectItem>
                        <SelectItem value="otro">Otro (especificar)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
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
              name="additionalDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detalles Adicionales (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="¿Hay algo más que quieras contarnos para personalizar mejor el cuento?"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
