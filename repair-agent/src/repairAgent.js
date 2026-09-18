const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');
const config = require('./config');

const outputSchema = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'schema', 'agentOutput.schema.json'), 'utf8')
);

const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

const SYSTEM_PROMPT = `You are an accessibility repair agent for a React single-page application.
You will be given: an axe-core violation, the DOM/ARIA state at the moment it was detected,
which interaction (if any) produced that state, and the relevant React source file(s), each
with its full current content.

Rules:
- Fix ONLY the accessibility defect described. Do not refactor unrelated code.
- Preserve existing functionality, Redux/state logic, styling, and component structure.
- Prefer the smallest correct change (e.g. add an aria-label, associate a <label>,
  fix heading order, add an accessible name to a dynamic live region) over a rewrite.
- If the defect is tied to dynamic state (e.g. a value that changes after an interaction),
  make sure your fix keeps working across that state transition, not just for the
  snapshot you were shown.
- Some inputs describe a dynamic-state problem that axe-core did NOT flag (you'll see a
  "note" field saying so, plus before/after ARIA snapshots instead of a single axe
  violation). In that case, reason from the before/after ARIA snapshots and DOM: if a
  visible value updates but the accessibility tree gives no indication a screen reader
  user would be told about it, consider whether the updated region needs to be exposed
  as a live region (e.g. aria-live="polite" or role="status") so it's announced without
  moving focus. Don't add this if the element already behaves as a live region, and don't
  apply it speculatively to unrelated elements.
- In "modified_files", return the COMPLETE new content of every file you changed —
  the whole file from top to bottom, not a diff or a snippet. Untouched files should
  not appear in modified_files at all.
- If you cannot produce a safe fix, set unrepairable=true, modified_files=[], and
  explain why in risk_notes. Never guess at a fix you're not confident preserves
  functionality.`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function callGemini(model, agentInput) {
  const response = await ai.models.generateContent({
    model,
    contents: `${SYSTEM_PROMPT}\n\nInput:\n${JSON.stringify(agentInput, null, 2)}`,
    config: {
      responseMimeType: 'application/json',
      responseJsonSchema: outputSchema,
      maxOutputTokens: config.maxOutputTokens,
    },
  });

  const text = response.text;
  if (!text) {
    const finishReason = response.candidates && response.candidates[0] && response.candidates[0].finishReason;
    throw new Error(`Gemini returned no text (finishReason: ${finishReason || 'unknown'}) — check for a safety block or an empty candidate.`);
  }

  const finishReason = response.candidates && response.candidates[0] && response.candidates[0].finishReason;
  if (finishReason === 'MAX_TOKENS') {
    throw new Error(
      `Gemini's response was cut off at the token limit (GEMINI_MAX_OUTPUT_TOKENS=${config.maxOutputTokens}). ` +
      `Raise it in .env and try again — a larger source file needs more room.`
    );
  }

  return JSON.parse(text);
}

/**
 * @param {object} agentInput - scenario_id, state, interaction, violation,
 *   dom_excerpt, source_files: [{path, content}]
 * @returns {Promise<object>} parsed object matching schema/agentOutput.schema.json
 */
async function requestRepair(agentInput) {
  const maxRetries = 3;
  let lastErr;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const parsed = await callGemini(config.model, agentInput);
      if (parsed.unrepairable && parsed.modified_files.length > 0) {
        throw new Error('Agent marked unrepairable=true but still returned modified_files.');
      }
      if (!parsed.unrepairable && parsed.modified_files.length === 0) {
        throw new Error('Agent returned no modified_files and did not mark unrepairable=true.');
      }
      return parsed;
    } catch (err) {
      lastErr = err;
      const status = err.status || (err.message && err.message.match(/"code":(\d+)/) || [])[1];
      const retriable = status == 503 || status == 429;
      if (!retriable || attempt === maxRetries) break;

      const waitMs = 2000 * 2 ** attempt; // 2s, 4s, 8s
      console.log(`[gemini] ${status} — retrying in ${waitMs / 1000}s (attempt ${attempt + 1}/${maxRetries})...`);
      await sleep(waitMs);
    }
  }

  throw lastErr;
}

module.exports = { requestRepair };