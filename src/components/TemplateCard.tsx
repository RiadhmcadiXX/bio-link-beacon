
import React from "react";
import { Card } from "@/components/ui/card";
import { Check, Eye, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

interface TemplateCardProps {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  isActive: boolean;
  isCustomizable?: boolean;
  buttonStyle?: string;
  fontFamily?: string;
  onSelect: () => void;
  onPreview: () => void;
  onCustomize?: () => void;
}

export const TemplateCard = ({
  id,
  name,
  description,
  previewImage,
  isActive,
  isCustomizable = false,
  buttonStyle = "default",
  fontFamily = "default",
  onSelect,
  onPreview,
  onCustomize,
}: TemplateCardProps) => {
  // Sample button styles to preview in the card
  const getButtonPreviewStyle = () => {
    switch (buttonStyle) {
      case "rounded":
        return "rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800";
      case "outline":
        return "border-2 border-gray-800 bg-transparent text-gray-800 hover:bg-gray-100";
      case "gradient":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
      case "minimal":
        return "bg-transparent text-gray-800 hover:underline p-0 h-auto";
      case "shadow":
        return "bg-white text-gray-800 shadow-lg hover:shadow-xl";
      default:
        return "bg-brand-purple hover:bg-brand-purple/90 text-white";
    }
  };

  const fontClassMap: Record<string, string> = {
    inter: "font-inter",
    roboto: "font-roboto",
    poppins: "font-poppins",
    montserrat: "font-montserrat",
    raleway: "font-raleway",
    playfair: "font-playfair",
    lobster: "font-lobster",
    pacifico: "font-pacifico",
    oswald: "font-oswald",
    lato: "font-lato",
    merriweather: "font-merriweather",
    dancing: "font-dancing",
    quicksand: "font-quicksand",
    comfortaa: "font-comfortaa",
    nunito: "font-nunito",
    serif: "font-serif",
    mono: "font-mono",
    display: "font-extrabold tracking-wide",
    handwritten: "italic",
    default: "font-sans",
  };

  // Sample font styles
  const getFontStyle = () => {
    switch (fontFamily) {
      case "serif":
        return "font-serif";
      case "mono":
        return "font-mono";
      case "display":
        return "font-bold tracking-wide";
      case "handwritten":
        return "font-lobster";
      default:
        return "font-sans";
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full relative">
      {isActive && (
        <div className="absolute top-2 right-2 z-10 bg-green-500 text-white rounded-full p-1">
          <Check className="h-4 w-4" />
        </div>
      )}
      <div className="aspect-[400/521] w-full overflow-hidden rounded-md shadow">
        <img
          src={previewImage}
          alt={`${name} template`}
          className="w-full h-full object-cover transition-transform hover:scale-105"
          onClick={onPreview}
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className={`font-medium text-lg ${getFontStyle()}`}>{name}</h3>
        <p className="text-gray-500 text-sm mt-1 mb-4 flex-grow">{description}</p>

        {/* Button style preview */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Button preview:</p>
          <Button
            className={`w-full ${getButtonPreviewStyle()}`}
            disabled
          >
            Sample Button
          </Button>
        </div>

        <div className="flex gap-2 mt-auto">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onPreview}
          >
            <Eye className="h-4 w-4 mr-1" /> Preview
          </Button>

          {isCustomizable && onCustomize ? (
            <Button
              variant="outline"
              className="flex-1 border-dashed"
              onClick={onCustomize}
            >
              <Palette className="h-4 w-4 mr-1" /> Customize
            </Button>
          ) : (
            <Button
              className={`flex-1 ${isActive ? 'bg-gray-400' : 'bg-brand-purple hover:bg-brand-purple/90'}`}
              onClick={onSelect}
              disabled={isActive}
            >
              {isActive ? 'Active' : 'Apply'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
