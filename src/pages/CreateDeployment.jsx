import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

export default function CreateDeployment() {

  const [repoUrl, setRepoUrl] =
    useState("");

  const [branch, setBranch] =
    useState("main");

  const [commitSha, setCommitSha] =
    useState("");

  const [loading, setLoading] =
    useState(false);
  const navigate=useNavigate();  

  async function handleDeploy(
    e
  ) {

    e.preventDefault();

    setLoading(true);

    try {

      await fetch(
        "http://localhost:3000/api/v1/webhooks/github",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            repository: {
              clone_url: repoUrl
            },
            ref:
              `refs/heads/${branch}`,
            head_commit: {
              id:
                commitSha ||
                crypto.randomUUID()
            }
          })
        }
      );

      
      navigate("/");

      setRepoUrl("");
      setCommitSha("");

    } catch (error) {

      console.error(error);

      alert(
        "Deployment failed"
      );

    } finally {

      setLoading(false);

    }
  }

  return (
    <MainLayout>

      <h1 className="text-4xl font-bold">
        New Deployment
      </h1>

      <form
        onSubmit={handleDeploy}
        className="
          mt-8
          max-w-2xl
          space-y-4
        "
      >

        <input
          type="text"
          placeholder="Repository URL"
          value={repoUrl}
          onChange={(e) =>
            setRepoUrl(
              e.target.value
            )
          }
          className="
            w-full
            bg-zinc-900
            border
            border-zinc-800
            rounded-xl
            px-4
            py-3
          "
          required
        />

        <input
          type="text"
          placeholder="Branch"
          value={branch}
          onChange={(e) =>
            setBranch(
              e.target.value
            )
          }
          className="
            w-full
            bg-zinc-900
            border
            border-zinc-800
            rounded-xl
            px-4
            py-3
          "
        />

        <input
          type="text"
          placeholder="Commit SHA (optional)"
          value={commitSha}
          onChange={(e) =>
            setCommitSha(
              e.target.value
            )
          }
          className="
            w-full
            bg-zinc-900
            border
            border-zinc-800
            rounded-xl
            px-4
            py-3
          "
        />

        <button
          disabled={loading}
          className="
            px-6
            py-3
            rounded-xl
            bg-white
            text-black
            font-semibold
          "
        >
          {loading
            ? "Deploying..."
            : "Deploy"}
        </button>

      </form>

    </MainLayout>
  );
}