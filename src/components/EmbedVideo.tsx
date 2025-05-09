
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Play } from "lucide-react";

interface EmbedVideoProps {
  url: string;
  title: string;
  isCollapsible?: boolean;
  themeColor?: string;
}

export const EmbedVideo = ({ url, title, isCollapsible = false, themeColor = "purple" }: EmbedVideoProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const videoId = getYouTubeVideoId(url);
  
  // Get theme color styles
  const getThemeStyles = () => {
    switch (themeColor) {
      case 'blue':
        return { bg: 'bg-brand-blue/10', text: 'text-brand-blue', border: 'border-brand-blue/30' };
      case 'pink':
        return { bg: 'bg-brand-pink/10', text: 'text-brand-pink', border: 'border-brand-pink/30' };
      case 'orange':
        return { bg: 'bg-brand-orange/10', text: 'text-brand-orange', border: 'border-brand-orange/30' };
      default: // purple
        return { bg: 'bg-brand-purple/10', text: 'text-brand-purple', border: 'border-brand-purple/30' };
    }
  };
  
  const themeStyles = getThemeStyles();

  // Extract YouTube video ID
  function getYouTubeVideoId(url: string): string | null {
    if (!url) return null;
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : '';

  if (!videoId) {
    return null;
  }

  if (isCollapsible) {
    return (
      <Collapsible 
        open={isOpen} 
        onOpenChange={setIsOpen}
        className={`w-full border rounded-lg transition-all ${themeStyles.border}`}
      >
        <CollapsibleTrigger className="w-full">
          <div className={`flex items-center justify-between p-4 ${themeStyles.bg} rounded-lg`}>
            <div className="flex items-center">
              <Play className={`h-5 w-5 mr-3 ${themeStyles.text}`} />
              <span className="font-medium">{title}</span>
            </div>
            <div>
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="p-4">
            <div className="relative pt-[56.25%] overflow-hidden rounded-md">
              <iframe 
                className="absolute top-0 left-0 w-full h-full" 
                src={embedUrl} 
                title={title}
                frameBorder="0" 
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="p-4">
        <div className="relative pt-[56.25%] overflow-hidden rounded-md">
          <iframe 
            className="absolute top-0 left-0 w-full h-full" 
            src={embedUrl} 
            title={title}
            frameBorder="0" 
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        </div>
      </CardContent>
    </Card>
  );
};
