
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface QuickActionButtonProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  onClick: () => void;
  bgColor?: string;
  to?: string;  // Keeping the to prop optional for backward compatibility
}

const QuickActionButton = ({ 
  title, 
  icon, 
  description,
  onClick,
  bgColor = "bg-primary/10" 
}: QuickActionButtonProps) => {
  return (
    <Card className="h-full cursor-pointer transition-colors hover:border-primary/50" onClick={onClick}>
      <CardContent className="flex flex-col items-center justify-center space-y-2 p-6 text-center">
        <div className={`rounded-full flex items-center justify-center p-3 ${bgColor}`}>
          {icon}
        </div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default QuickActionButton;
