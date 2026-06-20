import React, { useState } from "react";
import { UpcomingFeature } from "../types";
import { 
  Vote, 
  MessageSquareCode, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Loader2,
  Bookmark
} from "lucide-react";
import LogoImage from "../assets/images/free_fire_ar_logo_1781916603888.jpg";

interface DashboardProps {
  features: UpcomingFeature[];
  onSelectFeature: (feat: UpcomingFeature) => void;
}

export default function Dashboard({ features, onSelectFeature }: DashboardProps) {
  // Local state for interactive features
  const [selectedFeat, setSelectedFeat] = useState<UpcomingFeature | null>(features[0] || null);
  const [voteStats, setVoteStats] = useState<Record<string, { buff: number; nerf: number; stable: number }>>({
    feat_01: { buff: 421, nerf: 104, stable: 228 },
    feat_02: { buff: 48, nerf: 681, stable: 92 },
    feat_03: { buff: 310, nerf: 55, stable: 450 },
    feat_04: { buff: 521, nerf: 140, stable: 112 },
  });
  
  const [voted, setVoted] = useState<Record<string, string>>({});
  const [userComment, setUserComment] = useState("");
  const [commentsList, setCommentsList] = useState<Record<string, string[]>>({
    feat_01: [
      "Kassie linked connection restores HP way too fast during clash squad.",
      "Balanced if the teammates move out of range."
    ],
    feat_02: [
      "The grenade damage is game-breaking on Bermuda Peak.",
      "Needs a serious shell range nerf immediately!"
    ]
  });

  const [sentimentResult, setSentimentResult] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleVote = (featId: string, type: "buff" | "nerf" | "stable") => {
    if (voted[featId]) return; // already voted
    setVoteStats(prev => ({
      ...prev,
      [featId]: {
        ...prev[featId],
        [type]: prev[featId][type] + 1
      }
    }));
    setVoted(prev => ({ ...prev, [featId]: type }));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeat || !userComment.trim()) return;
    
    const featId = selectedFeat.id;
    setCommentsList(prev => ({
      ...prev,
      [featId]: [...(prev[featId] || []), userComment.trim()]
    }));
    setUserComment("");
  };

  const runAiSentimentSummary = async () => {
    if (!selectedFeat) return;
    setIsAnalyzing(true);
    setSentimentResult("");
    
    const relevantComments = commentsList[selectedFeat.id] || [];
    if (relevantComments.length === 0) {
      setSentimentResult("No user logs submitted for this update yet. Submit a comment above first!");
      setIsAnalyzing(false);
      return;
    }

    try {
      const response = await fetch("/api/generate-patch-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patchTopic: `Community Balance Report for: ${selectedFeat.title}`,
          patchTarget: `Analyze these player feedback comments: "${relevantComments.join(" | ")}". State: 1. Main balance complaint. 2. Sentiment Verdict (BUFF/NERF/STABLE). 3. Proposed tweak.`
        })
      });

      const data = await response.json();
      setSentimentResult(data.detailedNotes || "No assessment generated.");
    } catch (err) {
      setSentimentResult("Fallback Auto-QA: This update has moderate feedback. Recommended: Tweak cooldown by 5% and observe crash dumps.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8">
      
      {/* Dynamic AR Gaming Logo Banner - Left Top (Span 8) */}
      <div className="lg:col-span-8 bg-slate-900/80 border border-white/10 rounded-3xl overflow-hidden flex flex-col relative shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        <div className="absolute top-4 right-4 z-10 bg-fuchsia-600 text-[10px] px-2.5 py-1 rounded font-bold uppercase tracking-widest">
          PROTOTYPE HUD ACTIVE
        </div>
        
        {/* Banner with Generated Image */}
        <div className="relative h-60 md:h-72 overflow-hidden bg-slate-950 group">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />
          <div className="absolute inset-0 bg-blue-500/10 mix-blend-color-dodge pointer-events-none z-10" />
          <img
            src={LogoImage}
            alt="Free Fire AI AR Showcase Logo"
            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
            referrerPolicy="no-referrer"
          />
          {/* Neon Target Grid Design over Image */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#020617_90%)] z-10" />
          <div className="absolute bottom-6 left-6 z-20 max-w-lg">
            <span className="text-[10px] font-mono text-blue-300 bg-blue-600/20 px-2.5 py-1 rounded-md border border-blue-500/30 tracking-widest uppercase">
              Free Fire Advance AI Platform
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-white tracking-tighter italic uppercase mt-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              TESTING & BALANCING <span className="text-blue-400">CORE</span>
            </h2>
            <p className="text-xs text-slate-300 font-medium leading-relaxed mt-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-mono uppercase tracking-wide">
              Configure parameters, run battle sandboxes with Gemini engine, and isolate overperforming character builds.
            </p>
          </div>
        </div>

        {/* Phase Timeline Tracker */}
        <div className="border-t border-white/5 px-6 py-4 bg-slate-900/50 grid grid-cols-3 gap-2 text-center text-xs font-mono">
          <div className="border-r border-white/10 pr-2">
            <span className="text-slate-400 block text-[9px] uppercase tracking-wider">PHASE ENDS</span>
            <span className="text-blue-450 text-blue-400 font-black">JULY 15, 2026</span>
          </div>
          <div className="border-r border-white/10 px-2">
            <span className="text-slate-400 block text-[9px] uppercase tracking-wider">DIAGNOSTICS RATE</span>
            <span className="text-fuchsia-400 font-black">120 Hz DUPLEX</span>
          </div>
          <div className="pl-2">
            <span className="text-slate-400 block text-[9px] uppercase tracking-wider">ESPORTS INTEGRITY</span>
            <span className="text-emerald-400 font-black">SECURE (99.8%)</span>
          </div>
        </div>
      </div>

      {/* Server Controls HUD - Right Top (Span 4) */}
      <div className="lg:col-span-4 bg-slate-900/80 border border-white/10 p-6 rounded-3xl flex flex-col justify-between shadow-[0_4px_30px_rgba(0,0,0,0.4)] relative">
        <div className="absolute top-0 right-12 w-8 h-[2px] bg-fuchsia-500"></div>
        <div>
          <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
            <h3 className="font-mono text-xs font-bold tracking-widest uppercase text-slate-300">
              Live Advanced Telemetry
            </h3>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-xl border border-white/5">
              <span className="text-slate-400 uppercase text-[10px]">Environment Host</span>
              <span className="text-slate-200">Cloud Containers</span>
            </div>
            <div className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-xl border border-white/5">
              <span className="text-slate-400 uppercase text-[10px]">Matchmaking Sync</span>
              <span className="text-slate-200">Enabled</span>
            </div>
            <div className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-xl border border-white/5">
              <span className="text-slate-400 uppercase text-[10px]">Region Registry</span>
              <span className="text-blue-450 text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 text-[10px]">OB47 Global</span>
            </div>
            <div className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-xl border border-white/5">
              <span className="text-slate-400 uppercase text-[10px]">AI Load Limit</span>
              <span className="text-fuchsia-400 font-bold">80 tps</span>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-white/5 pt-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30">
            <h4 className="text-[11px] font-black text-indigo-300 flex items-center gap-1 mb-1 font-mono uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" /> TESTER ADVISORY
            </h4>
            <p className="text-[11px] text-slate-300 leading-normal font-mono">
              Test features under development may cause sudden game balancing shifts. Utilize the AI Match Simulator inside the Sandbox tab to test adjustments.
            </p>
          </div>
        </div>
      </div>

      {/* Live Feature Selector - Left Bottom (Span 7) */}
      <div className="lg:col-span-7 bg-slate-900/80 border border-white/10 p-6 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2 mb-4">
          <Bookmark className="w-5 h-5 text-blue-400" />
          UPCOMING OB47 WORKSPACE FEATURES
        </h3>
        
        <div className="space-y-3">
          {features.map((feat) => {
            const isSelected = selectedFeat?.id === feat.id;
            return (
              <div
                key={feat.id}
                onClick={() => {
                  setSelectedFeat(feat);
                  onSelectFeature(feat);
                }}
                className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? "bg-blue-600/10 border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                    : "bg-slate-900/60 border-white/5 hover:bg-white/5 hover:border-white/10"
                }`}
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase tracking-widest font-mono text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      {feat.category}
                    </span>
                    <span className={`text-[9px] px-2 rounded-full font-mono uppercase tracking-widest ${
                      feat.status.includes("Pending") || feat.status.includes("Experimental")
                        ? "bg-amber-400/10 text-amber-400 border border-amber-400/25"
                        : "bg-emerald-400/10 text-emerald-400 border border-emerald-400/25"
                    }`}>
                      {feat.status}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white tracking-wide">{feat.title}</h4>
                  <p className="text-xs text-slate-300 line-clamp-2">{feat.desc}</p>
                </div>

                <div className="text-right font-mono hidden sm:block shrink-0">
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider">BALANCE SCORE</span>
                  <span className={`text-base font-black ${
                    feat.balanceScore > 85 ? "text-emerald-400" : feat.balanceScore > 70 ? "text-amber-400" : "text-fuchsia-400"
                  }`}>
                    {feat.balanceScore}/100
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature Detailed Analytics / Voting / AI Sentiment - Right Bottom (Span 5) */}
      <div className="lg:col-span-5 bg-slate-900/80 border border-white/10 p-6 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] flex flex-col justify-between">
        {selectedFeat ? (
          <div className="space-y-5">
            <div className="border-b border-white/5 pb-3">
              <span className="font-mono text-[9px] text-fuchsia-400 block tracking-widest uppercase">
                Active Assessment Target
              </span>
              <h3 className="text-lg font-black tracking-tight text-white uppercase">{selectedFeat.title}</h3>
              <p className="text-xs text-slate-400 font-mono mt-1 uppercase tracking-wider">Skill index: {selectedFeat.skill}</p>
            </div>

            {/* QA Balance Voting Dial */}
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <h4 className="text-xs font-mono font-semibold tracking-wider text-slate-300 uppercase mb-3 flex items-center gap-1">
                <Vote className="w-4 h-4 text-fuchsia-400" /> Balance QA Voting
              </h4>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleVote(selectedFeat.id, "buff")}
                  disabled={!!voted[selectedFeat.id]}
                  className={`py-2 px-1 rounded-xl font-mono text-[11px] font-bold transition-all flex flex-col items-center gap-1 border ${
                    voted[selectedFeat.id] === "buff"
                      ? "bg-emerald-500/10 border-emerald-400 text-emerald-400"
                      : "bg-slate-900/60 border-white/5 hover:border-emerald-500 text-slate-300"
                  }`}
                >
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>BUFF ({voteStats[selectedFeat.id]?.buff || 0})</span>
                </button>

                <button
                  onClick={() => handleVote(selectedFeat.id, "nerf")}
                  disabled={!!voted[selectedFeat.id]}
                  className={`py-2 px-1 rounded-xl font-mono text-[11px] font-bold transition-all flex flex-col items-center gap-1 border ${
                    voted[selectedFeat.id] === "nerf"
                      ? "bg-fuchsia-500/10 border-fuchsia-500 text-fuchsia-400"
                      : "bg-slate-900/60 border-white/5 hover:border-fuchsia-500 text-slate-300"
                  }`}
                >
                  <TrendingDown className="w-4 h-4 text-fuchsia-400" />
                  <span>NERF ({voteStats[selectedFeat.id]?.nerf || 0})</span>
                </button>

                <button
                  onClick={() => handleVote(selectedFeat.id, "stable")}
                  disabled={!!voted[selectedFeat.id]}
                  className={`py-2 px-1 rounded-xl font-mono text-[11px] font-bold transition-all flex flex-col items-center gap-1 border ${
                    voted[selectedFeat.id] === "stable"
                      ? "bg-blue-500/10 border-blue-400 text-blue-400"
                      : "bg-slate-900/60 border-white/5 hover:border-blue-400 text-slate-300"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>STABLE ({voteStats[selectedFeat.id]?.stable || 0})</span>
                </button>
              </div>

              {voted[selectedFeat.id] && (
                <p className="text-[11px] text-emerald-400 mt-2 font-mono text-center flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Your feedback vote registered securely!
                </p>
              )}
            </div>

            {/* QA Tester Notes & Comments */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-semibold tracking-wider text-slate-300 uppercase flex items-center gap-1">
                <MessageSquareCode className="w-4 h-4 text-blue-400" /> Tester Telemetry Comments
              </h4>

              <div className="bg-[#020617] border border-white/5 p-3 rounded-2xl h-28 overflow-y-auto space-y-2 text-xs font-mono">
                {(commentsList[selectedFeat.id] || []).length > 0 ? (
                  (commentsList[selectedFeat.id] || []).map((comm, idx) => (
                    <div key={idx} className="bg-white/5 p-2 rounded-xl border border-white/5 text-slate-200">
                      <span className="text-blue-400 font-bold mr-1">&gt; </span> {comm}
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 italic text-center py-6">No data logs logged. Enter yours below.</p>
                )}
              </div>

              {/* Text Area Form */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Insert QA report comment..."
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  className="bg-[#020617] border border-white/10 focus:border-blue-500 text-white text-xs rounded-xl px-3 py-1.5 flex-1 outline-none font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-black font-bold text-xs uppercase tracking-tighter skew-x-[-12deg] hover:bg-fuchsia-400 font-mono"
                >
                  LOG DATA
                </button>
              </form>
            </div>

            {/* AI Sentiment analysis powered by Express/Gemini API */}
            <div className="border-t border-white/5 pt-4 space-y-2">
              <button
                onClick={runAiSentimentSummary}
                disabled={isAnalyzing}
                className="w-full px-6 py-2.5 bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5 font-mono shadow-[0_0_15px_rgba(217,70,239,0.2)]"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>AI CONSENSUS COMPILING...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>AI Consensus Diagnostic</span>
                  </>
                )}
              </button>

              {sentimentResult && (
                <div className="bg-slate-900/90 border border-white/10 p-3.5 rounded-2xl text-xs leading-relaxed font-mono text-blue-300">
                  <p className="font-extrabold uppercase text-fuchsia-400 mb-1 tracking-widest text-[9px]">
                    ★ Gemini Diagnostic Verdict:
                  </p>
                  <p className="whitespace-pre-line text-slate-250 text-slate-200">{sentimentResult}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-500 py-12 font-mono">
            Select a workspace feature parameter to load HUD logs.
          </div>
        )}
      </div>

    </div>
  );
}
