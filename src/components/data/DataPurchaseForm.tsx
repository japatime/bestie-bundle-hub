
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { usePurchase, PlanDetails } from "@/hooks/usePurchase";
import { getDataPlans } from "@/lib/services/data";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface DataPlan {
  id: string;
  name: string;
  price: number;
  validity: string;
  network: string;
  package_code: string;
}

const formSchema = z.object({
  phone: z.string().min(11).max(11),
  network: z.string().min(1),
  plan: z.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;

const DataPurchaseForm = () => {
  const { balance, isLoading: isBalanceLoading } = useWalletBalance();
  const { purchaseAirtimeOrData, isLoading: isPurchasing } = usePurchase();
  const [transactionResult, setTransactionResult] = useState<{ success: boolean; message: string } | null>(null);
  const [dataPlans, setDataPlans] = useState<DataPlan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<DataPlan | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      network: "MTN",
      plan: "",
    },
  });

  const watchNetwork = form.watch("network");
  const watchPlan = form.watch("plan");
  
  // Fetch data plans when network changes
  useEffect(() => {
    const fetchPlans = async () => {
      if (!watchNetwork) return;
      
      setIsLoadingPlans(true);
      try {
        const response = await getDataPlans(watchNetwork);
        if (response.success && response.data) {
          setDataPlans(response.data);
        } else {
          // Fallback to mock data if API fails
          setDataPlans([
            { id: "1", name: "1GB Data", price: 500, validity: "30 days", network: watchNetwork, package_code: `${watchNetwork}-1GB` },
            { id: "2", name: "2GB Data", price: 950, validity: "30 days", network: watchNetwork, package_code: `${watchNetwork}-2GB` },
            { id: "3", name: "5GB Data", price: 2000, validity: "30 days", network: watchNetwork, package_code: `${watchNetwork}-5GB` },
          ]);
        }
      } catch (error) {
        console.error("Error fetching data plans:", error);
        // Fallback to mock data
        setDataPlans([
          { id: "1", name: "1GB Data", price: 500, validity: "30 days", network: watchNetwork, package_code: `${watchNetwork}-1GB` },
          { id: "2", name: "2GB Data", price: 950, validity: "30 days", network: watchNetwork, package_code: `${watchNetwork}-2GB` },
          { id: "3", name: "5GB Data", price: 2000, validity: "30 days", network: watchNetwork, package_code: `${watchNetwork}-5GB` },
        ]);
      } finally {
        setIsLoadingPlans(false);
      }
    };

    fetchPlans();
    form.setValue("plan", ""); // Reset plan when network changes
  }, [watchNetwork, form]);
  
  // Update selected plan when plan changes
  useEffect(() => {
    if (watchPlan && dataPlans.length > 0) {
      const plan = dataPlans.find(p => p.id === watchPlan);
      setSelectedPlan(plan || null);
    } else {
      setSelectedPlan(null);
    }
  }, [watchPlan, dataPlans]);

  const handleSubmit = async (values: FormValues) => {
    if (!selectedPlan) return;
    
    setTransactionResult(null);
    
    const planDetails: PlanDetails = {
      name: selectedPlan.name,
      cost: selectedPlan.price,
      type: "data",
      network: values.network,
      phone: values.phone,
      package_code: selectedPlan.package_code,
    };

    const result = await purchaseAirtimeOrData(planDetails);
    
    setTransactionResult({
      success: result.success,
      message: result.success 
        ? `Successfully purchased ${selectedPlan.name} for ${values.phone}` 
        : `Failed to purchase data plan: ${result.error}`
    });
    
    if (result.success) {
      form.reset();
    }
  };

  const walletBalance = balance?.universal_wallet?.balance || 0;
  const isDisabled = isBalanceLoading || isPurchasing || isLoadingPlans || walletBalance <= 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Purchase Data</h3>
        <div className="text-sm">
          Wallet Balance: <span className="font-medium">₦{walletBalance.toLocaleString()}</span>
        </div>
      </div>
      
      {transactionResult && (
        <Alert variant={transactionResult.success ? "default" : "destructive"}>
          <AlertDescription>{transactionResult.message}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="network"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Network Provider</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select network" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MTN">MTN</SelectItem>
                    <SelectItem value="AIRTEL">Airtel</SelectItem>
                    <SelectItem value="GLO">Glo</SelectItem>
                    <SelectItem value="9MOBILE">9Mobile</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="plan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data Plan</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoadingPlans}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingPlans ? "Loading plans..." : "Select data plan"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dataPlans.map(plan => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name} - ₦{plan.price} ({plan.validity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedPlan && (
            <div className="px-4 py-3 rounded-md bg-secondary">
              <p className="font-medium">{selectedPlan.name}</p>
              <div className="text-sm text-muted-foreground mt-1">
                <p>Price: ₦{selectedPlan.price}</p>
                <p>Validity: {selectedPlan.validity}</p>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isDisabled || !selectedPlan}
          >
            {isPurchasing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Purchase Data"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default DataPurchaseForm;
