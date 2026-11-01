# Lab 4 Peer Review Log & Approval Record (บันทึกการตรวจทานโค้ดและการอนุมัติ)

## 1. Review Summary
เอกสารบันทึกกระบวนการ Peer Review และการรวมโค้ดผ่านสาขาพัฒนา (Staging Branch) สำหรับ Lab 4: TokTickIT Actions Taken, Dashboards, and Final Regression

> **บันทึกนี้จะถูกอัปเดตตาม PR ที่ตรวจจริงทีละฉบับ (ทำตามกติกา 1 PR : 1 Issue) โดยบันทึกเฉพาะ PR ที่เกิดขึ้นจริงเท่านั้น** — ไม่ลงผลล่วงหน้าก่อนเริ่มเขียนโค้ด

---

## 2. Reviewer Information & Approvals

- **Reviewer Identity**: Peer Review (Partner): `titayaaa` — Full-Stack Software Engineer / Performance Engineering Team
- **Author Identity**: `jejaebubu` — Full-Stack Software Engineer (ผู้เขียนโค้ด, เปิด PR)
- **Staging Branch**: `lab4-staging`
- **Target Branch**: `main`
- **Workflow**: 1 PR : 1 Issue (feature branches → `lab4-staging` → `main`), ตรวจทานจริงทุก PR จาก GitHub ก่อน merge โดย **Reviewer เป็นผู้อนุมัติ (Approve) และกด Merge** ตาม Handout Section 11.1

### Pull Request Log

