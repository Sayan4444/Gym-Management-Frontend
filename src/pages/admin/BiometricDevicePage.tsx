import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Cpu,
  CreditCard,
  FileClock,
  Fingerprint,
  Info,
  KeyRound,
  RefreshCw,
  Search,
  Server,
  ShieldAlert,
  UserCheck,
  Users,
  Wifi,
  WifiOff,
  XCircle,
} from "lucide-react";

import { PaginationFooter } from "@/components/PaginationFooter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  type BiometricSnapshot,
  type BiometricSnapshotLog,
  type BiometricSnapshotUser,
  useBiometricDevice,
  useBiometricRefresh,
  useBiometricSnapshotLogs,
  useBiometricSnapshotUsers,
  useRefreshBiometricDevice,
} from "@/hooks/apis/useBiometricDevice";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 25;
const STALE_AFTER_MS = 15 * 60 * 1000;

function formatDateTime(value?: string) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(date);
}

function formatDrift(seconds: number) {
  const absolute = Math.abs(seconds);
  const minutes = Math.floor(absolute / 60);
  const remainingSeconds = absolute % 60;
  return `${seconds >= 0 ? "+" : "−"}${minutes}m ${remainingSeconds}s`;
}

function reportedValue(value?: string | number) {
  if (typeof value === "number") return String(value);
  const normalized = String(value || "").trim();
  if (!normalized || ["na", "n/a", "null", "undefined", "-"].includes(normalized.toLowerCase())) return "Not reported by device";
  return normalized;
}

function verificationLabel(type: string, deviceType: number) {
  if (deviceType !== 2) return type || "Unknown";
  const labels: Record<string, string> = {
    "1": "Fingerprint", "2": "Password", "3": "Card", "4": "Fingerprint + Card",
    "5": "Fingerprint + Password", "6": "Card + Password", "7": "Fingerprint + Card + Password",
    "30": "Face", "31": "Face + Card", "32": "Face + Password", "33": "Face + Card + Password", "34": "Face + Fingerprint",
  };
  return labels[type] || type || "Unknown";
}

function eventLabel(mode: string) {
  return ({ "0": "Check-in", "1": "Check-out", "2": "Overtime in", "3": "Overtime out", "4": "Return", "5": "Go out" } as Record<string, string>)[mode] || mode || "Unknown";
}

function syncLabel(state: string) {
  const labels: Record<string, string> = {
    matched: "Matched",
    unmapped: "Unmapped",
    name_mismatch: "Name mismatch",
    access_mismatch: "Access mismatch",
    multiple_mismatches: "Multiple issues",
    missing_from_device: "Missing from device",
  };
  return labels[state] || state.replaceAll("_", " ");
}

function SyncBadge({ user }: { user: BiometricSnapshotUser }) {
  const matched = user.syncState === "matched";
  let label = syncLabel(user.syncState);
  let detail = "";
  if (user.syncState === "unmapped") {
    detail = "No application user is linked";
  } else if (user.syncState === "name_mismatch") {
    detail = "Device and application names differ";
  } else if (user.syncState === "multiple_mismatches") {
    detail = "Name and access state both differ";
  } else if (user.syncState === "missing_from_device") {
    detail = "Application user is missing from the device";
  } else if (user.syncState === "access_mismatch") {
    if (user.enabled && user.expectedEnabled === false) {
      label = "Device still enabled";
      detail = "Application access is inactive";
    } else if (!user.enabled && user.expectedEnabled === true) {
      label = "Device is disabled";
      detail = "Application access is active";
    } else {
      detail = "Device and application access differ";
    }
  }
  return (
    <div>
      <Badge
        variant="outline"
        className={cn(
          "whitespace-nowrap border px-2 py-0.5 text-[9px] uppercase tracking-wider",
          matched ? "border-[#39FF14]/20 bg-[#39FF14]/10 text-[#39FF14]" : "border-amber-400/20 bg-amber-400/10 text-amber-300",
        )}
      >
        {label}
      </Badge>
      {detail && <p className="mt-1 text-[9px] text-gray-600">{detail}</p>}
    </div>
  );
}

