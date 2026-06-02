import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function MainLayout({
  children
}) {
  return (
    <div className="min-h-screen bg-[#09090B] text-white">

      {/* Railway Glow */}

      <div className="fixed inset-0 -z-10 overflow-hidden">

        <div className="
          absolute
          top-0
          left-1/2
          -translate-x-1/2
          w-[900px]
          h-[500px]
          bg-blue-500/10
          blur-[180px]
        " />

        <div className="
          absolute
          bottom-0
          right-0
          w-[700px]
          h-[400px]
          bg-purple-500/10
          blur-[180px]
        " />

      </div>

      <Navbar />

      <div className="flex">

        <Sidebar />

        <main className="flex-1 p-8">
          {children}
        </main>

      </div>

    </div>
  );
}