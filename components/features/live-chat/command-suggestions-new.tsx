"use client";

import * as React from "react";
import { Command } from "lucide-react";
import { SlashCommand } from "@/lib/utils/features/live-chat/slash-commands";

interface CommandSuggestionsProps {
  suggestions: SlashCommand[];
  isVisible: boolean;
  selectedIndex: number;
  onSelect: (command: SlashCommand) => void;
  onHover: (index: number) => void;
}

export function CommandSuggestions({
  suggestions,
  isVisible,
  selectedIndex,
  onSelect,
  onHover,
}: CommandSuggestionsProps) {
  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 z-[100]">
      <div className="bg-popover border border-border rounded-lg shadow-lg backdrop-blur-sm">
        <div className="p-2 border-b border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Command className="h-3 w-3" />
            <span>Commands</span>
          </div>
        </div>
        <div className="max-h-48 overflow-y-auto">
          {suggestions.map((command, index) => (
            <div
              key={command.name}
              className={`
                flex flex-col p-3 cursor-pointer transition-colors
                ${
                  index === selectedIndex
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50"
                }
                ${
                  index !== suggestions.length - 1
                    ? "border-b border-border/50"
                    : ""
                }
              `}
              onClick={() => onSelect(command)}
              onMouseEnter={() => onHover(index)}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-medium text-primary">
                  {command.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {command.usage}
                </span>
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                {command.description}
              </span>
              <span className="text-xs text-muted-foreground/70 mt-1 font-mono">
                Example: {command.example}
              </span>
            </div>
          ))}
        </div>
        <div className="p-2 border-t border-border text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>↑↓ Navigate</span>
            <span>Enter to select</span>
            <span>Esc to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
