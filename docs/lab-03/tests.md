# Lab 3 Test DD & Traceability Matrix (แผนการทดสอบและการติดตามความต้องการ)

## 1. Test Strategy & Coverage Summary

แผนการทดสอบ Lab 3 ครอบคลุมการสอบทานระบบในทุกมิติ ทั้ง Backend API Tests, Frontend UI Component Tests, Security & Authorization Matrix Tests, Regression Tests และ End-to-End (E2E) Browser Workflows เพื่อสร้างความมั่นใจว่าฟังก์ชันทั้งหมดตรงตามข้อกำหนดและไม่มีข้อผิดพลาด

ผลการรันชุดทดสอบล่าสุด (บันทึกหลังแก้ไขครบทุกข้อในหัวข้อ 4):

| ชุด | คำสั่ง | ผลลัพธ์ |
| :--- | :--- | :--- |
| Server API | `cd server && npx vitest run` | **83 passed** (16 files) |
| Client Component | `cd client && npx vitest run` | **79 passed** (12 files) |
| E2E Browser | `npx playwright test` | **18 passed** (6 tests × 3 viewports) |

การรันซ้ำเพื่อวัดความเสถียร: server ผ่าน **10/10 รอบ** เมื่อ seed ใหม่ก่อนทุกรอบ และ **3/3 รอบ** เมื่อไม่ seed ซ้ำเลย (ชุดทดสอบ self-isolating) โดย seeded dataset ยังครบถ้วนหลังรันเสร็จ

---

## 2. วิธีอ่าน Test ID (สำคัญ)

Test ID ที่ปรากฏใน**ชื่อ `it(...)` จริง** ถูกกำหนด **แยก namespace ภายในแต่ละไฟล์** ไม่ใช่รหัสกลางของทั้งระบบ เช่น `API-07` ปรากฏทั้งใน `staff-queue.api.test.ts` (IT Staff เปิด Queue) และใน `authorization.api.test.ts` (IT Staff ถูกปฏิเสธไม่ให้เรียก Admin API) ซึ่งเป็นคนละเรื่องกัน

ตารางด้านล่างจึงแยกเป็นสองชั้น:

- **ชั้นที่ 2 — Planned Coverage (หัวข้อ 3)** คือ *แผน* ระดับ requirement (AC/FR/BR) ใช้รหัส `API-01` … `API-16` ตามที่วางไว้ใน PR spec
- **ชั้นที่ 3 — Planned → Actual (หัวข้อ 4)** คือ *การ reconcile* แผนเข้ากับของจริง โดยระบุว่าแต่ละแผนการถูกพิสูจน์ด้วยเทสต์ใด รหัสอะไร ในไฟล์ไหน

> หมายเหตุจากการตรวจสอบล่าสุด: ตารางแผนเดิมระบุ `Final Status = Pass` ให้ API-14 (ignore client-supplied `requesterId`) ทั้งที่ **ยังไม่มีเทสต์นี้อยู่จริง** และตัวเลขสรุปเดิมเป็น 76/76 ซึ่งไม่ตรงกับผลจริง ทั้งสองรายการได้รับการแก้ไขแล้วใน PR #79 (เพิ่มเทสต์จริง + อัปเดตตัวเลข) ดูหัวข้อ 5

---

## 3. Planned Coverage Matrix (ระดับ Requirement — ตามแผน)

