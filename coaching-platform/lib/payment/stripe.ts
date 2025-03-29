import { loadStripe, Stripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51Nt4bnEeDxhnTeYJ7eJC3lUIVLVs47lOcm0pLtpucPnDemepdZ4dFtMu1IxzK7fMsQFOt42bNgiuKQlFC24bkzXt00M6PmVQK2';

// Initialize Stripe
let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
};

export interface StripeCheckoutOptions {
  priceId?: string;
  productName: string;
  productDescription?: string;
  amount: number; // in smallest currency unit (cents for USD)
  currency?: string;
  customerId?: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
  successUrl?: string;
  cancelUrl?: string;
}

export const createStripeCheckoutSession = async (options: StripeCheckoutOptions) => {
  const {
    productName,
    productDescription,
    amount,
    currency = 'usd',
    customerId,
    customerEmail,
    metadata = {},
    successUrl = window.location.origin + '/dashboard/payment-success',
    cancelUrl = window.location.origin + '/dashboard/payment-cancelled',
  } = options;

  try {
    // In a real implementation, you would call your backend API to create a checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productName,
        productDescription,
        amount,
        currency,
        customerId,
        customerEmail,
        metadata,
        successUrl,
        cancelUrl,
      }),
    });

    const session = await response.json();

    // Redirect to Stripe Checkout
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Failed to load Stripe');
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (error) {
      console.error('Stripe checkout error:', error);
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    return { success: false, error };
  }
};

// For direct payment without checkout page
export const processStripePayment = async (options: StripeCheckoutOptions) => {
  try {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Failed to load Stripe');
    }

    // Prepare success URL with query parameters
    const successUrl = options.successUrl || 
      `${window.location.origin}/dashboard/payment-success?` + 
      `product_id=${encodeURIComponent(options.metadata?.programId || '')}&` +
      `product_name=${encodeURIComponent(options.productName || '')}&` +
      `amount=${encodeURIComponent(options.amount / 100)}&` + // Convert back from cents to dollars
      `payment_method=Stripe&` +
      `category=${encodeURIComponent(options.metadata?.programCategory || 'coaching')}&` +
      `stripe_payment_id=pending`;

    // Prepare cancel URL
    const cancelUrl = options.cancelUrl || `${window.location.origin}/dashboard/payment-cancelled`;

    // Create a checkout session on the server
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...options,
        successUrl,
        cancelUrl
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create checkout session');
    }

    const session = await response.json();

    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (error) {
      console.error('Stripe checkout error:', error);
      throw new Error(error.message);
    }

    // This won't be reached immediately as the user will be redirected to Stripe
    // The actual success handling will happen when the user is redirected back to the success URL
    return { 
      success: true, 
      transactionId: session.id,
      amount: options.amount,
      currency: options.currency || 'usd',
      productName: options.productName
    };
  } catch (error) {
    console.error('Error processing Stripe payment:', error);
    return { success: false, error };
  }
};
