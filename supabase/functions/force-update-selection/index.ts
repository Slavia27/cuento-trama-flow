
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.6";

// Obtener las variables de entorno de Supabase
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("ERROR: Variables de entorno de Supabase no configuradas");
}

// Inicializar Supabase client con la clave de servicio
const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { requestId, selectedOption } = await req.json();

    if (!requestId || !selectedOption) {
      throw new Error("Request ID y selectedOption son requeridos");
    }

    console.log(`Forzando actualización para solicitud ${requestId} con opción ${selectedOption}`);

    // Primero, intentar actualizar directamente
    const { error: updateError } = await supabase
      .from('story_requests')
      .update({ 
        selected_plot: selectedOption,
        status: 'seleccion'
      })
      .eq('request_id', requestId);

    if (updateError) {
      console.error("Error en primera actualización:", updateError);
      
      // Intentar actualizar primero la selección
      const { error: plotError } = await supabase
        .from('story_requests')
        .update({ selected_plot: selectedOption })
        .eq('request_id', requestId);
      
      if (plotError) {
        console.error("Error al actualizar selección:", plotError);
      }
      
      // Luego actualizar el estado
      const { error: statusError } = await supabase
        .from('story_requests')
        .update({ status: 'seleccion' })
        .eq('request_id', requestId);
      
      if (statusError) {
        console.error("Error al actualizar estado:", statusError);
        throw new Error("No se pudieron aplicar las actualizaciones");
      }
    }
    
    // Verificar el resultado final
    const { data, error: checkError } = await supabase
      .from('story_requests')
      .select('status, selected_plot')
      .eq('request_id', requestId)
      .single();
    
    if (checkError) {
      console.error("Error al verificar actualización:", checkError);
      throw new Error("No se pudo verificar la actualización");
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Actualización forzada completada",
        data
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error en función force-update-selection:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Error al procesar la solicitud",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});
