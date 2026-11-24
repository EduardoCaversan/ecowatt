import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
let commit = process.env.GITHUB_SHA;
let dirty = false;
if (!commit) {
  try {
    commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
    dirty = Boolean(execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim());
  } catch { commit = 'local-sem-git'; }
}
const metadata = { version, commit, builtAt: new Date().toISOString(), runId: process.env.GITHUB_RUN_ID ?? null, dirty };
mkdirSync(new URL('../public/', import.meta.url), { recursive: true });
writeFileSync(new URL('../public/version.json', import.meta.url), `${JSON.stringify(metadata, null, 2)}\n`);
console.log(`EcoWatt v${version} · ${commit.slice(0, 7)}${dirty ? ' (alterações locais)' : ''}`);
