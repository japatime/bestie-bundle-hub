
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import MobileNav from "@/components/layout/MobileNav";
import { useLocation } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import WalletBalance from "@/components/wallet/WalletBalance";
import WalletTabs from "@/components/wallet/WalletTabs";
import RecentTransactions from "@/components/wallet/RecentTransactions";
import PaymentDialog from "@/components/wallet/PaymentDialog";
import { useWallet } from "@/hooks/useWallet";

const Wallet = () => {
  const location = useLocation();
  const { recentTransactions } = useWallet();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [amount, setAmount] = useState("");
  
  const handlePaymentInitiation = (url: string) => {
    setPaymentUrl(url);
    setShowPaymentDialog(true);
  };

  return (
    <>
      <MobileNav activePath={location.pathname} />
      <MainLayout>
        <div className="pt-16 md:pt-0">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Wallet</h2>
            <p className="text-muted-foreground">Manage your funds and view transaction history</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Balance Overview</CardTitle>
                <CardDescription>
                  Your current wallet balances
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WalletBalance />

                <WalletTabs onSuccessfulPaymentInit={(url) => {
                  handlePaymentInitiation(url);
                  // For the payment dialog to show the correct amount
                  const inputElement = document.getElementById("amount") as HTMLInputElement;
                  if (inputElement) {
                    setAmount(inputElement.value);
                  }
                }} />
              </CardContent>
            </Card>

            <RecentTransactions transactions={recentTransactions} />
          </div>
        </div>
      </MainLayout>

      <PaymentDialog 
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        amount={amount}
        paymentUrl={paymentUrl}
      />
    </>
  );
};

export default Wallet;
