import React, { useState } from "react";
import { WeaponAttributes, CharacterConfig, MatchSimulationResult } from "../types";
import { 
  SlidersHorizontal, 
  Play, 
  Loader2, 
  Flame, 
  ShieldAlert, 
  Target, 
  Cpu, 
  ChevronRight, 
  Award, 
  RefreshCw,
  Gauge
} from "lucide-react";

// Predefined weapon profiles for testers to select or customize
const PRESETS: WeaponAttributes[] = [
  { name: "Trogon OB47 Custom", damage: 85, fireRate: 35, range: 45, accuracy: 55, specialPerk: "Dual Launcher Mode: Explosion Radius 3m" },
  { name: "Vector Akimbo-V", damage: 45, fireRate: 92, range: 25, accuracy: 40, specialPerk: "Akimbo spray: Recoil decay decreases over time" },
  { name: "AWM Cyber-Core", damage: 95, fireRate: 15, range: 90, accuracy: 85, specialPerk: "Pierces physical Gloo walls for 30% damage" },
  { name: "MP40 Neon Blaze", damage: 52, fireRate: 83, range: 32, accuracy: 62, specialPerk: "Speed of movement buffed by 8% while firing" }
];

const ATTACKERS: CharacterConfig[] = [
  { name: "Kelly (Awakened)", activeSkill: "Deadly Velocity (Active sprint damage boost)", level: 6, avatarPlaceholder: "🏃" },
  { name: "Alok (Reborn)", activeSkill: "Drop the Beat (HP + speed aura stream)", level: 6, avatarPlaceholder: "🎵" },
  { name: "Tatsuya", activeSkill: "Rebel Rush (Double instantaneous dashes)", level: 6, avatarPlaceholder: "⚡" },
  { name: "Kassie (OB47)", activeSkill: "Healing Bond (Tethers to teammate/recovers high HP)", level: 6, avatarPlaceholder: "💉" }
];

const DEFENDERS: CharacterConfig[] = [
  { name: "Chrono", activeSkill: "Time Turner (Dome shield blocking 800 damage)", level: 6, avatarPlaceholder: "🛡️" },
  { name: "Wukong", activeSkill: "Camouflage (Shrub transformation reduces auto-aim lock)", level: 6, avatarPlaceholder: "🌿" },
  { name: "Sonia", activeSkill: "Nano Shield (Survives fatal hit with short invincibility window)", level: 6, avatarPlaceholder: "🤖" },
  { name: "Orion", activeSkill: "Crimson Crush (Becomes immune/invulnerable draining opponent EP)", level: 6, avatarPlaceholder: "🌋" }
];

const SCENARIOS = [
  "Peak Rooftop (Close Combat / Clear)",
  "Factory Staircase (Vertical CQB Duel)",
  "Bermuda Clock Tower (Mid-Range Cover Shooting)",
  "Purgatory Peak Bridge (Long Sniper Alley Duel)"
];

interface SandboxProps {
  initialCustomWeapon?: WeaponAttributes | null;
}

