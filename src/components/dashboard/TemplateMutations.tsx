
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useUserTemplate } from "@/hooks/useUserTemplate";

interface UpdateTemplateParams {
  template: string;
  theme?: string | null;
  buttonStyle?: string | null;
  fontFamily?: string | null;
  customColor?: string | null;
  gradientFrom?: string | null;
  gradientTo?: string | null;
  animationType?: string | null;
  backgroundType?: string;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  backgroundOverlay?: string;
}

export const useTemplateMutations = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  const { userTemplate } = useUserTemplate(userId);

  // Template update mutation that works with both profiles and user_templates
  const updateTemplate = useMutation({
    mutationFn: async ({
      template,
      theme = null,
      buttonStyle = null,
      fontFamily = null,
      customColor = null,
      gradientFrom = null,
      gradientTo = null,
      animationType = null,
      backgroundType = 'color',
      backgroundColor = null,
      backgroundImageUrl = null,
      backgroundOverlay = null,
    }: UpdateTemplateParams) => {
      if (!userId) throw new Error("Not authenticated");

      // Update the profiles table (for backwards compatibility)
      const profileUpdateData: any = { template };
      if (theme !== null) profileUpdateData.theme = theme;
      if (buttonStyle !== null) profileUpdateData.button_style = buttonStyle;
      if (fontFamily !== null) profileUpdateData.font_family = fontFamily;
      if (animationType !== null) profileUpdateData.animation_type = animationType;

      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdateData)
        .eq('id', userId);

      if (profileError) throw profileError;

      // Update or create user template
      const templateData = {
        template_name: template,
        button_style: buttonStyle || 'default',
        font_family: fontFamily || 'default',
        theme_color: theme,
        custom_color: customColor,
        gradient_from: gradientFrom,
        gradient_to: gradientTo,
        background_type: backgroundType,
        background_color: backgroundColor,
        background_image_url: backgroundImageUrl,
        background_overlay: backgroundOverlay,
        has_animation: !!animationType,
        animation_type: animationType,
      };

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

      return template;
    },
    onSuccess: (template) => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      queryClient.invalidateQueries({ queryKey: ['user-template', userId] });
      toast.success(`Template updated to ${template}!`);
    },
    onError: (error) => {
      console.error("Failed to update template:", error);
      toast.error("Failed to update template");
    }
  });

  return { updateTemplate };
};
