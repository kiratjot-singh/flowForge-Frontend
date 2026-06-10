import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GitBranch, GitFork, ArrowRight, Loader2, Info } from "lucide-react";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

export default function CreateDeployment() {
  const [name, setName] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [branch, setBranch] = useState("main");
  const [envStr, setEnvStr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleCreateProject(e) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Project name is required");
      return;
    }

    setLoading(true);

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

      const response = await api.post("/projects", {
        name,
        repoUrl,
        branch,
        envVariables
      });

      if (response.data?.success) {
        toast.success("Project created and deployment triggered!");
        navigate("/");
      } else {
        toast.error(response.data?.message || "Failed to create project");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create project. Check server status.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainLayout>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
          Create New Project
        </h1>
        <p className="text-zinc-400 text-sm mt-1.5">
          Connect your GitHub repository and branch to FlowForge to configure automated cloud environments
        </p>

        <form
          onSubmit={handleCreateProject}
          className="
            mt-8
            bg-zinc-900/40
            backdrop-blur-sm
            border
            border-zinc-800/80
            rounded-2xl
            p-6
            md:p-8
            space-y-6
            shadow-xl
          "
        >
          {/* Project Name Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Project Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Info className="h-4.5 w-4.5" />
              </div>
              <input
                type="text"
                placeholder="e.g. Netflix Clone"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="
                  w-full
                  bg-zinc-950/60
                  focus:bg-zinc-950
                  border
                  border-zinc-800
                  focus:border-indigo-500/50
                  rounded-xl
                  pl-11
                  pr-4
                  py-3
                  text-zinc-200
                  placeholder-zinc-650
                  text-sm
                  outline-none
                  transition-all
                  duration-200
                "
                required
              />
            </div>
          </div>

          {/* Repository URL Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Repository URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <GitFork className="h-4.5 w-4.5" />
              </div>
              <input
                type="url"
                placeholder="https://github.com/username/repo-name"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="
                  w-full
                  bg-zinc-950/60
                  focus:bg-zinc-950
                  border
                  border-zinc-800
                  focus:border-indigo-500/50
                  rounded-xl
                  pl-11
                  pr-4
                  py-3
                  text-zinc-200
                  placeholder-zinc-650
                  text-sm
                  outline-none
                  transition-all
                  duration-200
                "
                required
              />
            </div>
            <span className="block text-[11px] text-zinc-500">
              Only public repositories or authorized URLs are supported.
            </span>
          </div>

          {/* Branch Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Branch
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <GitBranch className="h-4.5 w-4.5" />
              </div>
              <input
                type="text"
                placeholder="main"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="
                  w-full
                  bg-zinc-950/60
                  focus:bg-zinc-950
                  border
                  border-zinc-800
                  focus:border-indigo-500/50
                  rounded-xl
                  pl-11
                  pr-4
                  py-3
                  text-zinc-200
                  placeholder-zinc-650
                  text-sm
                  outline-none
                  transition-all
                  duration-200
                "
              />
            </div>
          </div>

          {/* Environment Variables Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Environment Variables (.env format)
            </label>
            <textarea
              placeholder="DATABASE_URL=postgresql://user:pass@host:port/db&#10;API_KEY=your_api_key"
              value={envStr}
              onChange={(e) => setEnvStr(e.target.value)}
              rows={5}
              className="
                w-full
                bg-zinc-950/60
                focus:bg-zinc-950
                border
                border-zinc-800
                focus:border-indigo-500/50
                rounded-xl
                px-4
                py-3
                text-zinc-200
                placeholder-zinc-650
                text-sm
                font-mono
                outline-none
                transition-all
                duration-200
              "
            />
            <span className="block text-[11px] text-zinc-500">
              Set environment variables that your server requires at build-time and runtime.
            </span>
          </div>

          {/* Form Actions */}
          <div className="pt-2 border-t border-zinc-850 flex items-center justify-end">
            <button
              type="submit"
              disabled={loading}
              className="
                px-6
                py-3
                rounded-xl
                bg-indigo-650
                hover:bg-indigo-500
                disabled:bg-indigo-880/40
                disabled:text-zinc-500
                text-white
                text-sm
                font-semibold
                shadow-lg
                shadow-indigo-500/10
                hover:shadow-indigo-500/20
                flex
                items-center
                gap-2
                transition-all
                duration-200
                cursor-pointer
                disabled:cursor-not-allowed
              "
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Project...
                </>
              ) : (
                <>
                  Create Project
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}