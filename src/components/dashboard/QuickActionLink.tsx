
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuickActionLinkProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

const QuickActionLink = ({
  to,
  icon,
  title,
  description,
  className,
}: QuickActionLinkProps) => {
  return (
    <Link to={to}>
      <Card className={cn("h-full transition-colors hover:border-primary/50", className)}>
        <CardContent className="flex flex-col items-center justify-center space-y-2 p-6 text-center">
          <div className="rounded-full bg-primary/10 p-3">{icon}</div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default QuickActionLink;
