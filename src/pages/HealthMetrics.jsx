import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, Activity, ShieldCheck, AlertTriangle, Play,
  CheckCircle2, XCircle, Clock, Heart, ShieldAlert, BarChart3, Settings
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

function SVGAreaChart({ data, valueKey, label, color, unit = "%" }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-zinc-950/40 border border-zinc-900/40 rounded-2xl text-zinc-600 text-xs italic flex-1">
        No telemetry metrics recorded yet.
      </div>
    );
  }

  const width = 500;
  const height = 150;
  const padding = 15;

  const maxVal = Math.max(...data.map(d => parseFloat(d[valueKey]) || 0), 10);

  const points = data.map((d, index) => {
    const x = padding + (index * (width - 2 * padding)) / (data.length - 1 || 1);
    const val = parseFloat(d[valueKey]) || 0;
    const y = height - padding - (val * (height - 2 * padding)) / (maxVal || 1);
    return { x, y };
  });

  const linePath = points.map((p, index) => `${index === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  const areaPath = `
    ${linePath}
    L ${points[points.length - 1].x} ${height - padding}
    L ${points[0].x} ${height - padding}
    Z
  `;

  // Draw grid lines
  const gridLines = [];
  const gridCount = 4;
  for (let i = 0; i <= gridCount; i++) {
    const y = padding + (i * (height - 2 * padding)) / gridCount;
    gridLines.push(y);
  }

  const gradId = `grad-${valueKey}`;
  const strokeColor = color === "indigo" ? "#6366f1" : "#f43f5e";
  const stopColor = color === "indigo" ? "rgba(99,102,241,0.2)" : "rgba(244,63,94,0.2)";

  const rawLatest = data[data.length - 1][valueKey];
  const latestVal = parseFloat(rawLatest);

  return (
    <div className="bg-zinc-950/30 border border-zinc-900/80 p-5 rounded-2xl relative flex-1">
      <div className="flex justify-between items-baseline mb-3">
        <span className="text-xs font-semibold text-zinc-400">{label}</span>
        <span className={`text-sm font-extrabold ${color === "indigo" ? "text-indigo-400" : "text-rose-450"}`}>
          {!isNaN(latestVal) ? latestVal.toFixed(1) : "0.0"}{unit}
        </span>
      </div>

      <div className="relative w-full h-[140px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stopColor} />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {gridLines.map((y, index) => (
            <line
              key={index}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="rgba(255,255,255,0.02)"
              strokeWidth="1"
            />
          ))}

          {/* Area fill */}
          <path d={areaPath} fill={`url(#${gradId})`} />

          {/* Line stroke */}
          <path d={linePath} fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />

          {/* Glow indicator at the end */}
          {points.length > 0 && (
            <circle
              cx={points[points.length - 1].x}
              cy={points[points.length - 1].y}
              r="3.5"
              fill={strokeColor}
              className="animate-pulse"
            />
          )}
        </svg>
      </div>

      {/* Footer labels */}
      <div className="flex justify-between mt-2 text-[9px] text-zinc-600 font-mono">
        <span>Oldest sample</span>
        <span>Just now</span>
      </div>
    </div>
  );
}

