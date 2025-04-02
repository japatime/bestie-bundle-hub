
import { chargeWallet, getWalletBalance } from "../wallet";
import { recordTransaction } from "./storage";
import { TransactionType } from "./types";

/**
 * Process an airtime or data purchase with proper wallet integration
 */
export const processWalletPurchase = async ({
  type,
  amount,
  description,
  purchaseFunction
}: {
  type: TransactionType;
  amount: number;
  description: string;
  purchaseFunction: () => Promise<any>;
}): Promise<{
  success: boolean;
  transactionID?: string;
  newBalance?: number;
  error?: string;
}> => {
  try {
    // Step 1: Get fresh balance check
    const balanceResponse = await getWalletBalance();
    
    if (!balanceResponse.success) {
      throw new Error("Failed to check wallet balance");
    }
    
    const currentBalance = balanceResponse.data?.universal_wallet?.balance || 0;
    
    // Step 2: Detailed balance check with improved error message
    if (currentBalance < amount) {
      throw new Error(`Insufficient balance. Needed: ₦${amount}, Available: ₦${currentBalance}`);
    }

    // Step 3: Generate reference ID
    const reference = `${type}_${Date.now()}`;

    // Step 4: Create pending transaction
    await recordTransaction({
      type,
      amount,
      description,
      status: "pending",
      reference
    });

    // Step 5: Charge wallet
    const chargeResult = await chargeWallet(amount);
    
    if (!chargeResult.success) {
      await recordTransaction({
        type,
        amount,
        description,
        status: "failed",
        reference,
      });
      throw new Error("Failed to charge wallet");
    }

    // Step 6: Execute purchase
    const purchaseResult = await purchaseFunction();
    
    if (!purchaseResult.success) {
      // Refund the wallet if purchase fails
      await recordTransaction({
        type,
        amount,
        description: `Refund: ${description} - ${purchaseResult.message || "Purchase failed"}`,
        status: "completed",
        reference: `refund_${reference}`
      });
      
      // Update the original transaction as failed
      await recordTransaction({
        type,
        amount,
        description,
        status: "failed",
        reference,
      });
      
      throw new Error(purchaseResult.message || "Purchase failed");
    }

    // Step 7: Record successful transaction
    await recordTransaction({
      type,
      amount, 
      description,
      status: "completed",
      reference
    });

    // Step 8: Return success data
    return {
      success: true,
      transactionID: reference,
      newBalance: chargeResult.newBalance,
    };
  } catch (error) {
    console.error("Transaction error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    
    return { success: false, error: errorMessage };
  }
};
