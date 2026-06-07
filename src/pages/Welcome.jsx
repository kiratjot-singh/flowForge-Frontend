import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Cpu, Terminal, Zap, Shield, ArrowRight } from "lucide-react";

export default function Welcome() {
  const { user } = useAuth();

  // Redirect to dashboard if user is already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#030303] text-[#f4f4f5] flex flex-col font-sans antialiased relative overflow-hidden">
      
      {/* Background Mesh and Glows */}
      <div className="absolute inset-0 -z-10 overflow-hidden bg-grid-pattern pointer-events-none">
        {/* Top Center Violet Glow */}
        <div className="
          absolute
          top-[-15%]
          left-1/2
          -translate-x-1/2
          w-[1000px]
          h-[600px]
          bg-gradient-to-b from-indigo-500/10 to-violet-500/5
          blur-[135px]
          rounded-full
          animate-pulse
        " style={{ animationDuration: "8s" }} />

        {/* Bottom Left Fuchsia Glow */}
        <div className="
          absolute
          bottom-[-10%]
          left-[-5%]
          w-[500px]
          h-[500px]
          bg-fuchsia-500/5
          blur-[140px]
          rounded-full
        " />
      </div>

      {/* Navbar */}
      <header className="w-full max-w-[1400px] mx-auto px-6 md:px-8 h-20 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5 group">
          <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 group-hover:border-indigo-500/40 transition duration-300">
            <Cpu className="h-5 w-5 text-indigo-400 group-hover:rotate-12 transition duration-300" />
          </div>
          <h1 className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            FlowForge
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-semibold text-zinc-400 hover:text-white transition duration-200"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="
              px-4
              py-2
              bg-zinc-900/80
              hover:bg-zinc-800
              border
              border-zinc-800
              hover:border-zinc-700
              text-zinc-200
              hover:text-white
              text-xs
              font-bold
              rounded-xl
              transition-all
              duration-200
            "
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center max-w-[1200px] mx-auto px-6 md:px-8 py-16 md:py-24 z-10 w-full">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-xs font-semibold select-none">
            <Zap className="h-3.5 w-3.5" />
            Developer-First CI/CD Platform
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Forge Your Code Into{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Seamless Cloud Flows
            </span>
          </h2>

          <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            The instant-deployment platform for Git repositories. Push code, trigger builds, sandbox run environments, and stream live terminal logs without managing infrastructure.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="
                w-full
                sm:w-auto
                inline-flex
                items-center
                justify-center
                gap-2
                px-7
                py-3.5
                bg-indigo-600
                hover:bg-indigo-500
                active:bg-indigo-700
                text-white
                text-sm
                font-bold
                rounded-xl
                shadow-lg
                shadow-indigo-500/20
                hover:shadow-indigo-500/35
                hover:-translate-y-[1px]
                transition-all
                duration-200
              "
            >
              Get Started for Free
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/login"
              className="
                w-full
                sm:w-auto
                inline-flex
                items-center
                justify-center
                gap-2
                px-7
                py-3.5
                bg-zinc-900/60
                hover:bg-zinc-900/90
                border
                border-zinc-850
                hover:border-zinc-700
                text-zinc-300
                hover:text-white
                text-sm
                font-bold
                rounded-xl
                transition-all
                duration-200
              "
            >
              Sign In to Console
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 md:mt-28">
          
          {/* Card 1 */}
          <div className="glass-panel glass-panel-hover p-6 md:p-8 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 mb-5">
                <Terminal className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Webhook Integration</h3>
              <p className="text-zinc-400 text-sm mt-2.5 leading-relaxed">
                Connect your GitHub repository webhooks and trigger deployments automatically with every git push.
              </p>
            </div>
            <div className="text-xs text-indigo-400 font-semibold mt-6 flex items-center gap-1 select-none">
              Fully Automated
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-panel glass-panel-hover p-6 md:p-8 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center text-violet-400 mb-5">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Live Logs Terminal</h3>
              <p className="text-zinc-400 text-sm mt-2.5 leading-relaxed">
                Watch build commands compile in real-time. Our custom log system reports container runs directly to your browser.
              </p>
            </div>
            <div className="text-xs text-violet-400 font-semibold mt-6 flex items-center gap-1 select-none">
              Streaming Console
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-panel glass-panel-hover p-6 md:p-8 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-xl flex items-center justify-center text-fuchsia-400 mb-5">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Isolated Sandbox</h3>
              <p className="text-zinc-400 text-sm mt-2.5 leading-relaxed">
                Every project is cloned and verified inside an isolated node process. Secure build environments guarantee reliability.
              </p>
            </div>
            <div className="text-xs text-fuchsia-400 font-semibold mt-6 flex items-center gap-1 select-none">
              Dockerized Builds
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="w-full max-w-[1400px] mx-auto px-6 md:px-8 py-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 z-10">
        <div>&copy; {new Date().getFullYear()} FlowForge Cloud Platform. All rights reserved.</div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 font-medium">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          All Systems Operational
        </div>
      </footer>

    </div>
  );
}
