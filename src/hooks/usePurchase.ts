
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { purchaseAirtime } from "@/lib/services/airtime";
import { purchaseData } from "@/lib/services/data";
import { getWalletBalance } from "@/lib/services/wallet";
import { chargeWallet } from "@/lib/services/wallet";

export interface PlanDetails {
  name: string;
  cost: number;
  type: "airtime" | "data";
  network: string;
  phone: string;
  package_code?: string;
}

export interface PurchaseResult {
  success: boolean;
  transactionID?: string;
  newBalance?: number;
  plan?: PlanDetails;
  error?: string;
}

export const usePurchase = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const purchaseAirtimeOrData = async (planDetails: PlanDetails): Promise<PurchaseResult> => {
    setIsLoading(true);
    
    try {
      // Step 1: Check wallet balance
      const balanceResponse = await getWalletBalance();
      
      if (!balanceResponse.success) {
        throw new Error("Failed to check wallet balance");
      }
      
      const currentBalance = balanceResponse.data?.universal_wallet?.balance || 0;
      
      if (currentBalance < planDetails.cost) {
        throw new Error("Insufficient balance");
      }

      // Step 2: Charge wallet
      const chargeResult = await chargeWallet(planDetails.cost);
      
      if (!chargeResult.success) {
        throw new Error("Failed to charge wallet");
      }

      // Step 3: Purchase from provider (AirtimeNigeria API)
      let purchaseResult;
      
      if (planDetails.type === "airtime") {
        purchaseResult = await purchaseAirtime(
          planDetails.network,
          planDetails.phone,
          planDetails.cost
        );
      } else {
        if (!planDetails.package_code) {
          throw new Error("Package code is required for data purchase");
        }
        
        purchaseResult = await purchaseData(
          planDetails.phone,
          planDetails.package_code
        );
      }

      if (!purchaseResult.success) {
        // Refund the wallet if purchase fails
        await refundWallet(planDetails.cost);
        throw new Error(purchaseResult.message || "Purchase failed");
      }

      // Record transaction
      recordTransaction({
        type: planDetails.type === "airtime" ? "airtime_purchase" : "data_purchase",
        amount: planDetails.cost,
        plan: planDetails.name,
        status: "completed",
        transactionID: purchaseResult.details?.reference || String(Date.now())
      });

      // Return success data
      const result = {
        success: true,
        transactionID: purchaseResult.details?.reference || String(Date.now()),
        newBalance: chargeResult.newBalance,
        plan: planDetails,
      };

      // Send notification
      sendNotification(result);

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      
      // Send notification about the failure
      const result = { success: false, error: errorMessage };
      sendNotification(result);
      
      return result;
    } finally {
      setIsLoading(false);
      
      // Sync wallet balance regardless of success/failure
      syncWalletBalance();
    }
  };

  const refundWallet = async (amount: number) => {
    // In a real implementation, you would have an API call to refund the wallet
    // For now, we'll simulate it with a log
    console.log(`Refunding ${amount} to wallet`);
    return { success: true };
  };

  const recordTransaction = async (transactionData: {
    type: string;
    amount: number;
    plan: string;
    status: string;
    transactionID: string;
  }) => {
    try {
      // In a real implementation, you would save this to a database
      // For now, we'll just log it
      console.log("Transaction recorded:", transactionData);
      
      // Optionally save to localStorage for demo purposes
      const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
      transactions.unshift({
        ...transactionData,
        date: new Date().toISOString().split("T")[0],
        id: transactionData.transactionID
      });
      localStorage.setItem("transactions", JSON.stringify(transactions));
      
    } catch (error) {
      console.error("Failed to save transaction:", error);
    }
  };

  const sendNotification = (result: PurchaseResult) => {
    // UI Notification (Toast)
    if (result.success) {
      toast({
        title: "Purchase Successful",
        description: `You purchased ${result.plan?.name}. New balance: ₦${result.newBalance?.toLocaleString()}`,
      });
    } else {
      toast({
        title: "Purchase Failed",
        description: result.error || "An unknown error occurred",
        variant: "destructive",
      });
    }
    
    // In a real implementation, you might want to send an email notification here
  };

  const syncWalletBalance = async () => {
    try {
      await getWalletBalance();
      return true;
    } catch (error) {
      console.error("Failed to sync balance:", error);
      return false;
    }
  };

  return {
    purchaseAirtimeOrData,
    isLoading,
    syncWalletBalance
  };
};
