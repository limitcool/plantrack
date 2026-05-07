"use client";

import { ProviderIcon } from "@/components/provider-icon";
import { cn } from "@/lib/utils";

interface PlatformIconProps {
  vendor: string;
  name?: string;
  className?: string;
}

export function PlatformIcon({ vendor, name, className }: PlatformIconProps) {
  return <ProviderIcon vendor={vendor} name={name} className={cn("size-10 rounded-lg", className)} iconClassName="size-5" />;
}

export function getVendorColor(vendor: string) {
  return {
    bg: "bg-secondary",
    text: "text-foreground",
    vendor,
  };
}
