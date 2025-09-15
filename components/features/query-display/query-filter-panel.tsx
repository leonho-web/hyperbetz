"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ActiveFilters } from "@/store/slices/query/query.slice";
import { FilterSection } from "@/types/features/query-display.types";

interface QueryFilterPanelProps {
  sections: FilterSection[];
  activeFilters: ActiveFilters;
  onFilterChange: (filterType: string, value: string) => void;
}

export const QueryFilterPanel = ({ sections, activeFilters, onFilterChange }: QueryFilterPanelProps) => {
  return (
    <Accordion type="multiple" className="w-full">
      {sections.map(section => (
        <AccordionItem key={section.id} value={section.id}>
          <AccordionTrigger>{section.label}</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {section.options.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${section.id}-${option.value}`}
                    checked={activeFilters[section.id]?.includes(option.value) || false}
                    onCheckedChange={() => onFilterChange(section.id, option.value)}
                  />
                  <Label htmlFor={`${section.id}-${option.value}`} className="flex-1 cursor-pointer">
                    {option.label}
                    {option.count != null && <span className="ml-2 text-xs text-muted-foreground">({option.count})</span>}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
