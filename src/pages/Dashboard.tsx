
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Link as LinkIcon, LayoutTemplate, Palette, Settings, BarChart2, Image } from "lucide-react";
import { LinkItem } from "@/components/LinkItem";
import { EditLinkDialog } from "@/components/EditLinkDialog";
import { TemplateCard } from "@/components/TemplateCard";
import { AvatarUpload } from "@/components/AvatarUpload";
import { PresetTemplatesTab } from "@/components/templates/PresetTemplatesTab";
import { CustomTemplateDialog } from "@/components/CustomTemplateDialog";
import { TemplatePreview } from "@/components/TemplatePreview";
import { CustomTemplateTab } from "@/components/templates/CustomTemplateTab";
import { Link, useNavigate } from "react-router-dom";

interface Link {
  id: string;
  title: string;
  url: string;
  icon: string;
  linkType?: string;
  clicks: number;
  position: number;
}

interface Template {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  isCustomizable: boolean;
  buttonStyle: string;
  fontFamily: string;
}

// Template data with added customization options
const templates = [
  {
    id: 'default',
    name: 'Default',
    description: 'The classic LinkBeacon layout with a clean, simple design.',
    previewImage: 'https://xkglfoncbxrpyrdiekzu.supabase.co/storage/v1/object/public/templates//template1.png',
    buttonStyle: 'default',
    fontFamily: 'default',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'A clean, minimalist design with focus on your content.',
    previewImage: 'https://xkglfoncbxrpyrdiekzu.supabase.co/storage/v1/object/public/templates//template2.png',
    buttonStyle: 'minimal',
    fontFamily: 'default',
  },
  {
    id: 'elegant-dark',
    name: 'Elegant Dark',
    description: 'A sophisticated dark theme with a premium feel.',
    previewImage: 'https://xkglfoncbxrpyrdiekzu.supabase.co/storage/v1/object/public/templates//template3.png',
    buttonStyle: 'outline',
    fontFamily: 'lobster',
  },
  {
    id: 'gradient',
    name: 'Gradient',
    description: 'A vibrant background with gradient colors that pop.',
    previewImage: 'https://xkglfoncbxrpyrdiekzu.supabase.co/storage/v1/object/public/templates//gradient%20template%20pink.png',
    buttonStyle: 'gradient',
    fontFamily: 'display',
  },
  {
    id: 'bubbles',
    name: 'Bubbles',
    description: 'A fun, playful design with a light blue theme.',
    previewImage: 'https://via.placeholder.com/300x200/e6f7ff/4a90e2?text=Bubbles',
    buttonStyle: 'rounded',
    fontFamily: 'font-lobster',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'A contemporary layout with a sleek side profile.',
    previewImage: 'https://via.placeholder.com/300x200/f5f5f5/808080?text=Modern',
    buttonStyle: 'shadow',
    fontFamily: 'mono',
  }
];

interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  template: string | null;
  theme: string | null;
  button_style?: string | null;
  font_family?: string | null;
  customColor?: string | null;
  gradientFrom?: string | null;
  gradientTo?: string | null;
}

