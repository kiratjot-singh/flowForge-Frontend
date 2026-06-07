import { useEffect, useState } from "react";
import { Search, Server, Plus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

import ActivityFeed from "../components/ActivityFeed";
import MainLayout from "../layouts/MainLayout";
import StatCard from "../components/StatCard";
import DeploymentCard from "../components/DeploymentCard";
import api from "../services/api";

export default function Dashboard() {
  const [deployments, setDeployments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeployments();
    const interval = setInterval(fetchDeployments, 3000);
    return () => clearInterval(interval);
  }, []);

  async function fetchDeployments() {
    try {
      const response = await api.get("/deployments");
      setDeployments(response.data.deployments || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const filteredDeployments = deployments.filter((deployment) => {
    const query = search.toLowerCase();
    return (
      deployment.id?.toLowerCase().includes(query) ||
      deployment.repo_url?.toLowerCase().includes(query) ||
      deployment.branch?.toLowerCase().includes(query)
    );
  });

  const total = deployments.length;
  const success = deployments.filter(d => d.status === "SUCCESS").length;
  const failed = deployments.filter(d => d.status === "FAILED").length;
  const running = deployments.filter(d => d.status === "RUNNING").length;

  if (loading) {
    return (
      <MainLayout>
        {/* Loading Skeletons */}
        <div className="space-y-8 animate-pulse">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center">
            <div className="space-y-3">
              <div className="h-9 w-48 bg-zinc-800/80 rounded-xl" />
              <div className="h-4 w-64 bg-zinc-800/40 rounded-lg" />
            </div>
            <div className="h-11 w-36 bg-zinc-800/80 rounded-xl" />
          </div>

          {/* Stats Skeletons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-zinc-900/30 border border-zinc-850 rounded-2xl" />
            ))}
          </div>

          {/* Search bar Skeleton */}
          <div className="h-12 w-full bg-zinc-900/30 border border-zinc-850 rounded-2xl" />

          {/* Content Layout Skeleton */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-zinc-900/30 border border-zinc-850 rounded-2xl" />
              ))}
            </div>
            <div className="h-80 bg-zinc-900/30 border border-zinc-850 rounded-2xl" />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Deployments
          </h1>
          <p className="text-zinc-400 text-sm mt-1.5 flex items-center gap-1.5">
            <Server className="h-4 w-4 text-zinc-500" />
            Monitor and trigger your FlowForge cloud applications
          </p>
        </div>

        <Link
          to="/deploy"
          className="
            inline-flex
            items-center
            gap-2
            px-4.5
            py-2.5
            bg-indigo-600
            hover:bg-indigo-500
            active:bg-indigo-700
            text-white
            text-sm
            font-semibold
            rounded-xl
            shadow-lg
            shadow-indigo-500/20
            hover:shadow-indigo-500/30
            hover:translate-y-[-1px]
            transition-all
            duration-200
            w-fit
          "
        >
          <Plus className="h-4 w-4" />
          New Deployment
        </Link>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <StatCard title="Total" value={total} />
        <StatCard title="Success" value={success} />
        <StatCard title="Running" value={running} />
        <StatCard title="Failed" value={failed} />
      </div>

      {/* Search Actions */}
      <div className="mt-8 relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          placeholder="Search deployments by ID, repository, or branch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full
            bg-zinc-900/30
            hover:bg-zinc-900/50
            focus:bg-zinc-950/80
            border
            border-zinc-800/80
            focus:border-indigo-500/50
            rounded-2xl
            pl-12
            pr-4
            py-3.5
            text-zinc-200
            placeholder-zinc-500
            text-sm
            outline-none
            focus:shadow-[0_0_20px_rgba(99,102,241,0.05)]
            transition-all
            duration-300
          "
        />
      </div>

      {/* Core Grid */}
      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        {/* Deployments List */}
        <div className="lg:col-span-2">
          {filteredDeployments.length === 0 ? (
            <div
              className="
                bg-zinc-900/20
                border
                border-zinc-800/60
                rounded-2xl
                p-12
                text-center
                backdrop-blur-sm
              "
            >
              <div className="w-12 h-12 rounded-full bg-zinc-800/40 flex items-center justify-center mx-auto mb-4 border border-zinc-850">
                <Search className="h-5 w-5 text-zinc-500" />
              </div>
              <h3 className="text-lg font-bold text-zinc-200">
                No deployments found
              </h3>
              <p className="text-zinc-500 text-sm mt-1.5 max-w-sm mx-auto">
                No active runs match your search filters. Try verifying your terms or create a new deploy.
              </p>
            </div>
          ) : (
            <div className="grid gap-4.5">
              {filteredDeployments.map((deployment) => (
                <DeploymentCard
                  key={deployment.id}
                  deployment={deployment}
                />
              ))}
            </div>
          )}
        </div>

        {/* Timeline Panel */}
        <div className="lg:col-span-1">
          <ActivityFeed deployments={deployments} />
        </div>
      </div>
    </MainLayout>
  );
}
