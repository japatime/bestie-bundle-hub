
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import MobileNav from "@/components/layout/MobileNav";
import { Link, useLocation } from "react-router-dom";
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
import { Loader, Phone, Check, X, Wifi, ExternalLink, RefreshCw } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface DataPlan {
  network_operator: string;
  plan_summary: string;
  package_code: string;
  plan_id: number;
  validity: string;
  regular_price: number;
}

const Data = () => {
  const location = useLocation();
  const { toast } = useToast();
  const { walletBalance, purchaseData: purchaseDataFromWallet } = useWallet();
  
  const [network, setNetwork] = useState("mtn");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [useWalletBalance, setUseWalletBalance] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<DataPlan | null>(null);
  const [processType, setProcessType] = useState<'instant' | 'queue'>('instant');
  const [customerReference, setCustomerReference] = useState("");
  
  // Fetch data plans
  const { data: dataPlans, isLoading: loadingPlans, refetch } = useQuery({
    queryKey: ["dataPlans", network],
    queryFn: () => getDataPlans(network),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter plans for the current network
  const filteredPlans = React.useMemo(() => {
    if (!dataPlans?.data) return [];
    
    return dataPlans.data.filter((plan: DataPlan) => 
      plan.network_operator === network
    );
  }, [dataPlans, network]);

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
        // Use local wallet balance for purchase (demo)
        const success = await purchaseDataFromWallet(
          network, 
          phoneNumber, 
          selectedPlan.package_code, 
          selectedPlan.regular_price
        );
        
        if (success) {
          toast({
            title: "Purchase Successful",
            description: `${selectedPlan.plan_summary} data purchase for ${phoneNumber} completed.`,
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
        let response;
        
        if (processType === 'instant') {
          // Use vend data from wallet with instant processing
          response = await vendDataFromWallet(
            phoneNumber, 
            selectedPlan.package_code,
            'instant',
            undefined,
            customerReference || undefined
          );
        } else {
          // Use standard data purchase
          response = await purchaseData(
            phoneNumber, 
            selectedPlan.package_code,
            selectedPlan.regular_price.toString(),
            undefined,
            customerReference || undefined
          );
        }
        
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
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Buy Data</h2>
                <p className="text-muted-foreground">Purchase data for any phone number</p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/data-plans">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View All Plans
                </Link>
              </Button>
            </div>
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
                    <div className="flex items-center justify-between">
                      <Label>Select Data Plan</Label>
                      <Button variant="ghost" size="sm" onClick={() => refetch()} disabled={loadingPlans}>
                        <RefreshCw className={`h-4 w-4 ${loadingPlans ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
                    <Select 
                      onValueChange={(value) => {
                        const plan = filteredPlans.find((p: DataPlan) => p.package_code === value);
                        setSelectedPlan(plan || null);
                      }}
                      value={selectedPlan?.package_code}
                      disabled={loadingPlans || filteredPlans.length === 0}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={loadingPlans ? "Loading plans..." : "Select a data plan"} />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredPlans.map((plan: DataPlan) => (
                          <SelectItem key={plan.package_code} value={plan.package_code}>
                            {plan.plan_summary} - ₦{plan.regular_price.toLocaleString()}
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

                  {/* Processing Type - Only show when not using wallet balance */}
                  {!useWalletBalance && (
                    <div className="space-y-2 pt-2 border-t">
                      <Label>Processing Type</Label>
                      <RadioGroup 
                        defaultValue="instant"
                        value={processType}
                        onValueChange={(value) => setProcessType(value as 'instant' | 'queue')}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="instant" id="instant" />
                          <Label htmlFor="instant">Instant (Receive immediate status)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="queue" id="queue" />
                          <Label htmlFor="queue">Queue (Faster request processing)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {/* Customer Reference - Only show when not using wallet balance */}
                  {!useWalletBalance && (
                    <div className="space-y-2">
                      <Label htmlFor="reference">Customer Reference (Optional)</Label>
                      <Input 
                        id="reference" 
                        placeholder="Enter a unique reference" 
                        value={customerReference} 
                        onChange={(e) => setCustomerReference(e.target.value)} 
                      />
                      <p className="text-xs text-muted-foreground">
                        A unique identifier to help you track this purchase
                      </p>
                    </div>
                  )}

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
                  <span className="font-medium">{selectedPlan?.plan_summary || "---"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">
                    {selectedPlan ? `₦${selectedPlan.regular_price.toLocaleString()}` : "---"}
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
                {!useWalletBalance && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Processing</span>
                    <span className="font-medium">
                      {processType === 'instant' ? 'Instant' : 'Queue'}
                    </span>
                  </div>
                )}
                <div className="pt-4 border-t">
                  <div className="flex justify-between text-lg">
                    <span>Total</span>
                    <span className="font-bold">
                      {selectedPlan ? `₦${selectedPlan.regular_price.toLocaleString()}` : "---"}
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
