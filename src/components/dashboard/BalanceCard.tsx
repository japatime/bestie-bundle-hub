
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";

const BalanceCard = () => {
  const { balance, isLoading, refetch } = useWalletBalance();
  
  // Use mock data as fallback if API fails
  const walletBalance = balance?.universal_wallet?.balance || 0;
  const dataBalances = {
    mtn: balance?.mtn_data_wallet?.balance || 0,
    airtel: balance?.airtel_eds_wallet?.balance || 0,
    glo: balance?.glo_cg_wallet?.balance || 0,
    mobile9: 0, // Not provided in API
  };
  
  if (isLoading && !balance) {
    return (
      <Card className="h-full">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-muted-foreground">Wallet Balance</span>
              <div className="text-2xl font-semibold">₦{walletBalance.toLocaleString()}</div>
            </div>
            <button 
              onClick={() => refetch()} 
              className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center"
              title="Refresh balance"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Data Balance</span>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="flex justify-between text-xs border rounded p-2">
                <span>MTN:</span>
                <span>{dataBalances.mtn}GB</span>
              </div>
              <div className="flex justify-between text-xs border rounded p-2">
                <span>Airtel:</span>
                <span>{dataBalances.airtel}GB</span>
              </div>
              <div className="flex justify-between text-xs border rounded p-2">
                <span>Glo:</span>
                <span>{dataBalances.glo}GB</span>
              </div>
              <div className="flex justify-between text-xs border rounded p-2">
                <span>9Mobile:</span>
                <span>{dataBalances.mobile9}GB</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;
