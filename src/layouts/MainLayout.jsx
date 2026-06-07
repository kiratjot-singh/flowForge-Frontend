import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function MainLayout({
  children
}) {
  return (
    <div className="min-h-screen bg-[#030303] text-[#f4f4f5] flex flex-col font-sans antialiased">
      
      {/* Dynamic Background Mesh & Glows */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-grid-pattern pointer-events-none">
        {/* Top Center Indigo Glow */}
        <div className="
          absolute
          top-[-10%]
          left-1/2
          -translate-x-1/2
          w-[1000px]
          h-[600px]
          bg-gradient-to-b from-indigo-500/10 to-violet-500/5
          blur-[130px]
          rounded-full
          pulse-glow-effect
        " />
        
        {/* Bottom Right Fuchsia Glow */}
        <div className="
          absolute
          bottom-[-10%]
          right-[-10%]
          w-[600px]
          h-[600px]
          bg-fuchsia-500/5
          blur-[150px]
          rounded-full
        " />
      </div>

      <Navbar />

      <div className="flex flex-1 max-w-[1600px] w-full mx-auto relative">
        <Sidebar />
        
        <main className="flex-1 p-6 md:p-8 overflow-y-auto min-w-0 transition-all duration-300">
          {children}
        </main>
      </div>

    </div>
  );
}