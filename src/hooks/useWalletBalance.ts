import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { getWalletBalance } from "@/lib/services/wallet";

export interface WalletBalanceData {
  universal_wallet: {
    balance: number;
    currency: string;
  };
  sms_wallet: {
    balance: number;
    currency: string;
  };
  mtn_data_wallet: {
    balance: number;
    currency: string;
  };
  airtel_eds_wallet: {
    balance: number | undefined;
    currency: string | undefined;
  };
  glo_cg_wallet: {
    balance: number | undefined;
    currency: string | undefined;
  };
}

interface UseWalletBalanceReturn {
  balance: WalletBalanceData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

export const useWalletBalance = (): UseWalletBalanceReturn => {
  const [balance, setBalance] = useState<WalletBalanceData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { toast } = useToast();

  const fetchBalance = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getWalletBalance();
      
      if (response.success) {
        setBalance(response.data || response);
        setLastUpdated(new Date());
      } else {
        setError(response.message || "Failed to fetch wallet balance");
        toast({
          title: "Error",
          description: response.message || "Failed to fetch wallet balance",
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      toast({
        title: "Error",
        description: "Failed to fetch wallet balance",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchBalance();
    
    // Auto-refresh every 5 minutes
    const intervalId = setInterval(() => {
      fetchBalance();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [fetchBalance]);

  return {
    balance,
    isLoading,
    error,
    refetch: fetchBalance,
    lastUpdated
  };
};
