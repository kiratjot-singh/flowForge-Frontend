import { Link } from "react-router-dom";
import { GitBranch, Folder, Calendar, ArrowRight, FolderGit } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function ProjectCard({ project }) {
  const getRepoName = (url) => {
    if (!url) return "unknown/repository";
    try {
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
    if (!dateString) return "No deployments yet";
    const date = new Date(dateString);
    return "Last deploy " + date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Link to={`/projects/${project.id}`} className="block group">
      <div
        className="
          glass-panel
          glass-panel-hover
          p-6
          cursor-pointer
          relative
          overflow-hidden
        "
      >

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-3 min-w-0">
            {/* Project name and repo details */}
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-100 group-hover:text-white transition duration-200">
                {project.name}
              </h3>
              <p className="text-xs text-zinc-500 flex items-center gap-1.5 font-mono truncate" title={project.repo_url}>
                <FolderGit className="h-3.5 w-3.5 text-zinc-650" />
                {getRepoName(project.repo_url)}
              </p>
            </div>

            {/* Branch name */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 text-xs text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 px-2.5 py-0.5 rounded-md">
                <GitBranch className="h-3 w-3" />
                {project.branch || "main"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            {project.latest_deployment_status ? (
              <StatusBadge status={project.latest_deployment_status} />
            ) : (
              <span className="text-xs font-semibold text-zinc-650 bg-zinc-900/50 px-2.5 py-1 rounded-full border border-zinc-850">
                NO RUNS
              </span>
            )}
            <ArrowRight className="h-4 w-4 text-zinc-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 hidden sm:block" />
          </div>
        </div>

        {/* Date line */}
        <div className="mt-4 pt-3 border-t border-zinc-800/40 flex items-center justify-between text-xs text-zinc-500">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-zinc-650" />
            {formattedDate(project.latest_deployment_date)}
          </span>
          <span className="font-mono text-zinc-600 group-hover:text-zinc-500 transition duration-300">
            #{project.id.slice(0, 8)}
          </span>
        </div>
      </div>
    </Link>
  );
}
