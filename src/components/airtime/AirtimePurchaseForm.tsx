
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { usePurchase, PlanDetails } from "@/hooks/usePurchase";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  phone: z.string().min(11).max(11),
  network: z.string().min(1),
  amount: z.coerce.number().min(1), // Using coerce.number() to ensure type conversion
});

type FormValues = z.infer<typeof formSchema>;

const AirtimePurchaseForm = () => {
  const { balance, isLoading: isBalanceLoading } = useWalletBalance();
  const { purchaseAirtimeOrData, isLoading: isPurchasing } = usePurchase();
  const [transactionResult, setTransactionResult] = useState<{ success: boolean; message: string } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      network: "MTN",
      amount: 0, // Changed from "" to 0 to match the number type
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setTransactionResult(null);
    
    const planDetails: PlanDetails = {
      name: `${values.network} Airtime ₦${values.amount}`,
      cost: values.amount,
      type: "airtime",
      network: values.network,
      phone: values.phone,
    };

    const result = await purchaseAirtimeOrData(planDetails);
    
    setTransactionResult({
      success: result.success,
      message: result.success 
        ? `Successfully purchased ${values.network} airtime of ₦${values.amount} for ${values.phone}` 
        : `Failed to purchase airtime: ${result.error}`
    });
    
    if (result.success) {
      form.reset();
    }
  };

  const walletBalance = balance?.universal_wallet?.balance || 0;
  const isDisabled = isBalanceLoading || isPurchasing || walletBalance <= 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Purchase Airtime</h3>
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
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount (₦)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="50" 
                    placeholder="Enter amount" 
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isDisabled}
          >
            {isPurchasing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Purchase Airtime"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AirtimePurchaseForm;
