
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { DashboardNav } from "@/components/DashboardNav";
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Settings, User, Bell, Shield, KeyRound, Zap } from "lucide-react";
import { PlanManagement } from "@/components/dashboard/PlanManagement";

const SettingsPage = () => {
  // Component implementation goes here
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>

      <div className="hidden items-start md:grid md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr] md:gap-6 lg:gap-10">
        <DashboardNav />
        <div className="space-y-4">
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList>
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="account">
                <Settings className="h-4 w-4 mr-2" />
                Account
              </TabsTrigger>
              <TabsTrigger value="subscription">
                <Zap className="h-4 w-4 mr-2" />
                Subscription
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              {/* Profile settings */}
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4">
              {/* Notification settings */}
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4">
              {/* Security settings */}
            </TabsContent>
            
            <TabsContent value="account" className="space-y-4">
              {/* Account settings */}
            </TabsContent>
            
            <TabsContent value="subscription" className="space-y-4">
              <PlanManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Mobile view */}
      <div className="md:hidden">
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="profile">
              <User className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="account">
              <Settings className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="subscription">
              <Zap className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            {/* Mobile profile settings */}
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            {/* Mobile notification settings */}
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            {/* Mobile security settings */}
          </TabsContent>
          
          <TabsContent value="account" className="space-y-4">
            {/* Mobile account settings */}
          </TabsContent>
          
          <TabsContent value="subscription" className="space-y-4">
            <PlanManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;
