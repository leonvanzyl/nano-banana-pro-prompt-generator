"use client";

import { useState } from "react";
import { ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Template } from "@/lib/types/generation";
import { TemplateSelectorModal } from "./template-selector-modal";

interface TemplateSelectorProps {
  label: string;
  templates: Template[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  allowCustom?: boolean;
}

export function TemplateSelector({
  label,
  templates,
  value,
  onChange,
  placeholder = "Select an option...",
  allowCustom = true,
}: TemplateSelectorProps) {
  const [open, setOpen] = useState(false);

  // Find the selected template
  const selectedTemplate = templates.find((t) => t.id === value);
  const displayValue = selectedTemplate?.name || value || "";
  const isCustomValue = value && !selectedTemplate;

  const handleSelect = (template: Template) => {
    onChange(template.id);
  };

  const handleCustomChange = (customValue: string) => {
    onChange(customValue);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1 justify-between h-10 px-3 font-normal"
          onClick={() => setOpen(true)}
        >
          <span className={displayValue ? "text-foreground" : "text-muted-foreground"}>
            {displayValue || placeholder}
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        </Button>
        {value && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {isCustomValue && (
        <p className="text-xs text-muted-foreground">Custom: {value}</p>
      )}

      <TemplateSelectorModal
        open={open}
        onOpenChange={setOpen}
        title={`Select ${label}`}
        templates={templates}
        selectedId={selectedTemplate?.id}
        onSelect={handleSelect}
        allowCustom={allowCustom}
        customValue={isCustomValue ? value : ""}
        onCustomChange={handleCustomChange}
      />
    </div>
  );
}
