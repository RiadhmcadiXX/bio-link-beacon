
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
    linkType?: string;
    clicks: number;
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
      default:
        return <Link2 className="h-4 w-4" />;
    }
  };

  // Function to get background color based on link type
  const getLinkTypeStyles = () => {
    switch (link.linkType) {
      case 'social':
        return 'bg-blue-50';
      case 'product':
        return 'bg-green-50';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <Card className={`p-4 ${isDragging ? 'opacity-60' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div 
            className="mr-2 cursor-grab text-gray-400 hover:text-gray-600" 
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
