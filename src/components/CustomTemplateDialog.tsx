
import React, { useState } from "react";
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
import { Toggle } from "@/components/ui/toggle";
import { Palette, Type, Square } from "lucide-react";

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
}

export const CustomTemplateDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialSettings,
}: CustomTemplateDialogProps) => {
  const [theme, setTheme] = useState(initialSettings.theme);
  const [buttonStyle, setButtonStyle] = useState(initialSettings.buttonStyle);
  const [fontFamily, setFontFamily] = useState(initialSettings.fontFamily);
  const [activeTab, setActiveTab] = useState("colors");

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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Customize Your Template
          </DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="colors"
          className="mt-4"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="colors" className="flex items-center gap-2">
              <Palette className="h-4 w-4" /> Colors
            </TabsTrigger>
            <TabsTrigger value="buttons" className="flex items-center gap-2">
              <Square className="h-4 w-4" /> Buttons
            </TabsTrigger>
            <TabsTrigger value="fonts" className="flex items-center gap-2">
              <Type className="h-4 w-4" /> Fonts
            </TabsTrigger>
          </TabsList>

          {/* Colors Tab */}
          <div className={`mt-6 ${activeTab !== "colors" && "hidden"}`}>
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

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Apply Custom Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
