import { Link } from "react-router-dom";

import StatusBadge from "./StatusBadge";

export default function DeploymentCard({
  deployment
}) {
  return (
    <Link
      to={`/deployments/${deployment.id}`}
    >
      <div
        className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-2xl
          p-5
          hover:border-zinc-700
          transition
          cursor-pointer
        "
      >
        <div className="flex justify-between items-start">

          <div>
            <h3 className="font-semibold">
              {deployment.id.slice(
                0,
                12
              )}
              ...
            </h3>

            <p className="text-zinc-500 mt-2">
              Output:
              {" "}
              {deployment.output_directory ||
                "N/A"}
            </p>
          </div>

          <StatusBadge
            status={
              deployment.status
            }
          />

        </div>

        <div className="mt-4 text-sm text-zinc-500">
          {new Date(
            deployment.created_at
          ).toLocaleString()}
        </div>
      </div>
    </Link>
  );
}