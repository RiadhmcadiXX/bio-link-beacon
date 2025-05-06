import React from "react";
import { Button } from "@/components/ui/button";
import { Palette, Check, Eye } from "lucide-react";

interface CustomTemplateTabProps {
  profileData: {
    template: string | null;
  };
  onOpenDialog: () => void;
  onPreview: () => void;
}

export const CustomTemplateTab = ({
  profileData,
  onOpenDialog,
  onPreview,
}: CustomTemplateTabProps) => {
  return (
    <div className="p-6 bg-white rounded-lg border">
      <h2 className="text-xl font-medium mb-4">Create Your Custom Template</h2>
      <p className="text-gray-500 mb-6">
        Design your own unique template by selecting colors, button styles, and fonts to match your brand.
      </p>

      <Button 
        className="bg-brand-purple hover:bg-brand-purple/90"
        onClick={onOpenDialog}
      >
        <Palette className="h-4 w-4 mr-2" /> Customize Template
      </Button>

      {profileData?.template === "custom" && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="flex items-center text-green-700">
            <Check className="h-4 w-4 mr-2" />
            You're currently using a custom template
          </p>
          <Button
            variant="outline"
            className="mt-2"
            onClick={onPreview}
          >
            <Eye className="h-4 w-4 mr-2" /> Preview Your Custom Template
          </Button>
        </div>
      )}
    </div>
  );
};
