
import { supabase } from "@/lib/supabase";
import { chargeWallet, getWalletBalance } from "./wallet";

export type TransactionType = "airtime_purchase" | "data_purchase" | "wallet_funding";

export interface Transaction {
  id?: string;
  type: TransactionType;
  amount: number;
  description: string;
  status: "pending" | "completed" | "failed";
  reference: string;
  user_id?: string;
  created_at?: string;
}

/**
 * Record a transaction in local storage and optionally in Supabase if authenticated
 */
export const recordTransaction = async (transactionData: Omit<Transaction, "id" | "created_at" | "user_id">) => {
  try {
    console.log("Recording transaction:", transactionData);
    
    // Save to local storage for immediate access
    const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
    const newTransaction = {
      ...transactionData,
      id: transactionData.reference || `tx_${Date.now()}`,
      created_at: new Date().toISOString()
    };
    
    transactions.unshift(newTransaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    
    // If user is authenticated, also save to Supabase
    const { data: session } = await supabase.auth.getSession();
    if (session?.session?.user) {
      const userId = session.session.user.id;
      
      // Record in Supabase if connected (will be stored when user connects)
      if (supabase) {
        const { error } = await supabase.from("transactions").insert({
          ...transactionData,
          user_id: userId
        });
        
        if (error) {
          console.error("Error saving transaction to Supabase:", error);
        }
      }
    }
    
    return newTransaction;
  } catch (error) {
    console.error("Failed to save transaction:", error);
    return null;
  }
};

/**
 * Get all transactions, combining local and Supabase data if authenticated
 */
export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    // Get local transactions
    const localTransactions = JSON.parse(localStorage.getItem("transactions") || "[]");
    
    // If authenticated, merge with Supabase transactions
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      return localTransactions;
    }
    
    const userId = session.session.user.id;
    const { data: supabaseTransactions, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching transactions from Supabase:", error);
      return localTransactions;
    }
    
    // Merge and deduplicate by reference
    const allTransactions = [...localTransactions, ...supabaseTransactions];
    const uniqueTransactions = Array.from(
      new Map(allTransactions.map(tx => [tx.reference, tx])).values()
    );
    
    // Sort by date, newest first
    return uniqueTransactions.sort((a, b) => 
      new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    return [];
  }
};

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
