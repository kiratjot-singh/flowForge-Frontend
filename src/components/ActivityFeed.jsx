import { History, GitBranch, CheckCircle2, XCircle, Loader2, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export default function ActivityFeed({
  deployments
}) {
  const recent = deployments.slice(0, 5);

  const getRepoName = (url) => {
    if (!url) return "unknown";
    try {
      const cleaned = url.trim().replace(/\.git$/, "").replace(/\/$/, "");
      const parts = cleaned.split("/");
      return parts.length >= 2 ? parts[parts.length - 1] : "repo";
    } catch {
      return "repo";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "SUCCESS":
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case "FAILED":
        return <XCircle className="h-4 w-4 text-rose-400" />;
      case "RUNNING":
        return <Loader2 className="h-4 w-4 text-sky-400 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-amber-400" />;
    }
  };

  const formattedDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className="
        bg-zinc-900/40
        backdrop-blur-sm
        border
        border-zinc-800/80
        rounded-2xl
        p-5
        h-fit
      "
    >
      <div className="flex items-center gap-2 mb-6">
        <History className="h-4 w-4 text-indigo-400" />
        <h2 className="font-bold text-base text-zinc-100 tracking-tight">
          Recent Activity
        </h2>
      </div>

      {recent.length === 0 ? (
        <p className="text-sm text-zinc-500 text-center py-6">
          No activity recorded.
        </p>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-800">
          {recent.map((deployment) => (
            <div
              key={deployment.id}
              className="relative group/item"
            >
              {/* Timeline status indicator dot */}
              <div className="absolute left-[-21px] top-1 bg-zinc-950 p-0.5 rounded-full z-10">
                {getStatusIcon(deployment.status)}
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-start gap-4">
                  <Link 
                    to={`/deployments/${deployment.id}`}
                    className="font-semibold text-sm text-zinc-200 hover:text-indigo-400 hover:underline transition truncate"
                  >
                    Deploy #{deployment.id.slice(0, 8)}
                  </Link>
                  <span className="text-[10px] text-zinc-500 font-mono tracking-wider shrink-0 mt-0.5">
                    {formattedDate(deployment.created_at)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span className="font-medium truncate text-zinc-300">
                    {getRepoName(deployment.repo_url)}
                  </span>
                  <span className="flex items-center gap-0.5 text-zinc-500 font-mono">
                    <GitBranch className="h-3 w-3" />
                    {deployment.branch || "main"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}