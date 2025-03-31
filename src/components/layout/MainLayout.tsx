
import React from "react";
import Sidebar from "./Sidebar";
import { useLocation } from "react-router-dom";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const pathName = location.pathname;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activePath={pathName} />
      <main className="flex-1 p-6 md:p-8 max-w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
