import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini Client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured. Please add it via Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. Core Config List of Upcoming Patch Content (Mock Static metadata)
app.get("/api/config", (req, res) => {
  res.json({
    status: "active",
    environment: "Advance Server v47.1.0",
    clientVersion: "FF-ADV-2026",
    testPhase: "Phase 4 - AI Balancing & Sandbox Tests",
    systemStats: {
      ping: "18ms",
      load: "42%",
      activeTesters: 4819,
    },
    upcomingFeatures: [
      {
        id: "feat_01",
        title: "Kassie (New Character)",
        category: "Characters",
        status: "Testing Buffs",
        desc: "Neuroscientist capable of linking with teammates to restore EP/HP dynamically.",
        skill: "Healing Bond (Active) - Recharging EP stream.",
        balanceScore: 88,
      },
      {
        id: "feat_02",
        title: "Trogon Shotgun Balance",
        category: "Weapons",
        status: "Nerf Pending",
        desc: "Currently dominant in grenade launcher mode. Heavy focus on explosion range containment.",
        skill: "Dual Mode: Blast Radius Reduction.",
        balanceScore: 65,
      },
      {
        id: "feat_03",
        title: "Bermuda Solar Array",
        category: "Map Zones",
        status: "Stable",
        desc: "New solar station zone in Bermuda with high structural vertically and high tier loot.",
        skill: "Holographic Launchpads & Solar Cover.",
        balanceScore: 92,
      },
      {
        id: "feat_04",
        title: "Chrono Re-calibration",
        category: "Rebalancing",
        status: "Experimental",
        desc: "Time Turner dome duration increased to 5 seconds, but movement speed boost within dome reduced.",
        skill: "Time Turner (Re-tuned).",
        balanceScore: 78,
      }
    ]
  });
});

// 2. AI Battle Sandbox Simulator (Match Simulation)
app.post("/api/simulate-match", async (req, res) => {
  const { weapon, attacker, defender, scenario } = req.body;

  try {
    const ai = getAI();
    
    const prompt = `
      You are the Free Fire Advance Server Game Engine Match Simulator.
      Simulate an esports-level, highly tactical 1v1 battle in the upcoming Free Fire patch.
      
      Combat Setup:
      - Battle Scenario: ${scenario || "Close Combat (Bermuda Clock Tower)"}
      - Character 1 (Attacker): ${attacker?.name || "Kelly (Awakened)"} (Active Skill: ${attacker?.activeSkill || "Dash/Deadly Velocity"})
      - Attacker's Prototype Weapon: ${weapon?.name || "M1887 Alpha"} with attributes:
        -- Damage: ${weapon?.damage || 80}/100
        -- Rate of Fire: ${weapon?.fireRate || 50}/100
        -- Range: ${weapon?.range || 40}/100
        -- Accuracy: ${weapon?.accuracy || 30}/100
        -- Special Ability / Perk: ${weapon?.specialPerk || "Double-mag velocity boost"}
      - Character 2 (Defender): ${defender?.name || "Chrono"} (Active Skill: ${defender?.activeSkill || "Time Turner Shield"})

      Simulate exactly how this interaction works out with Gloo Walls, HP counters, skill activations, hit registration, recoil, and tactical moves.
      Then, output your complete response in standard JSON with the exact fields schema requested below. Do NOT wrap in markdown backticks other than JSON formatting.

      JSON structure to return:
      {
        "winner": "Winner Name (either Attacker or Defender character)",
        "winRate": 74, (number out of 100 for winner's theoretical odds)
        "matchLogs": [
          "Combat step 1 outline (e.g. Attacker pushes with Gloo Wall, Defender opens fire)",
          "Combat step 2 outline (e.g. Defender activates skill, Attacker redirects fire)",
          "Combat step 3 outline (e.g. Final bullet exchange with headshot calculation or recoil decay)"
        ],
        "balanceAssessment": "Analytical gaming QA review indicating if weapon stats combined with character skills are balanced, overpowered, or underpowered.",
        "qaVerdict": "BUFF REQUIRED | NERF REQUIRED | STABLE"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["winner", "winRate", "matchLogs", "balanceAssessment", "qaVerdict"],
          properties: {
            winner: { type: Type.STRING },
            winRate: { type: Type.INTEGER },
            matchLogs: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            balanceAssessment: { type: Type.STRING },
            qaVerdict: { type: Type.STRING }
          }
        }
      }
    });

    const resultText = response.text;
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Match Simulator Error: ", error);
    res.status(500).json({
      error: error.message || "Failed to simulate battle.",
      winner: attacker?.name || "Kelly",
      winRate: 50,
      matchLogs: [
        `System initiated mock battle for ${weapon?.name || "Prototype Weapon"}.`,
        `Friction collision estimated in local test zone ${scenario || "Peak"}.`,
        "Simulation resolved with local fallback data."
      ],
      balanceAssessment: "Local engine fallback balance calculations applied due to AI connection queue.",
      qaVerdict: "STABLE"
    });
  }
});

// 3. AI Custom Weapon Designer
app.post("/api/generate-weapon", async (req, res) => {
  const { concept, type } = req.body;

  try {
    const ai = getAI();
    const prompt = `
      You are a Lead Weapon Designer for Free Fire. Designing a new upcoming weapon of type: "${type || "Assault Rifle"}" based on the user concept: "${concept || "Gloo-melting Plasma Gun"}".
      Generate the details of this prototype.
      Make it vibrant, futuristic, balanced, and complete with esports statistics.
      Do NOT wrap in markdown other than standard JSON.

      JSON structure:
      {
        "name": "Designated futuristic name (e.g., Plasma Melter M-9)" ,
        "damage": 78, (integer 10-100)
        "fireRate": 60, (integer 10-100)
        "range": 65, (integer 10-100)
        "accuracy": 50, (integer 10-100)
        "rarity": "Legendary / Mythic / Epic",
        "specialPerk": "Short description of the unique attributes (e.g., melts gloo walls 25% faster)",
        "lore": "One sentence describing the tech origin of the weapon.",
        "aiAssessmentRating": "OVERPOWERED / BALANCED / HIGH SKILL RECAP"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["name", "damage", "fireRate", "range", "accuracy", "rarity", "specialPerk", "lore", "aiAssessmentRating"],
          properties: {
            name: { type: Type.STRING },
            damage: { type: Type.INTEGER },
            fireRate: { type: Type.INTEGER },
            range: { type: Type.INTEGER },
            accuracy: { type: Type.INTEGER },
            rarity: { type: Type.STRING },
            specialPerk: { type: Type.STRING },
            lore: { type: Type.STRING },
            aiAssessmentRating: { type: Type.STRING }
          }
        }
      }
    });

    res.json(JSON.parse(response.text));
  } catch (error: any) {
    console.error("Weapon Generation Error: ", error);
    res.status(500).json({
      error: error.message || "Failed to generate weapon.",
      name: `Proto-${type || "Rifle"} X`,
      damage: 75,
      fireRate: 70,
      range: 55,
      accuracy: 60,
      rarity: "Epic",
      specialPerk: `Melts target barriers upon hit. [Fallback Mode]`,
      lore: `Designed by cyber defense unit inside Lab Sunset.`,
      aiAssessmentRating: "BALANCED"
    });
  }
});

