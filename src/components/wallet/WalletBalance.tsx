
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface WalletBalanceProps {
  nairaBalance: number;
  dataBalance: {
    mtn: number;
    airtel: number;
    glo: number;
    mobile9: number;
  };
  smsBalance: number;
}

const WalletBalance = ({ nairaBalance, dataBalance, smsBalance }: WalletBalanceProps) => {
  return (
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
            <span className="text-muted-foreground text-sm">Data Balance (GB)</span>
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
  );
};

export default WalletBalance;
