import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, Globe, RefreshCw, Copy, GitFork, GitBranch, 
  GitCommit, FolderOpen, ExternalLink, Search, Terminal, ArrowDown 
} from "lucide-react";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout";
import StatusBadge from "../components/StatusBadge";
import api, { getBackendHost } from "../services/api";

export default function DeploymentDetails() {
  const { id } = useParams();
  
  const [deployment, setDeployment] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logSearch, setLogSearch] = useState("");
  
  const logsContainerRef = useRef(null);

  useEffect(() => {
    fetchDeployment();
    const interval = setInterval(fetchDeployment, 2000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 2000);
    return () => clearInterval(interval);
  }, [id]);

  // Auto scroll logs to bottom when they update
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  async function fetchDeployment() {
    try {
      const response = await api.get(
        `/deployments/${id}/details`
      );
      setDeployment(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchLogs() {
    try {
      const response = await api.get(
        `/deployments/${id}/logs`
      );
      setLogs(response.data.logs || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`${getBackendHost()}/api/v1/deployments/${id}`);
    toast.success("URL copied to clipboard!");
  };

  const handleCopyLogs = () => {
    const logContent = logs.map(l => l.log).join("\n");
    if (logContent) {
      navigator.clipboard.writeText(logContent);
      toast.success("Logs copied to clipboard!");
    } else {
      toast.error("No logs to copy");
    }
  };

  const handleScrollToBottom = () => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTo({
        top: logsContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  const getRepoName = (url) => {
    if (!url) return "unknown/repository";
    try {
      const cleaned = url.trim().replace(/\.git$/, "").replace(/\/$/, "");
      const parts = cleaned.split("/");
      return parts.length >= 2 ? `${parts[parts.length - 2]}/${parts[parts.length - 1]}` : url;
    } catch {
      return url;
    }
  };

  const filteredLogs = logs.filter(log => 
    log.log?.toLowerCase().includes(logSearch.toLowerCase())
  );

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
          <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
          <p className="text-zinc-500 text-sm">Retrieving deployment run information...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Back button */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-350 transition mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Dashboard
      </Link>

      {/* Header and Action Pane */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-900">
        <div className="space-y-2 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white truncate max-w-md">
              Deploy #{id.slice(0, 8)}
            </h1>
            {deployment && <StatusBadge status={deployment.status} />}
          </div>
          <p className="text-zinc-500 font-mono text-xs truncate">
            ID: {deployment?.id}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={handleCopyUrl}
            className="
              inline-flex
              items-center
              gap-2
              px-4
              py-2.5
              bg-zinc-900/60
              hover:bg-zinc-900
              border
              border-zinc-800
              hover:border-zinc-700
              text-zinc-300
              hover:text-white
              text-xs
              font-semibold
              rounded-xl
              transition
              cursor-pointer
            "
          >
            <Copy className="h-3.5 w-3.5" />
            Copy Deployment URL
          </button>

          <a
            href={`${getBackendHost()}/api/v1/deployments/${id}`}
            target="_blank"
            rel="noreferrer"
            className="
              inline-flex
              items-center
              gap-2
              px-4
              py-2.5
              bg-white
              hover:bg-zinc-200
              text-black
              text-xs
              font-semibold
              rounded-xl
              transition
              cursor-pointer
            "
          >
            <Globe className="h-3.5 w-3.5" />
            View Live Deployment
            <ExternalLink className="h-3.5 w-3.5 ml-0.5 opacity-60" />
          </a>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {/* Repo Card */}
        <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-850 p-5 rounded-2xl flex items-start gap-4">
          <div className="p-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-zinc-400">
            <GitFork className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Repository</p>
            <p className="text-sm font-semibold text-zinc-200 mt-1 truncate" title={deployment?.repo_url}>
              {getRepoName(deployment?.repo_url)}
            </p>
          </div>
        </div>

        {/* Branch Card */}
        <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-850 p-5 rounded-2xl flex items-start gap-4">
          <div className="p-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-zinc-400">
            <GitBranch className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Branch</p>
            <p className="text-sm font-semibold text-zinc-200 mt-1 truncate">
              {deployment?.branch || "main"}
            </p>
          </div>
        </div>

        {/* Commit SHA Card */}
        <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-850 p-5 rounded-2xl flex items-start gap-4">
          <div className="p-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-zinc-400">
            <GitCommit className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Commit SHA</p>
            <p className="text-sm font-semibold text-zinc-200 mt-1 font-mono truncate">
              {deployment?.commit_sha?.slice(0, 7) || "N/A"}
            </p>
          </div>
        </div>

        {/* Directory Card */}
        <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-850 p-5 rounded-2xl flex items-start gap-4">
          <div className="p-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-zinc-400">
            <FolderOpen className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Output Folder</p>
            <p className="text-sm font-semibold text-zinc-200 mt-1 truncate">
              {deployment?.output_directory || "dist"}
            </p>
          </div>
        </div>
      </div>

      {/* Retro OS Style Terminal Console */}
      <div className="mt-8 border border-zinc-800/80 bg-zinc-950/80 rounded-2xl overflow-hidden shadow-2xl relative">
        {/* Terminal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-b border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-3">
            {/* Window control dots mock */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="h-3 w-3 rounded-full bg-rose-500/80 block" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80 block" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80 block" />
            </div>
            
            <div className="h-4 w-[1px] bg-zinc-800 mx-1 hidden sm:block" />
            
            <span className="flex items-center gap-2 text-zinc-400 font-mono text-xs font-semibold">
              <Terminal className="h-3.5 w-3.5 text-indigo-400" />
              console_output.log
            </span>
          </div>

          {/* Terminal search & logs actions */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-zinc-650">
                <Search className="h-3.5 w-3.5" />
              </div>
              <input
                type="text"
                placeholder="Search logs..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="
                  bg-zinc-900/60
                  focus:bg-zinc-900
                  border
                  border-zinc-800
                  focus:border-indigo-500/40
                  rounded-lg
                  pl-8
                  pr-3
                  py-1
                  text-zinc-300
                  placeholder-zinc-600
                  text-[11px]
                  font-mono
                  outline-none
                  w-[140px]
                  sm:w-[180px]
                  transition-all
                "
              />
            </div>

            <button
              onClick={handleCopyLogs}
              className="
                p-1.5
                hover:bg-zinc-900
                border
                border-zinc-850
                hover:border-zinc-800
                text-zinc-400
                hover:text-zinc-200
                rounded-lg
                transition
                title='Copy entire logs'
                cursor-pointer
              "
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Logs Terminal Display */}
        <div
          ref={logsContainerRef}
          className="
            p-5
            h-[500px]
            overflow-y-auto
            font-mono
            text-xs
            leading-relaxed
            bg-zinc-950/60
            scrollbar-thin
            space-y-1.5
          "
        >
          {filteredLogs.length === 0 ? (
            <div className="text-zinc-650 text-center py-20 flex flex-col items-center justify-center gap-2 select-none">
              <Terminal className="h-6 w-6 opacity-30" />
              <span>{logSearch ? "No matching logs found" : "No logs generated for this deployment"}</span>
            </div>
          ) : (
            filteredLogs.map((log, index) => {
              // Parse out common terms like SUCCESS, FAILED, INFO, ERROR to colorized styles
              let lineClass = "text-zinc-400";
              const content = log.log || "";
              
              if (content.toLowerCase().includes("error") || content.toLowerCase().includes("failed")) {
                lineClass = "text-rose-400";
              } else if (content.toLowerCase().includes("success") || content.toLowerCase().includes("successfully")) {
                lineClass = "text-emerald-400";
              } else if (content.toLowerCase().includes("running") || content.toLowerCase().includes("start")) {
                lineClass = "text-sky-400";
              } else if (content.startsWith("[$]")) {
                lineClass = "text-indigo-400 font-semibold";
              }

              return (
                <div
                  key={index}
                  className={`
                    whitespace-pre-wrap
                    break-all
                    px-2
                    py-0.5
                    rounded
                    hover:bg-zinc-900/30
                    transition
                    ${lineClass}
                  `}
                >
                  {content}
                </div>
              );
            })
          )}
        </div>

        {/* Scroll To Bottom Button */}
        {logs.length > 0 && (
          <button
            onClick={handleScrollToBottom}
            className="
              absolute
              bottom-4
              right-4
              p-2
              bg-indigo-600/90
              hover:bg-indigo-500
              text-white
              rounded-full
              shadow-lg
              transition-all
              hover:scale-105
              cursor-pointer
            "
            title="Scroll to bottom"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
        )}
      </div>
    </MainLayout>
  );
}