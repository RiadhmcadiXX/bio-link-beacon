
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UpdateTemplateParams {
  template: string;
  theme?: string | null;
  buttonStyle?: string | null;
  fontFamily?: string | null;
  customColor?: string | null;
  gradientFrom?: string | null;
  gradientTo?: string | null;
  animationType?: string | null;
}

export const useTemplateMutations = (userId: string | undefined) => {
  const queryClient = useQueryClient();

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
      animationType = null,
    }: UpdateTemplateParams) => {
      if (!userId) throw new Error("Not authenticated");

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
        .eq('id', userId);

      if (error) throw error;
      return template;
    },
    onSuccess: (template) => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      toast.success(`Template updated to ${template}!`);
    },
    onError: (error) => {
      console.error("Failed to update template:", error);
      toast.error("Failed to update template");
    }
  });

  return { updateTemplate };
};
