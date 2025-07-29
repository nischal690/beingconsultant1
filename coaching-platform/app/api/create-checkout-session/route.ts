import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_51Nt4bnEeDxhnTeYJDYm8CHlklrDNOJmAWfnPuho58poep2lV3thyDloKOlsBqBq3dbBdPtK741I1joc0dM1VCokz00aTVJ00KK';
const stripe = new Stripe(stripeSecretKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Extract fields with fallbacks for different naming conventions
    const productName = body.productName || body.name || body.product_name;
    const productDescription = body.productDescription || body.description || body.product_description;
    // Ensure amount is an integer (Stripe requires amounts in cents as integers)
    const amount = typeof body.amount === 'number' ? Math.round(body.amount) : body.amount;
    const currency = body.currency || 'usd';
    const customerId = body.customerId || body.customer_id;
    const customerEmail = body.customerEmail || body.customer_email || body.email;
    const metadata = body.metadata || {};
    const successUrl = body.successUrl || body.success_url || 
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment-success`;
    const cancelUrl = body.cancelUrl || body.cancel_url || 
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/payment-cancelled`;
    
    console.log('Received checkout request with:', { 
      productName, amount, currency, metadata 
    });

    // Validate required fields
    if (!productName) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }

    // Create a Stripe checkout session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: productName,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    };

    // Add optional parameters if provided
    if (productDescription) {
      sessionParams.line_items![0].price_data!.product_data!.description = productDescription;
    }

    if (customerEmail) {
      sessionParams.customer_email = customerEmail;
    }

    if (Object.keys(metadata).length > 0) {
      sessionParams.metadata = metadata;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({
      id: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Error creating checkout session',
        type: error.type || 'unknown_error',
        code: error.code || 'unknown_code'
      },
      { status: error.statusCode || 500 }
    );
  }
}
