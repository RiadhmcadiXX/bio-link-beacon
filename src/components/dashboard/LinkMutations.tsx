
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Link {
  id: string;
  title: string;
  url: string;
  icon: string;
  linkType?: string;
  clicks: number;
  position: number;
  isEmbed?: boolean;
  embedType?: string;
}

export const useLinkMutations = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  // Link mutations
  const saveLink = useMutation({
    mutationFn: async (link: Partial<Link>) => {
      if (!userId) throw new Error("Not authenticated");

      // Special case for embed links - ensure linkType is set
      if (link.isEmbed) {
        link.linkType = 'embed';
      }

      if (link.id) {
        // Update existing link
        const { error } = await supabase
          .from('links')
          .update({
            title: link.title,
            url: link.url,
            icon: link.icon,
            linkType: link.linkType,
            isEmbed: link.isEmbed,
            embedType: link.embedType,
          })
          .eq('id', link.id)
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        // Get links to determine the highest position
        const { data: links, error: getLinksError } = await supabase
          .from('links')
          .select('position')
          .eq('user_id', userId)
          .order('position', { ascending: false })
          .limit(1);

        if (getLinksError) throw getLinksError;

        // Calculate the new position
        let newPosition = 0;
        if (links && links.length > 0) {
          newPosition = (links[0].position || 0) + 1;
        }

        // Add new link
        const { error } = await supabase
          .from('links')
          .insert({
            title: link.title,
            url: link.url,
            icon: link.icon || 'link',
            linkType: link.linkType,
            user_id: userId,
            position: newPosition,
            isEmbed: link.isEmbed,
            embedType: link.embedType,
          });

        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      toast.success(variables.id ? "Link updated successfully!" : "Link added successfully!");
    },
    onError: (error) => {
      console.error("Failed to save link:", error);
      toast.error("Failed to save link");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['links', userId] });
    }
  });

  return { saveLink };
};
