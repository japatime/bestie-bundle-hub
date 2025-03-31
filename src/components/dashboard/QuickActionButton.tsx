
import React from "react";
import { Link } from "react-router-dom";

interface QuickActionButtonProps {
  title: string;
  icon: React.ReactNode;
  to: string;
  bgColor?: string;
}

const QuickActionButton = ({ 
  title, 
  icon, 
  to, 
  bgColor = "bg-primary/10" 
}: QuickActionButtonProps) => {
  return (
    <Link to={to} className="quick-action-button">
      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${bgColor}`}>
        {icon}
      </div>
      <span className="text-sm font-medium">{title}</span>
    </Link>
  );
};

export default QuickActionButton;
