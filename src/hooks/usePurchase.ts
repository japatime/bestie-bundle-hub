
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { purchaseAirtime } from "@/lib/services/airtime";
import { purchaseData } from "@/lib/services/data";
import { getWalletBalance } from "@/lib/services/wallet";
import { processWalletPurchase } from "@/lib/services/transaction";

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
      console.log("Starting purchase process for:", planDetails);
      
      // Use the streamlined transaction processing service
      const result = await processWalletPurchase({
        type: planDetails.type === "airtime" ? "airtime_purchase" : "data_purchase",
        amount: planDetails.cost,
        description: `${planDetails.name} for ${planDetails.phone}`,
        purchaseFunction: async () => {
          // Execute the appropriate purchase API call
          if (planDetails.type === "airtime") {
            return await purchaseAirtime(
              planDetails.network,
              planDetails.phone,
              planDetails.cost
            );
          } else {
            if (!planDetails.package_code) {
              throw new Error("Package code is required for data purchase");
            }
            
            return await purchaseData(
              planDetails.phone,
              planDetails.package_code
            );
          }
        }
      });

      if (result.success) {
        // Send notification about success
        toast({
          title: "Purchase Successful",
          description: `You purchased ${planDetails.name}. New balance: ₦${result.newBalance?.toLocaleString()}`,
        });
        
        return {
          ...result,
          plan: planDetails,
        };
      } else {
        // Send notification about failure
        toast({
          title: "Purchase Failed",
          description: result.error || "An unknown error occurred",
          variant: "destructive",
        });
        
        return result;
      }
    } catch (error) {
      console.error("Purchase error:", error);
      
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      
      toast({
        title: "Purchase Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
      
      // Sync wallet balance regardless of success/failure
      syncWalletBalance();
    }
  };

  const syncWalletBalance = async () => {
    try {
      const response = await getWalletBalance();
      console.log("Balance synced:", response);
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
