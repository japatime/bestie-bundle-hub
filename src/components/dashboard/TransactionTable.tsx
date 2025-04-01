
import React from "react";

export interface Transaction {
  id: string;
  date: string;
  type: string;
  amount: string;
  status: "Completed" | "Pending" | "Failed";
}

interface TransactionTableProps {
  transactions: Transaction[];
}

const TransactionTable = ({ transactions }: TransactionTableProps) => {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 text-xs px-2 py-1 rounded";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded";
      case "Failed":
        return "bg-red-100 text-red-800 text-xs px-2 py-1 rounded";
      default:
        return "text-xs px-2 py-1 rounded";
    }
  };

  return (
    <div className="w-full overflow-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-muted-foreground uppercase bg-secondary/50">
          <tr>
            <th scope="col" className="px-4 py-3">Date</th>
            <th scope="col" className="px-4 py-3">Type</th>
            <th scope="col" className="px-4 py-3">Amount</th>
            <th scope="col" className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3">{transaction.date}</td>
              <td className="px-4 py-3">{transaction.type}</td>
              <td className="px-4 py-3">{transaction.amount}</td>
              <td className="px-4 py-3">
                <span className={getStatusBadgeClass(transaction.status)}>
                  {transaction.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
