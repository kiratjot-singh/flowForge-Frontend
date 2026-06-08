import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, PlusCircle } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside
      className="
        w-64
        border-r
        border-zinc-800/60
        bg-zinc-950/20
        min-h-[calc(100vh-64px)]
        p-4
        hidden
        md:block
        space-y-1.5
      "
    >
      <div className="px-3 py-2">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          Navigation
        </p>
      </div>

      <Link
        to="/"
        className={`
          flex
          items-center
          gap-3
          px-4
          py-3
          rounded-xl
          text-sm
          font-medium
          transition-all
          duration-200
          ${currentPath === "/" 
            ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_-3px_rgba(99,102,241,0.15)]" 
            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 border border-transparent"}
        `}
      >
        <LayoutDashboard className="h-4 w-4" />
        Projects
      </Link>

      <Link
        to="/deploy"
        className={`
          flex
          items-center
          gap-3
          px-4
          py-3
          rounded-xl
          text-sm
          font-medium
          transition-all
          duration-200
          ${currentPath === "/deploy" 
            ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_-3px_rgba(99,102,241,0.15)]" 
            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 border border-transparent"}
        `}
      >
        <PlusCircle className="h-4 w-4" />
        New Project
      </Link>
    </aside>
  );
}