
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
import { Settings, User, Bell, Shield, KeyRound } from "lucide-react";

interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  profile_image: string | null;
  avatar_url: string | null;
  theme: string;
  created_at: string;
}

const SettingsPage = () => {
  const { user, isLoading } = useAuthContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Get profile data
  const { 
    data: profileData, 
    isLoading: isProfileLoading,
    error: profileError
  } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data as Profile;
    },
    enabled: !!user,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedProfile: Partial<Profile>) => {
      if (!user) throw new Error("Not authenticated");
      
      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', user.id);
      
      if (error) throw error;
      return updatedProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      toast.success("Settings updated successfully!");
    },
    onError: (error) => {
      console.error("Failed to update settings:", error);
      toast.error("Failed to update settings");
    }
  });

  // Update email preferences mutation
  const updateEmailPreferencesMutation = useMutation({
    mutationFn: async (preferences: { marketing: boolean, notifications: boolean }) => {
      if (!user) throw new Error("Not authenticated");
      
      // In a real app, you would store these preferences in a table
      // For demo purposes, we'll just show a toast
      console.log("Email preferences updated:", preferences);
      return preferences;
    },
    onSuccess: () => {
      toast.success("Email preferences updated successfully!");
    },
    onError: (error) => {
      console.error("Failed to update email preferences:", error);
      toast.error("Failed to update email preferences");
    }
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async ({ currentPassword, newPassword }: { currentPassword: string, newPassword: string }) => {
      if (!user) throw new Error("Not authenticated");
      
      // In a real implementation, you would validate current password first
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      toast.success("Password changed successfully!");
    },
    onError: (error) => {
      console.error("Failed to change password:", error);
      toast.error("Failed to change password");
    }
  });

  if (isLoading || isProfileLoading) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <DashboardNav />
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (profileError || !profileData) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <DashboardNav />
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-800">Error Loading Settings</h2>
              <p className="text-gray-600 mt-2">Please try refreshing the page</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (profileData) {
      updateProfileMutation.mutate({
        display_name: profileData.display_name,
        username: profileData.username,
        bio: profileData.bio,
      });
    }
  };

  const handleEmailPreferencesUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const marketingEmails = form.marketingEmails.checked;
    const notificationEmails = form.notificationEmails.checked;
    
    updateEmailPreferencesMutation.mutate({
      marketing: marketingEmails,
      notifications: notificationEmails
    });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const currentPassword = form.currentPassword.value;
    const newPassword = form.newPassword.value;
    const confirmPassword = form.confirmPassword.value;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    changePasswordMutation.mutate({ currentPassword, newPassword });
    form.reset();
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <DashboardNav />
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-gray-500">Manage your account settings and preferences</p>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="mb-6 grid grid-cols-4 md:grid-cols-4 lg:w-[400px]">
              <TabsTrigger value="profile" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                Emails
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Advanced
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your profile information and public details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid gap-4">
                      <div className="grid gap-1.5">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input 
                          id="displayName"
                          value={profileData.display_name || ''}
                          onChange={(e) => {
                            queryClient.setQueryData(['profile', user?.id], {
                              ...profileData,
                              display_name: e.target.value
                            });
                          }}
                        />
                      </div>
                      
                      <div className="grid gap-1.5">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={profileData.username}
                          onChange={(e) => {
                            queryClient.setQueryData(['profile', user?.id], {
                              ...profileData,
                              username: e.target.value
                            });
                          }}
                          className="lowercase"
                        />
                        <p className="text-xs text-gray-500">
                          This will be your profile URL: {window.location.origin}/{profileData.username}
                        </p>
                      </div>
                      
                      <div className="grid gap-1.5">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={profileData.bio || ''}
                          onChange={(e) => {
                            queryClient.setQueryData(['profile', user?.id], {
                              ...profileData,
                              bio: e.target.value
                            });
                          }}
                          placeholder="Tell the world about yourself"
                          className="resize-none"
                          rows={3}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="bg-brand-purple hover:bg-brand-purple/90 w-full md:w-auto"
                        disabled={updateProfileMutation.isPending}
                      >
                        {updateProfileMutation.isPending ? "Saving..." : "Save Profile"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Email Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Email Preferences</CardTitle>
                  <CardDescription>
                    Control which emails you receive from us
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleEmailPreferencesUpdate} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="marketingEmails" className="text-base">Marketing emails</Label>
                        <p className="text-sm text-gray-500">Receive emails about new features and promotions</p>
                      </div>
                      <Switch id="marketingEmails" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notificationEmails" className="text-base">Notification emails</Label>
                        <p className="text-sm text-gray-500">Receive emails about your account activity</p>
                      </div>
                      <Switch id="notificationEmails" defaultChecked />
                    </div>

                    <Button 
                      type="submit" 
                      className="bg-brand-purple hover:bg-brand-purple/90 w-full md:w-auto"
                      disabled={updateEmailPreferencesMutation.isPending}
                    >
                      {updateEmailPreferencesMutation.isPending ? "Saving..." : "Save Preferences"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="grid gap-4">
                      <div className="grid gap-1.5">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type="password"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                      
                      <div className="grid gap-1.5">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type="password"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                      
                      <div className="grid gap-1.5">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="bg-brand-purple hover:bg-brand-purple/90 w-full md:w-auto"
                        disabled={changePasswordMutation.isPending}
                      >
                        {changePasswordMutation.isPending ? "Updating..." : "Update Password"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Advanced Tab */}
            <TabsContent value="advanced">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>
                    Manage advanced settings for your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium">Delete Account</h3>
                        <p className="text-sm text-gray-500">
                          Delete your account and all of your data. This action cannot be undone.
                        </p>
                      </div>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium">Export Data</h3>
                        <p className="text-sm text-gray-500">
                          Download a copy of your data
                        </p>
                      </div>
                      <Button variant="outline">Export Data</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
