import { useState, useRef, useEffect } from "react";
import { Cpu, LogOut, ChevronDown, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/welcome");
  };

  const getInitials = (name) => {
    if (!name) return "US";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header
      className="
        sticky
        top-0
        z-50
        h-16
        border-b
        border-zinc-800/80
        bg-zinc-950/70
        backdrop-blur-md
        flex
        items-center
        justify-between
        px-6
        md:px-8
      "
    >
      <Link to="/" className="flex items-center gap-2.5 group">
        <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 group-hover:border-indigo-500/40 transition duration-300">
          <Cpu className="h-5 w-5 text-indigo-400 group-hover:rotate-12 transition duration-300" />
        </div>
        <h1 className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
          FlowForge
        </h1>
      </Link>

      <div className="flex items-center gap-4">
        {/* Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          All Systems Operational
        </div>

        {/* Dynamic User Profile & Dropdown */}
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 focus:outline-none group cursor-pointer"
            >
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 p-[1.5px] hover:opacity-90 transition duration-200">
                <div className="h-full w-full bg-zinc-900 rounded-full flex items-center justify-center text-xs font-bold text-zinc-200">
                  {getInitials(user.name)}
                </div>
              </div>
              <ChevronDown className={`h-4 w-4 text-zinc-400 group-hover:text-zinc-200 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Panel */}
            {dropdownOpen && (
              <div
                className="
                  absolute
                  right-0
                  mt-2.5
                  w-56
                  origin-top-right
                  bg-zinc-950
                  border
                  border-zinc-800
                  rounded-2xl
                  shadow-xl
                  p-1.5
                  z-50
                  animate-in
                  fade-in
                  slide-in-from-top-2
                  duration-200
                "
              >
                <div className="px-3 py-2 border-b border-zinc-900 mb-1">
                  <p className="text-xs font-bold text-white truncate">{user.name}</p>
                  <p className="text-[11px] text-zinc-500 truncate mt-0.5">{user.email}</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="
                    w-full
                    flex
                    items-center
                    gap-2.5
                    px-3
                    py-2
                    text-zinc-400
                    hover:text-rose-400
                    hover:bg-rose-500/10
                    rounded-xl
                    text-left
                    text-xs
                    font-semibold
                    transition-all
                    cursor-pointer
                  "
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}