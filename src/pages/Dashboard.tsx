import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Link as LinkIcon, LayoutTemplate, Palette, Settings, BarChart2 } from "lucide-react";
import { EditLinkDialog } from "@/components/EditLinkDialog";
import { PresetTemplatesTab } from "@/components/templates/PresetTemplatesTab";
import { CustomTemplateDialog } from "@/components/CustomTemplateDialog";
import { TemplatePreview } from "@/components/TemplatePreview";
import { CustomTemplateTab } from "@/components/templates/CustomTemplateTab";
import { LinksList } from "@/components/dashboard/LinksList";
import { ProfileSettings } from "@/components/dashboard/ProfileSettings";
import { Analytics } from "@/components/dashboard/Analytics";
import { useTemplateMutations } from "@/components/dashboard/TemplateMutations";

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
  hasAnimation?: boolean;
  animationType?: string;
}

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
  animation_type?: string | null;
}

// Template data with added customization options and animations
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
  },
  // New templates with animations
  {
    id: 'floating-particles',
    name: 'Floating Particles',
    description: 'Elegant background with animated floating particles.',
    previewImage: 'https://via.placeholder.com/300x200/000022/ffffff?text=Particles',
    buttonStyle: 'gradient',
    fontFamily: 'raleway',
    hasAnimation: true,
    animationType: 'particles',
  },
  {
    id: 'wave-background',
    name: 'Wave Background',
    description: 'Soothing animated wave patterns in the background.',
    previewImage: 'https://via.placeholder.com/300x200/003366/ffffff?text=Waves',
    buttonStyle: 'default',
    fontFamily: 'poppins',
    hasAnimation: true,
    animationType: 'waves',
  },
  {
    id: 'gradient-flow',
    name: 'Gradient Flow',
    description: 'Smoothly transitioning color gradients that create depth.',
    previewImage: 'https://via.placeholder.com/300x200/4b0082/ffffff?text=Flow',
    buttonStyle: 'minimal',
    fontFamily: 'montserrat',
    hasAnimation: true,
    animationType: 'gradientFlow',
  }
];

const Dashboard = () => {
  const { user } = useAuthContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [activeTab, setActiveTab] = useState("links");
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);
  const { updateTemplate } = useTemplateMutations(user?.id);

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

  const handleOpenNewLinkDialog = () => {
    setEditingLink(null);
    setIsDialogOpen(true);
  };

  const handleEditLink = (link: Link) => {
    setEditingLink(link);
    setIsDialogOpen(true);
  };

  const handleSaveLink = (link: Partial<Link>) => {
    // Link mutation is handled in the EditLinkDialog component
    setIsDialogOpen(false);
  };

  const handlePreviewTemplate = (templateId: string) => {
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
        animationType: selectedTemplate.hasAnimation ? selectedTemplate.animationType : null,
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
    animationType?: string;
  }) => {
    updateTemplate.mutate({
      template: 'custom',
      theme: customSettings.theme,
      buttonStyle: customSettings.buttonStyle,
      fontFamily: customSettings.fontFamily,
      customColor: customSettings.customColor,
      gradientFrom: customSettings.gradientFrom,
      gradientTo: customSettings.gradientTo,
      animationType: customSettings.animationType
    });
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
            <LinksList 
              links={links}
              isLoading={linksLoading} 
              error={linksError as Error}
              userId={user?.id}
              onEditLink={handleEditLink}
              onOpenNewLinkDialog={handleOpenNewLinkDialog}
            />
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
            <ProfileSettings 
              profileData={profileData}
              isLoading={profileLoading}
              userId={user?.id}
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <h1 className="text-2xl font-bold">Analytics</h1>
            <Analytics 
              links={links} 
              onNavigateToLinks={() => setActiveTab('links')} 
            />
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
              gradientTo: profileData.gradientTo || null,
              animationType: profileData.animation_type || null,
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
              gradientTo: profileData.gradientTo || undefined,
              animationType: profileData.animation_type || undefined,
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