function SummaryCard({ title, value, hint, icon: Icon, tone }: {
  title: string;
  value: string | number;
  hint: string;
  icon: typeof Wifi;
  tone: string;
}) {
  return (
    <div className="flex min-h-[118px] flex-col justify-between rounded-2xl border border-white/5 bg-[#111111]/50 p-5 backdrop-blur-md">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">{title}</p>
        <div className={cn("rounded-lg bg-white/[0.03] p-2", tone)}><Icon className="h-4 w-4" /></div>
      </div>
      <div>
        <p className="font-mono text-2xl font-bold text-white">{value}</p>
        <p className="mt-1 text-[10px] text-gray-500">{hint}</p>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/[0.04] py-2.5 last:border-0">
      <span className="text-[10px] uppercase tracking-wider text-gray-500">{label}</span>
      <span className="max-w-[62%] break-words text-right font-mono text-[11px] text-gray-200">{reportedValue(value)}</span>
    </div>
  );
}

function SnapshotBanner({ snapshot, latestAttempt }: { snapshot: BiometricSnapshot; latestAttempt: BiometricSnapshot | null }) {
  const failedAfterSnapshot = latestAttempt && latestAttempt.id !== snapshot.id && ["failed", "timed_out"].includes(latestAttempt.status);
  const stale = snapshot.capturedAt ? Date.now() - new Date(snapshot.capturedAt).getTime() > STALE_AFTER_MS : true;
  if (failedAfterSnapshot) {
    return (
      <div className="flex gap-3 rounded-xl border border-red-400/20 bg-red-400/[0.06] p-4 text-sm text-red-200">
        <WifiOff className="mt-0.5 h-4 w-4 shrink-0" />
        <div><p className="font-bold">The latest refresh failed</p><p className="mt-1 text-xs text-red-200/70">{latestAttempt.errorMessage || "The device did not return a snapshot."} Showing the last successful capture.</p></div>
      </div>
    );
  }
  if (stale) {
    return (
      <div className="flex gap-3 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-4 text-sm text-amber-200">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <div><p className="font-bold">This snapshot is more than 15 minutes old</p><p className="mt-1 text-xs text-amber-100/60">Stale data does not mean the device is offline. Refresh to check its current state.</p></div>
      </div>
    );
  }
  return null;
}

