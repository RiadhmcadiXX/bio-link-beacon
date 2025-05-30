
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Twitter, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Github, 
  Youtube,
  Globe
} from "lucide-react";

interface AddSocialLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (socialLink: any) => void;
}

export const AddSocialLinkDialog = ({ isOpen, onClose, onSave }: AddSocialLinkDialogProps) => {
  const [formData, setFormData] = useState({
    platform: "",
    url: "",
    position: "bottom" // top or bottom
  });

  const socialPlatforms = [
    { value: "instagram", label: "Instagram", icon: <Instagram className="h-4 w-4" />, baseUrl: "https://instagram.com/" },
    { value: "facebook", label: "Facebook", icon: <Facebook className="h-4 w-4" />, baseUrl: "https://facebook.com/" },
    { value: "twitter", label: "Twitter", icon: <Twitter className="h-4 w-4" />, baseUrl: "https://twitter.com/" },
    { value: "linkedin", label: "LinkedIn", icon: <Linkedin className="h-4 w-4" />, baseUrl: "https://linkedin.com/in/" },
    { value: "github", label: "GitHub", icon: <Github className="h-4 w-4" />, baseUrl: "https://github.com/" },
    { value: "youtube", label: "YouTube", icon: <Youtube className="h-4 w-4" />, baseUrl: "https://youtube.com/" },
    { value: "website", label: "Website", icon: <Globe className="h-4 w-4" />, baseUrl: "https://" }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePlatformChange = (value: string) => {
    setFormData({ ...formData, platform: value });
  };

  const handlePositionChange = (value: string) => {
    setFormData({ ...formData, position: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.platform || !formData.url) {
      return;
    }

    const selectedPlatform = socialPlatforms.find(p => p.value === formData.platform);
    const fullUrl = formData.url.startsWith('http') ? formData.url : selectedPlatform?.baseUrl + formData.url;

    const socialLink = {
      title: selectedPlatform?.label || formData.platform,
      url: fullUrl,
      icon: formData.platform,
      link_type: "social",
      social_position: formData.position,
      position: formData.position === "top" ? -1 : 999, // Use -1 for top, 999 for bottom
    };

    onSave(socialLink);
    setFormData({ platform: "", url: "", position: "bottom" });
    onClose();
  };

  const selectedPlatform = socialPlatforms.find(p => p.value === formData.platform);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Social Link</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="platform">Social Platform</Label>
              <Select
                value={formData.platform}
                onValueChange={handlePlatformChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
                <SelectContent>
                  {socialPlatforms.map(platform => (
                    <SelectItem key={platform.value} value={platform.value}>
                      <div className="flex items-center">
                        {platform.icon}
                        <span className="ml-2">{platform.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="url">
                {selectedPlatform?.value === 'website' ? 'Website URL' : 'Username or URL'}
              </Label>
              <div className="flex items-center">
                {selectedPlatform && selectedPlatform.value !== 'website' && (
                  <span className="text-sm text-gray-500 mr-1">{selectedPlatform.baseUrl}</span>
                )}
                <Input
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  placeholder={selectedPlatform?.value === 'website' ? 'https://yourwebsite.com' : 'username'}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="position">Display Position</Label>
              <Select
                value={formData.position}
                onValueChange={handlePositionChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Top (under username)</SelectItem>
                  <SelectItem value="bottom">Bottom (end of page)</SelectItem>
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
              className="bg-brand-purple hover:bg-brand-purple/90"
              disabled={!formData.platform || !formData.url}
            >
              Add Social Link
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
