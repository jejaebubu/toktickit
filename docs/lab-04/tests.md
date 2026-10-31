# Lab 4 Test DD & Traceability Matrix (แผนการทดสอบและการติดตามความต้องการ)

## 1. Test Strategy & Coverage Summary
แผนการทดสอบ Lab 4 ได้รับการออกแบบตามระเบียบวิธี Test-Driven Development (TDD) และ Specification-Driven Development (Spec DD) โดยมุ่งเน้นการตรวจสอบความถูกต้องของระบบบริการตั๋วงานอย่างรอบด้าน:
- **Server API Tests (`server/tests/lab-04/`)**: ตรวจสอบการทำงานของ RESTful APIs, RBAC Authorization Guards, Input Validation, Business Rules, Concurrency Handling และ Data Isolation
- **Client Component & UI Tests (`client/tests/lab-04/`)**: ตรวจสอบการ Render ของคอมโพเนนต์ต่างๆ การตอบสนองต่อ Event, การตรวจสอบข้อมูลในฟอร์ม (Dynamic Validation), Empty States และ Loading States
- **UI Style & Responsive Tests**: ตรวจสอบโทนสีตาม Zen Green Theme, การซ่อน/แสดงผลบน Viewport ต่างๆ (Desktop, Tablet, Mobile) และการไม่เกิด Horizontal Overflow
- **Accessibility Tests**: ตรวจสอบเกณฑ์ WCAG AA, Touch target $\ge 44\text{px}$, ARIA attributes และ Keyboard navigation
- **End-to-End (E2E) Browser Tests (`e2e/lab-04/`)**: จำลองการใช้งานจริงผ่าน Playwright ครอบคลุม Customer Journeys หลักทั้งการบันทึก Actions Taken, วงจร Ticket Resolution และการใช้งาน Dashboards
- **Regression Tests**: ยืนยันว่าชุดทดสอบเดิมของ Lab 1, Lab 2 และ Lab 3 ทั้งหมดยังคงผ่าน 100%

