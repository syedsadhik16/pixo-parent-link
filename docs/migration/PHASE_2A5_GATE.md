# Phase 2A.5 — Blocking Schema Verification Gate

**Status: 🔴 BLOCKING.** No file in the Phase 2B rewrite list may be edited
until every item below is checked off. This gate exists because we still do
not know, from inside this project, whether `student_profiles` in the Admin
Hub uses `user_id` as its primary key, whether it also exposes a separate
`id` column, and which one the FK columns elsewhere actually point to.

The wrong assumption here cascades into every rewritten query and every RLS
policy. So we verify first.

---

## How to run the gate

The gate is a read-only script that hits the Admin Hub PostgREST API and
inspects column shape. It writes nothing.

```bash
ADMIN_HUB_URL="https://<admin-hub-ref>.supabase.co" \
ADMIN_HUB_SERVICE_ROLE="<service_role_key>" \
node scripts/verify-admin-hub-schema.mjs
```

Exit codes:

| Code | Meaning                                              | Next step              |
| ---- | ---------------------------------------------------- | ---------------------- |
| `0`  | All checks passed                                    | Phase 2B is UNBLOCKED  |
| `1`  | At least one check failed                            | Stay in Phase 2A       |
| `2`  | Missing env vars / cannot reach Admin Hub            | Provide creds, re-run  |

> The service role key is required only locally to bypass RLS during
> introspection. It must **never** be committed or shipped to the client.

---

## Required checklist (must all be ✅ before Phase 2B)

Copy this into the PR / status update and tick each box from the script
output.

- [ ] `student_profiles` is reachable from the Admin Hub
- [ ] `student_profiles.user_id` column exists
- [ ] `student_profiles.user_id` is NOT NULL (consistent with being the PK)
- [ ] Presence of a separate `student_profiles.id` column is **explicitly
      known** — write down `true` or `false`
- [ ] If both `id` and `user_id` exist → Admin Hub team has confirmed in
      writing **which one** is the PK and which one foreign keys point to
- [ ] `student_profiles.child_code` (or documented invite mechanism) is
      confirmed present or confirmed removed
- [ ] `parent_children(parent_user_id, student_user_id)` is reachable
- [ ] `user_roles(user_id, role)` is reachable in the Admin Hub project
- [ ] Decision recorded below: join key for the rewrite is
      `student_user_id = auth.uid()` ✅ **or** `student_user_id =
      student_profiles.id` ❌

**Decision (fill in after the gate passes):**

```
PK column:          ___________________
FK target column:   ___________________
Join key in app:    ___________________
Recorded by:        ___________________   Date: __________
```

---

## Why this gate exists

If we rewrite `child_id → student_user_id` assuming `student_user_id =
auth.uid()`, but the Admin Hub actually uses a surrogate
`student_profiles.id` PK, then:

1. Every parent-side query returns 0 rows (join misses).
2. Every student-side RLS policy of the form
   `student_user_id = auth.uid()` silently denies access.
3. Inserts into `attendance_records`, `lesson_activity`, etc. fail FK checks.
4. We get a second migration to undo the first.

One read-only script avoids all of that.

---

## What the gate does NOT do

- It does not modify any schema (this project's or Admin Hub's).
- It does not edit any application code.
- It does not write to Admin Hub.
- It does not replace human confirmation when both `id` and `user_id` exist
  — in that case the script will explicitly flag the ambiguity and require a
  written decision from the Admin Hub owner before Phase 2B can proceed.
