
import { API_BASE_URL, ApiResponse, getApiHeaders } from './config';

/**
 * Fetches available data plans for a specific network
 */
export const getDataPlans = async (network?: string): Promise<ApiResponse> => {
  try {
    let url = `${API_BASE_URL}/data/plans`;
    if (network) {
      url += `?network=${network}`;
    }
    
    const response = await fetch(url, {
      headers: getApiHeaders()
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
 * Purchases data plan
 */
export const purchaseData = async (
  phone: string,
  package_code: string,
  max_amount?: string,
  callback_url?: string,
  customer_reference?: string
): Promise<ApiResponse> => {
  try {
    const requestBody: Record<string, any> = {
      phone,
      package_code,
      max_amount: max_amount || "5000"
    };
    
    if (callback_url) {
      requestBody.callback_url = callback_url;
    }
    
    if (customer_reference) {
      requestBody.customer_reference = customer_reference;
    }
    
    const response = await fetch(`${API_BASE_URL}/data`, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify(requestBody)
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
  process_type: 'instant' | 'queue' = 'instant',
  callback_url?: string,
  customer_reference?: string
): Promise<ApiResponse> => {
  try {
    const requestBody: Record<string, any> = {
      phone,
      package_code,
      process_type
    };
    
    if (callback_url) {
      requestBody.callback_url = callback_url;
    }
    
    if (customer_reference) {
      requestBody.customer_reference = customer_reference;
    }
    
    const response = await fetch(`${API_BASE_URL}/data/wallet`, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify(requestBody)
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
