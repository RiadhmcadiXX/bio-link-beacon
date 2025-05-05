
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
