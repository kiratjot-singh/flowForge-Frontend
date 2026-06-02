import { useEffect, useState } from "react";

import ActivityFeed from "../components/ActivityFeed";
import MainLayout from "../layouts/MainLayout";
import StatCard from "../components/StatCard";
import DeploymentCard from "../components/DeploymentCard";

export default function Dashboard() {

  const [deployments, setDeployments] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchDeployments();

    const interval = setInterval(
      fetchDeployments,
      3000
    );

    return () =>
      clearInterval(interval);

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

  const filteredDeployments =
    deployments.filter(
      (deployment) => {

        const query =
          search.toLowerCase();

        return (
          deployment.id
            ?.toLowerCase()
            .includes(query) ||

          deployment.repo_url
            ?.toLowerCase()
            .includes(query) ||

          deployment.branch
            ?.toLowerCase()
            .includes(query)
        );
      }
    );

  const total =
    deployments.length;

  const success =
    deployments.filter(
      deployment =>
        deployment.status ===
        "SUCCESS"
    ).length;

  const failed =
    deployments.filter(
      deployment =>
        deployment.status ===
        "FAILED"
    ).length;

  const running =
    deployments.filter(
      deployment =>
        deployment.status ===
        "RUNNING"
    ).length;

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

      {/* Header */}

      <div>
        <h1 className="text-4xl font-bold">
          Deployments
        </h1>

        <p className="text-zinc-400 mt-2">
          Manage all FlowForge deployments
        </p>
      </div>

      {/* Stats */}

      <div
        className="
          grid
          md:grid-cols-4
          gap-4
          mt-8
        "
      >
        <StatCard
          title="Total"
          value={total}
        />

        <StatCard
          title="Success"
          value={success}
        />

        <StatCard
          title="Running"
          value={running}
        />

        <StatCard
          title="Failed"
          value={failed}
        />
      </div>

      {/* Search */}

      <div className="mt-8">

        <input
          type="text"
          placeholder="Search by deployment id, repo or branch..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="
            w-full
            bg-zinc-900
            border
            border-zinc-800
            rounded-2xl
            px-4
            py-3
            outline-none
            focus:border-zinc-700
          "
        />

      </div>

      {/* Main Content */}

      <div
        className="
          grid
          lg:grid-cols-3
          gap-6
          mt-10
        "
      >

        {/* Deployments */}

        <div className="lg:col-span-2">

          {filteredDeployments.length === 0 ? (

            <div
              className="
                bg-zinc-900
                border
                border-zinc-800
                rounded-2xl
                p-10
                text-center
              "
            >
              <h3 className="text-xl font-semibold">
                No Results Found
              </h3>

              <p className="text-zinc-500 mt-2">
                Try another search term.
              </p>
            </div>

          ) : (

            <div className="grid gap-4">

              {filteredDeployments.map(
                deployment => (
                  <DeploymentCard
                    key={deployment.id}
                    deployment={
                      deployment
                    }
                  />
                )
              )}

            </div>

          )}

        </div>

        {/* Activity Feed */}

        <ActivityFeed
          deployments={
            filteredDeployments
          }
        />

      </div>

    </MainLayout>
  );
}
