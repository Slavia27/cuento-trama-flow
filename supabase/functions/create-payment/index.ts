
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

// Define CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// MercadoPago API URL
const MP_API_URL = "https://api.mercadopago.com"

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get access token from environment variables
    const mercadoPagoAccessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN')
    console.log("Starting payment creation process");

    if (!mercadoPagoAccessToken) {
      console.error('Missing Mercado Pago access token')
      return new Response(
        JSON.stringify({
          error: 'Missing Mercado Pago access token. Please set the MERCADO_PAGO_ACCESS_TOKEN secret.',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Log the token format (not the actual token) to help debug
    console.log(`Token length: ${mercadoPagoAccessToken.length}`);
    console.log(`Token format check: ${mercadoPagoAccessToken.startsWith('APP_USR-') ? 'Production format' : (mercadoPagoAccessToken.startsWith('TEST-') ? 'Test format' : 'Unknown format')}`);

    // Parse request body
    let requestData;
    try {
      requestData = await req.json();
    } catch (e) {
      console.error("Error parsing request body:", e);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { 
      requestId, 
      amount, 
      description, 
      customerEmail, 
      customerName, 
      redirectUrl 
    } = requestData;

    if (!requestId || !amount || !description || !customerEmail || !customerName || !redirectUrl) {
      return new Response(
        JSON.stringify({
          error: 'Missing required parameters',
          received: { requestId, amount, description, customerEmail, customerName, redirectUrl },
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    console.log(`Creating payment for request ${requestId}, amount: ${amount}, customer: ${customerEmail}`);
    console.log(`Redirect URL: ${redirectUrl}`);

    // Create preference in Mercado Pago
    console.log("Creating Mercado Pago preference...");
    
    // Create the payload for Mercado Pago
    const mpPayload = {
      items: [
        {
          id: requestId,
          title: description,
          quantity: 1,
          unit_price: amount,
          currency_id: 'CLP', // Chilean Peso
          description: `Cuento personalizado para niños`,
          category_id: 'books',
        }
      ],
      payer: {
        email: customerEmail,
        name: customerName.split(' ')[0] || customerName, // First name
        surname: customerName.split(' ').slice(1).join(' ') || '', // Last name(s)
      },
      external_reference: requestId,
      back_urls: {
        success: redirectUrl,
        failure: redirectUrl,
        pending: redirectUrl,
      },
      auto_return: 'approved',
      statement_descriptor: 'Cuentos Personalizados',
      notification_url: null, // Para recibir notificaciones, puedes configurar un webhook aquí
      payment_methods: {
        excluded_payment_types: [],
        default_payment_method_id: null,
        installments: 1,
        default_installments: 1
      },
      expires: false,
    };
    
    // Log the payload for debugging
    console.log("Mercado Pago payload:", JSON.stringify(mpPayload, null, 2));
    
    // Make request to Mercado Pago API
    console.log("Sending request to Mercado Pago API...");
    console.log(`Authorization: Bearer ${mercadoPagoAccessToken.substring(0, 10)}...`);
    
    const response = await fetch(`${MP_API_URL}/checkout/preferences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mercadoPagoAccessToken}`,
      },
      body: JSON.stringify(mpPayload),
    }).catch(err => {
      console.error('Error communicating with Mercado Pago API:', err);
      return { ok: false, status: 500, statusText: err.message };
    });

    // Log full response for debugging
    console.log(`Mercado Pago response status: ${response.status} ${response.statusText}`);
    
    // Handle request error
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error from Mercado Pago API (${response.status}):`, errorText);
      
      let parsedError;
      try {
        parsedError = JSON.parse(errorText);
      } catch (e) {
        parsedError = { raw: errorText };
      }
      
      return new Response(
        JSON.stringify({
          error: 'Failed to create payment in Mercado Pago',
          status: response.status,
          details: parsedError
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const result = await response.json();

    console.log('Payment preference created successfully:', JSON.stringify({
      id: result.id,
      init_point: result.init_point,
    }));

    return new Response(
      JSON.stringify({
        success: true,
        data: result,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing payment:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message,
        stack: Deno.env.get('ENVIRONMENT') === 'development' ? error.stack : undefined,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
