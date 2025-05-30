
import React, { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Link2, 
  Twitter, 
  Youtube, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Github, 
  Globe,
  Mail,
  Phone,
  ShoppingCart,
  Package,
  Video
} from "lucide-react";

interface EditLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  link: any;
  onSave: (link: any) => void;
}

export const EditLinkDialog = ({ isOpen, onClose, link, onSave }: EditLinkDialogProps) => {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    url: "",
    icon: "link",
    linkType: "general",
    clicks: 0,
    position: 0,
    embedType: "direct",
    isEmbed: false,
    description: "",
    imageUrl: "",
    price: ""
  });

  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    if (link) {
      setFormData({
        id: link.id || "",
        title: link.title || "",
        url: link.url || "",
        icon: link.icon || "link",
        linkType: link.linkType || link.link_type || "general",
        clicks: link.clicks || 0,
        position: link.position || 0,
        embedType: link.embedType || "direct",
        isEmbed: link.isEmbed || false,
        description: link.description || "",
        imageUrl: link.imageUrl || link.imageurl || "",
        price: link.price || ""
      });
      
      // Set the active tab based on the link type
      if (link.linkType === "social" || link.link_type === "social") setActiveTab("social");
      else if (link.linkType === "product" || link.link_type === "product") setActiveTab("product");
      else if (link.linkType === "embed" || link.link_type === "embed" || link.isEmbed) setActiveTab("embed");
      else setActiveTab("general");
    }
  }, [link]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleIconChange = (value: string) => {
    setFormData({ ...formData, icon: value });
  };

  const handleLinkTypeChange = (value: string) => {
    setActiveTab(value);
    setFormData({ ...formData, linkType: value });
    
    // Set default icon based on link type
    if (value === "social") {
      setFormData(prev => ({ ...prev, icon: prev.icon === "link" ? "twitter" : prev.icon, isEmbed: false }));
    } else if (value === "product") {
      setFormData(prev => ({ ...prev, icon: prev.icon === "link" ? "package" : prev.icon, isEmbed: false }));
    } else if (value === "embed") {
      setFormData(prev => ({ ...prev, 
        icon: "video", 
        isEmbed: true 
      }));
    } else {
      setFormData(prev => ({ ...prev, isEmbed: false }));
    }
  };

  const handleEmbedTypeChange = (value: string) => {
    setFormData({ ...formData, embedType: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Make sure to set isEmbed correctly for embed type links
    let submissionData = { ...formData };
    if (activeTab === "embed") {
      submissionData.isEmbed = true;
      submissionData.linkType = "embed";
    }
    
    // Set link_type for consistency with database
    submissionData.link_type = submissionData.linkType;
    
    onSave(submissionData);
  };

  // Make sure URL has protocol
  const validateUrl = (url: string) => {
    if (!url) return url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Validate if URL is a valid YouTube URL
  const isYouTubeUrl = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    return !!videoId;
  };

  // Get social platforms icon options based on link type
  const getIconOptions = () => {
    const commonIcons = [
      { value: "link", label: "Link", icon: <Link2 className="h-4 w-4 mr-2" /> },
      { value: "globe", label: "Website", icon: <Globe className="h-4 w-4 mr-2" /> }
    ];

    const socialIcons = [
      { value: "twitter", label: "Twitter", icon: <Twitter className="h-4 w-4 mr-2" /> },
      { value: "youtube", label: "YouTube", icon: <Youtube className="h-4 w-4 mr-2" /> },
      { value: "facebook", label: "Facebook", icon: <Facebook className="h-4 w-4 mr-2" /> },
      { value: "instagram", label: "Instagram", icon: <Instagram className="h-4 w-4 mr-2" /> },
      { value: "linkedin", label: "LinkedIn", icon: <Linkedin className="h-4 w-4 mr-2" /> },
      { value: "github", label: "GitHub", icon: <Github className="h-4 w-4 mr-2" /> }
    ];

    const productIcons = [
      { value: "shopping-cart", label: "Shopping Cart", icon: <ShoppingCart className="h-4 w-4 mr-2" /> },
      { value: "package", label: "Package", icon: <Package className="h-4 w-4 mr-2" /> }
    ];

    const contactIcons = [
      { value: "mail", label: "Email", icon: <Mail className="h-4 w-4 mr-2" /> },
      { value: "phone", label: "Phone", icon: <Phone className="h-4 w-4 mr-2" /> }
    ];

    const embedIcons = [
      { value: "video", label: "Video", icon: <Video className="h-4 w-4 mr-2" /> },
      { value: "youtube", label: "YouTube", icon: <Youtube className="h-4 w-4 mr-2" /> }
    ];

    switch (formData.linkType) {
      case "social":
        return [...commonIcons, ...socialIcons];
      case "product":
        return [...commonIcons, ...productIcons];
      case "contact":
        return [...commonIcons, ...contactIcons];
      case "embed":
        return embedIcons;
      default:
        return [...commonIcons, ...socialIcons, ...productIcons, ...contactIcons];
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{formData.id ? "Edit Link" : "Add New Link"}</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <Tabs 
              value={activeTab} 
              onValueChange={handleLinkTypeChange}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
                <TabsTrigger value="product">Product</TabsTrigger>
                <TabsTrigger value="embed">Embed</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="mt-0 space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Link Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="My Website"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    required
                  />
                </div>
              </TabsContent>

              <TabsContent value="social" className="mt-0 space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Profile Name</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Twitter Profile"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="url">Profile URL</Label>
                  <Input
                    id="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    placeholder="https://twitter.com/username"
                    required
                  />
                </div>
              </TabsContent>

              <TabsContent value="product" className="mt-0 space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Product Name</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="My Amazing Product"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="url">Product URL</Label>
                  <Input
                    id="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    placeholder="https://shop.com/product"
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
              </TabsContent>

              <TabsContent value="embed" className="mt-0 space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Video Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="My YouTube Video"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="url">YouTube URL</Label>
                  <Input
                    id="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    required
                  />
                  {formData.url && !isYouTubeUrl(formData.url) && (
                    <p className="text-sm text-red-500">
                      Please enter a valid YouTube URL
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="embedType">Display Style</Label>
                  <Select
                    value={formData.embedType}
                    onValueChange={handleEmbedTypeChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select display style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="direct">
                        <div className="flex items-center">
                          <span>Show Directly</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="collapsible">
                        <div className="flex items-center">
                          <span>Show in Collapsible</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>

            <div className="grid gap-2 mt-4">
              <Label htmlFor="icon">Icon</Label>
              <Select
                value={formData.icon}
                onValueChange={handleIconChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  {getIconOptions().map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center">
                        {option.icon}
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              onClick={() => {
                formData.url = validateUrl(formData.url);
              }}
              className="bg-brand-purple hover:bg-brand-purple/90"
              disabled={activeTab === "embed" && !isYouTubeUrl(formData.url)}
            >
              Save Link
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
