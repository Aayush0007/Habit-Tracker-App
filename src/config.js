/**
 * WARRIOR MODE - GLOBAL CONFIGURATION
 * Centralizing all tactical constants for the 2026 Deployment.
 */

export const CONFIG = {
  // --- STUDY TARGETS ---
  DAILY_TARGET_HOURS: 8,      /* Standard target */
  ELITE_TARGET_HOURS: 12,     /* Peak performance target */
  SESSION_BLOCK_MINUTES: 120, /* 2-hour tactical blocks */
  MAX_DAILY_SESSIONS: 6,      /* 6 blocks * 2h = 12h max */

  // --- ANALYTICS WEIGHTING ---
  // How much each factor contributes to your "Readiness Index"
  WEIGHTS: {
    SYLLABUS: 0.6,
    MOCKS: 0.3,
    CONSISTENCY: 0.1
  },

  // --- IDENTITY RANKS ---
  RANKS: [
    { name: "TACTICAL RECRUIT", minHours: 0, color: "blue" },
    { name: "STEADFAST WARRIOR", minHours: 100, color: "emerald" },
    { name: "ELITE VANGUARD", minHours: 500, color: "purple" },
    { name: "LEGENDARY COMMANDO", minHours: 1000, color: "amber" }
  ],

  // --- SYSTEM SETTINGS ---
  APP_VERSION: "2.1.0-WARRIOR",
  DEPLOYMENT_YEAR: 2026,
  SYNC_INTERVAL_MS: 30000, // 30 seconds
};