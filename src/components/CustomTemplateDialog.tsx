
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
import { Palette, Type, Square, LayoutPanelLeft } from "lucide-react";
import { LivePreview } from "@/components/LivePreview";

interface CustomTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (settings: {
    theme: string;
    buttonStyle: string;
    fontFamily: string;
  }) => void;
  initialSettings: {
    theme: string;
    buttonStyle: string;
    fontFamily: string;
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
  const [activeTab, setActiveTab] = useState("colors");
  const [hasChanges, setHasChanges] = useState(false);

  // Reset state when dialog opens with initialSettings
  useEffect(() => {
    if (isOpen) {
      setTheme(initialSettings.theme);
      setButtonStyle(initialSettings.buttonStyle);
      setFontFamily(initialSettings.fontFamily);
      setHasChanges(false);
    }
  }, [isOpen, initialSettings]);

  // Track changes to enable/disable save button
  useEffect(() => {
    const hasChanged = 
      theme !== initialSettings.theme || 
      buttonStyle !== initialSettings.buttonStyle || 
      fontFamily !== initialSettings.fontFamily;
    
    setHasChanges(hasChanged);
  }, [theme, buttonStyle, fontFamily, initialSettings]);

  const handleSubmit = () => {
    onSubmit({
      theme,
      buttonStyle,
      fontFamily,
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

  // Font family options
  const fontFamilyOptions = [
    { value: "default", label: "Default", class: "font-sans" },
    { value: "serif", label: "Serif", class: "font-serif" },
    { value: "mono", label: "Monospace", class: "font-mono" },
    { value: "display", label: "Display", class: "font-bold tracking-wide" },
    { value: "handwritten", label: "Handwritten", class: "italic" },
  ];

  const getFontClass = (font: string) => {
    const option = fontFamilyOptions.find((f) => f.value === font);
    return option ? option.class : "font-sans";
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
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="colors" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" /> Colors
                </TabsTrigger>
                <TabsTrigger value="buttons" className="flex items-center gap-2">
                  <Square className="h-4 w-4" /> Buttons
                </TabsTrigger>
                <TabsTrigger value="fonts" className="flex items-center gap-2">
                  <Type className="h-4 w-4" /> Fonts
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-2 md:hidden">
                  <LayoutPanelLeft className="h-4 w-4" /> Preview
                </TabsTrigger>
              </TabsList>

              {/* Colors Tab */}
              <div className={`mt-6 ${activeTab !== "colors" && activeTab !== "preview" && "hidden"}`}>
                <h3 className="text-sm font-medium mb-2">Select Theme Color</h3>
                <div className="grid grid-cols-2 gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setTheme(color.value)}
                      className={`flex items-center gap-2 p-3 rounded-md border transition-all ${
                        theme === color.value
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
                      theme === "purple"
                        ? "bg-brand-purple"
                        : theme === "blue"
                        ? "bg-brand-blue"
                        : theme === "pink"
                        ? "bg-brand-pink"
                        : "bg-brand-orange"
                    }`}
                  ></div>
                </div>
              </div>

              {/* Buttons Tab */}
              <div className={`mt-6 ${activeTab !== "buttons" && activeTab !== "preview" && "hidden"}`}>
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
                  >
                    Button Preview
                  </Button>
                </div>
              </div>

              {/* Fonts Tab */}
              <div className={`mt-6 ${activeTab !== "fonts" && activeTab !== "preview" && "hidden"}`}>
                <h3 className="text-sm font-medium mb-2">Font Family</h3>
                <Select
                  value={fontFamily}
                  onValueChange={setFontFamily}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select font family" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilyOptions.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="p-4 mt-4 bg-gray-50 rounded-md">
                  <div className="text-xs text-gray-500 mb-2">Preview:</div>
                  <p className={`${getFontClass(fontFamily)}`}>
                    This is how your text will appear.
                  </p>
                </div>
              </div>
            </Tabs>
          </div>

          {/* Right side - Live preview */}
          <div className={`hidden md:block w-1/2 bg-gray-100 rounded-md overflow-hidden border border-gray-200 ${activeTab === "preview" ? "block" : ""}`}>
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
                themeColor={theme}
                buttonStyle={buttonStyle}
                fontFamily={fontFamily}
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
