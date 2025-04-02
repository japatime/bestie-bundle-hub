
import React, { useEffect, useState } from "react";
import { getTransactions } from "@/lib/services/transaction";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  status: string;
  reference: string;
  created_at?: string;
}

const RecentAirtimeTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadTransactions = async () => {
      setIsLoading(true);
      try {
        const allTransactions = await getTransactions();
        // Filter to only show airtime transactions
        const airtimeTransactions = allTransactions.filter(tx => 
          tx.type === "airtime_purchase" && tx.status === "completed"
        );
        setTransactions(airtimeTransactions.slice(0, 10)); // Show last 10 transactions
      } catch (error) {
        console.error("Error loading transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTransactions();
  }, []);
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown date";
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return "Invalid date";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No recent airtime purchases found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <Card key={transaction.id} className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(transaction.created_at)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-destructive">-₦{transaction.amount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{transaction.status}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RecentAirtimeTransactions;
