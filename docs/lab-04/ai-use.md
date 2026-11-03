# Lab 4 AI Assistance & Reflection Log (บันทึกการใช้งาน AI และบทสรุปการเรียนรู้)

## 1. LLM Identification & Configuration
- **Model Used**: Gemini 3.8 Flash (High) / Antigravity Agentic AI Assistant
- **Primary Tasks**: Sprint 4 Specification Analysis, Database Architecture & Non-Destructive Migration Planning, REST API Contract Definition, Role-Appropriate Dashboard Calculations, Automated Test Design (Unit, API, Component, E2E), and Final Hardening.

---

## 2. Key Prompt Log (6-10 Selected Prompts)

1. **Prompt 1 (Handout & Requirement Analysis)**:
   > "อ่านไฟล์นี้ให้ละเอียด เค้าให้ทำอะไร (วิเคราะห์ข้อกำหนด Lab 4 TokTickIT Actions Taken, Dashboards, and Final Regression คะแนนเต็ม 60 คะแนน สรุปขอบเขตงานทั้งหมด กฎเกณฑ์ Business Rules และเกณฑ์การส่งงาน 9 Parts)"

2. **Prompt 2 (Sprint 4 Issue Breakdown & Decomposition)**:
   > "วิเคราะห์การแบ่ง GitHub Issues สำหรับ Lab 4 ให้ครอบคลุมทั้ง 10 ด้านตามที่ Handout Section 11 กำหนด (specification, tests, migration, Actions Taken, Ticket workflow, dashboards, regression, accessibility, visual inspection, release integration) เพื่อให้สอดคล้องกับ Kanban และเกณฑ์การตรวจแบบ 1 PR : 1 Issue"

3. **Prompt 3 (Engineering Contract & Specification Generation)**:
   > "ร่างเอกสารข้อกำหนดทางวิศวกรรมของ Sprint 4 ใน `docs/lab-04/` ได้แก่ `specification.md` (FR, BR, Parent-Child structure, Resolution Gate, Authorization Matrix, Data changes justification), `api-spec.md` (Actions Taken CRUD, Dashboards, Stale Update detection 409), `ui-spec.md` (Zen Green tokens, Metric cards, Drill-down behavior, 3 Viewports responsive), และ `tests.md` (AC Traceability Matrix สถานะ Planned)"

4. **Prompt 4 (PR-01 Spec Review Feedback & Hardening)**:
   > "วิเคราะห์ข้อเสนอแนะจาก Reviewer (titayaaa) ใน PR-01 และปรับปรุงเอกสารทั้ง 4 ไฟล์: (1) เพิ่ม assigneeId และ status (ActionTakenStatus enum) ใน ActionTaken model (2) กำหนด BR-13/14/15 และ AC-12/13/14 รองรับ inactive assignee rejection (422) และ Resolution Gate บล็อกการ Resolve ตั๋วที่มี pending actions (409) (3) เพิ่ม UI controls สำหรับ assignee dropdown และ status transition modal (4) เพิ่มเทสต์ API-12..14, UI-06..07 ใน tests.md สถานะ Planned"

