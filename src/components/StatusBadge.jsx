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
          border-blue-500/20
          bg-blue-500/10
          text-blue-400
          text-sm
          font-medium
        "
      >
        <div
          className="
            h-2
            w-2
            rounded-full
            bg-blue-400
            animate-pulse
          "
        />

        RUNNING
      </div>
    );
  }

  if (status === "SUCCESS") {
    return (
      <div
        className="
          px-3
          py-1
          rounded-full
          border
          border-green-500/20
          bg-green-500/10
          text-green-400
          text-sm
          font-medium
        "
      >
        SUCCESS
      </div>
    );
  }

  if (status === "FAILED") {
    return (
      <div
        className="
          px-3
          py-1
          rounded-full
          border
          border-red-500/20
          bg-red-500/10
          text-red-400
          text-sm
          font-medium
        "
      >
        FAILED
      </div>
    );
  }

  return (
    <div
      className="
        px-3
        py-1
        rounded-full
        border
        border-yellow-500/20
        bg-yellow-500/10
        text-yellow-400
        text-sm
        font-medium
      "
    >
      PENDING
    </div>
  );
}