function DeviceUsersTable({ snapshotId }: { snapshotId: string }) {
  const [view, setView] = useState<"device" | "issues">("device");
  const [search, setSearch] = useState("");
  const [accessState, setAccessState] = useState("");
  const [page, setPage] = useState(1);
  const deferredSearch = useDeferredValue(search.trim());
  const query = useBiometricSnapshotUsers(snapshotId, { search: deferredSearch || undefined, view, accessState: accessState || undefined, page, pageSize: PAGE_SIZE });
  const users = query.data?.users || [];

  useEffect(() => setPage(1), [deferredSearch, view, accessState]);

  return (
    <section className="glass-card overflow-hidden rounded-2xl border border-white/5 shadow-2xl">
      <div className="flex flex-col gap-4 border-b border-white/5 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Stored Users</h3>
          <p className="mt-1 font-mono text-[10px] text-gray-500">Immutable records from this device snapshot</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex rounded-lg border border-white/5 bg-black/20 p-1">
            {(["device", "issues"] as const).map((item) => (
              <button key={item} type="button" onClick={() => setView(item)} className={cn("flex-1 rounded-md px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors sm:flex-none", view === item ? "bg-[#00BFFF]/15 text-[#00BFFF]" : "text-gray-500 hover:text-white")}>{item === "device" ? "All Stored Users" : "Sync Issues"}</button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
            <input aria-label="Search device users" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search ID or name..." className="h-9 w-full rounded-lg border border-white/10 bg-white/[0.02] pl-9 pr-3 text-xs text-white placeholder:text-gray-600 focus:border-[#00BFFF]/50 focus:outline-none sm:w-56" />
          </div>
          <select aria-label="Filter access state" value={accessState} onChange={(event) => setAccessState(event.target.value)} className="h-9 rounded-lg border border-white/10 bg-[#111] px-3 text-xs text-gray-300 focus:border-[#00BFFF]/50 focus:outline-none">
            <option value="">All access states</option>
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left text-xs">
          <thead><tr className="border-b border-white/5 text-[9px] font-bold uppercase tracking-[0.16em] text-gray-500"><th className="px-5 py-3">Device ID</th><th className="px-5 py-3">Device Name</th><th className="px-5 py-3">Access</th><th className="px-5 py-3">Credentials</th><th className="px-5 py-3">Application User</th><th className="px-5 py-3">Device vs Application</th></tr></thead>
          <tbody className="divide-y divide-white/[0.03]">
            {query.isLoading ? (
              <tr><td colSpan={6} className="px-5 py-12 text-center font-mono text-[10px] uppercase tracking-wider text-gray-500">Loading cached users...</td></tr>
            ) : query.isError ? (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-xs text-red-400">The cached device users could not be loaded.</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-xs text-gray-500">No records match these filters.</td></tr>
            ) : users.map((user: BiometricSnapshotUser) => (
              <tr key={user.id} className="transition-colors hover:bg-white/[0.02]">
                <td className="px-5 py-3.5 font-mono font-bold text-[#00BFFF]">#{user.deviceUserId}</td>
                <td className="px-5 py-3.5"><p className="font-semibold text-white">{user.deviceName || "Unnamed user"}</p>{!user.presentOnDevice && <p className="mt-0.5 text-[9px] text-red-400">Application record only</p>}</td>
                <td className="px-5 py-3.5">{user.presentOnDevice ? <span className={cn("inline-flex items-center gap-1.5 text-[10px] font-bold uppercase", user.enabled ? "text-[#39FF14]" : "text-gray-500")}>{user.enabled ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}{user.enabled ? "Enabled" : "Disabled"}</span> : <span className="text-gray-600">—</span>}</td>
                <td className="px-5 py-3.5"><div className="flex flex-wrap gap-1">{user.biometricCount > 0 && <Badge variant="outline" className="border-purple-400/20 bg-purple-400/10 text-[9px] text-purple-300"><Fingerprint className="mr-1 h-3 w-3" />{user.biometricCount}</Badge>}{user.hasCard && <Badge variant="outline" className="border-[#00BFFF]/20 bg-[#00BFFF]/10 text-[9px] text-[#00BFFF]"><CreditCard className="mr-1 h-3 w-3" />Card</Badge>}{user.hasPassword && <Badge variant="outline" className="border-amber-400/20 bg-amber-400/10 text-[9px] text-amber-300"><KeyRound className="mr-1 h-3 w-3" />PIN</Badge>}{user.biometricCount === 0 && !user.hasCard && !user.hasPassword && <span className="text-gray-600">None reported</span>}</div></td>
                <td className="px-5 py-3.5">{user.applicationUserId ? <div><p className="font-medium text-gray-200">{user.applicationUserName}</p><p className="font-mono text-[9px] text-gray-600">App #{user.applicationUserId}</p></div> : <span className="text-gray-600">Not linked</span>}</td>
                <td className="px-5 py-3.5"><SyncBadge user={user} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-white/5 px-5 pb-5"><PaginationFooter page={query.data?.page || page} totalPages={query.data?.totalPages || 0} setPage={setPage} itemsPerPage={PAGE_SIZE} totalItems={query.data?.count || 0} itemName="records" /></div>
    </section>
  );
}

function DeviceLogsTable({ snapshotId }: { snapshotId: string }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const deferredSearch = useDeferredValue(search.trim());
  const query = useBiometricSnapshotLogs(snapshotId, { search: deferredSearch || undefined, page, pageSize: PAGE_SIZE });
  const logs = query.data?.logs || [];

  useEffect(() => setPage(1), [deferredSearch]);

  return (
    <section className="glass-card overflow-hidden rounded-2xl border border-white/5 shadow-2xl">
      <div className="flex flex-col gap-4 border-b border-white/5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Device Logs</h3>
          <p className="mt-1 text-xs text-gray-500">Attendance events captured from the device during the last refresh, newest first.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
          <input aria-label="Search device logs" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search user or device ID..." className="h-9 w-full rounded-lg border border-white/10 bg-white/[0.02] pl-9 pr-3 text-xs text-white placeholder:text-gray-600 focus:border-[#00BFFF]/50 focus:outline-none sm:w-64" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-xs">
          <thead><tr className="border-b border-white/5 text-[9px] font-bold uppercase tracking-[0.16em] text-gray-500"><th className="px-5 py-3">Time</th><th className="px-5 py-3">User</th><th className="px-5 py-3">Device ID</th><th className="px-5 py-3">Verification</th><th className="px-5 py-3">Event</th><th className="px-5 py-3">Machine</th></tr></thead>
          <tbody className="divide-y divide-white/[0.03]">
            {query.isLoading ? (
              <tr><td colSpan={6} className="px-5 py-12 text-center font-mono text-[10px] uppercase tracking-wider text-gray-500">Loading cached logs...</td></tr>
            ) : query.isError ? (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-xs text-red-400">The cached device logs could not be loaded.</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-xs text-gray-500">No device logs were returned in this snapshot.</td></tr>
            ) : logs.map((log: BiometricSnapshotLog) => (
              <tr key={log.id} className="transition-colors hover:bg-white/[0.02]">
                <td className="whitespace-nowrap px-5 py-3.5 font-mono text-[10px] text-gray-300">{formatDateTime(log.occurredAt)}</td>
                <td className="px-5 py-3.5"><p className="font-semibold text-white">{log.deviceUserId === "0" ? "Unidentified attempt" : log.applicationUserName || log.deviceUserName || "Unknown user"}</p>{log.applicationUserId && <p className="font-mono text-[9px] text-gray-600">App #{log.applicationUserId}</p>}</td>
                <td className="px-5 py-3.5 font-mono font-bold text-[#00BFFF]">{log.deviceUserId === "0" ? "—" : `#${log.deviceUserId}`}</td>
                <td className="px-5 py-3.5 text-gray-300">{verificationLabel(log.verifyType, log.deviceType)}</td>
                <td className="px-5 py-3.5"><Badge variant="outline" className="border-[#39FF14]/20 bg-[#39FF14]/10 text-[9px] uppercase text-[#39FF14]">{eventLabel(log.verifyMode)}</Badge></td>
                <td className="px-5 py-3.5 font-mono text-[10px] text-gray-500">{log.machineNo || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-white/5 px-5 pb-5"><PaginationFooter page={query.data?.page || page} totalPages={query.data?.totalPages || 0} setPage={setPage} itemsPerPage={PAGE_SIZE} totalItems={query.data?.count || 0} itemName="logs" /></div>
    </section>
  );
}

export default function BiometricDevicePage() {
  const { toast } = useToast();
  const deviceQuery = useBiometricDevice();
  const refetchDevice = deviceQuery.refetch;
  const refreshMutation = useRefreshBiometricDevice();
  const [refreshId, setRefreshId] = useState<string>();
  const [activeTab, setActiveTab] = useState<"information" | "logs" | "users">("information");
  const finishedRefreshId = useRef<string>();
  const refreshQuery = useBiometricRefresh(refreshId);
  const data = deviceQuery.data;
  const snapshot = data?.snapshot;
  const latestAttempt = data?.latestAttempt || null;
  const refreshing = Boolean(refreshId) || refreshMutation.isPending || latestAttempt?.status === "pending";

  useEffect(() => {
    if (!refreshId && latestAttempt?.status === "pending" && finishedRefreshId.current !== latestAttempt.id) setRefreshId(latestAttempt.id);
  }, [latestAttempt, refreshId]);

  useEffect(() => {
    const refresh = refreshQuery.data?.refresh;
    if (!refreshId || !refresh || refresh.status === "pending") return;
    finishedRefreshId.current = refreshId;
    setRefreshId(undefined);
    void refetchDevice();
    if (refresh.status === "completed") {
      toast({ title: "Device snapshot refreshed", description: "The dashboard now shows the latest physical-device state." });
    } else {
      toast({ title: "Device refresh failed", description: refresh.errorMessage || "The device did not respond.", variant: "destructive" });
    }
  }, [refetchDevice, refreshId, refreshQuery.data?.refresh, toast]);

  const handleRefresh = () => {
    refreshMutation.mutate(undefined, {
      onSuccess: (response) => setRefreshId(response.refreshId),
      onError: (error) => {
        toast({ title: "Refresh could not start", description: error.message, variant: "destructive" });
        void deviceQuery.refetch();
      },
    });
  };

  const deviceCheck = useMemo(() => {
    if (!snapshot) return { value: "Not checked", hint: "No device snapshot yet", tone: "text-gray-500", icon: WifiOff };
    const failed = latestAttempt && latestAttempt.id !== snapshot.id && ["failed", "timed_out"].includes(latestAttempt.status);
    if (failed) return { value: "Failed", hint: "Previous successful data is shown", tone: "text-red-400", icon: WifiOff };
    return { value: "Successful", hint: `Checked ${formatDateTime(snapshot.capturedAt)}`, tone: "text-[#39FF14]", icon: Wifi };
  }, [latestAttempt, snapshot]);

  if (deviceQuery.isLoading) {
    return <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02]"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">Loading biometric dashboard...</p></div>;
  }
  if (deviceQuery.isError || !data) {
    return <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-red-400/10 bg-red-400/[0.03] text-center"><ShieldAlert className="mb-3 h-8 w-8 text-red-400" /><p className="font-bold text-white">Biometric dashboard unavailable</p><Button variant="outline" className="mt-4 border-white/10 bg-transparent" onClick={() => deviceQuery.refetch()}>Try again</Button></div>;
  }

  return (
    <div className="space-y-6" id="biometric-device-panel">
      <section className="glass-card relative overflow-hidden rounded-2xl border border-white/5 p-5 shadow-2xl sm:p-6">
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#00BFFF] to-[#39FF14]" />
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-xl border border-[#00BFFF]/15 bg-[#00BFFF]/10 p-3 text-[#00BFFF]"><Fingerprint className="h-6 w-6" /></div>
            <h2 className="mt-2 text-xl font-black uppercase tracking-tight text-white">Biometric Device</h2>
          </div>
          <div className="flex flex-col items-stretch sm:items-end">
            <Button onClick={handleRefresh} disabled={refreshing} className="h-10 bg-gradient-to-r from-[#00BFFF] to-[#39FF14] px-5 text-xs font-black uppercase tracking-wider text-black hover:opacity-90">
              <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />{refreshing ? "Refreshing dashboard..." : "Refresh Dashboard"}
            </Button>
          </div>
        </div>
      </section>

      {refreshing && <div className="flex items-center gap-3 rounded-xl border border-[#00BFFF]/20 bg-[#00BFFF]/[0.06] p-4 text-xs text-[#00BFFF]"><RefreshCw className="h-4 w-4 animate-spin" /><div><p className="font-bold">Reading the physical terminal</p><p className="mt-0.5 text-[#00BFFF]/60">The previous data remains available while device information, logs, and stored users are refreshed.</p></div></div>}

      {!snapshot ? (
        <section className="glass-card flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-white/5 p-8 text-center shadow-2xl">
          {latestAttempt && ["failed", "timed_out"].includes(latestAttempt.status) ? <WifiOff className="mb-5 h-12 w-12 text-red-400/70" /> : <Server className="mb-5 h-12 w-12 text-gray-700" />}
          <h3 className="text-lg font-bold uppercase tracking-tight text-white">{latestAttempt?.status === "failed" ? "Device snapshot failed" : "No device snapshot yet"}</h3>
          <p className="mt-2 max-w-lg text-xs leading-relaxed text-gray-500">{latestAttempt?.errorMessage || "Use Refresh Dashboard to read the terminal. Opening this tab never contacts the physical device."}</p>
        </section>
      ) : (
        <>
          <SnapshotBanner snapshot={snapshot} latestAttempt={latestAttempt} />
          <div role="tablist" aria-label="Biometric device sections" className="glass-card flex flex-col gap-1 rounded-2xl border border-white/5 p-2 shadow-2xl sm:flex-row">
            {([
              { id: "information", label: "Device Information", icon: Info },
              { id: "logs", label: "Logs", icon: FileClock },
              { id: "users", label: "Stored Users", icon: Users },
            ] as const).map(({ id, label, icon: Icon }) => (
              <button key={id} type="button" role="tab" aria-selected={activeTab === id} onClick={() => setActiveTab(id)} className={cn("flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] transition-colors sm:flex-1", activeTab === id ? "bg-[#00BFFF]/15 text-[#00BFFF]" : "text-gray-500 hover:bg-white/[0.03] hover:text-white")}>
                <Icon className="h-4 w-4" />{label}
              </button>
            ))}
          </div>

          {activeTab === "information" && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryCard title="Last Device Check" value={deviceCheck.value} hint={deviceCheck.hint} icon={deviceCheck.icon} tone={deviceCheck.tone} />
                <SummaryCard title="Stored Users" value={snapshot.userCount} hint="Users reported by the device" icon={Users} tone="text-[#00BFFF]" />
                <SummaryCard title="Enabled Users" value={snapshot.enabledUserCount} hint={`${snapshot.disabledUserCount} disabled on the device`} icon={UserCheck} tone="text-[#39FF14]" />
                <SummaryCard title="Device/App Differences" value={snapshot.unmappedUserCount + snapshot.mismatchedUserCount + snapshot.missingUserCount} hint="Review in Stored Users → Sync Issues" icon={ShieldAlert} tone="text-amber-400" />
              </div>

              <section className="glass-card rounded-2xl border border-white/5 p-5 shadow-2xl sm:p-6">
                <div className="mb-3 flex items-center gap-2"><Cpu className="h-4 w-4 text-[#00BFFF]" /><h3 className="text-xs font-bold uppercase tracking-wider text-white">Device Details</h3></div>
                <div className="grid grid-cols-1 gap-x-8 lg:grid-cols-2">
                  <DetailRow label="Device name" value={snapshot.deviceName} /><DetailRow label="Serial number" value={snapshot.serialNumber} /><DetailRow label="Device time" value={snapshot.deviceTime} /><DetailRow label="Backend capture time" value={formatDateTime(snapshot.serverTime)} /><DetailRow label="Clock difference" value={formatDrift(snapshot.clockDriftSeconds)} /><DetailRow label="Snapshot captured" value={formatDateTime(snapshot.capturedAt)} />
                </div>
                {Math.abs(snapshot.clockDriftSeconds) > 300 && <div className="mt-4 flex gap-2 rounded-lg border border-red-400/20 bg-red-400/[0.06] p-3 text-[10px] leading-relaxed text-red-300"><AlertTriangle className="h-4 w-4 shrink-0" />Device clock differs by more than five minutes. Attendance timestamps may be inaccurate.</div>}
              </section>
            </>
          )}

          {activeTab === "logs" && <DeviceLogsTable snapshotId={snapshot.id} />}
          {activeTab === "users" && <DeviceUsersTable snapshotId={snapshot.id} />}
        </>
      )}
    </div>
  );
}
