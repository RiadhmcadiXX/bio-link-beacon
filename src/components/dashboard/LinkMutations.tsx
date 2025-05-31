
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
  image_url?: string;
  price?: string;
}

export const useLinkMutations = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  // Link mutations
  const saveLink = useMutation({
    mutationFn: async (link: Partial<Link>) => {
      if (!userId) throw new Error("Not authenticated");

      console.log("=== MUTATION DEBUG START ===");
      console.log("Received link data:", link);
      console.log("Image URL received:", link.image_url);

      // Handle different link types
      const linkType = link.linkType || link.link_type || 'general';
      
      // Special case for embed links - ensure linkType is set
      if (link.isEmbed) {
        link.linkType = 'embed';
        link.link_type = 'embed';
      }

      // Create the exact data structure that matches database schema
      const linkDataForDB = {
        title: link.title,
        url: link.url,
        icon: link.icon || 'link',
        link_type: linkType,
        description: link.description || null,
        image_url: link.image_url || null, // This MUST match the database column name
        price: link.price || null,
      };

      console.log("Prepared data for database:", linkDataForDB);
      console.log("Image URL for database:", linkDataForDB.image_url);

      // Check if this is an update (link has an id and it's not empty)
      if (link.id && link.id.trim() !== '') {
        console.log("Updating existing link with ID:", link.id);
        
        // Update existing link
        const { data: updateResult, error } = await supabase
          .from('links')
          .update(linkDataForDB)
          .eq('id', link.id)
          .eq('user_id', userId)
          .select();

        if (error) {
          console.error("Database update error:", error);
          throw error;
        }
        
        console.log("Update successful, result:", updateResult);
        console.log("Updated link image_url:", updateResult?.[0]?.image_url);
      } else {
        console.log("Creating new link");
        
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

        const finalInsertData = {
          ...linkDataForDB,
          user_id: userId,
          position: newPosition,
        };

        console.log("Final insert data:", finalInsertData);
        console.log("Final image_url for insert:", finalInsertData.image_url);

        // Insert new link
        const { data: insertResult, error } = await supabase
          .from('links')
          .insert(finalInsertData)
          .select();

        if (error) {
          console.error("Database insert error:", error);
          throw error;
        }
        
        console.log("Insert successful, result:", insertResult);
        console.log("Inserted link image_url:", insertResult?.[0]?.image_url);
      }
      
      console.log("=== MUTATION DEBUG END ===");
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
