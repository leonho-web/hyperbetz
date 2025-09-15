// "use client";

// import { Button } from "@/components/ui/button";
// import { FilterOption } from "@/types/features/query-display.types";

// interface FilterSelectionPillsProps {
//   options: FilterOption[];
//   activeValues: string[];
//   onToggle: (value: string) => void;
//   onClear: () => void;
// }

// export default function FilterSelectionPills({ options, activeValues, onToggle, onClear }: FilterSelectionPillsProps) {
//   if (!options || options.length === 0) return null;

//   return (
//     <div className="flex w-full items-center gap-2">
//       <span className="text-lg font-semibold text-muted-foreground whitespace-nowrap">Category:</span>
//       <div className="flex flex-grow gap-2 overflow-x-auto pb-2">
//         {options.map(option => (
//           <Button key={option.value} variant={activeValues.includes(option.value) ? "default" : "outline"} size="sm" onClick={() => onToggle(option.value)} className="rounded-full whitespace-nowrap">
//             {option.label}
//           </Button>
//         ))}
//       </div>
//       {activeValues.length > 0 && (
//         <Button variant="ghost" size="sm" onClick={onClear} className="ml-auto text-sm">
//           Clear
//         </Button>
//       )}
//     </div>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import { FilterOption } from "@/types/features/query-display.types";
import { useTranslations } from "@/lib/locale-provider";

interface FilterSelectionPillsProps {
  options: FilterOption[];
  activeValues: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
}

export default function FilterSelectionPills({
  options,
  activeValues,
  onToggle,
  onClear,
}: FilterSelectionPillsProps) {
  const tCategory = useTranslations("query.category");
  const tCommonExtra = useTranslations("commonExtra");
  if (!options || options.length === 0) return null;

  // Function to determine grid columns based on option count for tablet
  const getTabletGridCols = (count: number) => {
    if (count <= 4) return "grid-cols-2";
    if (count <= 6) return "grid-cols-3";
    if (count <= 8) return "grid-cols-4";
    return "grid-cols-3"; // fallback for more than 8
  };

  return (
    <div className="w-full">
      {/* Mobile Layout */}
      <div className="block md:hidden">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-muted-foreground">
              {tCategory("label")}
            </span>
            {activeValues.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="text-sm"
              >
                {tCommonExtra("clear")}
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {options.map((option) => (
              <Button
                key={option.value}
                variant={
                  activeValues.includes(option.value) ? "default" : "outline"
                }
                size="sm"
                onClick={() => onToggle(option.value)}
                className="rounded-full text-xs sm:text-sm h-8 sm:h-9"
              >
                <span className="truncate">{option.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Tablet Layout */}
      <div className="hidden md:block lg:hidden">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-muted-foreground">
              {tCategory("label")}
            </span>
            {activeValues.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="text-sm"
              >
                {tCommonExtra("clear")}
              </Button>
            )}
          </div>
          <div className={`grid ${getTabletGridCols(options.length)} gap-2`}>
            {options.map((option) => (
              <Button
                key={option.value}
                variant={
                  activeValues.includes(option.value) ? "default" : "outline"
                }
                size="sm"
                onClick={() => onToggle(option.value)}
                className="rounded-full text-sm h-9"
              >
                <span className="truncate">{option.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex w-full items-center gap-4">
        <span className="text-lg font-semibold text-muted-foreground whitespace-nowrap">
          {tCategory("label")}
        </span>
        <div className="flex flex-grow gap-2 overflow-x-auto pb-1">
          {options.map((option) => (
            <Button
              key={option.value}
              variant={
                activeValues.includes(option.value) ? "default" : "outline"
              }
              size="sm"
              onClick={() => onToggle(option.value)}
              className="rounded-full whitespace-nowrap text-sm"
            >
              {option.label}
            </Button>
          ))}
        </div>
        {activeValues.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="ml-auto text-sm flex-shrink-0"
          >
            {tCommonExtra("clear")}
          </Button>
        )}
      </div>
    </div>
  );
}
