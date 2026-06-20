import React, { useState, useEffect } from "react";
import AROverlay from "./components/AROverlay";
import Dashboard from "./components/Dashboard";
import Sandbox from "./components/Sandbox";
import WeaponLab from "./components/WeaponLab";
import PatchMaker from "./components/PatchMaker";
import BugTerminal from "./components/BugTerminal";
import { UpcomingFeature, WeaponAttributes } from "./types";
import { 
  Home, 
  Flame, 
  Sliders, 
  FileText, 
  Terminal as TermIcon, 
  Activity, 
  AlertCircle,
  Clock,
  ExternalLink
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "sandbox" | "weapon" | "patch" | "bug">("dashboard");
  const [upcomingFeatures, setUpcomingFeatures] = useState<UpcomingFeature[]>([]);
  const [activePhase, setActivePhase] = useState("Phase 4 - AI Balancing");
  const [activeTesters, setActiveTesters] = useState(4819);
  const [envData, setEnvData] = useState<any>(null);
  const [errorNotice, setErrorNotice] = useState("");
  
  // Interactive sandbox bridge state
  const [sandboxCustomWeapon, setSandboxCustomWeapon] = useState<WeaponAttributes | null>(null);

  // Fetch initial telemetry configs on load
  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const response = await fetch("/api/config");
        if (!response.ok) {
          throw new Error("Could not fetch server diagnostics.");
        }
        const data = await response.json();
        setEnvData(data);
        setUpcomingFeatures(data.upcomingFeatures || []);
        setActivePhase(data.testPhase || "Phase 4 - AI Balancing");
        setActiveTesters(data.systemStats?.activeTesters || 4819);
      } catch (err: any) {
        console.error("Config fetch error: ", err);
        setErrorNotice("Advance QA Engine loaded under local offline fallback parameters.");
        // offline fallbacks
        setUpcomingFeatures([
          {
            id: "feat_01",
            title: "Kassie (Healing Link Linker)",
            category: "Characters",
            status: "Testing Buffs",
            desc: "Neuroscientist capable of linking with teammates to restore EP/HP dynamically.",
            skill: "Healing Bond (Active)",
            balanceScore: 88,
          },
          {
            id: "feat_02",
            title: "Trogon Balance OB47",
            category: "Weapons",
            status: "Nerf Pending",
            desc: "Dominant launcher radius, currently undergoing range contraction tests.",
            skill: "Explosion Radius Decrement",
            balanceScore: 65,
          },
          {
            id: "feat_03",
            title: "Bermuda Solar Array Station",
            category: "Map Zones",
            status: "Stable",
            desc: "High vertically structured zone yielding high tier drops and launching pad covers.",
            skill: "Solar Hologram Pads",
            balanceScore: 92,
          },
          {
            id: "feat_04",
            title: "Chrono Calibration OB47",
            category: "Rebalancing",
            status: "Experimental",
            desc: "Time Turner dome duration increased to 5 seconds, speed buffer reduced.",
            skill: "Time Turner dome re-scale",
            balanceScore: 78,
          }
        ]);
      }
    };
    fetchConfigs();
  }, []);

  // Set randomized testers fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTesters(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Handle deploying created weapon directly over to the Sandbox Tab
  const handleDeployWeaponToSandbox = (weapon: WeaponAttributes) => {
    setSandboxCustomWeapon(weapon);
    setActiveTab("sandbox"); // switch viewport tab immediately
  };

  return (
    <AROverlay activePhase={activePhase} testerCount={activeTesters}>
      
      {/* Offline Alert Bannner */}
      {errorNotice && (
        <div className="bg-amber-400/10 border border-amber-400/20 text-amber-300 px-4 py-2.5 rounded text-xs leading-normal font-mono mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Main Tab Navigator - Holographic AR Immersive style */}
      <div className="relative mb-6 select-none">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono">
          
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`p-4 rounded-xl flex items-center gap-3 cursor-pointer transition-all duration-300 text-xs font-bold uppercase tracking-wider ${
              activeTab === "dashboard"
                ? "bg-blue-600/25 border-2 border-blue-500/40 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                : "bg-slate-900/60 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-900/80"
            }`}
          >
            <div className={`w-1.5 h-6 rounded-full ${activeTab === "dashboard" ? "bg-blue-500 shadow-[0_0_8px_#3b82f6]" : "bg-transparent"}`}></div>
            <Home className="w-4 h-4 shrink-0 text-blue-400" />
            <span>DASHBOARD</span>
          </button>

          <button
            onClick={() => setActiveTab("sandbox")}
            className={`p-4 rounded-xl flex items-center gap-3 cursor-pointer transition-all duration-300 text-xs font-bold uppercase tracking-wider ${
              activeTab === "sandbox"
                ? "bg-fuchsia-600/25 border-2 border-fuchsia-500/40 text-fuchsia-300 shadow-[0_0_20px_rgba(217,70,239,0.3)]"
                : "bg-slate-900/60 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-900/80"
            }`}
          >
            <div className={`w-1.5 h-6 rounded-full ${activeTab === "sandbox" ? "bg-fuchsia-500 shadow-[0_0_8px_#d946ef]" : "bg-transparent"}`}></div>
            <Flame className="w-4 h-4 shrink-0 text-fuchsia-400 animate-pulse" />
            <span>SANDBOX</span>
          </button>

          <button
            onClick={() => setActiveTab("weapon")}
            className={`p-4 rounded-xl flex items-center gap-3 cursor-pointer transition-all duration-300 text-xs font-bold uppercase tracking-wider ${
              activeTab === "weapon"
                ? "bg-blue-600/25 border-2 border-blue-500/40 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                : "bg-slate-900/60 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-900/80"
            }`}
          >
            <div className={`w-1.5 h-6 rounded-full ${activeTab === "weapon" ? "bg-blue-500 shadow-[0_0_8px_#3b82f6]" : "bg-transparent"}`}></div>
            <Sliders className="w-4 h-4 shrink-0 text-blue-400" />
            <span>DESIGNER</span>
          </button>

          <button
            onClick={() => setActiveTab("patch")}
            className={`p-4 rounded-xl flex items-center gap-3 cursor-pointer transition-all duration-300 text-xs font-bold uppercase tracking-wider ${
              activeTab === "patch"
                ? "bg-indigo-600/25 border-2 border-indigo-500/40 text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                : "bg-slate-900/60 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-900/80"
            }`}
          >
            <div className={`w-1.5 h-6 rounded-full ${activeTab === "patch" ? "bg-indigo-500 shadow-[0_0_8px_#6366f1]" : "bg-transparent"}`}></div>
            <FileText className="w-4 h-4 shrink-0 text-indigo-400" />
            <span>PATCH LAB</span>
          </button>

          <button
            onClick={() => setActiveTab("bug")}
            className={`p-4 rounded-xl flex items-center gap-3 cursor-pointer transition-all duration-300 text-xs font-bold uppercase tracking-wider ${
              activeTab === "bug"
                ? "bg-fuchsia-600/25 border-2 border-fuchsia-500/40 text-fuchsia-300 shadow-[0_0_20px_rgba(217,70,239,0.3)]"
                : "bg-slate-900/60 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-900/80"
            }`}
          >
            <div className={`w-1.5 h-6 rounded-full ${activeTab === "bug" ? "bg-fuchsia-500 shadow-[0_0_8px_#d946ef]" : "bg-transparent"}`}></div>
            <TermIcon className="w-4 h-4 shrink-0 text-fuchsia-400" />
            <span>TERMINAL</span>
          </button>

        </div>
      </div>

      {/* Main Tab Area Content Viewport switcher */}
      <div className="mt-6">
        {activeTab === "dashboard" && (
          <Dashboard 
            features={upcomingFeatures} 
            onSelectFeature={(feat) => {
              // Optionally do anything when a feature is loaded from app level
            }}
          />
        )}

        {activeTab === "sandbox" && (
          <Sandbox 
            initialCustomWeapon={sandboxCustomWeapon} 
          />
        )}

        {activeTab === "weapon" && (
          <WeaponLab 
            onDeployToSandbox={handleDeployWeaponToSandbox} 
          />
        )}

        {activeTab === "patch" && (
          <PatchMaker />
        )}

        {activeTab === "bug" && (
          <BugTerminal />
        )}
      </div>

    </AROverlay>
  );
}