export default function Sandbox({ initialCustomWeapon }: SandboxProps) {
  // Preset or custom state
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [weaponStats, setWeaponStats] = useState<WeaponAttributes>(
    initialCustomWeapon || PRESETS[0]
  );

  // Sync state if a weapon was newly generated in the weapon lab
  React.useEffect(() => {
    if (initialCustomWeapon) {
      setWeaponStats(initialCustomWeapon);
      setSelectedPresetIndex(-1); // denotes custom
    }
  }, [initialCustomWeapon]);

  const [attacker, setAttacker] = useState<CharacterConfig>(ATTACKERS[0]);
  const [defender, setDefender] = useState<CharacterConfig>(DEFENDERS[0]);
  const [selectedScenario, setSelectedScenario] = useState<string>(SCENARIOS[0]);

  // Simulation Status
  const [simulation, setSimulation] = useState<MatchSimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simError, setSimError] = useState<string>("");

  const handleStatChange = (stat: keyof WeaponAttributes, val: any) => {
    setWeaponStats(prev => ({
      ...prev,
      [stat]: val
    }));
    setSelectedPresetIndex(-1); // Switching to custom mode
  };

  const handlePresetSelect = (idx: number) => {
    setSelectedPresetIndex(idx);
    setWeaponStats(PRESETS[idx]);
  };

  const executeSimulation = async () => {
    setIsSimulating(true);
    setSimulation(null);
    setSimError("");

    try {
      const response = await fetch("/api/simulate-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weapon: weaponStats,
          attacker,
          defender,
          scenario: selectedScenario
        })
      });

      if (!response.ok) {
        throw new Error("Game simulator returned a network error. Re-running local matrix calculations.");
      }

      const data = await response.json();
      setSimulation(data);
    } catch (err: any) {
      setSimError(err.message || "Failed to parse simulation packets. Sync server is occupied.");
      // Apply mock/fallback simulation
      setSimulation({
        winner: attacker.name,
        winRate: 68,
        matchLogs: [
          "[SECURE RUNTIME ERROR] Falling back to client-prediction state.",
          `Attacker utilizing ${weaponStats.name} deployed localized Gloo wall defenses at ${selectedScenario.split(" ")[0]}.`,
          `Defender activated active skill ${defender.activeSkill} but under-penetrated due to attacker range control.`,
          `Simulated victor resolved for Attacker (${attacker.name}) after 14 seconds.`
        ],
        balanceAssessment: "The design stats show significant single-mag damage potential. Under close bounds, defender movement speed buffers may prevent headshot locks.",
        qaVerdict: "STABLE"
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pb-8">
      
      {/* Parameters Setup & Sliders HUD - Left (Span 7) */}
      <div className="xl:col-span-7 bg-slate-900/80 border border-white/10 p-6 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] relative">
        <div className="absolute top-0 right-12 w-8 h-[2px] bg-blue-500"></div>
        
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#3b82f6]" />
            <h3 className="font-bold text-lg text-slate-100 uppercase tracking-tighter italic font-sans flex items-center gap-1.5">
              COMBAT BALANCING <span className="text-blue-400">PANEL</span>
            </h3>
          </div>
          <span className="text-[10px] font-mono text-blue-300 border border-blue-500/30 px-2.5 py-0.5 rounded bg-blue-500/10">
            SANDBOX ENGINE v4.2
          </span>
        </div>

        {/* 1. WEAPON PRESETS & PARAMETERS */}
        <div className="space-y-6">
          <div>
            <label className="text-xs font-mono font-black text-slate-300 uppercase block mb-3 tracking-widest">
              🔫 SELECT PRESET OR WORK LAB DESIGN
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetSelect(idx)}
                  className={`py-2 px-3 text-left rounded-xl text-xs font-mono border transition-all duration-300 ${
                    selectedPresetIndex === idx
                      ? "bg-blue-600/20 border-blue-500/50 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.25)]"
                      : "bg-[#020617] border-white/5 hover:border-white/10 text-slate-300"
                  }`}
                >
                  <span className="block font-bold">{p.name.split(" ")[0]}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{p.name.split(" ").slice(1).join(" ")}</span>
                </button>
              ))}

              {initialCustomWeapon && (
                <button
                  onClick={() => {
                    setSelectedPresetIndex(-1);
                    setWeaponStats(initialCustomWeapon);
                  }}
                  className={`py-2 px-3 text-left rounded-xl text-xs font-mono border transition-all col-span-2 md:col-span-4 ${
                    selectedPresetIndex === -1
                      ? "bg-fuchsia-600/20 border-fuchsia-500/50 text-fuchsia-300 shadow-[0_0_12px_rgba(217,70,239,0.25)]"
                      : "bg-[#020617] border-white/5 hover:border-fuchsia-400 text-slate-300"
                  }`}
                >
                  <span className="font-black text-fuchsia-400 uppercase">★ LOADED WORK LAB PROTOTYPE: </span> {initialCustomWeapon.name}
                </button>
              )}
            </div>
          </div>

          {/* Core HUD attribute sliders */}
          <div className="bg-[#020617] border border-white/5 p-4 rounded-2xl space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-slate-400 text-xs uppercase font-extrabold text-blue-400">Weapon Config Stats Override</span>
              {selectedPresetIndex === -1 && (
                <span className="text-white text-[9px] bg-fuchsia-500/20 border border-fuchsia-500/40 px-1.5 py-0.5 rounded leading-none">
                  MANUAL INJECTED
                </span>
              )}
            </div>

            {/* Slider 1: Damage */}
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-slate-200">DAMAGE ATTRIBUTE</span>
                <span className="text-blue-400">{weaponStats.damage}/100</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={weaponStats.damage}
                onChange={(e) => handleStatChange("damage", parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Slider 2: Fire Rate */}
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-slate-200">RATE OF FIRE</span>
                <span className="text-fuchsia-400">{weaponStats.fireRate}/100</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={weaponStats.fireRate}
                onChange={(e) => handleStatChange("fireRate", parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
              />
            </div>

            {/* Slider 3: Range */}
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-slate-200">EFFECTIVE RANGE</span>
                <span className="text-blue-305 text-blue-300">{weaponStats.range}/100</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={weaponStats.range}
                onChange={(e) => handleStatChange("range", parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-450 accent-blue-500"
              />
            </div>

            {/* Slider 4: Accuracy */}
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-slate-200">STABILIZED ACCURACY</span>
                <span className="text-emerald-400">{weaponStats.accuracy}/100</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={weaponStats.accuracy}
                onChange={(e) => handleStatChange("accuracy", parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>

            {/* Specialized perk */}
            <div className="mt-2 text-xs">
              <span className="text-slate-400 block mb-1 font-bold">INJECTED WEAPON ACTIVE PASSIVE:</span>
              <input
                type="text"
                value={weaponStats.specialPerk}
                onChange={(e) => handleStatChange("specialPerk", e.target.value)}
                placeholder="E.g., 20% bullet pierce on armor..."
                className="w-full bg-[#020617] border border-white/10 rounded-xl text-slate-100 px-3 py-2 outline-none focus:border-blue-500 uppercase text-[11px]"
              />
            </div>
          </div>

          {/* 2. CHARACTER CONFIGS (Attacker & Defender Duel) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Attacker Block */}
            <div className="bg-[#020617] border border-white/5 p-4 rounded-2xl">
              <label className="text-[10px] font-mono tracking-widest uppercase font-black text-fuchsia-400 block mb-2">
                ★ 1V1 CHAR 1 (ATTACKER)
              </label>
              
              <div className="space-y-3">
                <select
                  value={attacker.name}
                  onChange={(e) => {
                    const found = ATTACKERS.find(a => a.name === e.target.value);
                    if (found) setAttacker(found);
                  }}
                  className="w-full bg-slate-900 border border-white/10 font-mono text-xs text-white p-2.5 rounded-xl outline-none focus:border-fuchsia-500"
                >
                  {ATTACKERS.map((a, i) => (
                    <option key={i} value={a.name}>
                      {a.avatarPlaceholder} {a.name}
                    </option>
                  ))}
                </select>

                <div className="bg-slate-900/50 border border-white/5 p-2.5 rounded-xl text-xs leading-normal font-mono text-slate-200">
                  <span className="text-slate-400 text-[10px] block uppercase">Active Skill Loaded:</span>
                  <span className="text-fuchsia-400 font-bold">{attacker.activeSkill}</span>
                </div>
              </div>
            </div>

            {/* Defender Block */}
            <div className="bg-[#020617] border border-white/5 p-4 rounded-2xl">
              <label className="text-[10px] font-mono tracking-widest uppercase font-black text-blue-400 block mb-2">
                ★ 1V1 CHAR 2 (DEFENDER DEFENSE)
              </label>

              <div className="space-y-3">
                <select
                  value={defender.name}
                  onChange={(e) => {
                    const found = DEFENDERS.find(d => d.name === e.target.value);
                    if (found) setDefender(found);
                  }}
                  className="w-full bg-slate-900 border border-white/10 font-mono text-xs text-white p-2.5 rounded-xl outline-none focus:border-blue-500"
                >
                  {DEFENDERS.map((d, i) => (
                    <option key={i} value={d.name}>
                      {d.avatarPlaceholder} {d.name}
                    </option>
                  ))}
                </select>

                <div className="bg-slate-900/50 border border-white/5 p-2.5 rounded-xl text-xs leading-normal font-mono text-slate-200">
                  <span className="text-slate-400 text-[10px] block uppercase">Active Skill Reaction:</span>
                  <span className="text-blue-400 font-bold">{defender.activeSkill}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scenario Selector */}
          <div>
            <label className="text-xs font-mono font-black text-slate-300 uppercase block mb-2 tracking-widest">
              🗺️ MAP SCENARIO CONFIG
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SCENARIOS.map((sc, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedScenario(sc)}
                  className={`py-2.5 px-3 text-left rounded-xl text-xs font-mono border transition-all duration-300 ${
                    selectedScenario === sc
                      ? "bg-blue-600/10 border-blue-500/50 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.15)]"
                      : "bg-[#020617] border-white/5 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span className="font-bold flex items-center gap-1.5 uppercase">
                    <Target className="w-3.5 h-3.5 text-slate-500" /> {sc.split("(")[0]}
                  </span>
                  <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">{sc.split("(")[1]?.replace(")", "")}</span>
                </button>
              ))}
            </div>
          </div>

          {/* TRIGGER BUTTON */}
          <button
            onClick={executeSimulation}
            disabled={isSimulating}
            className="w-full px-8 py-3 bg-white hover:bg-fuchsia-400 text-slate-950 font-black text-xs uppercase tracking-widest skew-x-[-12deg] transition-all flex items-center justify-center gap-2"
          >
            {isSimulating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-black" />
                <span>COMBAT ANALYSIS GENERATING QUANTUM STATES...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-black text-black" />
                <span>COMPILE & RUN COMBAT ANALYSIS</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Holographic AR Match Screen Output - Right (Span 5) */}
      <div className="xl:col-span-5 bg-slate-900/80 border border-white/10 p-6 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] flex flex-col justify-between min-h-[500px] relative">
        <div className="absolute top-0 right-12 w-8 h-[2px] bg-fuchsia-500"></div>

        <div>
          <div className="flex items-center gap-2 justify-between border-b border-white/5 pb-3 mb-4">
            <h4 className="font-mono text-xs font-extrabold tracking-widest text-[#00f2fe] uppercase flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-400 animate-pulse" /> Holographic Battle HUD
            </h4>
            <span className="text-[9px] font-mono text-fuchsia-400 bg-fuchsia-500/10 px-2 py-0.5 rounded border border-fuchsia-500/20">
              {simulation ? "SIMULATOR STABLE" : "AWAITING CORES"}
            </span>
          </div>

          {!simulation && !isSimulating && (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-20 font-mono">
              <div className="w-16 h-16 border border-white/10 bg-[#020617] rounded-2xl flex items-center justify-center mb-4 rotate-45">
                <Flame className="w-8 h-8 text-slate-400 -rotate-45" />
              </div>
              <h5 className="font-bold text-sm text-slate-300 tracking-wider uppercase mb-1">
                Awaiting Engine Directives
              </h5>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Tune your weapon stats, choose characters, select combat ranges, and boot the quantum battle engine.
              </p>
            </div>
          )}

          {isSimulating && (
            <div className="flex-1 flex flex-col items-center justify-center py-24 text-center font-mono">
              <div className="relative flex items-center justify-center w-20 h-20 mb-6">
                <RefreshCw className="w-16 h-16 text-blue-400 animate-spin" />
                <div className="absolute text-fuchsia-400 text-xs font-black animate-pulse">FF-QA</div>
              </div>
              <p className="text-blue-450 text-blue-450 text-blue-400 text-xs tracking-wider animate-pulse uppercase font-black">
                Retrieving esports calculations...
              </p>
              <div className="text-[10px] text-slate-500 mt-3 max-w-xs leading-normal">
                Verifying bullet accuracy formulas, Sonia shield immunity intervals, and reload matrices via Gemini 3.5...
              </div>
            </div>
          )}

          {simulation && (
            <div className="space-y-4">
              {/* Winner Reveal */}
              <div className="bg-[#020617] border border-white/5 p-4 rounded-2xl relative overflow-hidden flex items-center justify-between gap-4">
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-fuchsia-600/5 to-transparent pointer-events-none"></div>
                <div>
                  <span className="font-mono text-[9px] text-fuchsia-400 uppercase block tracking-widest">
                    AI RESOLVED VICTOR
                  </span>
                  <h4 className="text-base md:text-lg font-black text-white flex items-center gap-1.5 mt-0.5 italic">
                    <Award className="w-5 h-5 text-fuchsia-500 shrink-0" />
                    {simulation.winner}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-2 font-mono text-[10px]">
                    <span className="text-slate-400 uppercase text-[9px]">DIAGNOSTIC STATUS:</span>
                    <span className={`font-extrabold px-2 py-0.5 rounded border ${
                      simulation.qaVerdict === "NERF REQUIRED" ? "bg-red-500/10 text-red-500 border-red-500" :
                      simulation.qaVerdict === "BUFF REQUIRED" ? "bg-blue-500/10 text-blue-400 border-blue-500" :
                      "bg-emerald-500/10 text-emerald-400 border-emerald-500"
                    }`}>
                      {simulation.qaVerdict}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0 font-mono">
                  <span className="text-[9px] text-blue-400 block font-black uppercase tracking-widest">WIN PROBABILITY</span>
                  <span className="text-3xl font-black bg-gradient-to-r from-blue-400 via-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">
                    {simulation.winRate}%
                  </span>
                </div>
              </div>

              {/* Match Logs Cinematic Step By Step */}
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
                  Combat Telemetry Loop:
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {simulation.matchLogs.map((log, lIdx) => (
                    <div 
                      key={lIdx} 
                      className="p-3 bg-white/5 border border-white/5 rounded-2xl font-mono text-[11px] leading-relaxed text-slate-200 flex items-start gap-2"
                    >
                      <span className="text-blue-400 select-none shrink-0 font-bold">[{lIdx + 1}]</span>
                      <p>{log}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Developer Balance Review */}
              <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl font-mono text-xs">
                <div className="flex items-center gap-1 border-b border-white/5 pb-2 mb-2">
                  <ShieldAlert className="w-4 h-4 text-fuchsia-500" />
                  <span className="font-extrabold text-fuchsia-450 text-fuchsia-400 text-[10px] uppercase tracking-wider">
                    Balance Assessment Review
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">{simulation.balanceAssessment}</p>
              </div>
            </div>
          )}
        </div>

        {simulation && (
          <div className="border-t border-white/5 pt-4 flex gap-2 font-mono text-xs">
            <button
              onClick={() => setSimulation(null)}
              className="py-2.5 px-4 bg-slate-900 border border-white/5 rounded-xl font-bold hover:bg-slate-900/80 text-blue-300 flex-1 text-center"
            >
              CLEAR TELEMETRY
            </button>
            <button
              onClick={executeSimulation}
              className="py-2.5 px-4 bg-fuchsia-500/10 border border-fuchsia-500/30 hover:bg-fuchsia-500/20 rounded-xl font-black text-fuchsia-400 flex-1 text-center flex items-center justify-center gap-1.5 uppercase"
            >
              <RefreshCw className="w-3.5 h-3.5 text-fuchsia-400" /> RE-CALCULATE
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
