# Lab 3 Peer Review Log & Approval Record (บันทึกการตรวจทานโค้ดและการอนุมัติ)

## 1. Review Summary
เอกสารบันทึกกระบวนการ Peer Review และการรวมโค้ดผ่านสาขาพัฒนา (Staging Branch) สำหรับ Lab 3 (TokTickIT Users, Roles, IT Staff Ticketing, and Admin Screens)

> **บันทึกนี้จะถูกอัปเดตตาม PR ที่ตรวจจริงทีละฉบับ (ทำตามกติกา 1 PR : 1 Issue) โดยบันทึกเฉพาะ PR ที่เกิดขึ้นจริงเท่านั้น** — ไม่ลงผลล่วงหน้าก่อนเริ่มเขียนโค้ด

---

## 2. Reviewer Information & Approvals

- **Reviewer Identity**: Peer Review (Partner) / Lead Software Engineer
- **Staging Branch**: `lab3-staging`
- **Target Branch**: `main`

### Pull Request Log

| PR ID | Title / Feature Scope | Branch Source | Target Branch | Reviewer Status | Comments / Resolution |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PR-01 (GitHub #52)** | Specification & Engineering Contract for Lab 3 (Spec DD: specification, api-spec, ui-spec, tests, reviewer, ai-use) | `feature/lab03-issue1-specs` | `lab3-staging` | **IN REVIEW — Request Changes** | Review 2026-09-15: ต้องเพิ่ม Authorization Matrix, ฟีลด์ + API สำหรับเจตนา "Problem Appears Resolved", เปลี่ยน `403` → `404` (Data Leakage §6.2), ปรับ DoD/Test/Reviewer ให้ไม่บันทึกผลล่วงหน้า, เพิ่มเคสทดสอบ requesterId-override / password-boundary / resolved-intent → อัปเดตเอกสารทั้งหมดแล้ว รอ re-review |

> **หมายเหตุ**: PR-02 ขึ้นไปจะถูกเพิ่มในตารางนี้เมื่อแต่ละ PR ถูกตรวจสอบและ merge จริง โดยใช้หมายเลข GitHub PR จริง (ยังไม่มีการบันทึกผลล่วงหน้า)
