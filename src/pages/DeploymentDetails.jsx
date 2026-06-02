import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import StatusBadge from "../components/StatusBadge";

export default function DeploymentDetails() {
  const { id } = useParams();

  const [deployment, setDeployment] =
    useState(null);

  const [logs, setLogs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
  fetchDeployment();

  const interval = setInterval(
    fetchDeployment,
    2000
  );

  return () =>
    clearInterval(interval);

}, [id]);

  useEffect(() => {
  fetchLogs();

  const interval = setInterval(
    fetchLogs,
    2000
  );

  return () =>
    clearInterval(interval);

}, [id]);

  async function fetchDeployment() {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/deployments/${id}/details`
      );

      const data =
        await response.json();
        console.log(data);
        

      setDeployment(
        data
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchLogs() {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/deployments/${id}/logs`
      );

      const data =
        await response.json();

      setLogs(data.logs || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <MainLayout>
        Loading deployment...
      </MainLayout>
    );
  }

  return (
    <MainLayout>

      {/* Header */}

      <div className="flex justify-between items-start">

        <div>
          <h1 className="text-4xl font-bold">
            Deployment
          </h1>

          <p className="text-zinc-500 mt-2">
            {deployment?.id}
          </p>
        </div>

        {deployment && (
          <StatusBadge
            status={deployment.status}
          />
        )}

      </div>

      {/* Info Card */}

      <div
        className="
          mt-8
          bg-zinc-900
          border
          border-zinc-800
          rounded-2xl
          p-6
        "
      >
        <h2 className="text-xl font-semibold">
          Deployment Info
        </h2>

        <div className="mt-4 space-y-2">

          <p>
            <span className="text-zinc-500">
              Output Directory:
            </span>
            {" "}
            {
              deployment?.output_directory ||
              "N/A"
            }
          </p>

          <p>
            <span className="text-zinc-500">
              Created:
            </span>
            {" "}
            {new Date(
              deployment?.created_at
            ).toLocaleString()}
          </p>

        </div>

        <a
          href={`http://localhost:3000/api/v1/deployments/${id}`}
          target="_blank"
          rel="noreferrer"
        >
          <button
            className="
              mt-6
              px-4
              py-2
              rounded-xl
              bg-white
              text-black
              font-medium
            "
          >
            View Deployment
          </button>
        </a>

      </div>

      {/* Logs */}

      <div
        className="
          mt-8
          bg-zinc-900
          border
          border-zinc-800
          rounded-2xl
          p-6
        "
      >
        <h2 className="text-xl font-semibold">
          Build Logs
        </h2>

        <div
          className="
            mt-4
            bg-black
            rounded-xl
            p-4
            h-[500px]
            overflow-auto
            font-mono
            text-sm
          "
        >
          {logs.length === 0 ? (
            <p className="text-zinc-500">
              No logs found
            </p>
          ) : (
            logs.map(
              (log, index) => (
                <div
                  key={index}
                  className="
                    mb-2
                    text-zinc-300
                  "
                >
                  {log.log}
                </div>
              )
            )
          )}
        </div>

      </div>

    </MainLayout>
  );
}