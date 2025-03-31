
// This file will contain API integration functions
// for airtime, data, electricity, TV, and followers services

/**
 * Interface for API responses
 */
interface ApiResponse {
  status: boolean;
  message: string;
  data?: any;
}

/**
 * Base URL for API requests 
 */
const API_BASE_URL = 'https://airtimenigeria.com/app/api';

/**
 * Fetches available data plans for a specific network
 */
export const getDataPlans = async (network: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/data-plans?network=${network}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching data plans:', error);
    return { status: false, message: 'Failed to fetch data plans' };
  }
};

/**
 * Purchases airtime
 */
export const purchaseAirtime = async (
  network: string, 
  phoneNumber: string,
  amount: number,
  apiToken: string
): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`
      },
      body: JSON.stringify({
        service: 'airtime',
        network,
        phoneNumber,
        amount
      })
    });
    return await response.json();
  } catch (error) {
    console.error('Error purchasing airtime:', error);
    return { status: false, message: 'Failed to purchase airtime' };
  }
};

/**
 * Purchases data plan
 */
export const purchaseData = async (
  network: string,
  phoneNumber: string,
  planId: string,
  apiToken: string
): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`
      },
      body: JSON.stringify({
        service: 'data',
        network,
        phoneNumber,
        planId
      })
    });
    return await response.json();
  } catch (error) {
    console.error('Error purchasing data plan:', error);
    return { status: false, message: 'Failed to purchase data plan' };
  }
};

// More API functions can be added here for electricity, TV, followers, etc.