const Dashboard = () => {
  const { user } = useAuthContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("links");
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);

  // Fetch links
  const { data: links, isLoading: linksLoading, error: linksError } = useQuery({
    queryKey: ['links', user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
        .order('position', { ascending: true });

      if (error) throw error;
      return data as Link[];
    },
    enabled: !!user,
  });

  // // Fetch templates
  // const { data: templates, isLoading: templatesLoading } = useQuery({
  //   queryKey: ['templates'],
  //   queryFn: async () => {
  //     // In a real app, this would fetch from the database
  //     // For now, we'll use mock data
  //     return [
  //       {
  //         id: "template1",
  //         name: "Minimalist",
  //         description: "Clean and simple design with focus on content",
  //         previewImage: "/images/template1.png",
  //         isActive: true,
  //         isCustomizable: true,
  //         buttonStyle: "default",
  //         fontFamily: "inter"
  //       },
  //       {
  //         id: "template2",
  //         name: "Vibrant",
  //         description: "Colorful design with bold elements",
  //         previewImage: "/images/template2.png",
  //         isActive: false,
  //         isCustomizable: true,
  //         buttonStyle: "gradient",
  //         fontFamily: "poppins"
  //       },
  //       {
  //         id: "template3",
  //         name: "Professional",
  //         description: "Sophisticated design for business profiles",
  //         previewImage: "/images/template3.png",
  //         isActive: false,
  //         isCustomizable: false,
  //         buttonStyle: "outline",
  //         fontFamily: "serif"
  //       }
  //     ];
  //   }
  // });

  // Fetch profile
  const { data: profileData, isLoading: profileLoading } = useQuery({
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
        // Add new link - get the highest position value and add 1
        let newPosition = 0;
        if (links && links.length > 0) {
          // Find the highest position
          const maxPosition = Math.max(...links.map(l => l.position || 0));
          newPosition = maxPosition + 1;
        }

        // Add new link
        const { error } = await supabase
          .from('links')
          .insert({
            title: link.title,
            url: link.url,
            icon: link.icon || 'link',
            user_id: user.id,
            position: newPosition,
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      setIsDialogOpen(false);
      toast.success(editingLink?.id ? "Link updated successfully!" : "Link added successfully!");
    },
    onError: (error) => {
      console.error("Failed to save link:", error);
      toast.error("Failed to save link");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['links', user?.id] });
    }
  });

  // Delete link mutation
  const deleteLink = useMutation({
    mutationFn: async (linkId: string) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', linkId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Link deleted successfully!");
    },
    onError: (error) => {
      console.error("Failed to delete link:", error);
      toast.error("Failed to delete link");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['links', user?.id] });
    }
  });

  // Update link order mutation
  const updateLinkOrder = useMutation({
    mutationFn: async ({ linkId, direction }: { linkId: string, direction: 'up' | 'down' }) => {
      if (!user || !links) throw new Error("Not authenticated or no links");

      // Find the current link and its index
      const currentIndex = links.findIndex(link => link.id === linkId);
      if (currentIndex === -1) throw new Error("Link not found");

      const currentLink = links[currentIndex];

      // Determine the target index based on direction
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= links.length) {
        throw new Error("Cannot move link further");
      }

      const targetLink = links[targetIndex];

      // Swap positions
      const currentPosition = currentLink.position;
      const targetPosition = targetLink.position;

      // Update the current link position
      const { error: error1 } = await supabase
        .from('links')
        .update({ position: targetPosition })
        .eq('id', currentLink.id)
        .eq('user_id', user.id);

      if (error1) throw error1;

      // Update the target link position
      const { error: error2 } = await supabase
        .from('links')
        .update({ position: currentPosition })
        .eq('id', targetLink.id)
        .eq('user_id', user.id);

      if (error2) throw error2;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links', user?.id] });
    },
    onError: (error) => {
      console.error("Failed to update link order:", error);
      toast.error("Failed to update the link order");
    }
  });

  // Profile update mutation
  const updateAvatar = useMutation({
    mutationFn: async (avatarUrl: string) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);

      if (error) throw error;
      return avatarUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      toast.success("Profile picture updated successfully!");
    },
    onError: (error) => {
      console.error("Failed to update profile picture:", error);
      toast.error("Failed to update profile picture");
    }
  });

  const handleOpenNewLinkDialog = () => {
    setEditingLink(null);
    setIsDialogOpen(true);
  };

  const handleEditLink = (link: Link) => {
    setEditingLink(link);
    setIsDialogOpen(true);
  };

  const handleSaveLink = (link: Partial<Link>) => {
    saveLink.mutate(link);
  };

  const handleDeleteLink = (linkId: string) => {
    if (confirm("Are you sure you want to delete this link?")) {
      deleteLink.mutate(linkId);
    }
  };

  const handleMoveUp = (linkId: string) => {
    updateLinkOrder.mutate({ linkId, direction: 'up' });
  };

  const handleMoveDown = (linkId: string) => {
    updateLinkOrder.mutate({ linkId, direction: 'down' });
  };


  // Template update mutation
  const updateTemplate = useMutation({
    mutationFn: async ({
      template,
      theme = null,
      buttonStyle = null,
      fontFamily = null,
      customColor = null,
      gradientFrom = null,
      gradientTo = null
    }: {
      template: string,
      theme?: string | null,
      buttonStyle?: string | null,
      fontFamily?: string | null,
      customColor?: string | null,
      gradientFrom?: string | null,
      gradientTo?: string | null
    }) => {
      if (!user) throw new Error("Not authenticated");

      const updateData: any = { template };

      // Only include these fields if they are provided
      if (theme !== null) updateData.theme = theme;
      if (buttonStyle !== null) updateData.button_style = buttonStyle;
      if (fontFamily !== null) updateData.font_family = fontFamily;
      if (customColor !== null) updateData.custom_color = customColor;
      if (gradientFrom !== null) updateData.gradient_from = gradientFrom;
      if (gradientTo !== null) updateData.gradient_to = gradientTo;

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;
      return template;
    },
    onSuccess: (template) => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      toast.success(`Template updated to ${template}!`);
      setIsPreviewOpen(false);
      setIsCustomDialogOpen(false);
    },
    onError: (error) => {
      console.error("Failed to update template:", error);
      toast.error("Failed to update template");
    }
  });

  const handlePreviewTemplate = (templateId: string) => {
    console.log("Previewing template:", templateId);
    setPreviewTemplate(templateId);
    setIsPreviewOpen(true);
  };

  const handleApplyTemplate = (templateId: string) => {
    const selectedTemplate = templates.find(t => t.id === templateId);
    if (selectedTemplate) {
      updateTemplate.mutate({
        template: templateId,
        buttonStyle: selectedTemplate.buttonStyle,
        fontFamily: selectedTemplate.fontFamily,
        // Clear custom settings when applying preset template
        customColor: null,
        gradientFrom: null,
        gradientTo: null
      });
    } else {
      updateTemplate.mutate({ template: templateId });
    }
  };

  const handleOpenCustomDialog = () => {
    setIsCustomDialogOpen(true);
  };

  const handleCustomTemplateSubmit = (customSettings: {
    theme: string;
    buttonStyle: string;
    fontFamily: string;
    customColor?: string;
    gradientFrom?: string;
    gradientTo?: string;
  }) => {
    updateTemplate.mutate({
      template: 'custom',
      theme: customSettings.theme,
      buttonStyle: customSettings.buttonStyle,
      fontFamily: customSettings.fontFamily,
      customColor: customSettings.customColor,
      gradientFrom: customSettings.gradientFrom,
      gradientTo: customSettings.gradientTo
    });
  };



  const handleAvatarUpdate = (url: string) => {
    updateAvatar.mutate(url);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <Tabs defaultValue="links" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="grid grid-cols-5 w-full md:w-auto">
              <TabsTrigger value="links" className="flex items-center gap-1">
                <LinkIcon className="h-4 w-4" />
                <span className="hidden sm:inline">My Links</span>
              </TabsTrigger>
              <TabsTrigger value="preset-templates" className="flex items-center gap-1">
                <LayoutTemplate className="h-4 w-4" />
                <span className="hidden sm:inline">Preset Templates</span>
              </TabsTrigger>
              <TabsTrigger value="custom-templates" className="flex items-center gap-1">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Custom Templates</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-1">
                <BarChart2 className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
            </TabsList>

            {activeTab === 'links' && (
              <Button onClick={handleOpenNewLinkDialog} className="bg-brand-purple hover:bg-brand-purple/90">
                <Plus className="h-4 w-4 mr-2" /> Add Link
              </Button>
            )}
          </div>

          {/* My Links Tab */}
          <TabsContent value="links" className="space-y-4">
            <h1 className="text-2xl font-bold">My Links</h1>

            {linksLoading ? (
              <div className="text-center py-6">Loading links...</div>
            ) : linksError ? (
              <Card className="p-6 text-center">
                <p className="text-red-500">Error loading links</p>
                <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['links', user?.id] })} className="mt-2">
                  Retry
                </Button>
              </Card>
            ) : links && links.length > 0 ? (
              <div className="space-y-3">
                {links.map((link, index) => (
                  <LinkItem
                    key={link.id}
                    link={link}
                    onEdit={() => handleEditLink(link)}
                    onDelete={() => handleDeleteLink(link.id)}
                    onMoveUp={() => handleMoveUp(link.id)}
                    onMoveDown={() => handleMoveDown(link.id)}
                    isFirst={index === 0}
                    isLast={index === links.length - 1}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <p className="mb-4">You don't have any links yet.</p>
                <Button onClick={handleOpenNewLinkDialog} className="bg-brand-purple hover:bg-brand-purple/90">
                  <Plus className="h-4 w-4 mr-2" /> Add your first link
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* Preset Templates Tab */}
          <TabsContent value="preset-templates">
            <PresetTemplatesTab
              templates={templates}
              activeTemplateId={profileData?.template ?? null}
              onApply={handleApplyTemplate}
              onPreview={handlePreviewTemplate}
            />
          </TabsContent>

          {/* Custom Templates Tab */}
          <TabsContent value="custom-templates" className="space-y-4">
            <h1 className="text-2xl font-bold">Custom Templates</h1>
            <CustomTemplateTab
              profileData={profileData}
              onOpenDialog={handleOpenCustomDialog}
              onPreview={() => setIsPreviewOpen(true)}
            />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <h1 className="text-2xl font-bold">Settings</h1>

            {profileLoading ? (
              <div className="text-center py-6">Loading profile settings...</div>
            ) : profileData ? (
              <Card className="p-6">
                <h2 className="text-xl font-medium mb-4">Profile Image</h2>
                <div className="flex flex-col items-center md:flex-row md:items-start gap-8">
                  <AvatarUpload
                    userId={user?.id || ''}
                    existingUrl={profileData.avatar_url}
                    onAvatarUpdate={handleAvatarUpdate}
                    size="lg"
                  />
                  <div className="space-y-4 flex-1">
                    <div>
                      <h3 className="text-lg font-medium">Profile Settings</h3>
                      <p className="text-sm text-gray-500">
                        For more profile settings, please visit the settings page.
                      </p>
                    </div>

                    <Button asChild variant="outline" className="w-full sm:w-auto">
                      <Link to="/settings">Manage Your Profile</Link>
                    </Button>

                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-6 text-center">
                <p className="text-red-500">Error loading profile</p>
                <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['profile', user?.id] })} className="mt-2">
                  Retry
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <h1 className="text-2xl font-bold">Analytics</h1>
            <Card className="p-6">
              <p className="text-center mb-4">View insights about your bio link performance</p>
              {links && links.length > 0 ? (
                <div className="space-y-4">
                  <h2 className="text-xl font-medium">Link Performance</h2>
                  <div className="space-y-2">
                    {links.map(link => (
                      <div key={link.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <div className="font-medium">{link.title}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">{link.clicks || 0} clicks</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p>No link data available yet.</p>
                  <Button
                    onClick={() => setActiveTab('links')}
                    className="mt-2 bg-brand-purple hover:bg-brand-purple/90"
                  >
                    Create Your First Link
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
        {/* Template Preview Dialog */}
        {profileData && (previewTemplate || profileData.template === 'custom') && (
          <TemplatePreview
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            template={previewTemplate || profileData.template || 'default'}
            profile={{
              ...profileData,
              customColor: profileData.customColor || null,
              gradientFrom: profileData.gradientFrom || null,
              gradientTo: profileData.gradientTo || null
            }}
            links={links || []}
            onApply={() => previewTemplate ? handleApplyTemplate(previewTemplate) : null}
          />
        )}

        {/* Custom Template Dialog with Live Preview */}
        {profileData && (
          <CustomTemplateDialog
            isOpen={isCustomDialogOpen}
            onClose={() => setIsCustomDialogOpen(false)}
            onSubmit={handleCustomTemplateSubmit}
            initialSettings={{
              theme: profileData.theme || 'purple',
              buttonStyle: profileData.button_style || 'default',
              fontFamily: profileData.font_family || 'default',
              customColor: profileData.customColor || undefined,
              gradientFrom: profileData.gradientFrom || undefined,
              gradientTo: profileData.gradientTo || undefined
            }}
            profileData={{
              username: profileData.username,
              display_name: profileData.display_name,
              bio: profileData.bio,
              avatar_url: profileData.avatar_url
            }}
            links={links || []}
          />
        )}
      </div>

      <EditLinkDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        link={editingLink}
        onSave={handleSaveLink}
      />
    </Layout>
  );
};

export default Dashboard;
