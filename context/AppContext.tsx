import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { REGIONS } from "@/constants/theme";
import { apiFetch, ApiError, getToken, setToken, uploadImages } from "@/utils/api";
import { formatTimeAgo } from "@/utils/time";

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
  createdAt?: string;
};

export type AlertItem = {
  id: string;
  type: "Emergency" | "Update" | "Announcement";
  title: string;
  message: string;
  timeAgo: string;
  unread: boolean;
  region?: string | null;
  createdAt?: string;
};

// ---- shapes returned by the backend (see SafeGuard-App-Backend) ----
type ApiUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  estate: string | null; // doubles as the user's region, see backend README
  role: Role;
};
type ApiReport = Omit<Report, "timeAgo" | "createdAt"> & { createdAt: string };
type ApiAlert = Omit<AlertItem, "timeAgo" | "createdAt"> & { createdAt: string };

function normalizeReport(r: ApiReport): Report {
  return { ...r, timeAgo: formatTimeAgo(r.createdAt) };
}
function normalizeAlert(a: ApiAlert): AlertItem {
  return { ...a, timeAgo: formatTimeAgo(a.createdAt) };
}

type NewReportInput = {
  category: string;
  title: string;
  description: string;
  location: string;
  severity: Report["severity"];
  images: string[]; // local device URIs from the image picker, not yet uploaded
  anonymous?: boolean;
};

type RegisterInput = {
  name: string;
  email: string;
  phone?: string;
  password: string;
  region: string;
  adminCode?: string; // matches the backend's ADMIN_SIGNUP_CODE - registers as an area chairman (role: "admin") when it matches
};

type AppContextType = {
  role: Role | null;
  userName: string;
  userEmail: string | null;
  userRegion: string;
  locationEnabled: boolean;
  isAuthenticated: boolean;
  isBootstrapping: boolean; // restoring a saved session on app launch
  isLoadingData: boolean; // fetching reports/alerts
  reports: Report[];
  alerts: AlertItem[];
  login: (email: string, password: string) => Promise<Role>;
  register: (input: RegisterInput) => Promise<Role>;
  logout: () => void;
  setLocationEnabled: (enabled: boolean) => void;
  addReport: (report: NewReportInput) => Promise<void>;
  updateReportStatus: (id: string, status: Report["status"]) => Promise<void>;
  markAlertRead: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRegion, setUserRegionState] = useState<string>(REGIONS[0]);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const applyUser = useCallback((user: ApiUser) => {
    setRole(user.role);
    setUserName(user.name);
    setUserEmail(user.email);
    setUserRegionState(user.estate && REGIONS.includes(user.estate as any) ? user.estate : REGIONS[0]);
  }, []);

  const fetchReportsAndAlerts = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const [reportsRes, alertsRes] = await Promise.all([
        apiFetch<{ reports: ApiReport[] }>("/api/reports"),
        apiFetch<{ alerts: ApiAlert[] }>("/api/alerts"),
      ]);
      setReports(reportsRes.reports.map(normalizeReport));
      setAlerts(alertsRes.alerts.map(normalizeAlert));
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  // Restore a saved session (JWT in AsyncStorage) on app launch.
  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) {
        setIsBootstrapping(false);
        return;
      }
      try {
        const { user } = await apiFetch<{ user: ApiUser }>("/api/users/me");
        applyUser(user);
        await fetchReportsAndAlerts();
      } catch {
        // Saved token is invalid/expired - fall back to logged-out state.
        await setToken(null);
      } finally {
        setIsBootstrapping(false);
      }
    })();
  }, [applyUser, fetchReportsAndAlerts]);

  const login = useCallback(
    async (email: string, password: string): Promise<Role> => {
      const { token, user } = await apiFetch<{ token: string; user: ApiUser }>("/api/auth/login", {
        method: "POST",
        auth: false,
        body: { email, password },
      });
      await setToken(token);
      applyUser(user);
      await fetchReportsAndAlerts();
      return user.role;
    },
    [applyUser, fetchReportsAndAlerts]
  );

  const register = useCallback(
    async (input: RegisterInput): Promise<Role> => {
      const { token, user } = await apiFetch<{ token: string; user: ApiUser }>("/api/auth/register", {
        method: "POST",
        auth: false,
        body: {
          name: input.name,
          email: input.email,
          phone: input.phone,
          password: input.password,
          region: input.region,
          adminCode: input.adminCode,
        },
      });
      await setToken(token);
      applyUser(user);
      await fetchReportsAndAlerts();
      return user.role;
    },
    [applyUser, fetchReportsAndAlerts]
  );

  const logout = useCallback(() => {
    setToken(null);
    setRole(null);
    setUserName("");
    setUserEmail(null);
    setReports([]);
    setAlerts([]);
  }, []);

  const addReport = useCallback(
    async (report: NewReportInput) => {
      const uploadedUrls = await uploadImages(report.images);
      const { report: created } = await apiFetch<{ report: ApiReport }>("/api/reports", {
        method: "POST",
        body: {
          category: report.category,
          title: report.title,
          description: report.description,
          location: report.location,
          severity: report.severity,
          images: uploadedUrls,
          region: userRegion,
          anonymous: report.anonymous ?? false,
        },
      });
      setReports((prev) => [normalizeReport(created), ...prev]);
    },
    [userRegion]
  );

  const updateReportStatus = useCallback(async (id: string, status: Report["status"]) => {
    // Optimistic update so the "Mark as..." buttons feel instant; reconciled
    // (or reverted) once the PATCH resolves.
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    try {
      const { report: updated } = await apiFetch<{ report: ApiReport }>(`/api/reports/${id}/status`, {
        method: "PATCH",
        body: { status },
      });
      setReports((prev) => prev.map((r) => (r.id === id ? normalizeReport(updated) : r)));
    } catch (err) {
      // Revert on failure by re-fetching the source of truth.
      const { reports: fresh } = await apiFetch<{ reports: ApiReport[] }>("/api/reports");
      setReports(fresh.map(normalizeReport));
      throw err;
    }
  }, []);

  const markAlertRead = useCallback(async (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, unread: false } : a)));
    try {
      await apiFetch(`/api/alerts/${id}/read`, { method: "PATCH" });
    } catch {
      // Non-critical - leave the optimistic update in place rather than
      // flashing the badge back on for a background sync issue.
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        role,
        userName,
        userEmail,
        userRegion,
        locationEnabled,
        isAuthenticated: role !== null,
        isBootstrapping,
        isLoadingData,
        reports,
        alerts,
        login,
        register,
        logout,
        setLocationEnabled,
        addReport,
        updateReportStatus,
        markAlertRead,
        refresh: fetchReportsAndAlerts,
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

export { ApiError };
