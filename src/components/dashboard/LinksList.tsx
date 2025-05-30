
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { LinkItem } from "@/components/LinkItem";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface Link {
  id: string;
  title: string;
  url: string;
  icon: string;
  linkType?: string;
  link_type?: string;
  clicks: number;
  position: number;
  description?: string;
  imageUrl?: string;
  imageurl?: string;
  price?: string;
  isEmbed?: boolean;
  embedType?: string;
}

interface LinksListProps {
  links: Link[] | undefined;
  isLoading: boolean;
  error: Error | null;
  userId: string | undefined;
  onEditLink: (link: Link) => void;
  onOpenNewLinkDialog: () => void;
}

export const LinksList = ({ 
  links, 
  isLoading, 
  error, 
  userId,
  onEditLink, 
  onOpenNewLinkDialog 
}: LinksListProps) => {
  const queryClient = useQueryClient();

  // Delete link mutation
  const deleteLink = useMutation({
    mutationFn: async (linkId: string) => {
      if (!userId) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', linkId)
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Link deleted successfully!");
    },
    onError: (error) => {
      console.error("Failed to delete link:", error);
      toast.error("Failed to delete link");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['links', userId] });
    }
  });

  // Update link order mutation - handles ALL link types including products
  const updateLinksOrder = useMutation({
    mutationFn: async ({ links }: { links: Link[] }) => {
      if (!userId) throw new Error("Not authenticated or no links");

      // Create an array of update promises for ALL links
      const updatePromises = links.map((link, index) => {
        return supabase
          .from('links')
          .update({ position: index })
          .eq('id', link.id)
          .eq('user_id', userId);
      });

      // Execute all updates
      const results = await Promise.all(updatePromises);
      
      // Check for errors
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        throw new Error("Failed to update one or more link positions");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links', userId] });
      toast.success("Link order updated successfully!");
    },
    onError: (error) => {
      console.error("Failed to update link order:", error);
      toast.error("Failed to update the link order");
    }
  });

  const handleDeleteLink = (linkId: string) => {
    if (confirm("Are you sure you want to delete this link?")) {
      deleteLink.mutate(linkId);
    }
  };

  // Handle drag end event for ALL link types
  const handleDragEnd = (result: any) => {
    // Dropped outside the list
    if (!result.destination || !links) {
      return;
    }

    // If the position didn't change
    if (result.destination.index === result.source.index) {
      return;
    }

    // Reorder the array (includes ALL link types: regular, product, social, embed)
    const reorderedLinks = Array.from(links);
    const [removed] = reorderedLinks.splice(result.source.index, 1);
    reorderedLinks.splice(result.destination.index, 0, removed);

    // Update positions in the UI immediately for better UX
    const updatedLinks = reorderedLinks.map((link, index) => ({
      ...link,
      position: index
    }));

    // Optimistically update the UI
    queryClient.setQueryData(['links', userId], updatedLinks);

    // Send the update to the server
    updateLinksOrder.mutate({ links: updatedLinks });
  };

  if (isLoading) {
    return <div className="text-center py-6">Loading links...</div>;
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <p className="text-red-500">Error loading links</p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['links', userId] })} className="mt-2">
          Retry
        </Button>
      </Card>
    );
  }

  if (!links || links.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="mb-4">You don't have any links yet.</p>
        <Button onClick={onOpenNewLinkDialog} className="bg-brand-purple hover:bg-brand-purple/90">
          <Plus className="h-4 w-4 mr-2" /> Add your first link
        </Button>
      </Card>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="links-list">
        {(provided) => (
          <div 
            className="space-y-3"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {links.map((link, index) => (
              <Draggable 
                key={link.id} 
                draggableId={link.id} 
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <LinkItem
                      link={link}
                      onEdit={() => onEditLink(link)}
                      onDelete={() => handleDeleteLink(link.id)}
                      isDragging={snapshot.isDragging}
                      dragHandleProps={provided.dragHandleProps}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
