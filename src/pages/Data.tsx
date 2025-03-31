
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getDataPlans, purchaseData, vendDataFromWallet } from "@/lib/services";
import { Loader, Phone, Check, X, Wifi } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataPlan {
  id: number;
  name: string;
  code: string;
  price: number;
  validity: string;
}

const Data = () => {
  const location = useLocation();
  const { toast } = useToast();
  const { walletBalance, purchaseData: purchaseDataFromWallet } = useWallet();
  
  const [network, setNetwork] = useState("mtn");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [useWalletBalance, setUseWalletBalance] = useState(true);
  const [dataPlans, setDataPlans] = useState<DataPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<DataPlan | null>(null);
  const [loadingPlans, setLoadingPlans] = useState(false);
  
  // Fetch data plans when network changes
  useEffect(() => {
    const fetchDataPlans = async () => {
      setLoadingPlans(true);
      try {
        // In a real implementation, this would fetch from the API
        // For now, we'll mock some data plans
        const mockPlans = [
          { id: 1, name: "1GB - 30 Days", code: `${network}_sme_1gb`, price: 300, validity: "30 days" },
          { id: 2, name: "2GB - 30 Days", code: `${network}_sme_2gb`, price: 600, validity: "30 days" },
          { id: 3, name: "5GB - 30 Days", code: `${network}_sme_5gb`, price: 1500, validity: "30 days" },
          { id: 4, name: "10GB - 30 Days", code: `${network}_sme_10gb`, price: 2500, validity: "30 days" }
        ];
        
        setDataPlans(mockPlans);
        setSelectedPlan(null);
      } catch (error) {
        console.error("Error fetching data plans:", error);
        toast({
          title: "Error",
          description: "Failed to fetch data plans. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoadingPlans(false);
      }
    };
    
    fetchDataPlans();
  }, [network, toast]);

  const handleBuyData = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive",
      });
      return;
    }

    if (!selectedPlan) {
      toast({
        title: "Error",
        description: "Please select a data plan",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      if (useWalletBalance) {
        // Use wallet balance for purchase
        const success = await purchaseDataFromWallet(
          network, 
          phoneNumber, 
          selectedPlan.code, 
          selectedPlan.price
        );
        
        if (success) {
          toast({
            title: "Purchase Successful",
            description: `${selectedPlan.name} data purchase for ${phoneNumber} completed.`,
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
        const response = await purchaseData(
          phoneNumber, 
          selectedPlan.code,
          selectedPlan.price.toString()
        );
        
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
      console.error("Error purchasing data:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
            <h2 className="text-2xl font-semibold">Buy Data</h2>
            <p className="text-muted-foreground">Purchase data for any phone number</p>
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
                <CardTitle>Data Purchase</CardTitle>
                <CardDescription>
                  Buy data for yourself or someone else
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

                  {/* Data Plan Selection */}
                  <div className="space-y-2">
                    <Label>Select Data Plan</Label>
                    <Select 
                      onValueChange={(value) => {
                        const plan = dataPlans.find(p => p.id === parseInt(value));
                        setSelectedPlan(plan || null);
                      }}
                      value={selectedPlan?.id.toString()}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={loadingPlans ? "Loading plans..." : "Select a data plan"} />
                      </SelectTrigger>
                      <SelectContent>
                        {dataPlans.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id.toString()}>
                            {plan.name} - ₦{plan.price.toLocaleString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    onClick={handleBuyData} 
                    disabled={loading || !selectedPlan}
                  >
                    {loading ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Buy Data</>
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
                  <span className="text-muted-foreground">Data Plan</span>
                  <span className="font-medium">{selectedPlan?.name || "---"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">
                    {selectedPlan ? `₦${selectedPlan.price.toLocaleString()}` : "---"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Validity</span>
                  <span className="font-medium">{selectedPlan?.validity || "---"}</span>
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
                    <span className="font-bold">
                      {selectedPlan ? `₦${selectedPlan.price.toLocaleString()}` : "---"}
                    </span>
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

export default Data;
