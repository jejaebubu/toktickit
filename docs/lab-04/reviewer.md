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
| **PR-06 ([GitHub #110](https://github.com/jejaebubu/toktickit/pull/110))** | IT Staff Dashboard API, summary metrics calculation, and UI screen | `feature/lab04-issue6-staff-dashboard` | `lab4-staging` | **Request Changes → Approved & Merged** | Review #1 โดย `titayaaa`: ชมการออกแบบการ์ดตัวชี้วัด 5 ใบ, ระบบ Drill-down, Responsive Desktop Table + Mobile Cards และชุดทดสอบ 6 เคสใหม่ (201/201) แต่ขอให้ (1) นำเมนู `Dashboard` ออกจาก `REQUESTER` ใน `Header.tsx` เพื่อป้องกันหน้าว่างก่อนทำ Issue #7, (2) เปลี่ยนหัวข้อแผงจาก `"My Recent Tickets"` เป็น `"Recent Queue Tickets"` ให้สอดคล้องกับ query, (3) เพิ่มลิงก์ PR #110 ใน `reviewer.md` → ผู้เขียนแก้ไขครบทุกข้อใน commit `1419b97` / `512cbab` / `8bc213c` → Reviewer ตรวจซ้ำแล้ว **Approve** — merged `c11da67` |
| **PR-07 ([GitHub #111](https://github.com/jejaebubu/toktickit/pull/111))** | Requester Dashboard API, owned ticket metrics, and UI screen | `feature/lab04-issue7-requester-dashboard` | `lab4-staging` | **Approved & Merged** | Review #1 โดย `titayaaa`: ชมการรักษาความปลอดภัย RBAC และ Data Isolation (`requesterId === req.user.id`, `SAFE-01`), ดีไซน์ Zen Green + Responsive Desktop/Mobile + Accessibility, Empty State CTA `"Submit a new request"` + Quick Actions, ระบบ Drill-down ไปยัง `MyTicketsList` และชุดทดสอบ 207/207 พร้อมให้คำแนะนำเชิงพัฒนาเพิ่มเติมเรื่องกลุ่มสถานะของการ์ด `My Open Tickets` → Reviewer **Approve** ในรอบแรก — merged `927862f` |
| **PR-08 ([GitHub #112](https://github.com/jejaebubu/toktickit/pull/112))** | End-to-end testing flows (Actions Taken, resolution, dashboards) | `feature/lab04-issue8-e2e` | `lab4-staging` | **Request Changes → Approved & Merged** | Review #1 โดย `titayaaa`: ชมชุดทดสอบ E2E Playwright ทั้ง 3 flows × 3 viewports (9 runs) และการแก้ `whiteSpace: "normal"` บน Advisory Badge แต่ขอให้เพิ่มลิงก์ PR #112, เพิ่ม negative validation test ช่อง Result, และเพิ่มการคลิก Quick Actions บน Requester Dashboard → ผู้เขียนแก้ไขครบใน commit `6ba5ed1` → Reviewer ตรวจรอบที่ 2 แล้ว **Approve & Merge** (merge SHA: `0ce99e8`) |
| **PR-09 ([GitHub #113](https://github.com/jejaebubu/toktickit/pull/113))** | Lab 1–3 regression test suite and system hardening | `feature/lab04-issue9-regression` | `lab4-staging` | **Request Changes → Approved & Merged** | Review #1 โดย `titayaaa`: ชมความครบถ้วนของ Regression suite 234/234 tests แต่ขอให้เพิ่มลิงก์ PR #113, เพิ่ม PR URL ใน 3.9, assert `toHaveValue("Resolved")` ใน `staff-ticket-flow.spec.ts`, และเติม PR #113 ใน `tests.md` → ผู้เขียนแก้ไขครบถ้วนใน commit `abb8ea3` → Reviewer ตรวจรอบที่ 2 แล้ว **Approve & Merge** (merge SHA: `5158f3a`) |
| **PR-10 ([GitHub #114](https://github.com/jejaebubu/toktickit/pull/114))** | Zen Green UI polish, accessibility, responsive viewports, and screenshots | `feature/lab04-issue10-ui-polish` | `lab4-staging` | **Request Changes → Approved & Merged** | Review #1 โดย `titayaaa`: ชมการปรับปรุง Zen Green UI, Accessibility WCAG AA, A11Y-01, และ 24 screenshots บน 3 viewports แต่ขอให้ (1) เติมลิงก์ PR #114 ใน Section 2, (2) เพิ่ม PR URL ใน 3.10, (3) ระบุ PR #114 ใน `tests.md`, และ (4) เพิ่มเทสต์ dynamic `aria-required` บน Result → ผู้เขียนแก้ไขครบถ้วนใน commit `2182896` → Reviewer ตรวจรอบที่ 2 แล้ว **Approve & Merge** (merge SHA: `d785a4c`) |
| **PR-11 ([GitHub #115](https://github.com/jejaebubu/toktickit/pull/115))** | Sprint 4 documentation and release integration to main | `release/lab04-staging-to-main` | `main` | **Changes Requested (Round 1) → Pending Round 2** | Review #1 โดย `titayaaa`: ขอให้เติมลิงก์ PR #115 ใน Section 2, เพิ่ม PR URL ใน 3.11, และระบุ PR #115 ใน `tests.md` → ผู้เขียนแก้ไขครบถ้วน — รอ Reviewer ตรวจซ้ำรอบที่ 2 และกด Merge เข้าสู่ `main` |

### Partner Pull Request Log

| PR ID | Repository / Scope | Branch Source | Target Branch | Author | Reviewer Status | Comments / Resolution (Merge SHA) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **PR-P01 ([GitHub #75](https://github.com/titayaaa/toktickit/pull/75))** | `titayaaa/toktickit`: Issue 27: Sprint 4 Engineering Contract & Specification (docs/lab-04) | `feature/27-lab4-specs` | `lab4-staging` | `titayaaa` | **Changes Requested (3 rounds) → Approved & Merged** | Reviewer `@jejaebubu` ตรวจทานโค้ด สเปก และเทสต์อย่างละเอียด $\rightarrow$ Reviewer อนุมัติและเป็นผู้กด Merge เข้าสู่ `lab4-staging` (Merge SHA: `4a55567`, 2026-10-31 19:58 UTC) |
| **PR-P02 ([GitHub #76](https://github.com/titayaaa/toktickit/pull/76))** | `titayaaa/toktickit`: feat(db): ActionTaken model, migration, idempotent seed, and verification tests (Issue #64) | `feature/28-db-and-seed` | `lab4-staging` | `titayaaa` | **Changes Requested / Commented → Approved & Merged** | Reviewer `@jejaebubu` ตรวจทานโค้ด สเปก และเทสต์อย่างละเอียด $\rightarrow$ Reviewer อนุมัติและเป็นผู้กด Merge เข้าสู่ `lab4-staging` (Merge SHA: `3392232`, 2026-11-01 11:03 UTC) |
| **PR-P03 ([GitHub #77](https://github.com/titayaaa/toktickit/pull/77))** | `titayaaa/toktickit`: feat(api): Actions Taken REST API, RBAC, and assignee validation (Issue #65) | `feature/29-actions-taken-api` | `lab4-staging` | `titayaaa` | **Changes Requested → Approved & Merged** | Reviewer `@jejaebubu` ตรวจทานโค้ด สเปก และเทสต์อย่างละเอียด $\rightarrow$ Reviewer อนุมัติและเป็นผู้กด Merge เข้าสู่ `lab4-staging` (Merge SHA: `b13cb43`, 2026-11-01 12:00 UTC) |
| **PR-P04 ([GitHub #78](https://github.com/titayaaa/toktickit/pull/78))** | `titayaaa/toktickit`: feat(ui): Actions Taken component on Ticket Detail, state sync, and A11Y (Issue #66) | `feature/30-actions-taken-ui` | `lab4-staging` | `titayaaa` | **Changes Requested (2 rounds) → Approved & Merged** | Reviewer `@jejaebubu` ตรวจทานโค้ด สเปก และเทสต์อย่างละเอียด $\rightarrow$ Reviewer อนุมัติและเป็นผู้กด Merge เข้าสู่ `lab4-staging` (Merge SHA: `36e2e53`, 2026-11-01 19:45 UTC) |
| **PR-P05 ([GitHub #79](https://github.com/titayaaa/toktickit/pull/79))** | `titayaaa/toktickit`: feat(workflow): Ticket workflow operations, resolution gate, and optimistic concurrency (Issue #31) | `feature/31-ticket-workflow` | `lab4-staging` | `titayaaa` | **Commented → Approved & Merged** | Reviewer `@jejaebubu` ตรวจทานโค้ด สเปก และเทสต์อย่างละเอียด $\rightarrow$ Reviewer อนุมัติและเป็นผู้กด Merge เข้าสู่ `lab4-staging` (Merge SHA: `1a056c2`, 2026-11-01 21:12 UTC) |
| **PR-P06 ([GitHub #80](https://github.com/titayaaa/toktickit/pull/80))** | `titayaaa/toktickit`: feat(dashboard): IT Staff Dashboard API, summary metrics, and UI screen (Issue #32, #68) | `feature/32-staff-dashboard` | `lab4-staging` | `titayaaa` | **Changes Requested → Approved & Merged** | Reviewer `@jejaebubu` ตรวจทานโค้ด สเปก และเทสต์อย่างละเอียด $\rightarrow$ Reviewer อนุมัติและเป็นผู้กด Merge เข้าสู่ `lab4-staging` (Merge SHA: `ba347fb`, 2026-11-01 22:20 UTC) |
| **PR-P07 ([GitHub #81](https://github.com/titayaaa/toktickit/pull/81))** | `titayaaa/toktickit`: feat(dashboard): Requester Dashboard API, personal metrics, and UI screen (Issue #33, #69) | `feature/33-requester-dashboard` | `lab4-staging` | `titayaaa` | **Approved & Merged (1 round)** | Reviewer `@jejaebubu` ตรวจทานโค้ด สเปก และเทสต์อย่างละเอียด $\rightarrow$ Reviewer อนุมัติและเป็นผู้กด Merge เข้าสู่ `lab4-staging` (Merge SHA: `ce5a566`, 2026-11-02 03:55 UTC) |
| **PR-P08 ([GitHub #82](https://github.com/titayaaa/toktickit/pull/82))** | `titayaaa/toktickit`: test(regression): full regression of Lab 1-3 suites with Lab 4 features (Issue #34, #70) | `feature/34-final-hardening` | `lab4-staging` | `titayaaa` | **Changes Requested → Approved & Merged** | Reviewer `@jejaebubu` ตรวจทานโค้ด สเปก และเทสต์อย่างละเอียด $\rightarrow$ Reviewer อนุมัติและเป็นผู้กด Merge เข้าสู่ `lab4-staging` (Merge SHA: `858d2ec`, 2026-11-02 09:08 UTC) |
| **PR-P09 ([GitHub #83](https://github.com/titayaaa/toktickit/pull/83))** | `titayaaa/toktickit`: test(e2e): Playwright E2E suites, responsive audits, and visual evidence (Issue #35, #71) | `feature/35-e2e-and-visual` | `lab4-staging` | `titayaaa` | **Changes Requested → Approved & Merged** | Reviewer `@jejaebubu` ตรวจทานโค้ด สเปก และเทสต์อย่างละเอียด $\rightarrow$ Reviewer อนุมัติและเป็นผู้กด Merge เข้าสู่ `lab4-staging` (Merge SHA: `b4dee7e`, 2026-11-03 10:05 UTC) |
| **PR-P10 ([GitHub #84](https://github.com/titayaaa/toktickit/pull/84))** | `titayaaa/toktickit`: PR-10: Sprint 4 Documentation and Release Integration to Main (Issue #36, #72) | `release/lab04-staging-to-main` | `main` | `titayaaa` | **Changes Requested → Approved & Merged** | Reviewer `@jejaebubu` ตรวจทานโค้ด สเปก และเทสต์อย่างละเอียด $\rightarrow$ Reviewer อนุมัติและเป็นผู้กด Merge เข้าสู่ `main` (Merge SHA: `06a4035`, 2026-11-03 19:57 UTC) |
| **PR-P11 ([GitHub #86](https://github.com/Achikan/TokTickIT/pull/86))** | `Achikan/TokTickIT`: feat(Issue 34): IT Staff Dashboard (API + UI) | `feature/34-staff-dashboard` | `lab4-staging` | `Achikan` | **Changes Requested / Commented (4 rounds) → Approved & Merged** | Reviewer `@jejaebubu` ตรวจทานโค้ด สเปก และเทสต์อย่างละเอียด $\rightarrow$ Reviewer อนุมัติและเป็นผู้กด Merge เข้าสู่ `lab4-staging` (Merge SHA: `7731405`, 2026-11-01 10:22 UTC) |

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

#### 3.6.2 Author Response #1 (`jejaebubu` — Commit `1419b97`)

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

#### 3.6.3 Review #2 — Approved (`titayaaa`, 2026-11-02 02:30 UTC+7)

> ### ✅ การตรวจประเมินรอบที่ 2 (Round 2 Review — APPROVED)
>
> ขอบคุณ @jejaebubu ที่ดำเนินการแก้ไขปรับปรุงครบถ้วนสมบูรณ์ทั้งประเด็น Blocking, Should Fix และ Minor Suggestions ใน commits `1419b97` และ `512cbab` อย่างรวดเร็วและประณีตมากค่ะ ตรวจสอบโค้ดและชุดทดสอบซ้ำอย่างละเอียดแล้ว:
>
> 1. **ขจัด Regression หน้าจอว่างเปล่าของ Requester สำเร็จ (Required 1.1)**:
>    - นำ `{ id: "dashboard", label: "Dashboard" }` ออกจากเมนูของ `REQUESTER` ใน `Header.tsx` เรียบร้อย ทำให้คงเหลือเฉพาะเมนูที่รองรับจริงในปัจจุบัน (`My Tickets` และ `Create Ticket`) เมนูจะไม่นำทางไปสู่หน้าว่างเปล่าอีกต่อไป
> 2. **ความสอดคล้องของหัวข้อแผงตั๋วกับ Query ข้อมูลจริง (Should Fix 2.1)**:
>    - ปรับเปลี่ยนหัวข้อแผงใน `StaffDashboard.tsx` และเอกสาร `ui-spec.md` เป็น `"Recent Queue Tickets"` ถูกต้องตรงกับขอบเขตข้อมูลจริงที่ query ดึงตั๋ว 5 รายการล่าสุดของคิวบริการทั้งหมด
>    - อัปเดต assertion ใน `StaffDashboard.test.tsx` ตรวจสอบข้อความใหม่ได้อย่างถูกต้อง
> 3. **ความสมบูรณ์ของเอกสารบันทึกการรีวิว (Minor 3.1)**:
>    - มีการใส่ลิงก์ `[GitHub #110](https://github.com/jejaebubu/toktickit/pull/110)` ใน Master PR Table (Section 2) และใน Section 3.6 ครบถ้วน
>    - บันทึกประวัติการรีวิวรอบที่ 1 และผลการแก้ไขครบถ้วนสมบูรณ์ตามเกณฑ์ของ Lab 4
>
> ผลการรันชุดทดสอบผ่านครบ 201/201 เทสต์ (Server 110 + Client 91) โค้ดมีคุณภาพสูงมากและพร้อมสำหรับการใช้งานจริง ขออนุมัติ (Approve)

**คำวินิจฉัย**: **APPROVED** — Reviewer กด Merge PR #110 เข้าสู่สาขา `lab4-staging` เรียบร้อย (Merge SHA: `c11da67`) — **Closes Issue #6**

---

### 3.7 PR-07: Requester Dashboard API, Owned Ticket Metrics, and UI Screen (Issue #7 — [PR #111](https://github.com/jejaebubu/toktickit/pull/111))

- **PR URL:** [jejaebubu/toktickit#111](https://github.com/jejaebubu/toktickit/pull/111)
- **Branch:** `feature/lab04-issue7-requester-dashboard` → `lab4-staging`
- **Author:** `@jejaebubu`
- **Reviewer:** `@titayaaa`
- **Objective:** พัฒนา `GET /api/dashboard/requester` สำหรับ Requester ผู้ล็อกอิน โดยจำกัดขอบเขตข้อมูลเฉพาะตั๋วที่ `requesterId == req.user.id` อย่างเคร่งครัด (`AC-05`, `FR-09`, `BR-11`), คำนวณตัวชี้วัด 4 หมวด (`myOpen`, `inProgress`, `resolved`, `closed`), ส่งคืน `recentTickets` 5 รายการล่าสุดของตนเองพร้อม `quickActions`, สร้างคอมโพเนนต์ `RequesterDashboard.tsx` พร้อมการ์ดตัวชี้วัด 4 ใบที่คลิก Drill-down ไปยัง `MyTicketsList` ตามสถานะได้ (`FR-10`), และเปิดเมนู `Dashboard` สำหรับบทบาท `REQUESTER` ใน `Header.tsx` และ `App.tsx`
- **Status:** Approved & Merged (`927862f`)

#### 3.7.1 Review #1 — Approved (`titayaaa`, 2026-11-02)
> ### ✅ การตรวจประเมิน PR #111: Requester Dashboard API and UI (Issue #7) — APPROVED
>
> ตรวจทานโค้ดใน PR #111 อย่างละเอียดครบถ้วนทั้ง 11 ไฟล์ เทียบกับข้อกำหนดใน `specification.md`, `api-spec.md` และ `ui-spec.md` เรียบร้อยแล้วค่ะ ขอชื่นชมที่พัฒนาโมดูล Requester Dashboard ออกมาได้อย่างสมบูรณ์แบบ สวยงาม และปลอดภัยมากค่ะ 👍
>
> #### 🌟 จุดเด่นที่น่าประทับใจ:
> 1. **การรักษาความปลอดภัยและ Data Isolation ที่รัดกุม (`app.ts`)**:
>    - บังคับใช้ RBAC ตรวจสอบ `req.user.role === 'REQUESTER'` (คืน `403 Forbidden` สำหรับเจ้าหน้าที่และแอดมิน ป้องกันการเข้าถึงข้ามบทบาท)
>    - การนับตัวชี้วัด (Metrics) และการดึง 5 ตั๋วล่าสุด (`recentTickets`) ถูกจำกัดขอบเขตด้วย `requesterId = req.user.id` อย่างเคร่งครัด ป้องกันการรั่วไหลของข้อมูลระหว่าง Requester ได้ 100% ตามเกณฑ์ `AC-05`, `FR-09`, และ `BR-11`
>    - จัดการข้อผิดพลาดตามหลัก `SAFE-01` ส่ง generic 500 error message ให้ client โดยไม่เปิดเผย stack trace
> 2. **ดีไซน์ Zen Green และการจัดวางที่ประณีต (`RequesterDashboard.tsx`)**:
>    - การเลือกใช้สีสอดคล้องกับ Zen Green tokens (`#006B3C`, `#EAF6EF`, `#1A202C`, `#6C757D`)
>    - การ์ดตัวชี้วัด 4 ใบ (`My Open Tickets`, `In Progress`, `Resolved`, `Closed`) มีคู่สี Accent ที่สบายตาและอ่านค่าง่าย
>    - รองรับ Responsive ดีเยี่ยม: สลับระหว่าง Desktop Table และ Mobile Cards (`.d-none.d-md-block` vs `.d-md-none`) ได้อย่างไร้รอยต่อ
>    - Accessibility ครบถ้วน: ทุกปุ่มและลิงก์มี `minHeight: 44px`, มี `aria-label` บนการ์ด และกำกับ `aria-hidden="true"` บน emoji ทั้งหมด
> 3. **Empty State & Quick Actions**:
>    - จัดการเคสที่ Requester ยังไม่มีตั๋วได้เป็นมิตรมาก พร้อมปุ่ม CTA `"Submit a new request"` นำทางไปยังหน้าสร้างตั๋วทันที
>    - แผง Quick Actions ด้านขวาช่วยให้การนำทางหลักสะดวกและรวดเร็ว
> 4. **ระบบ Drill-down และ State Handling (`MyTicketsList.tsx`, `App.tsx`, `Header.tsx`)**:
>    - เชื่อมต่อการกดการ์ดเพื่อนำทางไปยัง `MyTicketsList` พร้อมฟิลเตอร์สถานะเริ่มต้นผ่าน `initialStatus` ได้อย่างถูกต้อง
>    - มีการรีเซ็ต `initialStatus` เมื่อคลิกเมนูหลักจาก `Header.tsx` เพื่อให้ผู้ใช้สามารถดูตั๋วทั้งหมดได้ตามปกติ
>    - ขยายตัวเลือก `STATUS_OPTIONS` ใน `MyTicketsList` ให้ครบถ้วนทั้ง 9 สถานะ
> 5. **ชุดทดสอบครอบคลุมทั้งระบบ**:
>    - Backend API tests (`API-11`, `API-11b`) ยืนยันความถูกต้องของตัวเลขและการบล็อกสิทธิ์ 401/403
>    - Frontend Vitest tests (`UI-05a` – `UI-05d`) ทดสอบการเรนเดอร์, Drill-down, Empty state CTA และ Retry reload ครบทุกมิติ
>
> ---
>
> #### 💡 ข้อคิดเห็นและข้อเสนอแนะเชิงพัฒนา (Minor Suggestion — ไม่บล็อกการ Merge):
> - **Drill-down ของการ์ด `My Open Tickets`**: การ์ดนี้คำนวณจากสถานะ `New` และ `Open` รวมกัน แต่เมื่อคลิก drill-down ปัจจุบันส่ง `{ status: "Open" }` ไปยัง `MyTicketsList` ทำให้ระบบกรองแสดงเฉพาะตั๋วที่มีสถานะ `Open` (ตั๋วที่เป็น `New` จะไม่แสดงในรายการกรองนี้) ในอนาคตหากต้องการให้เห็นครบทุกตั๋วที่ยังเปิดอยู่ อาจพิจารณาเพิ่ม filter แบบกลุ่มสถานะ (เช่น Active/Open) ใน `MyTicketsList` เพิ่มเติมได้ค่ะ
>
> ---
>
> **สรุปผลการประเมิน:** โค้ดมีคุณภาพสูงมาก สถาปัตยกรรมสะอาด และผ่านชุดทดสอบทั้งหมดอย่างสมบูรณ์ ขอ **Approve** ให้สามารถ Merge เข้าสู่สาขา `lab4-staging` ได้เลยค่ะ ขอบคุณมากค่ะ

**คำวินิจฉัย**: **APPROVED & MERGED** — Reviewer กด Merge PR #111 เข้าสู่สาขา `lab4-staging` เรียบร้อย (Merge SHA: `927862f`) — **Closes Issue #7**

---

### 3.8 PR-08: End-to-End Testing Flows — Actions Taken, Resolution Gate, and Dashboards (Issue #8 — [PR #112](https://github.com/jejaebubu/toktickit/pull/112))

- **PR URL:** [jejaebubu/toktickit#112](https://github.com/jejaebubu/toktickit/pull/112)
- **Branch:** `feature/lab04-issue8-e2e` → `lab4-staging`
- **Author:** `@jejaebubu`
- **Reviewer:** `@titayaaa`
- **Objective:** พัฒนาชุดทดสอบอัตโนมัติระดับเบราว์เซอร์ด้วย Playwright (`e2e/lab-04/actions-taken-flow.spec.ts`, `e2e/lab-04/ticket-resolution.spec.ts`, `e2e/lab-04/dashboards.spec.ts`) ครอบคลุม Customer Journeys หลักทั้ง 3 ส่วน (`E2E-01`, `E2E-02`, `E2E-03`) บนทั้ง 3 Viewports (`desktop` 1280×800, `tablet` 820×1180, `mobile` 393×851 รวม 9 E2E test runs) พร้อมตรวจสอบ `expectNoHorizontalOverflow` และปรับ `whiteSpace: "normal"` บน Advisory Badge ใน `TicketDetail.tsx` และ `StaffTicketDetail.tsx` เพื่อป้องกันการล้นขอบบนหน้าจอ Mobile (393px)
- **Status:** Approved & Merged (`0ce99e8`)

#### 3.8.1 Review #1 — Request Changes (`titayaaa`, 2026-11-02)
> ### PR-08 Review: Changes Requested (ขอฝากเก็บรายละเอียด 2 จุดก่อน Approve ค่ะ)
>
> ขอบคุณ @jejaebubu สำหรับชุดทดสอบ E2E Playwright ทั้ง 3 flows บนทั้ง 3 viewports (Desktop, Tablet, Mobile) ครบ 9 runs และการแก้ปัญหา `whiteSpace: "normal"` บน Advisory Badge ได้อย่างยอดเยี่ยมมากค่ะ
>
> จากการไล่ตรวจโค้ดและเอกสารอย่างละเอียด มีจุดที่อยากรบกวนช่วยปรับแก้อีกนิดหน่อยก่อนกด Approve ดังนี้ค่ะ:
>
> #### 🔴 จุดที่ต้องปรับแก้ (Required Changes):
> 1. **เติมลิงก์ GitHub PR #112 ใน `docs/lab-04/reviewer.md`**:
>    - ในตาราง Section 2 แถวของ `PR-08`: รบกวนเพิ่มลิงก์เป็น `**PR-08 ([GitHub #112](https://github.com/jejaebubu/toktickit/pull/112))**` ให้ตรงตามฟอร์แมตเดียวกับ PR-04 ถึง PR-07 ค่ะ
>    - ในหัวข้อ Section 3.8: รบกวนเพิ่มบรรทัด `- **PR URL:** [jejaebubu/toktickit#112](https://github.com/jejaebubu/toktickit/pull/112)` ค่ะ
>
> #### 💡 ข้อเสนอแนะเพิ่มเติมเพื่อความสมบูรณ์แบบ (Minor Test Polish):
> 2. **เพิ่ม Negative Validation Test สำหรับ Result Note ตอน Complete Action (`actions-taken-flow.spec.ts`)**:
>    - ใน Step 7 หลังจากกด `action-complete-` (สถานะเป็น `COMPLETED`) หากลองกด `action-save` ก่อนกรอกข้อความ แล้ว assert ตรวจสอบว่ามี error alert สำหรับช่อง Result แสดงขึ้นมาก่อนกรอกข้อความจริง จะช่วยยืนยันการบังคับใช้กฎ `BR-16` / `AC-15` ในระดับ E2E ได้สมบูรณ์แบบเทียบเท่ากับ Follow-Up Note ใน Step 4 ค่ะ
> 3. **E2E Quick Action บน Requester Dashboard (`dashboards.spec.ts`)**:
>    - ปัจจุบันฝั่ง Requester ทดสอบคลิกการ์ด `requester-metric-card-resolved` แล้ว หากมีเวลาอาจเพิ่มการคลิก `requester-quick-action-create-ticket` หรือ `requester-quick-action-view-tickets` เพื่อให้ครบถ้วนเหมือนฝั่ง Staff Dashboard ค่ะ
>
> รบกวนช่วยอัปเดตข้อ 1 เป็นหลักนะคะ แล้วเดี๋ยวจะรีบเข้ามาตรวจซ้ำและกด Approve ให้ทันทีเลยค่ะ ขอบคุณมากค่ะ! ✨

#### 3.8.2 Author Response & Resolution (`jejaebubu`)
> ขอบคุณสำหรับรีวิวที่ละเอียดและข้อเสนอแนะดีๆ มากครับ ดำเนินการแก้ไขครบทั้งข้อ Required Change และข้อเสนอแนะเพิ่มเติม (Minor Test Polish) ทั้งหมดแล้วครับ:
>
> 1. **เพิ่มลิงก์ GitHub PR #112 ใน `docs/lab-04/reviewer.md` (Required 1)**:
>    - อัปเดตตาราง Section 2 แถว `PR-08 ([GitHub #112](https://github.com/jejaebubu/toktickit/pull/112))` และเพิ่ม `- **PR URL:** [jejaebubu/toktickit#112](https://github.com/jejaebubu/toktickit/pull/112)` ใน Section 3.8 เรียบร้อยครับ
> 2. **เพิ่ม Negative Validation Test สำหรับช่อง Result ตอน Complete Action (`e2e/lab-04/actions-taken-flow.spec.ts` — Minor 2)**:
>    - ใน Step 7 หลังจากคลิกปุ่ม `Complete` (`action-complete-`) ซึ่งเปิดฟอร์มพร้อมสถานะ `COMPLETED` ได้เพิ่มการกด `Save Action` (`action-save`) ขณะที่ช่อง `Result` ยังว่างอยู่ แล้วตรวจสอบว่ามีข้อความแจ้งเตือน `action-result-error` (`/Result is required/i`) แสดงขึ้นมาก่อนกรอกข้อความจริงและบันทึก เพื่อยืนยันกฎ `BR-16` / `AC-15` ในระดับ E2E ครับ
> 3. **เพิ่มการทดสอบคลิก Quick Actions บน Requester Dashboard (`e2e/lab-04/dashboards.spec.ts` — Minor 3)**:
>    - เพิ่ม Step 6 ทดสอบการคลิกปุ่ม `requester-quick-action-create-ticket` (`+ Create Ticket` นำทางไปยังหน้าฟอร์มสร้างตั๋ว `submit-ticket-btn`) และปุ่ม `requester-quick-action-view-tickets` (`View My Tickets` นำทางไปยังหน้า `my-tickets-card` พร้อมตัวกรองสถานะเริ่มต้นเป็น `""`) ครบทั้งสองปุ่มครับ
> 4. **ผลการรันทดสอบซ้ำ**:
>    - `npx playwright test e2e/lab-04`: **9 passed (9)** ครบทั้ง `desktop`, `tablet`, และ `mobile`

#### 3.8.3 Review #2 — Approved (`titayaaa`, 2026-11-02)
> ### ✅ การตรวจประเมินรอบที่ 2 (Round 2 Review — APPROVED)
>
> ขอบคุณ @jejaebubu ที่ดำเนินการแก้ไขปรับปรุงครบถ้วนสมบูรณ์ทั้งประเด็น Required Change และข้อเสนอแนะเพิ่มเติมใน commit `6ba5ed1` อย่างรวดเร็วและประณีตมากค่ะ ตรวจสอบโค้ดและชุดทดสอบซ้ำอย่างละเอียดแล้ว:
>
> 1. **ความสมบูรณ์ของการบันทึกเอกสารและลิงก์ PR (Required 1)**:
>    - มีการเพิ่มลิงก์ `[GitHub #112](https://github.com/jejaebubu/toktickit/pull/112)` ในตาราง Section 2 แถวของ `PR-08` ครบถ้วนตามมาตรฐานเดียวกันกับ PR ก่อนหน้า
>    - มีการระบุ `- **PR URL:** [jejaebubu/toktickit#112](https://github.com/jejaebubu/toktickit/pull/112)` ใน Section 3.8 ชัดเจน
>    - บันทึกการรีวิวรอบที่ 1 และ Author Response ไว้อย่างเป็นระเบียบเรียบร้อย
>
> 2. **Negative Validation Test สำหรับ Result ตอน Complete Action (`e2e/lab-04/actions-taken-flow.spec.ts` — Minor 2)**:
>    - เพิ่ม Step 7 กดปุ่ม `action-save` ในขณะที่ช่อง Result ยังว่างอยู่ พร้อมตรวจสอบว่ามีข้อความแจ้งเตือน `action-result-error` (`/Result is required/i`) แสดงขึ้นมาก่อนกรอกข้อความจริง
>    - ยืนยันการบังคับใช้กฎ `BR-16` และ `AC-15` ในระดับ End-to-End ได้อย่างรัดกุมและสมบูรณ์แบบมากค่ะ
>
> 3. **E2E Quick Actions Test บน Requester Dashboard (`e2e/lab-04/dashboards.spec.ts` — Minor 3)**:
>    - เพิ่ม Step 6 ทดสอบการคลิกปุ่ม Quick Actions ของฝั่ง Requester ครบทั้ง 2 ปุ่ม:
>      - `requester-quick-action-create-ticket`: นำทางไปยังฟอร์มสร้างตั๋ว (`submit-ticket-btn`)
>      - `requester-quick-action-view-tickets`: นำทางไปยังหน้าตั๋วของฉัน (`my-tickets-card`) พร้อมรีเซ็ตตัวกรองสถานะเป็นค่าว่าง
>    - มีการเรียก `expectNoHorizontalOverflow(page)` ตรวจสอบความถูกต้องของเลย์เอาต์หลังคลิกทุกจุด
>
> 4. **ความครอบคลุมของการทดสอบและ Responsive Audit**:
>    - ชุดทดสอบ Playwright E2E รันผ่านครบทั้ง 9 เทสต์ (3 flow × 3 responsive viewports: Desktop 1280×800, Tablet 820×1180, Mobile 393×851)
>    - แบ็กเอนด์และคอมโพเนนต์อื่น ๆ ทำงานสอดคล้องกันได้อย่างไร้รอยต่อ
>
> ภาพรวมโค้ดและชุดทดสอบมีคุณภาพสูงมาก ยอดเยี่ยมมากค่ะ ขออนุมัติ (Approve) ให้ทันที และพร้อมให้ดำเนินการ Merge เข้าสู่สาขา `lab4-staging` ได้เลยค่ะ! 🎉🚀

**คำวินิจฉัย**: **APPROVED & MERGED** — Reviewer กด Merge PR #112 เข้าสู่สาขา `lab4-staging` เรียบร้อย (Merge SHA: `0ce99e8`) — **Closes Issue #8**

---

### 3.9 PR-09: Lab 1–3 Regression Test Suite and System Hardening (Issue #9)

- **PR URL:** [jejaebubu/toktickit#113](https://github.com/jejaebubu/toktickit/pull/113)
- **Branch:** `feature/lab04-issue9-regression` → `lab4-staging`
- **Author:** `@jejaebubu`
- **Reviewer:** `@titayaaa`
- **Objective:** ตรวจสอบความเข้ากันได้ย้อนหลังและการทำงานร่วมกันของทั้งระบบ (Zero Regression ตาม `AC-11`, `FR-12`) ครอบคลุมชุดทดสอบเดิมทั้งหมดของ Lab 1, Lab 2, Lab 3 ร่วมกับโมดูลใหม่ของ Lab 4 (Server Vitest 112 tests, Client Vitest 95 tests, และ Playwright E2E 27 tests บนทั้ง 3 Viewports: Desktop, Tablet, Mobile) รวม 234/234 tests ผ่าน 100% พร้อมปรับปรุงสคริปต์ `e2e/lab-03/staff-ticket-flow.spec.ts` ให้สเต็ปการเปลี่ยนสถานะเป็นไปตาม 9-state Transition Matrix (`Open -> In Progress -> Resolved`)
- **Status:** Approved & Merged (merge commit `5158f3a`)

#### 3.9.1 Review #1 — Request Changes (`titayaaa`, 2026-11-02)

**Verdict:** Changes Requested

**Review Comments:**

> ## 🔍 ผลการตรวจทาน PR #113: Full Regression of Lab 1–3 Suites with Lab 4 Features (Issue #9)
> ขอบคุณ @jejaebubu สำหรับการรวบรวมและรันชุดทดสอบ Full Regression Test Suite ทั้งหมดของระบบค่ะ ยอดเยี่ยมมากที่ผลการทดสอบผ่านครบ **234/234 tests (100%)** ครอบคลุมทั้ง Server Vitest (112 tests), Client Vitest (95 tests) และ Playwright E2E (27 runs บน Desktop, Tablet, Mobile) รวมทั้งการปรับสคริปต์ `e2e/lab-03/staff-ticket-flow.spec.ts` ให้สอดคล้องกับ 9-state transition matrix (`Open -> In Progress -> Resolved`)
> ภาพรวมถือว่าสมบูรณ์มากค่ะ แต่ขอส่งเป็น **Changes Requested** ก่อนเพื่อให้เพื่อนเก็บรายละเอียดความถูกต้องของเอกสารและชุดทดสอบให้เนี้ยบที่สุด 4 จุดดังนี้ค่ะ:
> ---
> ### 🔴 จุดที่ต้องแก้ไขก่อนอนุมัติ (Required Changes)
> #### 1. เพิ่มลิงก์ GitHub PR #113 ในตาราง Section 2 ของ `docs/lab-04/reviewer.md`
> - ในตาราง Section 2 (Master Review Table) แถวของ `PR-09` ในคอลัมน์แรก ปัจจุบันระบุเป็น:
>   ```markdown
>   | **PR-09** | Lab 1–3 regression test suite and system hardening | ...
>   ```
>   ซึ่ง PR อื่นๆ ทั้งหมดตั้งแต่ PR-01 ถึง PR-08 มีการใส่ลิงก์ GitHub PR ไว้อย่างสม่ำเสมอ รบกวนปรับให้เป็นรูปแบบเดียวกันดังนี้ค่ะ:
>   ```markdown
>   | **PR-09 ([GitHub #113](https://github.com/jejaebubu/toktickit/pull/113))** | Lab 1–3 regression test suite and system hardening | ...
>   ```
> #### 2. เพิ่มฟิลด์ `- **PR URL:**` ในหัวข้อ Section 3.9 ของ `docs/lab-04/reviewer.md`
> - ใน Section 3.9 บรรทัด Metadata เริ่มต้นที่ `- **Branch:**` ทันที โดยขาดลิงก์ PR URL:
>   รบกวนเพิ่ม `- **PR URL:** [jejaebubu/toktickit#113](https://github.com/jejaebubu/toktickit/pull/113)` ใต้หัวข้อให้ครบถ้วนเหมือนกับ Section 3.8 ค่ะ
>
> ### 🟠 ข้อสังเกตและจุดแนะนำเพิ่มเติม (Improvement Suggestions)
> #### 3. ป้องกัน Race Condition และ False Pass ใน `e2e/lab-03/staff-ticket-flow.spec.ts` (บรรทัด 91–95)
> - เนื่องจากข้อความแจ้งเตือน detail-notice ("Ticket updated successfully.") แสดงขึ้นมาตั้งแต่ตอนเปลี่ยนเป็น In Progress แล้ว การสั่ง expect ข้อความเดิมซ้ำที่บรรทัด 95 จะกลายเป็น Immediate Pass (False Positive) ทันที โดยที่ Playwright อาจจะยังไม่ได้รอให้ Request การเปลี่ยนเป็น Resolved ส่งถึงเซิร์ฟเวอร์เสร็จสิ้นจริง แนะนำให้เพิ่มการตรวจสอบค่าของ `<select>` เช่น `await expect(page.locator('[data-testid="detail-status-select"]')).toHaveValue("Resolved");` จะช่วยให้ชุดทดสอบแข็งแกร่งและป้องกัน Flaky test บนเครื่องที่มีความหน่วงได้ดีขึ้นมากค่ะ
> #### 4. เติมหมายเลข PR ในตารางผลการทดสอบ `docs/lab-04/tests.md`
> - ในตาราง Section 2 แถว PR-09 ปัจจุบันบันทึกเป็น `**Pass** (review pending)` แนะนำให้ระบุเป็น `**Pass** (PR #113, review pending)` เพื่อให้สอดคล้องกับแถว PR-05 ถึง PR-08 ค่ะ

#### 3.9.2 Author Response & Resolution (`jejaebubu`)

> ขอบคุณ @titayaaa สำหรับรีวิวและการตรวจทานอย่างละเอียดรอบคอบมากครับ ดำเนินการปรับปรุงแก้ไขครบถ้วนทั้ง 4 จุดเรียบร้อยแล้วครับ:
>
> 1. **เพิ่มลิงก์ GitHub PR #113 ใน Section 2 Master Review Table (`docs/lab-04/reviewer.md` — Required 1)**:
>    - อัปเดตคอลัมน์แรกของแถว `PR-09` เป็น `**PR-09 ([GitHub #113](https://github.com/jejaebubu/toktickit/pull/113))**` เรียบร้อยตามรูปแบบมาตรฐานเดียวกับ PR-01 ถึง PR-08 ครับ
> 2. **เพิ่มฟิลด์ PR URL ใน Section 3.9 (`docs/lab-04/reviewer.md` — Required 2)**:
>    - เพิ่ม `- **PR URL:** [jejaebubu/toktickit#113](https://github.com/jejaebubu/toktickit/pull/113)` ภายใต้หัวข้อ Section 3.9 ครบถ้วนตามมาตรฐานเดียวกันกับ Section 3.8 ครับ
> 3. **ป้องกัน Race Condition และ False Positive ใน `e2e/lab-03/staff-ticket-flow.spec.ts` (Improvement 3)**:
>    - เพิ่มการตรวจสอบค่า `<select>` ชัดเจนทั้ง 2 สเต็ป:
>      - `await expect(page.locator('[data-testid="detail-status-select"]')).toHaveValue("In Progress");`
>      - `await expect(page.locator('[data-testid="detail-status-select"]')).toHaveValue("Resolved");`
>      ก่อนรอ notice และจับภาพหน้าจอ ยืนยันว่าค่าใน DOM ถูกอัปเดตตรงกับ State ของเครื่องเซิร์ฟเวอร์จริงและกำจัดโอกาสเกิด Flaky test เรียบร้อยครับ
> 4. **อัปเดตตารางผลการทดสอบใน `docs/lab-04/tests.md` (Improvement 4)**:
>    - ปรับสถานะแถว `PR-09` เป็น `**Pass** (PR #113, review addressed)` เรียบร้อยครับ
> 5. **ผลการรันทดสอบ Regression ซ้ำ**:
>    - E2E Lab 3 (`e2e/lab-03/staff-ticket-flow.spec.ts`): รันผ่านครบ 3/3 runs บนทุก Viewports (Desktop, Tablet, Mobile)
>    - ชุดทดสอบทั้งหมดยังคงผ่านครบถ้วนสมบูรณ์ **234/234 tests (100% Pass)** ปราศจาก regression ครับ

#### 3.9.3 Review #2 — Approved (`titayaaa`, 2026-11-02)

**Verdict:** Approved (no blocking issues)

**Review Comments:**

> ### ✅ การตรวจประเมินรอบที่ 2 (Round 2 Review — APPROVED)
>
> ขอบคุณ @jejaebubu ที่ดำเนินการแก้ไขปรับปรุงครบถ้วนสมบูรณ์ทั้ง 4 จุดใน commit `abb8ea3` อย่างรวดเร็วและประณีตมากค่ะ ตรวจสอบโค้ดและเอกสารซ้ำอย่างละเอียดแล้ว:
>
> 1. **ความสมบูรณ์ของเอกสารและลิงก์ PR (Required 1 & 2)**:
>    - เพิ่มลิงก์ `[GitHub #113](https://github.com/jejaebubu/toktickit/pull/113)` ในตาราง Section 2 และระบุ `- **PR URL:**` ใน Section 3.9 ของ `docs/lab-04/reviewer.md` ครบถ้วนตามมาตรฐานเดียวกันกับทุก PR ก่อนหน้า
>    - บันทึก Review Log รอบที่ 1 และ Author Response ไว้อย่างเป็นระเบียบและโปร่งใส
> 2. **ความเสถียรของชุดทดสอบ E2E (Improvement 3)**:
>    - ปรับปรุง `e2e/lab-03/staff-ticket-flow.spec.ts` ด้วยการเพิ่ม `toHaveValue("In Progress")` และ `toHaveValue("Resolved")` เพื่อตรวจสอบค่าจริงของ `<select>` ก่อนตรวจสอบ notice และบันทึกภาพหน้าจอ ช่วยขจัดปัญหา Race Condition และการเกิด Flaky test ได้อย่างสมบูรณ์แบบ
> 3. **ความสอดคล้องของบันทึกผลการทดสอบ (Improvement 4)**:
>    - อัปเดตตารางสรุปใน `docs/lab-04/tests.md` เป็น `**Pass** (PR #113, review addressed)` และยืนยันผล `REG-01` ครบถ้วน
> 4. **ผลการทดสอบ Full Regression Suite**:
>    - ชุดทดสอบเดิมตั้งแต่ Lab 1 ถึง Lab 3 ร่วมกับโมดูลใหม่ของ Lab 4 ผ่านครบถ้วนสมบูรณ์ **234/234 tests (100% Pass)** ปราศจาก regression ตามข้อกำหนด `AC-11` และ `FR-12`
>
> ภาพรวมของโค้ด ชุดทดสอบ และเอกสารมีคุณภาพสูงมาก ขอ **Approve** ให้ทันที และพร้อมให้ดำเนินการ Merge เข้าสู่สาขา `lab4-staging` ได้เลยค่ะ!

**คำวินิจฉัย**: **APPROVED & MERGED** — Reviewer กด Merge PR #113 เข้าสู่สาขา `lab4-staging` เรียบร้อย (Merge SHA: `5158f3a`) — **Closes Issue #9**

---

### 3.10 PR-10: Zen Green UI Polish, Accessibility, Responsive Viewports, and Screenshots (Issue #10)

- **PR URL:** [jejaebubu/toktickit#114](https://github.com/jejaebubu/toktickit/pull/114)
- **Branch:** `feature/lab04-issue10-ui-polish` → `lab4-staging`
- **Author:** `@jejaebubu`
- **Reviewer:** `@titayaaa`
- **Objective:** ปรับแต่ง UI ให้สอดคล้องกับภาษาการออกแบบ Zen Green Theme อย่างสมบูรณ์แบบ, ตรวจสอบและยกระดับการเข้าถึงที่เท่าเทียม (Accessibility ตามเกณฑ์ WCAG 2.1 AA) ครอบคลุม touch target size $\ge 44 \times 44\text{px}$, การระบุ `aria-required="true"`, การเชื่อมโยง Label ด้วย `htmlFor`, การแสดงผลแจ้งเตือนด้วย `role="alert"`, การรองรับ 3 Viewports โดยปราศจาก Horizontal Overflow (`overflow-x: hidden`), การเพิ่มชุดทดสอบอัตโนมัติ `A11Y-01` (`client/tests/lab-04/ActionsTaken.test.tsx`) และการจัดเก็บชุดภาพสกรีนช็อต Full Page ครบทั้ง 24 ภาพใน `artifacts/lab-04/screenshots/`
- **Status:** Approved & Merged (merge commit `d785a4c`)

#### 3.10.1 Review #1 — Request Changes (`titayaaa`, 2026-11-02)

**Verdict:** Changes Requested

**Review Comments:**

> ### PR-10 Review: Changes Requested (ขอฝากเก็บรายละเอียดเอกสารและลิงก์ PR นิดเดียวค่ะ ✨)
>
> ขอบคุณ @jejaebubu สำหรับการปรับปรุง Zen Green UI, Accessibility ตามมาตรฐาน WCAG 2.1 AA, ชุดทดสอบ `A11Y-01`, และการบันทึกภาพ Full Page Screenshots ครบทั้ง 24 ภาพบน 3 Viewports (Desktop, Tablet, Mobile) ได้อย่างประณีตและสวยงามมากค่ะ
>
> ภาพรวมด้านโค้ดและดีไซน์ทำไว้ดีมากแล้วค่ะ แต่ขอฝากปรับแก้ความสมบูรณ์ของเอกสารและลิงก์ PR อีก 3 จุดเล็ก ๆ เพื่อให้ตรงตามมาตรฐานเดียวกันกับ PR ก่อนหน้าค่ะ:
>
> ---
>
> #### 🔴 จุดที่ต้องปรับแก้ (Required Changes):
> 1. **เติมลิงก์ GitHub PR #114 ในตาราง Master Review (`docs/lab-04/reviewer.md`)**:
>    - ในตาราง Section 2 แถวของ `PR-10`: รบกวนปรับจาก `**PR-10**` เป็น `**PR-10 ([GitHub #114](https://github.com/jejaebubu/toktickit/pull/114))**` ให้มีลิงก์เหมือนกับแถว PR-04 ถึง PR-09 ค่ะ
> 2. **เพิ่ม PR URL ใน Section 3.10 (`docs/lab-04/reviewer.md`)**:
>    - ในหัวข้อ Section 3.10 รบกวนเพิ่มบรรทัด `- **PR URL:** [jejaebubu/toktickit#114](https://github.com/jejaebubu/toktickit/pull/114)` ใต้บรรทัด `- **Branch:**` ค่ะ
> 3. **ระบุเลข PR ในตารางสรุปผลทดสอบ (`docs/lab-04/tests.md`)**:
>    - ในแถว `PR-10` ของตารางสรุปผลการรัน แนะนำให้ปรับเป็น `**Pass** (PR #114, review pending)` เพื่อให้สอดคล้องกับแถวอื่น ๆ ค่ะ
>
> ---
>
> #### 💡 ข้อเสนอแนะเพิ่มเติมเพื่อความสมบูรณ์แบบ (Minor Test Polish):
> 4. **เพิ่มการทดสอบ Dynamic `aria-required="true"` บน `action-result` (`ActionsTaken.test.tsx`)**:
>    - ในเคส `A11Y-01` ปัจจุบันตรวจสอบ `expect(resultInput).toHaveAttribute("aria-required", "false")` ตอนฟอร์มเปิดเริ่มต้น หากลองเพิ่มสเต็ปเลือกสถานะ `COMPLETED` ใน `action-status` แล้ว assert ตรวจสอบว่า `resultInput` เปลี่ยนเป็น `aria-required="true"` จะช่วยยืนยัน dynamic behavior ตามที่ระบุไว้ใน PR description ได้สมบูรณ์แบบ 100% เลยค่ะ
> 5. **เตรียมอัปเดต `docs/lab-04/ai-use.md` และ `README.md` ใน PR-11**:
>    - ตามที่ระบุไว้ใน Issue #102 ฝากเตรียมอัปเดตบันทึก Coding-Agent reflection ใน `ai-use.md` และคำแนะนำการ Setup/Test ใน `README.md` ในขั้นตอน PR-11 (Sprint 4 Documentation and Release) ด้วยนะคะ

#### 3.10.2 Author Response & Resolution (`jejaebubu`)

> ขอบคุณ @titayaaa สำหรับการตรวจทานและข้อเสนอแนะที่ช่วยให้เอกสารและชุดทดสอบสมบูรณ์แบบยิ่งขึ้นครับ ดำเนินการปรับปรุงครบถ้วนทุกข้อเรียบร้อยแล้วครับ:
>
> 1. **เติมลิงก์ GitHub PR #114 ในตาราง Section 2 (`docs/lab-04/reviewer.md` — Required 1)**:
>    - อัปเดตแถว `PR-10` เป็น `**PR-10 ([GitHub #114](https://github.com/jejaebubu/toktickit/pull/114))**` ครบถ้วนตามมาตรฐานเดียวกับ PR อื่น ๆ
> 2. **เพิ่ม PR URL ใน Section 3.10 (`docs/lab-04/reviewer.md` — Required 2)**:
>    - เพิ่ม `- **PR URL:** [jejaebubu/toktickit#114](https://github.com/jejaebubu/toktickit/pull/114)` ใต้หัวข้อ Section 3.10 พร้อมบันทึก Review Log ไว้อย่างเป็นระเบียบ
> 3. **ระบุหมายเลข PR ใน `docs/lab-04/tests.md` (Required 3)**:
>    - ปรับแถว `PR-10` ในตาราง Section 4 เป็น `**Pass** (PR #114, review pending)`
> 4. **เพิ่มการทดสอบ Dynamic `aria-required="true"` บน Result (`ActionsTaken.test.tsx` — Minor 4)**:
>    - เพิ่มการทดสอบเลือกสถานะ `COMPLETED` แล้ว assert `expect(screen.getByTestId("action-result")).toHaveAttribute("aria-required", "true")` ในเคส `A11Y-01` ผ่านฉลุย 100%
> 5. **เตรียมความพร้อมสำหรับ PR-11 (Minor 5)**:
>    - รับทราบข้อเสนอแนะเรื่องการอัปเดต `ai-use.md` และ `README.md` โดยจะดำเนินการอย่างละเอียดใน PR-11 (Release) ตามแผนครับ

#### 3.10.3 Review #2 — Approved (`titayaaa`, 2026-11-02)

**Verdict:** Approved (no blocking issues)

**Review Comments:**

> ### ✅ การตรวจประเมินรอบที่ 2 (Round 2 Review — APPROVED)
>
> ขอบคุณ @jejaebubu ที่ดำเนินการแก้ไขปรับปรุงครบถ้วนสมบูรณ์ทั้งประเด็นเอกสาร ลิงก์ PR และการเพิ่มเคสทดสอบ dynamic validation ใน commit `2182896` อย่างรวดเร็วและประณีตมากค่ะ ตรวจสอบโค้ดและเอกสารซ้ำอย่างละเอียดแล้ว:
>
> 1. **ความสมบูรณ์ของเอกสารและลิงก์ PR (Required 1 & 2)**:
>    - เพิ่มลิงก์ `[GitHub #114](https://github.com/jejaebubu/toktickit/pull/114)` ในตาราง Section 2 และระบุ `- **PR URL:**` ใน Section 3.10 ของ `docs/lab-04/reviewer.md` ครบถ้วนตามมาตรฐานเดียวกันกับทุก PR ก่อนหน้า
>    - บันทึก Review Log รอบที่ 1 และ Author Response ไว้อย่างเป็นระเบียบและโปร่งใส
> 2. **ความสอดคล้องของตารางสรุปผลการทดสอบ (Required 3)**:
>    - อัปเดตตารางสรุปใน `docs/lab-04/tests.md` แถว `PR-10` เป็น `**Pass** (PR #114, review pending)` ถูกต้องเรียบร้อย
> 3. **Dynamic `aria-required="true"` Verification (`ActionsTaken.test.tsx` — Minor 4)**:
>    - เพิ่มขั้นตอนการเลือกสถานะ `COMPLETED` ใน `action-status` แล้ว assert ตรวจสอบว่าช่อง `action-result` เปลี่ยนเป็น `aria-required="true"` ในเคส `A11Y-01` ได้อย่างรัดกุมและสมบูรณ์แบบ 100%
> 4. **ความสมบูรณ์ของ Artifacts & Viewports**:
>    - ภาพ Full Page Screenshots ครบทั้ง 24 ภาพใน `artifacts/lab-04/screenshots/` ครอบคลุมทั้ง 3 Viewports (Desktop, Tablet, Mobile)
>    - ปราศจากปัญหา Horizontal Overflow และเป็นไปตามมาตรฐานการออกแบบ Zen Green และ WCAG 2.1 AA
>
> ภาพรวมของโค้ด ชุดทดสอบ และเอกสารมีคุณภาพสูงมาก ยอดเยี่ยมมากค่ะ ขออนุมัติ (**Approve**) ให้ทันที และพร้อมให้ดำเนินการ Merge เข้าสู่สาขา `lab4-staging` ได้เลยค่ะ!

**คำวินิจฉัย**: **APPROVED & MERGED** — Reviewer กด Merge PR #114 เข้าสู่สาขา `lab4-staging` เรียบร้อย (Merge SHA: `d785a4c`) — **Closes Issue #10**

---

### 3.11 PR-11: Sprint 4 Documentation and Release Integration to Main (Issue #11)

- **PR URL:** [jejaebubu/toktickit#115](https://github.com/jejaebubu/toktickit/pull/115)
- **Branch:** `release/lab04-staging-to-main` → `main`
- **Author:** `@jejaebubu`
- **Reviewer:** `@titayaaa`
- **Objective:** ตรวจสอบและส่งมอบระบบ TokTickIT ฉบับสมบูรณ์สำหรับ Sprint 4 เข้าสู่สาขาหลัก (`main`) ตามเกณฑ์ Handout Section 11.1 ครอบคลุมการอัปเดต `docs/lab-04/ai-use.md` (Key Prompts 1–11 และ Coding-Agent reflection), การอัปเดต `README.md` (โครงสร้างโปรเจกต์, คู่มือการติดตั้ง, คำสั่งรันเทสต์, Seed data, และฟีเจอร์หลัก), การกระทบยอดผลการทดสอบครบ 235 tests (Server 112, Client 96, E2E 27 runs) ผ่าน 100%, และการยืนยัน Zero Regression จาก Lab 1–3
- **Status:** Review Round 1 Addressed (รอ Reviewer ตรวจประเมินรอบ 2 และกด Merge เข้าสู่ `main`)

#### 3.11.1 Review #1 — Changes Requested (`titayaaa`, 2026-11-02)

**Verdict:** Changes Requested

> ขอบคุณ @jejaebubu สำหรับการรวบรวมฟีเจอร์ เอกสาร และผลการทดสอบทั้งหมดของ Sprint 4 เพื่อเตรียม Release เข้าสู่สาขาหลัก `main` ค่ะ ภาพรวมเอกสารและการจัดโครงสร้างทำได้ประณีตและครอบคลุมมาก:
> - `README.md`: อัปเดตโครงสร้างไดเรกทอรี, คู่มือติดตั้ง, ตาราง Seed Data 11 บัญชี, คำสั่งรันเทสต์ และสรุปฟีเจอร์หลักทั้ง 4 ด้านของ Lab 4 ไว้อย่างชัดเจนและอ่านง่ายมาก
> - `docs/lab-04/ai-use.md`: บันทึก Key Prompts (Prompt 8–11) และเขียน Reflection ของ Coding-Agent และบทสรุปภาพรวม Sprint 4 ได้อย่างลึกซึ้งและโปร่งใส
> - `docs/lab-04/tests.md` & `reviewer.md`: สะท้อนผลการทดสอบครบ 235 tests (Server 112, Client 96, E2E 27 runs) ผ่าน 100% ปราศจาก regression จาก Lab 1–3
>
> เนื่องจาก PR นี้เป็น Release PR ที่จะผสานโค้ดเข้าสู่สาขาหลัก (`main`) เป็นชุดสุดท้าย เพื่อให้เอกสารบน `main` มีความสมบูรณ์และเชื่อมโยงร่องรอยการตรวจสอบ (Traceability) ได้ 100% ขอส่งเป็น **Changes Requested** เพื่อให้เพื่อนเติมลิงก์ PR #115 อีก 3 จุดเล็กน้อยก่อนกด Approve & Merge นะคะ:
>
> ---
>
> ### 🔴 จุดที่ต้องปรับแก้ก่อนอนุมัติ (Required Changes)
> #### 1. เติมลิงก์ GitHub PR #115 ในตาราง Section 2 ของ `docs/lab-04/reviewer.md`
> - ในตาราง Section 2 แถว `PR-11` คอลัมน์แรก ปัจจุบันระบุเป็น:
>   ```markdown
>   | **PR-11** | Sprint 4 documentation and release integration to main | ...
>   ```
>   เพื่อให้ตรงตามฟอร์แมตของ PR-01 ถึง PR-10 ที่มี hyperlink ชี้ไปยัง PR รบกวนปรับเป็น:
>   ```markdown
>   | **PR-11 ([GitHub #115](https://github.com/jejaebubu/toktickit/pull/115))** | Sprint 4 documentation and release integration to main | ...
>   ```
>
> #### 2. เพิ่มฟิลด์ - **PR URL:** ใน Section 3.11 ของ docs/lab-04/reviewer.md
> ในหัวข้อ Section 3.11 บรรทัดแรกใต้หัวข้อ ปัจจุบันเริ่มต้นที่ - **Branch:** ทันที:
> ```markdown
> ### 3.11 PR-11: Sprint 4 Documentation and Release Integration to Main (Issue #11)
> - **Branch:** `release/lab04-staging-to-main` → `main`
> - **Author:** `@jejaebubu`
> ```
> รบกวนเพิ่มบรรทัดลิงก์ PR URL ให้ครบถ้วนเหมือนกับ Section 3.1 ถึง 3.10 ดังนี้ค่ะ:
> ```markdown
> ### 3.11 PR-11: Sprint 4 Documentation and Release Integration to Main (Issue #11)
> - **PR URL:** [jejaebubu/toktickit#115](https://github.com/jejaebubu/toktickit/pull/115)
> - **Branch:** `release/lab04-staging-to-main` → `main`
> - **Author:** `@jejaebubu`
> ```
>
> 🟠 ข้อเสนอแนะเพิ่มเติมเพื่อความสมบูรณ์แบบ (Improvement Suggestion)
> #### 3. ระบุหมายเลข PR #115 ในตารางผลการทดสอบ docs/lab-04/tests.md
> ในตารางสรุป Section 2 แถว PR-11 ปัจจุบันระบุเป็น:
> ```markdown
> | **PR-11** | Issue #11 | 2026-11-02 | Release Verification on main branch | 112 server + 96 client + 27 Playwright E2E = 235 total tests | Pass (review pending) |
> ```
> แนะนำให้ระบุหมายเลข PR เพิ่มเติมเป็น **Pass** (PR #115, review pending) เพื่อให้สอดคล้องกับแถว PR-05 ถึง PR-10 ค่ะ
>
> ฝากเก็บรายละเอียด 3 จุดนี้แล้ว push อัปเดต commit เข้ามาอีกครั้งนะคะ เดี๋ยวจะรีบเข้ามาตรวจซ้ำและกด Approve & Merge เข้าสู่ main ให้ทันทีเลยค่ะ ขอบคุณมากค่ะ

#### 3.11.2 Author Response & Resolution (`jejaebubu`)

> ขอบคุณ @titayaaa สำหรับการตรวจทาน Release PR อย่างละเอียดและรวดเร็วมากครับ ดำเนินการแก้ไขปรับปรุงครบทั้ง 3 จุดเรียบร้อยแล้วครับ:
>
> 1. **เติมลิงก์ GitHub PR #115 ใน Section 2 (`docs/lab-04/reviewer.md` — Required 1)**:
>    - ปรับเป็น `| **PR-11 ([GitHub #115](https://github.com/jejaebubu/toktickit/pull/115))** |` สอดคล้องตามมาตรฐานทุก PR
> 2. **เพิ่มฟิลด์ `- **PR URL:**` ใน Section 3.11 (`docs/lab-04/reviewer.md` — Required 2)**:
>    - เพิ่มลิงก์ `- **PR URL:** [jejaebubu/toktickit#115](https://github.com/jejaebubu/toktickit/pull/115)` ใต้หัวข้อ Section 3.11 พร้อมบันทึก Review Trail ไว้อย่างเป็นระเบียบ
> 3. **ระบุหมายเลข PR ในตารางผลการทดสอบ (`docs/lab-04/tests.md` — Improvement 3)**:
>    - ปรับสถานะแถว `PR-11` เป็น `**Pass** (PR #115, review pending)` สอดคล้องกับทุก PR ก่อนหน้า

---

## 4. Full Review Trail — Partner Repository Reviews (`titayaaa/toktickit`)

### 4.1 PR #75: Issue 27: Sprint 4 Engineering Contract & Specification (`titayaaa/toktickit`)

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

---

---

### 4.2 PR #76: feat(db): ActionTaken model, migration, idempotent seed, and verification tests (Issue #64) (`titayaaa/toktickit`)

- **PR URL:** [titayaaa/toktickit#76](https://github.com/titayaaa/toktickit/pull/76)
- **Author:** `@titayaaa` (ฑิตญา ผ่องสกุล)
- **Reviewer:** `@jejaebubu` (GitHub: [jejaebubu](https://github.com/jejaebubu))
- **Source Branch:** `feature/28-db-and-seed`
- **Target Branch:** `lab4-staging`
- **Current Status:** Approved & Merged (merge commit `33922325eed3ee5deba3f7872f8b2193ef8bce8a`, 2026-11-01T11:03:13Z)
- **Merged by:** `@jejaebubu`
- **Latest Reviewed Commit:** `018981d77b068a31d3ee0250e535ed9ccd4b4111`

#### 4.2.1 Review #1 — CHANGES_REQUESTED (`jejaebubu`, 2026-10-31T20:38:29Z)

**Verdict:** CHANGES_REQUESTED (commit `aade062`)

**Verbatim Review Comments:**

> ตรวจ schema, migration, seed, tests และ docs เทียบกับ Issue/BR แล้วนะคะ โดยรวมทำได้ดี แต่ขอ **Changes Requested** ก่อนค่ะ เพราะมีจุดหนึ่งที่อาจกระทบการสร้าง `ActionTaken` ใน Issue ถัดไป
> 
> **🔴 Blocking: Seed กำหนด `ActionTaken.id` เอง ทำให้ sequence ไม่ขยับตาม**
> 
> ใน `server/prisma/seed.ts:311-449` มีการใช้ `id: 1..6` ใน `actionTaken.upsert`
> 
> ปัญหาที่พบเมื่อเริ่มจาก DB ใหม่ แล้วรัน `db push --force-reset` ตามด้วย `npm run prisma:seed` คือ
> 
> - `actions_taken_id_seq.last_value = 1`
> - แต่ `MAX(actions_taken.id) = 6`
> - พอเรียก `prisma.actionTaken.create()` จะเจอ error `P2002` ที่ target `id` เพราะ sequence สร้าง ID ซ้ำกับข้อมูลที่มีอยู่แล้ว
> 
> ถ้าปล่อยไว้ API ที่ใช้สร้าง `ActionTaken` ใน Issue ถัดไปจะไม่สามารถ insert ข้อมูลได้ค่ะ
> 
> **แนวทางแก้ที่แนะนำ**
> - เอา `id` ออกจาก seed แล้วใช้ natural key ในการ upsert เช่น `ticketId + actionDateTime + actionDescription`
> - หรือถ้าต้องการใช้ explicit ID ต่อ ให้เรียก `setval` เพื่อปรับ sequence หลัง seed ให้ตรงกับ ID สูงสุด
> 
> และรบกวนเพิ่ม test ที่ลองสร้าง `ActionTaken` ใหม่ 1 รายการหลัง seed ด้วยนะคะ เพื่อป้องกันปัญหานี้กลับมาอีก
> 
> ปัญหา sequence แบบเดียวกันมีอยู่เดิมใน `publicComment` และ `internalNote` ด้วย โดย full suite บน clean seed fail 6 tests ซึ่งเป็นปัญหาที่มีอยู่ใน base อยู่แล้ว แต่ PR นี้เพิ่มความเสี่ยงใหม่ให้ `ActionTaken` ค่ะ อย่างน้อยขอให้แก้ `ActionTaken` ก่อน และถ้าจะแก้ seed รอบนี้ แนะนำให้จัดการทั้ง 3 ตารางไปพร้อมกันเลยค่ะ
> 
> **🟠 Should fix: `requesterId` hardcode**
> 
> ใน `server/prisma/seed.ts:360,459,480` มีการกำหนด `requesterId: 1/2/3` ไว้ตรง ๆ
> 
> ถ้าเอา seed ไปรันบน DB ที่มี Requester ID ไม่ตรงกับ fresh DB อาจทำให้ ticket ไปผูกกับ requester ผิดคน หรือเกิด FK error ได้ค่ะ
> 
> แนะนำให้ lookup `RequesterUser` จาก email ก่อน แล้วนำ `.id` ที่ได้มาใช้แทนการ hardcode ค่ะ
> 
> **🟡 Minor: จุดที่แนะนำให้เก็บเพิ่ม**
> 
> - `docs/lab-04/reviewer.md:672` ระบุ `782d54e / db7e326` เป็น commit ที่เกี่ยวข้อง แต่ทั้งสองเป็น fix/docs commit ไม่ใช่ merge commit โดย merge commit ของ PR #106 คือ `23166db`
> - `server/prisma/seed.ts:350` ประกาศ `staffCharlie` ไว้แต่ไม่ได้ใช้งาน
> - เพิ่ม negative test อีก 2 กรณี:
>   - `followUpRequired=false` แล้ว `followUpNote=null`
>   - เมื่อ status เป็น `IN_PROGRESS` แล้ว `result=null`
> - `server/prisma/seed.ts:290` มี indentation ไม่สม่ำเสมอ เป็นแค่เรื่อง formatting ค่ะ
> 
> **✅ ผลตรวจสอบที่ผ่านแล้ว**
> 
> - `npm run build` ผ่าน
> - Migration SQL สามารถ apply ซ้ำ 2 ครั้งได้
> - `db-seed.test.ts` ผ่าน 10/10
> - Full suite ผ่าน 128 tests และ fail 6 tests โดยทั้ง 6 ตัวเป็นปัญหาเดิมที่มีอยู่ใน base ได้แก่ attachment ไม่มีใน seed และ explicit comment/note IDs ไม่ใช่ regression ใหม่จาก PR นี้
> - `prisma migrate deploy` บน DB ใหม่ยังติดที่ base migration `20260917000000_lab3_users_and_workflow` เพราะ `TicketPriority` missing ซึ่งเป็นปัญหาเดิม ไม่ได้เกิดจาก PR นี้ค่ะ
> 
> **สรุป:** โครงสร้าง schema, migration และ tests ทำได้ดี และตรงกับ BR หลักแล้วค่ะ แต่ขอให้แก้เรื่อง `ActionTaken` sequence ก่อน merge และแนะนำให้แก้ `requesterId` ที่ hardcode ไว้ด้วย หลังแก้แล้ว ping กลับมาให้ re-review ได้เลยค่ะ


#### 4.2.2 Author Response #1 (`titayaaa`, 2026-10-31T21:02:41Z)

> > ตรวจ schema, migration, seed, tests และ docs เทียบกับ Issue/BR แล้วนะคะ โดยรวมทำได้ดี แต่ขอ **Changes Requested** ก่อนค่ะ เพราะมีจุดหนึ่งที่อาจกระทบการสร้าง `ActionTaken` ใน Issue ถัดไป
> > 
> > **🔴 Blocking: Seed กำหนด `ActionTaken.id` เอง ทำให้ sequence ไม่ขยับตาม**
> > 
> > ใน `server/prisma/seed.ts:311-449` มีการใช้ `id: 1..6` ใน `actionTaken.upsert`
> > 
> > ปัญหาที่พบเมื่อเริ่มจาก DB ใหม่ แล้วรัน `db push --force-reset` ตามด้วย `npm run prisma:seed` คือ
> > 
> > * `actions_taken_id_seq.last_value = 1`
> > * แต่ `MAX(actions_taken.id) = 6`
> > * พอเรียก `prisma.actionTaken.create()` จะเจอ error `P2002` ที่ target `id` เพราะ sequence สร้าง ID ซ้ำกับข้อมูลที่มีอยู่แล้ว
> > 
> > ถ้าปล่อยไว้ API ที่ใช้สร้าง `ActionTaken` ใน Issue ถัดไปจะไม่สามารถ insert ข้อมูลได้ค่ะ
> > 
> > **แนวทางแก้ที่แนะนำ**
> > 
> > * เอา `id` ออกจาก seed แล้วใช้ natural key ในการ upsert เช่น `ticketId + actionDateTime + actionDescription`
> > * หรือถ้าต้องการใช้ explicit ID ต่อ ให้เรียก `setval` เพื่อปรับ sequence หลัง seed ให้ตรงกับ ID สูงสุด
> > 
> > และรบกวนเพิ่ม test ที่ลองสร้าง `ActionTaken` ใหม่ 1 รายการหลัง seed ด้วยนะคะ เพื่อป้องกันปัญหานี้กลับมาอีก
> > 
> > ปัญหา sequence แบบเดียวกันมีอยู่เดิมใน `publicComment` และ `internalNote` ด้วย โดย full suite บน clean seed fail 6 tests ซึ่งเป็นปัญหาที่มีอยู่ใน base อยู่แล้ว แต่ PR นี้เพิ่มความเสี่ยงใหม่ให้ `ActionTaken` ค่ะ อย่างน้อยขอให้แก้ `ActionTaken` ก่อน และถ้าจะแก้ seed รอบนี้ แนะนำให้จัดการทั้ง 3 ตารางไปพร้อมกันเลยค่ะ
> > 
> > **🟠 Should fix: `requesterId` hardcode**
> > 
> > ใน `server/prisma/seed.ts:360,459,480` มีการกำหนด `requesterId: 1/2/3` ไว้ตรง ๆ
> > 
> > ถ้าเอา seed ไปรันบน DB ที่มี Requester ID ไม่ตรงกับ fresh DB อาจทำให้ ticket ไปผูกกับ requester ผิดคน หรือเกิด FK error ได้ค่ะ
> > 
> > แนะนำให้ lookup `RequesterUser` จาก email ก่อน แล้วนำ `.id` ที่ได้มาใช้แทนการ hardcode ค่ะ
> > 
> > **🟡 Minor: จุดที่แนะนำให้เก็บเพิ่ม**
> > 
> > * `docs/lab-04/reviewer.md:672` ระบุ `782d54e / db7e326` เป็น commit ที่เกี่ยวข้อง แต่ทั้งสองเป็น fix/docs commit ไม่ใช่ merge commit โดย merge commit ของ PR #106 คือ `23166db`
> > * `server/prisma/seed.ts:350` ประกาศ `staffCharlie` ไว้แต่ไม่ได้ใช้งาน
> > * เพิ่ม negative test อีก 2 กรณี:
> >   
> >   * `followUpRequired=false` แล้ว `followUpNote=null`
> >   * เมื่อ status เป็น `IN_PROGRESS` แล้ว `result=null`
> > * `server/prisma/seed.ts:290` มี indentation ไม่สม่ำเสมอ เป็นแค่เรื่อง formatting ค่ะ
> > 
> > **✅ ผลตรวจสอบที่ผ่านแล้ว**
> > 
> > * `npm run build` ผ่าน
> > * Migration SQL สามารถ apply ซ้ำ 2 ครั้งได้
> > * `db-seed.test.ts` ผ่าน 10/10
> > * Full suite ผ่าน 128 tests และ fail 6 tests โดยทั้ง 6 ตัวเป็นปัญหาเดิมที่มีอยู่ใน base ได้แก่ attachment ไม่มีใน seed และ explicit comment/note IDs ไม่ใช่ regression ใหม่จาก PR นี้
> > * `prisma migrate deploy` บน DB ใหม่ยังติดที่ base migration `20260917000000_lab3_users_and_workflow` เพราะ `TicketPriority` missing ซึ่งเป็นปัญหาเดิม ไม่ได้เกิดจาก PR นี้ค่ะ
> > 
> > **สรุป:** โครงสร้าง schema, migration และ tests ทำได้ดี และตรงกับ BR หลักแล้วค่ะ แต่ขอให้แก้เรื่อง `ActionTaken` sequence ก่อน merge และแนะนำให้แก้ `requesterId` ที่ hardcode ไว้ด้วย หลังแก้แล้ว ping กลับมาให้ re-review ได้เลยค่ะ
> 
> ขอบคุณสำหรับคำแนะนำและการตรวจทานที่ละเอียดรอบคอบมาก ๆ ค่ะ แก้ไขครบถ้วนทุกจุดตามคำแนะนำทั้งระดับ Blocking, Should Fix และ Minor ใน commit `06e01c2` ดังนี้ค่ะ:
> 
> 1. **🔴 แก้ปัญหา PostgreSQL Sequence ไม่ขยับตาม Explicit ID:**
>    - ใน `server/prisma/seed.ts` เพิ่มคำสั่ง `setval` ซิงค์ sequence ของทั้ง 3 ตาราง (`actions_taken`, `public_comments`, `internal_notes`) ให้ตรงกับ `MAX(id)` ของข้อมูลที่ seed ลงไป
>    - เพิ่มเทสต์ใน `server/tests/lab-04/db-seed.test.ts` ที่ทดลองเรียก `prisma.actionTaken.create()` หลัง seed สำเร็จ เพื่อยืนยันว่า auto-increment ทำงานถูกต้องและได้ id >= 7 โดยไม่เกิด error P2002 duplicate key
> 2. **🟠 แก้ RequesterId Hardcode:**
>    - ใน `server/prisma/seed.ts` ทำการ lookup `RequesterUser` จาก verified email (`jennifer.anderson@example.com`, `michael.brown@example.com`, `sarah.johnson@example.com`) ก่อนนำ `.id` มาผูกเข้ากับ `ticket` แทนการ hardcode `1/2/3` เพื่อป้องกัน FK mismatch
> 3. **🟡 เก็บตกจุดย่อย (Minor Fixes):**
>    - ใน `docs/lab-04/reviewer.md` แก้ไข Merge commit ของ PR #106 เป็น `23166db` ถูกต้อง
>    - ลบตัวแปร `staffCharlie` ที่ประกาศค้างไว้ใน `seed.ts` ออก
>    - เพิ่ม Negative Test อีก 2 กรณีใน `db-seed.test.ts` (รวมเป็น 13 เทสต์):
>      - ตรวจสอบว่า Action ที่ `isFollowUpRequired === false` จะต้องมี `followUpNote === null` (BR-07)
>      - ตรวจสอบว่า Action ที่สถานะ `IN_PROGRESS` สามารถมี `result === null` ได้จริง (BR-16)
>    - ปรับปรุง Indentation ใน `seed.ts` บรรทัดที่ 290 ให้เป็นระเบียบเรียบร้อย
>    - รัน `npm run build` ผ่าน 100% ทั้ง Client และ Server
> 
> รบกวนตรวจทานรอบที่ 2 นะคะ ขอบคุณมาก ๆ ค่ะ!


#### 4.2.3 Review #2 — COMMENTED (`jejaebubu`, 2026-11-01T10:30:14Z)

**Verdict:** COMMENTED (commit `aade062`)

**Verbatim Review Comments:**

> เห็นคอมเมนต์ตอบกลับแล้ว แต่ใน PR #76 บน GitHub ตอนนี้ commit ล่าสุดยังเป็น aade062 อยู่เลย ยังไม่เห็น commit 06e01c2 ขึ้นมานะคะ รบกวนช่วย git push origin feature/28-db-and-seed ขึ้น GitHub ให้หน่อยน้า เดี๋ยวพอโค้ดขึ้นแล้วตรวจรอบ 2 ให้เลยค่ะ


#### 4.2.4 Author Response #2 (`titayaaa`, 2026-11-01T10:44:56Z)

> พุช commit 06e01c2 และ 018981d ขึ้น origin เรียบร้อยแล้วค่ะ โค้ดทั้งหมดพร้อมให้ตรวจรอบ 2 ได้เลยนะคะ ขอบคุณมากค่ะ!


#### 4.2.5 Review #3 — APPROVED (`jejaebubu`, 2026-11-01T11:03:01Z)

**Verdict:** APPROVED (commit `018981d`)

**Verbatim Review Comments:**

> ### การตรวจประเมินรอบที่ 2 (Round 2 Review — APPROVED)
> 
> ตรวจ commits `06e01c2` และ `018981d` แล้วนะคะ แก้ไขครบถ้วนทุกประเด็นที่แจ้งไว้ในรอบแรก ทั้งระดับ Blocking, Should Fix และ Minor เลยค่ะ:
> 
> 1. **PostgreSQL Sequence Synchronization (`seed.ts` & `db-seed.test.ts`):**
>    - เพิ่มการซิงก์ค่า sequence ด้วย `setval(pg_get_serial_sequence(...))` สำหรับตาราง `actions_taken`, `public_comments` และ `internal_notes` ให้ตรงกับ `MAX(id)` หลัง seed
>    - เพิ่มเทสต์ใน `db-seed.test.ts` ทดสอบสร้าง `ActionTaken` ใหม่หลัง seed โดยไม่ระบุ `id` ได้ค่า `id >= 7` และไม่เกิด `P2002`
> 2. **Dynamic Requester Lookup (`seed.ts`):**
>    - เปลี่ยนจากการ hardcode `requesterId: 1/2/3` เป็นการ lookup `RequesterUser` จากอีเมล (`reqJennifer`, `reqMichael`, `reqSarah`) เรียบร้อย
> 3. **Negative Tests & Code Cleanliness (`db-seed.test.ts`, `seed.ts`, `reviewer.md`):**
>    - เพิ่ม negative tests ตรวจสอบกรณี `isFollowUpRequired = false` (`followUpNote === null`) และกรณี `status = IN_PROGRESS` (`result === null`) ครบถ้วน
>    - ลบตัวแปร `staffCharlie` ที่ไม่ได้ใช้งาน จัด indentation ใน `seed.ts` และอัปเดต SHA ของ merge commit PR #106 (`23166db`) พร้อมบันทึกประวัติการรีวิวใน `reviewer.md` ครบถ้วน
> 
> โค้ดและชุดทดสอบพร้อมสำหรับทำ Issue 29 ต่อแล้วค่ะ ขออนุมัติ (**Approve**) และกด Merge เข้าสู่ `lab4-staging` ให้เลยนะคะ!


**คำวินิจฉัย:** **APPROVED & MERGED** — Reviewer (@jejaebubu) อนุมัติและเป็นผู้กด Merge PR #76 เข้า `lab4-staging` เรียบร้อย (Merge SHA: `33922325eed3ee5deba3f7872f8b2193ef8bce8a`, 2026-11-01T11:03:13Z) — **Closes PR #76**

---

### 4.3 PR #77: feat(api): Actions Taken REST API, RBAC, and assignee validation (Issue #65) (`titayaaa/toktickit`)

- **PR URL:** [titayaaa/toktickit#77](https://github.com/titayaaa/toktickit/pull/77)
- **Author:** `@titayaaa` (ฑิตญา ผ่องสกุล)
- **Reviewer:** `@jejaebubu` (GitHub: [jejaebubu](https://github.com/jejaebubu))
- **Source Branch:** `feature/29-actions-taken-api`
- **Target Branch:** `lab4-staging`
- **Current Status:** Approved & Merged (merge commit `b13cb435cc1816edf2939f7ae59a3e321a7c43f0`, 2026-11-01T12:00:30Z)
- **Merged by:** `@jejaebubu`
- **Latest Reviewed Commit:** `f094823c690adada5b55978632ca119f8204d18b`

#### 4.3.1 Review #1 — CHANGES_REQUESTED (`jejaebubu`, 2026-11-01T11:30:19Z)

**Verdict:** CHANGES_REQUESTED (commit `93e8241`)

**Verbatim Review Comments:**

> ตรวจโค้ด REST API, RBAC, tests และเอกสารของ PR #77 (Issue 29) เทียบกับ `schema.prisma`, `specification.md`, `api-spec.md` และ `tests.md` แล้วนะคะ ภาพรวมโครงสร้าง endpoint `GET/POST/PATCH /:id/actions-taken`, `GET /api/users/assignable`, การดึง `performedById` จาก JWT, `validateAssignee` (422) และ state machine ของ Action status ทำไว้ดีเลยค่ะ
> 
> แต่ขอ **Changes Requested** ก่อนนะคะ เพราะมีจุดที่ทำให้ `npm run build` (`tsc`) กับ `vitest` พังใน `beforeAll` และมีจุดเรื่อง ownership check กับ traceability matrix ที่ต้องปรับให้ตรงกันค่ะ
> 
> ---
> 
> ### 🔴 Blocking: ต้องแก้ก่อน Merge
> 
> 1. **`server/tests/lab-04/actions-taken.api.test.ts` (บรรทัด 62–85): ขาด `relatedSystemId` และ `requestedPriority` ใน `prisma.ticket.create` + ผูก `requesterId` ข้ามตาราง**
>    ใน `schema.prisma` โมเดล `Ticket` กำหนดให้ `relatedSystemId` และ `requestedPriority` เป็น required fields แต่ใน `beforeAll` ตอนสร้าง `ownTicket` และ `otherTicket` ไม่ได้ส่ง 2 ฟิลด์นี้เข้าไป ทำให้:
>    - รัน `npm run build` (`tsc`) ไม่ผ่าน เพราะติด TypeScript error (`Property 'relatedSystemId' is missing`, `Property 'requestedPriority' is missing`)
>    - รัน `vitest run tests/lab-04/actions-taken.api.test.ts` พังตั้งแต่ `beforeAll` ด้วย `PrismaClientValidationError`
>    - นอกจากนี้ `requesterId: requester.id` / `otherRequester.id` เอา `User.id` ไปใส่ในฟิลด์ `Ticket.requesterId` ซึ่งอ้างอิงตาราง `RequesterUser.id` ค่ะ
>    - **แนวทางแก้:** ดึง `relatedSystem` จาก `prisma.relatedSystem.findFirst({ where: { isActive: true } })` และ lookup `RequesterUser` จาก email (`reqJennifer`, `reqMichael`) แล้วส่ง `relatedSystemId`, `requestedPriority: TicketPriority.MEDIUM` และ `requesterId: reqJennifer.id` ให้ครบทั้ง `ownTicket` และ `otherTicket` ค่ะ
> 
> 2. **`server/src/routes/tickets.ts` (บรรทัด 226–231): การเช็ก `ticket.requesterId === currentUser.id` เสี่ยงเกิด Cross-model ID collision**
>    ใน `GET /api/tickets/:id/actions-taken` มีเงื่อนไข:
>    ```ts
>    const isOwner =
>      ticket.userId === currentUser.id ||
>      ticket.requesterId === currentUser.id ||
>      (ticket.requester && ticket.requester.id === currentUser.id) ||
>      (ticket.requesterUser && ticket.requesterUser.email === currentUser.email);
>    ```
>    เนื่องจาก `ticket.requesterId` คือ `RequesterUser.id` ส่วน `currentUser.id` คือ `User.id` ถ้าเอาตัวเลข ID คนละตารางมาเทียบ `===` กันตรง ๆ อาจทำให้ ID ชนกันข้ามตารางและทำให้ Requester เปิดดู Actions Taken ของคนอื่นได้ (ขัดกับ BR-13 ที่แก้ใน PR #75)
>    - **แนวทางแก้:** เอาบรรทัด `ticket.requesterId === currentUser.id` ออก แล้วเช็กเฉพาะ `ticket.userId === currentUser.id || ticket.requester?.id === currentUser.id || ticket.requester?.email === currentUser.email || ticket.requesterUser?.email === currentUser.email` ค่ะ
> 
> ---
> 
> ### 🟠 Should Fix: ความสอดคล้องของ Traceability Matrix และ API Spec
> 
> 3. **อัปเดต `docs/lab-04/tests.md` และปรับรหัส Test ID ใน `actions-taken.api.test.ts` ให้ตรงกัน**
>    - ใน PR นี้ยังไม่ได้อัปเดตสถานะเทสต์ใน `docs/lab-04/tests.md` จาก `Planned` เป็น `Pass`
>    - และรหัสเทสต์ใน `actions-taken.api.test.ts` (`API-01..05, API-08, API-12, API-14, API-15, API-16, API-17`) ยังไม่ตรงกับตารางใน `docs/lab-04/tests.md` ของ repo นี้ค่ะ (เช่น ใน `tests.md` รหัส `API-08` คือ Resolution Gate, `API-12` คือ Requester Dashboard, `API-14` คือ Concurrency 409 และยังไม่มี `API-15..17`)
>    - **แนวทางแก้:** ปรับรหัสเทสต์ใน `actions-taken.api.test.ts` กับตารางใน `docs/lab-04/tests.md` ให้ตรงกันแบบ 1-ต่อ-1 และเปลี่ยนสถานะเทสต์ที่รันผ่านใน PR นี้เป็น `Pass` (พร้อมอัปเดต `docs/lab-04/ai-use.md` สำหรับ Issue 29 ด้วยนะคะ)
> 
> 4. **ปรับ `docs/lab-04/api-spec.md` (§2.1, §2.2) กับ `server/src/routes/tickets.ts` ให้ตรงกัน**
>    - **`GET /api/tickets/:id/actions-taken/:actionId`:** ใน `specification.md` §8 และ `api-spec.md` §2.2 ระบุว่ามี endpoint ดึง Action รายตัว แต่ใน `tickets.ts` ยังไม่มี route นี้ (เลือกได้ว่าจะเพิ่ม route นี้ใน `tickets.ts` หรือเอาออกจาก spec ให้ตรงกันค่ะ)
>    - **Response shape และการเรียงลำดับของ `GET /api/tickets/:id/actions-taken`:** ใน `api-spec.md` §2.1 เขียนว่าคืน `{ data: [...], meta: {...} }` และเรียง `desc` แต่โค้ดจริงใน `tickets.ts` คืนเป็น Array `res.status(200).json(actions)` และเรียง `actionDateTime: 'asc'` แนะนำให้แก้ `api-spec.md` §2.1 ให้ตรงกับที่โค้ดคืนจริง เพื่อไม่ให้ตอนทำ UI ใน Issue 30 สับสนค่ะ
> 
> ---
> 
> ### 🟡 Minor: จุดที่แนะนำให้เก็บเพิ่ม
> - ใน `PATCH /:id/actions-taken/:actionId` โค้ดมีการล้าง `followUpNote = null` เมื่อ `isFollowUpRequired = false` ไว้ถูกต้องแล้ว แนะนำให้เพิ่ม test case ใน `actions-taken.api.test.ts` ที่ส่ง `PATCH { isFollowUpRequired: false }` แล้วเช็กว่า `followUpNote` กลายเป็น `null` จริงด้วยค่ะ
> - ใน `POST` และ `PATCH`:
>   - ถ้าส่ง `actionDateTime` ที่ไม่ใช่วันที่ที่ถูกต้อง (`isNaN(parsed.getTime())`) แนะนำให้ตอบ `400 Bad Request` แทนการ fallback เงียบ ๆ
>   - เช็กความยาว `result.length > 1000` ทุกสถานะ (ไม่ใช่เฉพาะตอน `COMPLETED`) และเช็ก `attachmentNotes.length > 500` ให้ตอบ `400` แทนการ `.slice(0, 500)`
>   - ปรับความยาวขั้นต่ำของ `followUpNote` ในโค้ด (`>= 1`) กับใน `api-spec.md` (`min 2 chars`) ให้ตรงกันค่ะ
> 
> แก้แล้วรัน `npm run build` กับ `npm test` เช็กอีกรอบ แล้ว ping มาได้เลยนะคะ เดี๋ยวรีบตรวจซ้ำและกด Approve + Merge ให้ค่ะ ขอบคุณมากค่ะ!


#### 4.3.2 Author Response #1 (`titayaaa`, 2026-11-01T11:43:45Z)

> > ตรวจโค้ด REST API, RBAC, tests และเอกสารของ PR #77 (Issue 29) เทียบกับ `schema.prisma`, `specification.md`, `api-spec.md` และ `tests.md` แล้วนะคะ ภาพรวมโครงสร้าง endpoint `GET/POST/PATCH /:id/actions-taken`, `GET /api/users/assignable`, การดึง `performedById` จาก JWT, `validateAssignee` (422) และ state machine ของ Action status ทำไว้ดีเลยค่ะ
> > 
> > แต่ขอ **Changes Requested** ก่อนนะคะ เพราะมีจุดที่ทำให้ `npm run build` (`tsc`) กับ `vitest` พังใน `beforeAll` และมีจุดเรื่อง ownership check กับ traceability matrix ที่ต้องปรับให้ตรงกันค่ะ
> > 
> > ### 🔴 Blocking: ต้องแก้ก่อน Merge
> > 1. **`server/tests/lab-04/actions-taken.api.test.ts` (บรรทัด 62–85): ขาด `relatedSystemId` และ `requestedPriority` ใน `prisma.ticket.create` + ผูก `requesterId` ข้ามตาราง**
> >    ใน `schema.prisma` โมเดล `Ticket` กำหนดให้ `relatedSystemId` และ `requestedPriority` เป็น required fields แต่ใน `beforeAll` ตอนสร้าง `ownTicket` และ `otherTicket` ไม่ได้ส่ง 2 ฟิลด์นี้เข้าไป ทำให้:
> >    
> >    * รัน `npm run build` (`tsc`) ไม่ผ่าน เพราะติด TypeScript error (`Property 'relatedSystemId' is missing`, `Property 'requestedPriority' is missing`)
> >    * รัน `vitest run tests/lab-04/actions-taken.api.test.ts` พังตั้งแต่ `beforeAll` ด้วย `PrismaClientValidationError`
> >    * นอกจากนี้ `requesterId: requester.id` / `otherRequester.id` เอา `User.id` ไปใส่ในฟิลด์ `Ticket.requesterId` ซึ่งอ้างอิงตาราง `RequesterUser.id` ค่ะ
> >    * **แนวทางแก้:** ดึง `relatedSystem` จาก `prisma.relatedSystem.findFirst({ where: { isActive: true } })` และ lookup `RequesterUser` จาก email (`reqJennifer`, `reqMichael`) แล้วส่ง `relatedSystemId`, `requestedPriority: TicketPriority.MEDIUM` และ `requesterId: reqJennifer.id` ให้ครบทั้ง `ownTicket` และ `otherTicket` ค่ะ
> > 2. **`server/src/routes/tickets.ts` (บรรทัด 226–231): การเช็ก `ticket.requesterId === currentUser.id` เสี่ยงเกิด Cross-model ID collision**
> >    ใน `GET /api/tickets/:id/actions-taken` มีเงื่อนไข:
> >    ```ts
> >    const isOwner =
> >      ticket.userId === currentUser.id ||
> >      ticket.requesterId === currentUser.id ||
> >      (ticket.requester && ticket.requester.id === currentUser.id) ||
> >      (ticket.requesterUser && ticket.requesterUser.email === currentUser.email);
> >    ```
> >    
> >    
> >        
> >          
> >        
> >    
> >          
> >        
> >    
> >        
> >      
> >    เนื่องจาก `ticket.requesterId` คือ `RequesterUser.id` ส่วน `currentUser.id` คือ `User.id` ถ้าเอาตัวเลข ID คนละตารางมาเทียบ `===` กันตรง ๆ อาจทำให้ ID ชนกันข้ามตารางและทำให้ Requester เปิดดู Actions Taken ของคนอื่นได้ (ขัดกับ BR-13 ที่แก้ใน PR #75)
> >    
> >    * **แนวทางแก้:** เอาบรรทัด `ticket.requesterId === currentUser.id` ออก แล้วเช็กเฉพาะ `ticket.userId === currentUser.id || ticket.requester?.id === currentUser.id || ticket.requester?.email === currentUser.email || ticket.requesterUser?.email === currentUser.email` ค่ะ
> > 
> > ### 🟠 Should Fix: ความสอดคล้องของ Traceability Matrix และ API Spec
> > 3. **อัปเดต `docs/lab-04/tests.md` และปรับรหัส Test ID ใน `actions-taken.api.test.ts` ให้ตรงกัน**
> >    
> >    * ใน PR นี้ยังไม่ได้อัปเดตสถานะเทสต์ใน `docs/lab-04/tests.md` จาก `Planned` เป็น `Pass`
> >    * และรหัสเทสต์ใน `actions-taken.api.test.ts` (`API-01..05, API-08, API-12, API-14, API-15, API-16, API-17`) ยังไม่ตรงกับตารางใน `docs/lab-04/tests.md` ของ repo นี้ค่ะ (เช่น ใน `tests.md` รหัส `API-08` คือ Resolution Gate, `API-12` คือ Requester Dashboard, `API-14` คือ Concurrency 409 และยังไม่มี `API-15..17`)
> >    * **แนวทางแก้:** ปรับรหัสเทสต์ใน `actions-taken.api.test.ts` กับตารางใน `docs/lab-04/tests.md` ให้ตรงกันแบบ 1-ต่อ-1 และเปลี่ยนสถานะเทสต์ที่รันผ่านใน PR นี้เป็น `Pass` (พร้อมอัปเดต `docs/lab-04/ai-use.md` สำหรับ Issue 29 ด้วยนะคะ)
> > 4. **ปรับ `docs/lab-04/api-spec.md` (§2.1, §2.2) กับ `server/src/routes/tickets.ts` ให้ตรงกัน**
> >    
> >    * **`GET /api/tickets/:id/actions-taken/:actionId`:** ใน `specification.md` §8 และ `api-spec.md` §2.2 ระบุว่ามี endpoint ดึง Action รายตัว แต่ใน `tickets.ts` ยังไม่มี route นี้ (เลือกได้ว่าจะเพิ่ม route นี้ใน `tickets.ts` หรือเอาออกจาก spec ให้ตรงกันค่ะ)
> >    * **Response shape และการเรียงลำดับของ `GET /api/tickets/:id/actions-taken`:** ใน `api-spec.md` §2.1 เขียนว่าคืน `{ data: [...], meta: {...} }` และเรียง `desc` แต่โค้ดจริงใน `tickets.ts` คืนเป็น Array `res.status(200).json(actions)` และเรียง `actionDateTime: 'asc'` แนะนำให้แก้ `api-spec.md` §2.1 ให้ตรงกับที่โค้ดคืนจริง เพื่อไม่ให้ตอนทำ UI ใน Issue 30 สับสนค่ะ
> > 
> > ### 🟡 Minor: จุดที่แนะนำให้เก็บเพิ่ม
> > * ใน `PATCH /:id/actions-taken/:actionId` โค้ดมีการล้าง `followUpNote = null` เมื่อ `isFollowUpRequired = false` ไว้ถูกต้องแล้ว แนะนำให้เพิ่ม test case ใน `actions-taken.api.test.ts` ที่ส่ง `PATCH { isFollowUpRequired: false }` แล้วเช็กว่า `followUpNote` กลายเป็น `null` จริงด้วยค่ะ
> > * ใน `POST` และ `PATCH`:
> >   
> >   * ถ้าส่ง `actionDateTime` ที่ไม่ใช่วันที่ที่ถูกต้อง (`isNaN(parsed.getTime())`) แนะนำให้ตอบ `400 Bad Request` แทนการ fallback เงียบ ๆ
> >   * เช็กความยาว `result.length > 1000` ทุกสถานะ (ไม่ใช่เฉพาะตอน `COMPLETED`) และเช็ก `attachmentNotes.length > 500` ให้ตอบ `400` แทนการ `.slice(0, 500)`
> >   * ปรับความยาวขั้นต่ำของ `followUpNote` ในโค้ด (`>= 1`) กับใน `api-spec.md` (`min 2 chars`) ให้ตรงกันค่ะ
> > 
> > แก้แล้วรัน `npm run build` กับ `npm test` เช็กอีกรอบ แล้ว ping มาได้เลยนะคะ เดี๋ยวรีบตรวจซ้ำและกด Approve + Merge ให้ค่ะ ขอบคุณมากค่ะ!
> 
> ขอบคุณสำหรับรีวิวที่ละเอียดและแม่นยำมาก ๆ ค่ะ @jejaebubu ได้ทำการแก้ไขปรับปรุงครบถ้วนทุกข้อทั้ง Blocking, Should Fix และ Minor ใน commit f094823 เรียบร้อยแล้วค่ะ:
> 
> 1. **แก้ไข Ticket Setup ใน Test `beforeAll`**:
>    - เพิ่ม `relatedSystemId: relatedSystem.id` และ `requestedPriority: TicketPriority.MEDIUM` ตามโมเดล `Ticket` ใน `schema.prisma`
>    - ทำ lookup `RequesterUser` จากอีเมลของ requester (`reqJennifer` และ `reqMichael`) เพื่อผูก `requesterId` อย่างถูกต้องตรงตามโมเดล ไม่เอา `User.id` ไปใส่ข้ามตารางอีกต่อไป
> 2. **ป้องกัน Cross-model ID Collision (BR-13)**:
>    - นำเงื่อนไข `ticket.requesterId === currentUser.id` ออกใน `GET /api/tickets/:id/actions-taken` และ `GET /api/tickets/:id/actions-taken/:actionId`
>    - ตรวจสอบความเป็นเจ้าของเฉพาะ `ticket.userId === currentUser.id || ticket.requester?.id === currentUser.id || ticket.requester?.email === currentUser.email || ticket.requesterUser?.email === currentUser.email`
> 3. **เพิ่ม Endpoint ดึง Action รายตัว (`GET /:id/actions-taken/:actionId`)**:
>    - เพิ่ม route `GET /api/tickets/:id/actions-taken/:actionId` ใน `server/src/routes/tickets.ts` พร้อมการตรวจสอบ Data Isolation อย่างรัดกุม
> 4. **ปรับความสอดคล้องของ API Spec และ Traceability Matrix**:
>    - ปรับ Response shape ใน `docs/lab-04/api-spec.md` §2.1 ให้เป็น Array `[ ... ]` เรียงตาม `actionDateTime: asc` ตรงตามการทำงานจริง
>    - แมป Test ID ใน `server/tests/lab-04/actions-taken.api.test.ts` ให้ตรงกับ `docs/lab-04/tests.md` แบบ 1-ต่อ-1 (`API-01`..`06`, `UNIT-01`..`03`, `SAFE-01`) และอัปเดตสถานะเป็น `Pass` ครบถ้วน
>    - บันทึก Prompt 9 และ Reflection ของ Issue 29 ลงใน `docs/lab-04/ai-use.md`
> 5. **จุดเก็บตก Validation & Test Cases**:
>    - ตรวจจับวันที่ไม่ถูกต้อง: ส่ง `actionDateTime` ผิดรูปแบบตอบกลับ `400 Bad Request` ทันทีทั้งใน POST และ PATCH
>    - ตรวจสอบความยาว: `result.length > 1000` และ `attachmentNotes.length > 500` ตอบกลับ `400 Bad Request`
>    - ปรับความยาวขั้นต่ำของ `followUpNote` เป็นอย่างน้อย 2 ตัวอักษร
>    - เพิ่มเทสต์เคสการส่ง `PATCH { isFollowUpRequired: false }` แล้วตรวจสอบว่า `followUpNote` ถูกเคลียร์เป็น `null` จริง
> 
> ตรวจสอบการคอมไพล์ผ่านฉลุยทั้ง `npm run build` (tsc) ฝั่ง Server และ Client เรียบร้อยค่ะ รบกวนช่วยตรวจซ้ำอีกรอบนะคะ ขอบคุณมากค่ะ!


#### 4.3.3 Review #2 — APPROVED (`jejaebubu`, 2026-11-01T12:00:20Z)

**Verdict:** APPROVED (commit `f094823`)

**Verbatim Review Comments:**

> ### การตรวจประเมินรอบที่ 2 (Round 2 Review — APPROVED)
> 
> ตรวจ commit `f094823` แล้วนะคะ แก้ไขครบถ้วนทุกประเด็นที่แจ้งไว้ในรอบแรก ทั้งระดับ Blocking, Should Fix และ Minor เลยค่ะ:
> 
> 1. **Ticket Setup ใน `actions-taken.api.test.ts` (`beforeAll`):**
>    - เพิ่ม `relatedSystemId` และ `requestedPriority: TicketPriority.MEDIUM` ให้กับ `ownTicket` และ `otherTicket` พร้อม lookup `RequesterUser` จากอีเมล (`reqJennifer`, `reqMichael`) เพื่อผูก `requesterId` ให้ตรงกับโมเดลจริงใน `schema.prisma`
> 2. **Data Isolation & Cross-Model Ownership Protection (`server/src/routes/tickets.ts`):**
>    - นำเงื่อนไข `ticket.requesterId === currentUser.id` ออก และตรวจสอบความเป็นเจ้าของผ่าน `ticket.userId === currentUser.id` ร่วมกับ `ticket.requester` / `ticket.requesterUser` email ตาม BR-13
>    - เพิ่ม endpoint `GET /api/tickets/:id/actions-taken/:actionId` พร้อมการตรวจสิทธิ์ Data Isolation (`404 Not Found`) และเพิ่มเทสต์ครอบคลุมทั้ง Staff, Owner Requester, Other Requester และ Non-existent ID
> 3. **Input Validation & Data Hygiene (`POST` & `PATCH`):**
>    - ดัก `actionDateTime` ที่ไม่ถูกต้องให้ตอบ `400 Bad Request` ทั้งใน `POST` และ `PATCH`
>    - ตรวจสอบความยาว `result` (ไม่เกิน 1000 ตัวอักษรทุกสถานะ และอย่างน้อย 2 ตัวอักษรเมื่อ `COMPLETED`), `attachmentNotes` (ไม่เกิน 500 ตัวอักษร) และ `followUpNote` (2–500 ตัวอักษรเมื่อ `isFollowUpRequired = true`)
>    - เพิ่มเทสต์ตรวจสอบการส่ง `PATCH { isFollowUpRequired: false }` ยืนยันว่า `followUpNote` ถูกล้างเป็น `null` จริง
> 4. **Traceability Matrix & Documentation (`tests.md`, `api-spec.md`, `ai-use.md`, `reviewer.md`):**
>    - ปรับรหัสเทสต์ใน `actions-taken.api.test.ts` ให้ตรงกับตารางใน `docs/lab-04/tests.md` (`API-01..06`, `UNIT-01..03`, `SAFE-01` รวม 14 test blocks) และอัปเดตสถานะเป็น `Pass`
>    - ปรับ `api-spec.md` §2.1 ให้ตรงกับ Array response (`actionDateTime: asc`) และอัปเดต `ai-use.md` (Prompt 9) กับ `reviewer.md` เรียบร้อย
> 
> โค้ด REST API และชุดทดสอบสมบูรณ์พร้อมสำหรับทำ UI ใน Issue 30 ต่อแล้วค่ะ ขออนุมัติ (**Approve**) และกด Merge เข้าสู่ `lab4-staging` ให้เลยนะคะ!


**คำวินิจฉัย:** **APPROVED & MERGED** — Reviewer (@jejaebubu) อนุมัติและเป็นผู้กด Merge PR #77 เข้า `lab4-staging` เรียบร้อย (Merge SHA: `b13cb435cc1816edf2939f7ae59a3e321a7c43f0`, 2026-11-01T12:00:30Z) — **Closes PR #77**

---

### 4.4 PR #78: feat(ui): Actions Taken component on Ticket Detail, state sync, and A11Y (Issue #66) (`titayaaa/toktickit`)

- **PR URL:** [titayaaa/toktickit#78](https://github.com/titayaaa/toktickit/pull/78)
- **Author:** `@titayaaa` (ฑิตญา ผ่องสกุล)
- **Reviewer:** `@jejaebubu` (GitHub: [jejaebubu](https://github.com/jejaebubu))
- **Source Branch:** `feature/30-actions-taken-ui`
- **Target Branch:** `lab4-staging`
- **Current Status:** Approved & Merged (merge commit `36e2e531a7f70e3fe9dec2ed7e18d87fcff89698`, 2026-11-01T19:45:28Z)
- **Merged by:** `@jejaebubu`
- **Latest Reviewed Commit:** `e34f19ee99e3bf99d03104603fcef7c74bf8f63a`

#### 4.4.1 Review #1 — CHANGES_REQUESTED (`jejaebubu`, 2026-11-01T12:39:14Z)

**Verdict:** CHANGES_REQUESTED (commit `c56436e`)

**Verbatim Review Comments:**

> ตรวจโค้ด `ActionsTaken.tsx`, `TicketDetail.tsx`, ชุดทดสอบ `ActionsTaken.test.tsx` และเอกสารของ PR #78 (Issue 30) เทียบกับระบบ Auth, Backend API และ UI Spec แล้วนะคะ ภาพรวมการออกแบบ UI ในธีม Zen Green, แบนเนอร์แจ้งเตือน Resolution Warning, โหมด Read-only สำหรับ Requester, Accessibility (`minHeight: 44`, `role="alert"`, ปิด Modal ด้วยปุ่ม `Escape`) และการป้องกัน Double Submit (`DUP-01`) ทำไว้ดีมากเลยค่ะ
> 
> แต่ขอ **Changes Requested** ก่อนนะคะ เพราะมีจุดสำคัญเรื่องคีย์ Token ใน `localStorage`, ข้อมูล `actionsTaken` ที่หายไปจาก response ของ `GET /api/tickets/:id` และการดึงข้อความ Error จาก Backend ที่จะทำให้การใช้งานบนหน้าเว็บจริงติดปัญหาค่ะ
> 
> ---
> 
> ### 🔴 Blocking: ต้องแก้ก่อน Merge
> 
> 1. **`client/src/components/ActionsTaken.tsx` (บรรทัด 108, 209, 279): ดึง Token จาก `localStorage.getItem('token')` ไม่ตรงกับ `AuthContext.tsx` ทำให้หน้าเว็บจริงติด `401 Unauthorized`**
>    * **ปัญหา:** ใน `client/src/contexts/AuthContext.tsx` (บรรทัด 25) ระบบเก็บ JWT ไว้ใน `localStorage` ด้วยคีย์ `'toktickit_auth_token'` แต่ใน `ActionsTaken.tsx` ทั้ง 3 จุด (`loadAssignableStaff`, `handleSubmit`, `handleQuickStatusChange`) เรียก `localStorage.getItem('token')` ซึ่งบน Browser จริงจะได้ค่าเป็น `null` เสมอ
>    * **ผลกระทบ:** เมื่อใช้งานจริงบนหน้าเว็บ การดึงรายชื่อ `/api/users/assignable` รวมถึงการกดสร้าง (`POST`) และแก้ไข/เปลี่ยนสถานะ (`PATCH`) จะไม่ได้แนบ `Authorization` header ไปด้วย ทำให้ติด `401 Unauthorized` ทั้งหมดค่ะ (ที่ชุดทดสอบ `ActionsTaken.test.tsx` ผ่านเพราะในเทสต์เซ็ต `localStorage.setItem('token', ...)` ไว้)
>    * **แนวทางแก้:** สร้าง helper ดึง token ที่เช็กคีย์ `'toktickit_auth_token'` ก่อน แล้ว fallback ไปที่ `'token'` เพื่อรองรับทั้งหน้าเว็บจริงและ unit test ค่ะ เช่น `const getAuthToken = () => localStorage.getItem('toktickit_auth_token') || localStorage.getItem('token');`
> 
> 2. **`server/src/app.ts` (บรรทัด 579–605) & `TicketDetail.tsx`: `GET /api/tickets/:id` ลืมส่งฟิลด์ `actionsTaken` ออกมาใน JSON response ทำให้เปิดหน้า Ticket Detail แล้วรายการว่างเปล่าเสมอ**
>    * **ปัญหา:**
>      * ใน `TicketDetail.tsx` (บรรทัด 925) ส่ง `actions={ticket.actionsTaken || []}` ที่ได้จาก `GET /api/tickets/${ticketId}` เข้าไปใน `<ActionsTaken />`
>      * แต่ใน `server/src/app.ts` แม้ว่าตอน query Prisma (บรรทัด 518–538) จะ `include: { actionsTaken: ... }` ไว้แล้ว แต่ตอน `res.status(200).json({ ... })` (บรรทัด 579–605) **ไม่ได้ใส่ `actionsTaken: ticket.actionsTaken`** ลงไปใน object ที่ส่งกลับ
>      * ส่งผลให้บนหน้าเว็บจริง `ticket.actionsTaken` เป็น `undefined` เสมอ (แสดง `0` รายการแม้จะมีข้อมูลใน DB) และทำให้เทสต์ `GET /api/tickets/:id includes actionsTaken array for frontend rendering` ใน `server/tests/lab-04/actions-taken.api.test.ts` (บรรทัด 516) ไม่ผ่านด้วยค่ะ
>    * **แนวทางแก้:** เพิ่ม `actionsTaken: ticket.actionsTaken,` ลงใน `res.status(200).json({ ... })` ของ `GET /api/tickets/:id` ใน `server/src/app.ts` (บรรทัด 605) ค่ะ
> 
> 3. **`client/src/components/ActionsTaken.tsx` (บรรทัด 236, 253, 292): อ่านข้อความ Error จาก `data.message` แทนที่จะรองรับ `data.error`**
>    * **ปัญหา:** ใน `server/src/routes/tickets.ts` ทุก endpoint ของ Actions Taken ส่งข้อความแจ้งเตือนข้อผิดพลาดกลับมาในฟิลด์ `{ error: '...' }` แต่ใน `ActionsTaken.tsx` อ่านเฉพาะ `data.message` ทำให้เมื่อเกิด Validation error (เช่น 400 หรือ 422) ผู้ใช้ไม่เห็นข้อความจริงจากเซิร์ฟเวอร์ แต่เห็นเพียงข้อความ fallback `Failed to create/update action (HTTP 400)`
>    * **แนวทางแก้:** ปรับทั้ง 3 จุดให้เช็ก `data.error || data.message || ...` ค่ะ
> 
> ---
> 
> ### 🟠 Should Fix: ความสอดคล้องของลำดับข้อมูล, Validation และ State Transition
> 
> 4. **ลำดับการแสดงผลเมื่อสร้าง Action ใหม่ (`ActionsTaken.tsx` บรรทัด 257)**
>    * Backend เรียงลำดับ Actions Taken ตามเวลาจากเก่าไปใหม่ (`orderBy: [{ actionDateTime: 'asc' }, { createdAt: 'asc' }]`) แต่ใน `handleSubmit` ตอนสร้างรายการใหม่ (บรรทัด 257) ใช้ `const nextItems = [created, ...items];` ซึ่งเอารายการใหม่ไปไว้บนสุด พอรีเฟรชหน้าเว็บลำดับจะสลับลงมาอยู่ล่างสุด
>    * **แนวทางแก้:** เปลี่ยนเป็น `const nextItems = [...items, created];` ให้เรียงลำดับสอดคล้องกับ Backend ค่ะ
> 
> 5. **ปรับความยาวฟิลด์ใน Validation และ `maxLength` ให้ตรงกับ Backend (`ActionsTaken.tsx` บรรทัด 194, 522, 549, 599)**
>    * **`followUpNote`:** Backend กำหนดความยาว `2–500` ตัวอักษรเมื่อเปิด `isFollowUpRequired` แต่ฝั่ง UI เช็กแค่ `followUpNote.trim().length === 0` (ถ้ากรอก 1 ตัวอักษรจะผ่าน UI แต่ติด 400 ที่ Backend) และตั้ง `maxLength={1000}` แนะนำให้เช็ก `followUpNote.trim().length < 2` ใน `validate()` และปรับ `maxLength={500}` ค่ะ
>    * **`actionDescription` และ `result`:** Backend จำกัดความยาวไม่เกิน `1,000` ตัวอักษร แต่ใน `<textarea>` ตั้ง `maxLength={2000}` แนะนำให้ปรับเป็น `maxLength={1000}` ทั้งสองช่องค่ะ
> 
> 6. **จำกัดตัวเลือก Status ในฟอร์มแก้ไข (`Edit Action Taken`) ตาม State Machine (`ActionsTaken.tsx` บรรทัด 497–510)**
>    * Backend ไม่อนุญาตให้เปลี่ยนสถานะย้อนกลับจาก `IN_PROGRESS` ไป `PENDING` และไม่อนุญาตให้เปลี่ยนสถานะออกจาก `COMPLETED` หรือ `CANCELLED`
>    * แนะนำให้กรอง `<option>` ของ Status ตอนแก้ไข (`editingAction`) ให้เลือกได้เฉพาะสถานะปัจจุบันและสถานะถัดไปที่อนุญาต (และบนการ์ดที่มีสถานะ `PENDING` อาจเพิ่มปุ่มลัดหรือให้เปลี่ยนเป็น `IN_PROGRESS` ได้สะดวกขึ้น) เพื่อไม่ให้ผู้ใช้เลือกสถานะที่ผิดกฎของ Backend ค่ะ
> 
> ---
> 
> ### 🟡 Minor: ข้อเสนอแนะเพิ่มเติม
> 
> * **ฟิลด์ `actionDateTime`:** ตาม Handout (§3, §4.1, §8.3) และ `ui-spec.md` (§3.1) ระบุให้รองรับการระบุหรือแก้ไข `Action Date/Time` (โดยมีค่าเริ่มต้นเป็นเวลาปัจจุบัน) หากเพิ่มช่อง `datetime-local` ในฟอร์มได้จะครบถ้วนตามสเปกมากยิ่งขึ้นค่ะ
> * **ค่าสี Badge ใน `renderStatusBadge` (`ActionsTaken.tsx` บรรทัด 321–342):** ใน `ui-spec.md` (§1.1) กำหนดสี `PENDING` เป็นพื้นหลัง `#FFFBEB` / ตัวอักษร `#92400E` และ `IN_PROGRESS` เป็นพื้นหลัง `#EFF6FF` / ตัวอักษร `#1E40AF` (ในโค้ดใช้ `#FEF3C7` และ `#1D4ED8`) ปรับให้ตรงกันได้เลยนะคะ
> * **ชื่อเคสทดสอบใน `ActionsTaken.test.tsx` (บรรทัด 904, 1079, 1188):** ในไฟล์เทสต์ระบุรหัส `UI-06` ซึ่งในตาราง `docs/lab-04/tests.md` รหัส `UI-06` เป็นของ *Requester Dashboard renders cards and attention list* แนะนำให้เปลี่ยนชื่อใน `ActionsTaken.test.tsx` เป็นรหัสของชุด Actions Taken (`UI-01` / `UI-02`) เพื่อไม่ให้รหัสเทสต์ชนกันค่ะ


#### 4.4.2 Author Response #1 (`titayaaa`, 2026-11-01T17:58:19Z)

> > ตรวจโค้ด `ActionsTaken.tsx`, `TicketDetail.tsx`, ชุดทดสอบ `ActionsTaken.test.tsx` และเอกสารของ PR #78 (Issue 30) เทียบกับระบบ Auth, Backend API และ UI Spec แล้วนะคะ ภาพรวมการออกแบบ UI ในธีม Zen Green, แบนเนอร์แจ้งเตือน Resolution Warning, โหมด Read-only สำหรับ Requester, Accessibility (`minHeight: 44`, `role="alert"`, ปิด Modal ด้วยปุ่ม `Escape`) และการป้องกัน Double Submit (`DUP-01`) ทำไว้ดีมากเลยค่ะ
> > 
> > แต่ขอ **Changes Requested** ก่อนนะคะ เพราะมีจุดสำคัญเรื่องคีย์ Token ใน `localStorage`, ข้อมูล `actionsTaken` ที่หายไปจาก response ของ `GET /api/tickets/:id` และการดึงข้อความ Error จาก Backend ที่จะทำให้การใช้งานบนหน้าเว็บจริงติดปัญหาค่ะ
> > 
> > ### 🔴 Blocking: ต้องแก้ก่อน Merge
> > 1. **`client/src/components/ActionsTaken.tsx` (บรรทัด 108, 209, 279): ดึง Token จาก `localStorage.getItem('token')` ไม่ตรงกับ `AuthContext.tsx` ทำให้หน้าเว็บจริงติด `401 Unauthorized`**
> >    
> >    * **ปัญหา:** ใน `client/src/contexts/AuthContext.tsx` (บรรทัด 25) ระบบเก็บ JWT ไว้ใน `localStorage` ด้วยคีย์ `'toktickit_auth_token'` แต่ใน `ActionsTaken.tsx` ทั้ง 3 จุด (`loadAssignableStaff`, `handleSubmit`, `handleQuickStatusChange`) เรียก `localStorage.getItem('token')` ซึ่งบน Browser จริงจะได้ค่าเป็น `null` เสมอ
> >    * **ผลกระทบ:** เมื่อใช้งานจริงบนหน้าเว็บ การดึงรายชื่อ `/api/users/assignable` รวมถึงการกดสร้าง (`POST`) และแก้ไข/เปลี่ยนสถานะ (`PATCH`) จะไม่ได้แนบ `Authorization` header ไปด้วย ทำให้ติด `401 Unauthorized` ทั้งหมดค่ะ (ที่ชุดทดสอบ `ActionsTaken.test.tsx` ผ่านเพราะในเทสต์เซ็ต `localStorage.setItem('token', ...)` ไว้)
> >    * **แนวทางแก้:** สร้าง helper ดึง token ที่เช็กคีย์ `'toktickit_auth_token'` ก่อน แล้ว fallback ไปที่ `'token'` เพื่อรองรับทั้งหน้าเว็บจริงและ unit test ค่ะ เช่น `const getAuthToken = () => localStorage.getItem('toktickit_auth_token') || localStorage.getItem('token');`
> > 2. **`server/src/app.ts` (บรรทัด 579–605) & `TicketDetail.tsx`: `GET /api/tickets/:id` ลืมส่งฟิลด์ `actionsTaken` ออกมาใน JSON response ทำให้เปิดหน้า Ticket Detail แล้วรายการว่างเปล่าเสมอ**
> >    
> >    * **ปัญหา:**
> >      
> >      * ใน `TicketDetail.tsx` (บรรทัด 925) ส่ง `actions={ticket.actionsTaken || []}` ที่ได้จาก `GET /api/tickets/${ticketId}` เข้าไปใน `<ActionsTaken />`
> >      * แต่ใน `server/src/app.ts` แม้ว่าตอน query Prisma (บรรทัด 518–538) จะ `include: { actionsTaken: ... }` ไว้แล้ว แต่ตอน `res.status(200).json({ ... })` (บรรทัด 579–605) **ไม่ได้ใส่ `actionsTaken: ticket.actionsTaken`** ลงไปใน object ที่ส่งกลับ
> >      * ส่งผลให้บนหน้าเว็บจริง `ticket.actionsTaken` เป็น `undefined` เสมอ (แสดง `0` รายการแม้จะมีข้อมูลใน DB) และทำให้เทสต์ `GET /api/tickets/:id includes actionsTaken array for frontend rendering` ใน `server/tests/lab-04/actions-taken.api.test.ts` (บรรทัด 516) ไม่ผ่านด้วยค่ะ
> >    * **แนวทางแก้:** เพิ่ม `actionsTaken: ticket.actionsTaken,` ลงใน `res.status(200).json({ ... })` ของ `GET /api/tickets/:id` ใน `server/src/app.ts` (บรรทัด 605) ค่ะ
> > 3. **`client/src/components/ActionsTaken.tsx` (บรรทัด 236, 253, 292): อ่านข้อความ Error จาก `data.message` แทนที่จะรองรับ `data.error`**
> >    
> >    * **ปัญหา:** ใน `server/src/routes/tickets.ts` ทุก endpoint ของ Actions Taken ส่งข้อความแจ้งเตือนข้อผิดพลาดกลับมาในฟิลด์ `{ error: '...' }` แต่ใน `ActionsTaken.tsx` อ่านเฉพาะ `data.message` ทำให้เมื่อเกิด Validation error (เช่น 400 หรือ 422) ผู้ใช้ไม่เห็นข้อความจริงจากเซิร์ฟเวอร์ แต่เห็นเพียงข้อความ fallback `Failed to create/update action (HTTP 400)`
> >    * **แนวทางแก้:** ปรับทั้ง 3 จุดให้เช็ก `data.error || data.message || ...` ค่ะ
> > 
> > ### 🟠 Should Fix: ความสอดคล้องของลำดับข้อมูล, Validation และ State Transition
> > 4. **ลำดับการแสดงผลเมื่อสร้าง Action ใหม่ (`ActionsTaken.tsx` บรรทัด 257)**
> >    
> >    * Backend เรียงลำดับ Actions Taken ตามเวลาจากเก่าไปใหม่ (`orderBy: [{ actionDateTime: 'asc' }, { createdAt: 'asc' }]`) แต่ใน `handleSubmit` ตอนสร้างรายการใหม่ (บรรทัด 257) ใช้ `const nextItems = [created, ...items];` ซึ่งเอารายการใหม่ไปไว้บนสุด พอรีเฟรชหน้าเว็บลำดับจะสลับลงมาอยู่ล่างสุด
> >    * **แนวทางแก้:** เปลี่ยนเป็น `const nextItems = [...items, created];` ให้เรียงลำดับสอดคล้องกับ Backend ค่ะ
> > 5. **ปรับความยาวฟิลด์ใน Validation และ `maxLength` ให้ตรงกับ Backend (`ActionsTaken.tsx` บรรทัด 194, 522, 549, 599)**
> >    
> >    * **`followUpNote`:** Backend กำหนดความยาว `2–500` ตัวอักษรเมื่อเปิด `isFollowUpRequired` แต่ฝั่ง UI เช็กแค่ `followUpNote.trim().length === 0` (ถ้ากรอก 1 ตัวอักษรจะผ่าน UI แต่ติด 400 ที่ Backend) และตั้ง `maxLength={1000}` แนะนำให้เช็ก `followUpNote.trim().length < 2` ใน `validate()` และปรับ `maxLength={500}` ค่ะ
> >    * **`actionDescription` และ `result`:** Backend จำกัดความยาวไม่เกิน `1,000` ตัวอักษร แต่ใน `<textarea>` ตั้ง `maxLength={2000}` แนะนำให้ปรับเป็น `maxLength={1000}` ทั้งสองช่องค่ะ
> > 6. **จำกัดตัวเลือก Status ในฟอร์มแก้ไข (`Edit Action Taken`) ตาม State Machine (`ActionsTaken.tsx` บรรทัด 497–510)**
> >    
> >    * Backend ไม่อนุญาตให้เปลี่ยนสถานะย้อนกลับจาก `IN_PROGRESS` ไป `PENDING` และไม่อนุญาตให้เปลี่ยนสถานะออกจาก `COMPLETED` หรือ `CANCELLED`
> >    * แนะนำให้กรอง `<option>` ของ Status ตอนแก้ไข (`editingAction`) ให้เลือกได้เฉพาะสถานะปัจจุบันและสถานะถัดไปที่อนุญาต (และบนการ์ดที่มีสถานะ `PENDING` อาจเพิ่มปุ่มลัดหรือให้เปลี่ยนเป็น `IN_PROGRESS` ได้สะดวกขึ้น) เพื่อไม่ให้ผู้ใช้เลือกสถานะที่ผิดกฎของ Backend ค่ะ
> > 
> > ### 🟡 Minor: ข้อเสนอแนะเพิ่มเติม
> > * **ฟิลด์ `actionDateTime`:** ตาม Handout (§3, §4.1, §8.3) และ `ui-spec.md` (§3.1) ระบุให้รองรับการระบุหรือแก้ไข `Action Date/Time` (โดยมีค่าเริ่มต้นเป็นเวลาปัจจุบัน) หากเพิ่มช่อง `datetime-local` ในฟอร์มได้จะครบถ้วนตามสเปกมากยิ่งขึ้นค่ะ
> > * **ค่าสี Badge ใน `renderStatusBadge` (`ActionsTaken.tsx` บรรทัด 321–342):** ใน `ui-spec.md` (§1.1) กำหนดสี `PENDING` เป็นพื้นหลัง `#FFFBEB` / ตัวอักษร `#92400E` และ `IN_PROGRESS` เป็นพื้นหลัง `#EFF6FF` / ตัวอักษร `#1E40AF` (ในโค้ดใช้ `#FEF3C7` และ `#1D4ED8`) ปรับให้ตรงกันได้เลยนะคะ
> > * **ชื่อเคสทดสอบใน `ActionsTaken.test.tsx` (บรรทัด 904, 1079, 1188):** ในไฟล์เทสต์ระบุรหัส `UI-06` ซึ่งในตาราง `docs/lab-04/tests.md` รหัส `UI-06` เป็นของ _Requester Dashboard renders cards and attention list_ แนะนำให้เปลี่ยนชื่อใน `ActionsTaken.test.tsx` เป็นรหัสของชุด Actions Taken (`UI-01` / `UI-02`) เพื่อไม่ให้รหัสเทสต์ชนกันค่ะ
> 
> ขอบคุณสำหรับรีวิวที่ละเอียดและรอบคอบมากค่ะ @jejaebubu ได้ดำเนินการแก้ไขครบทั้ง 3 Required Changes (Blocking), 3 Should Fix และ 3 Minor Suggestions ทั้งหมดใน commit `5ecac1a` เรียบร้อยแล้วค่ะ:
> 
> 1. **Auth Token Retrieval (`ActionsTaken.tsx`)**: เพิ่ม helper `getAuthToken()` ตรวจสอบทั้ง `toktickit_auth_token` และ `token` ในทั้ง 3 จุด (`loadAssignableStaff`, `handleSubmit`, `handleQuickStatusChange`) ใช้งานได้ถูกต้องทั้งบนเบราว์เซอร์จริงและในชุดทดสอบ
> 2. **ส่ง `actionsTaken` ใน `GET /api/tickets/:id` (`server/src/app.ts`)**: เพิ่ม `actionsTaken: ticket.actionsTaken` ใน `res.status(200).json({ ... })` เรียบร้อยแล้ว ทำให้หน้า Ticket Detail แสดงรายการที่ดึงมาจากฐานข้อมูลได้ทันที
> 3. **การอ่าน Error Message (`ActionsTaken.tsx`)**: ปรับปรุงทั้ง 3 จุดให้อ่าน `data.error || data.message || ...` เพื่อแสดงข้อความแจ้งเตือนข้อผิดพลาดจาก backend ได้อย่างถูกต้อง
> 4. **ลำดับการแสดงผล (`ActionsTaken.tsx`)**: ปรับการอัปเดต state รายการใหม่เป็น `const nextItems = [...items, created];` เพื่อเรียงตามลำดับเวลาจากอดีตไปปัจจุบันตรงกับ Backend
> 5. **Validation & Field Length Limits**:
>    - ปรับ `validate()` ให้ตรวจสอบ `followUpNote.trim().length < 2` พร้อมกำหนด `maxLength={500}` บน textarea
>    - กำหนด `maxLength={1000}` บนช่อง `action-description` และ `action-result` ตรงตามสเปก
> 6. **จำกัด Status ใน Modal แก้ไขตาม State Machine**:
>    - หาก Action เป็น `COMPLETED` หรือ `CANCELLED` จะล็อกไม่ให้เปลี่ยนสถานะย้อนกลับ
>    - หาก Action เป็น `IN_PROGRESS` จะแสดงเฉพาะตัวเลือก `IN_PROGRESS`, `COMPLETED`, `CANCELLED`
>    - หาก Action เป็น `PENDING` สามารถเลือกไปสถานะถัดไปได้ตามกฎ
> 7. **ฟิลด์ Action Date/Time (`ActionsTaken.tsx`)**: เพิ่มฟิลด์ `actionDateTime` (`type="datetime-local"`) ในฟอร์มทั้งตอนสร้างและแก้ไข พร้อมตั้งค่าเริ่มต้นเป็นเวลาปัจจุบัน (`new Date().toISOString()`) ตามข้อกำหนดใน Handout และ `ui-spec.md` §3.1
> 8. **ปรับคู่สี Status Badge**: ปรับ `PENDING` เป็นพื้นหลัง `#FFFBEB` / ตัวอักษร `#92400E` และ `IN_PROGRESS` เป็นพื้นหลัง `#EFF6FF` / ตัวอักษร `#1E40AF` ตรงตาม Zen Green Design Tokens
> 9. **ปรับรหัสเคสทดสอบ (`ActionsTaken.test.tsx`)**: เปลี่ยนรหัสเทสต์จาก `UI-06` เป็น `UI-02` เพื่อไม่ให้ซ้ำซ้อนกับรหัสเทสต์ของ Dashboard ใน `docs/lab-04/tests.md`
> 
> ผลการรันชุดทดสอบฝั่ง Client ผ่านครบ 12 test files / 63 tests และ build production bundle ผ่าน 100% ค่ะ รบกวนช่วยตรวจทานซ้ำอีกครั้งนะคะ ขอบคุณมากค่ะ


#### 4.4.3 Review #2 — CHANGES_REQUESTED (`jejaebubu`, 2026-11-01T18:57:19Z)

**Verdict:** CHANGES_REQUESTED (commit `5ecac1a`)

**Verbatim Review Comments:**

> ตรวจ commit `5ecac1a` รอบที่ 2 อย่างละเอียดแล้วนะคะ ขอบคุณที่ตามเก็บทั้ง 9 ข้อให้ค่ะ แต่จากการไล่เช็กโค้ดและไฟล์ `reviewer.md` พบจุดที่ต้องรบกวนช่วยปรับแก้อีก 4 จุดก่อนกด Approve & Merge นะคะ:
> 
> 1. **เวลาในช่อง `actionDateTime` (`datetime-local`) เลื่อนถอยหลัง 7 ชั่วโมงทุกครั้งที่เปิดฟอร์ม/กดบันทึก (`ActionsTaken.tsx` บรรทัด 120, 136–138)**
>    * **ปัญหา:** `<input type="datetime-local" />` ใช้เวลาแบบ Local Time (`YYYY-MM-DDTHH:mm`) แต่ใน `openCreateForm` และ `openEditForm` ใช้ `.toISOString().slice(0, 16)` ซึ่งเป็นเวลา UTC พอเปิดในโซนเวลาไทย (UTC+7) เวลาจะถอยหลังไป 7 ชั่วโมง และทุกครั้งที่กด Edit แล้วกด Save (`new Date(actionDateTime).toISOString()`) เวลาของรายการนั้นจะถูกเลื่อนถอยหลังไปเรื่อย ๆ ครั้งละ 7 ชั่วโมงค่ะ
>    * **แนวทางแก้:** สร้าง helper แปลง `Date` เป็น Local `YYYY-MM-DDTHH:mm` สำหรับใส่ใน state `actionDateTime` แทนการใช้ `.toISOString().slice(0, 16)` ค่ะ เช่น:
>      `const toLocalDateTimeInput = (iso?: string) => { const d = iso ? new Date(iso) : new Date(); const pad = (n: number) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`; };`
> 
> 2. **การกดปุ่มลัด `Complete` บนการ์ดทำให้ `editingAction.status` กลายเป็น `COMPLETED` แล้วล็อกช่อง Status (`ActionsTaken.tsx` บรรทัด 133, 267, 495)**
>    * **ปัญหา:** ใน `handleQuickStatusChange` (บรรทัด 267) เรียก `openEditForm({ ...action, status: 'COMPLETED' })` ซึ่งทำให้ `editingAction.status` ถูกทับเป็น `'COMPLETED'` ส่งผลให้ `<select id="action-status">` (บรรทัด 495–501) เข้าใจผิดว่า Action นี้อยู่ในสถานะ Terminal (`COMPLETED`) ไปแล้วและสั่ง `disabled` ล็อกช่องเลือกสถานะทันที ทั้งที่สถานะจริงใน DB ยังเป็น `PENDING` หรือ `IN_PROGRESS`
>    * **แนวทางแก้:** ปรับ `openEditForm(action: ActionTakenItem, initialStatus?: string)` ให้เก็บ `setEditingAction(action)` ตามสถานะจริงใน DB เหมือนเดิม แล้วเซ็ต `setStatus(initialStatus ?? action.status)` แทนค่ะ (และตอนกดปุ่ม `Complete` ให้เรียก `openEditForm(action, 'COMPLETED')`)
> 
> 3. **ความถูกต้องของบันทึกใน `docs/lab-04/reviewer.md` (บรรทัด 623–669)**
>    * ในหัวข้อ `Round 1 Review by @jejaebubu (Changes Requested)` (บรรทัด 623–643) บันทึกไว้แค่ 8 ข้อ (ในหมวด Minor มีแค่ 2 ข้อ ขาดข้อ `ฟิลด์ actionDateTime` ซึ่งไปโผล่เป็นข้อ 9 ในฝั่ง Author Response แทน) รบกวนปรับข้อความใน `Review Comments (Verbatim)` ให้ครบทั้ง 9 ข้อตรงกับคอมเมนต์จริงบน GitHub ด้วยนะคะ
>    * ในหัวข้อ `Round 1 Author Response by @titayaaa` (บรรทัด 669) ระบุว่า `ดำเนินการ commit ใน 2d6f47e` แต่ commit จริงบน PR คือ `5ecac1a` รบกวนอัปเดตเลข commit ให้ตรงกันด้วยค่ะ
> 
> 4. **เพิ่มเคสทดสอบใน `client/src/test/lab-04/ActionsTaken.test.tsx`**
>    * รบกวนเพิ่ม test ยืนยันการเปิด Edit Modal (ตรวจว่าการกรองตัวเลือก Status ตาม State Machine ทำงานถูกต้อง และใช้คีย์ `toktickit_auth_token` ได้จริง) อีกสัก 1 เคสนะคะ
> 
> แก้ 4 จุดนี้เสร็จแล้วทักมาได้เลยนะคะ เดี๋ยวรีบตรวจและกด Approve & Merge ให้ทันทีค่ะ ขอบคุณมากค่ะ!


#### 4.4.4 Author Response #2 (`titayaaa`, 2026-11-01T19:33:54Z)

> > ตรวจ commit `5ecac1a` รอบที่ 2 อย่างละเอียดแล้วนะคะ ขอบคุณที่ตามเก็บทั้ง 9 ข้อให้ค่ะ แต่จากการไล่เช็กโค้ดและไฟล์ `reviewer.md` พบจุดที่ต้องรบกวนช่วยปรับแก้อีก 4 จุดก่อนกด Approve & Merge นะคะ:
> > 
> > 1. **เวลาในช่อง `actionDateTime` (`datetime-local`) เลื่อนถอยหลัง 7 ชั่วโมงทุกครั้งที่เปิดฟอร์ม/กดบันทึก (`ActionsTaken.tsx` บรรทัด 120, 136–138)**
> >    
> >    * **ปัญหา:** `<input type="datetime-local" />` ใช้เวลาแบบ Local Time (`YYYY-MM-DDTHH:mm`) แต่ใน `openCreateForm` และ `openEditForm` ใช้ `.toISOString().slice(0, 16)` ซึ่งเป็นเวลา UTC พอเปิดในโซนเวลาไทย (UTC+7) เวลาจะถอยหลังไป 7 ชั่วโมง และทุกครั้งที่กด Edit แล้วกด Save (`new Date(actionDateTime).toISOString()`) เวลาของรายการนั้นจะถูกเลื่อนถอยหลังไปเรื่อย ๆ ครั้งละ 7 ชั่วโมงค่ะ
> >    * **แนวทางแก้:** สร้าง helper แปลง `Date` เป็น Local `YYYY-MM-DDTHH:mm` สำหรับใส่ใน state `actionDateTime` แทนการใช้ `.toISOString().slice(0, 16)` ค่ะ เช่น:
> >      `const toLocalDateTimeInput = (iso?: string) => { const d = iso ? new Date(iso) : new Date(); const pad = (n: number) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`; };`
> > 2. **การกดปุ่มลัด `Complete` บนการ์ดทำให้ `editingAction.status` กลายเป็น `COMPLETED` แล้วล็อกช่อง Status (`ActionsTaken.tsx` บรรทัด 133, 267, 495)**
> >    
> >    * **ปัญหา:** ใน `handleQuickStatusChange` (บรรทัด 267) เรียก `openEditForm({ ...action, status: 'COMPLETED' })` ซึ่งทำให้ `editingAction.status` ถูกทับเป็น `'COMPLETED'` ส่งผลให้ `<select id="action-status">` (บรรทัด 495–501) เข้าใจผิดว่า Action นี้อยู่ในสถานะ Terminal (`COMPLETED`) ไปแล้วและสั่ง `disabled` ล็อกช่องเลือกสถานะทันที ทั้งที่สถานะจริงใน DB ยังเป็น `PENDING` หรือ `IN_PROGRESS`
> >    * **แนวทางแก้:** ปรับ `openEditForm(action: ActionTakenItem, initialStatus?: string)` ให้เก็บ `setEditingAction(action)` ตามสถานะจริงใน DB เหมือนเดิม แล้วเซ็ต `setStatus(initialStatus ?? action.status)` แทนค่ะ (และตอนกดปุ่ม `Complete` ให้เรียก `openEditForm(action, 'COMPLETED')`)
> > 3. **ความถูกต้องของบันทึกใน `docs/lab-04/reviewer.md` (บรรทัด 623–669)**
> >    
> >    * ในหัวข้อ `Round 1 Review by @jejaebubu (Changes Requested)` (บรรทัด 623–643) บันทึกไว้แค่ 8 ข้อ (ในหมวด Minor มีแค่ 2 ข้อ ขาดข้อ `ฟิลด์ actionDateTime` ซึ่งไปโผล่เป็นข้อ 9 ในฝั่ง Author Response แทน) รบกวนปรับข้อความใน `Review Comments (Verbatim)` ให้ครบทั้ง 9 ข้อตรงกับคอมเมนต์จริงบน GitHub ด้วยนะคะ
> >    * ในหัวข้อ `Round 1 Author Response by @titayaaa` (บรรทัด 669) ระบุว่า `ดำเนินการ commit ใน 2d6f47e` แต่ commit จริงบน PR คือ `5ecac1a` รบกวนอัปเดตเลข commit ให้ตรงกันด้วยค่ะ
> > 4. **เพิ่มเคสทดสอบใน `client/src/test/lab-04/ActionsTaken.test.tsx`**
> >    
> >    * รบกวนเพิ่ม test ยืนยันการเปิด Edit Modal (ตรวจว่าการกรองตัวเลือก Status ตาม State Machine ทำงานถูกต้อง และใช้คีย์ `toktickit_auth_token` ได้จริง) อีกสัก 1 เคสนะคะ
> > 
> > แก้ 4 จุดนี้เสร็จแล้วทักมาได้เลยนะคะ เดี๋ยวรีบตรวจและกด Approve & Merge ให้ทันทีค่ะ ขอบคุณมากค่ะ!
> 
> ขอบคุณ @jejaebubu สำหรับการตรวจทานรอบที่ 2 อย่างละเอียดถี่ถ้วนมากค่ะ ได้ดำเนินการปรับปรุงและแก้ไขครบถ้วนทั้ง 4 จุดเรียบร้อยแล้วค่ะ:
> 
> 1. **แก้ไขปัญหา Timezone Shift ในช่อง `actionDateTime` (`ActionsTaken.tsx`)**:
>    - เพิ่ม helper `toLocalDateTimeInput(iso?: string)` สำหรับแปลงเวลาเป็น Local Time string ฟอร์แมต `YYYY-MM-DDTHH:mm`
>    - ปรับ `openCreateForm` และ `openEditForm` ให้เรียกใช้ helper ดังกล่าวแทน `.toISOString().slice(0, 16)` ซึ่งเป็น UTC ทำให้เวลาไม่ถอยหลัง 7 ชั่วโมงเมื่อเปิดฟอร์มหรือบันทึกข้อมูลในเขตเวลาไทย (UTC+7)
> 2. **แก้ไขการล็อกช่อง Status เมื่อกดปุ่ม Quick Complete (`ActionsTaken.tsx`)**:
>    - ปรับ signature ของฟังก์ชันเป็น `openEditForm(action: ActionTakenItem, initialStatus?: string)`
>    - ให้ `setEditingAction(action)` เก็บข้อมูลสถานะจริงจากฐานข้อมูลเหมือนเดิม เพื่อให้ State Machine Guard ประเมินสถานะก่อนหน้าได้อย่างถูกต้อง และกำหนด `setStatus(initialStatus ?? action.status)` เป็นค่าเริ่มต้นของฟอร์ม
>    - เมื่อกดปุ่ม Complete ด่วน จะเรียก `openEditForm(action, 'COMPLETED')` ทำให้ modal เปิดขึ้นพร้อมเลือกสถานะ COMPLETED ให้ทันทีโดยที่ Dropdown ไม่ถูก disabled ล็อกค้าง
> 3. **ปรับปรุงความถูกต้องของเอกสาร `docs/lab-04/reviewer.md`**:
>    - ปรับข้อความ Round 1 Review by @jejaebubu ให้มีครบทั้ง 9 ข้อโดยเพิ่มข้อ 3 ในหมวด Minor เรื่องฟิลด์ `actionDateTime` ตรงกับคอมเมนต์จริง
>    - อัปเดตเลขอ้างอิง commit ใน Round 1 Author Response จาก `2d6f47e` เป็น `5ecac1a` ให้ตรงกับประวัติคอมมิตจริงบน GitHub
>    - บันทึกบทสนทนาการรีวิว Round 2 ทั้งข้อเสนอแนะและคำตอบรับอย่างครบถ้วน
> 4. **เพิ่มเคสทดสอบ Edit Modal และ State Machine ใน `ActionsTaken.test.tsx`**:
>    - เพิ่มเคสทดสอบ `UI-02: verifies Edit modal filters Status by State Machine and uses toktickit_auth_token`
>    - ทดสอบยืนยันว่าการเปิด Edit Modal ดึง `toktickit_auth_token` ส่งไปยัง header `Authorization: Bearer ...` สำเร็จ
>    - ทดสอบยืนยันว่า State Machine กรองสถานะสำหรับ Action ที่เป็น `IN_PROGRESS` ให้เหลือเฉพาะ `IN_PROGRESS`, `COMPLETED`, และ `CANCELLED` (ไม่มี `PENDING`)
>    - ทดสอบยืนยันว่าการกด Quick Complete เปิด Edit modal ด้วยสถานะ COMPLETED โดยช่อง select ไม่ถูก disabled
> 
> ผลการรันเทสต์ฝั่ง Client ผ่านครบ 12 test files / 64 tests (100%) และรัน `npm run build` ผ่านสมบูรณ์ 0 errors รบกวนช่วยตรวจทานและ Approve & Merge ได้เลยนะคะ ขอบคุณมากค่ะ


#### 4.4.5 Review #3 — APPROVED (`jejaebubu`, 2026-11-01T19:45:07Z)

**Verdict:** APPROVED (commit `e34f19e`)

**Verbatim Review Comments:**

> ตรวจสอบ commit `e34f19e` รอบที่ 3 เรียบร้อยแล้วนะคะ แก้ไขครบถ้วนสมบูรณ์ทั้ง 4 จุดแล้วค่ะ:
> 
> 1. ✅ **Local DateTime Helper (`ActionsTaken.tsx`):** เพิ่ม `toLocalDateTimeInput()` แปลงเวลาเป็น Local Time (`YYYY-MM-DDTHH:mm`) ทั้งใน `openCreateForm` และ `openEditForm` แก้ปัญหาเวลาเลื่อนถอยหลัง 7 ชั่วโมงเรียบร้อย
> 2. ✅ **Quick Complete Status Select (`ActionsTaken.tsx`):** ปรับ `openEditForm(action, initialStatus)` ให้คง `editingAction` ตามสถานะจริงใน DB และตั้งค่าเริ่มต้น `status` เป็น `COMPLETED` โดยไม่ล็อกช่อง `<select>` ค้าง
> 3. ✅ **บันทึกใน `docs/lab-04/reviewer.md`:** อัปเดตรายการรีวิวรอบที่ 1 ครบทั้ง 9 ข้อ, แก้เลขอ้างอิง commit เป็น `5ecac1a` และบันทึกประวัติรอบที่ 2 ครบถ้วน
> 4. ✅ **Component Test (`ActionsTaken.test.tsx`):** เพิ่มเทสต์ตรวจสอบการใช้คีย์ `toktickit_auth_token`, การกรองตัวเลือก Status ตาม State Machine ในโหมดแก้ไข และการกดปุ่มลัด `Complete` เรียบร้อย
> 
> ขอ **Approve** และกด Merge เข้า `lab4-staging` ให้เลยนะคะ


**คำวินิจฉัย:** **APPROVED & MERGED** — Reviewer (@jejaebubu) อนุมัติและเป็นผู้กด Merge PR #78 เข้า `lab4-staging` เรียบร้อย (Merge SHA: `36e2e531a7f70e3fe9dec2ed7e18d87fcff89698`, 2026-11-01T19:45:28Z) — **Closes PR #78**

---

### 4.5 PR #79: feat(workflow): implement Ticket workflow operations, resolution gate, and optimistic concurrency (Issue #31) (`titayaaa/toktickit`)

- **PR URL:** [titayaaa/toktickit#79](https://github.com/titayaaa/toktickit/pull/79)
- **Author:** `@titayaaa` (ฑิตญา ผ่องสกุล)
- **Reviewer:** `@jejaebubu` (GitHub: [jejaebubu](https://github.com/jejaebubu))
- **Source Branch:** `feature/31-ticket-workflow`
- **Target Branch:** `lab4-staging`
- **Current Status:** Approved & Merged (merge commit `1a056c2cc5767e25a8181115d6e974d9011e3d60`, 2026-11-01T21:12:18Z)
- **Merged by:** `@jejaebubu`
- **Latest Reviewed Commit:** `810bdb3c50a9ead38c06d414bbfdcc908c2f29d0`

#### 4.5.1 Review #1 — COMMENTED (`jejaebubu`, 2026-11-01T20:49:58Z)

**Verdict:** COMMENTED (commit `a3a3150`)

**Verbatim Review Comments:**

> ตรวจโค้ด Ticket Workflow, Resolution Gate, Optimistic Concurrency และชุดทดสอบของ PR #79 (Issue 31) เทียบกับ `schema.prisma`, `specification.md`, `api-spec.md` และ `tests.md` อย่างละเอียดรอบด้านแล้วนะคะ ภาพรวมทำออกมาได้อย่างยอดเยี่ยมและรัดกุมมากค่ะ 
> 
> ### จุดเด่นที่ทำได้ดีมาก
> 1. **Resolution Gate Enforcement (BR-09, AC-07, AC-08):** ใน `server/src/routes/staff.ts` (`PATCH /api/staff/tickets/:id/resolve`) ตรวจจับ Actions Taken ที่ค้างสถานะ `PENDING` หรือ `IN_PROGRESS` ได้อย่างแม่นยำ ปฏิเสธด้วย `409 Conflict` (`RESOLUTION_GATE_BLOCKED`) พร้อมส่ง `unresolvedCount` และ `blockingActions` ให้ลูกค้านำไปแสดงผลได้อย่างชัดเจน
> 2. **Optimistic Concurrency Protection (BR-14, AC-12):** ตรวจสอบ `expectedUpdatedAt` กับ `ticket.updatedAt` ในทั้งสอง Endpoint พร้อมปัดเศษความคลาดเคลื่อนระดับ 1 วินาที (`Math.abs > 1000`) ตาม RFC 7231 ตอบกลับด้วย `409 Conflict` (`STALE_UPDATE_CONFLICT`) ป้องกันปัญหาแย่งกันแก้ไขข้อมูลได้อย่างสมบูรณ์
> 3. **State Machine Transition Matrix (BR-11, WORKFLOW-01):** บังคับใช้เงื่อนไขตามตาราง 9 สถานะใน `VALID_TRANSITIONS` บล็อกไม่ให้ข้ามจาก `NEW`/`OPEN` ไป `RESOLVED` โดยตรง และบังคับใช้ `/resolve` พร้อม `resolutionSummary` 3–500 ตัวอักษร
> 4. **UX & Warning Banners (UI-04):** ใน `TicketDetail.tsx` แสดงแบนเนอร์สีเหลืองเตือน Resolution Gate ทั้งบน Operational Toolbar และภายใน Resolve Modal รวมถึงการแจ้งเตือน Stale update เมื่อเกิด Conflict (409)
> 5. **Test Suite:** ชุดทดสอบ `ticket-workflow.api.test.ts` (API-07 ถึง API-10, API-14, WORKFLOW-01) และ `TicketWorkflow.test.tsx` (UI-04 4 เคส) ครอบคลุมครบถ้วน รันผ่าน 100%
> 
> ---
> 
> ### ข้อเสนอแนะเพิ่มเติมเพื่อความสมบูรณ์แบบ (Should Fix & Minor)
> 
> 1. **State Transition ใน `TicketDetail.tsx` (บรรทัด 483–485) ขาดสถานะ `PENDING` ในเคส `REOPENED`**
>    * ใน `server/src/routes/staff.ts` และ `specification.md` Section 5.1 กำหนดให้สถานะ `REOPENED` สามารถย้ายไป `PENDING` (พักรอ Vendor) ได้
>    * แต่ใน `TicketDetail.tsx` ฟังก์ชัน `getAllowedNextStatuses` ระบุ:
>      `case 'REOPENED': return ['IN_PROGRESS', 'RESOLVED', 'CANCELLED'];`
>    * แนะนำให้เพิ่ม `'PENDING'` เข้าไปในอาร์เรย์เป็น `['IN_PROGRESS', 'PENDING', 'RESOLVED', 'CANCELLED']` เพื่อให้เจ้าหน้าที่สามารถเลือกสถานะนี้จาก Dropdown บนหน้าเว็บได้ค่ะ
> 2. **บันทึก AI Pairing Log ใน `docs/lab-04/ai-use.md` สำหรับ Issue 31**
>    * แนะนำให้เพิ่ม Prompt 11 และ Section 3.5 Reflection สำหรับ Ticket Workflow, Resolution Gate และ Optimistic Concurrency ใน `docs/lab-04/ai-use.md` ให้ครบถ้วนตามเกณฑ์ส่งงานของ Lab 4 ค่ะ
> 3. **อัปเดตเอกสาร `docs/lab-04/api-spec.md` (หัวข้อ 3.1 และ 3.2)**
>    * นำคำว่า `*(Planned for Issue 31)*` ออก และปรับตัวอย่าง JSON response ของ Conflict (409) ให้ตรงกับโครงสร้างจริง (`code: 'RESOLUTION_GATE_BLOCKED'` / `'STALE_UPDATE_CONFLICT'`)
> 4. **การส่ง `relatedSystemId` ใน `ticket-workflow.api.test.ts`**
>    * ในฟังก์ชันทดสอบมีการระบุ `relatedSystemId: relatedSystem?.id || null` เนื่องจากฟิลด์นี้ใน `schema.prisma` เป็น required (`Int` ไม่ nullable) แนะนำให้ใช้ `relatedSystem.id` ตรง ๆ เหมือนกับ `categoryId: category.id` ค่ะ


#### 4.5.2 Author Response #1 (`titayaaa`, 2026-11-01T21:00:27Z)

> > ตรวจโค้ด Ticket Workflow, Resolution Gate, Optimistic Concurrency และชุดทดสอบของ PR #79 (Issue 31) เทียบกับ `schema.prisma`, `specification.md`, `api-spec.md` และ `tests.md` อย่างละเอียดรอบด้านแล้วนะคะ ภาพรวมทำออกมาได้อย่างยอดเยี่ยมและรัดกุมมากค่ะ
> > 
> > ### จุดเด่นที่ทำได้ดีมาก
> > 1. **Resolution Gate Enforcement (BR-09, AC-07, AC-08):** ใน `server/src/routes/staff.ts` (`PATCH /api/staff/tickets/:id/resolve`) ตรวจจับ Actions Taken ที่ค้างสถานะ `PENDING` หรือ `IN_PROGRESS` ได้อย่างแม่นยำ ปฏิเสธด้วย `409 Conflict` (`RESOLUTION_GATE_BLOCKED`) พร้อมส่ง `unresolvedCount` และ `blockingActions` ให้ลูกค้านำไปแสดงผลได้อย่างชัดเจน
> > 2. **Optimistic Concurrency Protection (BR-14, AC-12):** ตรวจสอบ `expectedUpdatedAt` กับ `ticket.updatedAt` ในทั้งสอง Endpoint พร้อมปัดเศษความคลาดเคลื่อนระดับ 1 วินาที (`Math.abs > 1000`) ตาม RFC 7231 ตอบกลับด้วย `409 Conflict` (`STALE_UPDATE_CONFLICT`) ป้องกันปัญหาแย่งกันแก้ไขข้อมูลได้อย่างสมบูรณ์
> > 3. **State Machine Transition Matrix (BR-11, WORKFLOW-01):** บังคับใช้เงื่อนไขตามตาราง 9 สถานะใน `VALID_TRANSITIONS` บล็อกไม่ให้ข้ามจาก `NEW`/`OPEN` ไป `RESOLVED` โดยตรง และบังคับใช้ `/resolve` พร้อม `resolutionSummary` 3–500 ตัวอักษร
> > 4. **UX & Warning Banners (UI-04):** ใน `TicketDetail.tsx` แสดงแบนเนอร์สีเหลืองเตือน Resolution Gate ทั้งบน Operational Toolbar และภายใน Resolve Modal รวมถึงการแจ้งเตือน Stale update เมื่อเกิด Conflict (409)
> > 5. **Test Suite:** ชุดทดสอบ `ticket-workflow.api.test.ts` (API-07 ถึง API-10, API-14, WORKFLOW-01) และ `TicketWorkflow.test.tsx` (UI-04 4 เคส) ครอบคลุมครบถ้วน รันผ่าน 100%
> > 
> > ### ข้อเสนอแนะเพิ่มเติมเพื่อความสมบูรณ์แบบ (Should Fix & Minor)
> > 1. **State Transition ใน `TicketDetail.tsx` (บรรทัด 483–485) ขาดสถานะ `PENDING` ในเคส `REOPENED`**
> >    
> >    * ใน `server/src/routes/staff.ts` และ `specification.md` Section 5.1 กำหนดให้สถานะ `REOPENED` สามารถย้ายไป `PENDING` (พักรอ Vendor) ได้
> >    * แต่ใน `TicketDetail.tsx` ฟังก์ชัน `getAllowedNextStatuses` ระบุ:
> >      `case 'REOPENED': return ['IN_PROGRESS', 'RESOLVED', 'CANCELLED'];`
> >    * แนะนำให้เพิ่ม `'PENDING'` เข้าไปในอาร์เรย์เป็น `['IN_PROGRESS', 'PENDING', 'RESOLVED', 'CANCELLED']` เพื่อให้เจ้าหน้าที่สามารถเลือกสถานะนี้จาก Dropdown บนหน้าเว็บได้ค่ะ
> > 2. **บันทึก AI Pairing Log ใน `docs/lab-04/ai-use.md` สำหรับ Issue 31**
> >    
> >    * แนะนำให้เพิ่ม Prompt 11 และ Section 3.5 Reflection สำหรับ Ticket Workflow, Resolution Gate และ Optimistic Concurrency ใน `docs/lab-04/ai-use.md` ให้ครบถ้วนตามเกณฑ์ส่งงานของ Lab 4 ค่ะ
> > 3. **อัปเดตเอกสาร `docs/lab-04/api-spec.md` (หัวข้อ 3.1 และ 3.2)**
> >    
> >    * นำคำว่า `*(Planned for Issue 31)*` ออก และปรับตัวอย่าง JSON response ของ Conflict (409) ให้ตรงกับโครงสร้างจริง (`code: 'RESOLUTION_GATE_BLOCKED'` / `'STALE_UPDATE_CONFLICT'`)
> > 4. **การส่ง `relatedSystemId` ใน `ticket-workflow.api.test.ts`**
> >    
> >    * ในฟังก์ชันทดสอบมีการระบุ `relatedSystemId: relatedSystem?.id || null` เนื่องจากฟิลด์นี้ใน `schema.prisma` เป็น required (`Int` ไม่ nullable) แนะนำให้ใช้ `relatedSystem.id` ตรง ๆ เหมือนกับ `categoryId: category.id` ค่ะ
> 
> ขอบคุณ @jejaebubu สำหรับการตรวจทานที่ละเอียดรอบคอบและช่วยแนะนำจุดต่อยอดให้สมบูรณ์ยิ่งขึ้นค่ะ! 
> 
> @titayaaa ได้ดำเนินการปรับแก้ครบถ้วนทั้ง 4 ข้อเสนอแนะใน commit `810bdb3` เรียบร้อยแล้วนะคะ:
> 1. **เพิ่มสถานะ 'PENDING' ในเคส REOPENED ของ `TicketDetail.tsx`**: ปรับ `getAllowedNextStatuses` ในเคส `'REOPENED'` เป็น `['IN_PROGRESS', 'PENDING', 'RESOLVED', 'CANCELLED']` ให้ตรงกับ State Transition Matrix ใน Section 5.1 และ backend `VALID_TRANSITIONS`
> 2. **บันทึก AI Pairing Log ใน `docs/lab-04/ai-use.md`**: เพิ่ม Prompt 11 และ Section 3.5 Reflection สำหรับ Issue 31 (Resolution Gate, Optimistic Concurrency, Clock Skew Tolerance และ Preventive UI) ครบถ้วนตามเกณฑ์ส่งงาน
> 3. **อัปเดต `docs/lab-04/api-spec.md` (หัวข้อ 3.1 และ 3.2)**: นำหมายเหตุ *(Planned for Issue 31)* ออก และปรับปรุงตัวอย่าง JSON response ของ HTTP 409 Conflict ให้มีฟิลด์ `code: "STALE_UPDATE_CONFLICT"` และ `code: "RESOLUTION_GATE_BLOCKED"` พร้อม `unresolvedCount` และ `blockingActions` ตรงกับ response จริงจาก Backend
> 4. **ปรับการส่ง `relatedSystemId` ใน `ticket-workflow.api.test.ts`**: เปลี่ยนจาก `relatedSystem?.id || null` เป็น `relatedSystem.id` ตรง ๆ ทุกจุด ให้สอดคล้องกับ schema type `Int` (Non-nullable)
> 
> ผลการรันชุดทดสอบ Client ผ่าน 13/13 test files (68/68 tests 100%), Server Typecheck ผ่าน 0 errors, และ Client build (`tsc && vite build`) ผ่านเรียบร้อยค่ะ รบกวนช่วยตรวจทานรอบสุดท้ายและพิจารณา Approve & Merge ได้เลยนะคะ ขอบคุณมากค่ะ!


#### 4.5.3 Review #2 — APPROVED (`jejaebubu`, 2026-11-01T21:12:03Z)

**Verdict:** APPROVED (commit `810bdb3`)

**Verbatim Review Comments:**

> ตรวจ commit `810bdb3` รอบสุดท้ายอย่างละเอียดแล้วนะคะ ขอบคุณที่เก็บงานและปรับแก้ทั้ง 4 จุดได้อย่างรวดเร็วและสมบูรณ์แบบมากค่ะ:
>  
> 1. **State Transition ใน `TicketDetail.tsx`:** เพิ่มสถานะ `'PENDING'` ในเคส `'REOPENED'` เรียบร้อย ทำให้เจ้าหน้าที่สามารถพักงานรอ Vendor ได้ตาม Business Matrix ใน `specification.md`
> 2. **AI Pairing Log ใน `docs/lab-04/ai-use.md`:** บันทึก Prompt 11 และ Section 3.5 Reflection ครบถ้วนตามเกณฑ์ส่งงานของ Lab 4
> 3. **API Documentation ใน `docs/lab-04/api-spec.md`:** ปรับปรุง Error schema ของ HTTP 409 Conflict ให้ตรงกับ Implementation จริง และนำหมายเหตุ Planned ออกเรียบร้อย
> 4. **Prisma Type Safety ใน `ticket-workflow.api.test.ts`:** แก้ไขการส่ง `relatedSystemId: relatedSystem.id` เป็น Type-safe Non-null เรียบร้อย
> 5. **Verification & Build:** รันชุดทดสอบ Client (`TicketWorkflow.test.tsx`, `ActionsTaken.test.tsx`) ผ่าน 100% และ Client production build ผ่านฉลุยค่ะ
>  
> ภาพรวมฟีเจอร์ Ticket Workflow, Resolution Gate และ Optimistic Concurrency ทำออกมาได้มาตรฐานระดับ Production ครบถ้วนตาม Requirement ทุกข้อ ขอ **Approve** ให้ Merge เข้า `lab4-staging` ได้เลยค่ะ


**คำวินิจฉัย:** **APPROVED & MERGED** — Reviewer (@jejaebubu) อนุมัติและเป็นผู้กด Merge PR #79 เข้า `lab4-staging` เรียบร้อย (Merge SHA: `1a056c2cc5767e25a8181115d6e974d9011e3d60`, 2026-11-01T21:12:18Z) — **Closes PR #79**

---

### 4.6 PR #80: feat(dashboard): implement IT Staff Dashboard API, summary metrics, and UI screen (Issue #32, #68) (`titayaaa/toktickit`)

- **PR URL:** [titayaaa/toktickit#80](https://github.com/titayaaa/toktickit/pull/80)
- **Author:** `@titayaaa` (ฑิตญา ผ่องสกุล)
- **Reviewer:** `@jejaebubu` (GitHub: [jejaebubu](https://github.com/jejaebubu))
- **Source Branch:** `feature/32-staff-dashboard`
- **Target Branch:** `lab4-staging`
- **Current Status:** Approved & Merged (merge commit `ba347fb8ec5e4e5b1d3b24939df89556fccdf105`, 2026-11-01T22:20:59Z)
- **Merged by:** `@jejaebubu`
- **Latest Reviewed Commit:** `cd3f61fd1b013c4709aab808a2d7995b3e374ce4`

#### 4.6.1 Review #1 — CHANGES_REQUESTED (`jejaebubu`, 2026-11-01T22:09:12Z)

**Verdict:** CHANGES_REQUESTED (commit `5859006`)

**Verbatim Review Comments:**

> ตรวจโค้ด REST API, การคำนวณ Operational Metrics, หน้าจอ UI `StaffDashboard.tsx` และชุดทดสอบของ PR #80 (Issue 32) เทียบกับ `schema.prisma`, `specification.md`, `api-spec.md` และ `ui-spec.md` อย่างละเอียดรอบด้านแล้วนะคะ ภาพรวมการจัดเลย์เอาต์ธีม Zen Green, การ์ดสรุปสถิติ 4 ใบ, ตาราง Responsive Urgent Queue และการเชื่อมโยง Drill-down ไปยัง Queue ทำไว้ดีมากเลยค่ะ
> 
> แต่ขอ **Changes Requested** ก่อนนะคะ เนื่องจากมีจุดสำคัญเรื่องการยืนยันตัวตน (Authentication) บนหน้าเว็บจริง และ Foreign Key Constraint ในชุดทดสอบที่ต้องรบกวนช่วยปรับแก้ก่อน Merge ค่ะ:
>  
> ### 🔴 Blocking: ต้องแก้ก่อน Merge
> 1. **`client/src/components/StaffDashboard.tsx` (บรรทัด 122, 126): ขาด `Authorization` Header ใน `fetchDashboardData` ทำให้หน้าเว็บจริงเสี่ยงติด `401 Unauthorized`**
>    - **ปัญหา:** ใน `fetchDashboardData` เรียก `fetch('/api/staff/dashboard')` และ fallback `fetch('/api/dashboard/staff')` โดยไม่ได้ส่ง `headers` ใด ๆ
>    - ในระบบ TokTickIT ผู้ใช้เก็บ JWT token ไว้ใน `localStorage` ด้วยคีย์ `'toktickit_auth_token'` (ตาม `AuthContext.tsx`) หากผู้ใช้รีเฟรชหน้าเว็บหรือใช้งานในกรณีที่ cookie ไม่ถูกส่ง API จะปฏิเสธด้วย `401 Unauthorized` ส่งผลให้หน้า Dashboard โหลดข้อมูลไม่ขึ้นและแสดง error ทันที
>    - **แนวทางแก้:** ดึง token จาก `useAuth()` หรือ `localStorage.getItem('toktickit_auth_token')` แล้วส่ง headers ในคำสั่ง fetch เช่น:
>      ```ts
>      const token = localStorage.getItem('toktickit_auth_token');
>      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
>      const res = await fetch('/api/staff/dashboard', { headers });
>      ```
> 
> 2. **`server/tests/lab-04/staff-dashboard.api.test.ts` (บรรทัด 75, 98, 115): ผูก `requesterId: requesterUser.id` ข้ามตาราง และไม่ได้ส่ง `userId`**
>    - **ปัญหา:** ใน `beforeAll` ตอนสร้างตั๋วทดสอบ มีการระบุ `requesterId: requesterUser.id` โดยตรง ซึ่ง `requesterUser` มาจากตาราง `User` (`Role.REQUESTER`)
>    - ตาม `schema.prisma` โมเดล `Ticket` ฟิลด์ `requesterId` ชี้ไปยัง `RequesterUser.id` ส่วน `User.id` จะเชื่อมผ่านฟิลด์ `userId` (`relation("TicketRequester")`) หากรันกับฐานข้อมูลจริงจะเกิด Foreign Key Constraint Failed และทำให้ `ticket.requester` ใน endpoint `/dashboard` มีค่าเป็น `null`
>    - **แนวทางแก้:** ปรับให้เหมือนกับ `ticket-workflow.api.test.ts` (PR #79) โดยค้นหาหรือสร้าง `RequesterUser` (`reqJennifer`) ก่อน แล้วส่ง `requesterId: reqJennifer.id` พร้อมทั้งส่ง `userId: requesterUser.id` ค่ะ
> 
> ---
> 
> ### 🟠 Should Fix: ความสอดคล้องของ Filter Drill-Down
> 3. **`client/src/components/StaffDashboard.tsx` (บรรทัด 334): การคลิกการ์ด "My Pending Actions" ขาดการกรอง `ownerFilter: 'me'`**
>    - ตอนคลิกการ์ด My Pending Actions มีการเรียก `onDrillDown?.({ status: 'IN_PROGRESS' })` เพียงอย่างเดียว ทำให้พอนำทางไปหน้าคิวตั๋ว ระบบจะแสดงตั๋ว In Progress ของทุกคนในระบบ แทนที่จะแสดงเฉพาะงานของตนเอง
>   - **แนวทางแก้:** ปรับเป็น `onDrillDown?.({ status: 'IN_PROGRESS', ownerFilter: 'me' })`
> 
> 4. **`client/src/components/StaffDashboard.tsx` (บรรทัด 369): Status Casing ใน Hidden Alias**
>    - ในแท็ก `<span data-testid="staff-metric-card-in-progress" onClick={() => onDrillDown?.({ status: 'In Progress' })}>...</span>` ส่งค่า `'In Progress'` (มีช่องว่าง) แต่ใน Dropdown ของ `StaffTicketQueue.tsx` ตัวเลือกใช้ค่า value เป็น `'IN_PROGRESS'` แนะนำให้ปรับเป็น `status: 'IN_PROGRESS'` ให้ตรงกันค่ะ
> 
> ฝากช่วยปรับแก้ 4 จุดนี้ แล้วอัปเดตบันทึกใน `reviewer.md` อีกนิดนะคะ พร้อม Approve ให้ในรอบถัดไปทันทีค่ะ ขอบคุณมากค่ะ


#### 4.6.2 Author Response #1 (`titayaaa`, 2026-11-01T22:15:16Z)

> > ตรวจโค้ด REST API, การคำนวณ Operational Metrics, หน้าจอ UI `StaffDashboard.tsx` และชุดทดสอบของ PR #80 (Issue 32) เทียบกับ `schema.prisma`, `specification.md`, `api-spec.md` และ `ui-spec.md` อย่างละเอียดรอบด้านแล้วนะคะ ภาพรวมการจัดเลย์เอาต์ธีม Zen Green, การ์ดสรุปสถิติ 4 ใบ, ตาราง Responsive Urgent Queue และการเชื่อมโยง Drill-down ไปยัง Queue ทำไว้ดีมากเลยค่ะ
> > 
> > แต่ขอ **Changes Requested** ก่อนนะคะ เนื่องจากมีจุดสำคัญเรื่องการยืนยันตัวตน (Authentication) บนหน้าเว็บจริง และ Foreign Key Constraint ในชุดทดสอบที่ต้องรบกวนช่วยปรับแก้ก่อน Merge ค่ะ:
> > 
> > ### 🔴 Blocking: ต้องแก้ก่อน Merge
> > 1. **`client/src/components/StaffDashboard.tsx` (บรรทัด 122, 126): ขาด `Authorization` Header ใน `fetchDashboardData` ทำให้หน้าเว็บจริงเสี่ยงติด `401 Unauthorized`**
> >    
> >    * **ปัญหา:** ใน `fetchDashboardData` เรียก `fetch('/api/staff/dashboard')` และ fallback `fetch('/api/dashboard/staff')` โดยไม่ได้ส่ง `headers` ใด ๆ
> >    * ในระบบ TokTickIT ผู้ใช้เก็บ JWT token ไว้ใน `localStorage` ด้วยคีย์ `'toktickit_auth_token'` (ตาม `AuthContext.tsx`) หากผู้ใช้รีเฟรชหน้าเว็บหรือใช้งานในกรณีที่ cookie ไม่ถูกส่ง API จะปฏิเสธด้วย `401 Unauthorized` ส่งผลให้หน้า Dashboard โหลดข้อมูลไม่ขึ้นและแสดง error ทันที
> >    * **แนวทางแก้:** ดึง token จาก `useAuth()` หรือ `localStorage.getItem('toktickit_auth_token')` แล้วส่ง headers ในคำสั่ง fetch เช่น:
> >      ```ts
> >      const token = localStorage.getItem('toktickit_auth_token');
> >      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
> >      const res = await fetch('/api/staff/dashboard', { headers });
> >      ```
> > 2. **`server/tests/lab-04/staff-dashboard.api.test.ts` (บรรทัด 75, 98, 115): ผูก `requesterId: requesterUser.id` ข้ามตาราง และไม่ได้ส่ง `userId`**
> >    
> >    * **ปัญหา:** ใน `beforeAll` ตอนสร้างตั๋วทดสอบ มีการระบุ `requesterId: requesterUser.id` โดยตรง ซึ่ง `requesterUser` มาจากตาราง `User` (`Role.REQUESTER`)
> >    * ตาม `schema.prisma` โมเดล `Ticket` ฟิลด์ `requesterId` ชี้ไปยัง `RequesterUser.id` ส่วน `User.id` จะเชื่อมผ่านฟิลด์ `userId` (`relation("TicketRequester")`) หากรันกับฐานข้อมูลจริงจะเกิด Foreign Key Constraint Failed และทำให้ `ticket.requester` ใน endpoint `/dashboard` มีค่าเป็น `null`
> >    * **แนวทางแก้:** ปรับให้เหมือนกับ `ticket-workflow.api.test.ts` (PR #79) โดยค้นหาหรือสร้าง `RequesterUser` (`reqJennifer`) ก่อน แล้วส่ง `requesterId: reqJennifer.id` พร้อมทั้งส่ง `userId: requesterUser.id` ค่ะ
> > 
> > ### 🟠 Should Fix: ความสอดคล้องของ Filter Drill-Down
> > 3. **`client/src/components/StaffDashboard.tsx` (บรรทัด 334): การคลิกการ์ด "My Pending Actions" ขาดการกรอง `ownerFilter: 'me'`**
> >    
> >    * ตอนคลิกการ์ด My Pending Actions มีการเรียก `onDrillDown?.({ status: 'IN_PROGRESS' })` เพียงอย่างเดียว ทำให้พอนำทางไปหน้าคิวตั๋ว ระบบจะแสดงตั๋ว In Progress ของทุกคนในระบบ แทนที่จะแสดงเฉพาะงานของตนเอง
> > 
> > * **แนวทางแก้:** ปรับเป็น `onDrillDown?.({ status: 'IN_PROGRESS', ownerFilter: 'me' })`
> > 
> > 4. **`client/src/components/StaffDashboard.tsx` (บรรทัด 369): Status Casing ใน Hidden Alias**
> >    
> >    * ในแท็ก `<span data-testid="staff-metric-card-in-progress" onClick={() => onDrillDown?.({ status: 'In Progress' })}>...</span>` ส่งค่า `'In Progress'` (มีช่องว่าง) แต่ใน Dropdown ของ `StaffTicketQueue.tsx` ตัวเลือกใช้ค่า value เป็น `'IN_PROGRESS'` แนะนำให้ปรับเป็น `status: 'IN_PROGRESS'` ให้ตรงกันค่ะ
> > 
> > ฝากช่วยปรับแก้ 4 จุดนี้ แล้วอัปเดตบันทึกใน `reviewer.md` อีกนิดนะคะ พร้อม Approve ให้ในรอบถัดไปทันทีค่ะ ขอบคุณมากค่ะ
> 
> ขอบคุณ @jejaebubu สำหรับการตรวจทานที่ละเอียดรอบคอบและช่วยจับจุดสำคัญเรื่อง Auth Header และ Foreign Key Constraint ค่ะ ได้ดำเนินการแก้ไขปรับปรุงครบทั้ง 4 ประเด็นใน commit cd3f61f เรียบร้อยแล้วค่ะ:
> 
> 1. **เพิ่ม Authorization Header ใน `fetchDashboardData` (`StaffDashboard.tsx`)**:
>    - ดึง JWT token จาก `localStorage.getItem('toktickit_auth_token')` และแนบ `Authorization: Bearer <token>` ไปกับคำขอทั้ง endpoint หลัก `/api/staff/dashboard` และ endpoint สำรอง `/api/dashboard/staff` เรียบร้อยค่ะ
> 2. **แก้ไขการผูก Foreign Key ของตั๋วทดสอบใน `staff-dashboard.api.test.ts`**:
>    - ค้นหา/สร้างข้อมูลในตาราง `RequesterUser` (`reqJennifer`) และส่ง `requesterId: reqJennifer.id` คู่กับ `userId: requesterUser.id` ในการสร้างตั๋วทดสอบทั้ง 4 ใบ ถูกต้องตรงตาม schema.prisma เรียบร้อยค่ะ
> 3. **ปรับการกรอง Drill-Down ของการ์ด My Pending Actions (`StaffDashboard.tsx`)**:
>    - ปรับการคลิกการ์ดเป็น `onDrillDown?.({ status: 'IN_PROGRESS', ownerFilter: 'me' })` เพื่อให้แสดงเฉพาะตั๋ว In Progress ที่เป็นงานของตนเอง พร้อมเพิ่ม assertion ยืนยันใน `StaffDashboard.test.tsx` เรียบร้อยค่ะ
> 4. **ปรับ Status Casing ใน Hidden Alias (`StaffDashboard.tsx`)**:
>    - ปรับแก้ค่าสถานะใน `staff-metric-card-in-progress` เป็น `'IN_PROGRESS'` ให้ตรงกับ Enum Dropdown เรียบร้อยค่ะ
> 5. **อัปเดตบันทึกใน `docs/lab-04/reviewer.md`**:
>    - บันทึกการรีวิวรอบที่ 1 และการแก้ไขครบถ้วนสมบูรณ์แล้วค่ะ
> 
> รันชุดทดสอบ Client ผ่านครบ 19/19 tests (100%), Client build ผ่าน 0 errors, Server typecheck ผ่าน 0 errors และผลการทดสอบ Backend Dashboard API ผ่านเรียบร้อยค่ะ รบกวนช่วยตรวจทานรอบที่ 2 อีกครั้งนะคะ ขอบคุณมากค่ะ!


#### 4.6.3 Review #2 — APPROVED (`jejaebubu`, 2026-11-01T22:20:52Z)

**Verdict:** APPROVED (commit `cd3f61f`)

**Verbatim Review Comments:**

> ตรวจ commit `cd3f61f` ในการรีวิวรอบที่ 2 อย่างละเอียดรอบด้านแล้วนะคะ ขอบคุณที่ดำเนินการแก้ไขและปรับปรุงครบทั้ง 4 ประเด็นได้อย่างรวดเร็วและประณีตมากค่ะ:
> 
> 1. **Authentication Reliability (`StaffDashboard.tsx`):** มีการดึง JWT จาก `localStorage` (`toktickit_auth_token`) และแนบ `Authorization: Bearer` ไปกับ request ทั้งสอง endpoint ทำให้หน้า Dashboard โหลดข้อมูลได้อย่างเสถียร ไม่หลุด `401 Unauthorized`
> 2. **Prisma Foreign Key Safety (`staff-dashboard.api.test.ts`):** ปรับการเชื่อมโยง Foreign Key เป็น `requesterId: reqJennifer.id` และ `userId: requesterUser.id` ถูกต้องตาม `schema.prisma` 100%
> 3. **Precise Drill-Down Filtering:** การ์ด My Pending Actions กรองทั้ง `status: 'IN_PROGRESS'` และ `ownerFilter: 'me'` สอดคล้องกับบทบาทหน้าที่ของเจ้าหน้าที่ พร้อมอัปเดตชุดทดสอบยืนยัน
> 4. **Enum Consistency:** ปรับ Status Casing ใน Hidden Alias เป็น `'IN_PROGRESS'` สอดรับกับ Dropdown ของ Queue
> 5. **Documentation & Verification:** บันทึกประวัติการรีวิวใน `docs/lab-04/reviewer.md` ครบถ้วน รันเทสต์ 75/75 ผ่าน 100% และ production build ผ่านฉลุย 0 errors
> 
> คุณภาพโค้ดและชุดทดสอบยอดเยี่ยมมาก ขอ **Approve** ให้ Merge เข้า `lab4-staging` ได้เลยค่ะ


**คำวินิจฉัย:** **APPROVED & MERGED** — Reviewer (@jejaebubu) อนุมัติและเป็นผู้กด Merge PR #80 เข้า `lab4-staging` เรียบร้อย (Merge SHA: `ba347fb8ec5e4e5b1d3b24939df89556fccdf105`, 2026-11-01T22:20:59Z) — **Closes PR #80**

---

### 4.7 PR #81: feat(dashboard): implement Requester Dashboard API, personal metrics, and UI screen (Issue #33, #69) (`titayaaa/toktickit`)

- **PR URL:** [titayaaa/toktickit#81](https://github.com/titayaaa/toktickit/pull/81)
- **Author:** `@titayaaa` (ฑิตญา ผ่องสกุล)
- **Reviewer:** `@jejaebubu` (GitHub: [jejaebubu](https://github.com/jejaebubu))
- **Source Branch:** `feature/33-requester-dashboard`
- **Target Branch:** `lab4-staging`
- **Current Status:** Approved & Merged (merge commit `ce5a56682345553159b02a052dcc53b5efc4bbc5`, 2026-11-02T03:55:14Z)
- **Merged by:** `@jejaebubu`
- **Latest Reviewed Commit:** `7e48b315f7dac5a77cdb64153e52c7a268a586d1`

#### 4.7.1 Review #1 — APPROVED (`jejaebubu`, 2026-11-02T03:55:03Z)

**Verdict:** APPROVED (commit `7e48b31`)

**Verbatim Review Comments:**

> ตรวจโค้ด REST API, Data Isolation, หน้าจอ UI `RequesterDashboard.tsx`, ชุดทดสอบ และเอกสารประกอบของ PR #81 (Issue 33) เทียบกับ `specification.md`, `api-spec.md`, `ui-spec.md` และ `tests.md` อย่างละเอียดรอบด้านแล้วนะคะ ภาพรวมทำออกมาได้อย่างยอดเยี่ยมและประณีตมากค่ะ 
> 
> ### จุดเด่นที่ทำได้ดีมาก
> 1. **Strict Data Isolation & Multi-Version Ownership (BR-13, AC-10, API-12):** ใน `server/src/routes/requester.ts` ออกแบบเงื่อนไข `ownershipWhere` ตรวจสอบทั้ง `userId` และอีเมลของทั้งสองโมเดล (`requesterUser.email` และ `requester.email`) ทำให้แยกข้อมูลของ Requester แต่ละคนได้อย่างสมบูรณ์แบบ ไม่เกิดปัญหา ID ชนกันข้ามโมเดล และรองรับตั๋วแบบ Legacy ได้อย่างไร้รอยต่อ
> 2. **Action Required Notification Banner (UI-06, FR-13):** แถบเตือนสีม่วง/Amber (`#EDE7F6` / `#512DA8`) แสดงตั๋วสถานะ `WAITING_FOR_REQUESTER` ได้เด่นชัด พร้อมปุ่มกด "Inspect & Respond →" ช่วยให้ผู้ใช้ทราบทันทีว่ามีตั๋วที่รอข้อมูลเพิ่มเติม
> 3. **Seamless Drill-Down to MyTickets:** การส่ง `initialStatus` ไปยัง `MyTickets.tsx` พร้อมทั้งขยายตัวเลือกสถานะใน Dropdown ครบทั้ง 9 สถานะ ช่วยให้การคลิกการ์ดสถิติแล้วเปิดดูรายการตั๋วที่เกี่ยวข้องทำงานได้อย่างถูกต้อง
> 4. **Responsive Layout & Accessibility (STYLE-01, RESP-01, WCAG AA):** จัดเลย์เอาต์สลับระหว่าง Desktop Table และ Mobile Card Stack ได้อย่างลงตัว ปุ่มและการ์ดมี Touch target $\ge 44\text{px}$ กำหนด `overflowX: 'hidden'` ป้องกันหน้าจอเลื่อนแนวนอน และมี Empty State พร้อมปุ่ม CTA ชัดเจน
> 5. **Defensive Token & Date Handling:** มีการแนบ Header `Authorization: Bearer` พร้อมรองรับ Token fallback และแปลงวันเวลาแบบ Safe Date Serialization ป้องกันปัญหา Runtime Exception
> 6. **Test Coverage & Build Verification:** ชุดทดสอบ Client ผ่านครบ 81/81 tests (100%), Production build ผ่าน 0 errors และบันทึก `ai-use.md` (Prompt 13 & Reflection 3.7) ครบถ้วนตามเกณฑ์ส่งงาน
> 
> คุณภาพของฟีเจอร์และชุดทดสอบสมบูรณ์แบบตามเกณฑ์ทุกข้อ ขอ **Approve** ให้ Merge เข้า `lab4-staging` ได้เลยค่ะ


**คำวินิจฉัย:** **APPROVED & MERGED** — Reviewer (@jejaebubu) อนุมัติและเป็นผู้กด Merge PR #81 เข้า `lab4-staging` เรียบร้อย (Merge SHA: `ce5a56682345553159b02a052dcc53b5efc4bbc5`, 2026-11-02T03:55:14Z) — **Closes PR #81**

---

### 4.8 PR #82: test(regression): full regression of Lab 1-3 suites with Lab 4 features (Issue #34, #70) (`titayaaa/toktickit`)

- **PR URL:** [titayaaa/toktickit#82](https://github.com/titayaaa/toktickit/pull/82)
- **Author:** `@titayaaa` (ฑิตญา ผ่องสกุล)
- **Reviewer:** `@jejaebubu` (GitHub: [jejaebubu](https://github.com/jejaebubu))
- **Source Branch:** `feature/34-final-hardening`
- **Target Branch:** `lab4-staging`
- **Current Status:** Approved & Merged (merge commit `858d2ec0749aa5e2a65d283077bcd875c48a2742`, 2026-11-02T09:08:15Z)
- **Merged by:** `@jejaebubu`
- **Latest Reviewed Commit:** `2c5d703dfe31474d2fe6a8ddfdf5445b407b3f64`

#### 4.8.1 Review #1 — CHANGES_REQUESTED (`jejaebubu`, 2026-11-02T07:54:15Z)

**Verdict:** CHANGES_REQUESTED (commit `52c686b`)

**Verbatim Review Comments:**

> ตรวจสอบผลการรันชุดทดสอบย้อนหลัง (Full Regression Suite), การ Hardening ระบบ, ผลการ Build และเอกสารประกอบของ PR #82 (Issue 34) เทียบกับข้อกำหนด `REG-01`, `REG-02`, `AC-14` และ `FR-15` เรียบร้อยแล้วนะคะ
> 
> ภาพรวมการ Hardening ระบบ (Token fallback, Safe Date serialization, Status Enum ใน MyTickets) และผลการรัน Client Vitest ผ่านครบ 81/81 tests ทำได้ยอดเยี่ยมมากค่ะ แต่ขอส่งเป็น **Changes Requested** ก่อนเพื่อให้เก็บรายละเอียดความครบถ้วนของเอกสารและตารางรีวิว 4 จุดก่อนกด Approve & Merge นะคะ:
> 
> ### 🔴 จุดที่ต้องปรับแก้ก่อนอนุมัติ (Required Changes)
> 1. **บันทึกประวัติการรีวิว PR #113 ใน Part 2 ของ `docs/lab-04/reviewer.md`**:
>    - ใน Part 2 (บันทึกฝั่งที่ `@titayaaa` รีวิว `@jejaebubu`) มีบันทึกไว้ถึงแค่ `PR #112` แต่ยังขาดหัวข้อ `### PR #113: Issue #9: Lab 1–3 Regression Test Suite and System Hardening` ซึ่งทางเพื่อนได้รีวิวและอนุมัติ Merge เข้า `lab4-staging` ไปแล้ว (merge SHA: `5158f3a`) รบกวนเพิ่มบันทึกของ PR #113 ลงใน Part 2 ให้ครบถ้วนสมบูรณ์ค่ะ
> 
> ---
> 
> ### 🟠 ข้อเสนอแนะเพิ่มเติมเพื่อความสมบูรณ์แบบ (Improvement Suggestions)
> 2. **เพิ่มพาธชุดทดสอบฝั่ง Client ในตาราง `docs/lab-04/tests.md` สำหรับ `REG-01` และ `REG-02`**:
>    - ในตารางแถว `REG-01` และ `REG-02` ปัจจุบันระบุเฉพาะ `server/tests/lab-02/*.test.ts` และ `server/tests/lab-03/*.test.ts` เพื่อให้ครอบคลุมการทำ Regression ทั้ง Full-stack แนะนำให้เติมพาธฝั่ง Client เข้าไปด้วยค่ะ เช่น:
>      - `REG-01`: `server/tests/lab-02/*.test.ts, client/src/test/lab-02/*.test.tsx`
>      - `REG-02`: `server/tests/lab-03/*.test.ts, client/src/test/lab-03/*.test.tsx`
> 3. **ระบุสรุปผลการรันชุดทดสอบฝั่ง Server ใน Scope & Objectives ของ PR #82 (`reviewer.md`)**:
>    - ปัจจุบันระบุเฉพาะ Client Vitest (15 files / 81 passed) แนะนำให้ระบุสรุปผลการรันของฝั่ง Server Vitest Suite เพิ่มเติม เพื่อแสดงให้เห็นว่าผ่านการตรวจสอบ Regression ครบทั้ง Frontend และ Backend ค่ะ
> 4. **ทยอยอัปเดตตาราง Checklist Section 2 ใน `docs/lab-04/reviewer.md`**:
>    - ในตาราง Peer Review Checklist & Criteria รายการข้อ 1 ถึง 5 (Spec Completeness, Actions Taken Model, Resolution Gate, Dashboards, RBAC) ได้รับการ Merge เข้า staging ครบถ้วนแล้ว สามารถเริ่มปรับสถานะจาก `⏳ Pending` เป็น `✅ Verified` เพื่อเตรียมสรุปผลในโค้งสุดท้ายได้เลยค่ะ
> 
> ฝากช่วยปรับแก้ 4 จุดนี้ แล้วอัปเดต commit เข้ามาอีกครั้งนะคะ พร้อม Approve ให้ในรอบถัดไปทันทีค่ะ ขอบคุณมากค่ะ


#### 4.8.2 Author Response #1 (`titayaaa`, 2026-11-02T08:58:49Z)

> > ตรวจสอบผลการรันชุดทดสอบย้อนหลัง (Full Regression Suite), การ Hardening ระบบ, ผลการ Build และเอกสารประกอบของ PR #82 (Issue 34) เทียบกับข้อกำหนด `REG-01`, `REG-02`, `AC-14` และ `FR-15` เรียบร้อยแล้วนะคะ
> > 
> > ภาพรวมการ Hardening ระบบ (Token fallback, Safe Date serialization, Status Enum ใน MyTickets) และผลการรัน Client Vitest ผ่านครบ 81/81 tests ทำได้ยอดเยี่ยมมากค่ะ แต่ขอส่งเป็น **Changes Requested** ก่อนเพื่อให้เก็บรายละเอียดความครบถ้วนของเอกสารและตารางรีวิว 4 จุดก่อนกด Approve & Merge นะคะ:
> > 
> > ### 🔴 จุดที่ต้องปรับแก้ก่อนอนุมัติ (Required Changes)
> > 1. **บันทึกประวัติการรีวิว PR #113 ใน Part 2 ของ `docs/lab-04/reviewer.md`**:
> >    
> >    * ใน Part 2 (บันทึกฝั่งที่ `@titayaaa` รีวิว `@jejaebubu`) มีบันทึกไว้ถึงแค่ `PR #112` แต่ยังขาดหัวข้อ `### PR #113: Issue #9: Lab 1–3 Regression Test Suite and System Hardening` ซึ่งทางเพื่อนได้รีวิวและอนุมัติ Merge เข้า `lab4-staging` ไปแล้ว (merge SHA: `5158f3a`) รบกวนเพิ่มบันทึกของ PR #113 ลงใน Part 2 ให้ครบถ้วนสมบูรณ์ค่ะ
> > 
> > ### 🟠 ข้อเสนอแนะเพิ่มเติมเพื่อความสมบูรณ์แบบ (Improvement Suggestions)
> > 2. **เพิ่มพาธชุดทดสอบฝั่ง Client ในตาราง `docs/lab-04/tests.md` สำหรับ `REG-01` และ `REG-02`**:
> >    
> >    * ในตารางแถว `REG-01` และ `REG-02` ปัจจุบันระบุเฉพาะ `server/tests/lab-02/*.test.ts` และ `server/tests/lab-03/*.test.ts` เพื่อให้ครอบคลุมการทำ Regression ทั้ง Full-stack แนะนำให้เติมพาธฝั่ง Client เข้าไปด้วยค่ะ เช่น:
> >      
> >      * `REG-01`: `server/tests/lab-02/*.test.ts, client/src/test/lab-02/*.test.tsx`
> >      * `REG-02`: `server/tests/lab-03/*.test.ts, client/src/test/lab-03/*.test.tsx`
> > 3. **ระบุสรุปผลการรันชุดทดสอบฝั่ง Server ใน Scope & Objectives ของ PR #82 (`reviewer.md`)**:
> >    
> >    * ปัจจุบันระบุเฉพาะ Client Vitest (15 files / 81 passed) แนะนำให้ระบุสรุปผลการรันของฝั่ง Server Vitest Suite เพิ่มเติม เพื่อแสดงให้เห็นว่าผ่านการตรวจสอบ Regression ครบทั้ง Frontend และ Backend ค่ะ
> > 4. **ทยอยอัปเดตตาราง Checklist Section 2 ใน `docs/lab-04/reviewer.md`**:
> >    
> >    * ในตาราง Peer Review Checklist & Criteria รายการข้อ 1 ถึง 5 (Spec Completeness, Actions Taken Model, Resolution Gate, Dashboards, RBAC) ได้รับการ Merge เข้า staging ครบถ้วนแล้ว สามารถเริ่มปรับสถานะจาก `⏳ Pending` เป็น `✅ Verified` เพื่อเตรียมสรุปผลในโค้งสุดท้ายได้เลยค่ะ
> > 
> > ฝากช่วยปรับแก้ 4 จุดนี้ แล้วอัปเดต commit เข้ามาอีกครั้งนะคะ พร้อม Approve ให้ในรอบถัดไปทันทีค่ะ ขอบคุณมากค่ะ
> 
> ขอบคุณ [@jejaebubu](https://github.com/jejaebubu) มากค่ะ สำหรับการตรวจทาน Full Regression Suite และข้อเสนอแนะที่ละเอียดรอบด้านมากค่ะ ได้ดำเนินการปรับปรุงแก้ไขครบถ้วนทั้ง 4 จุดใน commit `2c5d703` เรียบร้อยแล้วค่ะ:
> 
> 1. **บันทึกประวัติการรีวิว PR #113 ใน Part 2 ของ `docs/lab-04/reviewer.md` (Required Change):**
>    - เพิ่มหัวข้อ `### PR #113: feat(regression): Lab 1–3 Regression Test Suite and System Hardening (Issue #9)` ใน Part 2 บันทึกประวัติการรีวิวรอบที่ 1 (Changes Requested), คำชี้แจง Author Response (commit `abb8ea3`), การตรวจประเมินรอบที่ 2 (Approved) และบันทึกการ Merge สำเร็จ (Merge SHA: `5158f3a`) ไว้อย่างครบถ้วนสมบูรณ์ค่ะ
> 2. **เพิ่มพาธชุดทดสอบฝั่ง Client สำหรับ REG-01 และ REG-02 ใน `docs/lab-04/tests.md`:**
>    - อัปเดตคอลัมน์ Automated Test File ในตารางข้อกำหนดการทดสอบ:
>      - `REG-01`: `server/tests/lab-02/*.test.ts`, `client/src/test/lab-02/*.test.tsx`
>      - `REG-02`: `server/tests/lab-03/*.test.ts`, `client/src/test/lab-03/*.test.tsx`
>      ครอบคลุมการตรวจสอบความเข้ากันได้ย้อนหลังแบบ Full-stack ทั้ง Frontend และ Backend ค่ะ
> 3. **ระบุสรุปผลการรันชุดทดสอบฝั่ง Server ใน Scope & Objectives ของ PR #82 (`docs/lab-04/reviewer.md`):**
>    - เพิ่มสรุปผลการรัน Server Vitest Suite: 19 test files / 112 passed (Lab 1–4) ควบคู่กับ Client Vitest Suite: 15 files / 81 passed รวมเป็น 34 files / 193 passed (100% Zero Regression) ค่ะ
> 4. **อัปเดตตาราง Checklist Section 2 ใน `docs/lab-04/reviewer.md` เป็น ✅ Verified:**
>    - ปรับสถานะรายการข้อ 1 ถึง 5 (Spec Completeness, Actions Taken Model, Resolution Gate Rule, Operational Dashboards, RBAC & Security) จาก `⏳ Pending` เป็น `✅ Verified` พร้อมระบุหมายเหตุการผ่านการตรวจสอบและการ Merge เข้าสู่ `lab4-staging` ครบถ้วนแล้วค่ะ
> 
> ผลการทดสอบ Client Vitest ผ่านครบ 15/15 files (81/81 tests) และผลการ Build ทั้ง Frontend (`tsc && vite build`) และ Backend (`tsc`) ผ่านสมบูรณ์ 0 errors ค่ะ รบกวน [@jejaebubu](https://github.com/jejaebubu) ช่วยตรวจสอบอีกครั้งนะคะ ขอบคุณมากค่ะ!


#### 4.8.3 Review #2 — APPROVED (`jejaebubu`, 2026-11-02T09:08:06Z)

**Verdict:** APPROVED (commit `2c5d703`)

**Verbatim Review Comments:**

> ### การตรวจประเมินรอบที่ 2 (Round 2 Review — APPROVED)
> 
> ตรวจสอบ commit `2c5d703` ซ้ำอย่างละเอียดรอบด้านแล้วนะคะ ดำเนินการปรับปรุงแก้ไขเอกสารและบันทึกประวัติการรีวิวได้ครบถ้วนสมบูรณ์ทั้ง 4 จุดอย่างยอดเยี่ยมมากค่ะ:
> 
> 1. **บันทึกประวัติ PR #113 ครบถ้วนสมบูรณ์**: เพิ่มบันทึกการรีวิวของ PR #113 ลงใน Part 2 ของ `docs/lab-04/reviewer.md` พร้อมรายละเอียดผลการตรวจทั้งสองรอบและ Merge commit `5158f3a` ครบถ้วนตามมาตรฐาน
> 2. **ความครอบคลุมของ Regression Matrix**: อัปเดตพาธชุดทดสอบฝั่ง Client (`client/src/test/lab-02/*.test.tsx` และ `client/src/test/lab-03/*.test.tsx`) ใน `docs/lab-04/tests.md` ครบทั้ง Full-stack
> 3. **ตัวเลขสรุปผลการทดสอบแม่นยำ**: ระบุผลการทดสอบทั้ง Server Vitest (19 files / 112 passed) และ Client Vitest (15 files / 81 passed) รวม 34 files / 193 passed (Zero Regression) ไว้อย่างชัดเจน
> 4. **Checklist Section 2 พร้อมส่งมอบ**: ปรับสถานะ Checklist รายการ 1–5 ใน Section 2 เป็น `✅ Verified` เรียบร้อยแล้ว
> 
> ผลการ Build ฝั่ง Client (`tsc && vite build`) และ Server ทำได้เรียบร้อยปราศจากข้อผิดพลาด เอกสารมีความสอดคล้องและมีคุณภาพระดับโปรดักชัน
> 
> ขอ **Approve** และพร้อมให้ Merge เข้าสู่สาขา `lab4-staging` ได้เลยค่ะ


**คำวินิจฉัย:** **APPROVED & MERGED** — Reviewer (@jejaebubu) อนุมัติและเป็นผู้กด Merge PR #82 เข้า `lab4-staging` เรียบร้อย (Merge SHA: `858d2ec0749aa5e2a65d283077bcd875c48a2742`, 2026-11-02T09:08:15Z) — **Closes PR #82**

---

### 4.9 PR #83: test(e2e): Playwright E2E suites, responsive audits, and visual evidence (Issue #35, #71) (`titayaaa/toktickit`)

- **PR URL:** [titayaaa/toktickit#83](https://github.com/titayaaa/toktickit/pull/83)
- **Author:** `@titayaaa` (ฑิตญา ผ่องสกุล)
- **Reviewer:** `@jejaebubu` (GitHub: [jejaebubu](https://github.com/jejaebubu))
- **Source Branch:** `feature/35-e2e-and-visual`
- **Target Branch:** `lab4-staging`
- **Current Status:** Approved & Merged (merge commit `b4dee7ea4a87f48ef2fafa15b53f34a4c01abb67`, 2026-11-03T10:05:47Z)
- **Merged by:** `@jejaebubu`
- **Latest Reviewed Commit:** `25fa6b62f3514b588ed504f272d68a34dd211b34`

#### 4.9.1 Review #1 — CHANGES_REQUESTED (`jejaebubu`, 2026-11-02T09:25:35Z)

**Verdict:** CHANGES_REQUESTED (commit `7267eff`)

**Verbatim Review Comments:**

> ตรวจสอบโค้ดชุดทดสอบ Playwright E2E (`e2e/lab-04/*.spec.ts`), ภาพหลักฐาน Responsive (`artifacts/lab-04/screenshots/`), และเอกสารประกอบของ PR #83 (Issue 35) อย่างละเอียดรอบด้านแล้วนะคะ
> 
> ขอส่งเป็น **Changes Requested** ก่อนนะคะ เนื่องจากพบจุดสำคัญที่ทำให้ชุดทดสอบ Playwright ล้มเหลวทันที (Immediate Test Failure) จากความไม่ตรงกันระหว่าง Selector ในไฟล์ทดสอบกับโค้ด React Component จริงของตัวโปรเจกต์ค่ะ:
> 
> ### 🔴 Blocking Issues: ต้องปรับแก้เพื่อให้ E2E รันผ่านจริง
> 
> 1. **ฟังก์ชัน `login()` ใน E2E ไม่ตรงกับ `Login.tsx`:**
>    - ใน E2E ทุกไฟล์ค้นหา `page.getByTestId("login-email")`, `login-password`, และ `login-submit`
>    - แต่ใน `client/src/components/Login.tsx` ปัจจุบันใช้อินพุต `id="email"`, `id="password"` และปุ่ม submit โดยไม่มี `data-testid` ดังกล่าว ส่งผลให้ชุดทดสอบ Timeout ล้มเหลวตั้งแต่ขั้นตอนแรก
>    - **แนวทางแก้:** เติม `data-testid="login-email"`, `data-testid="login-password"`, `data-testid="login-submit"`, และ `data-testid="login-card"` ลงใน `Login.tsx` หรือปรับฟังก์ชัน helper `login()` ใน E2E ให้ค้นหาผ่าน `#email`, `#password` และ `button[type="submit"]`
> 
> 2. **Header Navigation และการสลับหน้าจอใน `App.tsx`:**
>    - ฟังก์ชัน `navigateHeader()` ใน E2E ค้นหา `header-nav-*`, `header-nav-toggle`, `header-user-menu`, และ `header-logout` ซึ่งไม่มีอยู่ใน `App.tsx`
>    - **แนวทางแก้:** เพิ่ม `data-testid` ที่เกี่ยวข้องลงใน Navigation Tabs และปุ่ม Logout ของ `App.tsx` เพื่อให้ชุดทดสอบคลิกสลับหน้าจอและสลับผู้ใช้งานระหว่าง Requester และ IT Staff ได้จริง
> 
> 3. **ฟิลด์บังคับและปุ่ม Submit ใน `CreateTicketForm.tsx`:**
>    - ใน `CreateTicketForm.tsx` ปุ่มส่งตั๋วยังไม่มี `data-testid="submit-ticket-btn"` และฟอร์มมีการตรวจสอบว่าต้องเลือก `categoryId` และ `relatedSystemId` ด้วย
>    - ใน `actions-taken-flow.spec.ts` และ `ticket-resolution.spec.ts` ตอนนี้กรอกเพียง Summary, Description และ Priority ทำให้ติด Validation Error
>    - **แนวทางแก้:** เพิ่ม `data-testid="submit-ticket-btn"` และ `data-testid="success-alert"` ใน `CreateTicketForm.tsx` พร้อมปรับใน E2E ให้เลือก Category และ Related System ให้ครบถ้วนก่อนกด Submit
> 
> 4. **Selector ไม่ตรงกับโค้ดจริงใน `TicketDetail.tsx` และ `StaffTicketQueue.tsx`:**
>    - ใน `ticket-resolution.spec.ts` และ `actions-taken-flow.spec.ts` มีการเรียกหา `detail-status`, `back-to-my-tickets`, `queue-search`, `queue-search-btn`, `resolution-gate-modal` ซึ่งไม่ตรงกับ `TicketDetail.tsx` (ที่ใช้ `ticket-status-badge`, `ticket-detail-back-button`, `modal-resolution-gate-warning`)
>    - **แนวทางแก้:** ปรับจูน selector ในไฟล์ spec ให้ตรงกับ testid จริงในคอมโพเนนต์ หรือเติม testid ในคอมโพเนนต์ให้ครอบคลุม Flow การทำงาน
> 
> 5. **Metric Card Selector ใน `RequesterDashboard.tsx`:**
>    - ใน `dashboards.spec.ts` ค้นหาการ์ด `my-open`, `closed` และพาเนล `requester-recent-tickets-table`
>    - ในขณะที่คอมโพเนนต์จริงใช้ `requester-metric-card-open`, `requester-metric-card-waiting`, `requester-metric-card-recent`, `requester-metric-card-resolved` และ `requester-recent-table`
>    - **แนวทางแก้:** ปรับลูปใน `dashboards.spec.ts` ให้ตรงกับชื่อการ์ดและตารางจริงใน `RequesterDashboard.tsx`
> 
> รบกวนช่วยปรับจูนตัวเลือกและคอมโพเนนต์ให้สอดคล้องกัน แล้วอัปเดต commit เข้ามาอีกครั้งนะคะ พร้อมตรวจซ้ำและ Approve ให้ในรอบถัดไปทันทีค่ะ ขอบคุณมากค่ะ


#### 4.9.2 Author Response #1 (`titayaaa`, 2026-11-03T07:37:45Z)

> > ตรวจสอบโค้ดชุดทดสอบ Playwright E2E (`e2e/lab-04/*.spec.ts`), ภาพหลักฐาน Responsive (`artifacts/lab-04/screenshots/`), และเอกสารประกอบของ PR #83 (Issue 35) อย่างละเอียดรอบด้านแล้วนะคะ
> > 
> > ขอส่งเป็น **Changes Requested** ก่อนนะคะ เนื่องจากพบจุดสำคัญที่ทำให้ชุดทดสอบ Playwright ล้มเหลวทันที (Immediate Test Failure) จากความไม่ตรงกันระหว่าง Selector ในไฟล์ทดสอบกับโค้ด React Component จริงของตัวโปรเจกต์ค่ะ:
> > 
> > ### 🔴 Blocking Issues: ต้องปรับแก้เพื่อให้ E2E รันผ่านจริง
> > 1. **ฟังก์ชัน `login()` ใน E2E ไม่ตรงกับ `Login.tsx`:**
> >    
> >    * ใน E2E ทุกไฟล์ค้นหา `page.getByTestId("login-email")`, `login-password`, และ `login-submit`
> >    * แต่ใน `client/src/components/Login.tsx` ปัจจุบันใช้อินพุต `id="email"`, `id="password"` และปุ่ม submit โดยไม่มี `data-testid` ดังกล่าว ส่งผลให้ชุดทดสอบ Timeout ล้มเหลวตั้งแต่ขั้นตอนแรก
> >    * **แนวทางแก้:** เติม `data-testid="login-email"`, `data-testid="login-password"`, `data-testid="login-submit"`, และ `data-testid="login-card"` ลงใน `Login.tsx` หรือปรับฟังก์ชัน helper `login()` ใน E2E ให้ค้นหาผ่าน `#email`, `#password` และ `button[type="submit"]`
> > 2. **Header Navigation และการสลับหน้าจอใน `App.tsx`:**
> >    
> >    * ฟังก์ชัน `navigateHeader()` ใน E2E ค้นหา `header-nav-*`, `header-nav-toggle`, `header-user-menu`, และ `header-logout` ซึ่งไม่มีอยู่ใน `App.tsx`
> >    * **แนวทางแก้:** เพิ่ม `data-testid` ที่เกี่ยวข้องลงใน Navigation Tabs และปุ่ม Logout ของ `App.tsx` เพื่อให้ชุดทดสอบคลิกสลับหน้าจอและสลับผู้ใช้งานระหว่าง Requester และ IT Staff ได้จริง
> > 3. **ฟิลด์บังคับและปุ่ม Submit ใน `CreateTicketForm.tsx`:**
> >    
> >    * ใน `CreateTicketForm.tsx` ปุ่มส่งตั๋วยังไม่มี `data-testid="submit-ticket-btn"` และฟอร์มมีการตรวจสอบว่าต้องเลือก `categoryId` และ `relatedSystemId` ด้วย
> >    * ใน `actions-taken-flow.spec.ts` และ `ticket-resolution.spec.ts` ตอนนี้กรอกเพียง Summary, Description และ Priority ทำให้ติด Validation Error
> >    * **แนวทางแก้:** เพิ่ม `data-testid="submit-ticket-btn"` และ `data-testid="success-alert"` ใน `CreateTicketForm.tsx` พร้อมปรับใน E2E ให้เลือก Category และ Related System ให้ครบถ้วนก่อนกด Submit
> > 4. **Selector ไม่ตรงกับโค้ดจริงใน `TicketDetail.tsx` และ `StaffTicketQueue.tsx`:**
> >    
> >    * ใน `ticket-resolution.spec.ts` และ `actions-taken-flow.spec.ts` มีการเรียกหา `detail-status`, `back-to-my-tickets`, `queue-search`, `queue-search-btn`, `resolution-gate-modal` ซึ่งไม่ตรงกับ `TicketDetail.tsx` (ที่ใช้ `ticket-status-badge`, `ticket-detail-back-button`, `modal-resolution-gate-warning`)
> >    * **แนวทางแก้:** ปรับจูน selector ในไฟล์ spec ให้ตรงกับ testid จริงในคอมโพเนนต์ หรือเติม testid ในคอมโพเนนต์ให้ครอบคลุม Flow การทำงาน
> > 5. **Metric Card Selector ใน `RequesterDashboard.tsx`:**
> >    
> >    * ใน `dashboards.spec.ts` ค้นหาการ์ด `my-open`, `closed` และพาเนล `requester-recent-tickets-table`
> >    * ในขณะที่คอมโพเนนต์จริงใช้ `requester-metric-card-open`, `requester-metric-card-waiting`, `requester-metric-card-recent`, `requester-metric-card-resolved` และ `requester-recent-table`
> >    * **แนวทางแก้:** ปรับลูปใน `dashboards.spec.ts` ให้ตรงกับชื่อการ์ดและตารางจริงใน `RequesterDashboard.tsx`
> > 
> > รบกวนช่วยปรับจูนตัวเลือกและคอมโพเนนต์ให้สอดคล้องกัน แล้วอัปเดต commit เข้ามาอีกครั้งนะคะ พร้อมตรวจซ้ำและ Approve ให้ในรอบถัดไปทันทีค่ะ ขอบคุณมากค่ะ
> 
> ขอบคุณสำหรับคำแนะนำและการตรวจสอบอย่างละเอียดรอบด้านมากๆ ค่ะคุณเจเจ้ (@jejaebubu)! 
> 
> ได้ดำเนินการปรับปรุงแก้ไขโค้ด ชุดทดสอบ Playwright E2E และบันทึกประวัติการรีวิวลงในเอกสารครบทั้ง 5 จุดเรียบร้อยแล้วใน Commit `7af52d9` และ `25fa6b6`:
> 
> 1. **Harmonize `login()` & `Login.tsx`**:
>    - เพิ่ม `data-testid="login-card"`, `login-email`, `login-password`, และ `login-submit` ใน `Login.tsx`
>    - ปรับฟังก์ชัน `login()` ใน E2E spec ให้รองรับ Fallback Selectors (`[data-testid="login-email"], #email`, `button[type="submit"]`) เพื่อความเสถียรในการรัน
> 2. **Harmonize Header Navigation & `navigateHeader()`**:
>    - เพิ่ม `data-testid="header-user-menu"`, `header-logout`, `header-nav-dashboard`, `header-nav-admin-users`, `header-nav-staff-queue`, `header-nav-create-ticket`, `header-nav-my-tickets` ใน `App.tsx`
>    - ปรับ `navigateHeader()` ให้ตรวจจับและคลิกแท็บที่แสดงผลอยู่บนหน้าจอได้ทันที รองรับทั้ง Desktop Navbar และ Mobile Navigation Toggle
> 3. **`CreateTicketForm.tsx` & Category/Related System Selection**:
>    - เพิ่ม `data-testid="submit-ticket-btn"` และ `data-testid="success-alert"` ใน `CreateTicketForm.tsx`
>    - ใน `actions-taken-flow.spec.ts` และ `ticket-resolution.spec.ts` เพิ่มคำสั่งเลือกลำดับ Category และ Related System จาก Select Options ก่อนกดสร้างตั๋ว ป้องกันฟอร์มติดสถานะ Validation Blocked
> 4. **Harmonize Ticket Details & Queue Selectors**:
>    - จัดระเบียบ `data-testid` ใน `TicketDetail.tsx`, `StaffTicketQueue.tsx`, และ `ActionsTaken.tsx` ให้ตรงกับมาตรฐาน React Testing Library
>    - อัปเดต E2E Locators ให้รองรับทั้งคลาสและการเลือกสองทาง (Dual Locators) เพื่อให้เชื่อมโยงกับ Flow การทำงานได้อย่างสมบูรณ์
> 5. **Metric Cards ใน `RequesterDashboard.tsx` & `dashboards.spec.ts`**:
>    - ปรับ Loop ใน `dashboards.spec.ts` ให้ค้นหา `open`, `waiting`, `recent`, `resolved` และตาราง `requester-recent-table` ตรงกับ Component เป๊ะๆ
> 6. **บันทึกประวัติการรีวิวใน `docs/lab-04/reviewer.md`**:
>    - บันทึกข้อเสนอแนะรอบที่ 1 และคำชี้แจง Author Response ลงในตารางประวัติการรีวิวเรียบร้อยแล้ว
> 
> **ผลการทดสอบการทำงานย้อนหลัง (Regression & Build Verification):**
> - Client Vitest Suite: ผ่านครบ **81/81 tests** (15 test files)
> - Client Production Build (`tsc && vite build`): ผ่านสมบูรณ์ (Code 0)
> - Server Build (`tsc`): ผ่านสมบูรณ์ (Code 0)
> 
> รบกวนคุณเจเจ้ตรวจสอบอีกครั้งนะคะ หากเรียบร้อยแล้วสามารถกด Approve และ Merge เข้าสู่ `lab4-staging` ได้เลยค่ะ ขอบคุณมากๆ เลยค่ะ!


#### 4.9.3 Review #2 — APPROVED (`jejaebubu`, 2026-11-03T10:05:30Z)

**Verdict:** APPROVED (commit `25fa6b6`)

**Verbatim Review Comments:**

> ### ✅ การตรวจประเมินรอบที่ 2 (Round 2 Review — APPROVED)
>  
>  ตรวจสอบ Commit `7af52d9` และ `25fa6b6` อย่างละเอียดรอบด้านแล้วนะคะ ดำเนินการปรับปรุงแก้ไขทั้งตัวคอมโพเนนต์และชุดทดสอบ Playwright E2E ได้อย่างยอดเยี่ยม รวดเร็ว และประณีตมากค่ะ:
>  
>  1. **Authentication & Navigation Resiliency**: เพิ่ม `data-testid` ครบถ้วนใน `Login.tsx` และ `App.tsx` พร้อมปรับฟังก์ชัน helper (`login()`, `navigateHeader()`) ให้ใช้ Dual Locators รองรับทั้ง Desktop และ Mobile Viewports ได้อย่างสมบูรณ์แบบ
>  2. **Form Interaction & Validation Harmonization**: เพิ่มการเลือก Category และ Related System ใน `CreateTicketForm.tsx` ทำให้ขั้นตอนการสร้างตั๋วใน E2E ทำงานได้จริงและไม่ติด Validation Error
>  3. **Complete Workflow Verification**: เชื่อมโยงตัวเลือกใน `TicketDetail.tsx` และ `StaffTicketQueue.tsx` ครอบคลุมทั้ง Advisory Flag ของ Requester, การบล็อก 409 Conflict ของ Resolution Gate และการ Resolve ตั๋วสำเร็จหลังเคลียร์ Action ครบ
>  4. **Dashboard Metric Alignment**: ปรับจูน Selector ใน `RequesterDashboard.tsx` และ `dashboards.spec.ts` ให้ตรงกัน 100%
>  5. **Audit Trail & Documentation**: บันทึกประวัติการรีวิวรอบที่ 1 และ Author Response ลงใน `docs/lab-04/reviewer.md` ครบถ้วนตามมาตรฐานวิศวกรรมซอฟต์แวร์
>  
>  ผลการ Build (`tsc && vite build`) และ Client Vitest (15 files / 81 passed) ผ่านสมบูรณ์ 0 errors
>  
>  ขอ **Approve** และพร้อมให้ดำเนินการ Merge เข้าสู่สาขา `lab4-staging` ได้เลยค่ะ


**คำวินิจฉัย:** **APPROVED & MERGED** — Reviewer (@jejaebubu) อนุมัติและเป็นผู้กด Merge PR #83 เข้า `lab4-staging` เรียบร้อย (Merge SHA: `b4dee7ea4a87f48ef2fafa15b53f34a4c01abb67`, 2026-11-03T10:05:47Z) — **Closes PR #83**

---

### 4.10 PR #84: PR-10: Sprint 4 Documentation and Release Integration to Main (Issue #36, #72) (`titayaaa/toktickit`)

- **PR URL:** [titayaaa/toktickit#84](https://github.com/titayaaa/toktickit/pull/84)
- **Author:** `@titayaaa` (ฑิตญา ผ่องสกุล)
- **Reviewer:** `@jejaebubu` (GitHub: [jejaebubu](https://github.com/jejaebubu))
- **Source Branch:** `release/lab04-staging-to-main`
- **Target Branch:** `main`
- **Current Status:** Approved & Merged (merge commit `06a40356e0f653f3c67f5b5126d885907bbc0e92`, 2026-11-03T19:57:48Z)
- **Merged by:** `@jejaebubu`
- **Latest Reviewed Commit:** `b21bff913b7f8fbc545b0077d81326687bdb9379`

#### 4.10.1 Review #1 — APPROVED (`jejaebubu`, 2026-11-03T17:45:38Z)

**Verdict:** APPROVED (commit `02d67a4`)

**Verbatim Review Comments:**

> ## 🟢 Peer Review: Approved (PR #84 - Sprint 4 Release Integration to Main)
>  
>  **Reviewer:** `@jejaebubu`  
>  **Target Branch:** `main`  
>  **Status:** ✅ **Approved (พร้อมให้ Merge เข้าสู่ `main` ได้เลยค่ะ)**
>  
>  ---
>  
>  ### 🌟 ภาพรวมการประเมิน (Executive Summary)
>  ตรวจสอบการผสานรวมโค้ด (Release Integration) จากสาขา `release/lab04-staging-to-main` เข้าสู่ `main` ครบถ้วนทุกไฟล์แล้วนะคะ ชื่นชมการควบคุมคุณภาพและการรวบรวมฟีเจอร์ของ Sprint 4 ทั้ง 9 หัวข้อย่อย (PR #75 ถึง PR #83) เข้าด้วยกันได้อย่างไร้รอยต่อ ปราศจาก Conflict และผ่านการตรวจสอบ Regression ครบ 100% สมบูรณ์แบบตามมาตรฐานวิศวกรรมซอฟต์แวร์ค่ะ
>  
>  ---
>  
>  ### 🔍 รายละเอียดการตรวจสอบความพร้อมของ Release (Release Audit Checklist)
>  
>  1. **Feature Completeness & Integrity:**
>     - รวมฟังก์ชัน Actions Taken (Prisma Schema, Migration, APIs, UI), Ticket State Transition Matrix, Resolution Gate (HTTP 409 Conflict), IT Staff Dashboard, Requester Dashboard, ตลอดจนระบบ System Hardening ไว้อย่างครบถ้วนสมบูรณ์
>  2. **Full Regression & Quality Gate:**
>     - ชุดทดสอบ Backend API (Supertest): ผ่านครบ **19 files / 112 passed (100%)**
>     - ชุดทดสอบ Frontend Unit/Component (Vitest): ผ่านครบ **15 files / 81 passed (100%)**
>     - Playwright End-to-End Suites (3 suites บน Desktop, Tablet, Mobile): ผ่านครบทุก Viewport
>     - Production Builds: ทั้งฝั่ง Client (`tsc && vite build`) และ Server (`tsc`) ผ่านสมบูรณ์ 0 errors
>  3. **Documentation & Release Artifacts:**
>     - `README.md`: อัปเดตผังโฟลเดอร์, ฟีเจอร์ภาพรวมของ Lab 4, จำนวนชุดทดสอบ และคำสั่งรัน E2E ไว้อย่างถูกต้อง ละเอียด ชัดเจน
>     - `docs/lab-04/ai-use.md`: บันทึก Prompt 16 และ Reflection 3.10 เกี่ยวกับการทำ Release Governance ครบถ้วน
>     - `docs/lab-04/reviewer.md`: บันทึกประวัติการรีวิวครบทั้ง Part 1 (PR #75–#84) และ Part 2 (PR #104–#115) อย่างโปร่งใสและตรวจสอบย้อนกลับได้จริง
>     - ภาพหลักฐานหน้าจอ 24 ภาพบน Responsive Viewports จัดเก็บใน `artifacts/lab-04/screenshots/` ครบถ้วนตามมาตรฐาน WCAG 2.1 AA
>  
>  คุณภาพงานยอดเยี่ยมมากค่ะ ขอ **Approve** และยินดีด้วยกับการปิด Sprint 4 (Lab 4) อย่างสมบูรณ์แบบนะคะ! พร้อมให้ Merge เข้าสู่ `main` ได้ทันทีค่ะ


#### 4.10.2 Review #2 — CHANGES_REQUESTED (`jejaebubu`, 2026-11-03T17:50:19Z)

**Verdict:** CHANGES_REQUESTED (commit `02d67a4`)

**Verbatim Review Comments:**

> ตรวจสอบโค้ดผสานรวม (Integration Diffs), ชุดทดสอบ Full Regression, ผลการ Build และเอกสารกำกับรุ่นทั้งหมดของ PR #84 (Issue 36 / PR-10) อย่างละเอียดรอบด้านแล้วนะคะ
> 
> ภาพรวมการรวมโค้ดทั้ง 9 ฟีเจอร์ย่อย (PR #75–#83) เข้าสู่สาขา `main` ทำได้เรียบร้อย ไร้ข้อผิดพลาด และผลการ Build/Test ผ่าน 100% ค่ะ แต่ขอส่งเป็น **Changes Requested** ในรอบแรกก่อน เพื่อให้ปรับปรุงความถูกต้องของเอกสาร 3 จุดก่อนกด Final Approve & Merge นะคะ:
> 
> ### 🔴 จุดที่ต้องปรับแก้ก่อนอนุมัติ (Required Changes)
> 
>  1. **บันทึกประวัติการรีวิว PR #115 ใน Part 2 ของ `docs/lab-04/reviewer.md` ให้สมบูรณ์:**
>     - ใน Part 2 ใต้หัวข้อ `### PR #115: PR-11: Sprint 4 Documentation and Release Integration to Main (Issue #11)` ปัจจุบันมีเพียง Scope และสถานะยังค้างอยู่ที่ `⏳ Pending Review`
>     - รบกวนเพิ่มบันทึก Review Trail (Round 1 Review, Author Response, Round 2 Review และ Merge Event) ของ PR #115 ลงใน Part 2 ให้ครบถ้วนสมบูรณ์เหมือนกับทุก PR ก่อนหน้าค่ะ
>  
>  2. **แก้ไขข้อความบรรยาย Dashboard Metric Cards ใน `README.md` ให้ตรงกับระบบจริง:**
>     - **IT Staff Dashboard (บรรทัด 156):** มีการระบุ `Breached/At Risk SLA` ซึ่งใน `specification.md` (Section 3.2 ข้อ 1) ระบุชัดเจนว่า SLA Engine เป็น Explicit Exclusion (Out of Scope) และในระบบจริงคือการ์ด `Urgent Tickets` แนะนำปรับเป็น:
>       *(Unassigned Tickets, My Assigned Tickets, Urgent Tickets, และ My Pending Actions)*
>     - **Requester Dashboard (บรรทัด 158):** มีการระบุ `Awaiting Staff Action` ซึ่งในระบบจริง (`RequesterDashboard.tsx`) และตาม FR-13 คือการ์ด `Waiting for Your Input` (`WAITING_FOR_REQUESTER`)
>  
>  ### 🟠 ข้อเสนอแนะเพิ่มเติมเพื่อความสมบูรณ์แบบ (Improvement Suggestions)
>  
>  3. **เพิ่มแถวบันทึกผล Release Verification ใน `docs/lab-04/tests.md`:**
>     - ในตาราง Section 2 ของ `tests.md` ปัจจุบันมีถึงแค่แถว `REG-02` แนะนำให้เพิ่มแถวสำหรับ Release Verification (เช่น `REL-01: Full-stack Regression & Production Build on main branch` ระบุผล 112 server + 81 client tests, Playwright 3 viewports, Zero build error) เพื่อให้ Traceability Matrix ปิดสมบูรณ์ 100% ค่ะ
>  
>  ฝากช่วยปรับแก้ 3 จุดนี้ แล้วอัปเดต commit เข้ามาอีกครั้งนะคะ พร้อมเข้ามาตรวจซ้ำและ Approve & Merge เข้าสู่ `main` ให้ทันทีค่ะ ขอบคุณมากค่ะ


#### 4.10.3 Author Response #1 (`titayaaa`, 2026-11-03T19:44:49Z)

> > ตรวจสอบโค้ดผสานรวม (Integration Diffs), ชุดทดสอบ Full Regression, ผลการ Build และเอกสารกำกับรุ่นทั้งหมดของ PR #84 (Issue 36 / PR-10) อย่างละเอียดรอบด้านแล้วนะคะ
> > 
> > ภาพรวมการรวมโค้ดทั้ง 9 ฟีเจอร์ย่อย (PR #75–#83) เข้าสู่สาขา `main` ทำได้เรียบร้อย ไร้ข้อผิดพลาด และผลการ Build/Test ผ่าน 100% ค่ะ แต่ขอส่งเป็น **Changes Requested** ในรอบแรกก่อน เพื่อให้ปรับปรุงความถูกต้องของเอกสาร 3 จุดก่อนกด Final Approve & Merge นะคะ:
> > 
> > ### 🔴 จุดที่ต้องปรับแก้ก่อนอนุมัติ (Required Changes)
> > 1. **บันทึกประวัติการรีวิว PR #115 ใน Part 2 ของ `docs/lab-04/reviewer.md` ให้สมบูรณ์:**
> >    
> >    * ใน Part 2 ใต้หัวข้อ `### PR #115: PR-11: Sprint 4 Documentation and Release Integration to Main (Issue #11)` ปัจจุบันมีเพียง Scope และสถานะยังค้างอยู่ที่ `⏳ Pending Review`
> >    * รบกวนเพิ่มบันทึก Review Trail (Round 1 Review, Author Response, Round 2 Review และ Merge Event) ของ PR #115 ลงใน Part 2 ให้ครบถ้วนสมบูรณ์เหมือนกับทุก PR ก่อนหน้าค่ะ
> > 2. **แก้ไขข้อความบรรยาย Dashboard Metric Cards ใน `README.md` ให้ตรงกับระบบจริง:**
> >    
> >    * **IT Staff Dashboard (บรรทัด 156):** มีการระบุ `Breached/At Risk SLA` ซึ่งใน `specification.md` (Section 3.2 ข้อ 1) ระบุชัดเจนว่า SLA Engine เป็น Explicit Exclusion (Out of Scope) และในระบบจริงคือการ์ด `Urgent Tickets` แนะนำปรับเป็น:
> >      _(Unassigned Tickets, My Assigned Tickets, Urgent Tickets, และ My Pending Actions)_
> >    * **Requester Dashboard (บรรทัด 158):** มีการระบุ `Awaiting Staff Action` ซึ่งในระบบจริง (`RequesterDashboard.tsx`) และตาม FR-13 คือการ์ด `Waiting for Your Input` (`WAITING_FOR_REQUESTER`)
> > 
> > ### 🟠 ข้อเสนอแนะเพิ่มเติมเพื่อความสมบูรณ์แบบ (Improvement Suggestions)
> > 3. **เพิ่มแถวบันทึกผล Release Verification ใน `docs/lab-04/tests.md`:**
> >    
> >    * ในตาราง Section 2 ของ `tests.md` ปัจจุบันมีถึงแค่แถว `REG-02` แนะนำให้เพิ่มแถวสำหรับ Release Verification (เช่น `REL-01: Full-stack Regression & Production Build on main branch` ระบุผล 112 server + 81 client tests, Playwright 3 viewports, Zero build error) เพื่อให้ Traceability Matrix ปิดสมบูรณ์ 100% ค่ะ
> > 
> > ฝากช่วยปรับแก้ 3 จุดนี้ แล้วอัปเดต commit เข้ามาอีกครั้งนะคะ พร้อมเข้ามาตรวจซ้ำและ Approve & Merge เข้าสู่ `main` ให้ทันทีค่ะ ขอบคุณมากค่ะ
> 
> ขอบคุณ @jejaebubu สำหรับการตรวจทาน Release PR #84 อย่างละเอียดรอบคอบมากค่ะ ดำเนินการปรับปรุงและแก้ไขครบถ้วนทั้ง 3 จุดเรียบร้อยแล้วใน commit `b21bff9` ค่ะ:
> 
> 1. **บันทึกประวัติการรีวิว PR #115 ใน Part 2 (`docs/lab-04/reviewer.md`)**:
>    - บันทึก Review Trail ของ PR #115 ใน Part 2 ครบถ้วนทั้ง Round 1 Review (`CHANGES_REQUESTED`), Author Response (`fc4b7b6`), และขั้นตอน Round 2 Verification แบบ Verbatim สมบูรณ์ 100% เหมือนกับทุก PR ก่อนหน้าเรียบร้อยค่ะ
> 2. **แก้ไขข้อความบรรยาย Dashboard Metric Cards ใน `README.md`**:
>    - **IT Staff Dashboard:** ปรับข้อความเป็นการ์ดที่ใช้งานจริงในระบบ: *(Unassigned Tickets, My Assigned Tickets, Urgent Tickets, and My Pending Actions)* โดยตัดคำว่า Breached/At Risk SLA ออกตรงตามข้อกำหนด Out-of-Scope ของ SLA Engine
>    - **Requester Dashboard:** ปรับข้อความเป็นการ์ดตามระบบจริงและ FR-13: *(Total Open, Waiting for Your Input, Recently Updated, Resolved)* โดยเปลี่ยนจาก Awaiting Staff Action เป็น Waiting for Your Input (`WAITING_FOR_REQUESTER`)
> 3. **เพิ่มแถวบันทึกผล Release Verification ใน `docs/lab-04/tests.md`**:
>    - เพิ่มแถว `REL-01` ในตาราง Section 2: `REL-01: Full-stack Regression & Production Build verification on main branch` พร้อมระบุผลการรัน 112 server + 81 client tests, Playwright E2E suites บน 3 viewports, และ build bundle ผ่าน 0 errors (สถานะ Pass) ปิด Traceability Matrix ครบถ้วน 100%
> 
> ดำเนินการพุชอัปเดตขึ้นสาขา `release/lab04-staging-to-main` เรียบร้อยแล้วค่ะ รบกวนช่วยตรวจทานซ้ำอีกครั้งและกด **Approve & Merge** เข้าสู่ `main` ได้เลยนะคะ ขอบคุณมากค่ะ!


#### 4.10.4 Review #3 — APPROVED (`jejaebubu`, 2026-11-03T19:53:54Z)

**Verdict:** APPROVED (commit `b21bff9`)

**Verbatim Review Comments:**

> ### ✅ การตรวจประเมินรอบที่ 2 (Round 2 Review — APPROVED)
>  
>  ตรวจสอบ Commit `b21bff9` ซ้ำอย่างละเอียดรอบด้านแล้วนะคะ ดำเนินการปรับปรุงแก้ไขทั้ง 3 จุดได้อย่างยอดเยี่ยม รวดเร็ว และประณีตมากค่ะ:
>  
>  1. **Complete Peer Review Audit Trail**: บันทึกบทสนทนาการรีวิวของ PR #115 ใน Part 2 ของ `docs/lab-04/reviewer.md` ครบถ้วนทั้ง Round 1, Author Response (`fc4b7b6`) และ Round 2 Workflow แบบ Verbatim สมบูรณ์ 100%
>  2. **Accurate Dashboard Specifications**: แก้ไขข้อความบรรยายการ์ดตัวชี้วัดใน `README.md` ทั้งฝั่ง IT Staff และ Requester ให้ตรงกับข้อกำหนดใน `specification.md` และคอมโพเนนต์จริงในระบบ
>  3. **Closed Test Traceability Matrix**: เพิ่มแถว `REL-01` ในตาราง `docs/lab-04/tests.md` ยืนยันผลการทดสอบ Full Regression (Server 112, Client 81, Playwright 3 Viewports) และผลการ Build สำเร็จ 0 errors
>  
>  โค้ดและเอกสารมีความสมบูรณ์แบบระดับ Production-ready พร้อมสำหรับการส่งมอบงาน
>  
>  ขอ **Approve** และยินดีด้วยกับการปิด Sprint 4 (Lab 4) อย่างเป็นทางการค่ะ! พร้อมให้ดำเนินการ Merge สาขา `release/lab04-staging-to-main` เข้าสู่ `main` ได้ทันทีค่ะ


**คำวินิจฉัย:** **APPROVED & MERGED** — Reviewer (@jejaebubu) อนุมัติและเป็นผู้กด Merge PR #84 เข้า `main` เรียบร้อย (Merge SHA: `06a40356e0f653f3c67f5b5126d885907bbc0e92`, 2026-11-03T19:57:48Z) — **Closes PR #84**

---

## 5. Full Review Trail — Additional Partner Reviews (`Achikan/TokTickIT`)

### 5.1 PR #86: Issue 34: IT Staff Dashboard (API + UI) (`Achikan/TokTickIT`)

- **PR URL:** [Achikan/TokTickIT#86](https://github.com/Achikan/TokTickIT/pull/86)
- **Author:** `@Achikan` (Achikan)
- **Reviewer:** `@jejaebubu` (GitHub: [jejaebubu](https://github.com/jejaebubu))
- **Source Branch:** `feature/34-staff-dashboard`
- **Target Branch:** `lab4-staging`
- **Current Status:** Approved & Merged (merge commit `773140529e59b2843361db28141957b56019226f`, 2026-11-01 10:22 UTC)
- **Merged by:** `@jejaebubu`
- **Latest Reviewed Commit:** `621db34052cb10f21d82977b52331246ead04472`

#### 5.1.1 Review #1 — Changes Requested (`jejaebubu`, 2026-10-31 23:36 UTC+7)

**Review ID:** `5723788673`  
**Commit Reviewed:** `4e1c30122d1e4e023f16085d48d6c89e05719a01`  
**Verdict:** Changes Requested

**Verbatim Review Comments:**

> Dashboard ฝั่ง server มาถูกทางแล้วนะคะ แต่ที่ head `4e1c301` ตอนนี้ยังมีจุดที่ต้องแก้ก่อน merge อยู่หลายจุด หลัก ๆ คือ server ยังรันไม่ได้, route เดิมของ Lab 2 หายไป แล้วก็ client กับ test ยังใช้ข้อมูลคนละแบบกับ contract ใหม่ค่ะ
>
> ### สิ่งที่ทำได้ดีแล้ว
> - แยก `server/src/staffDashboard.ts` ออกมาชัดเจน และใช้ middleware เดิมของระบบแล้ว
> - เปลี่ยนมาใช้ `count / groupBy / findMany` และ `take: 5` แล้ว
> - Payload ใหม่ใกล้กับ `api-spec.md §3.1` มากขึ้น
> - UI มี loading / forbidden / empty state แล้ว
> - รองรับ `ownerId=me` ตาม spec แล้วค่ะ
>
> ### จุดที่ต้องแก้ก่อน (Blocking)
>
> **1. `staffQueue.ts` ตอนนี้ทำให้ server รันไม่ได้**
>
> มีหลายจุดที่ยังไม่ตรงกับโค้ดจริงค่ะ เช่น
> - import `isStaffOrAdminRole` จาก `./roles.js` แต่ไม่มีไฟล์นี้ใน repo
> - import `invalidQuery` กับ `parseIntParam` แต่ `middleware.ts` ไม่ได้ export สองตัวนี้
> - ใช้ `require("express")` ทั้งที่ project ใช้ `"type": "module"`
> - sort ใช้ `"status"` แต่ field ใน Prisma จริงคือ `currentStatus`
> - `/api/staff/assignees` ของเดิมหายไป ทำให้ test ของ Lab 3 มีโอกาสพัง
> - validation บางส่วนถูก comment ออก ทำให้ query ที่ผิดอาจได้ `200` แทน `400`
>
> ตรงนี้กระทบทั้ง server เลยค่ะ เพราะ `app` จะ import ไม่ผ่าน ทำให้ test ทั้งชุดรันไม่ได้ ไม่ใช่แค่ Dashboard
>
> แนะนำให้เอาไฟล์เดิมจาก `lab4-staging` กลับมาก่อน แล้วค่อยเพิ่มเฉพาะ `ownerId === "me"` ค่ะ
>
> `git checkout lab4-staging -- server/src/staffQueue.ts`
>
> ---
>
> **2. Route เดิมของ Lab 2 หายไปจาก `app.ts`**
>
> ตอนนี้ `server/src/app.ts` เหลือประมาณ 98 บรรทัด ทำให้ route เดิมหลายตัวหายไป เช่น
> - categories / related systems
> - สร้างและดู ticket
> - ดู ticket detail
> - upload / list / download / delete attachment
>
> และตอนนี้ยังไม่มี module ใหม่มารับ route พวกนี้แทนค่ะ ทำให้ Requester สร้างหรือดู ticket รวมถึงแนบไฟล์ไม่ได้ ซึ่งจะกระทบของเดิมจาก Lab 2
>
> แนะนำให้ restore `app.ts` จาก `lab4-staging` ก่อน
>
> `git checkout lab4-staging -- server/src/app.ts`
>
> แล้วค่อยเพิ่มเฉพาะ route ของ Dashboard กลับเข้าไปค่ะ
>
> ---
>
> **3. Client ยังใช้ contract เก่าอยู่**
>
> ตอนนี้ Client ยังใช้ชื่อแบบเดิม เช่น
> `metrics.unassigned`, `metrics.ownedByMe`, `metrics.byItPriority`, `lists.recentlyUpdated`, `lists.urgentHigh` และ `administrator.userCounts`
>
> แต่ Server ใหม่ส่งเป็น
> `unassignedCount`, `ownedByMeCount`, `byPriority`, `recentlyUpdated.items`, `urgentHigh.items` และ `userCounts`
>
> ทำให้ตอนนี้บางค่าจะเป็น `undefined` และ Dashboard มีโอกาส crash ตอน render ค่ะ
>
> ถ้าจะใช้ contract ใหม่ตาม spec แนะนำให้แก้ประมาณนี้
>
> `metrics.unassigned` → `metrics.unassignedCount`  
> `metrics.ownedByMe` → `metrics.ownedByMeCount`  
> `metrics.byItPriority` → `metrics.byPriority`  
> `lists.recentlyUpdated` → `recentlyUpdated.items`  
> `lists.urgentHigh` → `urgentHigh.items`  
> `administrator.userCounts` → `userCounts`
>
> ส่วนข้อมูล owner ตอนนี้ Client คาด `ownerId` แต่ Server ส่ง `owner: { id, name } | null` ตรงนี้ก็ควรเลือกให้ตรงกันค่ะ
>
> ---
>
> **4. Metrics บางตัวยังไม่ตรงกับ `api-spec.md §3.1`**
>
> `byStatus` ตาม spec ต้องนับ ticket ทุกสถานะและมีครบทั้ง 8 statuses แต่ตอนนี้ Server กรองเฉพาะ active status ทำให้ `RESOLVED`, `CLOSED`, `CANCELLED` ไม่ถูกนับและบาง key หายไปค่ะ
>
> `urgentHigh` ตาม spec ต้องมีทั้ง `URGENT` และ `HIGH` โดยเรียง URGENT ก่อน และไม่เกิน 5 รายการ แต่ตอนนี้เอาเฉพาะ URGENT อย่างเดียวค่ะ
>
> ส่วน `drilldown` ตาม spec ต้องมี mapping สำหรับ 5 แบบ คือ unassigned, ownedByMe, byStatus, byPriority และ recentlyUpdated แต่ตอนนี้ Server ส่ง `queueBase / ticketDetailBase` ซึ่งยังเป็นคนละรูปแบบกับ spec ค่ะ
>
> ---
>
> **5. Drill-down บน UI ยังใช้งานจริงไม่ได้**
>
> ตอนนี้เวลาเลือก ticket หรือกดการ์ดจาก Dashboard
> - `onSelectTicket` รับ ticket id มาแล้ว แต่ยังไม่ได้เอาไปเปิด Ticket Detail
> - `onViewQueue` รับ filter มาแล้ว แต่ยังไม่ได้ส่งต่อให้ Ticket Queue
> - `StaffTicketQueue` ยังไม่รับ initial filters
> - ADMIN ยังเข้า Ticket Queue ผ่าน flow นี้ไม่ได้ เพราะตอนนี้รองรับเฉพาะ `IT_STAFF`
>
> แนะนำให้เก็บ filter กับ ticket id ที่กดมาจาก Dashboard ไว้ใน state แล้วส่งต่อให้ `StaffTicketQueue` / `StaffTicketDetail` จริงค่ะ และเพิ่มให้ ADMIN เข้า queue/detail ได้ด้วย
>
> ---
>
> **6. Tests ยังเป็นของ contract เก่าอยู่**
>
> ทั้ง Server test และ Client test ยังใช้ payload แบบเดิม ทำให้ยังไม่ได้ทดสอบ contract ใหม่จริง ๆ ค่ะ
>
> ควรเพิ่ม/แก้ test ให้ครอบคลุมพวกนี้ด้วย
> - `ownerId=me` ได้ผลตรงกับ user ที่ login อยู่
> - `byStatus` มีครบทั้ง 8 statuses
> - `RESOLVED / CLOSED / CANCELLED` ถูกนับจริง
> - `urgentHigh` มีทั้ง URGENT และ HIGH และเรียง URGENT ก่อน
> - `drilldown` มีครบ 5 URL ตาม spec
> - item มี `owner: { id, name } | null`
> - limit ไม่เกิน 5 และเรียงถูกต้อง
> - ไม่มีข้อมูลก็ยังคืน `200` พร้อมค่า 0 ครบ
> - ADMIN ได้ `userCounts`
> - unauthenticated ได้ `401` และ Requester ได้ `403`
> - ฝั่ง UI กด drill-down แล้วส่ง filter จริง และกด ticket แล้วเปิด detail จริงค่ะ
>
> ฝากอัปเดต test ให้ตรงกับ spec แล้วรันใหม่ที่ head ล่าสุดด้วยนะคะ
>
> ### อีกจุดที่ต้องเลือกให้ตรงกัน — Admin `userCounts`
>
> ตอนนี้ `api-spec.md` กำหนดเป็น
>
> `userCounts: { total, active }`
>
> และ Server ก็ทำตาม spec นี้แล้วค่ะ
>
> แต่ Client ยังใช้ `administrator.userCounts` และต้องการข้อมูลแยก requesters / staff / admins เพิ่มด้วย
>
> ตรงนี้ต้องเลือกว่าจะใช้แบบไหน แล้วทำ Server / Client / Spec ให้ตรงกันค่ะ ถ้ายึดตาม spec ปัจจุบัน ตอนนี้จะเป็นฝั่ง Client ที่ต้องแก้
>
> ### จุดเล็ก ๆ ที่ควรปรับเพิ่ม
> - การ mount `staffQueueRouter` กับ Dashboard route ควรจัดให้ชัดขึ้น
> - `csrfProtection` บน GET ไม่น่าจำเป็น
> - `pageSize` เปลี่ยนจาก 10 → 20 และ max 50 → 100 อาจกระทบ test

#### 5.1.2 Author Response #1 (`Achikan`, commit `2bc78ab`)

**Response Date:** 2026-10-31 17:39 UTC (2026-11-01 00:39 UTC+7)

> อัปเดตและแก้ตาม feedback ล่าสุดเรียบร้อยแล้วใน commit `2bc78ab` ค่ะ:
>
> 1. **Restore `staffQueue.ts` & `app.ts`**:
>    - คืนค่า `staffQueue.ts` และ `app.ts` กลับมาจาก `lab4-staging` ทั้งหมด ทำให้ route เดิมของ Lab 2-3 (categories, related systems, create/detail ticket, attachments, assignees) กลับมาครบถ้วน
>    - เพิ่มเฉพาะการรองรับ `ownerId=me` ตาม spec §3.2
> 2. **ปรับ Metrics & Payload ให้ตรง `api-spec.md §3.1`**:
>    - `byStatus` นับครบทั้ง 8 statuses (รวม RESOLVED, CLOSED, CANCELLED)
>    - `byPriority` กรองเฉพาะ active statuses
>    - `urgentHigh` มีทั้ง URGENT และ HIGH โดยเรียง URGENT ขึ้นก่อน และ cap ที่ 5 รายการ
>    - `recentlyUpdated` ใช้เวลา UTC จาก DB clock (`SELECT NOW()`) ย้อนหลัง 7 วัน และ cap 5 รายการ
>    - Ticket items ส่ง `owner: { id, name } | null`
>    - Admin ได้ `userCounts: { total, active }` และ Client อัปเดตรองรับ payload นี้แล้ว
>    - drilldown map ครบทั้ง 5 URLs
> 3. **UI Drill-down & Role Access**:
>    - กดการ์ด/ปุ่มจาก Dashboard ส่ง filter เข้า `StaffTicketQueue` (`initialFilters`) จริง
>    - กดเลือก Ticket เปิด `StaffTicketDetail` จริง
>    - ADMIN สามารถเข้า Ticket Queue และ Ticket Detail ผ่าน drill-down flow ได้แล้ว
>    - คง default view ของแต่ละ role ไว้ตามเดิม ไม่ให้กระทบ regression test
> 4. **ผลการทดสอบ (Head ล่าสุด)**:
>    - Server: 24 test files ผ่านทั้งหมด (**326/326 passed**)
>    - Client: 17 test files ผ่านทั้งหมด (**133/133 passed**)
>    - Build ผ่านทั้ง Server และ Client ไม่มี regression ค่ะ

#### 5.1.3 Review #2 — Commented (`jejaebubu`, 2026-11-01 01:19 UTC+7)

**Review ID:** `5724248896`  
**Commit Reviewed:** `2bc78abdcdff66772fd86f675015edd89e5b4fe2`  
**Verdict:** Commented

**Verbatim Review Comments:**

> เช็กที่ head `2bc78ab` แล้วนะคะ รอบนี้จุดหลัก ๆ จาก feedback ก่อนหน้าแก้ครบแล้วค่ะ 
>
> ### จุดที่ผ่านแล้ว
> - `app.ts` กับ `staffQueue.ts` restore กลับมาเรียบร้อยแล้ว route เดิมของ Lab 2–3 ยังอยู่ครบ และ `ownerId=me` ใช้งานได้แล้วค่ะ
> - Payload ตอนนี้ตรงกับ `api-spec.md §3.1` แล้ว ทั้ง `byStatus` ครบ 8 สถานะ, `byPriority` ครบ 4 ระดับ, `urgentHigh` มีทั้ง URGENT + HIGH และเรียงถูกต้อง
> - ข้อมูลแต่ละ item มี `owner: { id, name } | null` รวมถึง `userCounts` และ `drilldown` ครบ 5 URL แล้วค่ะ
> - Server dashboard test ผ่าน `6/6`
> - Client test ผ่าน `133/133`
> - Server build ผ่านค่ะ
> - Server full test ผ่าน `325/326` โดยตัวที่ไม่ผ่านเป็น timeout ของ `seedLab3 is idempotent (5s)` แต่พอรันไฟล์นั้นแยกผ่าน `10/10` เลยดูเป็น flake เดิมมากกว่า ไม่น่าใช่ regression จาก PR นี้ค่ะ
>
> เหลืออีกนิดที่อยากให้เก็บก่อน merge นะคะ
>
> ### 1. Client build ยังไม่ผ่านจริง
>
> ตอนรัน `npm run build` ฝั่ง Client ยังเจอ 2 errors ที่ `client/tests/lab-03/style.test.tsx` บรรทัด 41, 49 เรื่อง `ticketId` หายค่ะ
>
> เข้าใจว่าเป็นปัญหาที่มีอยู่ก่อน PR นี้ แต่ตอนนี้ข้อความที่บอกว่า **“Build ผ่านทั้ง Server และ Client”** ยังไม่ตรงกับผลจริง
>
> ถ้ายังไม่แก้ใน PR นี้ อย่างน้อยขอให้แก้ข้อความใน PR ให้ตรงกับสถานะปัจจุบันค่ะ
>
> ### 2. Drill-down ฝั่ง UI ยังไม่ครบ
>
> ตอนนี้ Server ส่ง `data.drilldown.recentlyUpdated` มาแล้ว แต่ฝั่ง UI ยังไม่ได้เอาไปใช้ค่ะ เลยยังกดจาก Recently Updated ไปหน้า Queue พร้อม `sort=-updatedAt` ตาม `ui-spec.md §3` ไม่ได้
>
> ส่วน AD-01 card ก็ยังไม่ได้ link ไปหน้า User Management ค่ะ
>
> ตรงนี้ฝากเชื่อม flow ให้ครบตาม spec อีกนิดนะคะ
>
> ### 3. Status badge ใน Dashboard ใช้ class ไม่ตรงกับ CSS
>
> ใน `StaffDashboard.tsx` ตอนนี้ใช้ประมาณ `status-badge status-*` แต่ class ที่มีอยู่จริงใน project เป็น `badge-status-*` ค่ะ ทำให้สีของ status badge ยังไม่ออกตาม design ที่กำหนดไว้
>
> แล้ว `text-tok-green` ก็ยังไม่มีใน CSS ด้วยค่ะ ฝากเปลี่ยนไปใช้ class ที่มีอยู่จริงหรือเพิ่ม style ให้ตรงกันนะคะ
>
> ### 4. UI test ยังไม่ครอบ flow จริงทั้งหมด
>
> ตอนนี้ test ของ `StaffDashboard` เช็ก callback แล้ว แต่ยังไม่มี test ระดับ `App` ที่ยืนยันว่า
> - กดการ์ดแล้วเปิด Queue พร้อม filter จริง
> - กด ticket แล้วเปิด Ticket Detail จริง
>
> แล้ว `UI-SD-03` เรื่องป้องกัน double-click ก็ยังไม่มีใน `tests.md` ค่ะ
>
> ตรงนี้อยากให้เพิ่มไว้ จะได้มั่นใจว่า Dashboard เชื่อมกับหน้าต่าง ๆ ได้จริง ไม่ใช่แค่ callback ทำงานค่ะ
>
> ### 5. Dashboard card ใช้ `<button>` แทน `<a>`
>
> ใน `ui-spec.md` ระบุไว้ว่า card ควรใช้ `<a>` แต่ implementation ตอนนี้เป็น `<button>`
>
> อันนี้ไม่ได้ block การ merge มากค่ะ แต่ถ้าจะให้ตรงกับ spec ทั้งหมด ฝากเก็บอีกนิดค่ะ
>
> ### สรุป
>
> ถ้าดูจาก feedback รอบก่อน **ถือว่าปิดครบแล้วค่ะ** 
>
> แต่ถ้าจะให้ตรงกับ `ui-spec.md`, `tests.md` และสถานะ build จริงทั้งหมด ขอ Comment เบา ๆ อีกรอบ โดยเฉพาะ **ข้อ 1–3** ก่อนนะคะ
>
> แก้แล้วบอกมาได้เลยค่ะ เดี๋ยวรีบช่วยเช็กรอบถัดไปให้ ขอบคุณมากค่ะ 

#### 5.1.4 Author Response #2 (`Achikan`, commit `178d559`)

**Response Date:** 2026-10-31 19:02 UTC (2026-11-01 02:02 UTC+7)

> Addressed latest review at 178d559.
>
> - Restored `server/src/app.ts` and `server/src/staffQueue.ts` from `lab4-staging`; added only the Dashboard route (with `requireAuth/blockPendingPasswordChange/requireRole`) and the `ownerId=me` alias. `/api/staff/assignees`, validation and pageSize/max restored.
> - `staffDashboard.ts`: DB clock (`SELECT NOW()`), `byStatus` all 8 statuses, `byPriority` active-only 4 keys, `urgentHigh` = URGENT+HIGH (URGENT first) capped 5, `recentlyUpdated` all statuses within 7d, 5-key `drilldown`, `owner: {id,name}|null`, top-level `userCounts` for Admin.
> - Client `StaffDashboard.tsx`: new contract (`unassignedCount/ownedByMeCount/byPriority/...items/userCounts`), cards as real `<a>` links, owner/"Unassigned", `<time>`, empty/forbidden/failure states, double-click guard (UI-SD-03), Admin user-count card.
> - `App.tsx`: Lab 3 landing restored; drill-downs now set queue filters / open detail; Admin can reach queue+detail via drill-down; Ticket Queue nav shown when active.
> - `StaffTicketQueue` accepts `initialFilters`; `StaffTicketDetail` accepts id-only ticket.
> - Tests rewritten to contract: server 7 tests (exact DB counts, caps, ordering, 401/403, admin, ownerId=me alias); client 6 tests. `style.test.tsx` ticketId added (REG exception noted).
>
> Verified: server `tsc --noEmit` clean; full server suite green; client `tsc --noEmit` clean; client full suite 133/133. Requester create/view/attach flows untouched.

#### 5.1.5 Review #3 — Changes Requested (`jejaebubu`, 2026-11-01 02:43 UTC+7)

**Review ID:** `5724630453`  
**Commit Reviewed:** `178d559d26017f6949c106853c66e249fbd329fc`  
**Verdict:** Changes Requested

**Verbatim Review Comments:**

> เช็คที่ `178d559` แล้วนะคะ ยืนยันว่าตอนนี้ส่วนหลัก ๆ ผ่านครบแล้วค่ะ
>
> - Server build ผ่าน และ full server suite ผ่าน 327/327 tests
> - Client build ผ่าน และ full client suite ผ่าน 133/133 tests
> - กู้ `app.ts` / `staffQueue.ts` กลับมาแล้ว
> - `ownerId=me`, contract ใหม่, Admin `userCounts`, drilldown, cards ที่ใช้ `<a>`, `<time>`, SD-05 drilldown และ `onViewUsers` ทำครบแล้ว
> - เพิ่ม `ticketId` ใน `style.test.tsx` แล้ว ทำให้ client build ผ่านค่ะ
>
> **เหลืออีก 2 เรื่องที่ยังต้องแก้ตาม feedback รอบก่อนนะคะ**
>
> **1. Status badge ยังใช้ class ไม่ตรงกับ CSS**
>
> ใน `client/src/StaffDashboard.tsx:42` ยังใช้ `status-badge status-*` อยู่ แต่ใน `styles.css` มี class เป็น `badge-status-*` ทำให้สีของ status badge ไม่แสดงตาม design ค่ะ
>
> รบกวนเปลี่ยนให้ใช้ mapping แบบเดียวกับ `STAFF_TICKET` / queue / detail เช่น `badge-status-new`, `badge-status-in-progress` และสถานะอื่น ๆ ด้วยนะคะ ส่วน `text-tok-green` ที่เพิ่มมาแล้วไม่มีปัญหาค่ะ
>
> **2. Tests บางส่วนยังขาด assertion จากรอบก่อน**
>
> ตอนนี้ test ใหม่ยังไม่ได้เช็กบางกรณีที่ feedback เคยระบุไว้ ได้แก่
>
> - `urgentHigh` ต้องมีทั้ง URGENT และ HIGH และเรียง URGENT ไว้ก่อน แต่ตอนนี้ seed ให้ URGENT เป็น CANCELLED เลยเหลือแค่ HIGH 1 รายการ
> - `recentlyUpdated` ต้องเช็กว่าเรียงจากรายการใหม่ไปเก่า และตัด ticket ที่เก่ากว่า 7 วันออก
> - Admin `userCounts` ตอนนี้เช็กแค่ `>= 1` แต่ควรเทียบกับ `prisma.user.count()` จริงด้วย
> - การเช็ก owner object ไม่ควรใช้ `if (item)` ครอบ assertion เพราะถ้าไม่เจอ item จะทำให้ข้ามการตรวจสอบไปได้ ควร assert ก่อนว่าเจอ item จริง
> - Client test ยังขาดการเช็ก drilldown ของ `byStatus` / `byPriority` และกรณีที่ IT_STAFF ต้องไม่เห็น `userCounts`
> - ยังไม่มี App-level test ที่ยืนยันว่ากดการ์ดแล้วส่ง filter ไปให้ `StaffTicketQueue` จริง และกด ticket แล้วเปิด `StaffTicketDetail` ได้จริง แม้ตอนนี้จะเขียนโค้ดเชื่อมไว้แล้วก็ตาม
>
> รบกวนเพิ่ม assertion และ test เหล่านี้กลับมาให้ครบ แล้วรัน full suite อีกรอบนะคะ
>
> **Nit เล็ก ๆ (ไม่ใช่ blocker):** การ์ด Admin ยังใช้ `href="#"` และ href ของการ์ดบางส่วนชี้ไปที่ `/api/...` ถ้าเปิดใน tab ใหม่ก็จะเห็นเป็น JSON แทนหน้า UI ค่ะ ถ้าปรับให้เป็น route ฝั่ง client ได้ก็จะดีมากค่ะ
>
> ถ้าแก้ 2 ประเด็นหลักนี้ครบแล้ว ก็น่าจะ approve ได้เลยค่ะ

#### 5.1.6 Author Response #3 (`Achikan`, commit `621db34`)

**Response Date:** 2026-10-31 23:49 UTC (2026-11-01 06:49 UTC+7)

> Addressed remaining feedback at 621db34.
>
> 1. Status badge: `statusBadge` now uses `badge-status-*` mapping (matching queue/detail) instead of `status-badge status-*`.
> 2. Tests completed:
>    - Server: urgentHigh now has both URGENT and HIGH with URGENT first; recentlyUpdated asserts newest-first ordering + exclusion of >7d tickets; Admin `userCounts` compared to actual `prisma.user.count()`; owner assertion no longer guarded by `if (item)`; unassignedCount updated for the active URGENT ticket.
>    - Client: drilldown href assertions for byStatus/byPriority; IT_STAFF no longer sees userCounts card; urgentHigh mock includes both priorities.
>    - New App-level test (AppDashboard.test.tsx): card click sends filter to StaffTicketQueue; ticket click opens StaffTicketDetail.
>
> Verified: server tsc clean, client tsc clean, server dashboard+queue tests 38/38, client full suite 136/136. Nit (href) left as drilldown URLs so links still carry query params.

#### 5.1.7 Review #4 — Approved (`jejaebubu`, 2026-11-01 16:50 UTC+7)

**Review ID:** `5727471865`  
**Commit Reviewed:** `621db34052cb10f21d82977b52331246ead04472`  
**Verdict:** Approved (no blocking issues)

**Verbatim Review Comments:**

> Checked at 621db34. Both remaining items are addressed:
>
> Status badge now uses the badge-status-* mapping, consistent with queue/detail.
> The missing assertions and tests are restored (urgentHigh, recentlyUpdated, userCounts vs DB, owner check, client drilldown, App-level test).
>
> The href nit isn’t a blocker. Consider a follow-up issue. Approving.

**คำวินิจฉัย:** **APPROVED & MERGED** — Reviewer (@jejaebubu) อนุมัติและเป็นผู้กด Merge PR #86 เข้า `lab4-staging` เรียบร้อย (Merge SHA: `773140529e59b2843361db28141957b56019226f`, 2026-11-01 10:22 UTC) — **Closes #74**
