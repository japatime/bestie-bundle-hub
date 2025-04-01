
import React from "react";
import { useNavigate } from "react-router-dom";
import MobileNav from "@/components/layout/MobileNav";
import MainLayout from "@/components/layout/MainLayout";
import BalanceCard from "@/components/dashboard/BalanceCard";
import QuickActionButton from "@/components/dashboard/QuickActionButton";
import QuickActionLink from "@/components/dashboard/QuickActionLink";
import TransactionTable from "@/components/dashboard/TransactionTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, Phone, FileText, PlusCircle, Wallet } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";

const Dashboard = () => {
  const navigate = useNavigate();
  const { recentTransactions } = useWallet();

  // Format transactions for the TransactionTable component
  const formattedTransactions = recentTransactions.slice(0, 5).map(transaction => ({
    id: transaction.id.toString(),
    date: transaction.date,
    type: transaction.type,
    amount: transaction.amount > 0 ? `+₦${transaction.amount.toLocaleString()}` : `-₦${Math.abs(transaction.amount).toLocaleString()}`,
    status: transaction.status as "Completed" | "Pending" | "Failed"
  }));

  return (
    <>
      <MobileNav activePath="/" />
      <MainLayout>
        <div className="pt-16 md:pt-0">
          {/* Balance and Quick Fund */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2">
              <BalanceCard />
            </div>
            <QuickActionButton
              title="Fund Wallet"
              icon={<PlusCircle className="h-6 w-6" />}
              description="Add money to your wallet"
              onClick={() => navigate("/wallet")}
            />
          </div>

          {/* Quick Actions */}
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <QuickActionLink
              to="/airtime"
              icon={<Phone className="h-5 w-5" />}
              title="Buy Airtime"
              description="Purchase airtime for any network"
            />
            <QuickActionLink
              to="/data"
              icon={<Wifi className="h-5 w-5" />}
              title="Buy Data"
              description="Purchase data for any network"
            />
            <QuickActionLink
              to="/data-plans"
              icon={<FileText className="h-5 w-5" />}
              title="Data Plans"
              description="View all available data plans"
            />
            <QuickActionLink
              to="/wallet"
              icon={<Wallet className="h-5 w-5" />}
              title="Wallet"
              description="View and manage your wallet"
            />
          </div>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your recent transactions for the past 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionTable transactions={formattedTransactions} />
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </>
  );
};

export default Dashboard;
