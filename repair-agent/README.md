# a11y-repair-agent — for Skincare Essentials (Myntra React Clone)

Phase 2 of the plan: the AI repair agent, wired to your actual repo layout.

## 1. Place this folder

Drop `repair-agent/` as a **sibling** of `Myntra React Clone/`, inside `Skincare/`
(the git repo root — confirmed from your upload, currently on branch
`accessibility-defect-003`):

```
Skincare/                          <- git root
├── Myntra React Clone/            <- the app + your Playwright/axe tests
│   └── dataset/
│       ├── evidence/SPA-A11Y-003/ <- D03's captured evidence (already there)
│       └── defects/               <- NEW, one folder per scenario, see step 2
├── backend/
└── repair-agent/                  <- this folder
```

## 2. Add defect.json for D03 (already built for you)

Copy `dataset-additions/defects/SPA-A11Y-003/defect.json` from this bundle to:

```
Skincare/Myntra React Clone/dataset/defects/SPA-A11Y-003/defect.json
```

It's built from your actual `defective-accessibility.json` and `Header.jsx`:

```json
{
  "state": "homepage",
  "axe_rule_id": "label",
  "accessibility_path": "evidence/SPA-A11Y-003/defective-accessibility.json",
  "dom_path": "evidence/SPA-A11Y-003/defective-dom.html",
  "source_files": ["Myntra React Clone/src/components/Header.jsx"]
}
```

`source_files` is repo-root-relative because `Myntra React Clone` is a
subdirectory of the `Skincare` git repo, not its own repo — patches apply
from `Skincare/`.

The defect itself, confirmed from your files: `Header.jsx` line 31 —

```jsx
<input className='search_input' />
```

— no `aria-label`, `<label>`, or `placeholder`, which is exactly what axe's
`label` rule (critical, on the `input` in `.search_bar`) is flagging.

For future scenarios, add a `defect.json` the same way — it's the only
manual step per case. `accessibility_path`/`dom_path` are relative to
`dataset/`; for a scenario using the scenario00N-style layout, point them at
`accessibility/scenarioNNN.json` and `dom/scenarioNNN_home.html` instead.

## 3. Install & configure

```bash
cd repair-agent
npm install
cp .env.example .env
```

Get a free Gemini API key — **no credit card required** — at
**https://aistudio.google.com/apikey**. Sign in with a Google account, click
"Create API key," copy it, and paste it into `.env`:

```
GEMINI_API_KEY=your-real-key-here
```

## 4. Run it on D03

```bash
node src/runRepair.js SPA-A11Y-003 ..
```

(The `..` is the repo root — `Skincare/` — since that's where `git apply`
needs to run from.)

This will:

1. Read `dataset/defects/SPA-A11Y-003/defect.json`, then the evidence it
   points to (`defective-accessibility.json`, `defective-dom.html`) plus
   `Header.jsx`'s actual current content
2. Call the agent with strict structured output — you get back
   `{ diagnosis, repair_strategy, files_to_modify, patch, confidence,
risk_notes, unrepairable }`
3. Write `dataset/defects/SPA-A11Y-003/agent/diagnosis.json` and `patch.diff`
4. Apply the patch to `Header.jsx` with `git apply` (dry-run checked first)

Expect something like adding `aria-label="Search products"` to the input —
but let the agent produce and justify its own patch rather than assuming.

## 5. Check the result

```bash
cd "../Myntra React Clone"
git diff src/components/Header.jsx
```

Then re-run your existing test to see the violation count change:

```bash
npx playwright test tests/accessibility/scenario001.spec.js
```

(scenario001 hits the homepage, which is where the search input lives —
useful as an ad hoc check even though it's not scenario003's own test yet.)

## What's NOT here — Phase 3 (verification harness)

This module stops after applying the patch. It does not re-run the
scenario, re-run axe, diff violations, check functional regression, or
classify the outcome (REPAIRED / PARTIAL / FAILED / REGRESSION / UNSAFE).

Given what I've now seen of your test files, the natural shape for
`tests/accessibility/scenario003.spec.js` would mirror `scenario002.spec.js`'s
before/after pattern: run the same homepage load, run axe, compare
`violations.length` for the `label` rule before vs. after the patch, and
write a `verification.json` next to `agent/diagnosis.json`. Want me to write
that spec next, once you've run the repair and can see what the agent
actually changed?

## Model choice

Defaults to `gemini-2.5-flash` via `GEMINI_MODEL` in `.env` — it's on Google
AI Studio's free tier (roughly 10 requests/min, 500/day as of now), which is
plenty for repairing scenarios one at a time. Check
https://ai.google.dev/gemini-api/docs/models and
https://ai.google.dev/gemini-api/docs/rate-limits before a large run, since
free-tier limits and the model lineup both move during the year.
