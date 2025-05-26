
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UserTemplate {
  id: string;
  user_id: string;
  template_name: string;
  button_style: string;
  font_family: string;
  theme_color: string | null;
  custom_color: string | null;
  gradient_from: string | null;
  gradient_to: string | null;
  background_type: string;
  background_color: string | null;
  background_image_url: string | null;
  background_overlay: string | null;
  has_animation: boolean;
  animation_type: string | null;
  created_at: string;
  updated_at: string;
}

interface CreateUserTemplateParams {
  template_name: string;
  button_style: string;
  font_family: string;
  theme_color?: string;
  custom_color?: string;
  gradient_from?: string;
  gradient_to?: string;
  background_type?: string;
  background_color?: string;
  background_image_url?: string;
  background_overlay?: string;
  has_animation?: boolean;
  animation_type?: string;
}

export const useUserTemplate = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  // Get user template
  const { data: userTemplate, isLoading, error } = useQuery({
    queryKey: ['user-template', userId],
    queryFn: async () => {
      if (!userId) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('user_templates')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data as UserTemplate | null;
    },
    enabled: !!userId,
  });

  // Create or update user template
  const saveTemplate = useMutation({
    mutationFn: async (templateData: CreateUserTemplateParams) => {
      if (!userId) throw new Error("Not authenticated");

      // Check if user already has a template
      if (userTemplate) {
        // Update existing template
        const { error } = await supabase
          .from('user_templates')
          .update(templateData)
          .eq('user_id', userId);
        
        if (error) throw error;
      } else {
        // Create new template
        const { error } = await supabase
          .from('user_templates')
          .insert({
            user_id: userId,
            ...templateData
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-template', userId] });
      toast.success("Template saved successfully!");
    },
    onError: (error) => {
      console.error("Failed to save template:", error);
      toast.error("Failed to save template");
    }
  });

  return {
    userTemplate,
    isLoading,
    error,
    saveTemplate
  };
};
