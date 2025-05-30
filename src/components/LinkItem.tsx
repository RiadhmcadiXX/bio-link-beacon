
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Video,
  Pencil, 
  Trash2,
  GripVertical
} from "lucide-react";

interface LinkItemProps {
  link: {
    id: string;
    title: string;
    url: string;
    icon: string;
    link_type?: string;
    clicks: number;
    isEmbed?: boolean;
    embedType?: string;
    description?: string;
    imageUrl?: string;
    price?: string;
  };
  onEdit: () => void;
  onDelete: () => void;
  isDragging?: boolean;
  dragHandleProps?: any;
}

export const LinkItem = ({ 
  link, 
  onEdit, 
  onDelete,
  isDragging,
  dragHandleProps
}: LinkItemProps) => {
  // Function to render icon based on link.icon
  const renderIcon = () => {
    switch (link.icon) {
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      case 'github':
        return <Github className="h-4 w-4" />;
      case 'globe':
        return <Globe className="h-4 w-4" />;
      case 'mail':
        return <Mail className="h-4 w-4" />;
      case 'phone':
        return <Phone className="h-4 w-4" />;
      case 'shopping-cart':
        return <ShoppingCart className="h-4 w-4" />;
      case 'package':
        return <Package className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      default:
        return <Link2 className="h-4 w-4" />;
    }
  };

  // Function to get background color based on link type
  const getLinkTypeStyles = () => {
    switch (link.link_type) {
      case 'social':
        return 'bg-blue-50';
      case 'product':
        return 'bg-green-50';
      case 'embed':
        return 'bg-purple-50';
      default:
        return 'bg-gray-100';
    }
  };

  // Extract YouTube video ID for display
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <Card className={`p-4 ${isDragging ? 'opacity-60' : ''} transition-all`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div 
            className="mr-2 cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing" 
            {...dragHandleProps}
          >
            <GripVertical className="h-5 w-5" />
          </div>
          <div className={`w-10 h-10 rounded-md ${getLinkTypeStyles()} flex items-center justify-center mr-4`}>
            {renderIcon()}
          </div>
          <div>
            <h3 className="font-medium">{link.title}</h3>
            <a 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-gray-500 hover:text-brand-purple truncate block max-w-[200px] sm:max-w-[300px]"
            >
              {link.url}
            </a>
            {link.link_type === 'product' && (
              <div className="text-xs text-gray-600 mt-1">
                {link.price && <span className="text-green-600 font-medium mr-2">{link.price}</span>}
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">Product</span>
              </div>
            )}
            {link.isEmbed && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded mt-1 inline-block">
                {link.embedType === "collapsible" ? "Collapsible Embed" : "Video Embed"}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <div className="mr-4 text-right hidden sm:block">
            <p className="text-sm font-medium">{link.clicks}</p>
            <p className="text-xs text-gray-500">clicks</p>
          </div>
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
