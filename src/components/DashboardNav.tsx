
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Link2, Settings, LogOut } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";

export const DashboardNav = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 hidden md:block p-6 space-y-8">
      {/* Logo */}
      <div className="flex items-center">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-hero-pattern">LinkBeacon</h1>
      </div>

      {/* Nav Menu */}
      <div className="space-y-1">
        <NavItem href="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} text="Dashboard" />
        <NavItem href={`/${user?.username}`} icon={<Link2 className="h-5 w-5" />} text="My Profile" external />
        <NavItem href="/settings" icon={<Settings className="h-5 w-5" />} text="Account Settings" />
      </div>

      {/* User Info & Logout */}
      <div className="mt-auto pt-6 border-t border-gray-100">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
          <div>
            <p className="font-medium text-sm">{user?.email}</p>
            <p className="text-xs text-gray-500">@{user?.username}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start text-gray-600"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  external?: boolean;
}

const NavItem = ({ href, icon, text, external }: NavItemProps) => {
  if (external) {
    return (
      <a 
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-brand-purple transition-colors"
      >
        {icon}
        <span className="ml-3">{text}</span>
      </a>
    );
  }

  return (
    <Link
      to={href}
      className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-brand-purple transition-colors"
    >
      {icon}
      <span className="ml-3">{text}</span>
    </Link>
  );
};
