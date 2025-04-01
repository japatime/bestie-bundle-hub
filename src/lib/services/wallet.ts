
import { API_BASE_URL, ApiResponse, getApiHeaders } from './config';

/**
 * Get wallet balance
 */
export const getWalletBalance = async (): Promise<ApiResponse> => {
  try {
    console.log('Fetching wallet balance...');
    
    const response = await fetch(`${API_BASE_URL}/balance`, {
      headers: getApiHeaders()
    });
    
    const result = await response.json();
    console.log('Wallet balance response:', result);
    
    return result;
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    return { 
      success: false, 
      status: 'failed', 
      message: error instanceof Error ? error.message : 'Failed to fetch wallet balance' 
    };
  }
};

/**
 * Charge wallet (deduct balance)
 */
export const chargeWallet = async (amount: number): Promise<{
  success: boolean;
  newBalance?: number;
  error?: string;
}> => {
  try {
    console.log(`Charging wallet: ₦${amount}`);
    
    // In a real implementation with an API that supports atomic transactions:
    /*
    const response = await fetch(`${API_BASE_URL}/wallet/charge`, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify({
        amount,
        reference: `airtime_${Date.now()}`
      })
    });
    
    const result = await response.json();
    
    if (!result.success) {
      return {
        success: false,
        error: result.message || 'Failed to charge wallet'
      };
    }
    
    return {
      success: true,
      newBalance: result.data.new_balance
    };
    */
    
    // For now, we'll simulate it by getting the balance and then calculating the new balance
    const balanceResponse = await getWalletBalance();
    
    if (!balanceResponse.success) {
      return { 
        success: false, 
        error: 'Failed to fetch current balance' 
      };
    }
    
    const currentBalance = balanceResponse.data?.universal_wallet?.balance || 0;
    
    // Double-check if balance is sufficient
    if (currentBalance < amount) {
      return { 
        success: false, 
        error: `Insufficient balance. Needed: ₦${amount}, Available: ₦${currentBalance}` 
      };
    }
    
    // Simulate successful charge
    const newBalance = currentBalance - amount;
    console.log(`Charged wallet: -₦${amount}. New balance: ₦${newBalance}`);
    
    return { 
      success: true, 
      newBalance 
    };
  } catch (error) {
    console.error('Error charging wallet:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to charge wallet' 
    };
  }
};

/**
 * Add funds to wallet
 */
export const addFundsToWallet = async (amount: number): Promise<{
  success: boolean;
  newBalance?: number;
  error?: string;
}> => {
  try {
    console.log(`Adding funds: +₦${amount}`);
    
    // In a real implementation, you would make an API call to add funds
    // For now, we'll simulate it
    
    const balanceResponse = await getWalletBalance();
    
    if (!balanceResponse.success) {
      return { 
        success: false, 
        error: 'Failed to fetch current balance' 
      };
    }
    
    const currentBalance = balanceResponse.data?.universal_wallet?.balance || 0;
    const newBalance = currentBalance + amount;
    
    // In a real implementation, you would make an API call to update the balance
    console.log(`Added funds: +₦${amount}. New balance: ₦${newBalance}`);
    
    return { 
      success: true, 
      newBalance 
    };
  } catch (error) {
    console.error('Error adding funds to wallet:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to add funds to wallet' 
    };
  }
};
