import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Globe, RefreshCw, Trash2, GitFork, GitBranch, Terminal } from "lucide-react";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout";
import DeploymentCard from "../components/DeploymentCard";
import api from "../services/api";

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);
  const [isEditingEnv, setIsEditingEnv] = useState(false);
  const [envStr, setEnvStr] = useState("");
  const [savingEnv, setSavingEnv] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjectDetails();
    const interval = setInterval(fetchProjectDetails, 3000);
    return () => clearInterval(interval);
  }, [id]);

  async function fetchProjectDetails() {
    try {
      const response = await api.get(`/projects/${id}`);
      if (response.data?.success) {
        setProject(response.data.project);
        setDeployments(response.data.deployments || []);
      }
    } catch (error) {
      console.error("Failed to load project details:", error);
      toast.error("Error loading project. Returning to dashboard.");
      navigate("/");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (project && !isEditingEnv) {
      const envVars = project.env_variables || {};
      const str = Object.entries(envVars)
        .map(([k, v]) => `${k}=${v}`)
        .join("\n");
      setEnvStr(str);
    }
  }, [project, isEditingEnv]);

  const handleCancelEnvEdit = () => {
    setIsEditingEnv(false);
    if (project) {
      const envVars = project.env_variables || {};
      const str = Object.entries(envVars)
        .map(([k, v]) => `${k}=${v}`)
        .join("\n");
      setEnvStr(str);
    }
  };

  const handleSaveEnv = async () => {
    setSavingEnv(true);
    try {
      const envVariables = {};
      if (envStr.trim()) {
        envStr.split("\n").forEach((line) => {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) return;
          const index = trimmed.indexOf("=");
          if (index !== -1) {
            const k = trimmed.substring(0, index).trim();
            let v = trimmed.substring(index + 1).trim();
            if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
              v = v.substring(1, v.length - 1);
            }
            if (k) envVariables[k] = v;
          }
        });
      }

      const response = await api.put(`/projects/${id}/env`, {
        envVariables
      });

      if (response.data?.success) {
        toast.success("Environment variables saved successfully!");
        setIsEditingEnv(false);
        fetchProjectDetails();
      }
    } catch (error) {
      console.error("Failed to save environment variables:", error);
      toast.error(error.response?.data?.message || "Failed to update environment variables");
    } finally {
      setSavingEnv(false);
    }
  };

  const handleManualDeploy = async () => {
    setDeploying(true);
    try {
      const response = await api.post(`/projects/${id}/deploy`, {
        commitSha: `manual-${Math.random().toString(16).slice(2, 9)}`
      });
      if (response.data?.success) {
        toast.success("Manual deployment triggered!");
        fetchProjectDetails();
      }
    } catch (error) {
      console.error("Manual deployment failed:", error);
      toast.error(error.response?.data?.message || "Failed to trigger deployment");
    } finally {
      setDeploying(false);
    }
  };

  const handleRollback = async (targetDeploymentId) => {
    if (confirm("Are you sure you want to rollback to this deployment version?")) {
      try {
        const response = await api.post(`/projects/${id}/deployments/${targetDeploymentId}/rollback`);
        if (response.data?.success) {
          toast.success("Rollback triggered successfully!");
          fetchProjectDetails();
        }
      } catch (error) {
        console.error("Rollback failed:", error);
        toast.error(error.response?.data?.message || "Failed to trigger rollback");
      }
    }
  };

  const handleDeleteProject = async () => {
    if (confirm(`Are you sure you want to delete project "${project.name}"? This will permanently delete all deployments and logs.`)) {
      try {
        const response = await api.delete(`/projects/${id}`);
        if (response.data?.success) {
          toast.success("Project deleted successfully");
          navigate("/");
        }
      } catch (error) {
        console.error("Failed to delete project:", error);
        toast.error(error.response?.data?.message || "Failed to delete project");
      }
    }
  };

  const getRepoName = (url) => {
    if (!url) return "unknown/repository";
    try {
      const cleaned = url.trim().replace(/\.git$/, "").replace(/\/$/, "");
      const parts = cleaned.split("/");
      return parts.length >= 2 ? `${parts[parts.length - 2]}/${parts[parts.length - 1]}` : url;
    } catch {
      return url;
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
          <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
          <p className="text-zinc-500 text-sm">Retrieving project configuration...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Back button */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-350 transition mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Projects
      </Link>

      {/* Header Panel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-900">
        <div className="space-y-2 min-w-0">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white truncate">
            {project?.name}
          </h1>
          <p className="text-zinc-500 font-mono text-xs truncate">
            Project ID: {project?.id}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={handleDeleteProject}
            className="
              inline-flex
              items-center
              gap-2
              px-4
              py-2.5
              bg-zinc-950/20
              hover:bg-rose-500/10
              border
              border-zinc-850
              hover:border-rose-500/30
              text-zinc-400
              hover:text-rose-450
              text-xs
              font-semibold
              rounded-xl
              transition
              cursor-pointer
            "
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete Project
          </button>

          <button
            onClick={handleManualDeploy}
            disabled={deploying}
            className="
              inline-flex
              items-center
              gap-2
              px-4
              py-2.5
              bg-indigo-650
              hover:bg-indigo-500
              disabled:bg-indigo-880/40
              disabled:text-zinc-500
              text-white
              text-xs
              font-semibold
              rounded-xl
              shadow-lg
              shadow-indigo-500/10
              hover:shadow-indigo-500/20
              transition
              cursor-pointer
              disabled:cursor-not-allowed
            "
          >
            {deploying ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Triggering...
              </>
            ) : (
              <>
                <Globe className="h-3.5 w-3.5" />
                Deploy Now
              </>
            )}
          </button>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid md:grid-cols-2 gap-4 mt-8">
        {/* Repo Card */}
        <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-850 p-5 rounded-2xl flex items-start gap-4">
          <div className="p-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-zinc-400">
            <GitFork className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Connected Repository</p>
            <p className="text-sm font-semibold text-zinc-200 mt-1 truncate" title={project?.repo_url}>
              {getRepoName(project?.repo_url)}
            </p>
            <a 
              href={project?.repo_url} 
              target="_blank" 
              rel="noreferrer" 
              className="text-[11px] text-indigo-400 hover:underline mt-1 inline-block"
            >
              Open in GitHub &rarr;
            </a>
          </div>
        </div>

        {/* Branch Card */}
        <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-850 p-5 rounded-2xl flex items-start gap-4">
          <div className="p-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-zinc-400">
            <GitBranch className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Production Branch</p>
            <p className="text-sm font-semibold text-zinc-200 mt-1 truncate">
              {project?.branch || "main"}
            </p>
            <span className="text-[11px] text-zinc-500 mt-1 inline-block">
              Pushes to this branch trigger builds
            </span>
          </div>
        </div>
      </div>

      {/* Environment Variables Card */}
      <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-850 p-6 rounded-2xl mt-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-850">
          <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">Environment Variables</h3>
          {!isEditingEnv ? (
            <button
              onClick={() => setIsEditingEnv(true)}
              className="px-3 py-1.5 bg-zinc-950 border border-zinc-850 hover:border-zinc-700 text-zinc-350 hover:text-zinc-200 text-xs font-semibold rounded-lg transition cursor-pointer"
            >
              Edit Variables
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancelEnvEdit}
                disabled={savingEnv}
                className="px-3 py-1.5 bg-zinc-950 border border-zinc-850 hover:bg-zinc-900 text-zinc-400 text-xs font-semibold rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEnv}
                disabled={savingEnv}
                className="px-3 py-1.5 bg-indigo-650 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow transition cursor-pointer disabled:bg-indigo-880/40 disabled:text-zinc-500"
              >
                {savingEnv ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        {isEditingEnv ? (
          <textarea
            value={envStr}
            onChange={(e) => setEnvStr(e.target.value)}
            rows={6}
            placeholder="KEY=value"
            className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-indigo-500/50 rounded-xl p-4 text-zinc-200 font-mono text-sm outline-none transition-all duration-200"
          />
        ) : (
          <div>
            {Object.keys(project?.env_variables || {}).length === 0 ? (
              <p className="text-zinc-500 text-xs italic">No environment variables set.</p>
            ) : (
               <div className="grid gap-2 max-h-48 overflow-y-auto pr-2">
                 {Object.entries(project.env_variables).map(([k, v]) => (
                   <div key={k} className="flex items-center gap-2 py-1.5 px-3 bg-zinc-950/60 border border-zinc-900/60 rounded-lg text-xs font-mono">
                     <span className="text-indigo-400 font-semibold">{k}</span>
                     <span className="text-zinc-500">=</span>
                     <span className="text-zinc-300 truncate" title={v}>{v}</span>
                   </div>
                 ))}
               </div>
            )}
          </div>
        )}
      </div>

      {/* Deployments List */}
      <div className="mt-10">
        <h2 className="text-xl font-extrabold tracking-tight text-white mb-6 flex items-center gap-2">
          <Terminal className="h-5 w-5 text-indigo-450" />
          Deployment History
        </h2>

        {deployments.length === 0 ? (
          <div className="bg-zinc-900/10 border border-zinc-850/60 rounded-2xl p-12 text-center backdrop-blur-sm">
            <Terminal className="h-6 w-6 text-zinc-500 mx-auto mb-3 opacity-30" />
            <h3 className="text-sm font-bold text-zinc-300">No deployments run</h3>
            <p className="text-zinc-500 text-xs mt-1">
              Trigger a build manually or push to your repository to start deploying.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {(() => {
              const latestSuccessDep = deployments.find((d) => d.status === "SUCCESS");
              return deployments.map((dep) => (
                <DeploymentCard
                  key={dep.id}
                  deployment={{
                    ...dep,
                    repo_url: project.repo_url,
                    branch: project.branch
                  }}
                  onRollback={
                    latestSuccessDep && dep.id !== latestSuccessDep.id
                      ? (e, targetDep) => handleRollback(targetDep.id)
                      : null
                  }
                />
              ));
            })()}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
