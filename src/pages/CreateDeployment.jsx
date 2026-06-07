import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GitBranch, GitCommit, ArrowRight, Loader2, GitFork } from "lucide-react";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

export default function CreateDeployment() {
  const [repoUrl, setRepoUrl] = useState("");
  const [branch, setBranch] = useState("main");
  const [commitSha, setCommitSha] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleDeploy(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/webhooks/github", {
        repository: {
          clone_url: repoUrl
        },
        ref: `refs/heads/${branch}`,
        head_commit: {
          id: commitSha || crypto.randomUUID()
        }
      });

      toast.success("Deployment triggered successfully!");
      navigate("/");
      setRepoUrl("");
      setCommitSha("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to start deployment. Check server status.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainLayout>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
          Create New Deployment
        </h1>
        <p className="text-zinc-400 text-sm mt-1.5">
          Deploy any GitHub repository instantly with customizable branches and commit options
        </p>

        <form
          onSubmit={handleDeploy}
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

          {/* Branch and Commit Fields Grid */}
          <div className="grid md:grid-cols-2 gap-6">
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

            {/* Commit SHA Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Commit SHA (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <GitCommit className="h-4.5 w-4.5" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. a7d8e23"
                  value={commitSha}
                  onChange={(e) => setCommitSha(e.target.value)}
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
                disabled:bg-indigo-800/40
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
                  Deploying...
                </>
              ) : (
                <>
                  Deploy Project
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