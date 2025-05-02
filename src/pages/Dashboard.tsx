
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Link2, Pencil, Trash2, Copy, ExternalLink, Settings, BarChart3 } from "lucide-react";
import { DashboardNav } from "@/components/DashboardNav";
import { LinkItem } from "@/components/LinkItem";
import { EditLinkDialog } from "@/components/EditLinkDialog";
import { useAuthContext } from "@/contexts/AuthContext";

// Temporary mock data
const MOCK_USER = {
  id: "123",
  username: "johndoe",
  displayName: "John Doe",
  bio: "Digital creator & web developer",
  profileImage: "https://i.pravatar.cc/300",
  theme: "purple",
  createdAt: "2023-05-10"
};

const MOCK_LINKS = [
  { id: "1", title: "My Portfolio", url: "https://portfolio.example.com", icon: "link", clicks: 42 },
  { id: "2", title: "Follow me on Twitter", url: "https://twitter.com/example", icon: "twitter", clicks: 25 },
  { id: "3", title: "My YouTube Channel", url: "https://youtube.com/c/example", icon: "youtube", clicks: 17 },
];

const Dashboard = () => {
  const { user } = useAuthContext();
  const [links, setLinks] = useState(MOCK_LINKS);
  const [profileData, setProfileData] = useState(MOCK_USER);
  const [editingLink, setEditingLink] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Get profile URL for sharing
  const profileUrl = `${window.location.origin}/${profileData.username}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile link copied to clipboard!");
  };

  const handleAddLink = () => {
    const newLink = {
      id: `link-${Date.now()}`,
      title: "New Link",
      url: "",
      icon: "link",
      clicks: 0
    };
    setEditingLink(newLink);
    setIsDialogOpen(true);
  };

  const handleEditLink = (link: any) => {
    setEditingLink(link);
    setIsDialogOpen(true);
  };

  const handleSaveLink = (link: any) => {
    if (editingLink.id) {
      // Update existing link
      setLinks(links.map(l => l.id === link.id ? link : l));
      toast.success("Link updated successfully!");
    } else {
      // Add new link
      setLinks([...links, { ...link, id: `link-${Date.now()}` }]);
      toast.success("Link added successfully!");
    }
    setIsDialogOpen(false);
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
    toast.success("Link deleted successfully!");
  };

  const handleSaveProfile = () => {
    // In a real app, you'd update the user's profile in the backend
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Side Navigation */}
      <DashboardNav />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-gray-500">Manage your profile and links</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <div className="px-3 py-1 bg-gray-100 rounded-md flex items-center">
                <span className="text-sm text-gray-600 mr-2">{profileUrl}</span>
                <Button variant="ghost" size="icon" onClick={handleCopyLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href={`/${profileData.username}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </a>
              </Button>
            </div>
          </div>

          {/* Dashboard Content */}
          <Tabs defaultValue="links" className="space-y-6">
            <TabsList className="mb-6">
              <TabsTrigger value="links">
                <Link2 className="h-4 w-4 mr-2" />
                Links
              </TabsTrigger>
              <TabsTrigger value="appearance">
                <Settings className="h-4 w-4 mr-2" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Links Tab */}
            <TabsContent value="links" className="space-y-4">
              <Button 
                onClick={handleAddLink} 
                className="w-full bg-brand-purple hover:bg-brand-purple/90"
              >
                Add New Link
              </Button>

              {links.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Link2 className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-700">No links yet</h3>
                    <p className="text-gray-500 mb-4 text-center">
                      Add your first link to get started with your link hub
                    </p>
                    <Button onClick={handleAddLink} className="bg-brand-purple hover:bg-brand-purple/90">
                      Add Your First Link
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-3">
                  {links.map((link) => (
                    <LinkItem
                      key={link.id}
                      link={link}
                      onEdit={() => handleEditLink(link)}
                      onDelete={() => handleDeleteLink(link.id)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Profile Information</h3>
                      <div className="grid gap-4">
                        <div className="grid gap-1.5">
                          <label htmlFor="displayName" className="text-sm font-medium">
                            Display Name
                          </label>
                          <Input 
                            id="displayName" 
                            value={profileData.displayName} 
                            onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                          />
                        </div>
                        <div className="grid gap-1.5">
                          <label htmlFor="username" className="text-sm font-medium">
                            Username
                          </label>
                          <Input 
                            id="username" 
                            value={profileData.username} 
                            onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                            className="lowercase"
                          />
                          <p className="text-xs text-gray-500">
                            This will be your profile URL: {window.location.origin}/{profileData.username}
                          </p>
                        </div>
                        <div className="grid gap-1.5">
                          <label htmlFor="bio" className="text-sm font-medium">
                            Bio
                          </label>
                          <Textarea 
                            id="bio" 
                            value={profileData.bio} 
                            onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                            placeholder="Tell the world about yourself"
                            className="resize-none"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Theme</h3>
                      <div className="flex space-x-3">
                        {['purple', 'blue', 'pink', 'orange'].map(color => (
                          <div 
                            key={color}
                            className={`w-8 h-8 rounded-full cursor-pointer ${
                              color === 'purple' ? 'bg-brand-purple' : 
                              color === 'blue' ? 'bg-brand-blue' : 
                              color === 'pink' ? 'bg-brand-pink' : 
                              'bg-brand-orange'
                            } ${profileData.theme === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                            onClick={() => setProfileData({...profileData, theme: color})}
                          />
                        ))}
                      </div>
                    </div>

                    <Button onClick={handleSaveProfile} className="bg-brand-purple hover:bg-brand-purple/90">
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Profile Views</h3>
                      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Analytics graph will appear here</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Top Performing Links</h3>
                      <div className="space-y-2">
                        {links.sort((a, b) => b.clicks - a.clicks).slice(0, 3).map((link) => (
                          <div key={link.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">{link.title}</p>
                              <p className="text-sm text-gray-500 truncate max-w-[300px]">{link.url}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-medium">{link.clicks}</p>
                              <p className="text-xs text-gray-500">clicks</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit Link Dialog */}
      <EditLinkDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        link={editingLink}
        onSave={handleSaveLink}
      />
    </div>
  );
};

export default Dashboard;
