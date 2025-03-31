
import React from "react";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Phone, 
  Database, 
  Zap, 
  Tv, 
  Menu
} from "lucide-react";
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Sidebar from "./Sidebar";

interface MobileNavProps {
  activePath: string;
}

const MobileNav = ({ activePath }: MobileNavProps) => {
  const quickLinks = [
    { path: "/", icon: <LayoutDashboard size={20} />, label: "Home" },
    { path: "/airtime", icon: <Phone size={20} />, label: "Airtime" },
    { path: "/data-plans", icon: <Database size={20} />, label: "Data" },
    { path: "/electricity", icon: <Zap size={20} />, label: "Electric" },
    { path: "/tv", icon: <Tv size={20} />, label: "TV" },
  ];

  return (
    <div className="block md:hidden">
      <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t">
        <div className="grid h-full grid-cols-5">
          {quickLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`inline-flex flex-col items-center justify-center px-1 ${
                activePath === link.path ? "text-primary" : "text-gray-500"
              }`}
            >
              {link.icon}
              <span className="text-xs mt-1">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-16 bg-white border-b">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
            <span className="text-white font-bold">BN</span>
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Bestie Need</h1>
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <Sidebar activePath={activePath} />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileNav;
