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

// Load Razorpay script dynamically
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      resolve(false);
    };
    
    document.body.appendChild(script);
  });
};

export const processRazorpayPayment = async (options: RazorpayOptions): Promise<any> => {
  try {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error('Failed to load Razorpay script');
    }

    // In a real implementation, you would call your backend API to create an order
    // For demo purposes, we're using client-side only
    const {
      amount,
      currency = 'USD',
      name,
      description = '',
      prefill = {},
      notes = {},
      theme = { color: '#245D66' },
    } = options;

    return new Promise((resolve, reject) => {
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
          console.log('Payment successful:', response);
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
            console.log('Payment cancelled by user');
            resolve({ success: false, error: 'Payment cancelled by user' });
          },
          escape: false,
          animation: true,
        },
      };

      const razorpayInstance = new window.Razorpay(razorpayOptions);
      razorpayInstance.open();
    });
  } catch (error) {
    console.error('Error processing Razorpay payment:', error);
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
    const response = await fetch('/api/create-razorpay-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    return await response.json();
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return { success: false, error };
  }
};
