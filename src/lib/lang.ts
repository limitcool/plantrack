export type Lang = "en" | "zh";

export function getLang(raw?: string, defaultLang: Lang = "zh"): Lang {
  if (raw === "en") {
    return "en";
  }

  if (raw === "zh") {
    return "zh";
  }

  return defaultLang;
}

export function withLang(path: string, lang: Lang): string {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}lang=${lang}`;
}
