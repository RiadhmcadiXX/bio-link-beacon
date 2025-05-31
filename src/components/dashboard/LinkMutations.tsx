
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

      console.log("=== NEW MUTATION APPROACH START ===");
      console.log("Incoming link data:", JSON.stringify(link, null, 2));

      // Normalize the link type
      let finalLinkType = 'general';
      if (link.isEmbed || link.linkType === 'embed' || link.link_type === 'embed') {
        finalLinkType = 'embed';
      } else if (link.linkType) {
        finalLinkType = link.linkType;
      } else if (link.link_type) {
        finalLinkType = link.link_type;
      }

      // Prepare the complete link object with all required fields
      const linkRecord = {
        title: String(link.title || ''),
        url: String(link.url || ''),
        icon: String(link.icon || 'link'),
        link_type: String(finalLinkType),
        description: link.description ? String(link.description) : null,
        image_url: link.image_url ? String(link.image_url) : null,
        price: link.price ? String(link.price) : null,
        clicks: Number(link.clicks || 0),
        position: Number(link.position || 0)
      };

      console.log("Prepared link record:", JSON.stringify(linkRecord, null, 2));
      console.log("Image URL being saved:", linkRecord.image_url);
      console.log("Price being saved:", linkRecord.price);

      let result;

      // Check if this is an update or insert
      if (link.id && String(link.id).trim() !== '') {
        console.log("UPDATING existing link with ID:", link.id);
        
        const { data, error } = await supabase
          .from('links')
          .update({
            title: linkRecord.title,
            url: linkRecord.url,
            icon: linkRecord.icon,
            link_type: linkRecord.link_type,
            description: linkRecord.description,
            image_url: linkRecord.image_url,
            price: linkRecord.price,
            clicks: linkRecord.clicks,
            position: linkRecord.position
          })
          .eq('id', String(link.id))
          .eq('user_id', userId)
          .select('*');

        if (error) {
          console.error("UPDATE error:", error);
          throw new Error(`Failed to update link: ${error.message}`);
        }

        result = data;
        console.log("UPDATE result:", JSON.stringify(result, null, 2));
        
      } else {
        console.log("INSERTING new link");
        
        // Get the highest position for new links
        const { data: existingLinks } = await supabase
          .from('links')
          .select('position')
          .eq('user_id', userId)
          .order('position', { ascending: false })
          .limit(1);

        const newPosition = existingLinks && existingLinks.length > 0 
          ? (existingLinks[0].position || 0) + 1 
          : 0;

        const insertData = {
          user_id: userId,
          title: linkRecord.title,
          url: linkRecord.url,
          icon: linkRecord.icon,
          link_type: linkRecord.link_type,
          description: linkRecord.description,
          image_url: linkRecord.image_url,
          price: linkRecord.price,
          clicks: 0,
          position: newPosition
        };

        console.log("INSERT data:", JSON.stringify(insertData, null, 2));

        const { data, error } = await supabase
          .from('links')
          .insert([insertData])
          .select('*');

        if (error) {
          console.error("INSERT error:", error);
          throw new Error(`Failed to create link: ${error.message}`);
        }

        result = data;
        console.log("INSERT result:", JSON.stringify(result, null, 2));
      }

      // Verify the saved data
      if (result && result.length > 0) {
        console.log("VERIFICATION - Saved image_url:", result[0].image_url);
        console.log("VERIFICATION - Saved price:", result[0].price);
        console.log("VERIFICATION - Complete saved record:", JSON.stringify(result[0], null, 2));
      }

      console.log("=== NEW MUTATION APPROACH END ===");
      return result;
    },
    onSuccess: (_, variables) => {
      const isUpdate = variables.id && String(variables.id).trim() !== '';
      toast.success(isUpdate ? "Link updated successfully!" : "Link added successfully!");
      queryClient.invalidateQueries({ queryKey: ['links', userId] });
    },
    onError: (error) => {
      console.error("MUTATION ERROR:", error);
      toast.error(`Failed to save link: ${error.message}`);
    }
  });

  return { saveLink };
};
