
import React, { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  PlusCircle, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  History,
  CreditCard,
  AlertCircle
} from "lucide-react";
import { initializeTransaction, generateReference } from "@/lib/paystack";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

const Wallet = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("user@example.com"); // In a real app, this would come from auth
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  
  const walletBalance = {
    naira: 25000,
    data: {
      mtn: 10.5,
      airtel: 5.2,
      glo: 2.0,
      mobile9: 0
    },
    sms: 120
  };

  const recentTransactions = [
    { id: 1, type: "Deposit", amount: 5000, date: "2023-07-15", status: "Completed" },
    { id: 2, type: "Airtime Purchase", amount: -1000, date: "2023-07-14", status: "Completed" },
    { id: 3, type: "Data Purchase", amount: -2500, date: "2023-07-12", status: "Completed" },
    { id: 4, type: "Deposit", amount: 10000, date: "2023-07-10", status: "Completed" },
  ];

  const handleFundWallet = async () => {
    if (!amount || Number(amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const reference = generateReference();
      const response = await initializeTransaction(email, Number(amount), reference);
      
      if (response.status) {
        setPaymentUrl(response.data.authorization_url);
        setShowPaymentDialog(true);
        
        toast({
          title: "Processing",
          description: `Wallet funding of ₦${Number(amount).toLocaleString()} initiated.`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to initiate payment. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast({
        title: "Error",
        description: "An error occurred while processing your request.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenPaymentInNewWindow = () => {
    if (paymentUrl) {
      window.open(paymentUrl, "_blank");
      setShowPaymentDialog(false);
      setAmount("");
    }
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="bg-primary/5">
                    <CardContent className="p-4">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">Naira Balance</span>
                        <span className="text-2xl font-bold">₦{walletBalance.naira.toLocaleString()}</span>
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
                            <span className="font-medium">{walletBalance.data.mtn}GB</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Airtel:</span>
                            <span className="font-medium">{walletBalance.data.airtel}GB</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Glo:</span>
                            <span className="font-medium">{walletBalance.data.glo}GB</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-blue-500/5">
                    <CardContent className="p-4">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">SMS Balance</span>
                        <span className="text-2xl font-bold">{walletBalance.sms}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-8">
                  <Tabs defaultValue="fund">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="fund">Fund Wallet</TabsTrigger>
                      <TabsTrigger value="transfer">Transfer</TabsTrigger>
                      <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
                    </TabsList>
                    <TabsContent value="fund" className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount (₦)</Label>
                        <Input
                          id="amount"
                          placeholder="Enter amount"
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          placeholder="Your email address"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <Button 
                        onClick={handleFundWallet} 
                        className="w-full"
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>Processing...</>
                        ) : (
                          <>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Fund Wallet
                          </>
                        )}
                      </Button>
                    </TabsContent>
                    
                    <TabsContent value="transfer" className="pt-4">
                      <div className="p-8 text-center">
                        <ArrowUpCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-2 text-lg font-medium">Transfer Funds</h3>
                        <p className="text-sm text-muted-foreground">
                          Coming soon! This feature will allow you to transfer funds to other users.
                        </p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="withdraw" className="pt-4">
                      <div className="p-8 text-center">
                        <ArrowDownCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-2 text-lg font-medium">Withdraw Funds</h3>
                        <p className="text-sm text-muted-foreground">
                          Coming soon! This feature will allow you to withdraw your funds to your bank account.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your latest activities</CardDescription>
                </div>
                <History size={20} className="text-muted-foreground" />
              </CardHeader>
              <CardContent className="px-0">
                <div className="space-y-0">
                  {recentTransactions.map(transaction => (
                    <div 
                      key={transaction.id} 
                      className="flex items-center justify-between p-4 border-b last:border-0"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{transaction.type}</p>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                      <div className={`font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount > 0 ? '+' : ''}₦{transaction.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="py-4 px-4">
                  <Button variant="outline" className="w-full">
                    View All Transactions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Your Payment</DialogTitle>
            <DialogDescription>
              You'll be redirected to Paystack's secure payment page to complete your wallet funding.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center justify-center p-4 bg-gray-50 rounded-md">
            <CreditCard className="h-16 w-16 text-primary" />
          </div>
          
          <div className="text-center my-2">
            <p className="font-medium">Amount: ₦{Number(amount).toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Reference: {generateReference()}</p>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row sm:justify-between">
            <Button 
              variant="outline" 
              onClick={() => setShowPaymentDialog(false)}
              className="mb-2 sm:mb-0"
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleOpenPaymentInNewWindow}>
              <CreditCard className="mr-2 h-4 w-4" />
              Proceed to Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Wallet;
