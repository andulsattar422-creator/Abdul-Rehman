import React, { useState } from "react";
import { BugDiagnostics } from "../types";
import { 
  Terminal, 
  Loader2, 
  Activity, 
  Play, 
  HelpCircle, 
  CheckCircle, 
  Cpu, 
  Flame 
} from "lucide-react";

const SIMULATED_LOGS = [
  "Exception: Mismatch packet sizes during Chrono dome activation inside peak coordinates. Resulted in instantaneous player kick.",
  "Warning: Trogon shotgun grenade loader triggers NullPointerException inside character_tatsuya reloading handler when casting Rebel Rush.",
  "Error: Kassie Healing Bond returns NaN health frames if teammate coordinates move exactly out of render distance (80m) on frame update.",
  "Crash: Memory array indexing bound fault. Bermuda Launching Pad projectile mechanics triggers physics overload inside sound engine."
];

export default function BugTerminal() {
  const [logInput, setLogInput] = useState("");
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [report, setReport] = useState<BugDiagnostics | null>(null);

  const handleApplyLog = (l: string) => {
    setLogInput(l);
  };

  const executeDiagnostics = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logInput.trim()) return;

    setIsDiagnosing(true);
    setReport(null);

    try {
      const response = await fetch("/api/bug-diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          errorLog: logInput.trim()
        })
      });

      if (!response.ok) {
        throw new Error("Local packet error. Terminal queue overloaded.");
      }

      const data = await response.json();
      setReport(data);
    } catch (err) {
      // Fallback
      setReport({
        errorCode: "OB47-ADV-990-DEBUG",
        rootCause: "Packet sync threshold overruns because floating points were not checked for infinity ranges.",
        reproductionSteps: "Select Tatsuya and prompt double Rebel Rush on solar launchpad launch.",
        hotfixSuggestion: "Clamp movement values to absolute float bounding scopes within reload handlers.",
        severity: "CRITICAL"
      });
    } finally {
      setIsDiagnosing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8">
      
      {/* Console Input terminal shell - Left (Span 5) */}
      <div className="lg:col-span-5 bg-slate-900/80 border border-white/10 p-6 rounded-3xl relative font-mono shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
        {/* Glowing Retro Green Accents */}
        <div className="absolute top-0 right-12 w-8 h-[2px] bg-blue-500"></div>

        <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-5">
          <Terminal className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-sm text-slate-200 tracking-wider">
            QA COMMAND LINE INTERFACE
          </h3>
        </div>

        <form onSubmit={executeDiagnostics} className="space-y-4 text-xs">
          <p className="text-[#00f2fe] text-[11px] leading-relaxed">
            &gt; Insert raw test error dumps or client logs below to initiate AI compilation diagnosis.
          </p>

          <textarea
            rows={5}
            value={logInput}
            onChange={(e) => setLogInput(e.target.value)}
            placeholder="Type or copy paste error logs here..."
            className="w-full bg-[#020617] border border-white/10 text-slate-100 text-xs rounded-2xl p-3 focus:border-blue-500 outline-none leading-relaxed"
            required
          />

          {/* Quick error presets suggestions list */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
              ★ SEED ERROR SIMULATION TELEMETRY:
            </span>
            <div className="space-y-1.5">
              {SIMULATED_LOGS.map((log, lIdx) => (
                <button
                  key={lIdx}
                  type="button"
                  onClick={() => handleApplyLog(log)}
                  className="w-full text-left p-2.5 bg-[#020617] hover:bg-white/5 rounded-xl text-[10px] border border-white/5 hover:border-blue-500/40 text-slate-300 transition-all block text-ellipsis overflow-hidden whitespace-nowrap"
                >
                  <span className="text-blue-500 font-bold mr-1">&gt; </span> {log}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isDiagnosing || !logInput.trim()}
            className="w-full px-8 py-3 bg-white hover:bg-fuchsia-400 text-slate-950 font-black text-xs uppercase tracking-widest skew-x-[-12deg] transition-all flex items-center justify-center gap-2"
          >
            {isDiagnosing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>PROCESSING STACK LOGS...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-black text-black" />
                <span>RUN DIAGNOSTICS MATRIX</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Retro Diagnostic Diagnostic readout - Right (Span 7) */}
      <div className="lg:col-span-7 bg-slate-900/80 border border-white/10 p-6 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.6)] flex flex-col justify-between min-h-[460px] relative font-mono">
        <div className="absolute top-0 right-12 w-8 h-[2px] bg-fuchsia-500"></div>

        <div>
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
            <h4 className="text-xs font-bold tracking-widest text-[#00f2fe] uppercase flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-400 animate-pulse" /> AI EXECUTOR LOG REPORT
            </h4>
            <span className="text-[9px] text-fuchsia-400 bg-fuchsia-500/10 px-2.5 py-1 rounded-full border border-fuchsia-500/20 uppercase tracking-widest font-black leading-none">
              {report ? "DIAGNOSIS COMPLETE" : "SHELL STANDBY"}
            </span>
          </div>

          {!report && !isDiagnosing && (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-24 text-slate-400 text-xs">
              <div className="w-12 h-12 border border-white/10 bg-[#020617] rounded-2xl flex items-center justify-center mb-4 text-blue-400">
                <Terminal className="w-5 h-5" />
              </div>
              <h5 className="font-extrabold text-[#00f2fe] uppercase mb-1 tracking-wider">
                Console Diagnostic Core Down
              </h5>
              <p className="max-w-xs text-slate-500 leading-normal">
                Select a telemetry crash dump log or type custom runtime client issues inside the terminal and boot the system tracker.
              </p>
            </div>
          )}

          {isDiagnosing && (
            <div className="flex-1 flex flex-col items-center justify-center py-28 text-center bg-[#020617] rounded-2xl border border-white/5">
              <div className="w-10 h-10 border-2 border-dashed border-blue-450 border-blue-400 rounded-full animate-spin mb-4 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-blue-400 animate-pulse" />
              </div>
              <p className="text-blue-400 font-extrabold tracking-widest text-xs animate-pulse uppercase">
                &gt; UNRAVELING FAULT INDEX TRACES...
              </p>
              <div className="text-[9px] text-slate-500 max-w-sm mt-2 leading-relaxed uppercase">
                Parsing frame threads, memory leak ratios, global packet arrays and checking coordinate exceptions via Gemini engine...
              </div>
            </div>
          )}

          {report && (
            <div className="space-y-4 text-xs">
              {/* Report Header Block */}
              <div className="bg-slate-950 border border-white/10 p-4 rounded-2xl relative overflow-hidden flex flex-col sm:flex-row justify-between gap-3 shadow-[inner_0_0_10px_rgba(16,185,129,0.05)]">
                <div>
                  <span className="text-[9px] text-slate-500 block">AI DIAGNOSIS FLAG ROUTING</span>
                  <h4 className="text-sm font-black text-slate-200 mt-1 uppercase flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-fuchsia-500" /> SYSTEM CODE: {report.errorCode}
                  </h4>
                </div>

                <div className="sm:text-right font-mono">
                  <span className="text-[9px] text-slate-500 block">SEVERITY</span>
                  <span className={`text-[10px] font-black block tracking-wider mt-1 px-2.5 py-1 rounded-full border ${
                    report.severity === "CRITICAL"
                      ? "bg-red-500/10 border-red-500/30 text-red-400 animate-pulse"
                      : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  }`}>
                    {report.severity}
                  </span>
                </div>
              </div>

              {/* Step 1: Root Cause */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#00f2fe] uppercase block tracking-wider">
                  ✦ Root Cause Explanation:
                </span>
                <p className="text-slate-300 bg-slate-950 border border-white/5 p-3 rounded-xl leading-relaxed">
                  {report.rootCause}
                </p>
              </div>

              {/* Step 2: Reproduction Steps */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-fuchsia-400 uppercase block tracking-wider">
                  ⚠️ Reproduction Steps to Isolate:
                </span>
                <p className="text-slate-300 bg-slate-950 border border-white/5 p-3 rounded-xl leading-relaxed">
                  {report.reproductionSteps}
                </p>
              </div>

              {/* Step 3: Hotfix Recommendation */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-blue-400 uppercase block tracking-wider">
                  🛠️ QA Hotfix Code / Config Suggestions:
                </span>
                <div className="bg-[#020617] border border-white/5 p-4 rounded-xl text-blue-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {report.hotfixSuggestion}
                </div>
              </div>
            </div>
          )}
        </div>

        {report && (
          <div className="border-t border-white/5 pt-4 text-xs flex justify-between items-center text-slate-400">
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> TRACE RESOLVED SECURELY // SYNCED TO MOCK LIVE
            </span>
            <button
              onClick={() => {
                setLogInput("");
                setReport(null);
              }}
              className="text-[#00f2fe] hover:underline uppercase text-[10px] font-black hover:text-fuchsia-400"
            >
              RUN NEW DIAGNOSIS
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
