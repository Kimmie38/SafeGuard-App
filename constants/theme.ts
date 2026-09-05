export const CATEGORIES = [
  "All",
  "Robbery",
  "Fire Outbreak",
  "Medical Emergency",
  "Accident",
  "Suspicious Activity",
  "Domestic Threat",
] as const;

export const STATE_NAME = "Plateau State";

// SafeGuard is scoped to Jos, Plateau State for this build.
export const REGIONS = [
  "Jos North",
  "Jos South",
  "Jos East",
  "Bukuru",
  "Rayfield",
  "Terminus",
  "Angwan Rogo",
  "Farin Gada",
  "Tudun Wada",
  "Bauchi Road",
] as const;

export const STATUS_LIST = ["Active", "Responding", "Resolved"] as const;

export const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  Active: { bg: "bg-coral-light", text: "text-coral", dot: "bg-coral" },
  Responding: { bg: "bg-amber/20", text: "text-amber-dark", dot: "bg-amber" },
  Resolved: { bg: "bg-teal-light", text: "text-teal", dot: "bg-teal" },
};

export const SEVERITY_ORDER: Record<string, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
};
