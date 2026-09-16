# Lab 3 Test DD & Traceability Matrix (แผนการทดสอบและการติตตามความต้องการ)

## 1. Test Strategy & Coverage Summary
แผนการทดสอบ Lab 3 ครอบคลุมการสอบทานระบบในทุกมิติ ทั้ง Backend API Tests, Frontend UI Component Tests, Security & Authorization Matrix Tests, Regression Tests และ End-to-End (E2E) Browser Workflows เพื่อสร้างความมั่นใจว่าฟังก์ชันทั้งหมดตรงตามข้อกำหนดและไม่มีข้อผิดพลาด

---

## 2. Test Plan & Traceability Matrix

> สถานะในคอลัมน์ Final Status ใช้ `Pending` สำหรับแผนการทดสอบที่วางไว้ก่อนเริ่มเขียนโค้ด (PR สเปก) — จะอัปเดตเป็นผลจริง (`Pass`/`Fail`) หลังจาก implement และรันชุดทดสอบในแต่ละ PR

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
| **API-14** | API | FR-04 / BR-03 / AC-09 | Server ignores client-supplied `requesterId` (ownership decided from token only) | Viewing own ticket with forged body/query `requesterId` still resolves to authenticated identity | `server/tests/lab-03/authorization.api.test.ts` | Pass |
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
