# Lab 3 Peer Review Log & Approval Record (บันทึกการตรวจทานโค้ดและการอนุมัติ)

## 1. Review Summary
เอกสารบันทึกกระบวนการ Peer Review และการรวมโค้ดผ่านสาขาพัฒนา (Staging Branch) สำหรับ Lab 3 (TokTickIT Users, Roles, IT Staff Ticketing, and Admin Screens)

> **บันทึกนี้จะถูกอัปเดตตาม PR ที่ตรวจจริงทีละฉบับ (ทำตามกติกา 1 PR : 1 Issue) โดยบันทึกเฉพาะ PR ที่เกิดขึ้นจริงเท่านั้น** — ไม่ลงผลล่วงหน้าก่อนเริ่มเขียนโค้ด

---

## 2. Reviewer Information & Approvals

- **Reviewer Identity**: Peer Review (Partner): `phatthidawadi` — Full-Stack Software Engineer / Performance Engineering Team
- **Staging Branch**: `lab3-staging`
- **Target Branch**: `main`
- **Workflow**: 1 PR : 1 Issue (feature branches → `lab3-staging` → `main`), ตรวจทานจริงทุก PR จาก GitHub ก่อน merge

### Pull Request Log

| PR ID | Title / Feature Scope | Branch Source | Target Branch | Reviewer Status | Comments / Resolution (Merge SHA) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PR-01 (GitHub #52)** | Specification & Engineering Contract for Lab 3 (Spec DD: specification, api-spec, ui-spec, tests, reviewer, ai-use) | `feature/lab03-issue1-specs` | `lab3-staging` | **Request Changes → Approved** | Review 2026-09-15: ขอเพิ่ม Authorization Matrix, ฟีลด์ + API สำหรับเจตนา "Problem Appears Resolved", เปลี่ยน `403` → `404` (Data Leakage §6.2), ปรับ DoD/Test/Reviewer ไม่บันทึกผลล่วงหน้า, เพิ่มเคส requesterId-override / password-boundary / resolved-intent → ผู้เขียนแก้ครบตามข้อ 1–4 → Reviewer ตรวจซ้ำแล้ว **Approve** (verify: เอกสาร Spec DD ครบถ้วนตาม Handout, BR-01..14 และ AC) — merged `076f0f1` |
| **PR-02 (GitHub #60)** | Lab 3 database migration — ยกระดับ User model (roles: REQUESTER/IT_STAFF/ADMINISTRATOR, mustChangePassword, ownerId, PublicComment, InternalNote) + seed | `feature/lab03-issue2-migration` | `lab3-staging` | **Request Changes → Approved** | Review: SQL Migration เปลี่ยนเป็น RENAME TABLE เพื่อรักษาข้อมูล Lab 2 เดิมอย่างปลอดภัย (non-destructive); ตรวจ schema/migration/seed จริงแล้ว → **Approve** — merged `529865e` |
| **PR-03 (GitHub #61)** | JWT Authentication API — login/logout/me/change-password, mandatory password change enforcement | `feature/lab03-issue3-auth` | `lab3-staging` | **Request Changes → Approved** | Review: ตรวจ middleware เพิ่ม `checkPasswordChangeState` ครอบ Protected Route ทุกเส้น + ปรับ response ไม่แนบ Token → แก้ครบ → **Approve** — merged `4d83b71` |
| **PR-04 (GitHub #62)** | RBAC `requireRole` guard + protected internal-notes & user-management routes | `feature/lab03-issue4-rbac` | `lab3-staging` | **Approved** | Review: `requireRole` ทำงานร่วมกับ `authenticateToken`/`checkPasswordChangeState` ถูกต้อง, Requester เข้า Internal Notes/User APIs ไม่ได้ → **Approve** — merged `a47cee5` |
| **PR-05 (GitHub #63)** | Requester regression — ย้าย Lab 2 tests ไปใช้ JWT flow จริง, ลบ impersonation fallback | `feature/lab03-issue5-requester-regression` | `lab3-staging` | **Request Changes → Approved** | Review: 2 จุดต้องแก้ (ความปลอดภัย/เอกสาร) → แก้ครบ → **Approve** — merged `f77c715` |
| **PR-06 (GitHub #64)** | Role-aware Ticket Queue — staff search/filter/sort + pagination | `feature/lab03-issue6-staff-queue` | `lab3-staging` | **Request Changes → Approved** | Review: filter case-insensitive, validate ownerId/query params → 400, เพิ่ม unassigned-owner filter tests → แก้ครบ → **Approve** — merged `a131898` |
| **PR-07 (GitHub #65)** | IT Staff ticket operations — claim/assign, itPriority, status, comments/notes, requesterIndicatedResolved (AC-08) & 404 no-leak | `feature/lab03-issue7-staff-operations` | `lab3-staging` | **Request Changes → Approved** | Review: validate ownerId (BR-11), itPriority & status enums (BR-13), cap comment length, staff status change clears resolution flag → แก้ครบ → **Approve** — merged `2935ad2` |
| **PR-08 (GitHub #67)** | Client Authentication UI — Login, mandatory password change & role-aware app shell (JWT) | `feature/lab03-issue8-client-auth` | `lab3-staging` | **Approved** | Review (ฉบับสมบูรณ์): ตรวจ client auth flow, token storage, route guard และ role-aware shell ครบ → **Approve** — merged `8593a12` |
| **PR-09 (GitHub #66)** | Administrator User Management — CRUD, reset-password, safety rules (self-deactivate block, duplicate email 409) | `feature/lab03-issue9-admin-user-management` | `lab3-staging` | **Approved** | Review: ตรวจรหัสผ่านหลักฐานบรรทัดต่อบรรทัด — safety rules & RBAC ครบถ้วน → **Approve** — merged `dd8656d` |
| **PR-10 (GitHub #68)** | Zen Green UI — Ticket Queue, Staff Detail, User Management screens + UI-Style/Responsive tests | `feature/lab03-issue10-ui-style-responsive` | `lab3-staging` | **Request Changes → Approved** | Review: search input state mismatch → แก้ + เพิ่ม Clear Filters + `fetchUsers` error alert → ตรวจซ้ำ **Approve** — merged `d0d7e46` |
| **PR-11 (GitHub #69)** | E2E Testing — Playwright E2E ครอบ 3 viewports (Desktop/Tablet/Mobile), Header responsive nav, StaffTicketDetail PATCH merge fix, evidence screenshots | `feature/lab03-issue11-e2e-testing` | `lab3-staging` | **Approved** | Review 2026-09-16: 0 blocking issues — E2E ครอบทุก Acceptance Criteria + Viewport, Tests/Zen Green Consistency ถูกต้อง. Non-blocking suggestion: (อนาคต) ปิด dropdown nav เมื่อคลิกภายนอกใน `Header.tsx` → **Approve** — merged `22d1665` |

> **บันทึก**: ทุก PR ถูกตรวจทานจริงบน GitHub (state: CHANGES_REQUESTED/APPROVED) โดย Reviewer `phatthidawadi` ก่อน merge; หลัง merge ทั้งหมดไปยัง `lab3-staging` จากนั้นจะทำ **Release PR** `lab3-staging` → `main` (Section 11.1) และบันทึกผลการตรวจจริงของ PR นั้นในตารางเมื่อถูก review/merge ครบแล้ว
