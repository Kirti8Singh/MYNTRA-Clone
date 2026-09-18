const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

/**
 * Writes each modified file's full new content directly to disk, then asks
 * git to produce the diff for record-keeping — git always generates a valid
 * diff from real file contents, unlike an LLM asked to hand-write one.
 *
 * Refuses to write to a path that doesn't already exist under repoRoot, as a
 * safety check against the model inventing a path.
 *
 * @param {Array<{path: string, content: string}>} modifiedFiles
 * @param {string} repoRoot - git repo root the paths are relative to
 * @returns {string} the diff, as produced by `git diff`
 */
function applyFix(modifiedFiles, repoRoot) {
  if (!modifiedFiles || modifiedFiles.length === 0) {
    throw new Error('No modified_files to apply.');
  }

  for (const file of modifiedFiles) {
    const fullPath = path.join(repoRoot, file.path);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Refusing to write to "${file.path}" — it doesn't exist under ${repoRoot}.`);
    }
    fs.writeFileSync(fullPath, file.content, 'utf8');
  }

  const paths = modifiedFiles.map((f) => f.path);
  return execFileSync('git', ['diff', '--no-color', '--', ...paths], { cwd: repoRoot }).toString();
}

module.exports = { applyFix };