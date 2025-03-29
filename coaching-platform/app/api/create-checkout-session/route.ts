import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Use the provided Stripe secret key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_51Nt4bnEeDxhnTeYJDYm8CHlklrDNOJmAWfnPuho58poep2lV3thyDloKOlsBqBq3dbBdPtK741I1joc0dM1VCokz00aTVJ00KK';
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16', // Use the latest stable API version
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      productName,
      productDescription,
      amount,
      currency = 'usd',
      customerId,
      customerEmail,
      metadata = {},
      successUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/payment-success`,
      cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/payment-cancelled`,
    } = body;

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: productName,
              description: productDescription || undefined,
              metadata: metadata,
            },
            unit_amount: amount, // amount in smallest currency unit (cents for USD)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      metadata: metadata,
    });

    return NextResponse.json({
      id: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}
