import React, { createContext, useContext, useState, ReactNode } from "react";
import reportsSeed from "@/data/reports.json";
import alertsSeed from "@/data/alerts.json";
import { REGIONS } from "@/constants/theme";

export type Role = "resident" | "admin";

export type Report = {
  id: string;
  category: string;
  title: string;
  description: string;
  status: "Active" | "Responding" | "Resolved";
  reporter: string;
  location: string;
  region: string;
  timeAgo: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  images?: string[];
};

export type AlertItem = {
  id: string;
  type: "Emergency" | "Update" | "Announcement";
  title: string;
  message: string;
  timeAgo: string;
  unread: boolean;
};

type AppContextType = {
  role: Role | null;
  userName: string;
  userRegion: string;
  locationEnabled: boolean;
  isAuthenticated: boolean;
  reports: Report[];
  alerts: AlertItem[];
  login: (role: Role, name: string, region: string) => void;
  logout: () => void;
  setLocationEnabled: (enabled: boolean) => void;
  addReport: (
    report: Omit<Report, "id" | "timeAgo" | "reporter" | "status" | "region">
  ) => void;
  updateReportStatus: (id: string, status: Report["status"]) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const [userName, setUserName] = useState("John Doe");
  const [userRegion, setUserRegionState] = useState<string>(REGIONS[0]);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [reports, setReports] = useState<Report[]>(reportsSeed as Report[]);
  const [alerts, setAlerts] = useState<AlertItem[]>(alertsSeed as AlertItem[]);

  const login = (newRole: Role, name: string, region: string) => {
    setRole(newRole);
    setUserName(name);
    setUserRegionState(region);
  };

  const logout = () => setRole(null);

  const addReport: AppContextType["addReport"] = (report) => {
    const newReport: Report = {
      ...report,
      id: `ER-2024-${String(reports.length + 1).padStart(3, "0")}`,
      status: "Active",
      reporter: userName,
      region: userRegion,
      timeAgo: "Just now",
    };
    setReports((prev) => [newReport, ...prev]);
  };

  const updateReportStatus = (id: string, status: Report["status"]) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  return (
    <AppContext.Provider
      value={{
        role,
        userName,
        userRegion,
        locationEnabled,
        isAuthenticated: role !== null,
        reports,
        alerts,
        login,
        logout,
        setLocationEnabled,
        addReport,
        updateReportStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