export default function HealthMetrics() {
  const { id } = useParams(); // deploymentId
  const [deployment, setDeployment] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [telemetry, setTelemetry] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [id]);

  async function fetchData() {
    try {
      // 1. Fetch deployment details to get projectId
      const depResponse = await api.get(`/deployments/${id}/details`);
      const depData = depResponse.data;
      setDeployment(depData);

      // 2. Fetch health metrics for the project
      if (depData && depData.project_id) {
        const metricsResponse = await api.get(`/projects/${depData.project_id}/health-metrics`);
        setMetrics(metricsResponse.data.metrics);
      }

      // 3. Fetch telemetry metrics
      const telResponse = await api.get(`/deployments/${id}/metrics`);
      if (telResponse.data?.success) {
        setTelemetry(telResponse.data.metrics || []);
      }
    } catch (error) {
      console.error("Failed to load metrics:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
          <Activity className="h-8 w-8 text-indigo-500 animate-pulse" />
          <p className="text-zinc-550 text-sm">Loading health & recovery benchmarks...</p>
        </div>
      </MainLayout>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "HEALTHY":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "UNHEALTHY":
        return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      case "RECOVERING":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20 animate-pulse";
      case "RECOVERY_FAILED":
        return "text-red-500 bg-red-500/10 border-red-500/20 font-bold";
      default:
        return "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";
    }
  };

  const formatTime = (ms) => {
    if (ms === null || ms === undefined || isNaN(ms)) return "N/A";
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatBytes = (bytes) => {
    const val = parseFloat(bytes) || 0;
    if (val === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(val) / Math.log(k));
    return parseFloat((val / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getEventBadge = (type) => {
    switch (type) {
      case "HEALTH_CHECK_FAILED":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">PROBE FAIL</span>;
      case "FAILURE_INCIDENT_STARTED":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">INCIDENT START</span>;
      case "RECOVERY_STARTED":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">RECOVERING</span>;
      case "RECOVERY_SUCCEEDED":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">RECOVERED</span>;
      case "RECOVERY_FAILED":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600/20 text-red-500 border border-red-600/30">FAILED</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-400">{type}</span>;
    }
  };

  const activeState = metrics?.active || deployment || {};

  return (
    <MainLayout>
      {/* Navigation & Header */}
      <Link 
        to={`/deployments/${id}`} 
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Deployment
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-900">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Health & Recovery Dashboard
          </h1>
          <p className="text-zinc-550 text-xs font-mono">
            Deployment: {id.slice(0, 8)}... | Project ID: {deployment?.project_id?.slice(0, 8)}...
          </p>
        </div>

        {/* Current Status Badge */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-455 font-semibold">Active Status:</span>
          <span className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold border ${getStatusColor(activeState.health_status)}`}>
            {activeState.health_status || "UNKNOWN"}
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        
        {/* Success Rate */}
        <div className="bg-zinc-900/25 backdrop-blur-sm border border-zinc-850 p-6 rounded-2xl flex flex-col justify-between min-h-[130px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Recovery Success Rate</span>
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {metrics?.recoverySuccessRate?.toFixed(1) || "100.0"}%
            </span>
            <span className="text-xs text-zinc-500">
              ({metrics?.successfulRecoveries || 0}/{metrics?.totalRecoveryAttempts || 0})
            </span>
          </div>
        </div>

        {/* Total Failures */}
        <div className="bg-zinc-900/25 backdrop-blur-sm border border-zinc-850 p-6 rounded-2xl flex flex-col justify-between min-h-[130px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Total Crashes</span>
            <ShieldAlert className="h-5 w-5 text-rose-450" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-white">
              {metrics?.totalFailures || 0}
            </span>
            <p className="text-[10px] text-zinc-500 mt-1">Controlled incidents captured</p>
          </div>
        </div>

        {/* Mean Recovery Time */}
        <div className="bg-zinc-900/25 backdrop-blur-sm border border-zinc-850 p-6 rounded-2xl flex flex-col justify-between min-h-[130px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Mean Recovery Time</span>
            <Clock className="h-5 w-5 text-indigo-400" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-white">
              {formatTime(metrics?.meanRecoveryTimeMs)}
            </span>
            <p className="text-[10px] text-zinc-500 mt-1">Average time to restore readiness</p>
          </div>
        </div>

        {/* Active Recovery Mode */}
        <div className="bg-zinc-900/25 backdrop-blur-sm border border-zinc-850 p-6 rounded-2xl flex flex-col justify-between min-h-[130px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Supervisor Mode</span>
            <Settings className="h-5 w-5 text-zinc-450" />
          </div>
          <div className="mt-4">
            <span className="text-lg font-extrabold text-zinc-200 uppercase tracking-wide">
              {activeState.health_check_mode || "AUTO"}
            </span>
            <p className="text-[10px] text-zinc-500 mt-2 truncate">
              Path: <span className="font-mono text-zinc-400">{activeState.health_check_path || "Not Discovered"}</span>
            </p>
          </div>
        </div>

      </div>

      {/* Container Resource Telemetry SVG Charts */}
      <div className="bg-zinc-900/25 backdrop-blur-sm border border-zinc-850 p-6 rounded-2xl mt-6">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="h-4 w-4 text-indigo-400" />
          <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">
            Container Resource Telemetry
          </h2>
        </div>
        <p className="text-xs text-zinc-550 mb-6 font-mono">Real-time system health parameters collected via docker stats.</p>

        <div className="flex flex-col lg:flex-row gap-6">
          <SVGAreaChart 
            data={telemetry} 
            valueKey="cpuPercentage" 
            label="CPU Utilization Trend" 
            color="indigo" 
            unit="%" 
          />
          <SVGAreaChart 
            data={telemetry} 
            valueKey="memoryUsageMb" 
            label="Memory Allocation Trend" 
            color="rose" 
            unit=" MB" 
          />
        </div>
      </div>

      {/* Benchmarking Charts and Runtime Metrics Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Percentiles performance list */}
        <div className="lg:col-span-1 bg-zinc-900/25 backdrop-blur-sm border border-zinc-850 p-6 rounded-2xl flex flex-col justify-between min-h-[350px]">
          <div>
            <h2 className="text-sm font-bold text-zinc-300 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-indigo-400" />
              Recovery Percentiles
            </h2>
            <p className="text-xs text-zinc-500 mt-1">Benchmarking recovery latency distributions.</p>
          </div>

          <div className="space-y-4 my-6">
            <div>
              <div className="flex justify-between text-xs font-semibold text-zinc-400 mb-1">
                <span>Median (p50)</span>
                <span>{formatTime(metrics?.medianRecoveryTimeMs)}</span>
              </div>
              <div className="h-2 bg-zinc-950 rounded overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded" 
                  style={{ width: metrics?.medianRecoveryTimeMs ? "50%" : "0%" }} 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-zinc-400 mb-1">
                <span>p95 Latency</span>
                <span>{formatTime(metrics?.p95RecoveryTimeMs)}</span>
              </div>
              <div className="h-2 bg-zinc-950 rounded overflow-hidden">
                <div 
                  className="h-full bg-rose-500 rounded" 
                  style={{ width: metrics?.p95RecoveryTimeMs ? "95%" : "0%" }} 
                />
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-850/80 pt-4 flex flex-col gap-2 text-[11px] text-zinc-550 font-mono">
            <div className="flex justify-between">
              <span>Lifetime Restarts:</span>
              <span className="text-zinc-350">{activeState.restart_count || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Incident Retries:</span>
              <span className="text-zinc-350">{activeState.recovery_attempts || 0}/3</span>
            </div>
            <div className="flex justify-between">
              <span>Current Recovery:</span>
              <span className={`font-bold ${activeState.recovery_status === "FAILED" ? "text-red-500" : activeState.recovery_status === "RECOVERING" ? "text-amber-400" : "text-zinc-450"}`}>
                {activeState.recovery_status || "UNKNOWN"}
              </span>
            </div>
            <div className="flex justify-between border-t border-zinc-850/40 pt-2">
              <span>Network Received:</span>
              <span className="text-indigo-400 font-semibold">
                {telemetry.length > 0 ? formatBytes(telemetry[telemetry.length - 1].networkRxBytes) : "0 B"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Network Transmitted:</span>
              <span className="text-rose-455 font-semibold">
                {telemetry.length > 0 ? formatBytes(telemetry[telemetry.length - 1].networkTxBytes) : "0 B"}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Timeline Events Log */}
        <div className="lg:col-span-2 bg-zinc-900/25 backdrop-blur-sm border border-zinc-850 p-6 rounded-2xl flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-850/80 pb-4">
            <h2 className="text-sm font-bold text-zinc-300 flex items-center gap-2">
              <Activity className="h-4 w-4 text-rose-500" />
              Supervisor Event History
            </h2>
            <span className="text-[10px] text-zinc-550 uppercase tracking-wider font-semibold">Latest 50 events</span>
          </div>

          <div className="mt-4 flex-1 overflow-y-auto max-h-[250px] pr-2 space-y-3 scrollbar-thin">
            {!metrics?.events || metrics.events.length === 0 ? (
              <div className="text-center py-16 text-zinc-650 text-xs flex flex-col items-center gap-2 select-none">
                <Heart className="h-6 w-6 opacity-30 text-emerald-500 animate-pulse" />
                <span>No health incidents recorded yet. The system is operating cleanly.</span>
              </div>
            ) : (
              metrics.events.map((event) => (
                <div key={event.id} className="flex items-start justify-between gap-4 p-3 bg-zinc-950/65 border border-zinc-900 rounded-xl hover:border-zinc-850 transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getEventBadge(event.event_type)}
                      <span className={`text-[10px] uppercase font-bold px-1.5 py-0.25 rounded ${event.status === "HEALTHY" ? "bg-emerald-500/10 text-emerald-450" : "bg-rose-500/10 text-rose-450"}`}>
                        {event.status}
                      </span>
                      {event.recovery_time_ms && (
                        <span className="text-[10px] text-zinc-500 font-mono">
                          Duration: {formatTime(event.recovery_time_ms)}
                        </span>
                      )}
                    </div>
                    {event.reason && (
                      <p className="text-xs text-zinc-400 font-mono mt-1 break-all">
                        {event.reason}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono shrink-0">
                    {new Date(event.created_at).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </MainLayout>
  );
}
