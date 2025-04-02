
import { supabase } from "@/lib/supabase";
import { Transaction } from "./types";

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
      
      // Record in Supabase if connected
      if (supabase) {
        try {
          // Fixed: Proper chaining for Supabase operations
          const { error } = await supabase
            .from("transactions")
            .insert({
              ...transactionData,
              user_id: userId
            });
          
          if (error) {
            console.error("Error saving transaction to Supabase:", error);
          }
        } catch (err) {
          console.error("Exception when saving transaction:", err);
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
    
    try {
      // Fixed: Proper chaining for Supabase operations with ordering
      const { data: supabaseTransactions, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching transactions from Supabase:", error);
        return localTransactions;
      }
      
      if (!supabaseTransactions) {
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
    } catch (err) {
      console.error("Exception when fetching transactions:", err);
      return localTransactions;
    }
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    return [];
  }
};
