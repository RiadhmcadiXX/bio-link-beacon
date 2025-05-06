import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Form, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Palette, Type, Square, Brush } from "lucide-react";
import { LivePreview } from "@/components/LivePreview";

// Define the GradientIcon component since it doesn't exist in lucide-react
const GradientIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 14L10 14" />
    <path d="M12 8L14 8" />
    <path d="M16 16L20 16" />
    <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <path d="M20 4L20 20L4 20L4 4L20 4Z" />
  </svg>
);

interface CustomTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (settings: {
    theme: string;
    buttonStyle: string;
    fontFamily: string;
    customColor?: string;
    gradientFrom?: string;
    gradientTo?: string;
  }) => void;
  initialSettings: {
    theme: string;
    buttonStyle: string;
    fontFamily: string;
    customColor?: string;
    gradientFrom?: string;
    gradientTo?: string;
    animationType?: string;
  };
  profileData?: {
    username: string;
    display_name: string | null;
    bio: string | null;
    avatar_url: string | null;
  };
  links?: Array<{
    id: string;
    title: string;
    url: string;
    icon: string;
    linkType?: string;
    clicks?: number;
  }>;
}

export const CustomTemplateDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialSettings,
  profileData = {
    username: "username",
    display_name: "Display Name",
    bio: "This is a short bio about yourself",
    avatar_url: null,
  },
  links = []
}: CustomTemplateDialogProps) => {
  const [theme, setTheme] = useState(initialSettings.theme);
  const [buttonStyle, setButtonStyle] = useState(initialSettings.buttonStyle);
  const [fontFamily, setFontFamily] = useState(initialSettings.fontFamily);
  const [customColor, setCustomColor] = useState(initialSettings.customColor || "#9b87f5");
  const [gradientFrom, setGradientFrom] = useState(initialSettings.gradientFrom || "#9b87f5");
  const [gradientTo, setGradientTo] = useState(initialSettings.gradientTo || "#D946EF");
  const [activeTab, setActiveTab] = useState("colors");
  const [hasChanges, setHasChanges] = useState(false);
  const [isUsingCustomColor, setIsUsingCustomColor] = useState(false);
  const [isUsingGradient, setIsUsingGradient] = useState(false);

  // Reset state when dialog opens with initialSettings
  useEffect(() => {
    if (isOpen) {
      setTheme(initialSettings.theme);
      setButtonStyle(initialSettings.buttonStyle);
      setFontFamily(initialSettings.fontFamily);
      setCustomColor(initialSettings.customColor || "#9b87f5");
      setGradientFrom(initialSettings.gradientFrom || "#9b87f5");
      setGradientTo(initialSettings.gradientTo || "#D946EF");
      setIsUsingCustomColor(!!initialSettings.customColor);
      setIsUsingGradient(!!initialSettings.gradientFrom && !!initialSettings.gradientTo);
      setHasChanges(false);
    }
  }, [isOpen, initialSettings]);

  // Track changes to enable/disable save button
  useEffect(() => {
    const hasChanged = 
      theme !== initialSettings.theme || 
      buttonStyle !== initialSettings.buttonStyle || 
      fontFamily !== initialSettings.fontFamily ||
      (isUsingCustomColor && customColor !== initialSettings.customColor) ||
      (isUsingGradient && (gradientFrom !== initialSettings.gradientFrom || gradientTo !== initialSettings.gradientTo));
    
    setHasChanges(hasChanged);
  }, [theme, buttonStyle, fontFamily, customColor, gradientFrom, gradientTo, isUsingCustomColor, isUsingGradient, initialSettings]);

  const handleSubmit = () => {
    onSubmit({
      theme,
      buttonStyle,
      fontFamily,
      customColor: isUsingCustomColor ? customColor : undefined,
      gradientFrom: isUsingGradient ? gradientFrom : undefined,
      gradientTo: isUsingGradient ? gradientTo : undefined,
    });
  };

  // Sample button styles to preview
  const getButtonPreviewStyle = (style: string) => {
    switch (style) {
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

  // Color options
  const colorOptions = [
    { value: "purple", label: "Purple", class: "bg-brand-purple" },
    { value: "blue", label: "Blue", class: "bg-brand-blue" },
    { value: "pink", label: "Pink", class: "bg-brand-pink" },
    { value: "orange", label: "Orange", class: "bg-brand-orange" },
  ];

  // Button style options
  const buttonStyleOptions = [
    { value: "default", label: "Default" },
    { value: "rounded", label: "Rounded" },
    { value: "outline", label: "Outline" },
    { value: "gradient", label: "Gradient" },
    { value: "minimal", label: "Minimal" },
    { value: "shadow", label: "Shadow" },
  ];

  // Font family options with many Google Fonts
  const fontFamilyOptions = [
    { value: "inter", label: "Inter (Default)", class: "font-inter" },
    { value: "roboto", label: "Roboto", class: "font-roboto" },
    { value: "poppins", label: "Poppins", class: "font-poppins" },
    { value: "montserrat", label: "Montserrat", class: "font-montserrat" },
    { value: "raleway", label: "Raleway", class: "font-raleway" },
    { value: "playfair", label: "Playfair Display", class: "font-playfair" },
    { value: "lobster", label: "Lobster", class: "font-lobster" },
    { value: "pacifico", label: "Pacifico", class: "font-pacifico" },
    { value: "oswald", label: "Oswald", class: "font-oswald" },
    { value: "lato", label: "Lato", class: "font-lato" },
    { value: "merriweather", label: "Merriweather", class: "font-merriweather" },
    { value: "dancing", label: "Dancing Script", class: "font-dancing" },
    { value: "quicksand", label: "Quicksand", class: "font-quicksand" },
    { value: "comfortaa", label: "Comfortaa", class: "font-comfortaa" },
    { value: "nunito", label: "Nunito", class: "font-nunito" },
  ];

  const getFontClass = (font: string) => {
    const option = fontFamilyOptions.find((f) => f.value === font);
    return option ? option.class : "font-sans";
  };
  
  // Get the effective theme color based on current settings
  const getEffectiveThemeColor = () => {
    if (isUsingCustomColor) {
      return customColor;
    }
    
    switch (theme) {
      case "purple": return "#9b87f5";
      case "blue": return "#33C3F0";
      case "pink": return "#D946EF";
      case "orange": return "#F97316";
      default: return "#9b87f5";
    }
  };

  // Gradient background style for preview
  const getGradientStyle = () => {
    if (isUsingGradient) {
      return `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`;
    }
    return undefined;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Customize Your Template
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 gap-4 overflow-hidden">
          {/* Left side - Customization options */}
          <div className="w-1/2 overflow-y-auto pr-2">
            <Tabs
              defaultValue="colors"
              className="mt-4"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="colors" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" /> Colors
                </TabsTrigger>
                <TabsTrigger value="custom-colors" className="flex items-center gap-2">
                  <Brush className="h-4 w-4" /> Custom
                </TabsTrigger>
                <TabsTrigger value="gradient" className="flex items-center gap-2">
                  <GradientIcon className="h-4 w-4" /> Gradient
                </TabsTrigger>
                <TabsTrigger value="buttons" className="flex items-center gap-2">
                  <Square className="h-4 w-4" /> Buttons
                </TabsTrigger>
                <TabsTrigger value="fonts" className="flex items-center gap-2">
                  <Type className="h-4 w-4" /> Fonts
                </TabsTrigger>
              </TabsList>

              {/* Standard Colors Tab */}
              <div className={`mt-6 ${activeTab !== "colors" && "hidden"}`}>
                <h3 className="text-sm font-medium mb-2">Select Theme Color</h3>
                <div className="grid grid-cols-2 gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => {
                        setTheme(color.value);
                        setIsUsingCustomColor(false);
                        setIsUsingGradient(false);
                      }}
                      className={`flex items-center gap-2 p-3 rounded-md border transition-all ${
                        theme === color.value && !isUsingCustomColor && !isUsingGradient
                          ? "border-brand-purple ring-1 ring-brand-purple"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full ${color.class}`}
                      ></div>
                      <span>{color.label}</span>
                    </button>
                  ))}
                </div>

                <div className="p-4 mt-4 bg-gray-50 rounded-md">
                  <div className="text-xs text-gray-500 mb-2">Preview:</div>
                  <div
                    className={`h-8 w-full rounded-md ${
                      !isUsingCustomColor && !isUsingGradient ? (
                        theme === "purple"
                          ? "bg-brand-purple"
                          : theme === "blue"
                          ? "bg-brand-blue"
                          : theme === "pink"
                          ? "bg-brand-pink"
                          : "bg-brand-orange"
                      ) : (
                        isUsingCustomColor ? 
                        "" : 
                        "bg-gradient-to-r from-purple-500 to-pink-500"
                      )
                    }`}
                    style={{
                      backgroundColor: isUsingCustomColor ? customColor : undefined,
                      background: isUsingGradient ? getGradientStyle() : undefined
                    }}
                  ></div>
                </div>
              </div>

              {/* Custom Color Tab */}
              <div className={`mt-6 ${activeTab !== "custom-colors" && "hidden"}`}>
                <h3 className="text-sm font-medium mb-2">Custom Color</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Input 
                      type="color" 
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input 
                      type="text" 
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="flex-1"
                      placeholder="#9b87f5"
                    />
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => {
                      setIsUsingCustomColor(true);
                      setIsUsingGradient(false);
                    }}
                  >
                    Apply Custom Color
                  </Button>
                </div>

                <div className="p-4 mt-4 bg-gray-50 rounded-md">
                  <div className="text-xs text-gray-500 mb-2">Preview:</div>
                  <div
                    className="h-8 w-full rounded-md"
                    style={{ backgroundColor: customColor }}
                  ></div>
                </div>
              </div>

              {/* Gradient Tab */}
              <div className={`mt-6 ${activeTab !== "gradient" && "hidden"}`}>
                <h3 className="text-sm font-medium mb-2">Gradient Colors</h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <FormLabel className="text-xs mb-1 block">From Color:</FormLabel>
                    <div className="flex items-center gap-3">
                      <Input 
                        type="color" 
                        value={gradientFrom}
                        onChange={(e) => setGradientFrom(e.target.value)}
                        className="w-12 h-10 p-1 cursor-pointer"
                      />
                      <Input 
                        type="text" 
                        value={gradientFrom}
                        onChange={(e) => setGradientFrom(e.target.value)}
                        className="flex-1"
                        placeholder="#9b87f5"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <FormLabel className="text-xs mb-1 block">To Color:</FormLabel>
                    <div className="flex items-center gap-3">
                      <Input 
                        type="color" 
                        value={gradientTo}
                        onChange={(e) => setGradientTo(e.target.value)}
                        className="w-12 h-10 p-1 cursor-pointer"
                      />
                      <Input 
                        type="text" 
                        value={gradientTo}
                        onChange={(e) => setGradientTo(e.target.value)}
                        className="flex-1"
                        placeholder="#D946EF"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => {
                      setIsUsingGradient(true);
                      setIsUsingCustomColor(false);
                    }}
                  >
                    Apply Gradient
                  </Button>
                </div>

                <div className="p-4 mt-4 bg-gray-50 rounded-md">
                  <div className="text-xs text-gray-500 mb-2">Preview:</div>
                  <div
                    className="h-8 w-full rounded-md"
                    style={{ background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)` }}
                  ></div>
                </div>
              </div>

              {/* Buttons Tab */}
              <div className={`mt-6 ${activeTab !== "buttons" && "hidden"}`}>
                <h3 className="text-sm font-medium mb-2">Button Style</h3>
                <Select
                  value={buttonStyle}
                  onValueChange={setButtonStyle}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select button style" />
                  </SelectTrigger>
                  <SelectContent>
                    {buttonStyleOptions.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="p-4 mt-4 bg-gray-50 rounded-md">
                  <div className="text-xs text-gray-500 mb-2">Preview:</div>
                  <Button
                    className={`w-full ${getButtonPreviewStyle(buttonStyle)}`}
                    style={{
                      backgroundColor: isUsingCustomColor ? customColor : undefined,
                      background: isUsingGradient && buttonStyle === "gradient" ? 
                        `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)` : 
                        undefined
                    }}
                  >
                    Button Preview
                  </Button>
                </div>
              </div>

              {/* Fonts Tab */}
              <div className={`mt-6 ${activeTab !== "fonts" && "hidden"}`}>
                <h3 className="text-sm font-medium mb-2">Font Family</h3>
                <Select
                  value={fontFamily}
                  onValueChange={setFontFamily}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select font family" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {fontFamilyOptions.map((font) => (
                      <SelectItem key={font.value} value={font.value} className={font.class}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="p-4 mt-4 bg-gray-50 rounded-md">
                  <div className="text-xs text-gray-500 mb-2">Preview:</div>
                  <p className={`${getFontClass(fontFamily)} text-lg`}>
                    This is how your text will appear.
                  </p>
                  <p className={`${getFontClass(fontFamily)} text-sm mt-1`}>
                    The quick brown fox jumps over the lazy dog.
                  </p>
                </div>
              </div>
            </Tabs>
          </div>

          {/* Right side - Live preview */}
          <div className="hidden md:block w-1/2 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
            <div className="p-2 bg-gray-200 border-b border-gray-300 flex justify-between items-center">
              <div className="flex space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-xs text-gray-500">Live Preview</div>
              <div className="w-12"></div>
            </div>
            <div className="h-[calc(100%-28px)] overflow-auto">
              <LivePreview 
                profile={profileData}
                links={links}
                template="custom"
                themeColor={isUsingCustomColor ? customColor : theme}
                buttonStyle={buttonStyle}
                fontFamily={fontFamily}
                customColor={isUsingCustomColor ? customColor : undefined}
                gradientFrom={isUsingGradient ? gradientFrom : undefined}
                gradientTo={isUsingGradient ? gradientTo : undefined}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!hasChanges}
          >
            Apply Custom Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
