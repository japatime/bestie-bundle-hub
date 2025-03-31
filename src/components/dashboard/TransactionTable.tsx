
import React from "react";

interface Transaction {
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
        return "status-badge-completed";
      case "Pending":
        return "status-badge-pending";
      case "Failed":
        return "status-badge-failed";
      default:
        return "";
    }
  };

  return (
    <div className="w-full overflow-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-muted-foreground uppercase bg-secondary">
          <tr>
            <th scope="col" className="px-4 py-3">Date</th>
            <th scope="col" className="px-4 py-3">Type</th>
            <th scope="col" className="px-4 py-3">Amount</th>
            <th scope="col" className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="bg-white border-b hover:bg-gray-50">
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
