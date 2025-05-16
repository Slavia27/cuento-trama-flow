
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Inicializar Resend con la API key desde las variables de entorno
const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resend = new Resend(resendApiKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentEmailRequest {
  to: string;
  name: string;
  childName: string;
  requestId: string;
  optionId: string;
  optionTitle: string;
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

    console.log("Recibiendo solicitud para enviar enlace de pago");
    
    const { to, name, childName, requestId, optionId, optionTitle } = await req.json() as PaymentEmailRequest;

    if (!to || !requestId || !optionId) {
      throw new Error("Missing required parameters");
    }
    
    console.log(`Enviando correo a: ${to} para el pago del cuento de ${childName}`);
    console.log(`Opción seleccionada: ${optionTitle} (${optionId})`);
    
    // Construir URL de pago con todos los parámetros necesarios como query params
    const origin = req.headers.get("origin") || "https://tu-sitio-web.com";
    const paymentUrl = `${origin}/pagar?requestId=${requestId}&optionId=${optionId}&optionTitle=${encodeURIComponent(optionTitle)}`;
    
    console.log("URL de pago generada:", paymentUrl);
    
    const emailResponse = await resend.emails.send({
      from: "Cuentos Personalizados <notificaciones@rasti.cl>", 
      to: [to],
      subject: `Completa tu pago para el cuento de ${childName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #3b82f6; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0;">Cuentos Personalizados</h1>
          </div>
          
          <div style="padding: 20px;">
            <p>Hola ${name},</p>
            
            <p>Notamos que seleccionaste la opción "${optionTitle}" para el cuento personalizado de ${childName}, pero aún no has completado el pago.</p>
            
            <p>Para finalizar tu pedido, por favor haz clic en el botón a continuación:</p>
            
            <div style="margin-top: 30px; text-align: center;">
              <a href="${paymentUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Completar mi pago</a>
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
    console.error("Error in send-payment-link function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
