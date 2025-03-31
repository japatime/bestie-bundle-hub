
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { purchaseAirtime } from "@/lib/services";
import { Loader, Phone, Check, X } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Airtime = () => {
  const location = useLocation();
  const { toast } = useToast();
  const { walletBalance, purchaseAirtime: purchaseAirtimeFromWallet } = useWallet();
  
  const [network, setNetwork] = useState("mtn");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState(500);
  const [useMaxAmount, setUseMaxAmount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [useWalletBalance, setUseWalletBalance] = useState(true);
  
  const maxAmount = 50000;
  
  const handleBuyAirtime = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive",
      });
      return;
    }

    if (phoneNumber.length < 10 || phoneNumber.length > 11) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      if (useWalletBalance) {
        // Use wallet balance for purchase
        const success = await purchaseAirtimeFromWallet(network, phoneNumber, amount);
        
        if (success) {
          toast({
            title: "Purchase Successful",
            description: `Airtime purchase of ₦${amount.toLocaleString()} for ${phoneNumber} completed.`,
          });
        } else {
          toast({
            title: "Purchase Failed",
            description: "Insufficient wallet balance or service unavailable.",
            variant: "destructive",
          });
        }
      } else {
        // Use direct API purchase
        const response = await purchaseAirtime(network, phoneNumber, amount);
        
        if (response.success) {
          toast({
            title: "Purchase Successful",
            description: response.message,
          });
        } else {
          toast({
            title: "Purchase Failed",
            description: response.message,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error purchasing airtime:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSliderChange = (value: number[]) => {
    setAmount(value[0]);
  };

  const networks = [
    { id: "mtn", name: "MTN", color: "bg-yellow-400" },
    { id: "airtel", name: "Airtel", color: "bg-red-500" },
    { id: "glo", name: "Glo", color: "bg-green-500" },
    { id: "9mobile", name: "9mobile", color: "bg-green-300" },
  ];

  return (
    <>
      <MobileNav activePath={location.pathname} />
      <MainLayout>
        <div className="pt-16 md:pt-0">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Buy Airtime</h2>
            <p className="text-muted-foreground">Purchase airtime for any phone number</p>
          </div>

          {useWalletBalance && (
            <Alert className="mb-6">
              <AlertTitle>Using Wallet Balance</AlertTitle>
              <AlertDescription>
                Available balance: <strong>₦{walletBalance.naira.toLocaleString()}</strong>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Airtime Purchase</CardTitle>
                <CardDescription>
                  Buy airtime for yourself or someone else
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Network Selection */}
                  <div className="space-y-2">
                    <Label>Select Network</Label>
                    <Tabs defaultValue="mtn" onValueChange={setNetwork} className="w-full">
                      <TabsList className="grid grid-cols-4 w-full">
                        {networks.map(network => (
                          <TabsTrigger key={network.id} value={network.id} className="flex items-center justify-center">
                            <div className={`h-4 w-4 rounded-full ${network.color} mr-2`}></div>
                            <span>{network.name}</span>
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex">
                      <div className="bg-muted text-muted-foreground px-3 flex items-center rounded-l-md border border-r-0">
                        <Phone size={16} />
                      </div>
                      <Input 
                        id="phone" 
                        placeholder="Enter phone number" 
                        value={phoneNumber} 
                        onChange={(e) => setPhoneNumber(e.target.value)} 
                        className="rounded-l-none"
                      />
                    </div>
                  </div>

                  {/* Amount Selection */}
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label>Amount (₦)</Label>
                      <span className="text-sm font-medium">₦{amount.toLocaleString()}</span>
                    </div>
                    <Slider 
                      min={50} 
                      max={maxAmount} 
                      step={50} 
                      value={[amount]}
                      onValueChange={handleSliderChange}
                      disabled={useMaxAmount}
                    />
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="max-amount" 
                        checked={useMaxAmount}
                        onCheckedChange={(checked) => {
                          setUseMaxAmount(checked);
                          if (checked) setAmount(maxAmount);
                        }}
                      />
                      <Label htmlFor="max-amount">Use maximum amount (₦{maxAmount.toLocaleString()})</Label>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-2 pt-2 border-t">
                    <Label>Payment Method</Label>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="use-wallet" 
                        checked={useWalletBalance}
                        onCheckedChange={setUseWalletBalance}
                      />
                      <Label htmlFor="use-wallet">
                        Use wallet balance 
                        {useWalletBalance && 
                          <span className="ml-2 text-sm text-muted-foreground">
                            (₦{walletBalance.naira.toLocaleString()} available)
                          </span>
                        }
                      </Label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    className="w-full" 
                    onClick={handleBuyAirtime} 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Buy Airtime</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Purchase Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network</span>
                  <span className="font-medium">
                    {networks.find(n => n.id === network)?.name || network}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone Number</span>
                  <span className="font-medium">{phoneNumber || "---"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">₦{amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fee</span>
                  <span className="font-medium">₦0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium flex items-center">
                    {useWalletBalance ? (
                      <>
                        <Check size={16} className="text-green-500 mr-1" />
                        Wallet Balance
                      </>
                    ) : (
                      <>
                        <X size={16} className="text-red-500 mr-1" />
                        API Direct
                      </>
                    )}
                  </span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between text-lg">
                    <span>Total</span>
                    <span className="font-bold">₦{amount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default Airtime;
