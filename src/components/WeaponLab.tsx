import React, { useState } from "react";
import { WeaponAttributes } from "../types";
import { 
  Sparkles, 
  Loader2, 
  ArrowRight, 
  Dices, 
  ShieldAlert, 
  Flame, 
  Compass, 
  Zap, 
  SlidersHorizontal 
} from "lucide-react";

const SYSTEM_IDEAS = [
  "A laser rifle that does extra damage to gloo walls and creates small fire traps upon impact.",
  "An energy crossbow that recovers 15 HP for teammates it passes threw.",
  "A heavy grenade launcher that launches slow-moving plasma bubbles that absorbs bullet damage.",
  "An sub-machine gun with electromagnetic bullets that reduces enemies character reloading speeds."
];

interface WeaponLabProps {
  onDeployToSandbox: (weapon: WeaponAttributes) => void;
}

export default function WeaponLab({ onDeployToSandbox }: WeaponLabProps) {
  const [weaponType, setWeaponType] = useState("Assault Rifle");
  const [concept, setConcept] = useState("");
  const [isForging, setIsForging] = useState(false);
  const [forgedWeapon, setForgedWeapon] = useState<WeaponAttributes | null>(null);
  const [hasDeployed, setHasDeployed] = useState(false);

  const handleRandomize = () => {
    const randomIdea = SYSTEM_IDEAS[Math.floor(Math.random() * SYSTEM_IDEAS.length)];
    setConcept(randomIdea);
  };

  const executeWeaponsForge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept.trim()) return;

    setIsForging(true);
    setForgedWeapon(null);
    setHasDeployed(false);

    try {
      const response = await fetch("/api/generate-weapon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          concept: concept.trim(),
          type: weaponType
        })
      });

      if (!response.ok) {
        throw new Error("Weapon forge system loaded with network buffers.");
      }

      const data = await response.json();
      setForgedWeapon(data);
    } catch (err) {
      // Local Fallback simulation
      setForgedWeapon({
        name: `Cyber Plasma ${weaponType.split(" ")[0]} 9X`,
        damage: 82,
        fireRate: 68,
        range: 60,
        accuracy: 50,
        rarity: "Legendary",
        specialPerk: "Fires plasma shards that deplete shields 25% faster.",
        lore: "Forged inside Lab Horizon during energy rift tests.",
        aiAssessmentRating: "HIGH SKILL COOLDOWN"
      });
    } finally {
      setIsForging(false);
    }
  };

  const handleDeployment = () => {
    if (!forgedWeapon) return;
    onDeployToSandbox(forgedWeapon);
    setHasDeployed(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8">
      
      {/* Blueprint designer input - Left (Span 5) */}
      <div className="lg:col-span-5 bg-slate-900/80 border border-white/10 p-6 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] relative">
        <div className="absolute top-0 right-12 w-8 h-[2px] bg-blue-500"></div>

        <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-5">
          <Zap className="w-5 h-5 text-blue-450 text-blue-400 animate-pulse" />
          <h3 className="font-bold text-lg text-slate-100 uppercase tracking-tighter italic font-sans flex items-center gap-1.5">
            AI WEAPON <span className="text-blue-400">FORGE CORE</span>
          </h3>
        </div>

        <form onSubmit={executeWeaponsForge} className="space-y-5">
          <div>
            <label className="text-xs font-mono font-extrabold text-[#00f2fe] uppercase tracking-widest block mb-2">
              Select Weapon Prototype Category
            </label>
            <select
              value={weaponType}
              onChange={(e) => setWeaponType(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 font-mono text-xs text-slate-200 p-2.5 rounded-xl focus:border-blue-500 outline-none"
            >
              <option value="Assault Rifle">🔫 ASSAULT RIFLE (Mid Range Combat)</option>
              <option value="Shotgun">💥 SHOTGUN (High Impact Damage close-up)</option>
              <option value="Sub-machine Gun (SMG)">⚡ SUB-MACHINE GUN (Fast Fire Speed Spray)</option>
              <option value="Sniper Rifle">🎯 SNIPER RIFLE (High Tier range precision)</option>
              <option value="Launcher/Explosive">🚀 EXPLOSIVE LAUNCHER (AOE damage zone)</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-extrabold text-[#00f2fe] uppercase tracking-widest">
                Weapon Technology Draft / Prompt
              </label>
              <button
                type="button"
                onClick={handleRandomize}
                className="text-[10px] bg-slate-900 border border-white/10 text-slate-300 font-mono px-3 py-1 rounded-xl flex items-center gap-1 hover:text-white hover:border-white/25 transition-all"
              >
                <Dices className="w-3 h-3 text-fuchsia-405 text-fuchsia-400" /> SHUFFLE TECH IDEA
              </button>
            </div>

            <textarea
              rows={5}
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="E.g., An assault rifle that triggers electric shockchains to nearby opponents within 3m when hitting a headshot, with decreased clip capacity..."
              className="w-full bg-[#020617] border border-white/10 text-slate-100 text-xs rounded-2xl p-3 focus:border-blue-500 outline-none font-mono leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={isForging || !concept.trim()}
            className="w-full px-8 py-3 bg-white hover:bg-fuchsia-400 text-slate-950 font-black text-xs uppercase tracking-widest skew-x-[-12deg] transition-all flex items-center justify-center gap-2"
          >
            {isForging ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>FORGING BLUEPRINT VIBRANCY...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-black" />
                <span>FORGE WEAPON PROTOTYPE</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Stats display - Right (Span 7) */}
      <div className="lg:col-span-7 bg-slate-900/80 border border-white/10 p-6 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] flex flex-col justify-between min-h-[450px] relative">
        <div className="absolute top-0 right-12 w-8 h-[2px] bg-fuchsia-500"></div>

        <div>
          <div className="flex items-center gap-2 justify-between border-b border-white/5 pb-3 mb-5">
            <h4 className="font-mono text-xs font-extrabold tracking-widest text-[#00f2fe] uppercase flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-blue-400 animate-pulse" /> Holographic Blueprint Manifest
            </h4>
            <span className="text-[9px] font-mono text-fuchsia-400 bg-fuchsia-500/10 px-2.5 py-1 rounded-full border border-fuchsia-500/20 uppercase tracking-wider">
              {forgedWeapon ? "OB47 COMPILATION MATCHED" : "AWAITING CONFIG"}
            </span>
          </div>

          {!forgedWeapon && !isForging && (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-20 font-mono">
              <div className="w-14 h-14 border border-white/10 bg-[#020617] rounded-2xl flex items-center justify-center mb-4 rotate-45">
                <Compass className="w-6 h-6 text-slate-400 -rotate-44" />
              </div>
              <h5 className="font-bold text-sm text-slate-300 tracking-wider uppercase mb-1">
                Awaiting Energy Blueprint input
              </h5>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Formulate a custom technology idea, describe its damage, elements or restrictions inside the editor and run the forge core.
              </p>
            </div>
          )}

          {isForging && (
            <div className="flex-1 flex flex-col items-center justify-center py-24 text-center font-mono">
              <div className="h-2 w-48 bg-slate-950 rounded-full overflow-hidden relative mb-4 border border-white/5">
                <div className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-blue-500 to-fuchsia-500 w-1/3 animate-[progress_2s_ease-in-out_infinite]"></div>
              </div>
              <p className="text-blue-400 text-xs uppercase font-black tracking-widest animate-pulse">
                Compiling weapon damage tables...
              </p>
              <p className="text-[10px] text-slate-500 mt-2 max-w-xs leading-normal">
                Synthesizing reload speed adjustments, rate of fire parameters, and custom gaming lore blocks inside Free Fire sandbox registry.
              </p>
            </div>
          )}

          {forgedWeapon && (
            <div className="space-y-6">
              {/* Card visual mockup with cyberpunk flames */}
              <div className="bg-slate-950 border border-white/10 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                {/* Rarity and Rating layout */}
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div>
                    <span className="font-mono text-[9px] text-fuchsia-400 bg-fuchsia-500/10 border border-fuchsia-500/20 px-2 py-0.5 rounded-full uppercase font-black">
                      {forgedWeapon.rarity || "Legendary"} PROTOTYPE
                    </span>
                    <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight mt-1.5 flex items-center gap-1.5 italic">
                      <Flame className="w-5 h-5 text-fuchsia-500" /> {forgedWeapon.name}
                    </h3>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-[9px] text-slate-400 block uppercase tracking-wider">AI ASSESSMENT</span>
                    <span className="text-[#00f2fe] font-black font-mono text-xs uppercase block tracking-wider mt-1 bg-[#00f2fe]/10 px-2.5 py-0.5 rounded-full border border-[#00f2fe]/20">
                      {forgedWeapon.aiAssessmentRating || "BALANCED"}
                    </span>
                  </div>
                </div>

                {/* Lore text */}
                <p className="text-xs text-slate-350 font-mono italic bg-white/5 p-3 rounded-xl border border-white/5 leading-relaxed">
                  &ldquo;{forgedWeapon.lore || "Default design template extracted from advance laboratory reserves."}&rdquo;
                </p>

                {/* Grid stats parameters comparison */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 font-mono">
                  {/* DMG */}
                  <div className="bg-[#020617] border border-white/5 p-2.5 rounded-xl text-center">
                    <span className="text-slate-450 text-slate-400 text-[9px] block font-bold uppercase tracking-wider">DAMAGE</span>
                    <span className="text-lg font-black text-blue-400 block mt-0.5">{forgedWeapon.damage}/100</span>
                  </div>
                  {/* ROF */}
                  <div className="bg-[#020617] border border-white/5 p-2.5 rounded-xl text-center">
                    <span className="text-slate-450 text-slate-400 text-[9px] block font-bold uppercase tracking-wider">FIRE RATE</span>
                    <span className="text-lg font-black text-fuchsia-400 block mt-0.5">{forgedWeapon.fireRate}/100</span>
                  </div>
                  {/* RNG */}
                  <div className="bg-[#020617] border border-white/5 p-2.5 rounded-xl text-center">
                    <span className="text-slate-450 text-slate-400 text-[9px] block font-bold uppercase tracking-wider">RANGE</span>
                    <span className="text-lg font-black text-blue-300 block mt-0.5">{forgedWeapon.range}/100</span>
                  </div>
                  {/* ACC */}
                  <div className="bg-[#020617] border border-white/5 p-2.5 rounded-xl text-center">
                    <span className="text-slate-450 text-slate-400 text-[9px] block font-bold uppercase tracking-wider">ACCURACY</span>
                    <span className="text-lg font-black text-emerald-400 block mt-0.5">{forgedWeapon.accuracy}/100</span>
                  </div>
                </div>

                {/* Injected Perk text */}
                <div className="bg-[#020617] border border-white/5 p-3.5 rounded-xl mt-4 font-mono text-xs">
                  <span className="text-blue-400 text-[10px] block font-bold uppercase mb-0.5">Injected Special Passive Attribute:</span>
                  <p className="text-slate-205 text-slate-200">{forgedWeapon.specialPerk}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {forgedWeapon && (
          <div className="border-t border-white/5 pt-4 font-mono text-xs">
            {hasDeployed ? (
              <div className="text-center text-emerald-400 font-extrabold flex items-center justify-center gap-1.5 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                ✓ PROTOTYPE DEPLOYED SECURELY TO BATTLE SANDBOX TAB!
              </div>
            ) : (
              <button
                onClick={handleDeployment}
                className="w-full px-8 py-3 bg-white hover:bg-fuchsia-400 text-slate-950 font-black text-xs uppercase tracking-widest skew-x-[-12deg] transition-all flex items-center justify-center gap-2"
              >
                <span>DEPLOY TO COMBAT SANDBOX FOR ANALYTICAL TESTING</span>
                <ArrowRight className="w-4 h-4 text-black shrink-0 animate-pulse" />
              </button>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
