
/**
 * Paystack API integration for wallet funding and transactions
 */

interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface VerifyTransactionResponse {
  status: boolean;
  message: string;
  data: {
    status: string;
    reference: string;
    amount: number;
    channel: string;
  };
}

/**
 * Initialize a transaction for wallet funding
 */
export const initializeTransaction = async (
  email: string, 
  amount: number, 
  reference: string
): Promise<PaystackInitializeResponse> => {
  try {
    // In a production environment, this call should be made from a backend service
    // to protect your secret key. Here we're using a test key for demonstration.
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer sk_test_023bead3810dc11712488e556898770adb8fd2d9`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        amount: amount * 100, // Paystack amount is in kobo (100 kobo = 1 Naira)
        reference
      })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error initializing transaction:', error);
    return {
      status: false,
      message: 'Failed to initialize transaction',
      data: {
        authorization_url: '',
        access_code: '',
        reference: ''
      }
    };
  }
};

/**
 * Verify a transaction after payment
 */
export const verifyTransaction = async (reference: string): Promise<VerifyTransactionResponse> => {
  try {
    // In a production environment, this call should be made from a backend service
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer sk_test_023bead3810dc11712488e556898770adb8fd2d9`
      }
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error verifying transaction:', error);
    return {
      status: false,
      message: 'Failed to verify transaction',
      data: {
        status: '',
        reference: '',
        amount: 0,
        channel: ''
      }
    };
  }
};

/**
 * Generate a unique transaction reference
 */
export const generateReference = (): string => {
  return `BN-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
};