// 4. AI Patch Notes Creator
app.post("/api/generate-patch-notes", async (req, res) => {
  const { patchTopic, patchTarget } = req.body;

  try {
    const ai = getAI();
    const prompt = `
      Create professional-grade, stylized Free Fire Patch Notes for Free Fire Advance Server:
      - Core Theme/Update: "${patchTopic || "Cyberpunk Neon Battleground"}"
      - Targeting systems: "${patchTarget || "Weapon mechanics, Kassie Character buffs, solar pads"}"

      Write the patch notes in bullet points, with clean developer lingo, emoji highlights (like 🛠️, 🔫, 🏃, ⚡), and a vibrant energetic Free Fire QA vibe.
      Provide the result in JSON format with fields:
      {
        "version": "OB47.5-ADV-1",
        "title": "A cool bold dynamic title, e.g., TECHNOTRONIC UPRISING PATCH NOTES",
        "highlights": ["highlight 1", "highlight 2", "highlight 3"],
        "detailedNotes": "A formatted string containing bulleted text paragraphs of structural updates.",
        "releasingDate": "Expected Release: mid-OB48 global update"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["version", "title", "highlights", "detailedNotes", "releasingDate"],
          properties: {
            version: { type: Type.STRING },
            title: { type: Type.STRING },
            highlights: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            detailedNotes: { type: Type.STRING },
            releasingDate: { type: Type.STRING }
          }
        }
      }
    });

    res.json(JSON.parse(response.text));
  } catch (error: any) {
    console.error("Patch Notes Error: ", error);
    res.status(500).json({
      error: error.message || "Failed to compile patch notes.",
      version: "OB47.1.0-ADV-DEBUG",
      title: "AI ADVANCE CONSOLE PATCH NOTES DEFAULT",
      highlights: ["M40 Recoil Adjustment testing phase active", "Gloo Link healing link rates balanced"],
      detailedNotes: "• Weapon Balancing: Sub-machine guns damage falloff increased by 4% beyond 15m. \n• Skill Calibration: Tatsuya's dash cooldown slightly incremented for testing stability.",
      releasingDate: "Target OB47 Global Launch"
    });
  }
});

// 5. Bug Diagnose Terminal Endpoint
app.post("/api/bug-diagnose", async (req, res) => {
  const { errorLog } = req.body;

  try {
    const ai = getAI();
    const prompt = `
      You are the Free Fire Advance Server Backend Bug Diagnoser terminal.
      Analyzing test runtime logs. Here are the logs:
      "${errorLog || "NullPointerException: character_tatsuya.dashTimer on frame updates"}"

      Provide an instant gaming terminal diagnostics output in JSON with fields:
      {
        "errorCode": "ADV-4029-CRITICAL",
        "rootCause": "Short direct explanation of why the bug occurred (e.g., coordinate indexing out of map bounds or mismatch of packet sizes)",
        "reproductionSteps": "1. Pick Kassie and Tatsuya... 2. Cast skill within Gloo Wall boundary",
        "hotfixSuggestion": "Proposed code fix or config modification with exact technical terminology.",
        "severity": "CRITICAL / MEDIUM / LOW"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["errorCode", "rootCause", "reproductionSteps", "hotfixSuggestion", "severity"],
          properties: {
            errorCode: { type: Type.STRING },
            rootCause: { type: Type.STRING },
            reproductionSteps: { type: Type.STRING },
            hotfixSuggestion: { type: Type.STRING },
            severity: { type: Type.STRING }
          }
        }
      }
    });
    res.json(JSON.parse(response.text));
  } catch (error: any) {
    res.status(500).json({
      errorCode: "ADV-999-FALLBACK",
      rootCause: "Packet sync threshold overrun during coordinate checks.",
      reproductionSteps: "Initiate dual launcher reload while sprinting.",
      hotfixSuggestion: "Clamp frame-by-frame reload arrays within float ranges.",
      severity: "MEDIUM"
    });
  }
});

// Integrate Vite middleware for development, and static files for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Free Fire AI Advance Server running on port ${PORT}`);
  });
}

startServer();
