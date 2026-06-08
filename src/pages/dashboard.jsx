import { useEffect, useState } from "react";
import { Search, FolderGit, Plus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

import ActivityFeed from "../components/ActivityFeed";
import MainLayout from "../layouts/MainLayout";
import StatCard from "../components/statCard";
import ProjectCard from "../components/ProjectCard";
import api from "../services/api";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 3000);
    return () => clearInterval(interval);
  }, []);

  async function fetchDashboardData() {
    try {
      const [projectsResponse, deploymentsResponse] = await Promise.all([
        api.get("/projects"),
        api.get("/deployments")
      ]);
      setProjects(projectsResponse.data.projects || []);
      setDeployments(deploymentsResponse.data.deployments || []);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredProjects = projects.filter((project) => {
    const query = search.toLowerCase();
    return (
      project.name?.toLowerCase().includes(query) ||
      project.repo_url?.toLowerCase().includes(query) ||
      project.branch?.toLowerCase().includes(query)
    );
  });

  // Calculate statistics based on project's latest deployment status
  const total = projects.length;
  const success = projects.filter(p => p.latest_deployment_status === "SUCCESS").length;
  const failed = projects.filter(p => p.latest_deployment_status === "FAILED").length;
  const running = projects.filter(p => 
    p.latest_deployment_status === "RUNNING" || p.latest_deployment_status === "PENDING"
  ).length;

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
            Projects
          </h1>
          <p className="text-zinc-400 text-sm mt-1.5 flex items-center gap-1.5">
            <FolderGit className="h-4 w-4 text-zinc-500" />
            Manage and monitor your FlowForge cloud applications
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
            bg-indigo-650
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
          New Project
        </Link>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <StatCard title="Total Projects" value={total} />
        <StatCard title="Healthy" value={success} />
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
          placeholder="Search projects by name, repository, or branch..."
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
        {/* Projects List */}
        <div className="lg:col-span-2">
          {filteredProjects.length === 0 ? (
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
                <FolderGit className="h-5 w-5 text-zinc-500" />
              </div>
              <h3 className="text-lg font-bold text-zinc-200">
                No projects found
              </h3>
              <p className="text-zinc-500 text-sm mt-1.5 max-w-sm mx-auto">
                No active projects match your search filters. Connect a new repository to get started.
              </p>
            </div>
          ) : (
            <div className="grid gap-4.5">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
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
