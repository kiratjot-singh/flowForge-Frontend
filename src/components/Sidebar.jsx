import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, PlusCircle } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside
      className="
        w-64
        m-6
        mr-0
        p-5
        hidden
        md:block
        space-y-2
        glass-panel
        h-[calc(100vh-120px)]
        sticky
        top-[96px]
      "
    >
      <div className="px-3 py-2 mb-2">
        <p className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest">
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
            ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/35 shadow-[0_0_20px_rgba(6,182,212,0.2)] font-semibold" 
            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/25 border border-transparent"}
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
            ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/35 shadow-[0_0_20px_rgba(6,182,212,0.2)] font-semibold" 
            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/25 border border-transparent"}
        `}
      >
        <PlusCircle className="h-4 w-4" />
        New Project
      </Link>
    </aside>
  );
}