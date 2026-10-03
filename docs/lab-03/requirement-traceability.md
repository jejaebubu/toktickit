# Requirement Traceability — Answer Parts 5–8

Lab Sheet Parts 5–8 require each behaviour to be *demonstrated*. Screenshots are supplied
for every state that has a distinct visual layout. The remaining behaviours are error
paths or API-level rules that introduce no new layout; they are evidenced by the automated
tests listed below. Every test ID in this document exists in the repository:

| Prefix | Location |
|---|---|
| `API-01`…`API-17` | `server/tests/lab-03/*.api.test.ts` |
| `E2E-01`…`E2E-04` | `e2e/lab-03/*.spec.ts` |
| `STYLE-*`, `RESP-*` | `client/tests/lab-03/*.test.tsx` |
| `AUTH-01`…`AUTH-10` | `artifacts/lab-03/api-authorization-evidence.txt` (live `curl`) |

Test results on the final `main`: **server 83/83, client 79/79, E2E 18/18 = 180 passing**.

## 5.9 Login and Password Change

| Required behaviour | Test / evidence ID | Evidence type | Result |
|---|---|---|---|
| Valid login returns 200 + JWT + user object | `API-01` | test | Pass |
| Invalid password shows an error, no token issued | `API-02, E2E-01, AUTH-09` | test + live curl | Pass |
| Inactive account cannot sign in | `API-03, AUTH-10` | test + live curl | Pass |
| Busy / safe failure feedback (401/403 wording, no stack leak) | `API-07, E2E-01` | test | Pass |
| Mandatory first-password change enforced before normal APIs | `API-05, E2E-02` | test + screenshot | Pass |
| Password complexity rules enforced on change | `API-06` | test | Pass |
| Authenticated user and role displayed | `API-04, E2E-01` | test + screenshot | Pass |
| Logout, and direct URL access blocked afterwards | `E2E-01` | test | Pass |

All rows above verified in `server/tests/lab-03`, `client/tests/lab-03`, `e2e/lab-03` and the recorded API evidence file on `main` = `f6c3502`.


## 6.9 IT Staff Ticket Queue

| Required behaviour | Test / evidence ID | Evidence type | Result |
|---|---|---|---|
| Realistic queue data (seeded, mixed status/priority/owner) | `E2E-03` | test + screenshot | Pass |
| Search by ticket number / summary | `API-07a, E2E-03` | test + screenshot | Pass |
| Filter by status, category, owner | `API-07b, API-07d` | test + screenshot | Pass |
| Case-insensitive priority filter | `API-07e` | test | Pass |
| Sorting by updatedAt | `API-07c` | test | Pass |
| Pagination metadata | `API-07` | test | Pass |
| Assigned / unassigned ownership visible and actionable | `API-07d, E2E-03` | test + screenshot | Pass |
| Status and IT-Priority badges | `STYLE-01a-STYLE-01f` | test + screenshot | Pass |
| Open-detail action | `E2E-03` | test + screenshot | Pass |
| Empty / no-results feedback | `API-07a` | test | Pass |
| Safe failure (bad ownerId -> 400, never 500) | `API-07f` | test | Pass |
| Responsive desktop / tablet / mobile | `queue-filtered x3` | screenshot | Pass |

All rows above verified in `server/tests/lab-03`, `client/tests/lab-03`, `e2e/lab-03` and the recorded API evidence file on `main` = `f6c3502`.


## 7.9 IT Staff Ticket Detail

| Required behaviour | Test / evidence ID | Evidence type | Result |
|---|---|---|---|
| Claim ticket ownership | `API-08, E2E-03` | test + screenshot | Pass |
| Update IT Priority | `API-09, E2E-03` | test + screenshot | Pass |
| Permitted status transitions only | `API-09, API-14` | test | Pass |
| Public Comments (post, empty, overlong) | `API-10a, API-10b, API-10b2, E2E-03` | test + screenshot | Pass |
| Internal Notes (staff-only) | `API-10c, API-08, AUTH-03, AUTH-07` | test + live curl | Pass |
| Attachment continuity carried over from Lab 2 | `attachments.api.test.ts (API-04a-API-05)` | test | Pass |
| Requester indicates problem resolved | `API-10 (requesterIndicatedResolved)` | test | Pass |
| Role restrictions enforced server-side | `AUTH-03, AUTH-04, AUTH-05, AUTH-06` | live curl 10/10 | Pass |
| Validation on ownerId / itPriority / status / content | `API-12, API-13, API-10b, API-10b2` | test | Pass |
| Safe failure (invalid ownerId -> 400) | `API-12, API-13` | test | Pass |
| Requester cannot read another user's ticket (404, no leak) | `API-11, AUTH-06` | test + live curl | Pass |

All rows above verified in `server/tests/lab-03`, `client/tests/lab-03`, `e2e/lab-03` and the recorded API evidence file on `main` = `f6c3502`.


## 8.9 Administrator User Management

| Required behaviour | Test / evidence ID | Evidence type | Result |
|---|---|---|---|
| User list shows Name / Email / Role / Status / Edit | `API-11` | test + screenshot | Pass |
| Search users | `API-11, E2E-04` | test + screenshot | Pass |
| Filter by role | `API-11` | test | Pass |
| Create user | `API-12, E2E-04` | test | Pass |
| Validation (duplicate email -> 409) | `API-13, E2E-04` | test + screenshot | Pass |
| Edit user / demote role | `API-17` | test | Pass |
| Reset initial password, forcing change on next login | `API-15, E2E-02, E2E-04` | test + screenshot | Pass |
| Admin self-deactivation prevented | `API-14, E2E-04` | test + screenshot | Pass |
| Last active Administrator cannot be demoted | `API-16` | test | Pass |
| Forbidden for non-Administrators | `AUTH-04, AUTH-05` | live curl | Pass |
| Responsive desktop / tablet / mobile | `user-search x3` | screenshot | Pass |

All rows above verified in `server/tests/lab-03`, `client/tests/lab-03`, `e2e/lab-03` and the recorded API evidence file on `main` = `f6c3502`.
