"use client";

import { ReactNode, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ThreeColumnLayoutProps {
  leftPanel: ReactNode;
  middlePanel: ReactNode;
  rightPanel: ReactNode;
  className?: string;
}

export function ThreeColumnLayout({
  leftPanel,
  middlePanel,
  rightPanel,
  className,
}: ThreeColumnLayoutProps) {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Layout - Tabbed Interface */}
      <div className={cn("lg:hidden", className)}>
        <Tabs defaultValue="builder" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="builder">Builder</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          <TabsContent value="builder" className="mt-0">
            <div className="rounded-lg border bg-card min-h-[calc(100vh-12rem)] overflow-y-auto">
              {leftPanel}
            </div>
          </TabsContent>
          <TabsContent value="preview" className="mt-0">
            <div className="rounded-lg border bg-card min-h-[calc(100vh-12rem)] overflow-y-auto">
              {middlePanel}
            </div>
          </TabsContent>
          <TabsContent value="results" className="mt-0">
            <div className="rounded-lg border bg-card min-h-[calc(100vh-12rem)] overflow-y-auto">
              {rightPanel}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop Layout - Three Columns */}
      <div
        className={cn(
          "hidden lg:grid gap-4 h-full transition-all duration-300",
          leftCollapsed && rightCollapsed
            ? "grid-cols-1"
            : leftCollapsed
              ? "grid-cols-[1fr_350px] xl:grid-cols-[1fr_400px]"
              : rightCollapsed
                ? "grid-cols-[350px_1fr] xl:grid-cols-[400px_1fr]"
                : "grid-cols-[350px_1fr_350px] xl:grid-cols-[400px_1fr_400px]",
          className
        )}
      >
        {/* Left Panel - Prompt Builder */}
        {!leftCollapsed && (
          <div className="h-[calc(100vh-8rem)] overflow-hidden relative">
            <div className="h-full overflow-y-auto rounded-lg border bg-card">
              {leftPanel}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLeftCollapsed(true)}
              className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full border bg-background shadow-sm hover:bg-muted z-10"
              title="Collapse panel"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Collapsed Left Panel Button */}
        {leftCollapsed && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLeftCollapsed(false)}
            className="fixed left-4 top-1/2 -translate-y-1/2 h-auto py-2 px-3 flex flex-col gap-1 z-10"
            title="Expand prompt builder"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="text-xs writing-mode-vertical">Builder</span>
          </Button>
        )}

        {/* Middle Panel - Preview & Generate */}
        <div className="h-[calc(100vh-8rem)] overflow-hidden">
          <div className="h-full overflow-y-auto rounded-lg border bg-card">
            {middlePanel}
          </div>
        </div>

        {/* Right Panel - Results */}
        {!rightCollapsed && (
          <div className="h-[calc(100vh-8rem)] overflow-hidden relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setRightCollapsed(true)}
              className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full border bg-background shadow-sm hover:bg-muted z-10"
              title="Collapse panel"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="h-full overflow-y-auto rounded-lg border bg-card">
              {rightPanel}
            </div>
          </div>
        )}

        {/* Collapsed Right Panel Button */}
        {rightCollapsed && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRightCollapsed(false)}
            className="fixed right-4 top-1/2 -translate-y-1/2 h-auto py-2 px-3 flex flex-col gap-1 z-10"
            title="Expand results"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="text-xs writing-mode-vertical">Results</span>
          </Button>
        )}
      </div>
    </>
  );
}
