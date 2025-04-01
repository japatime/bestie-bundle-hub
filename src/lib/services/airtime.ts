
import { API_BASE_URL, ApiResponse, getApiHeaders } from './config';

/**
 * Purchases airtime
 */
export const purchaseAirtime = async (
  network_operator: string, 
  phone: string,
  amount: number,
  max_amount?: number
): Promise<ApiResponse> => {
  try {
    console.log(`Purchasing airtime: ${network_operator}, ${phone}, amount: ₦${amount}`);
    
    // Set max_amount slightly higher than amount to ensure the transaction goes through
    const maxAmount = max_amount || Math.ceil(amount * 1.01);
    
    // Check if API expects amount in kobo (1 ₦ = 100 kobo)
    // Note: AirtimeNigeria API expects amounts in Naira, not kobo
    // If your API expects kobo, uncomment the following:
    // const amountInKobo = amount * 100;
    // const maxAmountInKobo = maxAmount * 100;
    
    const response = await fetch(`${API_BASE_URL}/airtime`, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify({
        network_operator,
        phone,
        amount,
        max_amount: String(maxAmount)
      })
    });
    
    const result = await response.json();
    console.log('Airtime API response:', result);
    
    return result;
  } catch (error) {
    console.error('Error purchasing airtime:', error);
    return { 
      success: false, 
      status: 'failed', 
      message: error instanceof Error ? error.message : 'Failed to purchase airtime' 
    };
  }
};
