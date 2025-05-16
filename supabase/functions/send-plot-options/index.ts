
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Inicializar Resend con la API key desde las variables de entorno
const resendApiKey = Deno.env.get("RESEND_API_KEY");
if (!resendApiKey) {
  console.error("ERROR: RESEND_API_KEY no está configurada en las variables de entorno");
}

// Inicializar Resend directamente
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
  resend?: boolean; // Campo para indicar si es un reenvío
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
    
    // Generar el HTML para las opciones de trama
    const optionsHTML = plotOptions.map((option, index) => `
      <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #f9f9f9;">
        <h3 style="margin-top: 0; color: #3b82f6;">${index + 1}. ${option.title}</h3>
        <p style="color: #4b5563;">${option.description}</p>
      </div>
    `).join('');

    // Construir URL de selección
    const origin = req.headers.get("origin") || "https://tu-sitio-web.com";
    const selectionUrl = `${origin}/opciones/${requestId}`;
    
    console.log("Generando contenido del correo");
    console.log("URL de selección:", selectionUrl);
    
    // Enviar el correo usando Resend
    const emailResponse = await resend.emails.send({
      from: "Cuentos Personalizados <notificaciones@rasti.cl>", 
      to: [to],
      subject: isResend ? `[REENVÍO] Opciones de trama para el cuento de ${childName}` : `Opciones de trama para el cuento de ${childName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #3b82f6; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0;">Cuentos Personalizados</h1>
          </div>
          
          <div style="padding: 20px;">
            <p>Hola ${name},</p>
            
            <p>¡Gracias por confiar en nosotros para crear un cuento personalizado para ${childName}!</p>
            
            <p>${isResend ? 'Te reenviamos' : 'Hemos preparado'} algunas opciones de trama basadas en la información que nos proporcionaste. Por favor, revisa las siguientes opciones y selecciona la que más te guste:</p>
            
            ${optionsHTML}
            
            <div style="margin-top: 30px; text-align: center;">
              <a href="${selectionUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Seleccionar mi opción preferida</a>
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
