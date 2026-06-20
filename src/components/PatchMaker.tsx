import React, { useState } from "react";
import { PatchNotesResult } from "../types";
import { 
  Sparkles, 
  Loader2, 
  FileText, 
  Calendar, 
  Tag, 
  Flame, 
  Activity, 
  CheckCircle2 
} from "lucide-react";

const SUGGESTED_TOPICS = [
  "OB47 Character & Skill Calibration (Kassie HP, Chrono Dome cooldown, Alok Aura speed)",
  "Heavy Arms balance adjustments: MP40, Shotguns, Explosive launchers radius nerf",
  "Bermuda Solar Array Zone Layout modifications & launching pad metrics testing",
  "Ranked matchmaking optimization & Anti-cheat packet synchronization flags"
];

export default function PatchMaker() {
  const [topic, setTopic] = useState("");
  const [specificRequest, setSpecificRequest] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [patchResult, setPatchResult] = useState<PatchNotesResult | null>(null);

  const handleSuggestionSelect = (top: string) => {
    setTopic(top);
  };

  const handleCompilePatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsCompiling(true);
    setPatchResult(null);

    try {
      const response = await fetch("/api/generate-patch-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patchTopic: topic.trim(),
          patchTarget: specificRequest.trim() || "Standard server balance tests"
        })
      });

      if (!response.ok) {
        throw new Error("Patch Compiler experienced connection buffers.");
      }

      const data = await response.json();
      setPatchResult(data);
    } catch (err) {
      // Local fallback
      setPatchResult({
        version: "OB47.5-ADV-LIVE",
        title: "EXPERIMENTAL BALANCE PATCH OB47v59",
        highlights: [
          "Trogon Shotgun grenade damage scaled downward by 15%",
          "Kassie Healing Bond link link threshold limits adjusted",
          "Bermuda Solar Array Vertical collision volumes corrected"
        ],
        detailedNotes: "• Skill Tuning: Chrono's dome duration tested at 5.5s (up from 5.0s) to assist defensive players during team sweeps.\n• SMG Bullet falloff adjustments slightly padded for close range dominance.\n• Solar launch pad physics stabilized to prevent players clipping through skyboxes.",
        releasingDate: "OB47 Global Scheduled Launch"
      });
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8">
      
      {/* Settings Input - Left (Span 5) */}
      <div className="lg:col-span-5 bg-slate-900/80 border border-white/10 p-6 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] relative">
        <div className="absolute top-0 right-12 w-8 h-[2px] bg-blue-500"></div>

        <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-5">
          <FileText className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-lg text-slate-100 uppercase tracking-tighter italic font-sans flex items-center gap-1.5 font-mono">
            PATCH NOTE <span className="text-blue-400">LAB CORE</span>
          </h3>
        </div>

        <form onSubmit={handleCompilePatch} className="space-y-4 font-mono">
          <div>
            <label className="text-xs font-mono font-extrabold text-[#00f2fe] uppercase tracking-widest block mb-2">
              Select or Type Broad Patch Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="E.g., OB48 Holiday Rebalancing Update"
              className="w-full bg-[#020617] border border-white/10 text-slate-100 text-xs rounded-2xl p-3 focus:border-blue-500 outline-none font-mono"
              required
            />
          </div>

          {/* Quick presets suggestions list */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
              ★ Quick Presets Hot Templates:
            </span>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {SUGGESTED_TOPICS.map((top, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSuggestionSelect(top)}
                  className="w-full text-left p-2.5 bg-[#020617] hover:bg-white/5 rounded-xl text-[11px] border border-white/5 hover:border-[#00f2fe]/55 text-slate-300 transition-all block truncate"
                >
                  {top}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-mono font-extrabold text-[#00f2fe] uppercase tracking-widest block mb-2">
              Specify Parameter / Balance Targets (Optional)
            </label>
            <textarea
              rows={4}
              value={specificRequest}
              onChange={(e) => setSpecificRequest(e.target.value)}
              placeholder="E.g., nerf trogon range, increase Kassie link distance to 15m, increase Kelly dash cooldown, tweak Bermuda solar pads..."
              className="w-full bg-[#020617] border border-white/10 text-slate-100 text-xs rounded-2xl p-3 focus:border-blue-500 outline-none font-mono leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={isCompiling || !topic.trim()}
            className="w-full px-8 py-3 bg-white hover:bg-fuchsia-400 text-slate-950 font-black text-xs uppercase tracking-widest skew-x-[-12deg] transition-all flex items-center justify-center gap-2"
          >
            {isCompiling ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>COMPILING SYSTEMS MATRIX...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-black" />
                <span>GENERATE EXPERIMENTAL PATCH</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Generated Display - Right (Span 7) */}
      <div className="lg:col-span-7 bg-slate-900/80 border border-white/10 p-6 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] flex flex-col justify-between min-h-[460px] relative">
        <div className="absolute top-0 right-12 w-8 h-[2px] bg-fuchsia-500"></div>

        <div>
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
            <h4 className="font-mono text-xs font-extrabold tracking-widest text-slate-300 uppercase flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" /> Official Patch Printout
            </h4>
            <span className="text-[9px] font-mono text-[#00f2fe] bg-[#00f2fe]/10 px-2.5 py-1 rounded-full border border-blue-500/20">
              {patchResult ? "OB STATUS APPROVED" : "STANDBY"}
            </span>
          </div>

          {!patchResult && !isCompiling && (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-24 font-mono">
              <div className="w-14 h-14 border border-white/10 bg-[#020617] rounded-2xl flex items-center justify-center mb-4 rotate-45">
                <FileText className="w-6 h-6 text-slate-400 -rotate-44" />
              </div>
              <h5 className="font-bold text-sm text-slate-300 tracking-wider uppercase mb-1">
                Awaiting Compiler Directives
              </h5>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Choose a quick preset or type broad gameplay targets on the left form and run the compilation matrix.
              </p>
            </div>
          )}

          {isCompiling && (
            <div className="flex-1 flex flex-col items-center justify-center py-28 text-center font-mono">
              <Loader2 className="w-12 h-12 text-blue-400 animate-spin mb-4" />
              <p className="text-blue-400 text-xs font-black tracking-widest uppercase animate-pulse">
                Generating Ob-Patch Documentation...
              </p>
              <span className="text-[10px] text-slate-500 max-w-xs mt-2 leading-normal">
                Structuring bullet coordinates, anti-bullet logic parameters, character speed scales and mapping files inside the server configuration repository...
              </span>
            </div>
          )}

          {patchResult && (
            <div className="space-y-5">
              {/* Document Header Card */}
              <div className="bg-slate-950 border border-white/10 p-4 rounded-2xl relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none"></div>

                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 border-b border-white/5 pb-2 mb-2 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#00f2fe]" />
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest">SERVER REGISTRY INJECTOR</span>
                  </div>
                  <span className="text-fuchsia-400 font-extrabold text-xs tracking-wider">
                    TAG: {patchResult.version}
                  </span>
                </div>

                <h3 className="text-lg font-black text-white tracking-tight uppercase flex items-center gap-1.5 italic font-sans">
                  <Flame className="w-5 h-5 text-[#ff4e19]" /> {patchResult.title}
                </h3>
                
                <p className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 mt-1.5">
                  <Calendar className="w-3.5 h-3.5" /> EST RELEASE: {patchResult.releasingDate}
                </p>
              </div>

              {/* Highlights List Cards */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider font-mono">
                  ★ Server Adjustment Highlights:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs">
                  {patchResult.highlights.map((hlt, idx) => (
                    <div key={idx} className="bg-slate-950 border border-white/5 p-3 rounded-xl text-left relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500/30 rounded-bl"></div>
                      <p className="text-slate-200 text-[10.5px] leading-normal">{hlt}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Notes Field */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider font-mono">
                  🧪 Granular System Balancing Records:
                </span>
                <div className="bg-slate-950 border border-white/5 p-4 rounded-xl text-xs leading-relaxed text-slate-300 font-mono whitespace-pre-wrap h-40 overflow-y-auto scrollbar-thin">
                  {patchResult.detailedNotes}
                </div>
              </div>
            </div>
          )}
        </div>

        {patchResult && (
          <div className="border-t border-white/5 pt-4 font-mono text-xs flex justify-between items-center bg-[#020617]/50 p-3 rounded-2xl mt-4">
            <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> COMPILATION STABLE // DEPLOY READY
            </span>
            <button
              onClick={() => {
                setTopic("");
                setSpecificRequest("");
                setPatchResult(null);
              }}
              className="text-[#00f2fe] hover:underline hover:text-[#ff4e19] font-black transition-all"
            >
              CREATE NEW REVISION
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
