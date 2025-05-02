
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardNav } from "@/components/DashboardNav";
import { TemplateCard } from "@/components/TemplateCard";
import { TemplatePreview } from "@/components/TemplatePreview";
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  template: string | null;
}

interface Link {
  id: string;
  title: string;
  url: string;
  icon: string;
  linkType?: string;
  clicks: number;
}

const templates = [
  {
    id: 'default',
    name: 'Default',
    description: 'The classic LinkBeacon layout with a clean, simple design.',
    previewImage: 'https://via.placeholder.com/300x200/f0f0f0/808080?text=Default',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'A clean, minimalist design with focus on your content.',
    previewImage: 'https://via.placeholder.com/300x200/ffffff/808080?text=Minimal',
  },
  {
    id: 'elegant-dark',
    name: 'Elegant Dark',
    description: 'A sophisticated dark theme with a premium feel.',
    previewImage: 'https://via.placeholder.com/300x200/1a1a1a/ffffff?text=Elegant+Dark',
  },
  {
    id: 'gradient',
    name: 'Gradient',
    description: 'A vibrant background with gradient colors that pop.',
    previewImage: 'https://via.placeholder.com/300x200/8a2be2/ffffff?text=Gradient',
  },
  {
    id: 'bubbles',
    name: 'Bubbles',
    description: 'A fun, playful design with a light blue theme.',
    previewImage: 'https://via.placeholder.com/300x200/e6f7ff/4a90e2?text=Bubbles',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'A contemporary layout with a sleek side profile.',
    previewImage: 'https://via.placeholder.com/300x200/f5f5f5/808080?text=Modern',
  }
];

const TemplatesPage = () => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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
    mutationFn: async (template: string) => {
      if (!user) throw new Error("Not authenticated");
      
      const { error } = await supabase
        .from('profiles')
        .update({ template })
        .eq('id', user.id);
      
      if (error) throw error;
      return template;
    },
    onSuccess: (template) => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      toast.success(`Template updated to ${template}!`);
      setIsPreviewOpen(false);
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
    updateTemplate.mutate(templateId);
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
            <p className="text-gray-500">Choose a template for your profile page</p>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                id={template.id}
                name={template.name}
                description={template.description}
                previewImage={template.previewImage}
                isActive={profileData?.template === template.id}
                onSelect={() => handleApplyTemplate(template.id)}
                onPreview={() => handlePreviewTemplate(template.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Template Preview Dialog */}
      {profileData && previewTemplate && (
        <TemplatePreview
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          template={previewTemplate}
          profile={profileData}
          links={links || []}
          onApply={() => handleApplyTemplate(previewTemplate)}
        />
      )}
    </div>
  );
};

export default TemplatesPage;
