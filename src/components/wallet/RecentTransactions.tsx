
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

interface Transaction {
  id: number;
  type: string;
  amount: number;
  date: string;
  status: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
  return (
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
          {transactions.map(transaction => (
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
  );
};

export default RecentTransactions;
