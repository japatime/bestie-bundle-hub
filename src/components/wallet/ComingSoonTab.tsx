
import React from "react";
import { LucideIcon } from "lucide-react";

interface ComingSoonTabProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const ComingSoonTab = ({ icon: Icon, title, description }: ComingSoonTabProps) => {
  return (
    <div className="p-8 text-center">
      <Icon className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-2 text-lg font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default ComingSoonTab;
