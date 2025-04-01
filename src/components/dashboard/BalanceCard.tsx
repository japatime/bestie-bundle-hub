
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface BalanceCardProps {
  balance: number;
  dataBalances: {
    mtn: number;
    airtel: number;
    glo: number;
    mobile9: number;
  };
}

const BalanceCard = ({ balance, dataBalances }: BalanceCardProps) => {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <span className="text-sm text-muted-foreground">Wallet Balance</span>
            <div className="text-2xl font-semibold">₦{balance.toLocaleString()}</div>
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
