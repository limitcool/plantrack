"use client";

import { ProviderIcon } from "@/components/provider-icon";
import { cn } from "@/lib/utils";

interface PlatformIconProps {
  vendor: string;
  name?: string;
  className?: string;
  compact?: boolean;
}

export function PlatformIcon({ vendor, name, className, compact = false }: PlatformIconProps) {
  return (
    <ProviderIcon
      vendor={vendor}
      name={name}
      compact={compact}
      className={cn("size-10 rounded-lg", className)}
      iconClassName={compact ? "size-4" : "size-5"}
    />
  );
}
