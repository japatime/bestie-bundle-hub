
import React from "react";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Phone, 
  Database, 
  Zap, 
  Tv, 
  Users, 
  Wallet, 
  Bell, 
  Settings
} from "lucide-react";

interface SidebarProps {
  activePath: string;
}

const Sidebar = ({ activePath }: SidebarProps) => {
  const menuItems = [
    { path: "/", name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/airtime", name: "Airtime", icon: <Phone size={20} /> },
    { path: "/data-plans", name: "Data Plans", icon: <Database size={20} /> },
    { path: "/electricity", name: "Electricity Bills", icon: <Zap size={20} /> },
    { path: "/tv", name: "TV Subscription", icon: <Tv size={20} /> },
    { path: "/followers", name: "Buy Followers", icon: <Users size={20} /> },
    { path: "/wallet", name: "Wallet", icon: <Wallet size={20} /> },
    { path: "/notifications", name: "Notifications", icon: <Bell size={20} /> },
    { path: "/settings", name: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 p-4 bg-white border-r">
      <div className="flex items-center gap-2 px-2 py-4">
        <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
          <span className="text-white font-bold">BN</span>
        </div>
        <h1 className="text-xl font-semibold text-gray-900">Bestie Need</h1>
      </div>
      
      <nav className="flex flex-col gap-1 mt-8">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${activePath === item.path ? "active" : ""}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
