import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";
import DeploymentCard from "../components/DeploymentCard";

export default function Dashboard() {
  const [deployments, setDeployments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchDeployments();
  }, []);

  async function fetchDeployments() {
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/deployments"
      );

      const data =
        await response.json();

      setDeployments(
        data.deployments || []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <h2 className="text-zinc-400">
          Loading deployments...
        </h2>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div>
        <h1 className="text-4xl font-bold">
          Deployments
        </h1>

        <p className="text-zinc-400 mt-2">
          Manage all FlowForge deployments
        </p>
      </div>

      <div className="mt-8 grid gap-4">
        {deployments.length === 0 ? (
          <div
            className="
              bg-zinc-900
              border
              border-zinc-800
              rounded-2xl
              p-8
              text-center
            "
          >
            <h3 className="text-lg font-semibold">
              No Deployments Found
            </h3>

            <p className="text-zinc-500 mt-2">
              Trigger a GitHub webhook to
              create your first deployment.
            </p>
          </div>
        ) : (
          deployments.map(
            (deployment) => (
              <DeploymentCard
                key={deployment.id}
                deployment={deployment}
              />
            )
          )
        )}
      </div>
    </MainLayout>
  );
}