| PR ID | Title / Feature Scope | Branch Source | Target Branch | Reviewer Status | Comments / Resolution (Merge SHA) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PR-01 ([GitHub #104](https://github.com/jejaebubu/toktickit/pull/104))** | Specification & Engineering Contract for Lab 4 (`specification.md`, `api-spec.md`, `ui-spec.md`, `tests.md`) | `feature/lab04-issue1-specs` | `lab4-staging` | **Request Changes → Approved** | Review #1 โดย `titayaaa`: ขอเพิ่ม `assigneeId`, `status` บน `ActionTaken`, ตรวจสอบ Resolution Gate ไม่ให้ Resolve ตั๋วที่มี pending actions, เพิ่ม error 422/409, อัปเดต UI controls & test cases → ผู้เขียนแก้ไขครบทั้ง 4 ไฟล์ใน commit `3310ba9` → Reviewer ตรวจซ้ำแล้ว **Approve** (verify: เอกสาร Spec DD ครบถ้วนตาม Handout, BR-01..15 และ AC-01..14) — merged `f242eb3` |
| **PR-02 ([GitHub #105](https://github.com/jejaebubu/toktickit/pull/105))** | Database migration, Prisma model, and idempotent seed for Actions Taken | `feature/lab04-issue2-migration` | `lab4-staging` | **Request Changes → Approved & Merged** | Review #1 โดย `titayaaa`: อนุมัติทิศทางโดยรวมและชม integration tests 9 เคส แต่ขอให้ (1) เปลี่ยน `ActionTaken.result` เป็น Nullable (`String?`) เพราะงาน `PENDING`/`IN_PROGRESS` ยังไม่มีผลลัพธ์ และให้ API บังคับเฉพาะตอน `COMPLETED`, (2) อัปเดตสถานะ PR-01 ใน `tests.md` เป็น Merged, (3) เพิ่มบันทึก PR #105 ใน reviewer log → ผู้เขียนแก้ไขครบ (migration ใหม่ `20261031172848_lab04_actions_taken` + tests 10 เคส = 93/93) → Reviewer ตรวจซ้ำแล้ว **Approve** — merged `005b157` |
| **PR-03 ([GitHub #106](https://github.com/jejaebubu/toktickit/pull/106))** | Actions Taken REST API, RBAC authorization, and backend tests | `feature/lab04-issue3-actions-api` | `lab4-staging` | **Request Changes → Approved & Merged** | Review #1 โดย `titayaaa`: ชม RBAC, JWT performer identity, 404 no-leak และ BR-14 state machine (101/101) แต่ขอให้ (1) อัปเดต PR-02 เป็น Approved & Merged + เพิ่ม review trail ของ PR #105 และหัวข้อ PR-03, (2) ล้าง `followUpNote` เป็น `null` เมื่อ `followUpRequired=false` โดยไม่ส่ง note ใหม่, (3) เพิ่ม max length 1000 ให้ `actionDescription` → ผู้เขียนแก้ไขครบ (9 new + 93 = 102/102) → Reviewer ตรวจซ้ำแล้ว **Approve** — merged `23166db` |
| **PR-04 ([GitHub #108](https://github.com/jejaebubu/toktickit/pull/108))** | Actions Taken UI on Ticket Detail (list, create, edit, follow-up) | `feature/lab04-issue4-actions-ui` | `lab4-staging` | **Request Changes → Approved & Merged** | Review #1 โดย `titayaaa`: ชม UI, Follow-up toggle, Requester read-only, Quick Complete/Cancel และเทสต์ 187/187 แต่ขอให้ (1) เพิ่มหัวข้อ `3.4 PR-04` ใน `reviewer.md`, (2) ส่ง `onActionsChange` ใน `StaffTicketDetail.tsx` และ `TicketDetail.tsx` เพื่อ sync state แม่รองรับ Resolution Gate, (3) ปรับสี badge `COMPLETED` (`#f0fdf4`/`#166534`) และ `CANCELLED` (`#fef2f2`/`#991b1b`) ตาม Zen Green tokens พร้อม minor suggestions (min 2 chars result, `maxLength`, A11Y `role="alert"` + `aria-hidden` emoji, safe 500 error ใน `/api/users/assignable`, wording §4.1.7) → ผู้เขียนแก้ไขครบทุกข้อใน commit `ce25314` / `3f029b7` → Reviewer ตรวจซ้ำแล้ว **Approve** — merged `2425b2d` |
| **PR-05 ([GitHub #109](https://github.com/jejaebubu/toktickit/pull/109))** | Ticket workflow state machine, resolution gate, and transition enforcement | `feature/lab04-issue5-workflow` | `lab4-staging` | **Request Changes → Approved & Merged** | Review #1 โดย `titayaaa`: ชมโครงสร้าง State Transition, Resolution Gate Modal, Concurrency Check และเทสต์ 195/195 แต่ขอให้ (1) นำ `"Resolved"` ออกจาก `Open` transitions และเพิ่ม `"Pending"` ใน `TICKET_STATUS_TRANSITIONS`, (2) ลบการแอบเปลี่ยนสถานะตั๋วเมื่อ Requester ส่ง `requesterIndicatedResolved: true` เพื่อให้คงสถานะเดิม 100%, (3) ปรับ 500 catch block ของ `handleTicketPatch` ตาม SAFE-01 ไม่ส่ง `err?.message` พร้อม minor suggestions (`If-Unmodified-Since` precision ระดับวินาที, ซ่อน advisory banner บนตั๋วที่จบแล้ว, เพิ่มปุ่ม Dismiss ใน Stale Modal, สีปุ่ม `Cancelled` เป็น `btn-outline-danger`) → ผู้เขียนแก้ไขครบทุกข้อใน commit `45b424d` / `8f8c8e6` → Reviewer ตรวจซ้ำแล้ว **Approve** — merged `468a7ca` |
| **PR-06 ([GitHub #110](https://github.com/jejaebubu/toktickit/pull/110))** | IT Staff Dashboard API, summary metrics calculation, and UI screen | `feature/lab04-issue6-staff-dashboard` | `lab4-staging` | **Request Changes → Pending re-review** | Review #1 โดย `titayaaa`: ชมการออกแบบการ์ดตัวชี้วัด 5 ใบ, ระบบ Drill-down, Responsive Desktop Table + Mobile Cards และชุดทดสอบ 6 เคสใหม่ (201/201) แต่ขอให้ (1) นำเมนู `Dashboard` ออกจาก `REQUESTER` ใน `Header.tsx` เพื่อป้องกันหน้าว่างก่อนทำ Issue #7, (2) เปลี่ยนหัวข้อแผงจาก `"My Recent Tickets"` เป็น `"Recent Queue Tickets"` ให้สอดคล้องกับ query, (3) เพิ่มลิงก์ PR #110 ใน `reviewer.md` → ผู้เขียนแก้ไขครบทุกข้อ รอตรวจซ้ำ |
| **PR-07** | Requester Dashboard API, owned ticket metrics, and UI screen | `feature/lab04-issue7-requester-dashboard` | `lab4-staging` | Planned | - |
| **PR-08** | End-to-end testing flows (Actions Taken, resolution, dashboards) | `feature/lab04-issue8-e2e` | `lab4-staging` | Planned | - |
| **PR-09** | Lab 1–3 regression test suite and system hardening | `feature/lab04-issue9-regression` | `lab4-staging` | Planned | - |
| **PR-10** | Zen Green UI polish, accessibility, responsive viewports, and screenshots | `feature/lab04-issue10-ui-polish` | `lab4-staging` | Planned | - |
| **PR-11** | Sprint 4 documentation and release integration to main | `release/lab04-staging-to-main` | `main` | Planned | - |

### Partner Pull Request Log (`titayaaa/toktickit`)

| PR ID | Title / Feature Scope | Branch Source | Target Branch | Author | Reviewer Status | Comments / Resolution |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **PR-P1 ([GitHub #75](https://github.com/titayaaa/toktickit/pull/75))** | Issue 27: Sprint 4 Engineering Contract & Specification (`docs/lab-04/`) | `feature/27-lab4-specs` | `lab4-staging` | `titayaaa` | **Changes Requested (3 rounds) → Approved & Merged** | Reviewer `jejaebubu` ตรวจ 3 รอบและขอแก้เรื่อง FK type, field mapping, transition matrix, route/status code, migration plan, ownership formula, accessibility, 403/404 และ stale claims → ผู้เขียนแก้ครบที่ commit `f144a1a` → Reviewer ตรวจรอบสุดท้ายแล้ว **Approve** → Merged `4a55567` (2026-10-31 19:58 UTC) |


---

## 3. Full Review Trail — Own Repository PRs (`jejaebubu/toktickit`)

### 3.1 PR-01: Specification & Engineering Contract (Issue #1)

#### 3.1.1 Review #1 — Request Changes (`titayaaa`, 2026-10-31)
> ภาพรวมเอกสารเขียนโครงสร้างได้ดีมากและครอบคลุมทั้ง 6 ไฟล์ตามเกณฑ์ Spec DD เลยแต่พอลองเช็กทาบกับตัว Lab 4 Handout และ Rubric การตรวจคะแนน (หน้า 8 และ 11) อย่างละเอียดแล้ว พบจุดสำคัญเกี่ยวกับฟิลด์ของ Actions Taken และ Resolution Gate ที่ยังขาดหายไปและจำเป็นต้องเพิ่มลงในสเปกก่อนเริ่มเขียนโค้ด ขอเสนอแนะให้ปรับแก้แยกตามไฟล์ดังนี้
>
> 1. ไฟล์ docs/lab-04/specification.md
> - เพิ่มฟิลด์ assigneeId ในโมเดล ActionTaken: ปัจจุบันมีแค่ performedById (คนบันทึก) แต่ตาม Handout หน้า 8 (AC-01) และหน้า 11 (Part 6) กำหนดว่า Action Taken ต้องมี "approved assignee" และต้องมีการทดสอบ "inactive-assignee rejection" เพื่อรองรับเคสที่ตั๋วเป็นของเจ้าหน้าที่คนหนึ่ง แต่ส่งต่องาน Action ให้เจ้าหน้าที่อีกคนทำได้ (ข้อเสนอแนะ: เพิ่ม assigneeId Int และความสัมพันธ์ assignee User ในโมเดล ActionTaken พร้อมกำหนด Business Rule ว่าผู้ที่ถูก Assign ต้องเป็น IT_STAFF หรือ ADMINISTRATOR ที่ isActive = true เท่านั้น)
> - เพิ่มฟิลด์ status บน ActionTaken: ตาม Rubric หน้า 11 ระบุว่าต้องสาธิต "status transition, complete, cancel" ของ Action Taken ได้ (ข้อเสนอแนะ: เพิ่ม Enum เช่น ActionTakenStatus { PENDING, IN_PROGRESS, COMPLETED, CANCELLED } ไว้ในโมเดล ActionTaken)
> - เพิ่มเงื่อนไข Resolution Gate ให้ครบถ้วน: ใน BR-09 ปัจจุบันระบุแค่เรื่อง Requester advisory flag แต่ตามโจทย์แลป 4 มีกฎสำคัญอีกข้อคือ "ห้ามเปลี่ยนสถานะตั๋วเป็น Resolved หากยังมี Actions Taken ค้างอยู่ในสถานะ PENDING หรือ IN_PROGRESS" (ต้อง Complete หรือ Cancel ทั้งหมดก่อนถึงจะปิดตั๋วได้)
>
> 2. ไฟล์ docs/lab-04/api-spec.md
> - อัปเดต Payload ใน Actions Taken Endpoints (POST และ PATCH): เพิ่มฟิลด์ assigneeId และ status ใน Request Body ของการสร้าง/แก้ไข Action Taken, เพิ่ม Error Response 422 Unprocessable Entity ในกรณีที่ส่ง assigneeId ของผู้ใช้ที่ inactive หรือมีบทบาทเป็น REQUESTER
> - อัปเดต Endpoint เปลี่ยนสถานะตั๋ว (PATCH /api/tickets/:id): เพิ่มเงื่อนไขตรวจสอบ Resolution Gate: หากพยายามปรับสถานะเป็น Resolved แต่ยังมี Action ที่ค้างสถานะ ให้ตอบกลับเป็น 409 Conflict
>
> 3. ไฟล์ docs/lab-04/ui-spec.md
> - เพิ่มคอนโทรลบนฟอร์ม Actions Taken: เพิ่ม Dropdown สำหรับเลือก Assignee (เลือกเจ้าหน้าที่ไอทีที่ active), เพิ่มตัวเลือกสำหรับเปลี่ยน Status ของ Action Taken (Badge แสดงสถานะ และตัวเลือก Complete / Cancel)
> - เพิ่ม Visual Feedback ใน Ticket Resolution: ระบุว่าหากตั๋วยังมี Actions Taken ค้างอยู่ ปุ่ม Resolve ควรมีคำเตือน หรือเมื่อกดยืนยันแล้วระบบจะแสดง Modal เตือนว่ายังมี Action ค้างอยู่
>
> 4. ไฟล์ docs/lab-04/tests.md
> - เพิ่ม Test Cases ใน Traceability Matrix: เพิ่มเคส API/Unit Test ตรวจสอบการปฏิเสธการ Assign ให้ inactive user (422 Unprocessable Entity), เพิ่มเคสทดสอบ Resolution Gate ว่าระบบต้องปฏิเสธ 409 Conflict เมื่อพยายาม Resolve ตั๋วที่มี Pending Actions

#### 3.1.2 Author Response #1 (`jejaebubu`, commit `3310ba9`)
> ขอบคุณสำหรับรีวิวและคำแนะนำนะคะ แก้ไขตามที่แนะนำครบทั้ง 4 ไฟล์แล้วค่ะ ใน commit `3310ba9`
>
> ### 1. specification.md
> - เพิ่ม `assigneeId` และ `assignee User` ใน `ActionTaken` เพื่อแยกคนที่ได้รับมอบหมายออกจาก `performedById`
> - เพิ่มสถานะของ Action ได้แก่ `PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED` โดยเริ่มต้นเป็น `PENDING`
> - เพิ่ม FR-13/14/15 และ BR-13/14/15 สำหรับเรื่อง assignee, การเปลี่ยนสถานะ Action และเงื่อนไขก่อน Resolve ticket
> - เพิ่ม AC-12/13/14 สำหรับกรณีเลือก assignee ไม่ได้, ยังมี Action ค้างตอน Resolve และการเปลี่ยนสถานะ Action
> - อัปเดต Authorization Matrix, UI summary, Database Decisions, Assumptions และ DoD ให้ตรงกับส่วนที่เพิ่มมาค่ะ
>
> ### 2. api-spec.md
> - POST/PATCH `/actions-taken` เพิ่ม `assigneeId` และ `status` พร้อม validation
> - GET response เพิ่มข้อมูล `assignee` และ `status`
> - เพิ่มกรณี `422` เมื่อ assignee ไม่ถูกต้อง
> - เพิ่ม Resolution Gate ถ้ายังมี Action ค้างอยู่จะ Resolve ticket ไม่ได้ และจะได้ `409 Conflict`
> - อัปเดต Status code table ให้ตรงกับกรณีใหม่ค่ะ
>
> ### 3. ui-spec.md
> - เพิ่ม dropdown สำหรับเลือก Assignee โดยจะแสดงเฉพาะ IT Staff/Admin ที่ active
> - เพิ่มตัวเลือกสถานะ Action, ปุ่ม Complete/Cancel และ Badge แสดงสถานะ
> - เพิ่มการจัดการ error `422`
> - ตอน Resolve ถ้ายังมี Action ค้างอยู่ จะแสดงจำนวน `"N action(s) still open"` พร้อม Modal ยืนยัน และรองรับกรณี `409` โดยไม่เปลี่ยนสถานะ ticket ค่ะ
>
> ### 4. tests.md
> - เพิ่ม API-12 สำหรับ inactive assignee → 422
> - เพิ่ม API-13 สำหรับ Resolution Gate → 409
> - เพิ่ม API-14 สำหรับการเปลี่ยนสถานะ Action
> - เพิ่ม UI-06 สำหรับ assignee/status controls
> - เพิ่ม UI-07 สำหรับ Resolution Gate modal
>
> ส่วน test ที่เพิ่มมาใหม่ ตอนนี้ยังเป็น `Planned` ตามกฎ No Premature Data ก่อนนะคะ แล้วจะอัปเดตเป็น `Pass` ใน PR ของ Issue ที่เกี่ยวข้อง (#3–#9) ค่ะ
>
> รบกวนช่วยตรวจอีกรอบให้หน่อยนะคะ ขอบคุณค่ะ

#### 3.1.3 Review #2 — Approved (`titayaaa`, 2026-10-31 23:12 UTC)
Reviewer ตรวจสอบความถูกต้องของการแก้ไขใน commit `3310ba9` ยืนยันว่า:
1. โมเดลข้อมูลใน `specification.md` และ `api-spec.md` เพิ่ม `assigneeId` (พร้อม validation กรอง inactive/requester ตอบ 422) และ `status` (ActionTakenStatus enum) ครบถ้วน
2. Resolution Gate ได้รับการระบุเงื่อนไขใน BR-15, AC-13, และ API spec ชัดเจนว่าห้าม Resolve ตั๋วที่มี pending/in_progress actions โดยตอบกลับ `409 Conflict` (`UNRESOLVED_ACTIONS_EXIST`)
3. `ui-spec.md` และ `tests.md` อัปเดตครบถ้วนตามเกณฑ์ Spec DD

**คำวินิจฉัย**: **APPROVED** — Reviewer กด Merge PR #104 เข้าสู่สาขา `lab4-staging` เรียบร้อย (Merge SHA: `f242eb3`) — **Closes Issue #1**


### 3.2 PR-02: Database Migration, Prisma Model, and Idempotent Seed (Issue #2)

#### 3.2.1 Review #1 — Request Changes (`titayaaa`, 2026-10-31)

> ภาพรวม PR #105 ขยายฐานข้อมูลของ Lab 4 (Actions Taken Model, Migration และ Idempotent Seed) ได้อย่างเป็นระเบียบ ตรงตามข้อกำหนด และมี Integration Tests 9 เคสที่ตรวจ Data Invariants ได้รัดกุม (role ของ assignee/performer, performer ≠ assignee, การกระจายตัว 0/1/หลาย actions, การดักไม่ให้ Resolved ticket ค้าง open actions) รันเทสต์ผ่าน 92/92
>
> **ข้อเสนอแนะ:**
>
> 1. **`ActionTaken.result` ควรเป็น Nullable (`String?`) ในระดับ Database** — ปัจจุบัน schema และ migration กำหนด `result String @db.Text` / `TEXT NOT NULL` แต่ค่าเริ่มต้นของ `status` คือ `PENDING` ซึ่งงานยังไม่เสร็จและยังไม่มีผลลัพธ์ หาก DB บังคับ NOT NULL จะทำให้ `POST /api/tickets/:id/actions-taken` ใน Issue #3 ล้มเหลวเมื่อไม่ส่ง `result` หรือต้องส่งข้อความหลอก แนะนำให้แก้ schema เป็น `result String? @db.Text`, เอา `NOT NULL` ออกจาก migration, และไปบังคับ required ใน Backend Validation เฉพาะเมื่อ `status === 'COMPLETED'`
> 2. **อัปเดตสถานะ PR-01 ใน `docs/lab-04/tests.md`** — แถว PR-01 ยังระบุ `Review in progress` แต่ PR #104 ถูก approve และ merge เข้า `lab4-staging` แล้ว (`f242eb3`) ควรปรับเป็น `Pass` หรือ `Merged`
> 3. **อัปเดต `docs/lab-04/reviewer.md`** — เพิ่มแถว PR #105 ในตาราง Master Table และเพิ่มหัวข้อบันทึกประวัติการตรวจทานของ PR-02 ให้เป็นไปตามลำดับจริงทีละ PR

#### 3.2.2 Author Response #1 (`jejaebubu`, commit `8750764`)

> ขอบคุณสำหรับรีวิวค่ะ แก้ไขครบทั้ง 3 จุดแล้วใน commit `8750764`
>
> 1. **`result` เป็น Nullable** — เปลี่ยน schema เป็น `result String? @db.Text` และสร้าง migration ใหม่ `20261031172848_lab04_actions_taken` ที่มีคอลัมน์ `"result" TEXT` (ไม่มี `NOT NULL`) แทนไฟล์เดิม เพื่อไม่ให้มี checksum ค้างจาก migration ที่ถูก apply ไปแล้ว
>    - ปรับ seed ให้ Action ที่ `PENDING`/`IN_PROGRESS` มี `result = null` จริง และงานที่ `COMPLETED`/`CANCELLED` มี `result` ครบ
>    - เพิ่มเทสต์ที่ 10 ตรวจ `is_nullable = YES`, open work มี `result = null`, และ finished work ต้องมี `result`
>    - เพิ่ม **BR-16** และ **AC-15** ใน `specification.md`, อัปเดต validation ใน `api-spec.md` (บังคับ `result` เฉพาะ `COMPLETED`) และ `ui-spec.md` (ดอกจันเฉพาะตอน `COMPLETED`), เพิ่ม **API-15** เป็น `Planned` สำหรับ Issue #3
> 2. **`tests.md`** — ปรับแถว PR-01 เป็น `Merged (PR #104)` และอัปเดต PR-02 เป็น `10 new + 83 existing = 93` พร้อมอ้างอิง PR #105
> 3. **`reviewer.md`** — เพิ่มแถว PR #105 ใน Master Table และเพิ่มหัวข้อ 3.2 พร้อม Review #1 / Author Response #1 ตามลำดับจริง
>
> ตรวจสอบซ้ำ: `npm run build` ผ่าน และ `npm test` ผ่าน **17 ไฟล์ / 93 เทสต์** (seed รันซ้ำได้ค่าเดิม) รบกวนช่วยตรวจอีกรอบนะคะ ขอบคุณค่ะ

#### 3.2.3 Review #2 — Approved (`titayaaa`, 2026-11-01 01:15 UTC+7)

Reviewer ตรวจสอบการแก้ไขใน commits `8750764` (nullable result) และ `7d9f326` (review trail) ยืนยันว่า:
1. `ActionTaken.result` เป็น `String?` / `TEXT` ที่ nullable จริง และ seed มี `result = null` สำหรับงาน `PENDING`/`IN_PROGRESS`
2. เพิ่มเทสต์ตรวจ nullability + data invariants ครบ เป็น 10 เคส (93/93)
3. `tests.md` และ `reviewer.md` สะท้อนสถานะจริงครบถ้วน

**คำวินิจฉัย**: **APPROVED** — Reviewer กด Merge PR #105 เข้าสู่สาขา `lab4-staging` เรียบร้อย (Merge SHA: `005b157`) — **Closes Issue #2**

---

### 3.3 PR-03: Actions Taken REST API, RBAC, and Status Validation (Issue #3)

#### 3.3.1 Review #1 — Request Changes (`titayaaa`, 2026-11-01)

> ภาพรวม PR #106 ยอดเยี่ยม ทั้ง RBAC, การดึง `performedById` จาก JWT เพื่อป้องกัน token spoofing, การตอบ `404` เพื่อซ่อนข้อมูลเมื่อ Requester เข้าถึงตั๋วคนอื่น และ Action Status Finite State Machine ตาม BR-14 รันเทสต์ 101/101 ผ่าน
>
> **ข้อเสนอแนะ:**
>
> 1. **อัปเดต Review Trail ของ PR #105 และเพิ่ม PR #106 ใน `reviewer.md`** — แถว PR-02 ยังเป็น `Request Changes → Pending re-review` ทั้งที่ merge แล้ว (`005b157`) ขอให้ปรับเป็น `Approved & Merged`, เพิ่มหัวข้อ `3.2.3 Review #2 — Approved` และเพิ่มหัวข้อ `3.3 PR-03` สำหรับ Issue #3
> 2. **ล้าง `followUpNote = null` เมื่อ `followUpRequired` ถูกปรับเป็น `false` ใน PATCH** — หาก Action เดิมมี note ค้างอยู่และ client ส่งมาแค่ `{ followUpRequired: false }` ต้องล้าง note เดิมเป็น `null` อัตโนมัติตาม BR-07/BR-04 เพื่อ Data Hygiene
> 3. **เพิ่ม Max Length Validation (nice to have)** — ตรวจ `actionDescription` ยาวเกิน 1000 ตัวอักษรและตอบ `400` ตาม `api-spec.md`

#### 3.3.2 Author Response #1 (`jejaebubu`, commit `782d54e`)

> ขอบคุณสำหรับรีวิวค่ะ แก้ไขครบทั้ง 3 จุดแล้วใน commit `782d54e`
>
> 1. **Review Trail** — ปรับแถว PR-02 เป็น `Request Changes → Approved & Merged` (merge `005b157`), เพิ่มหัวข้อ **3.2.3 Review #2 — Approved** และเพิ่มหัวข้อ **3.3 PR-03** พร้อม Review #1 / Author Response #1
> 2. **`followUpNote` Data Hygiene** — ใน PATCH หาก `followUpRequired === false` และ client ไม่ได้ส่ง `followUpNote` ใหม่มา ระบบจะตั้ง `followUpNote = null` อัตโนมัติ (BR-04/BR-07) พร้อมเทสต์ `API-03b` ตรวจว่าปิด follow-up แล้ว note เดิมถูกล้าง และการเปิดกลับโดยไม่มี note ใหม่ถูกปฏิเสธ `400`
> 3. **Max Length Validation** — `actionDescription` ต้องยาว 3–1000 ตัวอักษรทั้ง POST และ PATCH (เกิน 1000 → `400`) อัปเดต `api-spec.md` + BR-04 และเพิ่มเทสต์ payload 1001 ตัวอักษร
>
> ตรวจสอบซ้ำ: `npm run build` ผ่าน และ `npm test` ผ่าน **18 ไฟล์ / 102 เทสต์** (9 new + 93 existing) รบกวนช่วยตรวจอีกรอบนะคะ ขอบคุณค่ะ

#### 3.3.3 Review #2 — Approved (`titayaaa`, 2026-11-01 03:03 UTC+7)

> ### 🌟 ผลการตรวจทานรอบที่ 2 (Final Verification)
> ตรวจสอบการแก้ไขตาม commit `782d54e` และเอกสารใน `db7e326` ครบถ้วนสมบูรณ์ 100% ทุกประเด็นแล้วค่ะ:
>
> 1. **Data Hygiene ของ `followUpNote` ใน PATCH** — มีการดัก `if (body.followUpRequired === false && body.followUpNote === undefined)` แล้วรีเซ็ต `followUpNote = null` อัตโนมัติตาม BR-07 พร้อมเทสต์ `API-03b` ครบวงจร (สร้างพร้อม note → ปิด follow-up แล้ว note เป็น null → เปิดกลับโดยไม่มี note ได้ `400`)
> 2. **Max Length Validation (3–1000 chars)** — ดัก `description.length > 1000` ทั้ง `POST` และ `PATCH` ตอบ `400 Bad Request` อัปเดต `api-spec.md` และ BR-04 สอดคล้องกัน พร้อมเทสต์ payload 1001 ตัวอักษร
> 3. **Review Trail ครบถ้วน** — Master Table ปรับ PR-02 เป็น `Approved & Merged (merge 005b157)` และเพิ่ม Section 3.2.3 / 3.3 ตามลำดับ
> 4. **ชุดทดสอบผ่านสมบูรณ์** — 18 ไฟล์ / 102 เทสต์ (9 new + 93 existing) ผ่านทั้งหมด
>
> โค้ด REST API และเอกสารมีคุณภาพระดับ Production พร้อม Merge เข้าสู่ `lab4-staging` เพื่อเริ่ม Issue #4

**คำวินิจฉัย**: **APPROVED** — Reviewer กด Merge PR #106 เข้าสู่สาขา `lab4-staging` เรียบร้อย (Merge SHA: `23166db`) — **Closes Issue #3 (#95)**

---

### 3.4 PR-04: Actions Taken UI on Ticket Detail (Issue #4)

- **PR URL:** [GitHub #108](https://github.com/jejaebubu/toktickit/pull/108)
- **Branch:** `feature/lab04-issue4-actions-ui` → `lab4-staging`
- **Author:** `@jejaebubu`
- **Reviewer:** `@titayaaa`
- **Objective:** พัฒนาคอมโพเนนต์ `ActionsTaken.tsx` สำหรับแสดงประวัติ Actions Taken เรียงลำดับเวลา (`actionDateTime DESC`), ฟอร์มเพิ่ม/แก้ไขสำหรับ IT Staff และ Administrator, การซ่อนปุ่มจัดการสำหรับ Requester (Read-Only), Dynamic Follow-up Note Toggle, Quick Action ปุ่ม Complete/Cancel, การดึงรายชื่อเจ้าหน้าที่ที่ active จาก `GET /api/users/assignable`, และการซิงก์สถานะกลับไปยังหน้า Ticket Detail (`onActionsChange`) เพื่อรองรับ Resolution Gate ใน Issue #5

#### 3.4.1 Review #1 — Request Changes (`titayaaa`, 2026-11-01)

> ### 🌟 ภาพรวมการประเมิน (Executive Summary)
> PR #108 พัฒนาคอมโพเนนต์ `ActionsTaken.tsx` ได้สวยงาม สะอาดตา และวางโครงสร้างได้ตรงตามข้อกำหนดของ Lab 4 เป็นอย่างดีค่ะ ชื่นชมที่มีการทำ Dynamic Follow-up Toggle, การซ่อนปุ่ม Create/Edit สำหรับ Requester, การจัดการ Loading state ระหว่างบันทึก, การทำ Quick Action Complete/Cancel ได้อย่างรวดเร็ว ตลอดจนเขียนเทสต์ครอบคลุมทั้ง Component UI (4 ข้อ) และ API เพิ่มเติม (2 ข้อ) รันเทสต์ผ่านครบถ้วน 187/187 เทสต์ค่ะ 👍
> เพื่อให้โค้ดมีความสมบูรณ์แบบระดับ Production และไม่ส่งผลกระทบต่อ Issue #5 (Resolution Gate) ขอฝากปรับปรุง 3 จุดสำคัญ และจุดเก็บตกเล็กน้อยดังนี้ค่ะ:
>
> ---
>
> ### 🛑 จุดที่ต้องแก้ไขก่อน Merge (Required Changes)
>
> #### 1. เพิ่มหัวข้อ `### 3.4 PR-04` ใน `docs/lab-04/reviewer.md` (Document Trail)
> - ใน Master PR Table (Section 2) มีการเพิ่มแถว PR #108 เรียบร้อยแล้ว แต่ใน **Section 3 (Full Review Trail) ยังขาดหัวข้อ `### 3.4 PR-04: Actions Taken UI on Ticket Detail (Issue #4)`** ทำให้ไม่มีบันทึกรายละเอียดการตรวจทานของ PR นี้ค่ะ
> - รบกวนเพิ่มหัวข้อ 3.4 พร้อมระบุ Branch, Target, วัตถุประสงค์ และเตรียมพื้นที่สำหรับบันทึกผลการรีวิวด้วยนะคะ
>
> #### 2. ส่ง Callback `onActionsChange` ใน `StaffTicketDetail.tsx` และ `TicketDetail.tsx` (State Desynchronization)
> - ใน `ActionsTaken.tsx` มีการประกาศ prop `onActionsChange?: (actions: ActionTaken[]) => void` และเรียกใช้งานใน `updateItems` ดีแล้ว แต่ในจุดเรียกใช้งานที่ `StaffTicketDetail.tsx` (บรรทัด 429) และ `TicketDetail.tsx` (บรรทัด 178) ใส่เพียง:
>   ```tsx
>   <ActionsTaken ticketId={ticket.id} actions={ticket.actionsTaken} />
>   ```
> - การไม่ส่ง `onActionsChange` ทำให้เมื่อเจ้าหน้าที่กด Add, Edit หรือกด Quick Complete Action สำเร็จ ข้อมูลใน `ticket.actionsTaken` ของหน้าแม่จะไม่อัปเดตตาม ซึ่งจะทำให้เกิดปัญหาใน Issue #5 (Resolution Gate) ทันที เพราะหน้าแม่จะไม่ทราบว่า Action ถูกเคลียร์เสร็จแล้ว จนกว่าจะกด Refresh หน้าจอ
> - **วิธีแก้:** รบกวนส่ง callback อัปเดต state แม่:
>   ```tsx
>   <ActionsTaken
>     ticketId={ticket.id}
>     actions={ticket.actionsTaken}
>     onActionsChange={(updatedActions) =>
>       setTicket((prev) => (prev ? { ...prev, actionsTaken: updatedActions } : prev))
>     }
>   />
>   ```
>
> #### 3. ปรับสี Status Badge ของ `CANCELLED` และ `COMPLETED` ให้ตรงกับ Zen Green Tokens
> - ใน `docs/lab-04/ui-spec.md` §1 กำหนดว่าสถานะ `CANCELLED` ต้องใช้คู่สี soft red:
>   - `--action-cancelled-bg: #fef2f2`, `--action-cancelled-text: #991b1b`
>   - `--action-completed-bg: #f0fdf4`, `--action-completed-text: #166534`
> - ใน `ACTION_STATUS_META` ของ `ActionsTaken.tsx` ปัจจุบันใช้สีเทา (`#E5E7EB` / `#374151`) สำหรับ Cancelled และ `#C6F6D5` / `#22543D` สำหรับ Completed ฝากปรับให้ตรงกับ Design System Tokens ของแลปด้วยนะคะ
>
> ### 💡 ข้อเสนอแนะเพิ่มเติม (Minor Suggestions)
> - **Client-side Validation & MaxLength:**
>   - ในฟังก์ชัน `validate()` แนะนำให้ตรวจ `result` เมื่อสถานะเป็น `COMPLETED` ว่าต้องมีความยาวอย่างน้อย 2 ตัวอักษร (`result.trim().length >= 2`) เพื่อให้ตรงกับ Validation ของ Backend (2–1000 ตัวอักษร) ป้องกันไม่ให้เกิด Error 400 จากเซิร์ฟเวอร์
>   - เพิ่ม attribute `maxLength={1000}` ให้กับ `action-description` และ `action-result`, และ `maxLength={500}` ให้กับ `action-followup-note` และ `action-attachment-notes`
> - **Accessibility (A11Y):**
>   - เพิ่ม `role="alert"` หรือ `aria-live="polite"` ให้กับกล่องข้อความ error ใต้ฟิลด์อินพุต เพื่อให้ Screen Reader แจ้งเตือนผู้ใช้ได้ถูกต้อง
>   - ครอบ emoji ในป้ายสถานะ (`⏳`, `🔧`, `✅`, `⛔`) ด้วย `<span aria-hidden="true">` เพื่อไม่ให้ Screen Reader อ่านออกเสียง emoji ซ้ำซ้อน
> - **Safe Error Response ใน `server/src/app.ts`:**
>   - ใน `GET /api/users/assignable` บล็อก `catch` ไม่ควรส่ง `message: err?.message` ออกไปใน 500 response ตามมาตรฐาน SAFE-01 แนะนำให้ตอบเพียง `{ error: "Failed to fetch assignable staff" }`
> - **Wording ใน Section 4.1.7 ของ `reviewer.md`:**
>   - ข้อความเดิมระบุว่า `"Reviewer อนุมัติและผู้เขียน merge PR #75 เข้า lab4-staging เรียบร้อย"` แนะนำปรับเป็น `"Reviewer (@jejaebubu) อนุมัติและเป็นผู้กด Merge PR #75"` เพื่อให้ตรงกับข้อกำหนดวิชาที่ห้าม merge PR ของตนเองค่ะ

#### 3.4.2 Author Response #1 (`jejaebubu`, commit `ce25314`)

> ขอบคุณสำหรับรีวิวที่ละเอียดและครบถ้วนมากค่ะ แก้ไขครบทั้ง 3 Required Changes และ Minor Suggestions ทั้งหมดแล้วใน commit `ce25314`:
>
> 1. **เพิ่มหัวข้อ `### 3.4 PR-04` ใน `docs/lab-04/reviewer.md`** — เพิ่มบันทึก Branch, Target, วัตถุประสงค์, ข้อความรีวิวรอบที่ 1 และคำตอบของผู้เขียนใน Section 3.4 พร้อมอัปเดตตาราง Master PR Table ใน Section 2
> 2. **ส่ง Callback `onActionsChange` ใน `StaffTicketDetail.tsx` และ `TicketDetail.tsx`** — ผูก `onActionsChange={(updatedActions) => setTicket((prev) => (prev ? { ...prev, actionsTaken: updatedActions } : prev))}` ทั้งสองหน้า เพื่อให้ `ticket.actionsTaken` บน parent state ซิงก์ทันทีเมื่อเพิ่ม/แก้ไข/เปลี่ยนสถานะ Action เตรียมพร้อมสำหรับ Resolution Gate ใน Issue #5
> 3. **ปรับสี Status Badge ใน `ActionsTaken.tsx` ให้ตรงกับ Zen Green Tokens (`ui-spec.md` §1)** — ปรับ `COMPLETED` เป็น `backgroundColor: "#f0fdf4", color: "#166534"` และ `CANCELLED` เป็น `backgroundColor: "#fef2f2", color: "#991b1b"`
> 4. **Client-side Validation & `maxLength`** — ปรับ `validate()` ให้ตรวจ `form.result.trim().length < 2` เมื่อสถานะเป็น `COMPLETED` และเพิ่ม `maxLength={1000}` บน `action-description`, `action-result` รวมถึง `maxLength={500}` บน `action-followup-note`, `action-attachment-notes`
> 5. **Accessibility (A11Y)** — เพิ่ม `role="alert"` ให้กับข้อความ error ใต้ฟิลด์ทุกจุด (`action-date-error`, `action-assignee-error`, `action-description-error`, `action-result-error`, `action-followup-note-error`) และครอบ emoji ในป้ายสถานะ (`⏳`, `🔧`, `✅`, `⛔`) ด้วย `<span aria-hidden="true">`
> 6. **Safe Error Response (`SAFE-01`)** — ปรับบล็อก `catch` ของ `GET /api/users/assignable` ใน `server/src/app.ts` ให้ตอบกลับเพียง `{ error: "Failed to fetch assignable staff" }` โดยไม่เปิดเผย `err?.message`
> 7. **Wording ใน Section 4.1.7 ของ `reviewer.md`** — ปรับเป็น `"Reviewer (@jejaebubu) อนุมัติและเป็นผู้กด Merge PR #75 เข้า lab4-staging เรียบร้อย"` ตามกติกาห้าม merge PR ของตนเอง
>
> รบกวนช่วยตรวจซ้ำอีกรอบนะคะ ขอบคุณมากค่ะ

#### 3.4.3 Review #2 — Approved (`titayaaa`, 2026-11-01 17:51 UTC+7)

> ### ✅ การตรวจประเมินรอบที่ 2 (Round 2 Review — APPROVED)
>
> ขอบคุณ @jejaebubu ที่ดำเนินการแก้ไขปรับปรุงครบถ้วนทั้ง 3 ประเด็นหลัก (Required Changes) และข้อเสนอแนะเพิ่มเติม (Minor Suggestions) อย่างรวดเร็วและประณีตมากใน commits `ce25314` และ `3f029b7` ค่ะ:
>
> 1. **Section 3.4 PR-04 ใน `docs/lab-04/reviewer.md`**: บันทึกข้อมูล Branch, Target, วัตถุประสงค์การทดสอบ, ข้อความรีวิวรอบที่ 1 และคำตอบของผู้เขียนครบถ้วน พร้อมอัปเดตสถานะใน Master PR Table เรียบร้อย
> 2. **State Synchronization (`onActionsChange`)**: ผูก callback `onActionsChange` ใน `StaffTicketDetail.tsx` และ `TicketDetail.tsx` ไปยัง parent `setTicket` ครบถ้วน ทำให้ state ของ `ticket.actionsTaken` บนหน้าแม่ซิงก์แบบ real-time พร้อมสำหรับการตรวจสอบ Resolution Gate ใน Issue #5
> 3. **Zen Green Tokens Alignment**: สีของ Status Badge ปรับตรงตาม Design System Token (`#f0fdf4`/`#166534` สำหรับ COMPLETED และ `#fef2f2`/`#991b1b` สำหรับ CANCELLED)
> 4. **Validation & MaxLength**: ปรับ `validate()` ให้ตรวจสอบผลลัพธ์อย่างน้อย 2 ตัวอักษรเมื่อสถานะเป็น COMPLETED และใส่ `maxLength` ครบทุก input/textarea ป้องกัน buffer overflow และ API 400 Bad Request
> 5. **Accessibility (A11Y)**: เพิ่ม `role="alert"` ให้กับข้อความ error ทุกจุด และครอบ icon emoji ด้วย `<span aria-hidden="true">`
> 6. **Safe Error Handling (SAFE-01)**: บล็อก catch ของ `GET /api/users/assignable` ตอบกลับเฉพาะ `{ error: "Failed to fetch assignable staff" }` โดยไม่รั่วไหล internal stack trace หรือข้อความ error ดิบ
> 7. **Documentation Wording**: ปรับปรุงถ้อยคำใน Section 4.1.7 ให้ถูกต้องตามข้อกำหนดการ Merge โดย Reviewer
>
> ผลการทดสอบผ่านครบ 187/187 เทสต์ (Server 104 + Client 83) โค้ดมีความพร้อมระดับ Production สมบูรณ์แบบ ขออนุมัติ (Approve) และดำเนินการกด Merge เข้าสู่ `lab4-staging` ให้ทันทีค่ะ 🎉

**คำวินิจฉัย**: **APPROVED** — Reviewer กด Merge PR #108 เข้าสู่สาขา `lab4-staging` เรียบร้อย (Merge SHA: `2425b2d`) — **Closes Issue #4**

---

### 3.5 PR-05: Ticket Workflow State Machine, Resolution Gate, and Transition Enforcement (Issue #5)

- **PR URL:** [GitHub #109](https://github.com/jejaebubu/toktickit/pull/109)
- **Branch:** `feature/lab04-issue5-workflow` → `lab4-staging`
- **Author:** `@jejaebubu`
- **Reviewer:** `@titayaaa`
- **Objective:** บังคับใช้ Ticket Status Transition Matrix (`BR-08` / `AC-07`), บังคับใช้ Resolution Gate ที่ฝั่ง Backend (`409 Conflict` `UNRESOLVED_ACTIONS_EXIST` เมื่อพยายาม Resolve ตั๋วที่ยังมี Action Taken สถานะ `PENDING` หรือ `IN_PROGRESS` ตาม `BR-15` / `AC-13`) และฝั่ง UI (ปุ่มเตือน `"N action(s) still open"`, Modal ยืนยันพร้อมรายการ Action ที่ค้าง), รองรับการตรวจจับ Stale Update (`expectedUpdatedAt` / `If-Unmodified-Since` → `409 Conflict` `STALE_UPDATE` ตาม `BR-12` / `AC-09`), และเพิ่มส่วนแจ้งเจตนา `"My problem is resolved"` พร้อมป้าย Advisory `"Requester indicated problem resolved - Pending Staff Review"` สำหรับ Requester (`BR-09` / `AC-08`)

#### 3.5.1 Review #1 — Request Changes (`titayaaa`, 2026-11-01)

> ขอบคุณสำหรับ PR #109 ที่ครอบคลุมการทำงานของ Ticket Workflow, Resolution Gate และ Optimistic Concurrency Check สำหรับ **Issue #5 (PR-05)** ได้อย่างเป็นระบบมากค่ะ โดยเฉพาะ:
> - การวางโครงสร้าง State Transition ควบคุมทั้งปุ่มใน UI และ Guard ใน Backend
> - การทำ Resolution Gate Confirmation Modal เมื่อยังมี Action ค้าง (`PENDING`/`IN_PROGRESS`) พร้อม fallback ลอง resolve เพื่อรับ error 409
> - การดักจับ Concurrency Mismatch (`STALE_UPDATE`) ทั้งจาก Body `expectedUpdatedAt` และ Header `If-Unmodified-Since`
> - ชุดทดสอบครบทั้ง Server (108 tests) และ Client (87 tests) รวม 195/195 tests ผ่าน 100%
>
> อย่างไรก็ตาม จากการตรวจสอบอย่างละเอียดเปรียบเทียบกับข้อกำหนดใน `specification.md`, `api-spec.md` และหลักความปลอดภัยของระบบ พบจุดบกพร่องและข้อขัดแย้งกับสเปกที่จำเป็นต้องปรับปรุงแก้ไข 3 จุดสำคัญ (Required Changes) และข้อเสนอแนะเพิ่มเติมเพื่อความสมบูรณ์แบบ (Minor Suggestions) ดังนี้ค่ะ:
>
> ---
>
> ### 🛑 1. ประเด็นที่ต้องแก้ไขให้ถูกต้อง (Required Changes — Blocking)
>
> #### 1.1 State Transition Matrix: สถานะ `Open` ข้ามไป `Resolved` โดยตรงไม่ได้ และสถานะ `Pending` หายไป
> - **ไฟล์ที่พบ:** `server/src/app.ts` และ `client/src/components/StaffTicketDetail.tsx`
> - **ปัญหา:**
>   1. ตั๋วที่อยู่ในสถานะ `Open` ห้ามข้ามไป `Resolved` โดยตรง งานจะต้องถูกส่งเข้าสู่สถานะปฏิบัติงานจริงก่อน (`In Progress`, `Waiting for Requester` หรือ `Pending`) ดังนั้นในอาร์เรย์ของ `Open` จะต้องไม่มี `"Resolved"`
>   2. สถานะ **`Pending`** หายไปจาก Matrix ส่งผลให้หากมีตั๋วค้างอยู่ในสถานะ `Pending` จะถูกล็อกตายกลายเป็น Terminal state ทันที
> - **แนวทางแก้ไข:**
>   - ปรับ `Open` เป็น `["In Progress", "Waiting for Requester", "Pending", "Cancelled"]`
>   - เพิ่มคีย์ `"Pending": ["In Progress", "Waiting for Requester", "Resolved", "Cancelled"]` พร้อมอนุญาตให้ `In Progress`, `Waiting for Requester` และ `Reopened` ย้ายไป `Pending` ได้
>
> #### 1.2 Side-effect การเปลี่ยนสถานะตั๋วเมื่อ Requester แจ้งว่าปัญหาได้รับการแก้ไข
> - **ไฟล์ที่พบ:** `server/src/app.ts`
> - **ปัญหา:** การใส่เงื่อนไข `nextStatusForRequester` เปลี่ยนสถานะเป็น `"Waiting for Requester"` เป็น side-effect ที่ขัดกับข้อกำหนดที่ระบุว่าการแจ้งของ Requester เป็นเพียง advisory และต้องไม่เปลี่ยนสถานะตั๋ว
> - **แนวทางแก้ไข:** ในการอัปเดต advisory flag ของ Requester ให้ส่งเฉพาะ `data: { requesterIndicatedResolved: true }` คงสถานะเดิมของตั๋วไว้ 100%
>
> #### 1.3 ป้องกันข้อมูลภายในรั่วไหลในบล็อก 500 Catch (ตามกฎ SAFE-01)
> - **ไฟล์ที่พบ:** `server/src/app.ts`
> - **แนวทางแก้ไข:** บันทึก error ลง `console.error` ฝั่งเซิร์ฟเวอร์ และส่งคืนเฉพาะ `{ error: "Internal Server Error", message: "Failed to update ticket." }` โดยไม่ส่ง `err?.message`
>
> ### 💡 2. ข้อเสนอแนะเพิ่มเติม & จุดเก็บตก (Minor Suggestions)
> - **HTTP Status Code สำหรับ Transition ที่ไม่อนุญาต:** ตรวจสอบความสอดคล้องกับเอกสารสัญญาของโปรเจกต์ (`400 Bad Request` ตาม `specification.md` AC-07, `api-spec.md` §4.1 และ `tests.md` API-06)
> - **Precision ของ Header `If-Unmodified-Since`:** ตามมาตรฐาน RFC 7231 เวลาใน HTTP Header มีความละเอียดระดับวินาที แนะนำให้ปัดเศษเทียบระดับวินาที `Math.floor(expectedTime / 1000) !== Math.floor(actualTime / 1000)` เมื่อรับมาจาก Header
> - **การแสดงผล Advisory Banner บนตั๋วที่ Resolve/Closed ไปแล้ว:** ใน `TicketDetail.tsx` และ `StaffTicketDetail.tsx` แนะนำให้เพิ่มเงื่อนไข `!["Resolved", "Closed", "Cancelled"].includes(ticket.status)` เพื่อไม่ให้ข้อความ `"Pending Staff Review"` ค้างบนตั๋วที่จบงานไปแล้ว
> - **UX ของ Stale Update Modal:** เพิ่มปุ่ม `"Dismiss"` ใน `StaffTicketDetail.tsx` เพื่อให้เจ้าหน้าที่สามารถปิด Modal ชั่วคราวไปคัดลอกข้อความ Note/Comment ที่กำลังพิมพ์ค้างไว้ได้
> - **สีของปุ่ม `Cancelled` ใน Workflow Action Bar:** เปลี่ยนจาก `btn-outline-success` เป็น `btn-outline-danger` เพื่อความชัดเจนของ UI

#### 3.5.2 Author Response #1 (`jejaebubu` — Commit `45b424d`)

> ขอบคุณสำหรับรีวิวที่ละเอียดและรอบคอบมากค่ะ แก้ไขครบทั้ง 3 Required Changes และ Minor Suggestions ทั้งหมดเรียบร้อยแล้วค่ะ:
>
> 1. **ปรับปรุง `TICKET_STATUS_TRANSITIONS` (`server/src/app.ts`, `StaffTicketDetail.tsx`, `specification.md`)**:
>    - นำ `"Resolved"` ออกจากสถานะถัดไปของ `Open` (`Open: ["In Progress", "Waiting for Requester", "Pending", "Cancelled"]`) เพื่อบังคับให้ตั๋วต้องเข้าสู่สถานะปฏิบัติงานจริงก่อนจึงจะ Resolve ได้ พร้อมเพิ่มเทสต์ยืนยันว่า `Open -> Resolved` ถูกปฏิเสธด้วย `INVALID_STATUS_TRANSITION`
>    - เพิ่มสถานะ `"Pending"` ใน `TICKET_STATUSES` และ `TICKET_STATUS_TRANSITIONS` (`Pending: ["In Progress", "Waiting for Requester", "Resolved", "Cancelled"]`) และอนุญาตให้ย้ายไป `Pending` ได้จาก `Open`, `In Progress`, `Waiting for Requester`, `Reopened`
> 2. **ตัด Side-effect การเปลี่ยนสถานะเมื่อ Requester แจ้งเจตนา (`server/src/app.ts`)**:
>    - ปรับการอัปเดตเมื่อ Requester ส่ง `{ requesterIndicatedResolved: true }` ให้ส่งเพียง `data: { requesterIndicatedResolved: true }` โดยไม่แก้ไขฟิลด์ `status` ของตั๋ว 100%
> 3. **Safe Error Response ตามเกณฑ์ `SAFE-01` (`server/src/app.ts`)**:
>    - ในบล็อก `catch` ของ `handleTicketPatch` เปลี่ยนเป็น `console.error("Failed to update ticket:", err)` และส่งคืนเฉพาะ `{ error: "Internal Server Error", message: "Failed to update ticket." }` โดยไม่ส่ง `err?.message`
> 4. **Minor Suggestions ที่ปรับปรุงเพิ่มเติมครบทุกข้อ**:
>    - **RFC 7231 `If-Unmodified-Since` Precision**: ปรับการเทียบเวลาเมื่อรับค่าจาก Header `If-Unmodified-Since` ให้เทียบระดับวินาที (`Math.floor(expectedTime / 1000) !== Math.floor(actualTime / 1000)`) พร้อมเพิ่มเทสต์ส่ง `updatedAt.toUTCString()` ใน `API-08`
>    - **ซ่อน Advisory Banner เมื่อตั๋วอยู่ในสถานะสิ้นสุด**: เพิ่มเงื่อนไข `!["Resolved", "Closed", "Cancelled"].includes(ticket.status)` ทั้งใน `StaffTicketDetail.tsx` และ `TicketDetail.tsx`
>    - **เพิ่มปุ่ม `Dismiss` ใน Stale Update Modal**: เพิ่มปุ่ม `Dismiss` (`data-testid="stale-update-dismiss"`) คู่กับปุ่ม `Refresh Ticket` ใน `StaffTicketDetail.tsx`
>    - **สีปุ่ม `Cancelled` ใน Workflow Action Bar**: เปลี่ยนคลาสของปุ่ม `Cancelled` เป็น `btn-outline-danger`
>    - *(หมายเหตุเรื่อง Status Code ของ Invalid Transition: ในเอกสารสัญญาของโปรเจกต์นี้ `docs/lab-04/specification.md` AC-07, `api-spec.md` §4.1 และ `tests.md` API-06 กำหนดให้ Invalid Transition ตอบ `400 Bad Request` ส่วน `422` ใช้สำหรับ Invalid Assignee ตาม AC-12 จึงคง `400 Bad Request` ไว้ให้ตรงกับสเปกของรีโปนี้ค่ะ)*
>
> รบกวนช่วยตรวจซ้ำอีกรอบนะคะ ขอบคุณมากค่ะ

#### 3.5.3 Review #2 — Approved (`titayaaa`, 2026-11-01 18:57 UTC+7)

> ขอบคุณ @jejaebubu ที่ดำเนินการแก้ไขปรับปรุงครบถ้วนสมบูรณ์ทั้ง 3 Required Changes และ Minor Suggestions ทั้งหมดใน commits `45b424d` และ `8f8c8e6` อย่างรอบคอบและรวดเร็วมากค่ะ ตรวจสอบโค้ดและชุดทดสอบซ้ำอย่างละเอียดแล้ว:
> 1. **State Transition Matrix สมบูรณ์ 100%**:
>    - นำ `"Resolved"` ออกจากสถานะถัดไปของ `Open` เพื่อบังคับให้ตั๋วต้องเข้าสู่สถานะปฏิบัติงานจริงก่อน จึงจะกด Resolve ได้
>    - เพิ่มสถานะ `"Pending"` ใน `TICKET_STATUSES` และ `TICKET_STATUS_TRANSITIONS` ครบถ้วนทั้ง backend, frontend และเอกสาร `specification.md`
>    - เพิ่มเทสต์ตรวจสอบการปฏิเสธ `Open -> Resolved` ด้วย `400 INVALID_STATUS_TRANSITION` ชัดเจน
> 2. **ขจัด Side-effect ใน Requester Advisory สำเร็จ**:
>    - เมื่อ Requester แจ้งว่าปัญหาได้รับการแก้ไข ระบบบันทึกเฉพาะ `requesterIndicatedResolved: true` โดยคงสถานะเดิมของตั๋วไว้ 100%
>    - ปรับแก้เทสต์เดิมใน `staff-ticket-detail.api.test.ts` และเพิ่มการยืนยันใน `ticket-workflow.api.test.ts` (API-07) ครบถ้วน
> 3. **ความปลอดภัยตามเกณฑ์ SAFE-01**:
>    - บล็อก `catch` ของ `handleTicketPatch` บันทึก log ภายในเซิร์ฟเวอร์ และตอบกลับด้วย generic error ไม่ส่ง `err?.message` ออกสู่ภายนอก
> 4. **Minor Suggestions & UX Polish**:
>    - คำนวณ RFC 7231 `If-Unmodified-Since` ปัดเศษระดับวินาทีอย่างถูกต้อง และรองรับ `toUTCString()`
>    - ซ่อน Advisory Banner เมื่อตั๋วอยู่ในสถานะ Resolved / Closed / Cancelled บนทั้งสองมุมมอง
>    - เพิ่มปุ่ม Dismiss บน Stale Update Modal เพื่อป้องกันข้อมูลที่เจ้าหน้าที่กำลังพิมพ์สูญหาย
>    - ปรับสีปุ่ม Cancelled เป็น `btn-outline-danger` ตรงตาม Semantics
>    - คำชี้แจงเรื่อง Status Code 400 สำหรับ Invalid Status Transition สอดคล้องกับ Engineering Contract ใน `specification.md` และ `api-spec.md` เป็นอย่างดี
>
> ผลการรันเทสต์ผ่านครบ 195/195 เทสต์ (Server 108 + Client 87) โค้ดมีคุณภาพสูงและพร้อมสำหรับการใช้งานจริง ขออนุมัติ (Approve) และดำเนินการกด Merge เข้าสู่ `lab4-staging` ให้เรียบร้อยค่ะ

**คำวินิจฉัย**: **APPROVED** — Reviewer กด Merge PR #109 เข้าสู่สาขา `lab4-staging` เรียบร้อย (Merge SHA: `468a7ca`) — **Closes Issue #5**

---

### 3.6 PR-06: IT Staff Dashboard API, Summary Metrics Calculation, and UI Screen (Issue #6)

- **PR URL:** [GitHub #110](https://github.com/jejaebubu/toktickit/pull/110)
- **Branch:** `feature/lab04-issue6-staff-dashboard` → `lab4-staging`
- **Author:** `@jejaebubu`
- **Reviewer:** `@titayaaa`
- **Objective:** พัฒนา `GET /api/dashboard/staff` สำหรับ IT Staff และ Administrator (ปฏิเสธ Requester ด้วย `403 Forbidden` ตาม `AC-06`), คำนวณตัวชี้วัดเชิงปฏิบัติการแบบเรียลไทม์ (`new`, `open`, `inProgress`, `waitingForRequester`, และ `myAssigned` เฉพาะตั๋วที่ยังไม่ปิดที่เป็นของตนเองตาม `BR-10`), ส่งคืน `recentTickets` 5 รายการล่าสุดพร้อม `quickActions`, รองรับพารามิเตอร์ `ownerId=me` บน `GET /api/tickets`, และสร้างคอมโพเนนต์ `StaffDashboard.tsx` พร้อมการ์ดตัวชี้วัด 5 ใบที่คลิก Drill-down ไปยัง `StaffTicketQueue` ตามฟิลเตอร์ได้ (`AC-04`, `FR-08`, `FR-10`)

#### 3.6.1 Review #1 — Request Changes (`titayaaa`, 2026-11-02)

> ขอบคุณสำหรับ PR #110 ที่พัฒนาโมดูล IT Staff Dashboard (Issue #6) ได้อย่างครบครัน สวยงาม และออกแบบการใช้งานได้ดีมากค่ะ ภาพรวมของการ์ดสรุปตัวชี้วัด 5 ใบ, ระบบ Drill-down กรองตั๋วตามสถานะอัตโนมัติ, การรองรับ Responsive สลับระหว่าง Desktop Table และ Mobile Cards, ตลอดจนชุดทดสอบใหม่ทั้ง 6 เคส (API-09, API-10, UI-04, STYLE-01, RESP-01) เขียนได้อย่างเป็นระบบมากค่ะ
>
> อย่างไรก็ตาม จากการตรวจทานโค้ดอย่างละเอียดเปรียบเทียบกับ flow การทำงานของแอปพลิเคชันและเอกสารของโปรเจกต์ พบจุดบกพร่องระดับ Blocking ที่ทำให้เกิด Regression บนหน้าจอของผู้ใช้ Requester และจุดที่ควรปรับปรุงเพื่อความชัดเจน 3 ข้อดังนี้ค่ะ:
>
> ---
>
> ### 🔴 1. ประเด็นที่ต้องแก้ไขก่อน Merge (Required Changes — Blocking)
>
> #### 1.1 Requester Navbar ทำให้เกิดหน้าจอว่างเปล่า (Blank Screen Regression)
> - **ไฟล์ที่พบ:** `client/src/components/Header.tsx` และ `client/src/App.tsx`
> - **ปัญหา:** ใน `Header.tsx` มีการเพิ่ม `{ id: "dashboard", label: "Dashboard", matches: ["dashboard"] }` ให้กับเมนูของ `REQUESTER` แต่ใน `App.tsx` ฟังก์ชัน `RequesterViews` ยังไม่มีการดักจับ `activeView === "dashboard"` (เนื่องจาก Requester Dashboard เป็นขอบเขตของ Issue #7 / PR-07)
> - **แนวทางแก้ไข:** นำ `{ id: "dashboard", label: "Dashboard", matches: ["dashboard"] }` ออกจากอาเรย์ `REQUESTER` ใน `NAV_BY_ROLE` ของ `Header.tsx` โดยให้คงไว้เฉพาะสำหรับ `IT_STAFF` และ `ADMINISTRATOR` เท่านั้น จนกว่าจะเริ่มพัฒนา Issue #7 ใน PR ถัดไปค่ะ
>
> ### 🟠 2. ประเด็นที่ควรปรับปรุงเพื่อความถูกต้องของ UI (Should Fix)
>
> #### 2.1 หัวข้อแผง "My Recent Tickets" ขัดแย้งกับขอบเขตข้อมูลจริงของ Query
> - **ไฟล์ที่พบ:** `client/src/components/StaffDashboard.tsx` และ `server/src/app.ts`
> - **แนวทางแก้ไข:** ปรับเปลี่ยนหัวข้อแผงใน `StaffDashboard.tsx` ให้ตรงกับข้อเท็จจริง เช่น เป็น `"Recent Queue Tickets"` หรือ `"Recent Service Desk Tickets"` เพื่อสื่อความหมายที่ชัดเจนและสอดคล้องกับ subtitle ค่ะ
>
> ### 🟡 3. จุดเก็บตกเอกสารการบันทึกการรีวิว (Minor Doc Polish)
>
> #### 3.1 ลิงก์และข้อมูล PR URL ใน `docs/lab-04/reviewer.md`
> - ใน Master PR Table (Section 2) แถวของ `PR-06` แนะนำให้ใส่ลิงก์ GitHub PR `[GitHub #110](https://github.com/jejaebubu/toktickit/pull/110)`
> - ในหัวข้อ Section 3.6 เพิ่ม `- **PR URL:** https://github.com/jejaebubu/toktickit/pull/110`

#### 3.6.2 Author Response #1 (`jejaebubu`)

> ขอบคุณสำหรับรีวิวที่ละเอียดและช่วยตรวจพบจุด Regression ของเมนู Requester ค่ะ แก้ไขครบทั้ง 3 ประเด็นเรียบร้อยแล้วค่ะ:
>
> 1. **นำเมนู `Dashboard` ออกจาก `REQUESTER` ใน `Header.tsx`**:
>    - คงเมนู `Dashboard` ไว้เฉพาะสำหรับ `IT_STAFF` และ `ADMINISTRATOR` ใน PR นี้ เพื่อไม่ให้ผู้ใช้ `REQUESTER` กดแล้วเจอหน้าว่างก่อนพัฒนา Issue #7 (Requester Dashboard)
> 2. **ปรับหัวข้อแผงตั๋วล่าสุดใน `StaffDashboard.tsx` เป็น `"Recent Queue Tickets"`**:
>    - เปลี่ยนจาก `"My Recent Tickets"` เป็น `"Recent Queue Tickets"` ให้ตรงกับข้อมูลจริงที่ดึงตั๋วอัปเดตล่าสุด 5 รายการของคิวบริการทั้งหมด พร้อมเพิ่ม assertion ยืนยันใน `StaffDashboard.test.tsx`
> 3. **อัปเดตลิงก์ PR #110 และบันทึกการรีวิวใน `docs/lab-04/reviewer.md`**:
>    - เพิ่มลิงก์ `[GitHub #110](https://github.com/jejaebubu/toktickit/pull/110)` ในตาราง Master PR Table และในหัวข้อ Section `3.6 PR-06` พร้อมบันทึกผลการรีวิวรอบที่ 1 และการแก้ไขครบถ้วนค่ะ
>
> รบกวนช่วยตรวจทานซ้ำอีกครั้งนะคะ ขอบคุณมากค่ะ

---

## 4. Full Review Trail — Partner Repository PR #75 (`titayaaa/toktickit`)

### 4.1 PR #75: Issue 27: Sprint 4 Engineering Contract & Specification (`docs/lab-04/`)

- **PR URL:** [titayaaa/toktickit#75](https://github.com/titayaaa/toktickit/pull/75)
- **Author:** `@titayaaa` (ฑิตญา ผ่องสกุล)
- **Reviewer:** `@jejaebubu` (GitHub: [jejaebubu](https://github.com/jejaebubu))
- **Target Branch:** `lab4-staging`
- **Current Status:** Approved & Merged (merge commit `4a555671b13ecee7cabcae75dd76e3ed9dc77e3d`, 2026-10-31 19:58 UTC)
- **Latest Reviewed Commit:** `f144a1aea480ffb0c6c8d93cdf2381d31a327e2d`

#### 4.1.1 Review #1 — Changes Requested (`jejaebubu`, 2026-10-31)

**Verdict:** Changes Requested

**Review Comments:**

> รีวิวรอบแรกนะคะ โดยรวมทำมาค่อนข้างครบและอ่านง่ายเลย โดยเฉพาะ traceability matrix กับ design tokens ทำไว้ดีแล้วค่ะ
>
> จุดที่เจอส่วนใหญ่ไม่ได้เป็นปัญหาเรื่องเนื้อหา แต่เป็นบางส่วนในเอกสารที่ยังไม่ตรงกับโค้ดจริงและ requirement ใน handout ค่ะ
>
> ขอ Changes ก่อน merge นะคะ เพราะยังมีบางจุดที่ถ้า implement ตามเอกสารตอนนี้ อาจติดปัญหาได้
>
> **ต้องแก้ก่อน (Blocking)**
>
> 1. **FK type ยังไม่ตรงกับ schema จริง**
>    ใน specification.md ตอนนี้ ticketId, performedById, assigneeId เป็น String แต่ Ticket.id และ User.id ของจริงเป็น Int ค่ะ ทำให้ relation กันไม่ได้
>    แก้ FK พวกนี้เป็น Int
>    ส่วน ActionTaken.id จะใช้ cuid เหมือนเดิมก็ได้
>    sample ID ใน api-spec.md เช่น usr_staff_01 / clt_act_... ก็ควรแก้ให้ตรงกับ type จริงด้วยค่ะ
>
> 2. **ชื่อ field ของ dashboard ยังไม่ตรงกับ model จริง**
>    ในเอกสารใช้ title, priority, assignedTo / assignedToId แต่ใน model จริงใช้ summary, itPriority / requestedPriority, ownerId / owner
>    แนะนำให้ใช้ชื่อเดียวกับของจริง หรือถ้าจะใช้ชื่ออีกแบบ ให้ระบุ mapping ไว้ให้ชัดค่ะ
>
> 3. **Transition matrix ยังไม่ครบ**
>    ตอนนี้ยังขาด Cancelled และยังไม่ได้บอกว่า role ไหนเปลี่ยนจากสถานะไหนไปสถานะไหนได้บ้าง
>    ตาม handout มีทั้งหมด 8 statuses: New, Open, In Progress, Waiting for Requester, Resolved, Closed, Reopened, Cancelled
>    ในแอปมี Reopened กับ Cancelled อยู่แล้ว เลยควรใส่ transition และ role ให้ครบค่ะ
>
> 4. **Concurrency 409 ยังไม่ได้บอกว่าจะตรวจยังไง**
>    ใน spec บอกว่าจะคืน 409 เมื่อข้อมูลถูกแก้พร้อมกัน แต่ยังไม่มีวิธี detect
>    อาจใช้ version หรือเทียบ updatedAt / If-Match
>    แล้วเพิ่ม payload กับ test สำหรับกรณี stale update ด้วยค่ะ
>
> 5. **Status code ของ Resolution Gate ยังไม่ตรงกัน**
>    บางจุดเขียน 400/409 แต่ AC และ API test ใช้ 409
>    แนะนำให้ใช้ 409 Conflict เหมือนกันทั้งหมด จะได้ไม่สับสนค่ะ
>
> 6. **Route กับ field บางตัวที่เขียนไว้ยังไม่มีในโค้ดจริง**
>    ใน api-spec.md มี route สำหรับเปลี่ยน status แยกออกมา และมี resolutionSummary แต่ตอนนี้แอปใช้ PATCH /api/tickets/:id และใน Ticket model ยังไม่มี resolutionSummary
>    ถ้าจะใช้ของเดิมก็แก้ spec ให้ตรงกับ route ปัจจุบัน
>    แต่ถ้าจะเพิ่ม field ใหม่ ต้องใส่ไว้ใน migration section ด้วยค่ะ
>
> 7. **result required แต่ขัดกับ Action ที่เป็น PENDING**
>    ตอนนี้กำหนดว่า result ต้องมี 2–1000 ตัวอักษร แต่ถ้า Action เพิ่งสร้างและยังเป็น PENDING ก็อาจยังไม่มี result
>    แนะนำให้ result เป็น optional ตอน PENDING / IN_PROGRESS แล้วค่อยบังคับตอนจบ Action ค่ะ
>
> 8. **Spec ยังขาดบาง section ที่ handout กำหนด**
>    ยังต้องเพิ่ม:
>    - UI Specification Summary + link/reference ไป ui-spec.md
>    - Assumptions and Decisions
>    - Migration / backfill / rollback
>    - Seed data
>    - Idempotency สำหรับป้องกัน double-submit / retry ค่ะ
>
> 9. **tests.md ตอนนี้สถานะยังไม่ตรงกับของจริง**
>    ทุก test เป็น Pass ทั้งที่ยังไม่ได้ implement
>    ควรเปลี่ยนเป็น Planned หรือ Not run ก่อน
>    path ฝั่ง client ควรเป็น client/tests/lab-04/
>    และยังขาด test บางส่วน เช่น UI style, performance smoke, migration, concurrency/stale update, safe failure, accessibility, duplicate submission และ transition matrix ค่ะ
>
> 10. **reviewer.md มีบางส่วนที่เขียนเหมือนมีหลักฐานครบแล้ว**
>     ตอนนี้เขียนว่าเป็น "Verbatim Records ครบถ้วน" แต่บาง Part ยังว่าง และ PR #76–84 ยังไม่มีจริง
>     แนะนำให้เปลี่ยนเป็น template ว่า "จะอัปเดตเมื่อมี PR" ก่อน แล้วค่อยใส่หลักฐานจริงทีหลังค่ะ
>
> 11. **ai-use.md มีบางส่วนที่พูดถึงงานที่ยังไม่ได้ทำ**
>     ตอนนี้มีการเขียนว่า AI ช่วย implement migration/API/UI/tests รวมถึง zero regression, 100% coverage และ visual audit แต่ PR นี้ยังเป็น docs อยู่
>     แนะนำให้เขียนเฉพาะสิ่งที่ทำจริงในตอนนี้ก่อน แล้วค่อยอัปเดตหลัง implement ค่ะ
>
> 12. **Accessibility checklist ยังไม่ควรติ๊กครบ**
>     ตอนนี้ติ๊ก [x] ไว้หมดแล้ว แต่บางสียัง contrast ไม่ถึง AA เช่น #10b981, #d97706, #f59e0b บนพื้นขาว
>     อาจเปลี่ยนเป็นสีที่เข้มขึ้น หรือถ้าใช้เป็น badge ให้ใช้คู่กับข้อความสีเข้มที่อ่านชัดค่ะ
>
> **จุดที่ควรปรับเพิ่ม แต่ไม่ถึงกับ block merge**
> - api-spec.md เขียนว่าใช้ session cookie หรือ Bearer แต่แอปจริงใช้ Bearer อย่างเดียว ควรแก้ให้ตรงกันค่ะ
> - มี GET .../actions-taken/:actionId ใน specification แต่ใน api-spec ยังไม่มี endpoint นี้
> - FR-07 พูดถึง "deleting" แต่ยังไม่มี DELETE endpoint ถ้าไม่อยู่ใน scope ตัดออกได้ค่ะ
> - Requester ownership ตอนนี้เอกสารใช้ 403 แต่โค้ดจริงใช้ 404 เพื่อไม่เปิดเผยว่า ticket มีอยู่ ควรเลือกให้ตรงกัน
> - GET actions ควรระบุ orderBy / pagination
> - Dashboard ควรเพิ่ม timezone/date boundary และ empty state ค่ะ

#### 4.1.2 Author Response #1 (`titayaaa`, commit `ddd8350`)

**Response Date:** 2026-10-31

> ขอบคุณสำหรับรีวิวที่ละเอียดและช่วยดักจุดสำคัญมาก ๆ เลยนะคะ ตรวจสอบและแก้ไขปรับปรุงให้ตรงกับโค้ดจริงและโจทย์ Lab 4 ครบถ้วนทุกข้อแล้วใน commit `ddd8350` ค่ะ
>
> ### 1. `specification.md`
> - ปรับ Foreign Key ในโมเดล `ActionTaken` (`ticketId`, `performedById`, `assigneeId`) เป็น `Int` ให้ตรงกับ `Ticket.id` และ `User.id` เรียบร้อยค่ะ
> - ปรับชื่อ field ของ Dashboard ให้ตรงกับโมเดลจริง (`summary`, `itPriority`, `ownerId`)
> - เพิ่ม Ticket Status Transition Matrix ครบทั้ง 8 สถานะ (`New`, `Open`, `In Progress`, `Waiting for Requester`, `Resolved`, `Closed`, `Reopened`, `Cancelled`) พร้อมระบุ Role ที่มีสิทธิ์เปลี่ยนในแต่ละสถานะชัดเจน
> - ระบุกลไก Concurrency Stale Update โดยใช้ `expectedUpdatedAt` เทียบกับ `ticket.updatedAt` หากไม่ตรงจะคืน `409 Conflict`
> - รวมเป็น `409 Conflict` สำหรับกรณี Resolution Gate และ Stale Update ตรงกันทั้งหมด
> - ปรับ `result` ให้เป็น optional ตอนสถานะเป็น `PENDING` / `IN_PROGRESS` และจะบังคับกรอกเฉพาะตอนสถานะเป็น `COMPLETED`
> - เพิ่ม Section ครบตาม Handout: UI Specification Summary, Assumptions & Decisions (ระบุเหตุผลการออกแบบ DB 3 ข้อ), Migration/Backfill/Rollback, Seed data, และ Idempotency ป้องกัน double-submit
> - ตัดคำว่า "deleting" ออกจาก FR-07 เพื่อสะท้อนความเป็น Append-only audit trail ค่ะ
>
> ### 2. `api-spec.md`
> - ปรับ Sample ID เป็นตัวเลข integer จริง (เช่น `ticketId: 101`, `performedById: 2`, `assigneeId: 3`)
> - เปลี่ยนชื่อ field ให้ตรงกับโมเดลจริง (`summary`, `itPriority`, `owner`)
> - ระบุการใช้ `Authorization: Bearer <token>` ชัดเจนเพียงรูปแบบเดียว
> - เพิ่ม Endpoint `GET /api/tickets/:id/actions-taken/:actionId` ในสเปกเรียบร้อยค่ะ
> - ปรับกรณี Requester เข้าดูตั๋วผู้อื่นให้ตอบกลับ `404 Not Found` เพื่อทำ Data Isolation
> - เพิ่ม query `orderBy: desc` และระบุ Timezone UTC ISO-8601 พร้อม Empty state ของ Dashboard ให้ครบถ้วนค่ะ
>
> ### 3. `ui-spec.md`
> - เพิ่ม Dropdown เลือก Assignee (กรองเฉพาะ active staff), ตัวเลือกสถานะ Action Taken และแจ้งเตือน Modal Resolution Gate
> - ปรับปรุงคู่สี Badge ให้มีค่า Contrast Ratio สูง (>= 7.1:1) เช่น พื้นสีอ่อนคู่กับตัวหนังสือสีเข้ม (#92400e บน #fffbeb, #166534 บน #f0fdf4) เพื่อให้ผ่านเกณฑ์ WCAG AA ชัดเจน
> - ปรับ Checklist ให้เป็น `[ ]` รอการตรวจสอบจริงในขั้นตอน UI Implementation ค่ะ
>
> ### 4. `tests.md`
> - ปรับสถานะทุกเทสต์เป็น `Planned` ตามหลัก TDD (No Premature Data)
> - เพิ่มชุดทดสอบครอบคลุม: UI style (`STYLE-01`), Performance smoke (`PERF-01`), Migration (`MIG-01`), Concurrency 409 (`API-14`), Safe error (`SAFE-01`), Accessibility (`A11Y-01`), Double-submit (`DUP-01`) และ Transition Matrix (`WORKFLOW-01`) ค่ะ
>
> ### 5. `reviewer.md` & `ai-use.md`
> - ปรับ `reviewer.md` เป็น Template บันทึกตามลำดับ PR ที่เกิดขึ้นจริง
> - ปรับ `ai-use.md` ให้ระบุเฉพาะบทบาท Specification Agent ที่ทำจริงในสปรินต์นี้ และเตรียมพื้นที่ไว้สำหรับ Coding Agent ในสปรินต์ถัดไปค่ะ
>
> รบกวนช่วยตรวจดูอีกรอบนะคะ ขอบคุณมาก ๆ เลยค่ะ!

#### 4.1.3 Review #2 — Changes Requested (`jejaebubu`, 2026-10-31 23:59 UTC+7)

**Verdict:** Changes Requested

**Review Comments:**

> ขอบคุณที่แก้ให้นะคะ รอบนี้ดีขึ้นเยอะเลยค่ะ หลายจุดที่คุยกันรอบก่อนแก้เรียบร้อยแล้ว ทั้ง FK ที่เปลี่ยนเป็น Int, field ของ Dashboard, result ที่เป็น optional, tests ที่เปลี่ยนเป็น Planned, ai-use.md และ badge ของ Actions Taken ตรงตามที่ขอแล้วค่ะ
>
> เหลืออีกนิดหน่อยที่อยากให้แก้ก่อน merge นะคะ เพราะตอนนี้ยังมีบางจุดที่เอกสารกับโค้ดจริงไม่ตรงกัน ถ้า implement ตามเอกสารเลยอาจทำให้ behavior หรือ test ไม่ตรงกับระบบจริงค่ะ
>
> 1. Transition matrix ยังไม่ตรงกับโค้ดจริง
> ในโค้ดจริง server/src/routes/staff.ts มีสถานะ PENDING และ transition บางตัวต่างจากใน specification.md เช่น
>
> OPEN ยังไป RESOLVED ตรง ๆ ไม่ได้
> IN_PROGRESS / WAITING_FOR_REQUESTER กลับไป PENDING ได้
> REOPENED ไป PENDING ได้ แต่ไป WAITING_FOR_REQUESTER ไม่ได้
> แต่ matrix ในเอกสารตอนนี้ยังไม่มี PENDING และบาง transition ไม่ตรงกับโค้ดค่ะ
>
> แนะนำให้เอา matrix จาก VALID_TRANSITIONS ในโค้ดมาใช้ให้ตรงกันเลยค่ะ หรือถ้าจะยึด 8 statuses ตาม handout ก็ควรระบุให้ชัดว่า PENDING เป็นของเดิม (legacy) / ไม่อยู่ใน scope ของ Lab นี้ และต้องวางแผนให้โค้ดกับเอกสารตรงกันด้วยค่ะ
>
> 2. Route และ status code ยังไม่ตรงกัน
> Route ที่โค้ดใช้จริงตอนนี้คือ
>
> PATCH /api/staff/tickets/:id/status
> PATCH /api/staff/tickets/:id/resolve
> แต่ใน api-spec.md ยังมี route แบบ /api/tickets/:id/status หรือ PUT /api/staff/tickets/:id/status ซึ่งไม่มีในโค้ดจริงค่ะ
>
> อีกจุดคือ /status ไม่ได้ใช้สำหรับ Resolve โดยตรง ถ้าส่ง RESOLVED จะได้ 422 และต้องไปใช้ /resolve แทน
>
> รวมถึงกรณี transition ไม่ถูกต้องหรือไม่มี resolutionSummary โค้ดจริงก็คืน 422 แต่ในเอกสารบางจุดยังเขียนเป็น 400 อยู่ค่ะ
>
> ตรงนี้แนะนำให้ปรับ route และ status code ในเอกสารให้ตรงกับ behavior จริงทั้งหมดค่ะ
>
> แล้วขอแก้ข้อมูลจากรีวิวรอบก่อนนิดนึงนะคะ — resolutionSummary มีอยู่ใน schema.prisma แล้วค่ะ ไม่ต้องเพิ่ม field หรือ migration ใหม่สำหรับตัวนี้
>
> 3. Requester Dashboard ต้องเช็กเรื่อง ownership เพิ่มอีกนิด
> ตอนนี้ระบบมีทั้ง requesterId และ userId และ flow สร้าง ticket เดิมยังมีการใช้ requesterId อยู่ค่ะ
>
> แต่ใน spec ตอนนี้กำหนดให้ Dashboard ดูแค่
>
> userId == currentUser.id
>
> อย่างเดียว ซึ่งอาจทำให้ ticket เก่าที่ผูกกับ requesterId ไม่ถูกนับใน Dashboard
>
> ตรงนี้อยากให้ระบุให้ชัดว่าจะเช็กจาก userId, requesterId หรือใช้ทั้งสองแบบ รวมถึงจะใช้ email fallback เหมือน logic เดิมใน app.ts หรือไม่ค่ะ จะได้ไม่ทำให้ ticket เก่าหายจาก Dashboard
>
> 4. Migration ที่เขียนไว้ในเอกสารยังใช้จริงไม่ได้
> ใน specification.md ตอนนี้เขียนเหมือน migration ถูก execute แล้ว แต่ใน repo ยังไม่มี migration file นี้ค่ะ
>
> อีกอย่างคือ CREATE TYPE IF NOT EXISTS ใช้กับ PostgreSQL แบบนี้ไม่ได้ ถ้าต้องการให้รันซ้ำได้อย่างปลอดภัย ต้องใช้วิธีอื่น เช่น DO $$ ... เพื่อ handle กรณี type มีอยู่แล้ว
>
> ถ้ายังไม่ได้ทำ migrationจริง แนะนำให้เปลี่ยนข้อความเป็นแผนที่จะทำใน Issue 28 ก่อน จะตรงกับสถานะปัจจุบันมากกว่าค่ะ
>
> 5. Accessibility ของ status badge ยังต้องปรับอีกนิด
> Action badge ที่แก้มาใหม่ผ่านแล้วค่ะ แต่ status badge บางสียังมี contrast ไม่ถึง AA ถ้าเอาสีนั้นไปเป็นตัวหนังสือบนพื้นขาว เช่น #0284c7, #d97706 และ #16a34a
>
> แนะนำให้ทำเป็นคู่ background/text เหมือน Action badge หรือเปลี่ยนสีตัวหนังสือให้เข้มขึ้น แล้วค่อยติ๊ก accessibility checklist ว่าผ่านค่ะ
>
> จุดเล็ก ๆ ที่ควรปรับเพิ่ม
> api-spec.md เขียนว่า Bearer only แต่ server จริงรองรับทั้ง cookie และ Bearer ถ้าหมายถึงเฉพาะฝั่ง Client ให้เขียนกำกับไว้ให้ชัดค่ะ
> เอกสารบอกว่า Requester เปิด ticket ของคนอื่นจะได้ 404 แต่โค้ดปัจจุบันใน ticket detail/comments ยังคืน 403 ถ้าจะเปลี่ยนเป็น 404 ควรระบุว่าเป็นงานที่ต้องแก้โค้ดเพิ่มค่ะ
> GET actions มี orderBy แล้ว แต่ยังไม่มี pagination
> ใน ui-spec.md ใช้ owner / priority แต่ query จริงใช้ ownerId / itPriority
> DoD ยังไม่ควรติ๊ก [x] ว่า merged เพราะ PR ตอนนี้ยังอยู่ระหว่าง review ค่ะ
> tests.md ของ WORKFLOW-01 ยังเขียนว่าคาดหวัง 400 แต่โค้ดจริงคืน 422
> แล้วขอแก้ข้อมูลจากรีวิวรอบก่อนของเราเอง 4 จุดนะคะ
>
> resolutionSummary มีอยู่แล้ว ไม่ต้องเพิ่ม migration
> path client/src/test/lab-04/ ถูกแล้ว ไม่ต้องเปลี่ยน
> Server รองรับทั้ง cookie และ Bearer ไม่ใช่ Bearer อย่างเดียว
> Requester เปิด ticket/detail/comments ที่ไม่ใช่ของตัวเอง ตอนนี้โค้ดจริงคืน 403 ไม่ใช่ 404 ค่ะ
> โดยรวมรอบนี้เหลือไม่เยอะแล้วค่ะ หลัก ๆ ฝากแก้ 5 ข้อด้านบนให้เอกสารตรงกับโค้ดจริงมากขึ้น แล้ว ping มาได้เลยนะคะ เดี๋ยวช่วยตรวจรอบสุดท้ายให้อีกทีค่ะ
>
> ขอบคุณมาก ๆ ค่ะ

#### 4.1.4 Author Response #2 (`titayaaa`, commit `5b20200`)

**Response Date:** 2026-11-01

> ขอบคุณสำหรับรีวิวรอบสองที่ช่วยตรวจสอบเทียบกับโค้ดจริงและ backend endpoints ได้อย่างละเอียดและแม่นยำมาก ๆ เลยนะคะ ตรวจสอบและดำเนินการแก้ไขปรับปรุงเอกสารทั้ง 5 ข้อหลักและจุดเล็ก ๆ ครบถ้วนทั้งหมดเรียบร้อยแล้วค่ะ:
>
> ### 1. Transition Matrix สอดคล้องกับ `server/src/routes/staff.ts`
> - นำโครงสร้าง `VALID_TRANSITIONS` จากโค้ดจริงมาใส่ใน `specification.md` ครบถ้วนทุกเส้นทาง:
>   - `OPEN` ไม่สามารถข้ามไป `RESOLVED` ตรง ๆ ได้ (ต้องเข้าสู่ `IN_PROGRESS`, `WAITING_FOR_REQUESTER`, หรือ `PENDING` ก่อน)
>   - บันทึกสถานะ `PENDING` (Legacy/Vendor hold จาก Lab 3) ร่วมกับ 8 สถานะหลักจาก Handout ไว้อย่างชัดเจน
>   - ระบุชัดเจนว่าการ Resolve ตั๋วต้องกระทำผ่าน `PATCH /api/staff/tickets/:id/resolve` เท่านั้น
>
> ### 2. Route และ Status Code ตรงกับโค้ดจริง
> - แก้ไข Route ใน `api-spec.md` ให้แยกเป็น 2 Endpoints ตามโค้ดจริง:
>   - `PATCH /api/staff/tickets/:id/status` สำหรับการเปลี่ยนสถานะทั่วไป (หากส่งสถานะ `RESOLVED` มาที่นี่ หรือส่ง transition ที่ไม่อนุญาต จะตอบกลับด้วย `422 Unprocessable Entity`)
>   - `PATCH /api/staff/tickets/:id/resolve` สำหรับการ Resolve ตั๋วโดยเฉพาะ (บังคับ `resolutionSummary` 3-500 chars และตรวจสอบ Resolution Gate หากมี actions ค้างจะตอบกลับ `409 Conflict`)
> - ปรับ Status code ในกรณี transition ผิดพลาดหรือ summary ไม่ถูกต้องเป็น `422 Unprocessable Entity` ให้ตรงกับพฤติกรรมจริงของ Express Controller ค่ะ
> - ตัดแผนการสร้าง field `resolutionSummary` ออกจาก Migration section เนื่องจากมีอยู่ในโมเดลเดิมแล้วค่ะ
>
> ### 3. Requester Dashboard Dual-Ownership & Legacy Fallback
> - ปรับปรุงสูตรคำนวณใน BR-13 (`specification.md`) และ `api-spec.md` ให้รองรับเงื่อนไขความเป็นเจ้าของตั๋วแบบครบถ้วน:
>   `ticket.userId === currentUser.id || ticket.requesterId === currentUser.id || ticket.requesterUser.email === currentUser.email`
>   ทำให้ตั๋วทั้งจาก Lab 1, 2 (ที่ผูกกับ `requesterId` / email) และตั๋วใหม่ (ที่ผูกกับ `userId`) ปรากฏบน Dashboard ได้ครบถ้วน ไม่ตกหล่นแน่นอนค่ะ
>
> ### 4. ปรับแผน Migration เป็น Planned (Issue 28) พร้อม PL/pgSQL Idempotency
> - ปรับข้อความใน Section 7.5 ให้ระบุชัดเจนว่าเป็น **แผนการทำ Migration สำหรับ Issue 28**
> - เปลี่ยนคำสั่งสร้าง Enum เป็นรูปแบบ PL/pgSQL:
>   `DO $$ BEGIN CREATE TYPE "ActionTakenStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`
>   เพื่อรองรับการรันซ้ำบน PostgreSQL ได้อย่างปลอดภัย ถูกต้องตาม syntax จริงค่ะ
>
> ### 5. Accessibility Badge & Design Tokens
> - ปรับ Status Badge ใน `ui-spec.md` เป็นคู่สี Background/Text ที่มี Contrast Ratio สูงเกินเกณฑ์ WCAG AAA (>= 7.1:1) ทุกสถานะ เช่น:
>   - `NEW`: `#0369a1` บน `#f0f9ff` (7.3:1)
>   - `OPEN`: `#1e40af` บน `#eff6ff` (8.5:1)
>   - `IN_PROGRESS`: `#92400e` บน `#fffbeb` (7.1:1)
>   - `RESOLVED`: `#166534` บน `#f0fdf4` (7.4:1)
>   - `CLOSED`: `#334155` บน `#f8fafc` (8.2:1)
> - คงสถานะ Checklist ใน `ui-spec.md` เป็น `[ ]` รอการตรวจสอบจริงในขั้นตอน UI Implementation ค่ะ
>
> ### 6. จุดเล็ก ๆ ที่เก็บตกครบถ้วน
> - **Authentication Policy:** ระบุใน `api-spec.md` ว่าเซิร์ฟเวอร์รองรับทั้ง Cookie และ Bearer Token ส่วน SPA Client จะใช้ Bearer Token เป็นค่าเริ่มต้น
> - **Data Isolation:** บันทึกชัดเจนว่า Endpoint เดิมของ Ticket Detail / Comments ตอบกลับ `403 Forbidden` ส่วน Actions Taken ตอบกลับ `404 Not Found` (โดยการ unify โค้ดเดิมให้เป็น 404 อยู่ในแผน Hardening Issue 34)
> - **Pagination:** เพิ่ม query parameters `page` (default 1) และ `limit` (default 10) ใน `GET /api/tickets/:id/actions-taken`
> - **Query Parameters ใน UI Spec:** ปรับใน `ui-spec.md` เป็น `ownerId=unassigned`, `ownerId=me` และ `itPriority=URGENT` ตรงกับ Query จริง
> - **DoD Checklist:** ปรับข้อ 1 ใน Definition of Done เป็น `[ ]` ไม่ติ๊กผ่านล่วงหน้า
> - **WORKFLOW-01:** ปรับ Expected Result ใน `tests.md` เป็น `422 Unprocessable Entity` ให้ตรงกับโค้ดจริงค่ะ
>
> รบกวนช่วยตรวจดูอีกรอบนะคะ ขอบคุณมาก ๆ เลยค่ะ!

#### 4.1.5 Review #3 — Changes Requested (`jejaebubu`, 2026-11-01)

**Verdict:** Changes Requested

**Review Comments:**

> ขอบคุณที่แก้รอบนี้นะคะ เช็กที่ commit 5b20200 แล้ว รอบนี้ 4 จุดหลักที่คุยกันก่อนหน้าผ่านแล้วค่ะ ทั้ง transition matrix, route/status code, migration plan, ownership formula แล้วก็ status badge ตอนนี้ผ่าน AA แล้ว
>
> เหลืออีก 4 จุดที่อยากให้แก้ก่อน merge นะคะ
>
> 1. Accessibility ตอนนี้ผ่าน AA แต่ยังไม่ถึง AAA
> ใน ui-spec.md กับ ai-use.md ตอนนี้เขียนว่าเป็น WCAG AAA (>= 7:1) แต่สีบางตัวยังได้ประมาณ 5–6 กว่า ๆ ค่ะ
>
> จริง ๆ สีที่ใช้อยู่ ผ่าน AA แล้ว แค่ยังไม่ถึง AAA
>
> ถ้าเราตั้งใจใช้เกณฑ์ AA แนะนำให้แก้ข้อความเป็น WCAG AA >= 4.5:1 จะตรงกับค่าจริงที่สุดค่ะ
>
> แต่ถ้าต้องการ AAA จริง ๆ ค่อยเปลี่ยนเป็นสีที่เข้มขึ้น เช่น
>
> NEW → #0c4a6e
> IN_PROGRESS → #78350f
> PENDING → #713f12
> RESOLVED → #14532d
> ส่วนตัวคิดว่าใช้ AA ก็พอค่ะ แค่แก้ข้อความไม่ให้ claim เกินค่าจริง
>
> 2. Default status ของ Action ยังเขียนไม่ตรงกัน
> ใน specification.md ตอนนี้เป็น
>
> @default(COMPLETED)
>
> แต่ใน api-spec.md เป็น
>
> default PENDING
>
> แนะนำให้ใช้ PENDING เหมือนกันทั้งสองที่ค่ะ เพราะตอนสร้าง Action ใหม่ควรเริ่มจาก PENDING ก่อน และ result ตอนนี้ก็เป็น optional อยู่แล้ว
>
> 3. Index ใน model กับคำอธิบายยังไม่ตรงกัน
> ใน model ตอนนี้มี index แยกของ ticketId, assigneeId และ status
>
> แต่ในคำอธิบายด้านล่างเขียนว่ามี composite index ของ ticketId + status ค่ะ
>
> ตรงนี้เลือกได้ว่าจะ
>
> เพิ่ม @@index([ticketId, status]) ให้ตรงกับคำอธิบาย
> หรือแก้คำอธิบายไม่ให้บอกว่าเป็น composite index
> เอาแบบไหนก็ได้ค่ะ ขอแค่ model กับเอกสารตรงกัน
>
> 4. เรื่อง 403 / 404 ยังมีบางส่วนเขียนไม่ตรงกัน
> ใน Assumption 3 ตอนนี้เขียนว่า Requester เปิด ticket ของคนอื่นจะได้ 404
>
> แต่ใน Section 8 กับ api-spec.md ระบุว่า ticket detail เดิมของระบบยังคืน 403 อยู่ค่ะ
>
> แนะนำให้เขียนแยกให้ชัดว่า
>
> Actions Taken endpoints → ใช้ 404
> Legacy ticket detail/comments → ตอนนี้ยังใช้ 403
> ถ้าจะเปลี่ยนของเดิมเป็น 404 ค่อยทำใน Issue 34 ค่ะ
> แบบนี้จะตรงกับ behavior ปัจจุบันและไม่ทำให้คน implement สับสนค่ะ
>
> จุดเล็ก ๆ ที่ฝากแก้เพิ่ม
> reviewer.md ยังเขียนว่า Round 1 อยู่ ควรเปลี่ยนเป็น Round 2 ค่ะ
> ด้านบนของ reviewer.md ยังมีคำว่า "Verbatim Records ครบถ้วน" อยู่ ทั้งที่ยังอยู่ระหว่าง review แนะนำให้ปรับข้อความให้ตรงกับสถานะจริง
> tests.md ยังเขียนว่า 8-state แต่ตอนนี้ matrix มี PENDING รวมเป็น 9 statuses แล้ว
> ใน specification.md บางจุดก็ยังเขียน "all 8 statuses" อยู่ ควรแก้ให้ตรงกับ matrix ใหม่ค่ะ
> requesterId === currentUser.id อาจเทียบ ID คนละ model กัน (RequesterUser.id กับ User.id) แนะนำให้ใช้ relation/email ในการหา ownership จะปลอดภัยกว่าค่ะ
> Idempotency ตอนนี้ยังป้องกันแค่ฝั่ง frontend ถ้าต้องการให้ retry แล้วไม่สร้างข้อมูลซ้ำจริง ๆ ควรมี idempotency key ฝั่ง server ด้วย
> 409 จาก expectedUpdatedAt และ Resolution Gate ตอนนี้ยังไม่มีใน staff.ts ถ้ายังไม่ได้ implement แนะนำให้เขียนกำกับว่า Planned for Issue 31 ไว้ก่อนค่ะ
> โดยรวมรอบนี้ใกล้แล้วค่ะ หลัก ๆ ฝากแก้ 4 ข้อด้านบน แล้วก็อัปเดตสถานะใน reviewer.md ให้ตรงกับรอบปัจจุบันอีกนิด น่าจะพร้อม approve ในรอบหน้าแล้วค่ะ
>
> ขอบคุณมาก ๆ ค่ะ

#### 4.1.6 Author Response #3 (`titayaaa`, commit `f144a1a`)

**Response Date:** 2026-11-01

> ขอบคุณสำหรับคำแนะนำรอบที่ 3 มาก ๆ ค่ะ ตรวจสอบและแก้ไขครบถ้วนทั้ง 4 ประเด็นหลักและจุดเล็ก ๆ ทั้งหมดแล้วค่ะ:
>
> 1. **Accessibility Standards (WCAG 2.1 AA):** ปรับใน `ui-spec.md` และ `ai-use.md` ให้ระบุเกณฑ์มาตรฐานชัดเจนเป็น **WCAG 2.1 AA (>= 4.5:1)** เพื่อให้ตรงกับค่า Contrast จริงของคู่สี Background/Text โดยไม่กล่าวอ้างเกินจริงค่ะ
> 2. **Default Status ของ Action:** ใน `specification.md` ปรับโมเดล `ActionTaken.status` เป็น `@default(PENDING)` สอดคล้องกับ `api-spec.md` และธรรมชาติของงานที่เพิ่งสร้างซึ่งยังไม่มีผลลัพธ์ค่ะ
> 3. **Composite Index ตรงกันทั้งโมเดลและคำอธิบาย:** เพิ่ม `@@index([ticketId, status])` ในโมเดล `ActionTaken` (`specification.md`) เพื่อให้ตรงกับคำอธิบาย และช่วยเพิ่มประสิทธิภาพ Query ตรวจสอบ Resolution Gate (`COUNT(*) WHERE ticketId = ? AND status IN ('PENDING', 'IN_PROGRESS')`) ได้อย่างรวดเร็วค่ะ
> 4. **แยกความแตกต่าง 403 vs 404 ชัดเจน:** ใน Assumption 3, Section 8 และ `api-spec.md` ระบุแยกชัดเจนว่า:
>    - Actions Taken Endpoints (`/api/tickets/:id/actions-taken`) ตอบกลับด้วย `404 Not Found` สำหรับ Requester ที่ไม่ได้เป็นเจ้าของตั๋ว เพื่อป้องกันการเดาข้อมูล (Data Isolation)
>    - Legacy Ticket Detail / Comments ในโค้ดปัจจุบันยังคงตอบกลับ `403 Forbidden` (โดยมีแผน Re-factor ให้เป็น 404 พร้อมกันใน Issue 34 Hardening)
> 5. **จุดเล็ก ๆ ที่ปรับปรุงเพิ่มเติม:**
>    - ปรับสถานะใน `reviewer.md` จาก Round 1 เป็น Round 2 และ Round 3 เรียบร้อยแล้ว พร้อมปรับข้อความส่วนหัวให้สะท้อนการบันทึกตามรอบจริง
>    - อัปเดตใน `tests.md` (WORKFLOW-01) และ `specification.md` เป็น **9-state Ticket Transition Matrix** (รวม legacy `PENDING`)
>    - ปรับเงื่อนไข Requester Ownership ให้เช็กผ่าน relation และ verified email: `ticket.userId === currentUser.id || ticket.requesterUser?.email === currentUser.email || ticket.requester?.email === currentUser.email` เพื่อป้องกันปัญหา ID ชนกันข้ามโมเดล (`RequesterUser.id` vs `User.id`)
>    - ระบุแผนรองรับ Idempotency Key ฝั่งเซิร์ฟเวอร์ใน BR-16 (Planned for Issue 29)
>    - ระบุว่า Concurrency Check (`expectedUpdatedAt`) และ Resolution Gate (409 Conflict) เป็นฟังก์ชันที่ **Planned for Issue 31 (PR-05)** เนื่องจากยังไม่มีใน baseline `staff.ts`
>
> รบกวนตรวจทานรอบสุดท้ายนะคะ ขอบคุณมากค่ะ!

#### 4.1.7 Review #4 — Approved (`jejaebubu`, 2026-11-01 02:58 UTC+7)

**Verdict:** Approved (no blocking issues)

**Review Comments:**

> ตรวจ commit `f144a1a` แล้วนะคะ ทั้ง 4 จุดที่ขอแก้ผ่านครบแล้ว ได้แก่ WCAG AA, default เป็น `PENDING`, composite index และการแยก 403/404 ตามประเภทของ endpoint นอกจากนี้ `reviewer.md`, `tests.md` และ ownership formula ก็ตรงกับโค้ดจริงแล้วค่ะ
>
> **มี Minor follow-ups อีกเล็กน้อย แต่ไม่บล็อกการ merge ค่ะ**
>
> - `reviewer.md`: PR #105 ควรอัปเดตสถานะเป็น **Approved & Merged**
> - Issue 29: ควรระบุ `Idempotency-Key` ใน `api-spec` และเพิ่ม test เพื่อทดสอบการทำงานจริง
> - API-12: ควรเพิ่ม test กรณี ownership fallback ให้ครอบคลุมทั้ง legacy ticket และ ticket ใหม่
> - BR-13: แนะนำให้เปลี่ยนคำว่า `verified email` เป็น `email match` เพื่อให้ตรงกับการทำงานจริงของโค้ด
>
> โดยรวมเอกสารพร้อม merge เข้า `lab4-staging` ได้แล้วค่ะ ส่วน Minor follow-ups สามารถเก็บไปปรับเพิ่มเติมได้โดยไม่ต้องบล็อกการ merge ค่ะ

**คำวินิจฉัย:** **APPROVED & MERGED** — Reviewer (@jejaebubu) อนุมัติและเป็นผู้กด Merge PR #75 เข้า `lab4-staging` เรียบร้อย (Merge SHA: `4a555671b13ecee7cabcae75dd76e3ed9dc77e3d`, 2026-10-31 19:58 UTC) — **Closes #63**
