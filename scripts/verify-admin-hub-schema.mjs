#!/usr/bin/env node
/**
 * Phase 2A.5 — BLOCKING schema verification gate.
 *
 * Purpose:
 *   Before any query rewrite (Phase 2B) is allowed, this script MUST pass.
 *   It verifies the exact shape of `student_profiles` and `parent_children`
 *   in the Admin Hub Supabase project so we know whether to use
 *   `user_id` or a separate `id` as the join key.
 *
 * Usage:
 *   ADMIN_HUB_URL="https://<ref>.supabase.co" \
 *   ADMIN_HUB_SERVICE_ROLE="<service_role_key>" \
 *   node scripts/verify-admin-hub-schema.mjs
 *
 * Exit codes:
 *   0  → all checks passed, Phase 2B is UNBLOCKED
 *   1  → at least one check failed, Phase 2B remains BLOCKED
 *   2  → missing env vars / cannot run the gate
 *
 * This script makes ZERO writes. SELECTs only.
 */

const URL = process.env.ADMIN_HUB_URL;
const KEY =
  process.env.ADMIN_HUB_SERVICE_ROLE ||
  process.env.ADMIN_HUB_ANON_KEY; // service role preferred; anon may be blocked by RLS

if (!URL || !KEY) {
  console.error("❌ Missing ADMIN_HUB_URL and/or ADMIN_HUB_SERVICE_ROLE.");
  console.error(
    "   Set both env vars to the Admin Hub Supabase project before running.",
  );
  process.exit(2);
}

/**
 * Calls Supabase PostgREST for column metadata via the information_schema
 * exposed views. We use `rpc` to a generic SQL helper if available; otherwise
 * we fall back to probing the table directly.
 */
async function rest(path, init = {}) {
  const res = await fetch(`${URL}${path}`, {
    ...init,
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  return { ok: res.ok, status: res.status, body };
}

const checks = [];
function record(name, pass, detail) {
  checks.push({ name, pass, detail });
  const icon = pass ? "✅" : "❌";
  console.log(`${icon} ${name}`);
  if (detail) console.log(`   ${detail}`);
}

async function probeColumns(table) {
  // Probe by selecting 0 rows but asking for every candidate column.
  // PostgREST returns "column ... does not exist" (PGRST204/42703) per missing column.
  const candidates = ["user_id", "id", "child_code", "display_name"];
  const present = {};
  for (const col of candidates) {
    const r = await rest(
      `/rest/v1/${table}?select=${encodeURIComponent(col)}&limit=0`,
    );
    present[col] = r.ok;
  }
  return present;
}

async function probePk(table) {
  // Postgres exposes PK metadata via the system catalogs, not PostgREST.
  // We approximate: a column that is NOT NULL + UNIQUE behaves like a PK for joins.
  // Test by attempting to filter on it with `.is.null` — if 0 rows EVER returned,
  // we treat it as effectively required. This is heuristic; the human must confirm.
  const r = await rest(
    `/rest/v1/${table}?select=user_id&user_id=is.null&limit=1`,
  );
  if (!r.ok) return { tested: false, reason: r.body };
  const anyNull = Array.isArray(r.body) && r.body.length > 0;
  return { tested: true, userIdNullable: anyNull };
}

(async () => {
  console.log("🔍 Phase 2A.5 — Admin Hub schema verification gate\n");

  // ---- student_profiles ----
  const sp = await probeColumns("student_profiles");
  record(
    "student_profiles table is reachable",
    sp.user_id || sp.id,
    `columns probed → user_id:${sp.user_id} id:${sp.id} child_code:${sp.child_code} display_name:${sp.display_name}`,
  );
  record(
    "student_profiles.user_id exists",
    sp.user_id,
    sp.user_id
      ? "OK — safe to use user_id as student_user_id"
      : "BLOCKER — cannot map child_id → student_user_id without this column",
  );
  record(
    "student_profiles.id presence is known",
    typeof sp.id === "boolean",
    sp.id
      ? "id column ALSO exists → confirm with team whether PK is id or user_id"
      : "id column does NOT exist → user_id is the PK (preferred)",
  );

  const pk = await probePk("student_profiles");
  if (pk.tested) {
    record(
      "student_profiles.user_id appears NOT NULL",
      pk.userIdNullable === false,
      pk.userIdNullable
        ? "Found a row with user_id IS NULL — user_id is NOT the PK. STOP."
        : "No nullable user_id rows seen — consistent with user_id being PK.",
    );
  }

  // ---- parent_children ----
  const pc = await rest(
    "/rest/v1/parent_children?select=parent_user_id,student_user_id&limit=0",
  );
  record(
    "parent_children has parent_user_id + student_user_id",
    pc.ok,
    pc.ok
      ? "OK — link table column names match canonical plan"
      : `BLOCKER — ${JSON.stringify(pc.body)}`,
  );

  // ---- user_roles ----
  const ur = await rest("/rest/v1/user_roles?select=user_id,role&limit=0");
  record(
    "user_roles(user_id, role) is reachable",
    ur.ok,
    ur.ok ? "OK" : `BLOCKER — ${JSON.stringify(ur.body)}`,
  );

  // ---- summary ----
  console.log("\n──────── Gate summary ────────");
  const failed = checks.filter((c) => !c.pass);
  if (failed.length === 0) {
    console.log("✅ All checks passed. Phase 2B query rewrite is UNBLOCKED.");
    process.exit(0);
  }
  console.log(`❌ ${failed.length} check(s) failed. Phase 2B remains BLOCKED.`);
  for (const f of failed) console.log(`   - ${f.name}`);
  process.exit(1);
})().catch((e) => {
  console.error("💥 Gate crashed:", e);
  process.exit(1);
});