5. **Prompt 5 (Issue #2 — Migration & Idempotent Seed)**:
   > "เพิ่มโมเดล ActionTaken พร้อม ActionTakenStatus enum, assigneeId/assignee และ performedById/performedBy (named relations) ลงใน Prisma schema โดยไม่ทำลายข้อมูล Lab 1–3 สร้าง migration แบบ non-destructive และขยาย seed ให้ idempotent ครอบคลุม ticket ที่มี 0/1/หลาย Actions, ครบทั้ง 4 สถานะ, performer ต่างจาก assignee และ Resolved ticket ต้องไม่มี Action ค้าง พร้อมเพิ่ม DB migration/seed test ใน server/tests/lab-04/actions-taken-migration.test.ts"

6. **Prompt 6 (Issue #3 — Actions Taken REST API & RBAC)**:
   > "พัฒนา REST API สำหรับ Actions Taken ใน `server/src/app.ts` ได้แก่ GET/POST `/api/tickets/:id/actions-taken` และ PATCH `/api/tickets/:id/actions-taken/:actionId` โดยใช้ JWT identity จาก token, จำกัด POST/PATCH เฉพาะ IT_STAFF/ADMINISTRATOR, Requester ดูได้เฉพาะตั๋วของตนเอง (404 no-leak), ตรวจ assignee ต้องเป็น IT Staff/Admin ที่ active (422), บังคับ `result` เฉพาะสถานะ COMPLETED (400) และบังคับ Action Status Matrix ตาม BR-14 พร้อมเขียน API tests API-01..05, API-12, API-14, API-15 ใน `server/tests/lab-04/actions-taken.api.test.ts`"

7. **Prompt 7 (Issue #4 — Actions Taken UI)**:
   > "สร้างคอมโพเนนต์ `ActionsTaken.tsx` สำหรับหน้า Ticket Detail ตาม `ui-spec.md` §2.4 ได้แก่ list เรียงใหม่→เก่า, ปุ่ม Add/Edit เฉพาะ IT_STAFF/ADMINISTRATOR, ฟอร์ม datetime-local/description/result/assignee/status/follow-up/attachment notes พร้อม validation แบบ dynamic (result บังคับเฉพาะ COMPLETED, follow-up note บังคับเมื่อเปิด), Complete/Cancel quick actions พร้อม loading state, แสดง error 422 จาก API โดยไม่ล้างข้อมูล, และ Requester เห็นแบบ read-only พร้อมเขียนเทสต์ UI-01/02/06 ใน `client/tests/lab-04/ActionsTaken.test.tsx` รวมทั้งเพิ่ม `GET /api/users/assignable` และให้ GET ticket detail ส่ง `actionsTaken` มาด้วย"

8. **Prompt 8 (Issue #5 — Ticket Workflow State Machine & Resolution Gate)**:
   > "พัฒนาระบบ Resolution Gate และ 9-state Transition Matrix สำหรับ Ticket Lifecycle ใน `server/src/app.ts` บล็อกการเปลี่ยนสถานะเป็น Resolved หากยังมี Actions Taken ค้างอยู่ในสถานะ PENDING หรือ IN_PROGRESS (409 UNRESOLVED_ACTIONS_EXIST), ตรวจสอบ Concurrency conflict ด้วย expectedUpdatedAt, รองรับ Requester Advisory Flag ('Problem Appears Resolved') โดยไม่แอบเปลี่ยนสถานะตั๋ว, และสร้าง Resolution Gate Warning Modal บน UI พร้อมเขียนเทสต์ API-06..08, API-13, UI-03, UI-07 ใน `server/tests/lab-04/ticket-workflow.api.test.ts` และ `client/tests/lab-04/TicketWorkflow.test.tsx`"

9. **Prompt 9 (Issues #6 & #7 — IT Staff & Requester Dashboards)**:
   > "พัฒนา REST API และ UI แดชบอร์ดแยกตามบทบาท: (1) IT Staff Dashboard (`/api/dashboard/staff` และ `StaffDashboard.tsx`) คำนวณ 5 operational metrics (New, Open, In Progress, Waiting for Requester, My Assigned) พร้อม Recent Queue Tickets และ Quick Actions รองรับ Drill-down ไปยัง Ticket Queue (2) Requester Dashboard (`/api/dashboard/requester` และ `RequesterDashboard.tsx`) คำนวณ 4 metrics จำกัดขอบเขตเฉพาะตั๋วของผู้ใช้ (requesterId = req.user.id) ป้องกัน Data Leakage คืน 403 สำหรับบทบาทอื่น พร้อม Empty State CTA และ Quick Actions"

10. **Prompt 10 (Issue #8 — Playwright E2E Multi-Viewport Automation)**:
    > "สร้างชุดทดสอบ End-to-End แบบครอบคลุมครบวงจร 3 flows ใน `e2e/lab-04/` ได้แก่ `actions-taken-flow.spec.ts` (Staff สร้าง/แก้ไข/Complete action + Requester read-only), `ticket-resolution.spec.ts` (Requester advisory flag + Staff resolution gate modal), และ `dashboards.spec.ts` (Role dashboards + metrics + drill-down) รันบนทั้ง 3 Viewports: Desktop (1280×800), Tablet (820×1180), Mobile (393×851) รวม 9 runs พร้อมจับภาพ full-page screenshots บรรจุใน `artifacts/lab-04/screenshots/`"

11. **Prompt 11 (Issues #9, #10 & #11 — Full Regression, Accessibility, and Release Integration)**:
    > "รัน Full Regression Test Suite ทั้งหมดของระบบครอบคลุม Lab 1 ถึง Lab 4 (Server 112 tests, Client 96 tests, E2E 27 runs) ยืนยัน Zero Regression 100%, ปรับสคริปต์ `staff-ticket-flow.spec.ts` ให้สอดคล้องกับ 9-state matrix และป้องกัน race condition ด้วย `toHaveValue`, ยกระดับการเข้าถึง Accessibility ตาม WCAG 2.1 AA (เพิ่ม `aria-required` แบบ dynamic, touch target $\ge 44\text{px}$, role alert, zero horizontal overflow), เพิ่ม unit test `A11Y-01` และตรวจสอบความสมบูรณ์ก่อนเปิด Release PR รวมเข้าสู่สาขา main"

---

## 3. Reflection (บทสรุปและการสะท้อนความคิด)

### 3.1 Specification-Agent (การวางแผนจากโจทย์)
การใช้ AI วิเคราะห์และแปลง Lab Sheet ให้กลายเป็น Engineering Contract ที่รัดกุมก่อนเริ่มเขียนโค้ดช่วยป้องกันปัญหาความเข้าใจคลาดเคลื่อน โดยเฉพาะประเด็นเรื่อง Parent-Child relationship ของ Actions Taken, การรักษาความเป็นส่วนตัวของข้อมูลบน Requester Dashboard (Ownership Protection), และการสร้าง Resolution Gate ที่ Requester สามารถแจ้งว่าปัญหาได้รับการแก้ไขแล้วได้ แต่ไม่สามารถเปลี่ยนสถานะตั๋วเป็น Resolved ได้เองโดยตรง การกำหนดรายละเอียดเหล่านี้ไว้ในระดับสเปกช่วยให้ทีมพัฒนาและ Reviewer มีเกณฑ์ที่ตรงกันอย่างชัดเจน

### 3.2 Coding-Agent (การเขียนโค้ดจริงและการแก้ปัญหา)
ในการพัฒนา Sprint 4 บทบาทของ Coding-Agent ช่วยให้การขับเคลื่อนด้วย TDD (Test-Driven Development) มีประสิทธิภาพสูงมาก:
1. **การรักษาความปลอดภัยและ Data Isolation**: การบังคับใช้ RBAC และ Scope Limitation (`requesterId = req.user.id`, ตอบกลับ 404 สำหรับตั๋วต่างเจ้าของ) ถูกนำมาใช้สม่ำเสมอทั้งใน API endpoints และ UI rendering ป้องกันช่องโหว่การรั่วไหลของข้อมูลข้ามบทบาท
2. **การป้องกัน Regression เชิงรุก**: เมื่อมีการเพิ่มกฎ Resolution Gate และเปลี่ยน Transition Matrix จาก 8 เป็น 9 สถานะ ชุดทดสอบเดิมของ Lab 3 (`staff-ticket-flow.spec.ts`) ได้รับผลกระทบจากกฎใหม่ การให้ Agent ปรับสเต็ปการเปลี่ยนสถานะให้ถูกต้อง (`Open -> In Progress -> Resolved`) และเพิ่ม assertion `toHaveValue("Resolved")` ช่วยขจัดปัญหา Race condition และ Flaky tests ได้อย่างเด็ดขาด
3. **Accessibility & Responsive Precision**: การให้ Agent ตรวจสอบค่า Touch Target Size ($\ge 44\text{px}$) และเพิ่ม Dynamic `aria-required` บนฟิลด์ที่บังคับกรอกตามเงื่อนไขทางธุรกิจ ทำให้แอปพลิเคชันเข้าถึงได้ง่ายและได้มาตรฐาน WCAG 2.1 AA อย่างแท้จริง

### 3.3 สรุปภาพรวมของ Sprint 4
TokTickIT Lab 4 ประสบความสำเร็จในการส่งมอบระบบ IT Service Desk ที่ครบวงจรและสมบูรณ์แบบ ทั้งระบบ Actions Taken ที่มีประวัติการทำงานชัดเจน, Resolution Gate ที่ป้องกันการปิดตั๋วโดยที่งานยังค้างอยู่, แดชบอร์ดเฉพาะบทบาทที่แสดงตัวชี้วัดแบบเรียลไทม์ และชุดทดสอบอัตโนมัติรวม **235 tests (Server 112 + Client 96 + E2E 27 across 3 viewports) ผ่าน 100%** ภายใต้กระบวนการวิศวกรรมซอฟต์แวร์ที่โปร่งใสผ่าน Peer Review 1 PR : 1 Issue อย่างเคร่งครัด พร้อมนำโค้ดที่ผ่านการทดสอบอย่างเข้มข้นขึ้นสู่สาขาหลัก (`main`) ได้อย่างมั่นใจ

