
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
    if (!mercadoPagoAccessToken) {
      throw new Error('Missing Mercado Pago access token')
    }

    // Parse request body
    const { requestId, amount, description, customerEmail, customerName, redirectUrl } = await req.json()

    if (!requestId || !amount || !description || !customerEmail || !customerName || !redirectUrl) {
      return new Response(
        JSON.stringify({
          error: 'Missing required parameters',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    console.log(`Creating payment for request ${requestId}, amount: ${amount}, customer: ${customerEmail}`)

    // Create preference in Mercado Pago
    const response = await fetch(`${MP_API_URL}/checkout/preferences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mercadoPagoAccessToken}`,
      },
      body: JSON.stringify({
        items: [
          {
            title: description,
            quantity: 1,
            unit_price: amount,
            currency_id: 'CLP', // Chilean Peso
          }
        ],
        payer: {
          email: customerEmail,
          name: customerName,
        },
        external_reference: requestId,
        back_urls: {
          success: redirectUrl,
          failure: redirectUrl,
          pending: redirectUrl,
        },
        auto_return: 'approved',
      }),
    })

    const result = await response.json()

    if (response.status !== 201) {
      console.error('Error creating payment:', result)
      return new Response(
        JSON.stringify({
          error: 'Failed to create payment',
          details: result,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: result,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error processing payment:', error)
    
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
