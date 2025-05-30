
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Package } from "lucide-react";

interface AddProductLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productLink: any) => void;
}

export const AddProductLinkDialog = ({ isOpen, onClose, onSave }: AddProductLinkDialogProps) => {
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    imageUrl: "",
    price: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.url) {
      return;
    }

    const productLink = {
      title: formData.title,
      url: formData.url,
      description: formData.description,
      imageUrl: formData.imageUrl,
      price: formData.price,
      icon: "package",
      link_type: "product",
    };

    onSave(productLink);
    setFormData({ title: "", url: "", description: "", imageUrl: "", price: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Add Product Link
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Product Name *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Amazing Product"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="url">Product URL *</Label>
              <Input
                id="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://example.com/product"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of your product..."
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Product Image URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="$99.99"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-brand-purple hover:bg-brand-purple/90"
              disabled={!formData.title || !formData.url}
            >
              Add Product
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
