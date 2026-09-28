/**
 * Write the deploy marker that scripts/site-hygiene.mjs reads.
 *
 * The marker is how the daily hygiene check proves the live site matches HEAD:
 * if /.well-known/deploy.txt differs from `git rev-parse HEAD`, then either the
 * Git integration broke, the build failed, or somebody deployed locally with
 * `wrangler deploy` and the next CI push will silently revert it.
 *
 * This site has no framework, so there is no build step to hang this off. It is
 * wired directly as the Cloudflare Workers Builds build command.
 *
 * Commit source, in order:
 *   1. WORKERS_CI_COMMIT_SHA — set by Cloudflare Workers Builds.
 *   2. `git rev-parse HEAD` — local runs (deploy.sh still calls it this way).
 *   3. "unknown" — never fail a build over a marker.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public", ".well-known", "deploy.txt");

// 只认真正的 SHA。实测：Cloudflare 在**手动触发**的构建里会把
// WORKERS_CI_COMMIT_SHA 设成分支名（拿到过 "main"），push 触发的才是 commit。
// 不校验的话，手动重跑一次就会把 "main" 写进标记，巡检立刻误报。
const SHA_RE = /^[0-9a-f]{40}$/i;

function sha() {
  const fromCi = (process.env.WORKERS_CI_COMMIT_SHA || "").trim();
  if (SHA_RE.test(fromCi)) return fromCi.toLowerCase();
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

const commit = sha();
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, commit + "\n", "utf8");
console.log(`[deploy-marker] ${commit}`);
