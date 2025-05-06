import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DashboardNav } from "@/components/DashboardNav";
import { TemplateCard } from "@/components/TemplateCard";
import { TemplatePreview } from "@/components/TemplatePreview";
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomTemplateDialog } from "@/components/CustomTemplateDialog";
import { Check, Eye, Palette } from "lucide-react";

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

interface Link {
  id: string;
  title: string;
  url: string;
  icon: string;
  linkType?: string;
  clicks: number;
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

const TemplatesPage = () => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("preset");

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
    isLoading: isLinksLoading
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

  // Template update mutation
  const updateTemplate = useMutation({
    mutationFn: async ({ 
      template, 
      theme = null, 
      buttonStyle = null, 
      fontFamily = null,
      customColor = null,
      gradientFrom = null,
      gradientTo = null,
      animationType = null
    }: { 
      template: string, 
      theme?: string | null, 
      buttonStyle?: string | null, 
      fontFamily?: string | null,
      customColor?: string | null,
      gradientFrom?: string | null,
      gradientTo?: string | null,
      animationType?: string | null
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
      if (animationType !== null) updateData.animation_type = animationType;
      
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

  if (profileError) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <DashboardNav />
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center py-10">
              <h1 className="text-2xl font-bold text-red-500">Error loading profile data</h1>
              <p className="text-gray-600 mt-2">Please try refreshing the page</p>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Templates</h1>
            <p className="text-gray-500">Choose and customize a template for your profile page</p>
          </div>

          {/* Template Tabs */}
          <Tabs defaultValue="preset" className="mb-6" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="preset">Preset Templates</TabsTrigger>
              <TabsTrigger value="custom">Custom Template</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preset">
              {/* Preset Templates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    id={template.id}
                    name={template.name}
                    description={template.description}
                    previewImage={template.previewImage}
                    isActive={profileData?.template === template.id}
                    buttonStyle={template.buttonStyle}
                    fontFamily={template.fontFamily}
                    hasAnimation={template.hasAnimation}
                    animationType={template.animationType}
                    onSelect={() => handleApplyTemplate(template.id)}
                    onPreview={() => handlePreviewTemplate(template.id)}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="custom">
              {/* Custom Template Section */}
              <div className="p-6 bg-white rounded-lg border">
                <h2 className="text-xl font-medium mb-4">Create Your Custom Template</h2>
                <p className="text-gray-500 mb-6">
                  Design your own unique template by selecting colors, button styles, and fonts to match your brand.
                </p>
                <Button 
                  className="bg-brand-purple hover:bg-brand-purple/90"
                  onClick={handleOpenCustomDialog}
                >
                  <Palette className="h-4 w-4 mr-2" /> Customize Template
                </Button>
                
                {profileData?.template === 'custom' && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="flex items-center text-green-700">
                      <Check className="h-4 w-4 mr-2" /> 
                      You're currently using a custom template
                    </p>
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() => setIsPreviewOpen(true)}
                    >
                      <Eye className="h-4 w-4 mr-2" /> Preview Your Custom Template
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

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
            animationType: profileData.animation_type || null
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
  );
};

export default TemplatesPage;
