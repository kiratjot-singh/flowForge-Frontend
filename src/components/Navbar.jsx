import { Activity, Cpu } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header
      className="
        sticky
        top-0
        z-50
        h-16
        border-b
        border-zinc-800/80
        bg-zinc-950/70
        backdrop-blur-md
        flex
        items-center
        justify-between
        px-6
        md:px-8
      "
    >
      <Link to="/" className="flex items-center gap-2.5 group">
        <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 group-hover:border-indigo-500/40 transition duration-300">
          <Cpu className="h-5 w-5 text-indigo-400 group-hover:rotate-12 transition duration-300" />
        </div>
        <h1 className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
          FlowForge
        </h1>
      </Link>

      <div className="flex items-center gap-4">
        {/* Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          All Systems Operational
        </div>

        {/* User Profile Mockup */}
        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 p-[1.5px] cursor-pointer hover:opacity-90 transition">
          <div className="h-full w-full bg-zinc-900 rounded-full flex items-center justify-center text-xs font-bold text-zinc-200">
            KS
          </div>
        </div>
      </div>
    </header>
  );
}