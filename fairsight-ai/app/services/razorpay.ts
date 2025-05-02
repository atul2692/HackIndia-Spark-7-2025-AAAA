// Service for communicating with the Razorpay backend

// API base URL - explicitly pointing to the backend server
const API_BASE_URL = 'http://localhost:8000';

// Helper function to get CSRF token from cookies
const getCsrfToken = (): string | null => {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; csrftoken=`);
  
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

// Types
export interface CreateOrderResponse {
  id: number;
  order_id: string;
  amount: number;
  currency: string;
  key_id: string;
  razorpay_order: any;
}

export interface VerifyPaymentParams {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  payment?: any;
}

// Create a new Razorpay order
export const createOrder = async (amount: number, currency: string = 'INR', receipt?: string): Promise<CreateOrderResponse> => {
  try {
    const token = localStorage.getItem('token') || '';
    const csrfToken = getCsrfToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }
    
    const response = await fetch(`${API_BASE_URL}/payments/api/create_order/`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({
        amount,
        currency,
        receipt: receipt || `order_${Date.now()}`
      })
    });

    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Expected JSON response but got ${contentType}. Check if the server is running correctly.`);
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `Failed to create order: ${response.status} ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Verify a completed payment
export const verifyPayment = async (params: VerifyPaymentParams): Promise<VerifyPaymentResponse> => {
  try {
    const csrfToken = getCsrfToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }
    
    const response = await fetch(`${API_BASE_URL}/payments/api/verify_payment/`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(params)
    });

    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Expected JSON response but got ${contentType}. Check if the server is running correctly.`);
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `Failed to verify payment: ${response.status} ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

// Load Razorpay script
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    // Check if Razorpay is already loaded
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}; 