
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Edit2, 
  Trash2, 
  GripVertical, 
  ExternalLink,
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

interface LinkItemProps {
  link: {
    id: string;
    title: string;
    url: string;
    icon: string;
    link_type?: string;
    clicks: number;
    description?: string;
    imageUrl?: string;
    imageurl?: string;
    price?: string;
    isEmbed?: boolean;
    embedType?: string;
  };
  onEdit: () => void;
  onDelete: () => void;
  isDragging?: boolean;
  dragHandleProps?: any;
}

export const LinkItem = ({ link, onEdit, onDelete, isDragging, dragHandleProps }: LinkItemProps) => {
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
      case 'website':
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

  // Handle image URL - check both imageUrl and imageurl
  const imageUrl = link.imageUrl || link.imageurl;

  const getLinkTypeLabel = () => {
    switch (link.link_type) {
      case 'social':
        return 'Social';
      case 'product':
        return 'Product';
      case 'embed':
        return 'Embed';
      default:
        return 'Link';
    }
  };

  return (
    <Card 
      className={`p-4 transition-all duration-200 ${
        isDragging ? "shadow-lg rotate-1 opacity-90" : "hover:shadow-md"
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Drag Handle */}
        <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>

        {/* Product Image or Icon */}
        {link.link_type === 'product' && imageUrl ? (
          <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
            <img 
              src={imageUrl} 
              alt={link.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to package icon if image fails to load
                e.currentTarget.style.display = 'none';
                const fallbackDiv = document.createElement('div');
                fallbackDiv.className = 'w-full h-full flex items-center justify-center';
                fallbackDiv.innerHTML = '<svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>';
                e.currentTarget.parentElement?.appendChild(fallbackDiv);
              }}
            />
          </div>
        ) : (
          <div className="text-gray-500">
            {renderIcon()}
          </div>
        )}

        {/* Link Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-gray-900 truncate">{link.title}</h4>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex-shrink-0">
              {getLinkTypeLabel()}
            </span>
          </div>
          
          {link.description && (
            <p className="text-sm text-gray-600 mb-1 line-clamp-1">{link.description}</p>
          )}
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              {link.clicks} clicks
            </span>
            {link.price && (
              <span className="text-green-600 font-medium">{link.price}</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="h-8 w-8 p-0"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
