
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

      console.log("Saving link with data:", link);

      // Handle different link types
      const linkType = link.linkType || link.link_type || 'general';
      
      // Special case for embed links - ensure linkType is set
      if (link.isEmbed) {
        link.linkType = 'embed';
        link.link_type = 'embed';
      }

      // Prepare the data to save
      const dataToSave = {
        title: link.title,
        url: link.url,
        icon: link.icon,
        link_type: linkType,
        description: link.description,
        imageurl: link.imageUrl || null, // Ensure we save the imageUrl to imageurl field
        price: link.price,
      };

      console.log("Data being saved to database:", dataToSave);

      // Check if this is an update (link has an id and it's not empty)
      if (link.id && link.id.trim() !== '') {
        // Update existing link
        const { error } = await supabase
          .from('links')
          .update(dataToSave)
          .eq('id', link.id)
          .eq('user_id', userId);

        if (error) {
          console.error("Error updating link:", error);
          throw error;
        }
        
        console.log("Link updated successfully");
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
            ...dataToSave,
            user_id: userId,
            position: newPosition,
          });

        if (error) {
          console.error("Error creating link:", error);
          throw error;
        }
        
        console.log("Link created successfully");
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
