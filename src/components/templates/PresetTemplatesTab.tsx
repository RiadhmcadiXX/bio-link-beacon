
// --- components/TemplateTabs/PresetTemplatesTab.tsx ---

import React from "react";
import { TemplateCard } from "@/components/TemplateCard";

interface PresetTemplate {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  buttonStyle: string;
  fontFamily: string;
  hasAnimation?: boolean;
  animationType?: string;
}

interface PresetTemplatesTabProps {
  templates: PresetTemplate[];
  activeTemplateId: string | null;
  onApply: (templateId: string) => void;
  onPreview: (templateId: string) => void;
}

export const PresetTemplatesTab: React.FC<PresetTemplatesTabProps> = ({
  templates,
  activeTemplateId,
  onApply,
  onPreview,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          id={template.id}
          name={template.name}
          description={template.description}
          previewImage={template.previewImage}
          isActive={activeTemplateId === template.id}
          buttonStyle={template.buttonStyle}
          fontFamily={template.fontFamily}
          hasAnimation={template.hasAnimation}
          animationType={template.animationType}
          onSelect={() => onApply(template.id)}
          onPreview={() => onPreview(template.id)}
        />
      ))}
    </div>
  );
};
