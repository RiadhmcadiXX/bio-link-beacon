
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const MobileNav = () => {
  const { user, logout } = useAuthContext();
  const [open, setOpen] = useState(false);

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Templates",
      href: "/templates",
    },
    {
      title: "Analytics",
      href: "/analytics",
    },
    {
      title: "Settings",
      href: "/settings",
    },
  ];

  // Function to get the first 2 characters of display name or email
  const getAvatarFallback = () => {
    if (!user) return "?";
    return user.email ? user.email.substring(0, 2).toUpperCase() : "?";
  };

  const handleNavItemClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle mobile menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="px-0 py-6">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 mb-6">
            <span className="font-bold text-xl">LinkBeacon</span>
          </div>

          {/* Navigation Links */}
          <div className="flex-1">
            <nav className="space-y-1 px-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={handleNavItemClick}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-md text-sm font-medium ${
                      isActive
                        ? "bg-brand-purple/10 text-brand-purple"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  {item.title}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* User Profile & Logout */}
          {user && (
            <div className="mt-auto pt-4 border-t px-6">
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
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
