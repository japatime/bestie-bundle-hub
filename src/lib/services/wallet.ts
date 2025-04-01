
import { API_BASE_URL, ApiResponse, getApiHeaders } from './config';

/**
 * Get wallet balance
 */
export const getWalletBalance = async (): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/balance`, {
      headers: getApiHeaders()
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    return { 
      success: false, 
      status: 'failed', 
      message: 'Failed to fetch wallet balance' 
    };
  }
};
