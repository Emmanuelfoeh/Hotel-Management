'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type DateRangePreset = '7d' | '30d' | '90d';

interface DateRangeSelectorProps {
  selected: DateRangePreset;
  onSelect: (preset: DateRangePreset) => void;
}

const presets: { value: DateRangePreset; label: string }[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
];

export function DateRangeSelector({
  selected,
  onSelect,
}: DateRangeSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      {presets.map((preset) => (
        <Button
          key={preset.value}
          variant={selected === preset.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelect(preset.value)}
          className={cn(
            selected === preset.value && 'bg-primary text-primary-foreground'
          )}
        >
          {preset.label}
        </Button>
      ))}
    </div>
  );
}
