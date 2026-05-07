export const fontRegistry = {
  systemSans: {
    label: "System Sans",
    variable: "--font-system-sans",
  },
  systemMono: {
    label: "System Mono",
    variable: "--font-system-mono",
  },
  georgia: {
    label: "Georgia",
    variable: "--font-georgia",
  },
  helvetica: {
    label: "Helvetica",
    variable: "--font-helvetica",
  },
} as const;

export type FontKey = keyof typeof fontRegistry;

export const fontVars = "";

export const fontOptions = (Object.entries(fontRegistry) as Array<[FontKey, (typeof fontRegistry)[FontKey]]>).map(
  ([key, f]) => ({
    key,
    label: f.label,
    variable: f.variable,
  }),
);
