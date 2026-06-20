import React from "react";
import { Shield, Cpu, Wifi, Activity, Eye, Zap } from "lucide-react";

interface AROverlayProps {
  children: React.ReactNode;
  activePhase: string;
  testerCount: number;
}

export default function AROverlay({ children, activePhase, testerCount }: AROverlayProps) {
  return (
    <div className="relative min-h-screen bg-[#020617] text-white overflow-x-hidden font-sans select-none pb-12">
      {/* Immersive UI Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none z-0">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon points="0,0 100,0 100,100 20,100" fill="#3b82f6" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-blue-900/10 to-transparent pointer-events-none z-0"></div>

      {/* Laser grids and scanning lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5 z-0">
        <div className="absolute w-[200%] h-[200%] -left-1/2 -top-1/2 bg-[linear-gradient(to_right,#3b82f6_1px,transparent_1px),linear-gradient(to_bottom,#3b82f6_1px,transparent_1px)] bg-[size:40px_40px] rotate-3"></div>
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#d946ef] to-transparent animate-[pan_6s_linear_infinite]"></div>
      </div>

      {/* Futuristic Header HUD in AR Style */}
      <header className="relative border-b border-blue-500/30 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 py-4 z-20 shrink-0">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Geometric AR Badge design */}
            <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-400 via-indigo-600 to-fuchsia-600 rounded-lg transform rotate-45 border-2 border-white/20 shadow-[0_0_15px_rgba(37,99,235,0.5)] group hover:rotate-90 transition-transform duration-500">
              <span className="text-xl font-black text-white -rotate-45">AR</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black tracking-tighter italic uppercase">
                  ADVANCE<span className="text-blue-450 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-fuchsia-500">PANEL</span>
                </h1>
                <span className="px-2 py-0.5 text-[9px] font-mono leading-none border border-blue-500/40 text-blue-300 bg-blue-500/10 rounded-md">
                  LIVE
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-blue-300 opacity-70 font-mono">
                DEVELOPER ENVIRONMENT v4.12.0
              </p>
            </div>
          </div>

          {/* HUD Telemetry Stats */}
          <div className="flex items-center flex-wrap gap-4 md:gap-6 font-mono text-xs">
            <div className="bg-slate-900/80 border border-white/5 px-3 py-1.5 rounded-xl flex items-center gap-2">
              <Activity className="w-4 h-4 text-fuchsia-500" />
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">Server Status</span>
                <span className="text-blue-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
                  STABLE / 12ms
                </span>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-white/5 px-3 py-1.5 rounded-xl flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">Balancing Engine</span>
                <span className="text-fuchsia-400 font-bold">GEMINI 3.5</span>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-white/5 px-3 py-1.5 rounded-xl flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-450 text-emerald-450" />
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">Testing Phase</span>
                <span className="text-emerald-400 font-bold">{activePhase}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Wrapper with Futuristic Margins & Corner Accents */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 z-10">
        
        {/* Top Decorative Geometric Anchors */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-blue-500/30 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-fuchsia-500/30 pointer-events-none"></div>
        
        {children}

        {/* Bottom Decorative Geometric Anchors */}
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-fuchsia-500/30 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-blue-500/30 pointer-events-none"></div>
      </main>

      {/* Sticky status bar at the bottom */}
      <footer className="mt-12 border-t border-blue-500/20 bg-[#020617]/90 py-4 font-mono text-xs text-slate-400 text-center relative">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; 2026 FREE FIRE ADVANCE HQ // AUTHORIZED SIMULATION ENGINE</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-blue-400">
              <Wifi className="w-3.5 h-3.5 animate-pulse" /> CLOUD RUN INGRESS : 3000
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300 bg-fuchsia-500/10 px-2 py-0.5 rounded border border-fuchsia-500/20 text-[10px]">
              {testerCount} SIM ACTIVE
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
