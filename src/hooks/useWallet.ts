
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
  purchaseAirtime: (network: string, phoneNumber: string, amount: number) => Promise<boolean>;
  purchaseData: (network: string, phoneNumber: string, packageCode: string, amount: number) => Promise<boolean>;
  addTransaction: (type: string, amount: number) => void;
}

export const useWallet = (): UseWalletReturn => {
  // In a real app, this would fetch data from an API
  const [walletBalance, setWalletBalance] = useState<WalletBalanceData>({
    naira: mockWalletData.naira,
    data: mockWalletData.data,
    sms: mockWalletData.sms
  });
  
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(mockWalletData.transactions);

  // Add a new transaction to the list
  const addTransaction = (type: string, amount: number) => {
    const newTransaction = {
      id: Date.now(),
      type,
      amount,
      date: new Date().toISOString().split('T')[0],
      status: "Completed"
    };

    setRecentTransactions(prevTransactions => 
      [newTransaction, ...prevTransactions]
    );

    // Update wallet balance based on transaction type
    setWalletBalance(prevBalance => {
      if (type.includes("Airtime") || type.includes("Data")) {
        // Deduct from naira balance for purchases
        return {
          ...prevBalance,
          naira: prevBalance.naira - Math.abs(amount)
        };
      } else if (type === "Deposit") {
        // Add to naira balance for deposits
        return {
          ...prevBalance,
          naira: prevBalance.naira + amount
        };
      }
      return prevBalance;
    });
  };

  // Purchase airtime from wallet balance
  const purchaseAirtime = async (
    network: string, 
    phoneNumber: string, 
    amount: number
  ): Promise<boolean> => {
    // Check if wallet has enough balance
    if (walletBalance.naira < amount) {
      return false;
    }

    // In a real app, this would call the actual API
    // For demo, we'll simulate success and update the local state
    addTransaction("Airtime Purchase", -amount);
    return true;
  };

  // Purchase data from wallet balance
  const purchaseData = async (
    network: string, 
    phoneNumber: string, 
    packageCode: string, 
    amount: number
  ): Promise<boolean> => {
    // Check if wallet has enough balance
    if (walletBalance.naira < amount) {
      return false;
    }

    // In a real app, this would call the actual API
    // For demo, we'll simulate success and update the local state
    addTransaction("Data Purchase", -amount);
    return true;
  };

  return {
    walletBalance,
    recentTransactions,
    purchaseAirtime,
    purchaseData,
    addTransaction
  };
};
