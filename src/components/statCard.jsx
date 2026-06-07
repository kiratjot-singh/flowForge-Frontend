import { Layers, CheckCircle2, Activity, XCircle } from "lucide-react";

export default function StatCard({
  title,
  value
}) {
  // Map title to visual configurations
  const config = {
    total: {
      icon: Layers,
      color: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5 hover:border-indigo-500/40",
      glow: "group-hover:bg-indigo-500/10",
    },
    success: {
      icon: CheckCircle2,
      color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40",
      glow: "group-hover:bg-emerald-500/10",
    },
    running: {
      icon: Activity,
      color: "text-sky-400 border-sky-500/20 bg-sky-500/5 hover:border-sky-500/40",
      glow: "group-hover:bg-sky-500/10",
      iconClass: "animate-pulse",
    },
    failed: {
      icon: XCircle,
      color: "text-rose-400 border-rose-500/20 bg-rose-500/5 hover:border-rose-500/40",
      glow: "group-hover:bg-rose-500/10",
    },
  }[title.toLowerCase()] || {
    icon: Layers,
    color: "text-zinc-400 border-zinc-800 bg-zinc-900/40",
    glow: "",
  };

  const IconComponent = config.icon;

  return (
    <div
      className={`
        border
        rounded-2xl
        p-5
        bg-zinc-900/40
        backdrop-blur-sm
        transition-all
        duration-300
        group
        relative
        overflow-hidden
        ${config.color}
      `}
    >
      {/* Decorative Glow Dot */}
      <div className={`absolute top-0 right-0 w-24 h-24 blur-[40px] rounded-full transition-all duration-300 -mr-6 -mt-6 pointer-events-none opacity-40 ${config.glow}`} />

      <div className="flex justify-between items-start">
        <p className="text-sm font-semibold tracking-wide text-zinc-400 group-hover:text-zinc-300 transition duration-300">
          {title}
        </p>
        <IconComponent className={`h-4.5 w-4.5 text-zinc-500 group-hover:text-current transition duration-300 ${config.iconClass || ""}`} />
      </div>

      <h2 className="text-3xl font-extrabold mt-3 tracking-tight text-white group-hover:scale-[1.02] origin-left transition duration-300">
        {value}
      </h2>
    </div>
  );
}