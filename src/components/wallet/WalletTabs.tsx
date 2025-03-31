
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import FundWalletForm from "./FundWalletForm";
import ComingSoonTab from "./ComingSoonTab";

interface WalletTabsProps {
  onSuccessfulPaymentInit: (url: string) => void;
}

const WalletTabs = ({ onSuccessfulPaymentInit }: WalletTabsProps) => {
  return (
    <div className="mt-8">
      <Tabs defaultValue="fund">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="fund">Fund Wallet</TabsTrigger>
          <TabsTrigger value="transfer">Transfer</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
        </TabsList>
        
        <TabsContent value="fund" className="space-y-4 pt-4">
          <FundWalletForm onSuccessfulInitiation={onSuccessfulPaymentInit} />
        </TabsContent>
        
        <TabsContent value="transfer" className="pt-4">
          <ComingSoonTab 
            icon={ArrowUpCircle} 
            title="Transfer Funds" 
            description="Coming soon! This feature will allow you to transfer funds to other users." 
          />
        </TabsContent>
        
        <TabsContent value="withdraw" className="pt-4">
          <ComingSoonTab 
            icon={ArrowDownCircle} 
            title="Withdraw Funds" 
            description="Coming soon! This feature will allow you to withdraw your funds to your bank account." 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WalletTabs;
