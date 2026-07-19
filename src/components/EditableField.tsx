"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = { value: string; label: string };

type EditableFieldProps = {
  icon?: React.ComponentType<{ className?: string }>;
  label?: string;
  value: string;
  displayValue?: React.ReactNode;
  isEditing: boolean;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "date";
  layout?: "row" | "between";
  options?: Option[];
};

export function EditableField({
  icon: Icon,
  label,
  value,
  displayValue,
  isEditing,
  onChange,
  placeholder,
  type = "text",
  layout = "row",
  options,
}: EditableFieldProps) {
  const control = options ? (
    <Select
      value={value || undefined}
      onValueChange={(v) => onChange(v as string)}
    >
      <SelectTrigger
        size="sm"
        className={layout === "row" ? "w-full" : "max-w-[160px]"}
      >
        <SelectValue placeholder="—" />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ) : (
    <Input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={layout === "row" ? "h-8" : "h-8 max-w-[160px]"}
    />
  );

  if (layout === "between") {
    return (
      <div className="flex justify-between items-center gap-2">
        <span className="text-muted-foreground shrink-0">{label}</span>
        {isEditing ? control : <span>{displayValue ?? value ?? "—"}</span>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {Icon && <Icon className="h-4 w-4 text-muted-foreground shrink-0" />}
      {isEditing ? control : <span>{displayValue ?? value ?? "—"}</span>}
    </div>
  );
}
