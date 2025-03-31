
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { initializeTransaction, generateReference } from "@/lib/paystack";

interface FundWalletFormProps {
  onSuccessfulInitiation: (url: string) => void;
}

const FundWalletForm = ({ onSuccessfulInitiation }: FundWalletFormProps) => {
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("user@example.com");
  const [isProcessing, setIsProcessing] = useState(false);

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
        onSuccessfulInitiation(response.data.authorization_url);
        
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

  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default FundWalletForm;
