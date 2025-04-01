
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
    // Set max_amount slightly higher than amount to ensure the transaction goes through
    const maxAmount = max_amount || Math.ceil(amount * 0.99);
    
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
    
    return await response.json();
  } catch (error) {
    console.error('Error purchasing airtime:', error);
    return { 
      success: false, 
      status: 'failed', 
      message: 'Failed to purchase airtime' 
    };
  }
};
