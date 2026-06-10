import { Link } from "react-router-dom";
import { GitBranch, GitCommit, Folder, Calendar, ArrowRight } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function DeploymentCard({
  deployment,
  onRollback
}) {
  const getRepoName = (url) => {
    if (!url) return "unknown/repository";
    try {
      // Clean git suffix and trailing slashes
      const cleaned = url.trim().replace(/\.git$/, "").replace(/\/$/, "");
      const parts = cleaned.split("/");
      if (parts.length >= 2) {
        return `${parts[parts.length - 2]}/${parts[parts.length - 1]}`;
      }
      return url;
    } catch {
      return url;
    }
  };

  const formattedDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Link
      to={`/deployments/${deployment.id}`}
      className="block group"
    >
      <div
        className="
          bg-zinc-900/40
          backdrop-blur-sm
          border
          border-zinc-800/80
          rounded-2xl
          p-5
          hover:border-zinc-700/80
          hover:bg-zinc-900/60
          hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)]
          hover:translate-y-[-2px]
          transition-all
          duration-300
          cursor-pointer
          relative
          overflow-hidden
        "
      >
        {/* Subtle hover gradient indicator */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-3 min-w-0">
            {/* Repo and branch information */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-zinc-100 truncate max-w-[280px]">
                {getRepoName(deployment.repo_url)}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 px-2 py-0.5 rounded-md">
                <GitBranch className="h-3 w-3" />
                {deployment.branch || "main"}
              </span>
            </div>

            {/* Commit and output directory details */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-zinc-400">
              {deployment.commit_sha && (
                <span className="flex items-center gap-1.5 font-mono bg-zinc-950/40 px-2 py-1 rounded border border-zinc-800/40">
                  <GitCommit className="h-3 w-3 text-zinc-500" />
                  {deployment.commit_sha.slice(0, 7)}
                </span>
              )}
              
              <span className="flex items-center gap-1.5">
                <Folder className="h-3 w-3 text-zinc-500" />
                <span className="truncate">
                  {deployment.output_directory || "dist"}
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            {onRollback && deployment.status === "SUCCESS" && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRollback(e, deployment);
                }}
                className="
                  px-3
                  py-1.5
                  bg-indigo-650
                  hover:bg-indigo-500
                  active:bg-indigo-700
                  text-white
                  text-[11px]
                  font-bold
                  rounded-lg
                  transition
                  cursor-pointer
                  z-10
                "
              >
                Rollback
              </button>
            )}
            <StatusBadge status={deployment.status} />
            <ArrowRight className="h-4 w-4 text-zinc-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 hidden sm:block" />
          </div>
        </div>

        {/* Date line */}
        <div className="mt-4 pt-3 border-t border-zinc-800/40 flex items-center justify-between text-xs text-zinc-500">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-zinc-600" />
            {formattedDate(deployment.created_at)}
          </span>
          <span className="font-mono text-zinc-600 group-hover:text-zinc-500 transition duration-300">
            #{deployment.id.slice(0, 8)}
          </span>
        </div>
      </div>
    </Link>
  );
}