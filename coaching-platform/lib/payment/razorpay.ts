declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  key?: string;
  amount: number; // in smallest currency unit (paise for INR)
  currency?: string;
  name: string;
  description?: string;
  orderId?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  handler?: (response: any) => void;
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    animation?: boolean;
  };
}

// Replace with your actual Razorpay key
const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_test_9HBkHnKk5Sv9sm';
console.log('[Razorpay] Using key:', razorpayKey);

// Load Razorpay script dynamically
const loadRazorpayScript = (): Promise<boolean> => {
  console.log('[Razorpay] Loading script...');
  return new Promise((resolve) => {
    if (window.Razorpay) {
      console.log('[Razorpay] Script already loaded');
      resolve(true);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('[Razorpay] Script loaded successfully');
      resolve(true);
    };
    script.onerror = () => {
      console.error('[Razorpay] Failed to load script');
      resolve(false);
    };
    
    document.body.appendChild(script);
  });
};

export const processRazorpayPayment = async (options: RazorpayOptions): Promise<any> => {
  console.log('[Razorpay] Processing payment with options:', { ...options, key: '***' });
  try {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      console.error('[Razorpay] Script loading failed');
      throw new Error('Failed to load Razorpay script');
    }
    console.log('[Razorpay] Script loaded, proceeding with payment');

    // In a real implementation, you would call your backend API to create an order
    // For demo purposes, we're using client-side only
    const {
      amount: rawAmount,
      currency = 'USD',
      name,
      description = '',
      prefill = {},
      notes = {},
      theme = { color: '#245D66' },
    } = options;
    
    // Ensure amount is an integer (Razorpay requires amounts as integers)
    const amount = typeof rawAmount === 'number' ? Math.round(rawAmount) : rawAmount;

    return new Promise((resolve, reject) => {
      console.log('[Razorpay] Creating payment instance with currency:', options.currency || 'USD');
      const razorpayOptions = {
        key: razorpayKey,
        amount: amount,
        currency: currency,
        name: name,
        description: description,
        prefill: {
          name: prefill.name || '',
          email: prefill.email || '',
          contact: prefill.contact || '',
        },
        notes: notes,
        theme: theme,
        handler: function (response: any) {
          // Handle successful payment
          console.log('[Razorpay] Payment successful:', response);
          console.log('[Razorpay] Transaction ID:', response.razorpay_payment_id);
          resolve({
            success: true,
            transactionId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            amount: amount,
            currency: currency,
            productName: name
          });
        },
        modal: {
          ondismiss: function () {
            console.log('[Razorpay] Payment cancelled by user');
            resolve({ success: false, error: 'Payment cancelled by user' });
          },
          escape: false,
          animation: true,
        },
      };

      console.log('[Razorpay] Opening payment modal');
      const razorpayInstance = new window.Razorpay(razorpayOptions);
      razorpayInstance.open();
      console.log('[Razorpay] Payment modal opened');
    });
  } catch (error) {
    console.error('[Razorpay] Error processing payment:', error);
    return { success: false, error };
  }
};

// For creating an order on the server (in a real implementation)
export const createRazorpayOrder = async (options: {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}) => {
  try {
    // In a real implementation, you would call your backend API to create an order
    console.log('[Razorpay] Creating order with options:', { ...options, amount: options.amount });
    const response = await fetch('/api/create-razorpay-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });
    console.log('[Razorpay] Order creation response status:', response.status);

    const responseData = await response.json();
    console.log('[Razorpay] Order created successfully:', responseData);
    return responseData;
  } catch (error) {
    console.error('[Razorpay] Error creating order:', error);
    return { success: false, error };
  }
};
