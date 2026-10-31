# Lab 4 Peer Review Log & Approval Record (บันทึกการตรวจทานโค้ดและการอนุมัติ)

## 1. Review Summary
เอกสารบันทึกกระบวนการ Peer Review และการรวมโค้ดผ่านสาขาพัฒนา (Staging Branch) สำหรับ Lab 4: TokTickIT Actions Taken, Dashboards, and Final Regression

> **บันทึกนี้จะถูกอัปเดตตาม PR ที่ตรวจจริงทีละฉบับ (ทำตามกติกา 1 PR : 1 Issue) โดยบันทึกเฉพาะ PR ที่เกิดขึ้นจริงเท่านั้น** — ไม่ลงผลล่วงหน้าก่อนเริ่มเขียนโค้ด

---

## 2. Reviewer Information & Approvals

- **Reviewer Identity**: Peer Review (Partner): `phatthidawadi` — Full-Stack Software Engineer / Performance Engineering Team
- **Author Identity**: `jejaebubu` — Full-Stack Software Engineer (ผู้เขียนโค้ด, เปิด PR)
- **Staging Branch**: `lab4-staging`
- **Target Branch**: `main`
- **Workflow**: 1 PR : 1 Issue (feature branches → `lab4-staging` → `main`), ตรวจทานจริงทุก PR จาก GitHub ก่อน merge โดย **Reviewer เป็นผู้อนุมัติ (Approve) และกด Merge** ตาม Handout Section 11.1

### Pull Request Log

| PR ID | Title / Feature Scope | Branch Source | Target Branch | Reviewer Status | Comments / Resolution (Merge SHA) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PR-01** | Specification & Engineering Contract for Lab 4 (`specification.md`, `api-spec.md`, `ui-spec.md`, `tests.md`) | `feature/lab04-issue1-specs` | `lab4-staging` | **Under Review** | Pending review of Lab 4 Engineering Contract, Business Rules, Data Changes, Authorization Matrix, and Test Traceability |
| **PR-02** | Database migration, Prisma model, and idempotent seed for Actions Taken | `feature/lab04-issue2-migration` | `lab4-staging` | Planned | - |
| **PR-03** | Actions Taken REST API, RBAC authorization, and backend tests | `feature/lab04-issue3-actions-api` | `lab4-staging` | Planned | - |
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
*(รอผลการตรวจทานและข้อเสนอแนะจาก Reviewer บน GitHub PR)*
