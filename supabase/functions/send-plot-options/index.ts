
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, name, childName, requestId, plotOptions } = await req.json() as EmailRequest;

    if (!to || !requestId || !plotOptions || plotOptions.length === 0) {
      throw new Error("Missing required parameters");
    }
    
    // Verificar el email del destinatario
    const authorizedRecipient = "contacto@rasti.cl"; // Tu correo verificado
    const recipientEmail = to === authorizedRecipient ? to : authorizedRecipient;
    
    // Generar el HTML para las opciones de trama
    const optionsHTML = plotOptions.map((option, index) => `
      <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #f9f9f9;">
        <h3 style="margin-top: 0; color: #3b82f6;">${index + 1}. ${option.title}</h3>
        <p style="color: #4b5563;">${option.description}</p>
      </div>
    `).join('');

    // Construir URL de selección
    const selectionUrl = `${req.headers.get("origin") || "https://tu-sitio-web.com"}/opciones/${requestId}`;

    // Si el destinatario no es el autorizado, incluir información en el asunto
    const subjectPrefix = to !== authorizedRecipient ? `[Destinatario original: ${to}] ` : "";
    
    const emailResponse = await resend.emails.send({
      from: "Cuentos Personalizados <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: `${subjectPrefix}Opciones de trama para el cuento de ${childName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #3b82f6; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0;">Cuentos Personalizados</h1>
          </div>
          
          <div style="padding: 20px;">
            ${to !== recipientEmail ? `<p><strong>Nota:</strong> Este correo estaba destinado originalmente a: ${to}</p>` : ''}
            <p>Hola ${name},</p>
            
            <p>¡Gracias por confiar en nosotros para crear un cuento personalizado para ${childName}!</p>
            
            <p>Hemos preparado algunas opciones de trama basadas en la información que nos proporcionaste. Por favor, revisa las siguientes opciones y selecciona la que más te guste:</p>
            
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

    console.log("Email sent successfully:", emailResponse);

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
