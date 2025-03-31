
import { useState } from "react";

// Mock wallet data - in a real application, this would come from an API or database
const mockWalletData = {
  naira: 25000,
  data: {
    mtn: 10.5,
    airtel: 5.2,
    glo: 2.0,
    mobile9: 0
  },
  sms: 120,
  transactions: [
    { id: 1, type: "Deposit", amount: 5000, date: "2023-07-15", status: "Completed" },
    { id: 2, type: "Airtime Purchase", amount: -1000, date: "2023-07-14", status: "Completed" },
    { id: 3, type: "Data Purchase", amount: -2500, date: "2023-07-12", status: "Completed" },
    { id: 4, type: "Deposit", amount: 10000, date: "2023-07-10", status: "Completed" },
  ]
};

export interface WalletBalanceData {
  naira: number;
  data: {
    mtn: number;
    airtel: number;
    glo: number;
    mobile9: number;
  };
  sms: number;
}

export interface Transaction {
  id: number;
  type: string;
  amount: number;
  date: string;
  status: string;
}

interface UseWalletReturn {
  walletBalance: WalletBalanceData;
  recentTransactions: Transaction[];
}

export const useWallet = (): UseWalletReturn => {
  // In a real app, this would fetch data from an API
  const [walletBalance] = useState<WalletBalanceData>({
    naira: mockWalletData.naira,
    data: mockWalletData.data,
    sms: mockWalletData.sms
  });
  
  const [recentTransactions] = useState<Transaction[]>(mockWalletData.transactions);

  return {
    walletBalance,
    recentTransactions
  };
};
