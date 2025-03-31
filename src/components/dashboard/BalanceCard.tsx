
import React from "react";

interface BalanceCardProps {
  title: string;
  value: string;
  color: string;
  icon?: React.ReactNode;
}

const BalanceCard = ({ title, value, color, icon }: BalanceCardProps) => {
  return (
    <div className="balance-card">
      <div className="flex items-center gap-2 mb-2">
        {icon && (
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${color}`}>
            {icon}
          </div>
        )}
        <span className="text-sm text-muted-foreground">{title}</span>
      </div>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
};

export default BalanceCard;
