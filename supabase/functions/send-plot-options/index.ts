
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "npm:@supabase/supabase-js@2.39.6";

// Inicializar Resend con la API key desde las variables de entorno
const resendApiKey = Deno.env.get("RESEND_API_KEY");
if (!resendApiKey) {
  console.error("ERROR: RESEND_API_KEY no está configurada en las variables de entorno");
}

// Obtener las variables de entorno de Supabase
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("ERROR: Variables de entorno de Supabase no configuradas");
}

// Inicializar Supabase client
const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

// Inicializar Resend con validación 
const resend = new Resend(resendApiKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PlotOption {
  id: string;
  title: string;
  description: string;
}

interface EmailRequest {
  to: string;
  name: string;
  childName: string;
  requestId: string;
  plotOptions: PlotOption[];
  resend?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verificar que la API key de Resend esté configurada
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY no está configurada. Por favor, añade este secreto en la configuración de funciones de Supabase.");
    }

    console.log("Recibiendo solicitud para enviar opciones de trama");
    
    const { to, name, childName, requestId, plotOptions, resend: isResend = false } = await req.json() as EmailRequest;

    if (!to || !requestId || !plotOptions || plotOptions.length === 0) {
      throw new Error("Missing required parameters");
    }
    
    console.log(`Enviando correo a: ${to} para el cuento de ${childName}`);
    console.log(`Número de opciones: ${plotOptions.length}`);
    console.log(`¿Es un reenvío?: ${isResend ? "Sí" : "No"}`);
    
    // Guardar en Supabase si no es un reenvío
    if (!isResend) {
      console.log("Guardando opciones en la base de datos");
      
      // Primero eliminar opciones existentes para este request_id
      const { error: deleteError } = await supabase
        .from('plot_options')
        .delete()
        .eq('request_id', requestId);
        
      if (deleteError) {
        console.error("Error al eliminar opciones existentes:", deleteError);
        // No lanzar error aquí, continuar con el proceso
      }
      
      // Ahora insertar las nuevas opciones
      for (const option of plotOptions) {
        const { error } = await supabase
          .from('plot_options')
          .insert({
            option_id: option.id,
            request_id: requestId,
            title: option.title,
            description: option.description
          });
          
        if (error) {
          console.error("Error al guardar opción:", error);
          throw new Error(`Error al guardar opción en la base de datos: ${error.message}`);
        }
      }
      
      // Actualizar el estado de la solicitud
      const { error: updateError } = await supabase
        .from('story_requests')
        .update({ status: 'opciones' })
        .eq('request_id', requestId);
        
      if (updateError) {
        console.error("Error al actualizar estado:", updateError);
        throw new Error(`Error al actualizar estado en la base de datos: ${updateError.message}`);
      }
    }
    
    // Generar el HTML para las opciones de trama
    const optionsHTML = plotOptions.map((option, index) => `
      <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #f9f9f9;">
        <h3 style="margin-top: 0; color: #3b82f6;">${index + 1}. ${option.title}</h3>
        <p style="color: #4b5563;">${option.description}</p>
      </div>
    `).join('');

    // Generar HTML para los estilos de ilustración
    const illustrationStylesHTML = `
      <div style="margin-top: 30px;">
        <h2 style="color: #3b82f6; margin-bottom: 20px;">Elige tu estilo de ilustración preferido</h2>
        <p style="margin-bottom: 20px; color: #4b5563;">Selecciona uno de los siguientes estilos para las ilustraciones de tu cuento:</p>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px;">
          <div style="text-align: center; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
            <img src="https://d238e6dc-ab74-4a18-be2a-3bd7dc262b5d.lovableproject.com/lovable-uploads/file-ELxXUxqtntyLMrDMkWUVZU.png" alt="Acuarela Suave" style="width: 150px; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;">
            <h4 style="margin: 0; color: #3b82f6;">1. Acuarela Suave</h4>
            <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Colores suaves y difuminados</p>
          </div>
          
          <div style="text-align: center; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
            <img src="https://d238e6dc-ab74-4a18-be2a-3bd7dc262b5d.lovableproject.com/lovable-uploads/file-FZAnwaDJXGLWRwvXdvhdhr.png" alt="Vectorial Limpio" style="width: 150px; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;">
            <h4 style="margin: 0; color: #3b82f6;">2. Vectorial Limpio</h4>
            <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Líneas definidas y colores vibrantes</p>
          </div>
          
          <div style="text-align: center; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
            <img src="https://d238e6dc-ab74-4a18-be2a-3bd7dc262b5d.lovableproject.com/lovable-uploads/file-821yPMQtkxLvK4XmLFkVPV.png" alt="Boceto a Lápiz" style="width: 150px; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;">
            <h4 style="margin: 0; color: #3b82f6;">3. Boceto a Lápiz</h4>
            <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Trazos artísticos a lápiz</p>
          </div>
          
          <div style="text-align: center; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
            <img src="https://d238e6dc-ab74-4a18-be2a-3bd7dc262b5d.lovableproject.com/lovable-uploads/file-JSAcQmaQ8nUz2nabSKPuhZ.png" alt="Cartoon Infantil" style="width: 150px; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;">
            <h4 style="margin: 0; color: #3b82f6;">4. Cartoon Infantil</h4>
            <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Estilo divertido y colorido</p>
          </div>
        </div>
      </div>
    `;

    // Construir URL de selección
    const origin = req.headers.get("origin") || "https://d238e6dc-ab74-4a18-be2a-3bd7dc262b5d.lovableproject.com";
    const selectionUrl = `${origin}/opciones/${requestId}`;
    
    console.log("Generando contenido del correo");
    console.log("URL de selección:", selectionUrl);
    
    // Verificar formato de correo para propósitos de depuración
    console.log("Correo destino:", to);
    console.log("Remitente:", "Cuentos Personalizados <notificaciones@rasti.cl>");
    
    // Enviar el correo usando Resend
    const emailResponse = await resend.emails.send({
      from: "Cuentos Personalizados <notificaciones@rasti.cl>", 
      to: [to],
      subject: isResend ? `[REENVÍO] Opciones de trama y estilo para el cuento de ${childName}` : `Opciones de trama y estilo para el cuento de ${childName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #3b82f6; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0;">Cuentos Personalizados</h1>
          </div>
          
          <div style="padding: 20px;">
            <p>Hola ${name},</p>
            
            <p>¡Gracias por confiar en nosotros para crear un cuento personalizado para ${childName}!</p>
            
            <p>${isResend ? 'Te reenviamos' : 'Hemos preparado'} algunas opciones de trama y estilos de ilustración basadas en la información que nos proporcionaste. Por favor, revisa las siguientes opciones:</p>
            
            <h2 style="color: #3b82f6; margin-top: 30px;">Opciones de Trama</h2>
            ${optionsHTML}
            
            ${illustrationStylesHTML}
            
            <div style="margin-top: 30px; text-align: center;">
              <a href="${selectionUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Seleccionar mis opciones preferidas</a>
            </div>
            
            <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
              Si tienes alguna pregunta, no dudes en contactarnos respondiendo a este correo electrónico.
            </p>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
            <p>© 2025 Cuentos Personalizados. Todos los derechos reservados.</p>
          </div>
        </div>
      `,
    });

    console.log("Email attempt response:", JSON.stringify(emailResponse));
    
    // Verificar si hay errores en la respuesta de Resend
    if (emailResponse.error) {
      console.error("Error al enviar el correo:", JSON.stringify(emailResponse.error));
      throw new Error(`Error al enviar el correo: ${emailResponse.error.message}`);
    }

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-plot-options function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
