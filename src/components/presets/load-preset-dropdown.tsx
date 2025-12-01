"use client";

import { useState } from "react";
import { FolderOpen, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Preset } from "@/lib/types/generation";
import { PresetList } from "./preset-list";

interface LoadPresetDropdownProps {
  presets: Preset[];
  onLoad: (preset: Preset) => void;
  onDelete: (id: string) => Promise<boolean>;
  isLoading?: boolean;
  disabled?: boolean;
}

export function LoadPresetDropdown({
  presets,
  onLoad,
  onDelete,
  isLoading = false,
  disabled = false,
}: LoadPresetDropdownProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleLoad = (preset: Preset) => {
    onLoad(preset);
    setSheetOpen(false);
  };

  // Show up to 5 recent presets in dropdown, rest in sheet
  const recentPresets = presets.slice(0, 5);
  const hasMorePresets = presets.length > 5;

  if (isLoading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Loading...
      </Button>
    );
  }

  if (presets.length === 0) {
    return (
      <Button variant="outline" size="sm" disabled>
        <FolderOpen className="h-4 w-4 mr-2" />
        No Presets
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={disabled}>
            <FolderOpen className="h-4 w-4 mr-2" />
            Load Preset
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Recent Presets</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {recentPresets.map((preset) => (
            <DropdownMenuItem
              key={preset.id}
              onClick={() => handleLoad(preset)}
              className="cursor-pointer"
            >
              <span className="truncate">{preset.name}</span>
            </DropdownMenuItem>
          ))}
          {hasMorePresets && (
            <>
              <DropdownMenuSeparator />
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="cursor-pointer"
                  >
                    View all presets ({presets.length})
                  </DropdownMenuItem>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-lg">
                  <SheetHeader>
                    <SheetTitle>All Presets</SheetTitle>
                    <SheetDescription>
                      Select a preset to load or manage your saved presets
                    </SheetDescription>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100vh-120px)] mt-4 pr-4">
                    <PresetList
                      presets={presets}
                      onLoad={handleLoad}
                      onDelete={onDelete}
                      isLoading={isLoading}
                    />
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
