
import React from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, AlertCircle } from "lucide-react";
import { generateReference } from "@/lib/paystack";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: string;
  paymentUrl: string;
}

const PaymentDialog = ({ open, onOpenChange, amount, paymentUrl }: PaymentDialogProps) => {
  const handleOpenPaymentInNewWindow = () => {
    if (paymentUrl) {
      window.open(paymentUrl, "_blank");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onClick={() => onOpenChange(false)}
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
  );
};

export default PaymentDialog;
