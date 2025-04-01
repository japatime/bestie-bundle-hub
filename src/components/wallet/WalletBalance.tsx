
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";

const WalletBalance = () => {
  const { balance, isLoading, refetch, lastUpdated } = useWalletBalance();
  
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true
    }).format(date);
  };

  if (isLoading && !balance) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
    );
  }

  // Use mock data as fallback if API fails
  const nairaBalance = balance?.universal_wallet?.balance || 0;
  const dataBalance = {
    mtn: balance?.mtn_data_wallet?.balance || 0,
    airtel: balance?.airtel_eds_wallet?.balance || 0,
    glo: balance?.glo_cg_wallet?.balance || 0,
    mobile9: 0, // 9mobile not provided in the API response
  };
  const smsBalance = balance?.sms_wallet?.balance || 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-1">
        <div className="text-sm text-muted-foreground">
          {lastUpdated && (
            <span>Last updated: {formatDate(lastUpdated)}</span>
          )}
        </div>
        <button 
          onClick={() => refetch()} 
          className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Refresh
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-primary/5">
          <CardContent className="p-4">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">Naira Balance</span>
              <span className="text-2xl font-bold">₦{nairaBalance.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-500/5">
          <CardContent className="p-4">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">Data Balance</span>
              <div className="text-sm mt-1 space-y-1">
                <div className="flex justify-between">
                  <span>MTN:</span>
                  <span className="font-medium">{dataBalance.mtn}GB</span>
                </div>
                <div className="flex justify-between">
                  <span>Airtel:</span>
                  <span className="font-medium">{dataBalance.airtel}GB</span>
                </div>
                <div className="flex justify-between">
                  <span>Glo:</span>
                  <span className="font-medium">{dataBalance.glo}GB</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-500/5">
          <CardContent className="p-4">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">SMS Balance</span>
              <span className="text-2xl font-bold">{smsBalance}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WalletBalance;
