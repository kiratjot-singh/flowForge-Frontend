import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside
      className="
        w-64
        border-r
        border-zinc-800
        min-h-[calc(100vh-64px)]
        p-4
      "
    >
      <Link
        to="/deploy"
        className="
          block
          p-3
          rounded-xl
          hover:bg-zinc-900
        "
      >
        New Deployment
      </Link>

      <Link
        to="/"
        className="
          block
          p-3
          rounded-xl
          hover:bg-zinc-900
        "
      >
        Deployments
      </Link>
    </aside>
  );
}