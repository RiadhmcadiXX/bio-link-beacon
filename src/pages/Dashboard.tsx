
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { LinkItem } from "@/components/LinkItem";
import { EditLinkDialog } from "@/components/EditLinkDialog";

interface Link {
  id: string;
  title: string;
  url: string;
  icon: string;
  linkType?: string;
  clicks: number;
  position: number;
}

const Dashboard = () => {
  const { user } = useAuthContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const queryClient = useQueryClient();

  // Fetch links
  const { data: links, isLoading, error } = useQuery({
    queryKey: ['links', user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
        .order('position', { ascending: true });
        
      if (error) throw error;
      return data as Link[];
    },
    enabled: !!user,
  });

  // Link mutations
  const saveLink = useMutation({
    mutationFn: async (link: Partial<Link>) => {
      if (!user) throw new Error("Not authenticated");
      
      if (link.id) {
        // Update existing link
        const { error } = await supabase
          .from('links')
          .update({
            title: link.title,
            url: link.url,
            icon: link.icon,
          })
          .eq('id', link.id)
          .eq('user_id', user.id);
        
        if (error) throw error;
      } else {
        // Add new link - get the highest position value and add 1
        let newPosition = 0;
        if (links && links.length > 0) {
          // Find the highest position
          const maxPosition = Math.max(...links.map(l => l.position || 0));
          newPosition = maxPosition + 1;
        }
        
        // Add new link
        const { error } = await supabase
          .from('links')
          .insert({
            title: link.title,
            url: link.url,
            icon: link.icon || 'link',
            user_id: user.id,
            position: newPosition,
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links', user?.id] });
      setIsDialogOpen(false);
      toast.success(editingLink?.id ? "Link updated successfully!" : "Link added successfully!");
    },
    onError: (error) => {
      console.error("Failed to save link:", error);
      toast.error("Failed to save link");
    }
  });

  // Delete link mutation
  const deleteLink = useMutation({
    mutationFn: async (linkId: string) => {
      if (!user) throw new Error("Not authenticated");
      
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', linkId)
        .eq('user_id', user.id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links', user?.id] });
      toast.success("Link deleted successfully!");
    },
    onError: (error) => {
      console.error("Failed to delete link:", error);
      toast.error("Failed to delete link");
    }
  });

  // Update link order mutation
  const updateLinkOrder = useMutation({
    mutationFn: async ({ linkId, direction }: { linkId: string, direction: 'up' | 'down' }) => {
      if (!user || !links) throw new Error("Not authenticated or no links");
      
      // Find the current link and its index
      const currentIndex = links.findIndex(link => link.id === linkId);
      if (currentIndex === -1) throw new Error("Link not found");
      
      const currentLink = links[currentIndex];
      
      // Determine the target index based on direction
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= links.length) {
        throw new Error("Cannot move link further");
      }
      
      const targetLink = links[targetIndex];
      
      // Swap positions
      const currentPosition = currentLink.position;
      const targetPosition = targetLink.position;
      
      // Update the current link position
      const { error: error1 } = await supabase
        .from('links')
        .update({ position: targetPosition })
        .eq('id', currentLink.id)
        .eq('user_id', user.id);
      
      if (error1) throw error1;
      
      // Update the target link position
      const { error: error2 } = await supabase
        .from('links')
        .update({ position: currentPosition })
        .eq('id', targetLink.id)
        .eq('user_id', user.id);
      
      if (error2) throw error2;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links', user?.id] });
    },
    onError: (error) => {
      console.error("Failed to update link order:", error);
      toast.error("Failed to update the link order");
    }
  });

  const handleOpenNewLinkDialog = () => {
    setEditingLink(null);
    setIsDialogOpen(true);
  };

  const handleEditLink = (link: Link) => {
    setEditingLink(link);
    setIsDialogOpen(true);
  };

  const handleSaveLink = (link: Partial<Link>) => {
    saveLink.mutate(link);
  };

  const handleDeleteLink = (linkId: string) => {
    if (confirm("Are you sure you want to delete this link?")) {
      deleteLink.mutate(linkId);
    }
  };

  const handleMoveUp = (linkId: string) => {
    updateLinkOrder.mutate({ linkId, direction: 'up' });
  };

  const handleMoveDown = (linkId: string) => {
    updateLinkOrder.mutate({ linkId, direction: 'down' });
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Links</h1>
          <Button onClick={handleOpenNewLinkDialog} className="bg-brand-purple hover:bg-brand-purple/90">
            <Plus className="h-4 w-4 mr-2" /> Add Link
          </Button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-6">Loading links...</div>
        ) : error ? (
          <Card className="p-6 text-center">
            <p className="text-red-500">Error loading links</p>
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['links', user?.id] })} className="mt-2">
              Retry
            </Button>
          </Card>
        ) : links && links.length > 0 ? (
          <div className="space-y-3">
            {links.map((link, index) => (
              <LinkItem 
                key={link.id}
                link={link}
                onEdit={() => handleEditLink(link)}
                onDelete={() => handleDeleteLink(link.id)}
                onMoveUp={() => handleMoveUp(link.id)}
                onMoveDown={() => handleMoveDown(link.id)}
                isFirst={index === 0}
                isLast={index === links.length - 1}
              />
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <p className="mb-4">You don't have any links yet.</p>
            <Button onClick={handleOpenNewLinkDialog} className="bg-brand-purple hover:bg-brand-purple/90">
              <Plus className="h-4 w-4 mr-2" /> Add your first link
            </Button>
          </Card>
        )}
      </div>
      
      <EditLinkDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        link={editingLink}
        onSave={handleSaveLink}
      />
    </Layout>
  );
};

export default Dashboard;
