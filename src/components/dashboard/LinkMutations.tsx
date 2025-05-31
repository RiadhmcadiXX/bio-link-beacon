
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Link {
  id?: string;
  title: string;
  url: string;
  icon: string;
  linkType?: string;
  link_type?: string;
  clicks: number;
  position: number;
  isEmbed?: boolean;
  embedType?: string;
  description?: string;
  imageUrl?: string;
  price?: string;
}

export const useLinkMutations = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  // Link mutations
  const saveLink = useMutation({
    mutationFn: async (link: Partial<Link>) => {
      if (!userId) throw new Error("Not authenticated");

      // Handle different link types
      const linkType = link.linkType || link.link_type || 'general';
      
      // Special case for embed links - ensure linkType is set
      if (link.isEmbed) {
        link.linkType = 'embed';
        link.link_type = 'embed';
      }

      // Check if this is an update (link has an id and it's not empty)
      if (link.id && link.id.trim() !== '') {
        // Update existing link
        const { error } = await supabase
          .from('links')
          .update({
            title: link.title,
            url: link.url,
            icon: link.icon,
            link_type: linkType,
            description: link.description,
            imageurl: link.imageUrl, // Make sure to use imageUrl from form
            price: link.price,
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
            link_type: linkType,
            user_id: userId,
            position: newPosition,
            description: link.description,
            imageurl: link.imageUrl, // Make sure to use imageUrl from form
            price: link.price,
          });

        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      toast.success(variables.id && variables.id.trim() !== '' ? "Link updated successfully!" : "Link added successfully!");
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