| Test ID | Type | Requirement / AC | What It Tests | Expected Result | Automated Test File | Final Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **API-01** | API | AC-01 | Valid user authentication | Returns HTTP 200, user data & auth token | `server/tests/lab-03/auth.api.test.ts` | Pass |
| **API-02** | API | AC-01 | Invalid login attempt | Returns HTTP 401 Unauthorized | `server/tests/lab-03/auth.api.test.ts` | Pass |
| **API-03** | API | AC-01 | Inactive account login | Returns HTTP 401 with safe error message | `server/tests/lab-03/auth.api.test.ts` | Pass |
| **API-04** | API | AC-02 | Mandatory password change enforcement | Blocks access to protected APIs until changed | `server/tests/lab-03/auth.api.test.ts` | Pass |
| **API-05** | API | AC-03 | Requester requesting Internal Notes API | Returns HTTP 403 Forbidden | `server/tests/lab-03/authorization.api.test.ts` | Pass |
| **API-06** | API | AC-03 | Requester requesting User Admin API | Returns HTTP 403 Forbidden | `server/tests/lab-03/authorization.api.test.ts` | Pass |
| **API-07** | API | AC-04 | IT Staff Ticket Queue with search/filter | Returns filtered queue with pagination | `server/tests/lab-03/staff-queue.api.test.ts` | Pass |
| **API-08** | API | AC-05 | IT Staff claim ticket ownership | Updates `ownerId` to current IT Staff | `server/tests/lab-03/staff-ticket-detail.api.test.ts` | Pass |
| **API-09** | API | AC-05 | IT Staff update IT Priority & Status | Updates ticket fields successfully | `server/tests/lab-03/staff-ticket-detail.api.test.ts` | Pass |
| **API-10** | API | AC-04 | Create Public Comment & Internal Note | Posts comment & note successfully | `server/tests/lab-03/comments-notes.api.test.ts` | Pass |
| **API-11** | API | AC-06 | Admin self-deactivation attempt | Returns HTTP 400 Bad Request | `server/tests/lab-03/users-admin.api.test.ts` | Pass |
| **API-12** | API | AC-07 | Admin deactivating last active Admin | Returns HTTP 400 Bad Request | `server/tests/lab-03/users-admin.api.test.ts` | Pass |
| **API-13** | API | AC-06 | Duplicate email user creation | Returns HTTP 409 Conflict | `server/tests/lab-03/users-admin.api.test.ts` | Pass |
| **API-14** | API | FR-04 / BR-03 / AC-09 | Server ignores client-supplied `requesterId` (ownership decided from token only) | Viewing own ticket with forged body/query `requesterId` still resolves to authenticated identity | `server/tests/lab-03/authorization.api.test.ts` | Pass *(เพิ่มเทสต์จริงใน PR #79)* |
| **API-15** | API | AC-10 | Password length & complexity boundary validation | Rejects <8 chars / no uppercase / no lowercase / no digit-or-symbol with HTTP 400 | `server/tests/lab-03/auth.api.test.ts` | Pass |
| **API-16** | API | FR-09 / BR-05 / AC-08 | Requester "Problem Appears Resolved" flow | Sets `requesterIndicatedResolved=true`, status becomes `Waiting for Requester`, staff sees the flag; requester cannot set status directly | `server/tests/lab-03/staff-ticket-detail.api.test.ts` | Pass |
| **UI-01** | UI | AC-01 | Login component rendering & submission | Submits credentials and calls auth handler | `client/tests/lab-03/Login.test.tsx` | Pass |
| **UI-02** | UI | AC-02 | Change Password component validation | Enforces rules and submits new password | `client/tests/lab-03/ChangePassword.test.tsx` | Pass |
| **UI-03** | UI | AC-04 | Staff Ticket Queue table & filters | Renders ticket queue and triggers query update | `client/tests/lab-03/StaffTicketQueue.test.tsx` | Pass |
| **UI-04** | UI | AC-05 | Staff Ticket Detail controls & notes | Renders operational actions & distinct notes | `client/tests/lab-03/StaffTicketDetail.test.tsx` | Pass |
| **UI-05** | UI | AC-06 | User Management table & create modal | Renders user list, handles create/edit | `client/tests/lab-03/UserManagement.test.tsx` | Pass |
| **STYLE-01** | UI Style | ui-spec §1, §2.4 | Badge colors (Role/Status/Priority) & amber Internal Notes container | Badges match Zen Green palette & notes label is amber/visible-to-staff-only | `client/tests/lab-03/UI-Style-Responsive.test.tsx`, `client/tests/lab-03/StaffTicketDetail.test.tsx` | Pass |
| **STYLE-02** | UI Style | ui-spec §2, Lab2 §8.8 | Form conventions & read-only/editable split | Required-field asterisks, editable controls vs read-only info fields | `client/tests/lab-03/Login.test.tsx`, `client/tests/lab-03/StaffTicketDetail.test.tsx`, `client/tests/lab-03/UserManagement.test.tsx` | Pass |
| **STYLE-03** | UI Style | ui-spec §2, Lab2 §8.8 | Accessibility, touch targets ≥44px, zero horizontal overflow | Aria attributes, min-height ≥44px controls, overflow-hidden responsive tables | `client/tests/lab-03/Header.test.tsx`, `client/tests/lab-03/StaffTicketQueue.test.tsx`, `client/tests/lab-03/StaffTicketDetail.test.tsx`, `client/tests/lab-03/UserManagement.test.tsx` | Pass |
| **RESP-01** | Responsive | spec §6 / Lab2 §8.7 | Staff Queue desktop table ↔ mobile cards | Both table (`d-none d-md-block`) and card view (`d-md-none`) render | `client/tests/lab-03/StaffTicketQueue.test.tsx` | Pass |
| **RESP-02** | Responsive | spec §6 / Lab2 §8.7 | Login / ChangePassword / UserManagement responsive layout | Centered constrained cards and breakpoint-aware toolbars | `client/tests/lab-03/UI-Style-Responsive.test.tsx`, `client/tests/lab-03/UserManagement.test.tsx` | Pass |
| **E2E-01** | E2E | AC-01 | Login & Logout full flow | User logs in, sees dashboard, logs out | `e2e/lab-03/authentication.spec.ts` | Pass |
| **E2E-02** | E2E | AC-02 | Initial password login & mandatory change | First login redirects to change password | `e2e/lab-03/authentication.spec.ts` | Pass |
| **E2E-03** | E2E | AC-05 | IT Staff ticket queue, claim & update flow | IT Staff claims ticket, updates status/notes | `e2e/lab-03/staff-ticket-flow.spec.ts` | Pass |
| **E2E-04** | E2E | AC-06 | Admin user creation, search, & password reset | Admin creates user, filters, resets password | `e2e/lab-03/user-administration.spec.ts` | Pass |

---

## 4. Planned → Actual Reconciliation (แผน ↔ ของจริง)

### 4.1 Server — Lab 3 (38 tests)

| Requirement | Actual Test ID | ไฟล์ | ผล |
| :--- | :--- | :--- | :--- |
| AC-01 valid login | `API-01` Valid login returns 200, user object, and JWT token | `auth.api.test.ts` | Pass |
| AC-01 invalid password | `API-02` Invalid password returns 401 | `auth.api.test.ts` | Pass |
| AC-01 inactive account | `API-03` Inactive account login returns 401 | `auth.api.test.ts` | Pass |
| AC-01 session identity | `API-04` GET /api/auth/me returns current authenticated user profile | `auth.api.test.ts` | Pass |
| AC-02 forced change | `API-05` First login user must change password before accessing normal APIs | `auth.api.test.ts` | Pass |
| AC-10 password policy | `API-06` change-password enforces complexity rules | `auth.api.test.ts` | Pass |
| §6.2 authn required | `API-07` Missing Authorization header returns 401 | `auth.api.test.ts` | Pass |
| AC-03 requester → internal notes | `API-05` Requester requesting Internal Notes endpoint returns 403 | `authorization.api.test.ts` | Pass |
| AC-03 requester → user admin | `API-06` Requester requesting Admin User Management API returns 403 | `authorization.api.test.ts` | Pass |
| AC-03 IT Staff → user admin | `API-07` IT Staff requesting Admin User Management API returns 403 | `authorization.api.test.ts` | Pass |
| AC-03 IT Staff → internal notes | `API-08` IT Staff can read internal notes | `authorization.api.test.ts` | Pass |
| AC-06 admin capability | `API-09` Administrator can access User Management API | `authorization.api.test.ts` | Pass |
| **AC-09 / FR-04 / BR-03** | `API-10` Server ignores client-supplied `requesterId`, ownership from token | `authorization.api.test.ts` | Pass *(ใหม่ #79)* |
| AC-04 comment posting | `API-10a` Requester posts a Public Comment successfully | `comments-notes.api.test.ts` | Pass |
| AC-04 validation | `API-10b` Empty Public Comment content rejected 400 · `API-10b2` Overlong >1000 chars rejected 400 | `comments-notes.api.test.ts` | Pass |
| AC-04 note posting | `API-10c` IT Staff posts an Internal Note successfully | `comments-notes.api.test.ts` | Pass |
| AC-04 queue + pagination | `API-07` IT Staff receives full ticket queue with pagination metadata | `staff-queue.api.test.ts` | Pass |
| AC-04 search | `API-07a` searches queue by ticket number or summary | `staff-queue.api.test.ts` | Pass |
| AC-04 filter | `API-07b` filters by IT Priority and Status · `API-07e` case-insensitive priority | `staff-queue.api.test.ts` | Pass |
| AC-04 sort | `API-07c` sorts queue by updatedAt ASC | `staff-queue.api.test.ts` | Pass |
| AC-04 unassigned | `API-07d` filters by unassigned tickets (`ownerId=unassigned`) | `staff-queue.api.test.ts` | Pass |
| AC-04 bad param | `API-07f` Invalid `ownerId` returns 400 instead of throwing 500 | `staff-queue.api.test.ts` | Pass |
| AC-05 claim | `API-08` IT Staff claims ticket ownership | `staff-ticket-detail.api.test.ts` | Pass |
| AC-05 update | `API-09` IT Staff updates IT Priority and Status | `staff-ticket-detail.api.test.ts` | Pass |
| AC-08 / FR-09 / BR-05 | `API-10` Requester indicates problem resolved via `requesterIndicatedResolved` | `staff-ticket-detail.api.test.ts` | Pass |
| AC-09 no cross-user access | `API-11` Requester cannot view or update another user | `staff-ticket-detail.api.test.ts` | Pass |
| BR-13 owner validation | `API-12` PATCH rejects invalid `ownerId` (nonexistent / requester / non-numeric) with 400 | `staff-ticket-detail.api.test.ts` | Pass |
| BR-13 field validation | `API-13` PATCH rejects invalid `itPriority` / status with 400 | `staff-ticket-detail.api.test.ts` | Pass |
| AC-08 flag lifecycle | `API-14` Staff status change clears stale `requesterIndicatedResolved` flag | `staff-ticket-detail.api.test.ts` | Pass |
| AC-06 user list | `API-11` Admin fetches user list with search and role filter | `users-admin.api.test.ts` | Pass |
| AC-06 create user | `API-12` Admin creates a new user successfully | `users-admin.api.test.ts` | Pass |
| AC-06 duplicate email | `API-13` Duplicate email user creation returns 409 | `users-admin.api.test.ts` | Pass |
| **AC-06 self-deactivation** | `API-14` Admin self-deactivation attempt returns 400 | `users-admin.api.test.ts` | Pass |
| AC-06 reset password | `API-15` Admin resets initial password for user | `users-admin.api.test.ts` | Pass |
| **AC-07 last admin** | `API-16` The last active Administrator cannot hand their own role away (400) | `users-admin.api.test.ts` | Pass |
| **AC-07 two admins** | `API-17` A second Administrator may be demoted while one remains (200) | `users-admin.api.test.ts` | Pass |

> หมายเหตุ AC-07: เงื่อนไขเดิมคือ "ปิดใช้งาน Admin คนสุดท้าย" แต่โค้ดมีการ์ดกันการปิดบัญชีตัวเองมาก่อน ทำให้เส้นทางนั้น unreachable ดังนั้นเทสต์จึงทดสอบรูปแบบที่เข้าถึงได้จริงของข้อบังคับเดียวกัน คือ Admin คนสุดท้าย **ส่งต่อสิทธิ์ผู้ดูแลระบบของตนเอง** ต้องถูกปฏิเสธ และกรณีที่มี Admin คนที่สองยังคงลดทอดสิทธิ์ได้

### 4.2 Client — Lab 3 (47 tests)

| Planned | Actual test IDs | ไฟล์ | จำนวน |
| :--- | :--- | :--- | :--- |
| UI-01 | `Auth-01a` … `Auth-01h` | `Login.test.tsx` | 8 |
| UI-02 | `Auth-02a` … `Auth-02e` | `ChangePassword.test.tsx` | 5 |
| UI-03 / STYLE-03 / RESP-01 | `STYLE-03c`, `STYLE-03f`, `STYLE-03i`, `RESP-01a` | `StaffTicketQueue.test.tsx` | 4 |
| UI-04 / STYLE-01,02,03 | `STYLE-01g`, `STYLE-01h`, `STYLE-02c`, `STYLE-02g`, `STYLE-03d` | `StaffTicketDetail.test.tsx` | 5 |
| UI-05 / STYLE-02,03 / RESP-02 | `STYLE-02a`, `STYLE-02b`, `STYLE-02e`, `STYLE-02f`, `STYLE-03e`, `STYLE-03g`, `RESP-02c` | `UserManagement.test.tsx` | 7 |
| STYLE-01,02,03 / RESP-02 | `STYLE-01a`–`01f`, `STYLE-02d`, `STYLE-03a`, `STYLE-03b`, `STYLE-03h`, `RESP-02a`, `RESP-02b` | `UI-Style-Responsive.test.tsx` | 12 |
| STYLE-03 (shell) | `Auth-03a` … `Auth-03f` | `Header.test.tsx` | 6 |

### 4.3 E2E — Lab 3 (4 tests × 3 viewports = 12 runs)

| Planned | Spec | ไฟล์ |
| :--- | :--- | :--- |
| E2E-01 | invalid password shows error; valid login opens role dashboard; logout blocks direct access | `e2e/lab-03/authentication.spec.ts` |
| E2E-02 | administrator resets an initial password; first-login user forced to change it | `e2e/lab-03/authentication.spec.ts` |
| E2E-03 | staff searches queue, claims unassigned ticket, updates it, posts comment + note | `e2e/lab-03/staff-ticket-flow.spec.ts` |
| E2E-04 | admin searches users, creates user, sees duplicate & self-deactivation blocks, resets password | `e2e/lab-03/user-administration.spec.ts` |

---

## 5. Security & Regression Tests ที่เพิ่มระหว่าง Review

| Test | Requirement | สิ่งที่พิสูจน์ | ไฟล์ |
| :--- | :--- | :--- | :--- |
| `GET /api/requesters` → 401 | §6.2 | endpoint ไม่เปิดเผยรายชื่อผู้ใช้โดยไม่มี token (PR #75) | `server/tests/lab-02/requesters.test.ts` |
| `GET /api/requesters` → 403 | §6.2 / AC-03 | Requester เข้าถึงรายชื่อผู้ใช้ไม่ได้ | `server/tests/lab-02/requesters.test.ts` |
| `GET /api/requesters` → 200 ×2 | §6.2 | IT Staff / Administrator ได้รายชื่อเรียงตาม id และกรองเฉพาะ role `REQUESTER` | `server/tests/lab-02/requesters.test.ts` |
| `API-16` last active Admin | AC-07 | Admin คนสุดท้ายส่งต่อสิทธิ์ตนเองไม่ได้ | `users-admin.api.test.ts` |
| `API-17` two Admins | AC-07 | ลดทอดสิทธิ์ Admin คนที่สองได้ตราบที่ยังมี Admin คนหนึ่ง | `users-admin.api.test.ts` |
| `API-10` forged `requesterId` | AC-09 / FR-04 / BR-03 | เจ้าของตั๋วมาจาก JWT เท่านั้น (PR #79) | `authorization.api.test.ts` |
| `API-03` ticket-number sequence | BR | เลขตั๋วต่อจากลำดับสูงสุด แม้มีเลขผิดรูปแบบปนอยู่ (PR #79) | `create-ticket.api.test.ts` |
| E2E requester journey | §8 | locator ของ My Tickets ไม่ผันผวนหลังสร้างตั๋ว (PR #76) | `e2e/lab-02/requester-ticket-flow.spec.ts` |

### 5.1 การแก้ไขความไม่ deterministic ของชุดทดสอบ (PR #77)

ก่อนหน้านี้ชุด server ผ่าน/ไม่ผ่านแบบสุ่ม (ล้มเหลว 7/8 รอบ) สาเหตุเป็นการปนเปื้อน state ระหว่างไฟล์เทสต์ ไม่ใช่ข้อผิดพลาดของ product code:

1. `lab-02/create-ticket.api.test.ts` ใช้ `findFirst({ where: { isActive: true } })` ซึ่งไม่มี `role` filter และไม่มี `orderBy` แล้วเขียนทับ `passwordHash` ของ user ที่หลุดมา — บ่อยครั้งคือบัญชี IT Staff/Admin ที่ seed มา ทำให้ suite ที่รันทีหลัง login ด้วยรหัส seed ได้ 401
2. `afterAll` เดิมเรียก `ticket.deleteMany({})` ซึ่งลบตั๋วที่ seed มาด้วย
3. `lab-01/categories.test.ts` ลบ ticket และ category ทั้งหมด แล้วสร้างคืนเฉพาะชื่อโดยไม่คืน id ทำให้ `categoryId: 1` ที่ hardcode ไว้พัง
4. `findFirst({ where: { role: "REQUESTER" } })` ใน 3 ไฟล์ของ Lab 3 ไม่มี `orderBy`
5. `prisma/seed.ts` ใช้ `upsert` อย่างเดียว ทำให้ตั๋วและบัญชีทดสอบสะสมข้ามรอบ

ผลหลังแก้: **ผ่าน 10/10 รอบ** เมื่อ seed ใหม่ทุกรอบ และ **3/3 รอบ** เมื่อไม่ seed ซ้ำ

---

## 6. สรุปจำนวนเทสต์ทั้งหมด

| กลุ่ม | ไฟล์ | จำนวน |
| :--- | :--- | :--- |
| Server — Lab 1 | `categories.test.ts`, `categories-error.test.ts`, `health.test.ts` | 5 |
| Server — Lab 2 | `attachments` (13), `create-ticket` (4), `my-tickets` (11), `related-systems` (1), `requesters` (4), `seed` (3), `ticket-detail` (4) | 40 |
| Server — Lab 3 | `auth` (7), `authorization` (6), `comments-notes` (4), `staff-queue` (7), `staff-ticket-detail` (7), `users-admin` (7) | 38 |
| **Server รวม** | 16 files | **83** |
| Client — Lab 1 | `App.test.tsx` | 3 |
| Client — Lab 2 | `AttachmentSection` (7), `CreateTicket` (9), `MyTickets` (9), `RequesterTicketDetail` (4) | 29 |
| Client — Lab 3 | `ChangePassword` (5), `Header` (6), `Login` (8), `StaffTicketDetail` (5), `StaffTicketQueue` (4), `UI-Style-Responsive` (12), `UserManagement` (7) | 47 |
| **Client รวม** | 12 files | **79** |
| E2E — Lab 2 | `checklist-smoke`, `requester-ticket-flow` | 2 |
| E2E — Lab 3 | `authentication` (2), `staff-ticket-flow` (1), `user-administration` (1) | 4 |
| **E2E รวม** | 5 specs × 3 viewports | **18** |
| **รวมทั้งระบบ** | | **180** |