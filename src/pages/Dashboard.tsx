
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import BalanceCard from "@/components/dashboard/BalanceCard";
import QuickActionButton from "@/components/dashboard/QuickActionButton";
import TransactionTable from "@/components/dashboard/TransactionTable";
import MobileNav from "@/components/layout/MobileNav";
import { useLocation } from "react-router-dom";
import { 
  Phone, 
  Database, 
  Zap, 
  Tv, 
  Users, 
  Wallet,
  ArrowUp 
} from "lucide-react";

const Dashboard = () => {
  const location = useLocation();

  // Sample data
  const balances = [
    { title: "NGN Balance", value: "₦250,000.00", color: "bg-purple-100" },
    { title: "SMS Balance", value: "5,000 Units", color: "bg-orange-100" },
    { title: "MTN Data", value: "50 GB", color: "bg-yellow-100" },
    { title: "Airtel Data", value: "25 GB", color: "bg-red-100" },
  ];

  const quickActions = [
    { title: "Buy Airtime", icon: <Phone size={24} className="text-primary" />, to: "/airtime", bgColor: "bg-purple-100" },
    { title: "Buy Data", icon: <Database size={24} className="text-primary" />, to: "/data-plans", bgColor: "bg-blue-100" },
    { title: "Pay Bills", icon: <Zap size={24} className="text-primary" />, to: "/electricity", bgColor: "bg-amber-100" },
    { title: "Top Up", icon: <ArrowUp size={24} className="text-primary" />, to: "/wallet", bgColor: "bg-green-100" },
  ];

  const transactions = [
    { id: "1", date: "Jan 15, 2023", type: "Airtime Purchase", amount: "₦5,000", status: "Completed" as const },
    { id: "2", date: "Jan 15, 2023", type: "Data Bundle", amount: "₦10,000", status: "Completed" as const },
    { id: "3", date: "Jan 14, 2023", type: "Electricity Bill", amount: "₦15,000", status: "Pending" as const },
    { id: "4", date: "Jan 14, 2023", type: "TV Subscription", amount: "₦8,000", status: "Failed" as const },
  ];

  return (
    <>
      <MobileNav activePath={location.pathname} />
      <MainLayout>
        <div className="pt-16 md:pt-0">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Welcome back, John!</h2>
            <p className="text-muted-foreground">Here's what's happening with your account today.</p>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {balances.map((balance) => (
              <BalanceCard
                key={balance.title}
                title={balance.title}
                value={balance.value}
                color={balance.color}
              />
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="font-medium mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <QuickActionButton
                  key={action.title}
                  title={action.title}
                  icon={action.icon}
                  to={action.to}
                  bgColor={action.bgColor}
                />
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Recent Transactions</h3>
              <a href="#" className="text-sm text-primary hover:underline">
                View All
              </a>
            </div>
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <TransactionTable transactions={transactions} />
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default Dashboard;