> **ข้อกำหนดสำคัญเรื่องสถานะการทดสอบ**: ณ ขั้นตอนการจัดทำ Engineering Contract (Issue #1) ทุกรายการทดสอบจะมีสถานะเริ่มต้นเป็น **`Planned`** ทั้งหมด และจะถูกปรับสถานะเป็น **`Pass`** พร้อมกับการพัฒนาและเปิด Pull Request ในแต่ละ Issue (#3 ถึง #9) เพื่อเป็นหลักฐานว่ามีการทดสอบจริงตามขั้นตอน ไม่มีการบันทึกผลสำเร็จล่วงหน้า (No Premature Data)

---

## 2. วิธีอ่านรหัสการทดสอบ (Test ID Convention)
- **API-xx**: การทดสอบฝั่งเซิร์ฟเวอร์ (API Integration & Authorization Tests)
- **UI-xx**: การทดสอบฝั่งไคลเอนต์ (React Component Rendering & Behavior Tests)
- **STYLE-xx**: การทดสอบการตกแต่งตาม Zen Green Design System
- **RESP-xx**: การทดสอบการจัดวางและแสดงผลตาม Responsive Breakpoints
- **A11Y-xx**: การทดสอบการเข้าถึงอย่างเท่าเทียม (Accessibility)
- **E2E-xx**: การทดสอบจำลองผู้ใช้งานจริงระดับเบราว์เซอร์ด้วย Playwright
- **REG-xx**: การทดสอบความเข้ากันได้ย้อนหลัง (Regression Coverage)
- **MIG-xx**: การทดสอบ Database Migration และความสอดคล้องของ Seed Data

---

## 3. Planned Coverage Matrix (ระดับ Requirement — ตามแผน)

| Test ID | Type | Requirement / AC | What It Tests | Expected Result | Automated Test File | Final Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **API-01** | API | AC-01 / FR-01 / BR-01 | Create valid Action Taken by IT Staff | บันทึกสำเร็จ ส่งคืน HTTP 201 พร้อมผูก `performedById` กับผู้ใช้จริง | `server/tests/lab-04/actions-taken.api.test.ts` | Planned |
| **API-02** | API | AC-02 / FR-04 / BR-05 | Requester attempts to create Action Taken | ปฏิเสธด้วย HTTP 403 Forbidden | `server/tests/lab-04/actions-taken.api.test.ts` | Planned |
| **API-03** | API | AC-03 / FR-05 / BR-04 | Create Action Taken with `followUpRequired=true` but missing `followUpNote` | ปฏิเสธด้วย HTTP 400 Bad Request | `server/tests/lab-04/actions-taken.api.test.ts` | Planned |
| **API-04** | API | AC-01 / FR-02 | Update existing Action Taken by IT Staff | แก้ไขข้อมูลสำเร็จ ส่งคืน HTTP 200 พร้อมอัปเดต timestamp | `server/tests/lab-04/actions-taken.api.test.ts` | Planned |
| **API-05** | API | BR-06 / FR-04 | Requester requests Actions Taken of another user's ticket | ตอบกลับ HTTP 404 Not Found (Data leakage prevention) | `server/tests/lab-04/actions-taken.api.test.ts` | Planned |
| **API-06** | API | AC-07 / FR-06 / BR-08 | Invalid status transition (e.g. New $\rightarrow$ Closed) | ปฏิเสธด้วย HTTP 400 Bad Request ตาม Transition Matrix | `server/tests/lab-04/ticket-workflow.api.test.ts` | Planned |
| **API-07** | API | AC-08 / FR-07 / BR-09 | Requester sends "Problem Appears Resolved" flag | บันทึก advisory flag สำเร็จ แต่สถานะตั๋วไม่เปลี่ยนเป็น Resolved | `server/tests/lab-04/ticket-workflow.api.test.ts` | Planned |
| **API-08** | API | AC-09 / FR-11 / BR-12 | Stale update detection on Ticket update | ตรวจพบ mismatch ของ updatedAt และตอบกลับ HTTP 409 Conflict | `server/tests/lab-04/ticket-workflow.api.test.ts` | Planned |
| **API-09** | API | AC-04 / FR-08 / BR-10 | IT Staff Dashboard metrics calculation | ส่งคืน metrics ถูกต้องตรงกับฐานข้อมูล และมีรายการ recent tickets | `server/tests/lab-04/staff-dashboard.api.test.ts` | Planned |
| **API-10** | API | AC-06 / FR-08 | Requester requests IT Staff Dashboard API | ปฏิเสธด้วย HTTP 403 Forbidden | `server/tests/lab-04/staff-dashboard.api.test.ts` | Planned |
| **API-11** | API | AC-05 / FR-09 / BR-11 | Requester Dashboard metrics calculation | ส่งคืนเฉพาะตัวเลขและรายการตั๋วที่เป็นของ Requester ผู้เรียกดู | `server/tests/lab-04/requester-dashboard.api.test.ts` | Planned |
| **API-12** | API | AC-12 / FR-13 / BR-13 | Create/Update Action Taken with inactive or Requester assignee | ปฏิเสธด้วย HTTP 422 Unprocessable Entity และไม่บันทึกข้อมูล | `server/tests/lab-04/actions-taken.api.test.ts` | Planned |
| **API-13** | API | AC-13 / FR-15 / BR-15 | Resolve a Ticket while unresolved Actions Taken exist | ปฏิเสธด้วย HTTP 409 Conflict (`UNRESOLVED_ACTIONS_EXIST`) และสถานะตั๋วไม่เปลี่ยน | `server/tests/lab-04/ticket-workflow.api.test.ts` | Planned |
| **API-14** | API | AC-14 / FR-14 / BR-14 | Action Taken status transitions (PENDING → IN_PROGRESS → COMPLETED/CANCELLED) | เปลี่ยนสถานะที่อนุญาตสำเร็จ HTTP 200 และปฏิเสธ transition จาก Final state ด้วย HTTP 400 | `server/tests/lab-04/actions-taken.api.test.ts` | Planned |
| **UI-01** | UI | AC-01 / AC-03 | Actions Taken form input & dynamic follow-up note validation | สลับแสดงช่อง note และแสดง validation error เมื่อเว้นว่าง | `client/tests/lab-04/ActionsTaken.test.tsx` | Planned |
| **UI-02** | UI | AC-02 / FR-04 | Actions Taken list rendering under Requester view | แสดงรายการแบบ Read-only และซ่อนปุ่ม Create/Edit | `client/tests/lab-04/ActionsTaken.test.tsx` | Planned |
| **UI-03** | UI | AC-07 / AC-08 | Ticket workflow transition controls & advisory indicator | แสดงเฉพาะปุ่มสถานะที่อนุญาต และแสดงป้าย advisory เมื่อผู้ใช้แจ้งแก้แล้ว | `client/tests/lab-04/TicketWorkflow.test.tsx` | Planned |
| **UI-04** | UI | AC-04 / FR-10 | IT Staff Dashboard metrics cards & drill-down links | แสดงตัวเลข 5 การ์ด และลิงก์คลิกนำทางไป Ticket Queue ตามฟิลเตอร์ | `client/tests/lab-04/StaffDashboard.test.tsx` | Planned |
| **UI-05** | UI | AC-05 | Requester Dashboard metrics cards & recent tickets | แสดงตัวเลข 4 การ์ด และรายการตั๋วของตนเอง | `client/tests/lab-04/RequesterDashboard.test.tsx` | Planned |
| **UI-06** | UI | AC-12 / AC-14 / FR-13 / FR-14 | Assignee dropdown & Action Status controls | Dropdown แสดงเฉพาะ IT Staff/Admin ที่ Active, แสดง error 422, และปุ่ม Complete/Cancel ทำงานถูกต้อง | `client/tests/lab-04/ActionsTaken.test.tsx` | Planned |
| **UI-07** | UI | AC-13 / FR-15 / BR-15 | Resolution Gate warning and confirmation modal | แสดงคำเตือน/Modal เมื่อมี Action ค้าง และไม่เปลี่ยนสถานะเมื่อ API ตอบ 409 | `client/tests/lab-04/TicketWorkflow.test.tsx` | Planned |
| **STYLE-01** | UI Style | ui-spec §1 | Zen Green Theme consistency (Palette, Status Badges, Typography) | องค์ประกอบทั้งหมดใช้สีตรงตาม Zen Green Token Specification | `client/tests/lab-04/StaffDashboard.test.tsx` | Planned |
| **RESP-01** | Responsive | AC-10 / ui-spec §3 | Responsive layout across 3 viewports (Desktop, Tablet, Mobile) | การ์ดและตารางปรับตัวตาม breakpoint และไม่มี horizontal scrolling | `client/tests/lab-04/StaffDashboard.test.tsx` | Planned |
| **A11Y-01** | A11Y | ui-spec §3 | Keyboard focus, ARIA labels, and touch target size | Touch targets $\ge 44\text{px}$, มี visible focus, form controls มี label | `client/tests/lab-04/ActionsTaken.test.tsx` | Planned |
| **E2E-01** | E2E | AC-01 / AC-02 | Actions Taken complete user workflow | Staff สร้าง/แก้ไข Action $\rightarrow$ Requester เข้าดูเห็นเป็น Read-only | `e2e/lab-04/actions-taken-flow.spec.ts` | Planned |
| **E2E-02** | E2E | AC-07 / AC-08 | Ticket resolution & lifecycle verification | Requester แจ้งแก้ไข $\rightarrow$ Staff ตรวจงาน $\rightarrow$ เปลี่ยนเป็น Resolved | `e2e/lab-04/ticket-resolution.spec.ts` | Planned |
| **E2E-03** | E2E | AC-04 / AC-05 / FR-10 | Role dashboards navigation & drill-down flow | ตรวจสอบตัวเลข Dashboard ทั้งสองบทบาท และคลิก Drill-down สำเร็จ | `e2e/lab-04/dashboards.spec.ts` | Planned |
| **REG-01** | Regression | AC-11 / FR-12 | Full regression of Lab 1, Lab 2, and Lab 3 features | ชุดทดสอบเดิมทั้งหมดรันผ่าน 100% | Full Vitest & Playwright Suites | Planned |
| **MIG-01** | DB / Migration | Data Changes §5 / BR-01 / BR-13 | ActionTaken table, enum, indexes, and idempotent seed integrity | ตาราง/คอลัมน์/Enum ตรงตามสเปก, seed มี 0/1/หลาย Action, assignee/performer เป็น IT Staff/Admin ที่ Active, Resolved ticket ไม่มี Action ค้าง | `server/tests/lab-04/actions-taken-migration.test.ts` | Pass |

---

## 4. Planned $\rightarrow$ Actual Reconciliation (การกระทบยอดแผนสู่ของจริง)
*(ส่วนนี้จะถูกอัปเดตอย่างต่อเนื่องเมื่อแต่ละ Pull Request ได้รับการพัฒนาและทดสอบผ่านจริงในแต่ละ Issue)*

| PR ID | Issue | วันที่ทดสอบ | ชุดทดสอบที่เกี่ยวข้อง | จำนวนเทสต์ที่ผ่าน | สถานะผลลัพธ์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PR-01** | Issue #1 | 2026-10-30 | Engineering Contract & Spec Review | - | Review in progress |
| **PR-02** | Issue #2 | 2026-10-31 | DB Migration, Seed Verification, and Lab 1–3 Regression Smoke | 9 new + 83 existing = 92 | **Pass** |
| **PR-03** | Issue #3 | - | Actions Taken API Tests (`actions-taken.api.test.ts`) | - | Pending |
| **PR-04** | Issue #4 | - | Actions Taken UI Tests (`ActionsTaken.test.tsx`) | - | Pending |
| **PR-05** | Issue #5 | - | Ticket Workflow Tests (`ticket-workflow.api.test.ts`, `TicketWorkflow.test.tsx`) | - | Pending |
| **PR-06** | Issue #6 | - | Staff Dashboard Tests (`staff-dashboard.api.test.ts`, `StaffDashboard.test.tsx`) | - | Pending |
| **PR-07** | Issue #7 | - | Requester Dashboard Tests (`requester-dashboard.api.test.ts`, `RequesterDashboard.test.tsx`) | - | Pending |
| **PR-08** | Issue #8 | - | Playwright E2E Tests (`e2e/lab-04/*.spec.ts`) | - | Pending |
| **PR-09** | Issue #9 | - | Full Regression Test Suite (Lab 1–3) | - | Pending |
| **PR-10** | Issue #10 | - | Accessibility & Responsive Inspection | - | Pending |
| **PR-11** | Issue #11 | - | Release Verification on `main` branch | - | Pending |

