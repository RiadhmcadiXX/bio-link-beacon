
import React from "react";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TemplateCardProps {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  isActive: boolean;
  onSelect: () => void;
  onPreview: () => void;
}

export const TemplateCard = ({
  id,
  name,
  description,
  previewImage,
  isActive,
  onSelect,
  onPreview,
}: TemplateCardProps) => {
  return (
    <Card className="overflow-hidden flex flex-col h-full relative">
      {isActive && (
        <div className="absolute top-2 right-2 z-10 bg-green-500 text-white rounded-full p-1">
          <Check className="h-4 w-4" />
        </div>
      )}
      <div className="h-40 overflow-hidden">
        <img
          src={previewImage}
          alt={`${name} template`}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-medium text-lg">{name}</h3>
        <p className="text-gray-500 text-sm mt-1 mb-4 flex-grow">{description}</p>
        <div className="flex gap-2 mt-auto">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={onPreview}
          >
            Preview
          </Button>
          <Button 
            className={`flex-1 ${isActive ? 'bg-gray-400' : 'bg-brand-purple hover:bg-brand-purple/90'}`}
            onClick={onSelect}
            disabled={isActive}
          >
            {isActive ? 'Active' : 'Apply'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
