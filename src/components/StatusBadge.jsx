import { Loader2, CheckCircle, AlertCircle, Clock } from "lucide-react";

export default function StatusBadge({
  status
}) {
  if (status === "RUNNING") {
    return (
      <div
        className="
          flex
          items-center
          gap-2
          px-3
          py-1
          rounded-full
          border
          border-sky-500/30
          bg-sky-500/10
          text-sky-400
          text-xs
          font-semibold
          tracking-wide
          shadow-[0_0_10px_-2px_rgba(14,165,233,0.15)]
        "
      >
        <Loader2 className="h-3 w-3 animate-spin" />
        RUNNING
      </div>
    );
  }

  if (status === "SUCCESS") {
    return (
      <div
        className="
          flex
          items-center
          gap-2
          px-3
          py-1
          rounded-full
          border
          border-emerald-500/30
          bg-emerald-500/10
          text-emerald-400
          text-xs
          font-semibold
          tracking-wide
          shadow-[0_0_10px_-2px_rgba(16,185,129,0.15)]
        "
      >
        <CheckCircle className="h-3 w-3" />
        SUCCESS
      </div>
    );
  }

  if (status === "FAILED") {
    return (
      <div
        className="
          flex
          items-center
          gap-2
          px-3
          py-1
          rounded-full
          border
          border-rose-500/30
          bg-rose-500/10
          text-rose-400
          text-xs
          font-semibold
          tracking-wide
          shadow-[0_0_10px_-2px_rgba(244,63,94,0.15)]
        "
      >
        <AlertCircle className="h-3 w-3" />
        FAILED
      </div>
    );
  }

  return (
    <div
      className="
        flex
        items-center
        gap-2
        px-3
        py-1
        rounded-full
        border
        border-amber-500/30
        bg-amber-500/10
        text-amber-400
        text-xs
        font-semibold
        tracking-wide
        shadow-[0_0_10px_-2px_rgba(245,158,11,0.15)]
      "
    >
      <Clock className="h-3 w-3 animate-pulse" />
      PENDING
    </div>
  );
}
