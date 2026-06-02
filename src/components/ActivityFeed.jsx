export default function ActivityFeed({
  deployments
}) {
  const recent =
    deployments.slice(0, 5);

  return (
    <div
      className="
        bg-zinc-900
        border
        border-zinc-800
        rounded-2xl
        p-5
      "
    >
      <h2 className="font-semibold text-lg">
        Recent Activity
      </h2>

      <div className="mt-4 space-y-4">

        {recent.map(
          deployment => (
            <div
              key={deployment.id}
              className="
                border-b
                border-zinc-800
                pb-3
              "
            >
              <p className="font-medium">
                {deployment.id.slice(
                  0,
                  10
                )}
                ...
              </p>

              <p
                className="
                  text-sm
                  text-zinc-500
                "
              >
                {deployment.status}
              </p>
            </div>
          )
        )}

      </div>
    </div>
  );
}