import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Use the environment variables from next.config.js
const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY || '';
const razorpayKeySecret = process.env.RAZORPAY_SECRET_KEY || '';

console.log('[API] Razorpay Key ID:', razorpayKeyId);
console.log('[API] Razorpay Key Secret exists:', !!razorpayKeySecret);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      amount: rawAmount,
      currency = 'INR',
      receipt = `receipt_${Date.now()}`,
      notes = {},
    } = body;
    
    // Ensure amount is an integer (Razorpay requires amounts as integers)
    const amount = typeof rawAmount === 'number' ? Math.round(rawAmount) : rawAmount;

    // Create an instance of Razorpay
    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('[API] Razorpay keys are missing');
      return NextResponse.json(
        { success: false, error: 'Razorpay configuration is missing' },
        { status: 500 }
      );
    }
    
    console.log('[API] Creating Razorpay order:', {
      amount,
      currency,
      receipt
    });
    
    try {
      const razorpay = new Razorpay({
        key_id: razorpayKeyId,
        key_secret: razorpayKeySecret,
      });
      
      // Create an order using the Razorpay SDK
      const order = await razorpay.orders.create({
        amount: amount,
        currency: currency,
        receipt: receipt,
        notes: notes,
      });
      
      console.log('[API] Razorpay order created successfully:', order);
      
      return NextResponse.json({
        success: true,
        ...order
      });
    } catch (razorpayError) {
      console.error('[API] Razorpay order creation failed:', razorpayError);
      return NextResponse.json(
        { success: false, error: 'Failed to create Razorpay order', details: razorpayError },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { success: false, error: 'Error creating Razorpay order' },
      { status: 500 }
    );
  }
}
