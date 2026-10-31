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
| **PR-03 ([GitHub #106](https://github.com/jejaebubu/toktickit/pull/106))** | Actions Taken REST API, RBAC authorization, and backend tests | `feature/lab04-issue3-actions-api` | `lab4-staging` | **Request Changes → Pending re-review** | Review #1 โดย `titayaaa`: ชม RBAC, JWT performer identity, 404 no-leak และ BR-14 state machine (101/101) แต่ขอให้ (1) อัปเดต PR-02 เป็น Approved & Merged + เพิ่ม review trail ของ PR #105 และหัวข้อ PR-03, (2) ล้าง `followUpNote` เป็น `null` เมื่อ `followUpRequired=false` โดยไม่ส่ง note ใหม่, (3) เพิ่ม max length 1000 ให้ `actionDescription` → ผู้เขียนแก้ไขครบ (9 new + 93 = 102/102) แล้ว รอ Reviewer ตรวจซ้ำ |
| **PR-04** | Actions Taken UI on Ticket Detail (list, create, edit, follow-up) | `feature/lab04-issue4-actions-ui` | `lab4-staging` | Planned | - |
| **PR-05** | Ticket workflow state machine, resolution gate, and transition enforcement | `feature/lab04-issue5-workflow` | `lab4-staging` | Planned | - |
| **PR-06** | IT Staff Dashboard API, summary metrics calculation, and UI screen | `feature/lab04-issue6-staff-dashboard` | `lab4-staging` | Planned | - |
| **PR-07** | Requester Dashboard API, owned ticket metrics, and UI screen | `feature/lab04-issue7-requester-dashboard` | `lab4-staging` | Planned | - |
| **PR-08** | End-to-end testing flows (Actions Taken, resolution, dashboards) | `feature/lab04-issue8-e2e` | `lab4-staging` | Planned | - |
| **PR-09** | Lab 1–3 regression test suite and system hardening | `feature/lab04-issue9-regression` | `lab4-staging` | Planned | - |
| **PR-10** | Zen Green UI polish, accessibility, responsive viewports, and screenshots | `feature/lab04-issue10-ui-polish` | `lab4-staging` | Planned | - |
| **PR-11** | Sprint 4 documentation and release integration to main | `release/lab04-staging-to-main` | `main` | Planned | - |

---

## 3. Full Review Trail — บันทึกข้อความรีวิวฉบับเต็มจาก GitHub

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

#### 3.2.3 Review #2 — Approved (`titayaaa`, 2026-10-31)

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
