import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Link2, Pencil, Trash2, Copy, ExternalLink, Settings, BarChart3, ChevronsUpDown } from "lucide-react";
import { DashboardNav } from "@/components/DashboardNav";
import { LinkItem } from "@/components/LinkItem";
import { EditLinkDialog } from "@/components/EditLinkDialog";
import { AvatarUpload } from "@/components/AvatarUpload";
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// Define types for our data
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

interface Link {
  id: string;
  user_id: string;
  title: string;
  url: string;
  icon: string;
  clicks: number;
  created_at: string;
  position?: number; // Make position optional to support the ordering functionality
}

const Dashboard = () => {
  const { user, isLoading } = useAuthContext();
  const [editingLink, setEditingLink] = useState<Partial<Link> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) return <div className="h-screen flex justify-center items-center">Loading...</div>;

  if (!user) return null;

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

  // Get links data
  const { 
    data: links, 
    isLoading: isLinksLoading,
    error: linksError
  } = useQuery({
    queryKey: ['links', user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Link[];
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
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    }

  });

  // Link mutations
  const saveLink = useMutation({
    mutationFn: async (link: Partial<Link>) => {
      if (!user) throw new Error("Not authenticated");
      
      if (link.id) {
        // Update existing link
        const { error } = await supabase
          .from('links')
          .update({
            title: link.title,
            url: link.url,
            icon: link.icon,
          })
          .eq('id', link.id)
          .eq('user_id', user.id);
        
        if (error) throw error;
      } else {
        // Add new link
        const { error } = await supabase
          .from('links')
          .insert({
            title: link.title,
            url: link.url,
            icon: link.icon || 'link',
            user_id: user.id,
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links', user?.id] });
      setIsDialogOpen(false);
      toast.success(editingLink?.id ? "Link updated successfully!" : "Link added successfully!");
    },
    onError: (error) => {
      console.error("Failed to save link:", error);
      toast.error("Failed to save link");
    }
  });

  const deleteLink = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("Not authenticated");
      
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links', user?.id] });
      toast.success("Link deleted successfully!");
    },
    onError: (error) => {
      console.error("Failed to delete link:", error);
      toast.error("Failed to delete link");
    }
  });
  
  // New mutation for updating link order
  const updateLinkOrder = useMutation({
    mutationFn: async (updatedLinks: Link[]) => {
      if (!user) throw new Error("Not authenticated");
      
      // Update each link with its new position
      const updates = updatedLinks.map((link, index) => ({
        id: link.id,
        position: index
      }));
      
      for (const update of updates) {
        const { error } = await supabase
          .from('links')
          .update({ position: update.position })
          .eq('id', update.id)
          .eq('user_id', user.id);
          
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links', user?.id] });
      toast.success("Link order updated successfully!");
    },
    onError: (error) => {
      console.error("Failed to update link order:", error);
      toast.error("Failed to update link order");
    }
  });

  // Get profile URL for sharing
  const profileUrl = profileData ? `${window.location.origin}/${profileData.username}` : '';

  const handleCopyLink = () => {
    if (profileUrl) {
      navigator.clipboard.writeText(profileUrl);
      toast.success("Profile link copied to clipboard!");
    }
  };

  const handleAddLink = () => {
    setEditingLink({
      title: "New Link",
      url: "",
      icon: "link"
    });
    setIsDialogOpen(true);
  };

  const handleEditLink = (link: Link) => {
    setEditingLink(link);
    setIsDialogOpen(true);
  };

  const handleSaveLink = (link: Partial<Link>) => {
    saveLink.mutate(link);
  };

  const handleDeleteLink = (id: string) => {
    deleteLink.mutate(id);
  };

  const handleSaveProfile = () => {
    if (profileData) {
      updateProfileMutation.mutate({
        display_name: profileData.display_name,
        bio: profileData.bio,
        theme: profileData.theme,
        username: profileData.username,
      });
    }
  };

  const handleAvatarUpdate = (url: string) => {
    if (profileData) {
      queryClient.setQueryData(['profile', user?.id], {
        ...profileData,
        avatar_url: url
      });
    }
  };

  // Handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination || !links) return;
    
    const items = Array.from(links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update the links in the UI immediately via cache
    queryClient.setQueryData(['links', user?.id], items);
    
    // Update the database
    updateLinkOrder.mutate(items);
  };
  
  // Handle manual reordering with up/down buttons
  const handleMoveLink = (index: number, direction: 'up' | 'down') => {
    if (!links) return;
    
    const items = Array.from(links);
    
    if (direction === 'up' && index > 0) {
      // Swap with previous item
      [items[index - 1], items[index]] = [items[index], items[index - 1]];
    } else if (direction === 'down' && index < items.length - 1) {
      // Swap with next item
      [items[index], items[index + 1]] = [items[index + 1], items[index]];
    } else {
      // Can't move further in that direction
      return;
    }
    
    // Update the links in the UI immediately via cache
    queryClient.setQueryData(['links', user?.id], items);
    
    // Update the database
    updateLinkOrder.mutate(items);
  };

  if (isProfileLoading) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <DashboardNav />
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (profileError || linksError) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <DashboardNav />
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-red-500">Error loading data</h1>
                <p className="text-gray-600 mt-2">Please try refreshing the page</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              {profileData && (
                <>
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
                </>
              )}
            </div>
          </div>

          {/* Dashboard Content */}
          <Tabs defaultValue="links" className="space-y-6">
            <TabsList className="mb-6">
              <TabsTrigger value="links">
                <Link2 className="h-4 w-4 mr-2" />
                Links
              </TabsTrigger>
              <TabsTrigger value="arrange">
                <ChevronsUpDown className="h-4 w-4 mr-2" />
                Arrange Links
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

              {links && links.length === 0 ? (
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
                  {links && links.map((link, index) => (
                    <LinkItem
                      key={link.id}
                      link={link}
                      onEdit={() => handleEditLink(link)}
                      onDelete={() => handleDeleteLink(link.id)}
                      onMoveUp={() => handleMoveLink(index, 'up')}
                      onMoveDown={() => handleMoveLink(index, 'down')}
                      isFirst={index === 0}
                      isLast={index === links.length - 1}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            {/* Arrange Links Tab */}
            <TabsContent value="arrange" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Drag and drop your links to reorder them</h3>
                  {links && links.length > 0 ? (
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="links">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-2"
                          >
                            {links.map((link, index) => (
                              <Draggable key={link.id} draggableId={link.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className="border border-gray-200 bg-white rounded-md p-3 flex items-center justify-between"
                                  >
                                    <div className="flex items-center">
                                      <div 
                                        {...provided.dragHandleProps}
                                        className="mr-3 cursor-move text-gray-400 hover:text-gray-600"
                                      >
                                        <ChevronsUpDown className="h-5 w-5" />
                                      </div>
                                      <div>
                                        <p className="font-medium">{link.title}</p>
                                        <p className="text-sm text-gray-500 truncate max-w-[250px]">{link.url}</p>
                                      </div>
                                    </div>
                                    <div className="flex space-x-1">
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => handleMoveLink(index, 'up')}
                                        disabled={index === 0}
                                      >
                                        ↑
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => handleMoveLink(index, 'down')}
                                        disabled={index === links.length - 1}
                                      >
                                        ↓
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500">No links to arrange</p>
                      <Button
                        onClick={handleAddLink}
                        className="mt-4 bg-brand-purple hover:bg-brand-purple/90"
                      >
                        Add Your First Link
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-6">
              {profileData && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      {/* Profile Picture Upload */}
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Profile Picture</h3>
                        <div className="flex justify-center py-4">
                          <AvatarUpload 
                            userId={profileData.id} 
                            existingUrl={profileData.avatar_url} 
                            onAvatarUpdate={handleAvatarUpdate}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Profile Information</h3>
                        <div className="grid gap-4">
                          <div className="grid gap-1.5">
                            <label htmlFor="displayName" className="text-sm font-medium">
                              Display Name
                            </label>
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
                            <label htmlFor="username" className="text-sm font-medium">
                              Username
                            </label>
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
                            <label htmlFor="bio" className="text-sm font-medium">
                              Bio
                            </label>
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
                              onClick={() => {
                                queryClient.setQueryData(['profile', user?.id], {
                                  ...profileData,
                                  theme: color
                                });
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      <Button 
                        onClick={handleSaveProfile} 
                        className="bg-brand-purple hover:bg-brand-purple/90"
                        disabled={updateProfileMutation.isPending}
                      >
                        {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
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
                      {links && links.length > 0 ? (
                        <div className="space-y-2">
                          {[...links].sort((a, b) => b.clicks - a.clicks).slice(0, 3).map((link) => (
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
                      ) : (
                        <p className="text-gray-500">No links to analyze yet</p>
                      )}
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
