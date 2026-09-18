// Centralized config so model choices live in exactly one place.
// Google's Gemini lineup and free-tier limits change during the year — check
// https://ai.google.dev/gemini-api/docs/models and
// https://ai.google.dev/gemini-api/docs/rate-limits before a large run.

require('dotenv').config();

module.exports = {
  geminiApiKey: process.env.GEMINI_API_KEY,
  // gemini-2.5-flash was retired for new users — Google's own 404 message
  // points to gemini-3.6-flash (released July 2026), which is on Google AI
  // Studio's free tier — no card required. Check
  // https://ai.google.dev/gemini-api/docs/models if this changes again.
  model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
  // Needs real headroom: the agent returns the FULL content of every changed
  // file (not a diff), and gemini-3.6-flash's reasoning tokens count against
  // this same budget. 2000 was enough for a diff; it isn't for whole files.
  maxOutputTokens: parseInt(process.env.GEMINI_MAX_OUTPUT_TOKENS || '8000', 10),

  // Path assumes repair-agent/ sits as a sibling of "Myntra React Clone" inside
  // the Skincare/ repo root (Skincare/repair-agent, Skincare/Myntra React Clone).
  datasetDir: process.env.DATASET_DIR || '../Myntra React Clone/dataset',
};