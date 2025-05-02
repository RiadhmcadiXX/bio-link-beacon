
import React from "react";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  LayoutDashboard, 
  Link2, 
  LayoutTemplate,
  Settings, 
  BarChart3, 
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const DashboardNav = () => {
  const { user, logout } = useAuthContext();

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5 mr-3" />,
    },
    {
      title: "Templates",
      href: "/templates",
      icon: <LayoutTemplate className="h-5 w-5 mr-3" />,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: <BarChart3 className="h-5 w-5 mr-3" />,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5 mr-3" />,
    },
  ];

  // Function to get the first 2 characters of display name or email
  const getAvatarFallback = () => {
    if (!user) return "?";
    return user.email ? user.email.substring(0, 2).toUpperCase() : "?";
  };

  return (
    <div className="hidden md:flex border-r w-64 p-5 flex-col bg-white">
      {/* Logo */}
      <div className="flex items-center mb-8">
        <Link2 className="h-6 w-6 text-brand-purple mr-2" />
        <span className="font-bold text-xl">LinkBeacon</span>
      </div>

      {/* Navigation Links */}
      <div className="flex-1">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-brand-purple/10 text-brand-purple"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {item.icon}
              {item.title}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User Profile & Logout */}
      <div className="mt-auto pt-4 border-t">
        <div className="flex items-center mb-4">
          <Avatar className="h-9 w-9 mr-3">
            <AvatarImage
              src={user?.user_metadata?.avatar_url || undefined}
              alt={user?.email || "User profile"}
            />
            <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{user?.email}</p>
            <p className="text-xs text-gray-500 truncate max-w-[150px]">
              {user?.user_metadata?.username || user?.email}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start text-gray-700"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Log out
        </Button>
      </div>
    </div>
  );
};
