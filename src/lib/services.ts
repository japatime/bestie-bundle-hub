
// This file contains API integration functions for services 

/**
 * Interface for API responses
 */
export interface ApiResponse {
  success: boolean;
  status: string;
  message: string;
  details?: any;
}

/**
 * Base URL for API requests 
 */
const API_BASE_URL = 'https://www.airtimenigeria.com/api/v1';

// The API token should ideally be stored in a backend service
// This is only for demo purposes
const API_TOKEN = '922|6Tydbi6ek1BB9JeNDhWXxyz9kz4L7iFXJ3f6vBGQ';

/**
 * Fetches available data plans for a specific network
 */
export const getDataPlans = async (network: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/data/plans?network=${network}`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching data plans:', error);
    return { 
      success: false, 
      status: 'failed', 
      message: 'Failed to fetch data plans' 
    };
  }
};

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
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
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

/**
 * Purchases data plan
 */
export const purchaseData = async (
  phone: string,
  package_code: string,
  max_amount?: string
): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/data`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone,
        package_code,
        max_amount: max_amount || "5000" // Default max amount
      })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error purchasing data plan:', error);
    return { 
      success: false, 
      status: 'failed', 
      message: 'Failed to purchase data plan' 
    };
  }
};

/**
 * Vends data from data wallet
 */
export const vendDataFromWallet = async (
  phone: string,
  package_code: string,
  process_type: 'instant' | 'queue' = 'instant'
): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/data/wallet`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone,
        package_code,
        process_type
      })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error vending data from wallet:', error);
    return { 
      success: false, 
      status: 'failed', 
      message: 'Failed to vend data from wallet' 
    };
  }
};
