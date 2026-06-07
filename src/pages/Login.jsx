import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Cpu, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      toast.success("Successfully logged in!");
      navigate("/", { replace: true });
    } else {
      toast.error(result.message || "Invalid credentials");
    }
  }

  return (
    <div className="min-h-screen bg-[#030303] text-[#f4f4f5] flex flex-col items-center justify-center font-sans antialiased relative overflow-hidden px-4">
      
      {/* Background Mesh and Glows */}
      <div className="absolute inset-0 -z-10 overflow-hidden bg-grid-pattern pointer-events-none">
        {/* Glowing orb behind the card */}
        <div className="
          absolute
          top-1/2
          left-1/2
          -translate-x-1/2
          -translate-y-1/2
          w-[600px]
          h-[600px]
          bg-indigo-500/5
          blur-[120px]
          rounded-full
          animate-pulse
        " />
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md space-y-8">
        
        {/* Brand Header */}
        <div className="text-center">
          <Link to="/welcome" className="inline-flex items-center gap-2.5 group">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 group-hover:border-indigo-500/40 transition duration-300">
              <Cpu className="h-6 w-6 text-indigo-400 group-hover:rotate-12 transition duration-300" />
            </div>
          </Link>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white">
            Welcome back
          </h2>
          <p className="mt-1.5 text-zinc-400 text-sm">
            Sign in to manage your deployment workflows
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-panel p-8 rounded-2xl shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    placeholder-zinc-600
                    text-sm
                    outline-none
                    transition-all
                    duration-200
                  "
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                    placeholder-zinc-600
                    text-sm
                    outline-none
                    transition-all
                    duration-200
                  "
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                mt-2
                px-5
                py-3
                rounded-xl
                bg-indigo-650
                hover:bg-indigo-500
                active:bg-indigo-700
                disabled:bg-indigo-850/40
                disabled:text-zinc-500
                text-white
                text-sm
                font-semibold
                shadow-lg
                shadow-indigo-500/10
                hover:shadow-indigo-500/20
                flex
                items-center
                justify-center
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
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Links */}
        <div className="text-center text-sm text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-indigo-400 hover:text-indigo-300 transition duration-200"
          >
            Create one for free
          </Link>
        </div>

      </div>

    </div>
  );
}
