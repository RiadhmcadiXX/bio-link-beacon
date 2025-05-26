
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DashboardNav } from "@/components/DashboardNav";
import { TemplateCard } from "@/components/TemplateCard";
import { TemplatePreview } from "@/components/TemplatePreview";
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomTemplateDialog } from "@/components/CustomTemplateDialog";
import { Check, Eye, Palette } from "lucide-react";
import { templatesLibrary } from "@/constants/templates";
import { useTemplateMutations } from "@/components/dashboard/TemplateMutations";
import { useUserTemplate } from "@/hooks/useUserTemplate";

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

const TemplatesPage = () => {
  const { user } = useAuthContext();
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("preset");

  const { updateTemplate } = useTemplateMutations(user?.id);
  const { userTemplate } = useUserTemplate(user?.id);

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

  const handlePreviewTemplate = (templateId: string) => {
    setPreviewTemplate(templateId);
    setIsPreviewOpen(true);
  };

  const handleApplyTemplate = (templateId: string) => {
    const selectedTemplate = templatesLibrary.find(t => t.id === templateId);
    if (selectedTemplate) {
      updateTemplate.mutate({
        template: templateId,
        buttonStyle: selectedTemplate.buttonStyle,
        fontFamily: selectedTemplate.fontFamily,
        animationType: selectedTemplate.hasAnimation ? selectedTemplate.animationType : null,
        backgroundType: selectedTemplate.backgroundType,
        backgroundColor: selectedTemplate.backgroundConfig?.color,
        backgroundImageUrl: selectedTemplate.backgroundConfig?.image,
        backgroundOverlay: selectedTemplate.backgroundConfig?.overlay,
        // Clear custom settings when applying preset template
        customColor: null,
        gradientFrom: selectedTemplate.backgroundConfig?.gradient?.from,
        gradientTo: selectedTemplate.backgroundConfig?.gradient?.to
      });
    } else {
      updateTemplate.mutate({ template: templateId });
    }
    setIsPreviewOpen(false);
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
    setIsCustomDialogOpen(false);
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

  // Get current template from user_templates table or fallback to profile
  const currentTemplate = userTemplate?.template_name || profileData?.template || 'default';

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
                {templatesLibrary.map((template) => (
                  <TemplateCard
                    key={template.id}
                    id={template.id}
                    name={template.name}
                    description={template.description}
                    previewImage={template.previewImage}
                    isActive={currentTemplate === template.id}
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
                
                {currentTemplate === 'custom' && (
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
      {profileData && (previewTemplate || currentTemplate === 'custom') && (
        <TemplatePreview
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          template={previewTemplate || currentTemplate}
          profile={{
            ...profileData,
            customColor: userTemplate?.custom_color || null,
            gradientFrom: userTemplate?.gradient_from || null,
            gradientTo: userTemplate?.gradient_to || null,
            animationType: userTemplate?.animation_type || null
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
            theme: userTemplate?.theme_color || profileData.theme || 'purple',
            buttonStyle: userTemplate?.button_style || profileData.button_style || 'default',
            fontFamily: userTemplate?.font_family || profileData.font_family || 'default',
            customColor: userTemplate?.custom_color || undefined,
            gradientFrom: userTemplate?.gradient_from || undefined,
            gradientTo: userTemplate?.gradient_to || undefined
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
