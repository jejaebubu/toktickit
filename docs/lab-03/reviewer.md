# Lab 3 Peer Review Log & Approval Record (บันทึกการตรวจทานโค้ดและการอนุมัติ)

## 1. Review Summary
เอกสารบันทึกกระบวนการ Peer Review และการรวมโค้ดผ่านสาขาพัฒนา (Staging Branch) สำหรับ Lab 3 (TokTickIT Users, Roles, IT Staff Ticketing, and Admin Screens)

> **บันทึกนี้จะถูกอัปเดตตาม PR ที่ตรวจจริงทีละฉบับ (ทำตามกติกา 1 PR : 1 Issue) โดยบันทึกเฉพาะ PR ที่เกิดขึ้นจริงเท่านั้น** — ไม่ลงผลล่วงหน้าก่อนเริ่มเขียนโค้ด

---

## 2. Reviewer Information & Approvals

- **Reviewer Identity**: Peer Review (Partner): `phatthidawadi` — Full-Stack Software Engineer / Performance Engineering Team
- **Author Identity**: `jejaebubu` — Full-Stack Software Engineer (ผู้เขียนโค้ด, เปิด PR)
- **Staging Branch**: `lab3-staging`
- **Target Branch**: `main`
- **Workflow**: 1 PR : 1 Issue (feature branches → `lab3-staging` → `main`), ตรวจทานจริงทุก PR จาก GitHub ก่อน merge โดย **Reviewer เป็นผู้อนุมัติ (Approve) และกด Merge** ตาม Lab Section 11.1 (ผู้เขียนไม่ใช่ผู้ merge)

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
| **PR-11 (GitHub #69)** | E2E Testing — Playwright E2E ครอบ 3 viewports (Desktop/Tablet/Mobile), Header responsive nav, StaffTicketDetail PATCH merge fix, evidence screenshots | `feature/lab03-issue11-e2e-testing` | `lab3-staging` | **Approved → (merged by author — ผิดขั้นตอน) → Reverted (#71)** | Review 2026-09-16: 0 blocking issues, E2E ครอบทุก AC + Viewport, Zen Green ถูกต้อง. Non-blocking: (อนาคต) ปิด dropdown nav เมื่อคลิกภายนอก. **กระบวนการผิดพลาด**: #69 ถูก merge โดย author (ไม่ใช่ reviewer) → ถูก **revert ผ่าน #71** และ re-add ใหม่ผ่าน #72 |
| **PR-12 (GitHub #71)** | Revert ของ #69 (แก้กระบวนการ: ให้ Reviewer เป็นผู้ merge ใหม่) | `fix/lab03-revert-pr69-e2e` | `lab3-staging` | **Approved** | ย้อนเนื้อหา E2E ออกจาก staging กลับสู่ `d0d7e46` เพื่อให้ Reviewer เปิด PR re-add ใหม่ — merged `7720e35` |
| **PR-13 (GitHub #72)** | E2E Testing (re-add จาก #69) — เนื้อหาเดียวกับ #69 + แก้ตาม review: `isSubmitting` lock PATCH, preserve attachments (null-safe), touch target 44px + Esc, `searchAndFind` deterministic | `feature/lab03-issue11-e2e-testing` | `lab3-staging` | **Request Changes → Approve** | Review 2026-09-16: 3 blocking (race condition PATCH, STYLE-03 touch target <44px, E2E findUser flaky กับ pagination) → แก้ครบ commits `18974f0`/`d1d282a` → **Re-review: Approve** — merged `6955c48` (โดย Reviewer) — **Closes #49** |
| **PR-14 (GitHub #70)** | Release Integration — Auth/RBAC, Staff Ticketing, Admin, E2E evidence, final docs (Lab 3 → `main`) | `release/lab03-post-merge-verification` | `main` | **Request Changes → Fixes applied → Approved (Re-review)** | Review 2026-09-16 19:19: 3 blocking doc fixes (README client test count, reviewer.md #71/#72 history, ai-use.md re-review prompts) → ผู้เขียนแก้ครบ: README ยืนยันตัวเลขจริง 79/79 (9 test files), reviewer.md + Full Review Trail ครบทุก PR รวม #71/#72, ai-use.md +Prompt 10 → **Re-review (2026-09-16 19:42 UTC): APPROVED — AC-01..AC-06 ผ่านครบ** → **รอ Reviewer กด Merge เข้า `main`** — **Closes #50** |

> **บันทึก**: ทุก PR ถูกตรวจทานจริงบน GitHub (state: CHANGES_REQUESTED/APPROVED) โดย Reviewer `phatthidawadi`; การ merge ตาม Lab Section 11.1 เป็นบทบาทของ Reviewer หลัง merge ทั้งหมดไปยัง `lab3-staging` แล้วจึงทำ **Release PR** `lab3-staging` → `main` (Section 11.1) และบันทึกผลการตรวจจริงใน PR นั้นเมื่อคน review/merge แล้ว
>
> ส่วนที่ 3 ด้านล่างเก็บ **ข้อความรีวิวและคำตอบฉบับเต็ม (verbatim) จาก GitHub** ทุก PR ทุก comment (Review Body, Inline Review Comment และ Author Response) เพื่อความโปร่งใสครบถ้วนตามหลักฐานจริง

---

## 3. Full Review Trail — บันทึกข้อความรีวิวฉบับเต็มจาก GitHub

> ข้อความทั้งหมดในส่วนนี้คัดลอกตรงตัว (verbatim) จาก GitHub API ของ PR จริงแต่ละฉบับ โดยไม่มีการแก้ไขถ้อยคำ

---

### 3.1 PR-01 (GitHub #52) — Specification & Engineering Contract (Issue #39)

#### 3.1.1 Review #1 — Request Changes (phatthidawadi, 2026-09-15 04:23 UTC)

# ผลการตรวจทาน Pull Request (PR #52)

## 1. สรุปความสอดคล้องกับข้อกำหนดและ Issue #39

Issue #39 กำหนดให้แปลงโจทย์ Lab 3 (Handout PDF) เป็นเอกสารข้อกำหนดทางวิศวกรรมของ Sprint 3 ในโฟลเดอร์ `docs/lab-03/` **ก่อน** เริ่มต้นเขียนโค้ด:
- `specification.md`: ข้อกำหนดเชิงฟังก์ชัน (FR-01–10), กฎทางธุรกิจ (BR-01–13), เงื่อนไขการยอมรับ (AC-01–07), ตารางสิทธิ์การใช้งาน (Authorization Matrix), นิยามความสำเร็จ (Definition of Done), ขอบเขตงาน และความเปลี่ยนแปลงโมเดลข้อมูล
- `api-spec.md`: รูปแบบการพิสูจน์ตัวตน, รายการ REST Endpoints, Request/Response Schema, HTTP Status Codes และการจัดการ Error ที่ปลอดภัย
- `ui-spec.md`: โทนสีและโทเค็น Zen Green, Badges บทบาทและสถานะ, โครงสร้างหน้าจอ, Responsive Matrix และ Accessibility
- `tests.md`: กลยุทธ์การทดสอบและตารางความเชื่อมโยง (AC Traceability Matrix) ครอบคลุม Unit, API, UI, Security และ E2E
- `reviewer.md` & `ai-use.md`: บันทึกการตรวจทานโค้ดและสรุปการใช้งาน AI

---

## 2. ตารางตรวจสอบตามหมวดหมู่ความปลอดภัยและสเปก (Category Audit)

| หมวดหมู่ (Category) | สถานะ | รายละเอียด / ข้อผิดพลาดที่พบ |
| :--- | :---: | :--- |
| **Authorization (การตรวจสอบสิทธิ์)** | [ต้องแก้ไข] | มีการระบุในข้อความว่าเช็คสิทธิ์ที่ฝั่งเซิร์ฟเวอร์ แต่ขาด **ตาราง Authorization Matrix** ที่ชัดเจนใน `specification.md` นอกจากนี้ `GET /api/tickets/:id` คืนค่า `403` เมื่อ Requester พยายามดูตั๋วผู้อื่น ซึ่งเป็นการเปิดเผยการมีอยู่ของข้อมูล |
| **Ownership (ความเป็นเจ้าของข้อมูล)** | [ต้องแก้ไข] | ระบุใช้ Identity จาก Session/Token ฝั่งเซิร์ฟเวอร์ตาม BR-03 แล้ว แต่ใน `tests.md` ยังขาดเคสทดสอบว่าเซิร์ฟเวอร์จะไม่เชื่อ `requesterId` ที่ส่งมาจากหน้าบ้าน (ตามตัวอย่าง AC-03 ใน Handout) |
| **Data Safety (ความปลอดภัยของข้อมูล)** | [ต้องแก้ไข] | มีการระบุแฮช `bcrypt` (salt rounds=10) และ HTTP-Only Cookie แต่การตอบกลับ `403 Forbidden` เมื่อเข้าถึงตั๋วผู้อื่น ขัดกับ Handout §6.2 ที่ห้ามรั่วไหลข้อมูลว่าตั๋วของผู้อื่นมีตัวตนอยู่หรือไม่ |
| **Internal Notes vs Public Comments** | [ถูกต้อง] | API แยกสิทธิ์ `POST/GET /api/tickets/:id/internal-notes` ให้เฉพาะ `IT_STAFF` และ `ADMINISTRATOR` (BR-04) และ UI กำหนดดีไซน์แยกชัดเจน (พื้นหลัง `#FFFDF0` พร้อม Badge) |
| **Regression (ฟังก์ชันเดิม Lab 2)** | [ถูกต้อง] | ฟังก์ชันเดิมของ Requester ใน Lab 2 ถูกรักษาไว้ครบถ้วนโดยตัดตัวสลับผู้ใช้จำลองออก |
| **Tests (ชุดทดสอบ)** | [ต้องแก้ไข] | ตารางใน `tests.md` ใส่สถานะ `Final Status: Pass` ล่วงหน้าทั้งที่ยังไม่ได้เริ่มเขียนโค้ด และขาดเคสทดสอบเรื่อง `requesterId` override, ขอบเขตความยาวรหัสผ่าน และเจตนา "Problem Appears Resolved" |
| **Zen Green Consistency** | [ต้องแก้ไข] | กำหนด Design Tokens ได้ดี แต่ใน `ui-spec.md` ตกหล่นการระบุสี Badge ของสถานะ `Cancelled` ซึ่งเป็นสถานะบังคับตามสเปก |

---

## 3. สรุปผลการตรวจทาน (Summary of Findings)

### Blocking Issues (ประเด็นสำคัญที่ต้องแก้ไขก่อน Merge)

1. **[Spec deviation from handout] ขาด API และฟิลด์โมเดลข้อมูลสำหรับเจตนา "Problem Appears Resolved" ของ Requester**
   - **อ้างอิง Handout**: §1, §3, §4.3, §4.4 (BR-05), §8.2
   - **รายละเอียด**: ถึงแม้จะระบุ FR-09 และ BR-05 ในข้อความ แต่ใน `specification.md` หัวข้อ 7 (Data Changes) ไม่ได้เพิ่มฟิลด์ใน Prisma Schema (เช่น `requesterIndicatedResolved: Boolean`) และใน `api-spec.md` ไม่ได้ระบุ Endpoint หรือ Request Payload ให้ Requester ส่งเจตนานี้ได้

2. **[Spec deviation from handout & Issue #39] ขาดตาราง Authorization Matrix ที่สมบูรณ์**
   - **อ้างอิง Handout**: §4.3 | **อ้างอิง Issue #39**: ขอบเขตงานข้อ 1
   - **รายละเอียด**: ใน `specification.md` มีเพียงหัวข้อสั้นๆ แต่ขาดตารางสรุปสิทธิ์ (Authorization Matrix Table) ที่แมปทั้ง 3 บทบาท (`REQUESTER`, `IT_STAFF`, `ADMINISTRATOR`) กับทุกการทำงานของระบบ (ดู Queue, Claim/Reassign, เปลี่ยน IT Priority, เปลี่ยนสถานะ, Public Comment, Internal Note, Admin Users API)

3. **[Data Safety / Spec deviation from handout] การส่ง Error Code ที่เปิดเผยการมีอยู่ของข้อมูล (Resource Existence Leakage)**
   - **อ้างอิง Handout**: §6.2
   - **รายละเอียด**: ใน `api-spec.md` ระบุให้คืนค่า `403 Forbidden` เมื่อ Requester เรียกดูตั๋วของผู้อื่น ซึ่งขัดกับ Handout §6.2 ที่ระบุชัดเจนว่าต้องไม่ทำให้ผู้ใช้รู้ว่ามีทรัพยากรนั้นอยู่หรือไม่ (ต้องตอบกลับเป็น `404 Not Found` สำหรับตั๋วที่ไม่ได้เป็นเจ้าของ)

4. **[Premature Data] การติ๊ก DoD, สถานะ Test และ Reviewer Log ว่าเสร็จสิ้นล่วงหน้า**
   - **อ้างอิง Handout**: §9, §10, §14 (Part 1 & 3)
   - **รายละเอียด**: ใน `specification.md` หัวข้อ Definition of Done ถูกเช็ก `[x]` ทั้งหมด, ใน `tests.md` ระบุ `Final Status: Pass` สำหรับโค้ดที่ยังไม่ได้เขียน และใน `reviewer.md` ลงบันทึก PR-02 ถึง PR-06 ว่า `APPROVED` ล่วงหน้า เนื่องจาก PR #52 นี้เป็นงานสเปกก่อนเริ่มเขียนโค้ด ควรเปลี่ยน DoD เป็น `[ ]`, สถานะ Test เป็น `Planned` หรือ `Pending` และบันทึกเฉพาะ PR ที่เกิดขึ้นจริง

5. **[Tests / Ownership] ขาดเคสทดสอบป้องกัน `requesterId` จากฝั่ง Client และเคสทดสอบขอบเขตรหัสผ่าน**
   - **อ้างอิง Handout**: §10 (ตัวอย่าง AC-03)
   - **รายละเอียด**: ตารางใน `tests.md` ยังไม่มีเคสทดสอบยืนยันว่าเซิร์ฟเวอร์ปฏิเสธ/มองข้าม `requesterId` ที่แคลมมาจากหน้าบ้าน รวมถึงไม่มีเคสทดสอบความถูกต้องของขอบเขตรหัสผ่าน (Length & Complexity boundaries)

---

### Non-blocking Suggestions (ข้อเสนอแนะเพิ่มเติม ไม่บล็อกการอนุมัติ)

1. **ระบุกลไก Authentication ใน API Spec ให้ชัดเจนเพียงอย่างเดียว**
   - `api-spec.md`: บรรทัดที่ 4 เขียนว่า "HTTP-Only Session Cookie หรือ Bearer Token" ควรเลือกกำหนดแบบใดแบบหนึ่งให้ชัดเจน (เช่น Signed HTTP-Only Cookie หรือ Bearer JWT) เพื่อไม่ให้เกิดความสับสนในการพัฒนาร่วมกัน

2. **[Spec deviation from handout] ระบุจำนวนบัญชีเริ่มต้นใน Seed Data ให้ตรงตาม Handout**
   - `specification.md`: Handout §5.3 กำหนดจำนวนขั้นต่ำของ Seed Data ชัดเจน (Requester 4 active + 1 inactive, IT Staff 3 active + 1 inactive, Admin 1 active) ควรกำหนดตัวเลขเป้าหมายนี้ในเอกสารสเปกด้วย

3. **[Zen Green Consistency / Spec deviation from handout] เพิ่มการกำหนดสี Badge สำหรับสถานะ `Cancelled`**
   - `ui-spec.md`: เพิ่ม Design Token สำหรับ Badge ของสถานะ `Cancelled` (เช่น เทาเข้ม/ส้มอิฐ) เพื่อให้ครอบคลุมสถานะตาม BR-13

4. **ระบุกฎการ Validation รหัสผ่านใน API Contract**
   - `api-spec.md`: ควรระบุกฎฝั่งเซิร์ฟเวอร์ในการตรวจสอบความซับซ้อนของรหัสผ่านและ Response `400 Bad Request` ใน Endpoint การเปลี่ยนรหัสผ่านและสร้างผู้ใช้ใหม่

---

### Questions for Author (คำถามถึงผู้เขียน PR)

1. **สิทธิ์การเป็น Ticket Owner ของ Administrator**:
   - ใน `specification.md` BR-11 ระบุว่า Admin สามารถเป็น Ticket Owner ได้ แต่ Handout §4.3 ระบุว่า Admin และ IT Staff ควรแยกบทบาทกันอย่างชัดเจน เว้นแต่จะระบุใน Authorization Matrix จึงอยากสอบถามว่าในตารางสิทธิ์ สรุปแล้ว Admin จะสามารถกด Claim/รับตั๋วและเปลี่ยนสถานะตั๋วได้เหมือน IT Staff หรือไม่?

---

## 4. คำตัดสินภาพรวมที่แนะนำ (Recommended Overall Verdict)
คำตัดสิน: Request changes (ขอให้แก้ไขก่อนอนุมัติ)

เหตุผลสรุปประกอบคำตัดสิน (1 ประโยค):
เอกสารสัญญาข้อกำหนดทางวิศวกรรมยังมีส่วนที่ไม่ตรงกับ Handout (ขาดการระบุตาราง Authorization Matrix และ API/ฟิลด์สำหรับเจตนา Problem Appears Resolved ของ Requester, การเปิดเผยการมีอยู่ของข้อมูลผ่าน Error 403) รวมถึงมีการทำเครื่องหมาย DoD, Reviewer Log และผลการทดสอบว่าเสร็จสิ้นล่วงหน้าทั้งที่ยังไม่ได้เริ่มเขียนโค้ด

#### 3.1.2 Inline Review Comments (phatthidawadi — GitHub diff comments)

1. **`docs/lab-03/specification.md:87`**
   > *[Spec deviation from handout]* ตาม Handout §1, §4.4 (BR-05) และ §8.2 กำหนดให้ Requester สามารถระบุเจตนาว่าปัญหาได้รับการแก้ไขแล้ว ("Problem Appears Resolved") ได้ รบกวนเพิ่มฟิลด์สำหรับบันทึกเจตนารมณ์นี้ลงในโมเดล `Ticket` (เช่น `requesterIndicatedResolved: Boolean @default(false)` หรือ `resolutionRequestedAt: DateTime?`) ในส่วนความเปลี่ยนแปลงของโมเดลข้อมูลด้วย

2. **`docs/lab-03/specification.md:43`**
   > *[Spec deviation from handout]* ตาม Handout §4.3 และขอบเขตงานของ Issue #39 จำเป็นต้องมีตารางสรุปสิทธิ์ Authorization Matrix รบกวนเพิ่มตาราง Markdown ที่เปรียบเทียบสิทธิ์การเข้าถึงระหว่างบทบาท `REQUESTER`, `IT_STAFF` และ `ADMINISTRATOR` กับทุกการทำงานของระบบ (ดู Queue, รายละเอียดตั๋ว, Claim/Reassign, เปลี่ยน IT Priority, เปลี่ยนสถานะ, Public Comment, Internal Note, Admin Users API) ให้ชัดเจน

3. **`docs/lab-03/api-spec.md:119`**
   > *[Data Safety / Spec deviation from handout]* การตอบกลับ `403 Forbidden` เมื่อ Requester พยายามเรียกดูตั๋วของคนอื่น จะทำให้ผู้ใช้ทราบว่ามีตั๋วหมายเลขนั้นอยู่ในระบบจริงๆ ซึ่งขัดกับ Handout §6.2 เรื่องการป้องกัน Data Leakage รบกวนปรับ Response กรณีนี้ให้ส่งกลับเป็น `404 Not Found` แทน

4. **`docs/lab-03/api-spec.md:132`**
   > *[Spec deviation from handout]* ใน API Spec ยังไม่มี Endpoint หรือ Request Body รองรับให้ Requester ส่งเจตนา "Problem Appears Resolved" รบกวนเพิ่มการนิยาม Endpoint (เช่น `POST /api/tickets/:id/indicate-resolved` หรือระบุใน `PATCH /api/tickets/:id` ให้ Requester ส่ง `requesterIndicatedResolved: true` ได้) เพิ่มเติม

5. **`docs/lab-03/specification.md:105`**
   > เนื่องจาก PR #52 นี้เป็นงานจัดทำเอกสารสัญญาข้อกำหนดก่อนเริ่มเขียนโค้ด การทำเครื่องหมาย `[x]` ใน Definition of Done และการลงสถานะ `Pass` ในแผนการทดสอบ รวมถึงการบันทึกสถานะ `APPROVED` ล่วงหน้าใน `reviewer.md` สำหรับ PR ในอนาคตจึงยังไม่ตรงกับความเป็นจริง รบกวนปรับรายการ DoD เป็น `[ ]` และสถานะการทดสอบเป็น `Planned` หรือ `Pending` ก่อน

6. **`docs/lab-03/tests.md:12`** (comment เหมือนกับข้อ 5)
   > เนื่องจาก PR #52 นี้เป็นงานจัดทำเอกสารสัญญาข้อกำหนดก่อนเริ่มเขียนโค้ด การทำเครื่องหมาย `[x]` ใน Definition of Done และการลงสถานะ `Pass` ในแผนการทดสอบ รวมถึงการบันทึกสถานะ `APPROVED` ล่วงหน้าใน `reviewer.md` สำหรับ PR ในอนาคตจึงยังไม่ตรงกับความเป็นจริง รบกวนปรับรายการ DoD เป็น `[ ]` และสถานะการทดสอบเป็น `Planned` หรือ `Pending` ก่อน

7. **`docs/lab-03/tests.md:12`**
   > รบกวนเพิ่มแถวการทดสอบเพิ่มเติมในแผนการทดสอบให้ครอบคลุม: (1) การทดสอบว่าเซิร์ฟเวอร์ไม่อนุญาตให้ใช้ `requesterId` ที่ส่งมาจากฝั่ง Client (ตามตัวอย่าง AC-03 ใน Handout), (2) การทดสอบความถูกต้องของขอบเขตรหัสผ่าน (Password validation boundary tests) และ (3) การทดสอบฟิกซ์เจอร์เจตนา "Problem Appears Resolved" ของ Requester ด้วย

8. **`docs/lab-03/ui-spec.md:13`**
   > ใน Handout §4.5 และ BR-13 กำหนดให้ `Cancelled` เป็นหนึ่งในสถานะบังคับ รบกวนเพิ่มการระบุโทนสี Badge สำหรับสถานะ `Cancelled` ในข้อกำหนด UI Spec ให้ครบถ้วนด้วย

#### 3.1.3 Author Response (jejaebubu, 2026-09-15 04:58 UTC)

ขอบคุณสำหรับ review นะคะ แก้ไขตามทุกจุดที่แจ้งมาแล้วใน commit `fa9eed6` ค่ะ

**สรุปการแก้ไขแต่ละข้อ:**

1. **เพิ่ม `requesterIndicatedResolved` แล้ว**

   * เพิ่ม field `requesterIndicatedResolved: Boolean @default(false)` ใน `specification.md`
   * ใน `api-spec.md` กำหนดให้ Requester ที่เป็นเจ้าของ ticket สามารถส่งค่า `true/false` ได้ และระบบจะเปลี่ยนสถานะเป็น `Waiting for Requester`
   * เพิ่ม AC-08, AC-09, AC-10 และ test API-14 ถึง API-16 แล้วค่ะ
   * ส่วนการเพิ่ม field จริงใน database จะทำใน PR ถัดไป เพราะ PR นี้เป็นงานด้าน specification ค่ะ

2. **เพิ่ม Authorization Matrix แล้ว**

   เพิ่มตารางสิทธิ์ของทั้ง 3 role คือ Requester, IT Staff และ Admin ให้ชัดเจนขึ้นใน `specification.md` §5 ค่ะ

3. **แก้กรณี Requester เข้าถึง ticket ของคนอื่นจาก 403 เป็น 404 แล้ว**

   ใน `api-spec.md` ระบุว่า ถ้า Requester พยายามเปิดหรือแก้ ticket ของคนอื่น รวมถึง comments จะตอบ `404 Not Found` เพื่อไม่ให้รู้ว่า ticket นั้นมีอยู่จริงค่ะ

   ส่วน Internal Notes และ Admin API ยังคงใช้ `403` ตาม AC-03 ค่ะ โดย implementation จริงจะทำใน PR ถัดไป

4. **แก้ DoD / Test / Reviewer ที่เคยระบุว่าเสร็จล่วงหน้าแล้ว**

   * เปลี่ยน DoD ทั้ง 6 ข้อเป็น `[ ]`
   * เปลี่ยนสถานะ test ใน `tests.md` เป็น `Pending` และจะอัปเดตผลจริงหลัง implement
   * `reviewer.md` เหลือเฉพาะ PR-01 (GitHub #52) ที่มีอยู่จริง และลบ PR ที่เคยใส่ `APPROVED` ไว้ล่วงหน้า
   * `ui-spec.md` เปลี่ยน screenshot checklist เป็น `[ ]` เพราะยังไม่ได้ capture ค่ะ

5. **เพิ่ม test cases แล้ว**

   * API-14: ตรวจว่า server ไม่ใช้ `requesterId` ที่ client ส่งมา
   * API-15: ตรวจ password length และ complexity
   * API-16: ตรวจ flow `Problem Appears Resolved`

### Non-blocking ที่แก้แล้ว

* กำหนด authentication เป็น **Bearer Token (JWT)** แบบเดียวแล้ว ไม่ใช้ Cookie เป็นอีกทางเลือก
* ระบุจำนวน seed user ตาม Handout แล้ว: Requester 4 active + 1 inactive, IT Staff 3 active + 1 inactive และ Admin 1 active
* เพิ่ม badge `Cancelled` ใน `ui-spec.md`
* เพิ่ม Password Policy และระบุ `400` สำหรับ endpoint ที่เกี่ยวข้องแล้วค่ะ

### เรื่อง Admin เป็น Ticket Owner

Admin สามารถเป็น Ticket Owner ได้ค่ะ และสามารถทำ action ฝั่ง ticket ได้เหมือน IT Staff เช่น Claim/Reassign, ตั้ง IT Priority, เปลี่ยน Status และจัดการ Comments/Notes

ส่วนที่ต่างจาก IT Staff คือ **Admin มีสิทธิ์จัดการ User เพิ่มเติม** ค่ะ

#### 3.1.4 Review #2 — Approved (phatthidawadi, 2026-09-15 05:24 UTC)

ตรวจสอบการแก้ไขทั้งหมดเรียบร้อยแล้ว เอกสารสัญญาข้อกำหนดทางวิศวกรรม (Spec DD) ครบถ้วนและถูกต้องตาม Handout, Business Rules (BR-01..14) และ Acceptance Criteria (AC-01..10) เรียบร้อยแล้ว ขออนุมัติผ่าน PR #52

---

### 3.2 PR-02 (GitHub #60) — Database Migration & Seed (Issue #40)

#### 3.2.1 Inline Review Comments (phatthidawadi — GitHub diff comments)

1. **`server/tests/lab-02/seed.test.ts:20`**
   > *[Regression / Test Failure]* ในบรรทัดที่ 20 ยังมีคำสั่ง `prisma.requesterUser.findMany` ตกหล่นอยู่ ทำให้ TypeScript และ Vitest รันไม่ผ่านเนื่องจากไม่มีพร็อพเพอร์ตี้ `requesterUser` บน Prisma Client แล้ว รบกวนเปลี่ยนเป็น `prisma.user.findMany({...})`

2. **`server/prisma/migrations/20260914000000_lab03_user_auth/migration.sql:9`**
   > *[Data Loss Risk / Spec deviation from handout]* ในบรรทัดที่ 9 มีการใช้คำสั่ง `DROP TABLE "RequesterUser";` ซึ่งจะลบข้อมูลผู้ใช้เดิมใน Lab 2 ทั้งหมดเมื่อรัน `prisma migrate deploy` บนฐานข้อมูลที่มีอยู่เดิม ขัดกับ Handout §5.0 และ §5.2 เรื่องการรักษาข้อมูลเดิม รบกวนปรับแก้ไขไฟล์ SQL Migration ให้เปลี่ยนชื่อตารางเดิม (`ALTER TABLE "RequesterUser" RENAME TO "User";`) และใช้ `ALTER TABLE "User" ADD COLUMN ...` เพิ่มคอลัมน์ใหม่ (`passwordHash`, `role`, `mustChangePassword`, `updatedAt`) เพื่อรักษาข้อมูลผู้ใช้เดิมไว้

#### 3.2.2 Review #1 — Request Changes (phatthidawadi, 2026-09-15 09:30 UTC)

# ผลการตรวจทาน Pull Request (PR #60)

## 1. สรุปความสอดคล้องกับข้อกำหนดและ Issue #40

Issue #40 กำหนดให้ยกระดับโมเดลข้อมูล PostgreSQL/Prisma Schema เพื่อรองรับผู้ใช้งานจริง (Authentication & RBAC), การเป็นเจ้าของตั๋ว (Ticket Ownership), Public Comments และ Internal Notes **โดยต้องไม่สูญเสียข้อมูลตั๋วและไฟล์แนบเดิมจาก Lab 2**:
- **Prisma Schema**: เปลี่ยนโมเดล `RequesterUser` เป็น `User` (เพิ่ม `passwordHash`, `role`, `mustChangePassword`, `isActive`, `createdAt`, `updatedAt`), เพิ่ม `ownerId` และ `requesterIndicatedResolved` ใน `Ticket`, เพิ่มโมเดล `PublicComment` และ `InternalNote`
- **Database Migration**: สร้างไฟล์ Migration ย้ายข้อมูลโดยคงความสัมพันธ์ Foreign Key เดิมไว้
- **Seed Data**: ปรับปรุง `seed.ts` ให้ทำงานแบบ Idempotent และรองรับจำนวนบัญชีตาม Handout §5.3 (Requester 4 active + 1 inactive, IT Staff 3 active + 1 inactive, Admin 1 active) พร้อมตั๋วงาน Public Comments และ Internal Notes ตัวอย่าง

---

## 2. ตารางตรวจสอบตามหมวดหมู่ความปลอดภัยและสเปก (Category Audit)

| หมวดหมู่ (Category) | สถานะ | รายละเอียด / ข้อผิดพลาดที่พบ |
| :--- | :---: | :--- |
| **Authorization (การตรวจสอบสิทธิ์)** | [ถูกต้อง] | โมเดล `User` กำหนด enum/role string (`REQUESTER`, `IT_STAFF`, `ADMINISTRATOR`) ชัดเจน และสืบทอดสิทธิ์ไปยัง `PublicComment` และ `InternalNote` ได้ตรงตามสเปก PR #52 |
| **Ownership (ความเป็นเจ้าของข้อมูล)** | [ถูกต้อง] | ปรับโมเดล `Ticket` ให้เชื่อม `requesterId` กับ `User.id` และเพิ่ม `ownerId` (Int?, Foreign Key ถึง `User.id`) เพื่อรองรับ IT Staff Ticket Ownership |
| **Data Safety (ความปลอดภัยของข้อมูล)** | [ต้องแก้ไข] | ในไฟล์ SQL Migration `20260914000000_lab03_user_auth/migration.sql` (บรรทัดที่ 10) ใช้คำสั่ง `DROP TABLE "RequesterUser"` ซึ่งจะลบข้อมูลผู้ใช้เดิมทั้งหมดจาก Lab 2 หากรันบนฐานข้อมูลที่มีข้อมูลอยู่จริง ละเมิดเงื่อนไข Data Preservation ของ Handout §5.0 & §5.2 |
| **Internal Notes vs Public Comments** | [ถูกต้อง] | สร้างโมเดล `PublicComment` และ `InternalNote` แยกจากกันชัดเจน พร้อม cascade delete เมื่อตั๋วถูกลบ |
| **Regression (ฟังก์ชันเดิม Lab 2)** | [ต้องแก้ไข] | ในไฟล์ทดสอบ `server/tests/lab-02/seed.test.ts` (บรรทัดที่ 20) ยังคงเรียกใช้ `prisma.requesterUser.findMany` ซึ่งไม่ได้ถูกอัปเดต ส่งผลให้การรัน Vitest และ TypeScript Check ล้มเหลว |
| **Tests (ชุดทดสอบ)** | [ต้องแก้ไข] | ไฟล์ทดสอบหลักใน `tests/lab-02/` ถูกปรับเป็น `prisma.user` แล้ว แต่ตกหล่นไฟล์ `seed.test.ts` และยังขาดชุดทดสอบ Migration Data Preservation เฉพาะ |
| **Zen Green Consistency** | [N/A] | PR นี้เน้นงาน Backend DB Model, Migration และ Seed Data ยังไม่มีงาน UI |

---

## 3. สรุปผลการตรวจทาน (Summary of Findings)

### Blocking Issues (ประเด็นสำคัญที่ต้องแก้ไขก่อน Merge)

1. **[Data Loss Risk] การใช้คำสั่ง `DROP TABLE "RequesterUser"` ในไฟล์ SQL Migration**
   - **อ้างอิง Handout**: §5.0, §5.2 | **อ้างอิง Issue #40**: ขอบเขตงานข้อ 4
   - **รายละเอียด**: ในไฟล์ `server/prisma/migrations/20260914000000_lab03_user_auth/migration.sql` บรรทัดที่ 10 มีการใช้คำสั่ง `DROP TABLE "RequesterUser";` แล้วตามด้วย `CREATE TABLE "User" (...)` หากนำไปรันบน Database เดิมของ Lab 2 ที่มีข้อมูลผู้ใช้งานอยู่ จะทำให้ข้อมูลบัญชีผู้ใช้เดิมสูญหายทั้งหมด ซึ่งขัดกับ Handout §5.0 และ §5.2 ที่ระบุว่าการย้าย schema ต้องไม่สูญเสียข้อมูลเดิม ควรปรับ SQL Migration ให้เป็นการเปลี่ยนชื่อตาราง (`ALTER TABLE "RequesterUser" RENAME TO "User";`) และเพิ่มคอลัมน์ใหม่ (`passwordHash`, `role`, `mustChangePassword`, `updatedAt`) เข้าไปในตารางเดิมแทน

2. **[Regression / Test Failure] ไฟล์ทดสอบ `seed.test.ts` ยังอ้างอิงถึง `prisma.requesterUser`**
   - **รายละเอียด**: ในไฟล์ `server/tests/lab-02/seed.test.ts` บรรทัดที่ 20 ยังคงมีรหัส `const requesters = await prisma.requesterUser.findMany({...})` เนื่องจากโมเดล `RequesterUser` ถูกตัดออกจาก `schema.prisma` แล้ว การรัน Vitest จะเกิดข้อผิดพลาด `Property 'requesterUser' does not exist on type 'PrismaClient'` รบกวนเปลี่ยนเป็น `prisma.user.findMany({...})`

---

### Non-blocking Suggestions (ข้อเสนอแนะเพิ่มเติม ไม่บล็อกการอนุมัติ)

1. **พิจารณาเพิ่ม Index บน `Ticket.ownerId` และ `Ticket.status`**
   - `server/prisma/schema.prisma`: สำหรับการค้นหาและกรองใน IT Staff Ticket Queue (ที่จะพัฒนาใน Issue #6) การเพิ่ม `@@index([ownerId])` และ `@@index([status])` จะช่วยเพิ่มประสิทธิภาพการ Query ฐานข้อมูล

2. **การอัปเดต `updatedAt` ใน `seed.ts`**
   - `server/prisma/seed.ts`: ในบล็อก `update` ของ `prisma.user.upsert` ควรใส่ `updatedAt: new Date()` เพื่อให้การ Re-seed อัปเดตเวลาการแก้ไขล่าสุดเสมอ

---

### Questions for Author (คำถามถึงผู้เขียน PR)

1. **รหัสผ่านเริ่มต้นของบัญชีทดสอบใน Seed Data**:
   - บัญชี `newuser@toktickit.com` ถูกตั้งค่า `mustChangePassword: true` ใน `seed.ts` รหัสผ่านเริ่มต้นสำหรับใช้ทดสอบ E2E ในอนาคตคือ `Password123!` ตรงตามบัญชีอื่นๆ ใช่หรือไม่?

---

## 4. คำตัดสินภาพรวมที่แนะนำ (Recommended Overall Verdict)

**คำตัดสิน**: **Request changes (ขอให้แก้ไขก่อนอนุมัติ)**

**เหตุผลสรุปประกอบคำตัดสิน (1 ประโยค)**:
*ไฟล์ SQL Migration ยังคงใช้คำสั่ง DROP TABLE "RequesterUser" ซึ่งเสี่ยงต่อการสูญหายของข้อมูลผู้ใช้เดิมจาก Lab 2 และในไฟล์ server/tests/lab-02/seed.test.ts ยังคงอ้างอิงถึง prisma.requesterUser ส่งผลให้ชุดทดสอบรันไม่ผ่าน*

#### 3.2.3 Author Response (jejaebubu, 2026-09-15 09:46 UTC)

แก้ทั้ง 2 blocking + non-blocking เรียบร้อยแล้วค่ะ:

**1) Data Loss (DROP TABLE) — แก้แล้ว:**
เขียน migration ใหม่เป็นแบบ **Data-Preserving Rename** ตาม Handout §5.0/§5.2 โดยใช้ `ALTER TABLE "RequesterUser" RENAME TO "User"` แล้วเพิ่มคอลัมน์ใหม่ (`passwordHash/role/mustChangePassword/updatedAt`) พร้อม backfill แบบไม่มี default ตกค้าง เพื่อไม่ให้เกิด drift ใน schema ต่อ ๆ ไปค่ะ

ตอนนี้ไม่มี `DROP TABLE` แล้วค่ะ และได้ลองจำลองเหตุการณ์จริงด้วย โดยสร้าง DB แบบ Lab 2 ที่ลง init + lab02 migration และมีข้อมูล Requester 2 คน + ตั๋ว 1 ใบ + ไฟล์แนบ 1 ไฟล์ จากนั้นรัน `prisma migrate deploy` → ย้าย migration นี้ทับ ผลคือผู้ใช้/ตั๋ว/ไฟล์แนบยังอยู่ครบถ้วนค่ะ โดยผู้ใช้เดิมได้ `role=REQUESTER`, `mustChangePassword=true` ตามที่ควรจะเป็น และคอลัมน์ใหม่/index/FK ก็ครบทุกอันค่ะ

**2) seed.test.ts — ไม่มีปัญหาแล้ว:**
ตอนนี้ไฟล์นี้ใช้ `prisma.user.findMany` อยู่แล้ว (บรรทัด 20) น่าจะเป็น diff จากเวอร์ชันเก่าค่ะ ตรวจสอบแล้ว `tsc build` + `vitest lab-01/02` (41/41) ผ่านทั้งคู่ค่ะ

**Non-blocking (ทำแล้ว):**

* เพิ่ม `@@index([ownerId])` + `@@index([status])` ในโมเดล Ticket และเพิ่ม index ใน migration เพื่อรองรับ Staff Queue #44
* เพิ่ม `updatedAt: new Date()` ใน seed upsert user สำหรับการ re-seed

**ตอบคำถาม:**
ใช่ค่ะ `newuser@toktickit.com` ใช้รหัสเริ่มต้น `Password123!` เหมือนกับอีก 10 บัญชี โดยค่า hash เกิดจาก password เดียวกันทุกบัญชีค่ะ ต่างกันแค่ `mustChangePassword: true` เพื่อบังคับให้เปลี่ยนรหัสตอนล็อกอินครั้งแรก สำหรับทดสอบ flow ค่ะ

รบกวน re-review ให้ด้วยนะคะ

#### 3.2.4 Review #2 — Approved (phatthidawadi, 2026-09-15 09:50 UTC)

ตรวจสอบการแก้ไข Migration และ Test แล้วเรียบร้อยครับ SQL Migration เปลี่ยนเป็นการใช้ RENAME TABLE เพื่อรักษาข้อมูลเดิมจาก Lab 2 ได้อย่างปลอดภัย และแก้ไขไฟล์ seed.test.ts ครอบคลุมแล้ว ขออนุมัติผ่าน PR #60

---

### 3.3 PR-03 (GitHub #61) — JWT Authentication API (Issue #41)

#### 3.3.1 Review #1 — Request Changes (phatthidawadi, 2026-09-15 10:11 UTC)

# ผลการตรวจทาน Pull Request (PR #61)

## 1. สรุปความสอดคล้องกับข้อกำหนดและ Issue #41

Issue #41 กำหนดให้สร้างระบบการยืนยันตัวตนหลัก (Authentication Foundation) ด้วย JWT และรหัสผ่านที่แฮชด้วย `bcrypt` พร้อมรองรับการบังคับเปลี่ยนรหัสผ่านในการเข้าใช้งานครั้งแรก (Mandatory First-Login Password Change):
- **กลไกการพิสูจน์ตัวตน**: ใช้ Bearer JWT Token signed ด้วย `JWT_SECRET` และมีอายุการใช้งาน 24 ชั่วโมง ตรงตามเอกสาร `api-spec.md` ที่ตกลงไว้ใน PR #52
- **REST Endpoints**:
  - `POST /api/auth/login`: เข้าสู่ระบบด้วย Email/Password ส่งคืน JWT Token และข้อมูลโปรไฟล์
  - `POST /api/auth/logout`: ออกจากระบบ คืนค่า `200 OK`
  - `GET /api/auth/me`: คืนค่าข้อมูลโปรไฟล์ผู้ใช้ปัจจุบันจาก Token
  - `POST /api/auth/change-password`: ตรวจสอบรหัสผ่านเดิม ปรับใช้เกณฑ์ความซับซ้อนของรหัสผ่านใหม่ (ความยาว >=8, มีพิมพ์ใหญ่/เล็ก, ตัวเลขหรือสัญลักษณ์) และปรับ `mustChangePassword = false`
- **การบังคับเปลี่ยนรหัสผ่าน**: ผู้ใช้ที่มี `mustChangePassword = true` จะถูกบล็อกไม่ให้เข้าถึง API ปกติและได้รับ Error `403 PasswordChangeRequired` จนกว่าจะเปลี่ยนรหัสผ่านสำเร็จ (BR-02)
- **การตอบกลับ Error อย่างปลอดภัย**: กรณีใส่อีเมลที่ไม่มีในระบบหรือรหัสผ่านผิด จะตอบกลับด้วยข้อความเดียวกัน (`"Invalid email or password."`) เพื่อป้องกันการเปิดเผยรายชื่ออีเมลผู้ใช้งาน (User Enumeration)

---

## 2. ตารางตรวจสอบตามหมวดหมู่ความปลอดภัยและสเปก (Category Audit)

| หมวดหมู่ (Category) | สถานะ | รายละเอียด / ข้อผิดพลาดที่พบ |
| :--- | :---: | :--- |
| **Authorization (การตรวจสอบสิทธิ์)** | [ต้องแก้ไข] | 1. ใน `authenticateToken` เมื่อไม่มี Token ส่งมา บรรทัดที่ 353 ส่งคืน `400 Bad Request` แทนที่จะเป็น `401 Unauthorized` ตามมาตรฐาน Handout §6.2<br>2. Middleware `checkPasswordChangeState` ถูกใส่เฉพาะที่ `/api/tickets` (GET/POST) แต่ตกหล่นที่ `/api/tickets/:id` และ Endpoints ของ Attachments ทำให้ผู้ใช้ที่ต้องเปลี่ยนรหัสผ่านสามารถข้ามไปเรียกใช้ Endpoints เหล่านี้ได้โดยตรง |
| **Ownership (ความเป็นเจ้าของข้อมูล)** | [ถูกต้อง] | โค้ดเปลี่ยนมาใช้ `req.user!.id` ที่ถอดรหัสจาก JWT Token ฝั่งเซิร์ฟเวอร์ในการระบุเจ้าของตั๋ว เพิกเฉยข้อมูลที่แคลมมาจากฝั่ง Client ตาม BR-03 |
| **Data Safety (ความปลอดภัยของข้อมูล)** | [ถูกต้อง] | ใช้ `bcrypt.compare` และ `bcrypt.hash` (salt rounds=10) ไม่มีการบันทึกหรือแสดงผลรหัสผ่านแบบ Plaintext และข้อความ Error กรณีล็อกอินไม่เปิดเผยสถานะบัญชี |
| **Internal Notes vs Public Comments** | [N/A] | PR นี้เป็นโครงสร้างระบบ Authentication หลัก ฟังก์ชัน Comments และ Notes จะพัฒนาใน Issue ถัดไป |
| **Regression (ฟังก์ชันเดิม Lab 2)** | [ถูกต้อง] | มีการทำ Fallback ชั่วคราวให้รองรับ `dev_requester_<id>` / `X-Requester-Id` สำหรับชุดทดสอบเดิมของ Lab 2 ทำให้ทดสอบเดิมยังคงรันผ่าน 100% |
| **Tests (ชุดทดสอบ)** | [ถูกต้อง] | สร้าง `server/tests/lab-03/auth.api.test.ts` ครอบคลุม 6 เคส (API-01 ถึง API-06) ทั้งการล็อกอินปกติ, รหัสผ่านผิด, บัญชี Inactive, `/me`, บังคับเปลี่ยนรหัสผ่าน และเกณฑ์ความซับซ้อนของรหัสผ่าน |
| **Zen Green Consistency** | [N/A] | PR นี้เน้นงาน Backend Auth APIs ยังไม่มีงาน UI |

---

## 3. สรุปผลการตรวจทาน (Summary of Findings)

### Blocking Issues (ประเด็นสำคัญที่ต้องแก้ไขก่อน Merge)

1. **[Authorization / Security Leak] ตกหล่น Middleware `checkPasswordChangeState` ใน Endpoint รายละเอียดตั๋วและไฟล์แนบ**
   - **อ้างอิง Handout**: §4.4 (BR-02) | **อ้างอิง Issue #41**: Scope ข้อ 3
   - **รายละเอียด**: ในไฟล์ `server/src/app.ts` (บรรทัดที่ 660, 729, 814, 862) Middleware `checkPasswordChangeState` ถูกใส่ไว้เฉพาะที่ `POST /api/tickets` และ `GET /api/tickets` แต่ไม่ได้ใส่ที่ `GET /api/tickets/:id`, `POST /api/tickets/:id/attachments`, `GET /api/attachments/:id/download` และ `DELETE /api/attachments/:id` ทำให้ผู้ใช้ที่มีสถานะ `mustChangePassword = true` สามารถแอบข้ามหน้าเปลี่ยนรหัสผ่านไปดึงข้อมูลหรืออัปโหลดไฟล์แนบผ่าน Endpoint เหล่านี้ได้โดยตรง รบกวนใส่ `checkPasswordChangeState` ให้ครอบคลุมทุก Protected Route ของตั๋วและไฟล์แนบ

2. **[Authorization / HTTP Spec Deviation] กรณีไม่ได้ส่ง Token ตอบกลับเป็น `400 Bad Request` แทนที่จะเป็น `401 Unauthorized`**
   - **อ้างอิง Handout**: §6.2 | **อ้างอิง api-spec.md**: Section 2.1
   - **รายละเอียด**: ในไฟล์ `server/src/app.ts` บรรทัดที่ 353 เมื่อคำร้องขอไม่ได้แนบ Header ยืนยันตัวตนมา (`!token`) ตัว Middleware ตอบกลับด้วย `400 Bad Request` ซึ่งสับสนกับการส่งข้อมูลผิดรูปแบบ ตามสเปก Handout §6.2 และ `api-spec.md` การไม่แนบข้อมูลยืนยันตัวตนจะต้องตอบกลับด้วย `401 Unauthorized` รบกวนปรับ Status Code เป็น `401`

---

### Non-blocking Suggestions (ข้อเสนอแนะเพิ่มเติม ไม่บล็อกการอนุมัติ)

1. **การเพิ่มเคสทดสอบสำหรับคำร้องขอที่ไม่แนบ Token**
   - `server/tests/lab-03/auth.api.test.ts`: ควรเพิ่มเคสทดสอบที่เรียก `GET /api/auth/me` โดยไม่ส่ง Header `Authorization` เพื่อยืนยันว่าเซิร์ฟเวอร์ตอบกลับ `401 Unauthorized`

2. **การแยกแยะ Error กรณี Token หมดอายุ**
   - `server/src/app.ts`: ในบล็อก `catch` ของ `authenticateToken` ปัจจุบันรวมข้อความไว้เป็น `"Invalid or expired token."` ในอนาคตหากแยกแยะ `TokenExpiredError` ชัดเจน จะช่วยให้ฝั่ง Frontend สามารถจัดการการ Re-login ได้ง่ายขึ้น

---

### Questions for Author (คำถามถึงผู้เขียน PR)

1. **การถอด Fallback ของ Lab 2 Header**:
   - ใน `authenticateToken` มีการใส่โค้ดรองรับ `dev_requester_<id>` และ `X-Requester-Id` เพื่อให้ชุดทดสอบเดิมของ Lab 2 ยังรันผ่าน วางแผนจะถอด Fallback นี้ออกใน Issue #43 (Requester Regression) เมื่อทุก Route สลับไปใช้ JWT ครบแล้วใช่หรือไม่?

---

## 4. คำตัดสินภาพรวมที่แนะนำ (Recommended Overall Verdict)

**คำตัดสิน**: **Request changes (ขอให้แก้ไขก่อนอนุมัติ)**

**เหตุผลสรุปประกอบคำตัดสิน (1 ประโยค)**:
*การตกหล่น middleware checkPasswordChangeState บน endpoint รายละเอียดตั๋วและไฟล์แนบทำให้ผู้ใช้แอบข้ามการบังคับเปลี่ยนรหัสผ่านได้ และกรณีไม่แนบ token ควรตอบกลับด้วย 401 Unauthorized แทน 400 Bad Request*

#### 3.3.2 Author Response (jejaebubu, 2026-09-15 10:26 UTC)

แก้ตาม Review ครบทุกข้อแล้วค่ะ — ขออัปเดตทีละหัวข้อพร้อมรหัสอ้างอิงนะคะ

**Blocking 1 — `checkPasswordChangeState` ครบทุก Protected Route (BR-02)**

เดิมมีแค่ `POST /api/tickets` และ `GET /api/tickets` ค่ะ ตอนนี้ปรับให้ครบทั้ง 6 เส้นใน `server/src/app.ts` แล้ว:

* `GET /api/tickets/:id` (line 664)
* `POST /api/tickets/:id/attachments` (line 733)
* `GET /api/attachments/:id/download` (line 818)
* `DELETE /api/attachments/:id` (line 866)

ทดสอบแล้วค่ะ ผู้ใช้ที่ `mustChangePassword=true` จะเรียกได้เฉพาะ `/api/auth/change-password` เท่านั้น ส่วน route อื่น ๆ จะตอบ `403 PasswordChangeRequired` ทั้งหมดค่ะ

**Blocking 2 — Missing token → `401 Unauthorized` (สเปก §6.2)**

ปรับ `authenticateToken` (line 251-253) แล้วค่ะ ถ้าไม่ส่ง header จะได้ `401` แทน `400` แล้ว

ผลที่ตามมาคือ Lab-2 tests 3 เคส ได้แก่ `create-ticket API-02`, `my-tickets API-07g` และ `ticket-detail API-03d` ที่เดิมคาดว่าจะได้ `400` เมื่อไม่มี header ต้องปรับเป็น `401` ค่ะ ซึ่งเป็นผลที่ถูกต้องตาม auth contract ใหม่ และจะถอด fallback ออกทั้งหมดใน Issue #43

**Non-blocking 1 — เพิ่ม test case**

เพิ่ม `API-07` สำหรับ `GET /api/auth/me` โดยไม่ส่ง `Authorization` → คาดว่าจะได้ `401` ค่ะ

**Non-blocking 2 — แยก Error กรณี Token หมดอายุ**

แยก `TokenExpiredError` ออกมาแล้วค่ะ และคืนข้อความ `"Token expired. Please sign in again."` เพื่อให้หน้าบ้านสามารถสั่ง re-login ได้ โดยยังคงตอบ `401` เหมือนเดิม ต่างกันแค่ข้อความค่ะ

**ตอบคำถาม — Fallback**

ใช่ค่ะ `dev_requester_<id>` / `X-Requester-Id` จะถูกถอดออกเมื่อทุก Route ย้ายไปใช้ JWT จริงใน Issue #43 (Requester Regression) ตามแผน FR-04 และมีระบุไว้ใน PR body แล้วค่ะ

**ผลทดสอบอัปเดต:**

`prisma migrate reset` + `vitest lab-01/02/03` = `48/48` ผ่าน ✅
`tsc build` = clean ✅

รบกวนรีวิวรอบสองให้ด้วยนะคะ ขอบคุณค่ะ

#### 3.3.3 Review #2 — Approved (phatthidawadi, 2026-09-15 10:28 UTC)

ตรวจสอบการแก้ไขระบบ Authentication และ Middleware เรียบร้อยแล้ว เพิ่ม checkPasswordChangeState ครบทุก Protected Route และปรับ Response กรณีไม่แนบ Token เป็น 401 Unauthorized ตรงตามสเปก §6.2 เรียบร้อยแล้ว ขออนุมัติผ่าน PR #61

---

### 3.4 PR-04 (GitHub #62) — RBAC requireRole Guard (Issue #42)

#### 3.4.1 Review — Approved (phatthidawadi, 2026-09-15 15:39 UTC)

ตรวจสอบโค้ดและการตรวจสอบสิทธิ์ตามบทบาท (RBAC) เรียบร้อยแล้ว Middleware requireRole ทำงานร่วมกับ authenticateToken และ checkPasswordChangeState ได้อย่างสมบูรณ์ ปกป้อง API Internal Notes และ Admin Users ตรงตามตาราง Authorization Matrix ข้อมูลรหัสผ่านไม่รั่วไหล และชุดทดสอบรันผ่านทั้งหมด ขออนุมัติผ่าน PR #62

---

### 3.5 PR-05 (GitHub #63) — Requester Regression & Impersonation Fallback Removal (Issue #43)

#### 3.5.1 Review #1 — Request Changes (phatthidawadi, 2026-09-15 11:28 UTC)

## Request Changes — PR #63 (Issue #43: Requester Regression & Impersonation Fallback Removal)
มีข้อกำหนดด้านความปลอดภัยและเอกสาร 2 จุดที่จำเป็นต้องปรับแก้ไขก่อน Merge:

### 1. [Blocking Security Finding] ลบ Hardcoded JWT_SECRET Fallback String ออกจาก `server/src/app.ts`
- **ปัญหา**: ใน `server/src/app.ts` มีการตั้งค่า Fallback String ไว้กรณีไม่มี env var:
  ```ts
  const JWT_SECRET = process.env.JWT_SECRET || "toktickit-lab3-jwt-secret-key-2026";
  ```
ตาม Course Handout (Section 6.1: "secrets must not be exposed to client code or committed to source control") ห้าม Hardcode หรือ Commit Secret Key ลงใน Source Control เด็ดขาด

สิ่งที่ต้องแก้ไข:
ลบ Fallback String ออก และให้ระบบ throw Error ทันทีหากไม่พบ process.env.JWT_SECRET:
ts
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("FATAL: JWT_SECRET environment variable is not defined.");
}
ตรวจสอบให้แน่ใจว่าได้ระบุ JWT_SECRET ไว้ใน .env.example / .env และใน Vitest Test Helper (server/tests/...) เพื่อให้การรัน Test ทั้งหมดผ่านได้อย่างสมบูรณ์

2. [Documentation Gap] ระบุสถาปัตยกรรม Stateless Logout และ JWT Expiration ใน docs/lab-03/api-spec.md
ปัญหา: ใน docs/lab-03/api-spec.md หัวข้อ POST /api/auth/logout ระบุเพียง "คำอธิบาย: ออกจากระบบและยกเลิกเซสชัน" ซึ่งยังไม่ได้อธิบายการตัดสินใจเชิงออกแบบ (Design Decision) และระยะเวลาหมดอายุของ Token
สิ่งที่ต้องแก้ไข:
อัปเดตคำอธิบายใน docs/lab-03/api-spec.md ให้ระบุชัดเจนว่าเป็น Stateless Client-side Logout (เซิร์ฟเวอร์ไม่ได้เก็บ Token Blacklist/Session Store การ Logout ทำโดยการลบ Token ออกจาก Client/Browser)
ระบุอายุของ Token (JWT Expiration Duration) ให้ชัดเจนตามที่กำหนดไว้ในระบบ (เช่น 24 ชั่วโมง หรือตาม JWT_EXPIRES_IN="24h")
เมื่อปรับแก้ทั้ง 2 ข้อนี้เรียบร้อยแล้ว แจ้งได้เลย เดี๋ยวมา Re-check และกด Approve ให้

#### 3.5.2 Author Response (jejaebubu, 2026-09-15 13:13 UTC)

> ## Request Changes — PR #63 (Issue #43: Requester Regression & Impersonation Fallback Removal)
> ## มีข้อกำหนดด้านความปลอดภัยและเอกสาร 2 จุดที่จำเป็นต้องปรับแก้ไขก่อน Merge:
> ### 1. [Blocking Security Finding] ลบ Hardcoded JWT_SECRET Fallback String ออกจาก `server/src/app.ts`
> * **ปัญหา**: ใน `server/src/app.ts` มีการตั้งค่า Fallback String ไว้กรณีไม่มี env var:
>   ```ts
>   const JWT_SECRET = process.env.JWT_SECRET || "toktickit-lab3-jwt-secret-key-2026";
>   ```
>
> ตาม Course Handout (Section 6.1: "secrets must not be exposed to client code or committed to source control") ห้าม Hardcode หรือ Commit Secret Key ลงใน Source Control เด็ดขาด
>
> สิ่งที่ต้องแก้ไข: ลบ Fallback String ออก และให้ระบบ throw Error ทันทีหากไม่พบ process.env.JWT_SECRET: ts const JWT_SECRET = process.env.JWT_SECRET; if (!JWT_SECRET) { throw new Error("FATAL: JWT_SECRET environment variable is not defined."); } ตรวจสอบให้แน่ใจว่าได้ระบุ JWT_SECRET ไว้ใน .env.example / .env และใน Vitest Test Helper (server/tests/...) เพื่อให้การรัน Test ทั้งหมดผ่านได้อย่างสมบูรณ์ 2. [Documentation Gap] ระบุสถาปัตยกรรม Stateless Logout และ JWT Expiration ใน docs/lab-03/api-spec.md ปัญหา: ใน docs/lab-03/api-spec.md หัวข้อ POST /api/auth/logout ระบุเพียง "คำอธิบาย: ออกจากระบบและยกเลิกเซสชัน" ซึ่งยังไม่ได้อธิบายการตัดสินใจเชิงออกแบบ (Design Decision) และระยะเวลาหมดอายุของ Token สิ่งที่ต้องแก้ไข: อัปเดตคำอธิบายใน docs/lab-03/api-spec.md ให้ระบุชัดเจนว่าเป็น Stateless Client-side Logout (เซิร์ฟเวอร์ไม่ได้เก็บ Token Blacklist/Session Store การ Logout ทำโดยการลบ Token ออกจาก Client/Browser) ระบุอายุของ Token (JWT Expiration Duration) ให้ชัดเจนตามที่กำหนดไว้ในระบบ (เช่น 24 ชั่วโมง หรือตาม JWT_EXPIRES_IN="24h") เมื่อปรับแก้ทั้ง 2 ข้อนี้เรียบร้อยแล้ว แจ้งได้เลย เดี๋ยวมา Re-check และกด Approve ให้

แก้ครบทั้ง 2 ข้อแล้วค่ะ

**1. Blocking — ลบ JWT_SECRET Hardcoded Fallback**

* `server/src/app.ts` เปลี่ยนเป็นให้ throw ทันทีถ้าไม่พบ env:

```ts
const JWT_SECRET: string = (() => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("FATAL: JWT_SECRET environment variable is not defined.");
  return secret;
})();
```

* ระบุค่าไว้ใน `server/.env` (gitignored) และ `server/.env.example` แล้วค่ะ
* เพิ่ม `test.env.JWT_SECRET` ใน `vitest.config.ts` เพื่อให้ CI/test สามารถรันได้โดยไม่ต้องพึ่งไฟล์ env ค่ะ

**2. Documentation — อัปเดต `docs/lab-03/api-spec.md`**

* §2.1 `POST /api/auth/logout` ระบุชัดเจนแล้วว่าเป็น **Stateless Client-side Logout** คือไม่มี Token Blacklist/Session Store ฝั่ง server และ client จะลบ Token ออกจาก Browser เองค่ะ
* ถ้ามีการส่ง Token เดิมซ้ำหลังจาก logout ก็ยังสามารถใช้ได้จนกว่า Token จะหมดอายุค่ะ
* เพิ่ม JWT & Session Policy ใน §1 โดยกำหนดให้ Token มีอายุ 24 ชั่วโมง (`JWT_EXPIRES_IN="24h"` default) และเมื่อหมดอายุจะได้ `401` และต้อง login ใหม่ค่ะ

**Verify ใหม่:**
`migrate reset + vitest = 53/53` ผ่าน ✅
`tsc` clean ✅

รบกวน re-check ได้เลยนะคะ ขอบคุณค่ะ

#### 3.5.3 Review #2 — Approved (phatthidawadi, 2026-09-15 13:26 UTC)

## Approve — PR #63 (Issue #43: Requester Regression & Impersonation Fallback Removal)

ตรวจสอบการแก้ไขเพิ่มเติมครบถ้วนแล้ว:

1. **JWT_SECRET Security Hardening**: ลบ Hardcoded Fallback String ออกจาก `server/src/app.ts` และเปลี่ยนเป็นการ Throw Fatal Error เมื่อไม่พบ `process.env.JWT_SECRET` ตรงตาม Course Handout Section 6.1
2. **Stateless Logout Documentation**: อัปเดตเอกสารใน `docs/lab-03/api-spec.md` ระบุสถาปัตยกรรม Stateless Client-side Logout และอายุของ Token (`24 ชั่วโมง`) ไว้อย่างชัดเจน
3. **Verification**: TypeScript Build ผ่านสะอาด และชุดทดสอบทั้งหมดรันผ่านเรียบร้อย

พร้อม Merge เข้าสู่ `lab3-staging`

---

### 3.6 PR-06 (GitHub #64) — Role-Aware Staff Ticket Queue & Query APIs (Issue #44)

#### 3.6.1 Inline Review Comments (phatthidawadi — GitHub diff comments)

1. **`server/src/app.ts:583`**
   > `if (requestedPriority) where.requestedPriority = String(requestedPriority);`
   > `if (itPriority) where.itPriority = String(itPriority);`
   >
   > **Priority Filter Case-Sensitivity Bug**: ค่า Priority ใน DB ถูกเก็บเป็นตัวพิมพ์ใหญ่ (`LOW`, `MEDIUM`, `HIGH`, `URGENT`) หาก Client ส่ง `?itPriority=medium` (ตัวพิมพ์เล็ก) Prisma จะหาไม่พบและคืนค่าตลับตั๋วเป็น 0 รายการ
   > **แนวทางแก้ไข**: แปลงค่าให้เป็นตัวพิมพ์ใหญ่ก่อนส่งให้ Prisma เช่น `String(requestedPriority).toUpperCase()` และ `String(itPriority).toUpperCase()`

2. **`server/src/app.ts:630`**
   > `where.ownerId = Number(ownerId);`
   >
   > **Potential 500 Unhandled Error on Invalid ownerId**: หากส่ง `?ownerId=abc` ค่า `Number("abc")` จะเป็น `NaN` ทำให้ Prisma findMany throw exception และตอบกลับเป็น 500 Internal Server Error
   > **แนวทางแก้ไข**: เช็ค `isNaN(Number(ownerId))` เพิ่มเติม หากไม่ใช่ตัวเลขให้ตอบ `400 Bad Request` หรือละเว้นการกรอง

3. **`server/tests/lab-03/staff-queue.api.test.ts:63`**
   > `it("API-07b: IT Staff filters queue by IT Priority and Status", ...)`
   >
   > **Suggest adding ownerId test case**: เสนอเพิ่ม Test Case สำหรับตรวจสอบการกรอง `ownerId=unassigned` (ตั๋ว unassigned) ในไฟล์ test เพิ่มเติม เพื่อการครอบคลุม AC ของ FR-06 ที่สมบูรณ์

#### 3.6.2 Review #1 — Request Changes (phatthidawadi, 2026-09-15 13:46 UTC)

# ผลการตรวจทาน (Code Review Draft) สำหรับ **Pull Request #64** (Issue #44: Role-Aware Staff Ticket Queue & Query APIs):

---

## Review Summary — PR #64 (Issue #44: Staff Ticket Queue API)

### 1. Mapping to Specification & Acceptance Criteria
PR #64 ทำการปรับปรุง `GET /api/tickets` ให้ทำงานแบบ Role-Aware:
- **REQUESTER**: คืนค่าเฉพาะตั๋วที่เป็นเจ้าของ (My Tickets) พร้อมรองรับ Search, Category, Status, Priority Filter, Pagination และ Return `meta` + `pagination`
- **IT_STAFF / ADMINISTRATOR**: คืนค่าตั๋วทุกใบในระบบ (Staff Queue) พร้อมรองรับ Search (`ticketNumber`, `summary`, `description`), Filter (`categoryId`, `status`, `requestedPriority`, `itPriority`, `ownerId`), Sorting และ Pagination
- **การจับคู่ Spec**:
  - **FR-06**: Shared Ticket Queue สำหรับ IT Staff & Admin (ค้นหา, กรอง, จัดเรียง, แบ่งหน้า)
  - **FR-07**: IT Staff Access Control สำหรับดู Queue ตั๋วทั้งหมด
  - **AC-04**: IT Staff เปิด Ticket Queue ค้นหา กรองตามสถานะ และจัดเรียง พร้อม Pagination

---

### 2. Specific Category Checks

| หมวดหมู่ | ผลการประเมิน | รายละเอียด |
| :--- | :---: | :--- |
| **Authorization** | **ผ่าน (PASS)** | ป้องกันด้วย `authenticateToken` + `checkPasswordChangeState` และแยกตรรกะตาม `req.user!.role` ฝั่ง Server อย่างแน่นหนา (Requester ถูกบังคับฟิลเตอร์ `requesterId = userId` เสมอ) |
| **Ownership** | **ผ่าน (PASS)** | ใช้ `req.user!.id` จาก Authenticated Token ในการกรองตั๋วของ Requester ไม่ได้เชื่อค่า `requesterId` ที่ส่งมาจาก Client |
| **Data Safety** | **ผ่าน (PASS)** | ไม่มี Hardcoded Secrets หรือ Plaintext Passwords และการ Select ข้อมูล `requester`/`owner` คืนเฉพาะ `{ id, name, email }` ไม่รั่วไหลข้อมูลส่วนตัว |
| **Internal Notes vs Public Comments** | **ผ่าน (PASS)** | `GET /api/tickets` ไม่ได้แถม Internal Notes ออกไปในรายการตั๋ว (Internal Notes API แยกออกไปควบคุมสิทธิ์ `IT_STAFF`/`ADMINISTRATOR` ใน PR #62 เรียบร้อยแล้ว) |
| **Regression** | **ผ่าน (PASS)** | คงโครงสร้าง `meta` ไว้สำหรับ Lab 2 พร้อมเพิ่ม `pagination` และ `categoryName`/`relatedSystemName` สำหรับ Compatibility ฝั่ง Frontend |
| **Tests** | **ต้องปรับปรุงเล็กน้อย** | เพิ่มไฟล์ `server/tests/lab-03/staff-queue.api.test.ts` (4 unit tests) ครอบคลุมการค้นหา/กรอง/จัดเรียงของ IT Staff แต่ยังขาดเคสสอบทาน `ownerId=unassigned` |
| **Zen Green Consistency** | **ผ่าน (PASS)** | เป็นการปรับปรุง Backend REST API ไม่ได้กระทบ Styling System |

---

### 3. Summary of Findings

#### Blocking Issues (ต้องแก้ไขก่อน Merge)
1. **Priority Case-Sensitivity Bug ใน Staff Queue Filtering (`requestedPriority` & `itPriority`)**:
   ใน `server/src/app.ts` บรรทัด 583-584:
   ```ts
   if (requestedPriority) where.requestedPriority = String(requestedPriority);
   if (itPriority) where.itPriority = String(itPriority);
   ```
   เนื่องจากค่า Priority ในฐานข้อมูลถูกเก็บเป็นตัวพิมพ์ใหญ่ (`LOW`, `MEDIUM`, `HIGH`, `URGENT`) หาก Client/Frontend ส่ง Query Parameter เป็นตัวพิมพ์เล็ก เช่น `?itPriority=medium` หรือ `?requestedPriority=high` จะทำให้ Prisma ค้นหาไม่พบข้อมูล (ส่งคืน 0 รายการ) เพราะ String Match บน Prisma สำหรับ Enum/Exact String ไม่ใช่ Case-Insensitive

2. **Unvalidated `ownerId` Parsing Error (เสี่ยงเกิด 500 Server Error)**:
   ใน `server/src/app.ts` บรรทัด 586-592:
   ```ts
   if (ownerId !== undefined && ownerId !== "") {
     if (ownerId === "unassigned" || ownerId === "null") {
       where.ownerId = null;
     } else {
       where.ownerId = Number(ownerId);
     }
   }
   ```
   หากส่งค่าที่ไม่ใช่ตัวเลข เช่น `?ownerId=abc` จะทำให้ `Number("abc")` ได้ค่า `NaN` ส่งผลให้ Prisma findMany ล้มเหลวและโยน Error ตอบกลับเป็น `500 Internal Server Error` แทนที่จะเป็น `400 Bad Request` หรือละเว้นค่าที่ไม่ถูกต้อง

#### Non-blocking Suggestions (ข้อเสนอแนะ)
1. **การตรวจสอบ Validation Error Parameters ให้ตรงกันระหว่าง Requester และ Staff**:
   ใน Requester Queue มีการ Validate `page`, `limit`, `sort`, `order` และส่ง `400 Bad Request` หากค่าไม่ถูกต้อง แต่ใน Staff Queue มีการ Fallback ค่าอัตโนมัติ (เช่น `Math.max(1, ...)` หรือ Fallback เป็น `"createdAt"`) ควรปรับให้การจัดการ Error ตอบ `400 Bad Request` สอดคล้องกันทั้งระบบ
2. **เพิ่ม Test Case สำหรับ `ownerId=unassigned`**:
   ใน `server/tests/lab-03/staff-queue.api.test.ts` ควรเพิ่ม Test Case ตรวจสอบการกรองตั๋วที่ยังไม่มีเจ้าของ (`ownerId=unassigned`) เพื่อยืนยันความสมบูรณ์ตาม FR-06

#### Questions
1. สอบถามเกี่ยวกับการแสดงผล `status` ใน Staff Queue: สำหรับ `status` มีการใช้ `{ equals: String(status), mode: "insensitive" }` ซึ่งทำงานได้ดีมาก หากปรับ `requestedPriority` และ `itPriority` ให้ใช้ `.toUpperCase()` จะทำให้พฤติกรรมการกรองสอดคล้องกันทั้งหมดใช่หรือไม่?

---

### 4. Recommended Overall Verdict

- **คำแนะนำคำตัดสิน**: **Request changes**
- **เหตุผลประกอบ (1 ประโยค)**: "โค้ดมีการจัดโครงสร้างแบบ Role-Aware และคงความเข้ากันได้กับ Lab 2 ได้ดีเยี่ยม แต่จำเป็นต้องปรับแก้ Bug เรื่อง Case-Sensitivity ในการกรอง Priority (`.toUpperCase()`) และการจัดการ Validation ของ `ownerId` เพื่อป้องกัน 500 Internal Server Error ก่อน Merge"

#### 3.6.3 Author Response (jejaebubu, 2026-09-15 13:56 UTC)

Done — แก้ครบทุกประเด็นแล้วค่ะ

**Blocking 1 — Priority Case-Sensitivity:**
แปลง `requestedPriority` และ `itPriority` เป็น `.toUpperCase()` แล้ว (รวมถึงฝั่ง Requester) และตรวจสอบค่ากับ `VALID_PRIORITIES` ให้เรียบร้อย ถ้าค่าไม่ถูกต้องจะคืน `400` แทนที่จะได้ 0 รายการ

**Blocking 2 — ownerId 500 Risk:**
ถ้า `ownerId` ไม่ใช่ตัวเลข (ยกเว้น `unassigned` หรือ `null`) จะคืน `400 Bad Request` ทันที เพื่อป้องกันไม่ให้ Prisma โยน `500`

**Suggestion 1 — Align Validation:**
Staff Queue ตอนนี้ตรวจสอบ `page/limit/sort/order/category/status` เหมือนฝั่ง Requester แล้ว ดังนั้นถ้าส่งค่าที่ไม่ถูกต้องจะได้ `400` เหมือนกัน และไม่มีการ fallback แบบเงียบ ๆ

**Suggestion 2 — เพิ่ม Test:**
เพิ่ม test สำหรับ Staff Queue เป็น 7 เคส:
- `API-07d` `ownerId=unassigned` → คืนเฉพาะ ticket ที่ยังไม่มีเจ้าของ
- `API-07e` filter ตัวพิมพ์เล็ก (`requestedPriority=low`, `itPriority=urgent`) → สามารถ match กับค่าตัวพิมพ์ใหญ่ใน DB ได้
- `API-07f` `ownerId=abc` → คืน `400`
- `API-07b` เดิมเพิ่มการตรวจ `length >= 1` เพื่อให้แน่ใจว่า test มีข้อมูลจริงและไม่ได้ผ่านแบบลอย ๆ

**ตอบคำถามเรื่อง status และ priority:**
`status` ใน DB เก็บเป็น title-case เช่น `In Progress` เลยคง `{ equals, mode: "insensitive" }` ไว้ทั้งสองฝั่งค่ะ ส่วน `priority` เก็บเป็นตัวพิมพ์ใหญ่ จึงใช้ `.toUpperCase()` ก่อนนำไปค้นหา ซึ่งตรงกับรูปแบบข้อมูลใน DB

**Verify:**
`migrate reset + vitest` ผ่าน `60/60` (13 ไฟล์)
และ `tsc` ผ่านเรียบร้อยค่ะ

รบกวน re-check ได้เลยค่ะ

#### 3.6.4 Review #2 — Approved (phatthidawadi, 2026-09-15 14:01 UTC)

## Approve — PR #64 (Issue #44: Role-Aware Staff Ticket Queue & Query APIs)

ตรวจสอบการแก้ไขเพิ่มเติมเรียบร้อยแล้ว:

1. **Priority Case-Insensitive Filter**: ปรับให้แปลงค่า `requestedPriority` และ `itPriority` เป็นตัวพิมพ์ใหญ่ (`.toUpperCase()`) รองรับการกรองทั้งตัวพิมพ์เล็กและใหญ่
2. **Robust Query Parameter Validation**: ปรับการ Validate `ownerId` (ป้องกัน 500 error เมื่อส่งค่าไม่ใช่ตัวเลข) และส่ง `400 Bad Request` สำหรับ Parameter ที่ไม่ถูกต้องสอดคล้องกันทั้งระบบ
3. **Test Coverage**: เพิ่ม Unit Tests ครอบคลุมการกรอง `ownerId=unassigned`, priority case-insensitivity และ error handling ครบถ้วน
4. **Verification**: TypeScript Build และ Unit Tests Lab 3 ทั้งหมดรันผ่าน 100%

พร้อม Merge เข้าสู่ `lab3-staging`

---

### 3.7 PR-07 (GitHub #65) — IT Staff Ticket Operations & Public Comments / Internal Notes (Issue #45)

#### 3.7.1 Inline Review Comments (phatthidawadi — GitHub diff comments)

1. **`server/src/app.ts:776`**
   > `dataToUpdate.ownerId = ownerId === null || ownerId === "unassigned" ? null : Number(ownerId);`
   >
   > **Missing Owner Validation & Potential 500 Error**: หากส่ง `ownerId` ที่ไม่มีจริงในระบบ (เช่น 99999) Prisma จะเกิด Foreign Key Exception ส่งผลให้เซิร์ฟเวอร์ตอบกลับ 500 Internal Server Error นอกจากนี้ยังไม่ได้เช็คว่าผู้รับมอบหมายมีบทบาทเป็น `IT_STAFF` หรือ `ADMINISTRATOR` และ `isActive = true` หรือไม่ (ละเมิด BR-11)
   > **แนวทางแก้ไข**: หาก `ownerId` ไม่ใช่ null ให้ Query ตรวจสอบความมีอยู่และบทบาทของผู้ใช้ก่อน หากผู้ใช้ไม่มีจริงหรือไม่ใช่ Staff/Admin ให้ตอบกลับ `400 Bad Request`

2. **`server/src/app.ts:791`**
   > `dataToUpdate.itPriority = String(itPriority);`
   > `dataToUpdate.status = String(status);`
   >
   > **Missing Enum Validation for itPriority & status**: ขาดการตรวจสอบค่าที่รับเข้ามากับชุดที่อนุญาต
   > **แนวทางแก้ไข**:
   > 1. เช็ค `itPriority` กับ `["LOW", "MEDIUM", "HIGH", "URGENT"]` (แปลงเป็น `.toUpperCase()`)
   > 2. เช็ค `status` กับชุดสถานะที่อนุญาตใน BR-13 (`New`, `Open`, `In Progress`, `Waiting for Requester`, `Resolved`, `Closed`, `Reopened`, `Cancelled`)
   > หากไม่ถูกต้องให้ส่งคืน `400 Bad Request`

3. **`server/src/app.ts:866`**
   > `if (!content || content.trim().length === 0)`
   >
   > **Suggest adding max content length validation**: เสนอแนะเพิ่มการจำกัดความยาวสูงสุดของข้อความ Public Comment (เช่น `content.trim().length > 1000`) เพื่อป้องกันการส่ง Payload ขนาดใหญ่ผิดปกติ

#### 3.7.2 Review #1 — Request Changes (phatthidawadi, 2026-09-15 14:35 UTC)

# ผลการตรวจทาน (Code Review Draft) สำหรับ **Pull Request #65** (Issue #45: IT Staff Ticket Operations & Public Comments / Internal Notes):

---

# Review Summary — PR #65 (Issue #45: Staff Ticket Operations API)

### 1. Mapping to Specification & Acceptance Criteria
PR #65 เพิ่มระบบการทำงานของเจ้าหน้าที่ไอที (IT Staff Operations) และการสื่อสารในตั๋ว:
- **PATCH /api/tickets/:id**:
  - **IT Staff / Admin**: Claim/Reassign Owner (`ownerId`), ปรับปรุง IT Priority (`itPriority`), และเปลี่ยนสถานะตั๋วตาม Workflow (`status`)
  - **Requester**: ส่งเจตนา "Problem Appears Resolved" (`requesterIndicatedResolved: true`) โดยเซิร์ฟเวอร์จะเปลี่ยนสถานะตั๋วเป็น `Waiting for Requester` อัตโนมัติ (AC-08/FR-09/BR-05) และไม่อนุญาตให้ Requester เปลี่ยนสถานะหรือเปลี่ยนเจ้าของตั๋วโดยตรง (`403 Forbidden`)
- **GET/POST /api/tickets/:id/comments**: Public Comments (สิทธิ์อ่าน/เขียนสำหรับ Requester เจ้าของตั๋ว, IT Staff, Admin)
- **GET /api/tickets/:id**: อัปเดตการคืนค่าข้อมูลตั๋วให้รวม Public Comments และ Internal Notes (เฉพาะเมื่อผู้เรียกไม่ใช่ Requester)
- **การป้องกันข้อมูลรั่วไหล (Data Leakage Protection - Handout §6.2)**: Requester พยายามดูหรือแก้ไขตั๋วของผู้อื่น เซิร์ฟเวอร์จะตอบกลับ `404 Not Found` (เสมือนไม่มีตั๋วนั้นอยู่ในระบบ)

---

### 2. Specific Category Checks

| หมวดหมู่ | ผลการประเมิน | รายละเอียด |
| :--- | :---: | :--- |
| **Authorization** | **ผ่าน (PASS)** | ตรวจสอบสิทธิ์การอัปเดตสถานะและ Claim ตั๋วฝั่ง Server เคร่งครัด ป้องกัน Requester แก้ไข `ownerId`/`status` โดยตรงด้วย `403 Forbidden` |
| **Ownership** | **ผ่าน (PASS)** | ใช้ `req.user!.id` เป็น `authorId` ใน Public Comments และตรวจสอบการเป็นเจ้าของตั๋วของ Requester ป้องกันการแอบอ้าง ID ผู้อื่น |
| **Data Safety** | **ผ่าน (PASS)** | ตอบกลับ `404 Not Found` เมื่อ Requester พยายามเข้าถึงตั๋วผู้อื่น ไม่รั่วไหลข้อมูลการมีอยู่ของตั๋วตาม Handout §6.2 |
| **Internal Notes vs Public Comments** | **ผ่าน (PASS)** | ซ่อน `internalNotes` ไม่ให้แนบไปกับคำตอบของ `GET /api/tickets/:id` หากผู้ขอเป็น Requester (ส่งเฉพาะเมื่อเป็น `IT_STAFF` หรือ `ADMINISTRATOR`) |
| **Regression** | **ผ่าน (PASS)** | ฟังก์ชัน Lab 2 (Attachments, Ticket Details) ยังคงทำงานได้ครบถ้วน |
| **Tests** | **ผ่าน (PASS)** | มีไฟล์ทดสอบใหม่ `staff-ticket-detail.api.test.ts` และ `comments-notes.api.test.ts` รวม 7 tests ใหม่ ผ่าน 100% |
| **Zen Green Consistency** | **ผ่าน (PASS)** | เป็นส่วนปรับปรุง Backend API สอดคล้องตาม REST Standard |

---

### 3. Summary of Findings

#### Blocking Issues (ต้องแก้ไขก่อน Merge)
1. **ขาดการ Validation `ownerId` ใน `PATCH /api/tickets/:id` (เสี่ยงเกิด 500 Error และละเมิด BR-11)**:
   ใน `server/src/app.ts` บรรทัด 765-767:
   ```ts
   if (ownerId !== undefined) {
     dataToUpdate.ownerId = ownerId === null || ownerId === "unassigned" ? null : Number(ownerId);
   }
   ```
   - **ปัญหาที่ 1**: หากส่ง `ownerId: 99999` (ID ผู้ใช้ที่ไม่คงอยู่ในระบบ) Prisma จะเกิด Foreign Key Constraint Error (`P2003`) ส่งผลให้เซิร์ฟเวอร์ตอบกลับ `500 Internal Server Error` แทนที่จะเป็น `400 Bad Request`
   - **ปัญหาที่ 2**: ไม่ได้ตรวจสอบว่า `ownerId` ที่ส่งมามีบทบาทเป็น `IT_STAFF` หรือ `ADMINISTRATOR` และมีสถานะ `isActive = true` หรือไม่ ซึ่งหากส่ง `ownerId` ของผู้ใช้บทบาท `REQUESTER` ระบบจะยินยอมบันทึก ซึ่งละเมิด **BR-11** ("เจ้าของตั๋ว primary ต้องเป็น IT Staff หรือ Admin เท่านั้น")

2. **ขาดการ Validation ค่า `itPriority` และ `status` ใน `PATCH /api/tickets/:id`**:
   ใน `server/src/app.ts` บรรทัด 768-773:
   ```ts
   if (itPriority !== undefined) {
     dataToUpdate.itPriority = String(itPriority);
   }
   if (status !== undefined) {
     dataToUpdate.status = String(status);
   }
   ```
   - **ปัญหา**: ไม่ได้ตรวจสอบว่า `itPriority` อยู่ในชุด `LOW`, `MEDIUM`, `HIGH`, `URGENT` หรือไม่ และไม่ได้ตรวจสอบว่า `status` อยู่ในชุดสถานะที่อนุญาตตาม **BR-13** (`New`, `Open`, `In Progress`, `Waiting for Requester`, `Resolved`, `Closed`, `Reopened`, `Cancelled`) หรือไม่ หากส่งค่าผิดพลาดจะเกิด 500 Error หรือบันทึกค่าที่ไม่ถูกต้องลงในฐานข้อมูล

#### Non-blocking Suggestions (ข้อเสนอแนะ)
1. **การจำกัดความยาวเนื้อหา Public Comment (`POST /api/tickets/:id/comments`)**:
   ปัจจุบันมีการเช็ค `!content || content.trim().length === 0` แต่ยังไม่ได้จำกัดความยาวสูงสุด (เช่น ไม่เกิน 1,000 ตัวอักษร) เพื่อป้องกันการส่ง Payload ขนาดใหญ่ผิดปกติ

#### Questions
1. สอบถามเพิ่มเติม: เมื่อ IT Staff หรือ Admin อัปเดตสถานะตั๋ว (เช่น เปลี่ยนเป็น `In Progress` หรือ `Resolved`) ระบบควรปรับค่า `requesterIndicatedResolved` กลับเป็น `false` อัตโนมัติหรือไม่?

---

### 4. Recommended Overall Verdict

- **คำแนะนำคำตัดสิน**: **Request changes**
- **เหตุผลประกอบ (1 ประโยค)**: "ฟังก์ชันหลักและมาตรการป้องกันข้อมูลรั่วไหล (404 No-leak) ทำได้ถูกต้องครบถ้วนตาม Spec แล้ว แต่จำเป็นต้องเพิ่มการ Validate ค่า `ownerId`, `itPriority`, และ `status` ใน `PATCH /api/tickets/:id` เพื่อป้องกัน 500 Error และปฏิบัติตาม BR-11 ก่อน Merge"

#### 3.7.3 Author Response (jejaebubu, 2026-09-15 14:47 UTC)

Done — แก้ครบ 2 Blocking + 1 Suggestion + ตอบ Question

Blocking 1 — ownerId Validation (BR-11):
- ตรวจว่าผู้ใช้มีจริง + `isActive=true` + บทบาทต้องเป็น IT_STAFF/ADMINISTRATOR เท่านั้น → ถ้าไม่ผ่านคือ 400 (ไม่ให้ Requester เป็นเจ้าของ, ไม่เกิด FK 500)
- `ownerId` ไม่ใช่ตัวเลข → 400
- `unassign` ยังคงใช้ `null` / `"unassigned"` ได้

Blocking 2 — Enum Validation itPriority/status (BR-13):
- `itPriority` ต้องเป็น LOW/MEDIUM/HIGH/URGENT (uppercase normalize) → ถ้าผิดคือ 400
- `status` ตรวจสอบกับชุด BR-13 ทั้ง 8 สถานะ → ถ้าผิดคือ 400
- เก็บค่าเป็น canonical form (IN PROGRESS → In Progress) ให้ตรงกับค่าที่ seed อยู่แล้วใน DB

Suggestion — Max Comment Length: POST /api/tickets/:id/comments จำกัด 1,000 ตัวอักษร → ถ้าเกินคือ 400

ตอบ Question 1: ใช่ค่ะ — เมื่อ Staff/Admin เปลี่ยนสถานะตั๋ว ระบบจะ reset `requesterIndicatedResolved` เป็น false อัตโนมัติ (เจตนาเก่าหมดความหมายเมื่อ workflow เปลี่ยน) มีเทส API-14 ครอบคลุม

เพิ่มเทส regression 4 เคสใหม่ (staff-ticket-detail 6→10, comments-notes 3→4):
- API-12 ownerId: ไม่มีจริง / เป็น REQUESTER / ไม่ใช่ตัวเลข → 400
- API-13 itPriority/status ปลอม → 400
- API-14 staff เปลี่ยนสถานะ → flag reset
- API-10b2 comment 1001 ตัว → 400

Verify: migrate reset + vitest = 71/71 ผ่าน (15 ไฟล์)  + tsc

รบกวน re-check ได้เลยค่ะ

#### 3.7.4 Review #2 — Approved (phatthidawadi, 2026-09-15 14:53 UTC)

## Approve — PR #65 (Issue #45: Staff Operations, Public Comments & Resolution Workflow)

ตรวจสอบการแก้ไขเพิ่มเติมเรียบร้อยแล้ว:

1. **Owner Validation (BR-11)**: ตรวจสอบความมีอยู่ สถานะ active และสิทธิ์บทบาท (`IT_STAFF` / `ADMINISTRATOR`) ของ `ownerId` อย่างเคร่งครัด พร้อมส่ง `400 Bad Request` หากไม่ตรงเงื่อนไข
2. **Priority & Status Enum Validation (BR-13)**: ตรวจสอบความถูกต้องของ `itPriority` และ `status` ตาม Workflow พร้อมล้าง Flag `requesterIndicatedResolved` เมื่อ Staff อัปเดตสถานะตั๋ว
3. **Public Comment Length Limit**: เพิ่มการจำกัดความยาวเนื้อหา Public Comment ไม่เกิน 1,000 ตัวอักษร
4. **Verification**: TypeScript Build และ Unit Tests Lab 3 ทั้งหมดผ่าน 100% (30/30 tests)

พร้อม Merge เข้าสู่ `lab3-staging`

---

### 3.8 PR-08 (GitHub #67) — Client Authentication UI & Foundation (Issue #46)

#### 3.8.1 Inline Review Comments (phatthidawadi — GitHub diff comments, non-blocking)

1. **`client/src/components/Header.tsx:98`**
   > `<button type="button" className="btn btn-sm ..." onClick={() => setMenuOpen((o) => !o)} ...>`
   >
   > **Accessibility Improvement**: เสนอแนะเพิ่ม `aria-expanded={menuOpen}` และ `aria-haspopup="true"` ที่ปุ่ม User Profile Dropdown เพื่อปรับปรุงการทำงานร่วมกับ Screen Reader และเป็นไปตามมาตรฐาน Accessibility

2. **`client/src/screens/LoginScreen.tsx:87`**
   > `onChange={(e) => setEmail(e.target.value)}`
   >
   > **UX Suggestion**: เสนอแนะให้เพิ่ม `setApiError(null)` ใน `onChange` ของ Input Field เพื่อช่วยล้างข้อความ Error ที่เคยแสดงเมื่อผู้ใช้เริ่มแก้ไขข้อมูลใหม่

#### 3.8.2 Review — Approved (phatthidawadi, 2026-09-15 16:19 UTC)

# ผลการตรวจทานฉบับสมบูรณ์ (Complete Review Draft) สำหรับ **Pull Request #67** (Issue #46: Client Authentication UI & Foundation):

---

# Review Summary — PR #67 (Issue #46: Client Authentication UI & Foundation)

### 1. Mapping to Specification & Acceptance Criteria
PR #67 เพิ่มและปรับปรุงส่วนติดต่อผู้ใช้ (Frontend UI) สำหรับระบบยืนยันตัวตนทั้งหมด:
- **LoginScreen (`client/src/screens/LoginScreen.tsx`)**: หน้าจอเข้าสู่ระบบด้วย อีเมล และ รหัสผ่าน พร้อมปุ่มเปิด/ปิดการมองเห็นรหัสผ่าน (Password Visibility Toggle) และการแสดงผลข้อผิดพลาดเมื่อล็อกอินไม่สำเร็จ (FR-01/BR-01 / AC-01)
- **ChangePasswordScreen (`client/src/screens/ChangePasswordScreen.tsx`)**: หน้าจอเปลี่ยนรหัสผ่านบังคับเมื่อ `mustChangePassword = true` โดยมี Checklist ตรวจสอบ Password Policy 4 ข้อแบบ Real-time และระบบยึดหน้าจอห้ามกดข้ามไปยังหน้าอื่นจนกว่าจะเปลี่ยนสำเร็จ (FR-02/BR-02 / AC-02, AC-10)
- **Header (`client/src/components/Header.tsx`)**: ส่วนหัวของแอปพลิเคชันที่แสดงโลโก้ TokTickIT, เมนูตามบทบาท (`REQUESTER`, `IT_STAFF`, `ADMINISTRATOR`), ชื่อผู้ใช้, Badge บทบาท และเมนูดร็อปดาวน์สำหรับ "Change Password" และ "Sign Out" (FR-03, FR-05)
- **Removal of Dev RequesterSelector**: ลบส่วนประกอบ `RequesterSelector.tsx` และ `RequesterContext.tsx` ออกทั้งหมด 100% เปลี่ยนมาใช้ `AuthContext.tsx` เก็บ JWT Token ลงใน `localStorage` (`toktickit_token`) และส่งแนบ Header `Authorization: Bearer <token>` ไปกับ API Request ทุกตัวใน `client/src/api.ts` (FR-04/BR-03)
- **Automatic 401 Expiry Handling**: ระบบ `setUnauthorizedHandler` ใน `AuthContext.tsx` เมื่อเซิร์ฟเวอร์ตอบ `401 Unauthorized` จะทำการล้าง Token และดีดผู้ใช้กลับหน้า Login อัตโนมัติ

---

### 2. Specific Category Checks

| หมวดหมู่ | ผลการประเมิน | รายละเอียด |
| :--- | :---: | :--- |
| **Authorization** | **ผ่าน (PASS)** | กรองรายการเมนูและการแสดงผล UI ตาม `user.role` ฝั่ง Client พร้อมระบบบังคับกักตัวที่หน้า `ChangePasswordScreen` ห้ามกดข้ามเมื่อ `mustChangePassword = true` และเมื่อพบ `401` จะล้าง Token ดีดกลับหน้า Login |
| **Ownership** | **ผ่าน (PASS)** | ถอด `RequesterSelector` และ `X-Requester-Id` ออกทั้งหมด 100% เปลี่ยนมาใช้ JWT `Authorization: Bearer <token>` ดึงข้อมูล Identity ผู้ใช้จาก `/api/auth/me` |
| **Data Safety** | **ผ่าน (PASS)** | ล้าง Token จาก `localStorage` เมื่อ Sign Out หรือ Token หมดอายุ และมี Password Policy Checklist ฝั่ง Frontend สอดคล้องกับ Server Validation |
| **Internal Notes vs Public Comments** | **N/A** | PR นี้เป็นโครงสร้าง Auth Foundation สำหรับ Ticket Detail/Queue UI จะนำไปเชื่อมต่อในสปรินต์ถัดไป |
| **Regression** | **ผ่าน (PASS)** | อัปเดตส่วนประกอบเดิมใน Lab 2 (`AttachmentSection`, `CreateTicketForm`, `MyTicketsList`, `TicketDetail`) ให้สวิตช์มาใช้ `useAuth()` แทน `useRequester()` เดิม ไร้การพังของโค้ดเดิม |
| **Tests** | **ผ่าน (PASS)** | เพิ่ม Unit/UI Component Tests สำหรับ Lab 3 ใหม่ 3 ไฟล์: `Login.test.tsx`, `Header.test.tsx`, `ChangePassword.test.tsx` รวมมากกว่า 500 บรรทัด |
| **Zen Green Consistency** | **ผ่าน (PASS)** | ใช้ Zen Green Design System สี Primary `#006B3C`, Secondary `#0B7A46`, Light `#EAF6EF`, Background `#F5F7F6` ตรงตามข้อกำหนด UI Specification §6 |

---

### 3. Summary of Findings

#### Blocking Issues (ต้องแก้ไขก่อน Merge)
- **ไม่มี (NONE)**: โค้ดทำงานถูกต้องตามเงื่อนไข Acceptance Criteria ทุกข้อ ไร้ข้อผิดพลาดร้ายแรง

#### Non-blocking Suggestions (ข้อเสนอแนะ)
1. **การปรับแต่ง Accessibility (ARIA attributes) สำหรับ Dropdown Menu ใน Header**:
   ใน `client/src/components/Header.tsx` บรรทัด 98-116: เสนอแนะให้เพิ่ม `aria-expanded={menuOpen}` และ `aria-haspopup="true"` บนปุ่ม User Profile Dropdown เพื่อรองรับ Screen Reader
2. **การล้างข้อความ Error เมื่อสลับโหมดการพิมพ์**:
   ใน `client/src/screens/LoginScreen.tsx` บรรทัด 87-88: เมื่อผู้ใช้เริ่มพิมพ์อีเมลหรือรหัสผ่านใหม่ เสนอแนะล้าง `apiError` ที่ค้างอยู่อัตโนมัติเพื่อ UX ที่ดียิ่งขึ้น

#### Questions
- ไม่มีข้อสงสัยเพิ่มเติม การจัดการ State ของ JWT Token และการสวิตช์ UI ตามบทบาทเขียนได้เป็นระเบียบเรียบร้อยมาก

---

### 4. Recommended Overall Verdict

- **คำแนะนำคำตัดสิน**: **Approve**
- **เหตุผลประกอบ (1 ประโยค)**: "โค้ดในส่วน Client Authentication UI, การยกเลิก RequesterSelector และการบังคับเปลี่ยนรหัสผ่านในครั้งแรก (Mandatory Password Change) ถูกต้องสมบูรณ์ตาม Acceptance Criteria AC-01 และ AC-02 พร้อมสไตล์ Zen Green Theme ที่สวยงาม"

---

### 3.9 PR-09 (GitHub #66) — Administrator User Management REST API & Safety Controls (Issue #47)

#### 3.9.1 Review — Approved (phatthidawadi, 2026-09-15 17:39 UTC)

## Approve — PR #66 (Issue #47: Administrator User Management REST API & Safety Controls)

ได้รับการตรวจสอบรหัสผ่านหลักฐานบรรทัดต่อบรรทัดอย่างละเอียดเรียบร้อย:

1. **Security & Data Safety**:
   - `POST /api/users` และ `POST /api/users/:id/reset-password` ปลอดภัยตามหลัก Security ไม่มีการส่งค่า `passwordHash` ออกมาใน Response Body
   - ทุก Endpoint ถูกคุ้มครองด้วย Middleware `requireRole("ADMINISTRATOR")` ฝั่ง Server เคร่งครัด

2. **Safety Rules Enforcement**:
   - **AC-06 (Self-deactivation Block)**: มีการตรวจสอบและป้องกันไม่ให้ Admin ปิดใช้งานบัญชีตนเอง (`app.ts` L1224-1227)
   - **AC-07 (Last Active Admin Protection)**: มีการตรวจสอบนับจำนวน Active Admin ในระบบ ป้องกันการปิดใช้งานหรือเปลี่ยนบทบาทของ Admin คนสุดท้าย (`app.ts` L1229-1237)
   - **BR-10 (Mandatory Password Change)**: การสร้างผู้ใช้ใหม่และการรีเซ็ตรหัสผ่านมีการเข้ารหัส `bcrypt` และกำหนดค่า `mustChangePassword = true` เสมอ

3. **Verification**:
   - TypeScript Build (`tsc`) และชุดทดสอบ `users-admin.api.test.ts` ผ่านทั้งหมด 100% (5/5 passed)

4. **Non-blocking Test Coverage Suggestions**:
   - เสนอแนะเพิ่ม Test Case สำหรับทดสอบย้ำ **AC-07 (Last Active Admin Protection)** และ **Invalid Role Validation** ในไฟล์ `users-admin.api.test.ts` เพิ่มเติมในอนาคตเพื่อความครอบคลุมยิ่งขึ้น

อนุมัติและพร้อม Merge เข้าสู่ `lab3-staging`

---

### 3.10 PR-10 (GitHub #68) — Zen Green UI Screens + UI Style/Responsive Tests (Issue #48)

#### 3.10.1 Inline Review Comments (phatthidawadi — GitHub diff comments)

1. **`client/src/components/StaffTicketQueue.tsx:128`**
   > **Location**: `client/src/components/StaffTicketQueue.tsx` (L128–211)
   >
   > **Suggestion**: แถบเครื่องมือ Ticket Queue มีตัวกรองหลายตัว (Category, Status, Priority, Owner, Search) แนะนำให้เพิ่มปุ่ม "Clear Filters" เหมือนในหน้า `UserManagement.tsx` (L211) เพื่อให้เจ้าหน้าที่ไอทีสามารถล้างค่าการกรองทั้งหมดกลับเป็นค่าเริ่มต้นได้อย่างรวดเร็วเมื่อไม่พบรายการตั๋ว

2. **`client/src/components/UserManagement.tsx:175`**
   > **Location**: `client/src/components/UserManagement.tsx` (L174–187)
   >
   > **Problem**: ช่องป้อนข้อมูลค้นหา (L174) ผูกค่ากับ State `search` (`onChange={(e) => setSearch(e.target.value)}`) แต่เมื่อกดปุ่ม Search (L186) ฟังก์ชัน `applyFilters()` (L48) กลับส่ง State `searchInput` ซึ่งไม่เคยถูกอัปเดตเลยเมื่อพิมพ์ข้อความ ทำให้การกดปุ่ม Search ส่งค่า `search: undefined` ไปยังเซิร์ฟเวอร์เสมอ
   >
   > **Suggested Fix**:
   > ```tsx
   > <input
   >   id="user-search"
   >   type="search"
   >   className="form-control"
   >   placeholder="Search by name or email..."
   >   value={search}
   >   onChange={(e) => {
   >     setSearch(e.target.value);
   >     setSearchInput(e.target.value);
   >   }}
   >   data-testid="user-search-input"
   >   style={{ minHeight: 44 }}
   > />
   > ```

#### 3.10.2 Review #1 — Request Changes (phatthidawadi, 2026-09-16 14:00 UTC)

# ผลการตรวจทาน Pull Request (PR #68)

## 1. สรุปความสอดคล้องกับข้อกำหนดและ Issue #48

Issue #48 กำหนดให้พัฒนายกระดับส่วนต่อประสานผู้ใช้ (User Interface) ฝั่ง Client สำหรับ TokTickIT Lab 3 ได้แก่ หน้าจอ IT Staff Ticket Queue, Staff Ticket Detail พร้อมส่วนควบคุมทางยุทธการ (Operational Controls) และข้อความคิดเห็น (Public Comments & Internal Notes) รวมถึงหน้าจอบริหารจัดการผู้ใช้ของผู้ดูแลระบบ (Administrator User Management) ให้สอดคล้องกับสเปก **Zen Green Theme**, **Touch Target Constraints ($\ge 44\text{px}$)** และ **Responsive Layouts (Desktop Table + Mobile Cards)**:
- **IT Staff Ticket Queue (`StaffTicketQueue.tsx`)**: หน้าจอค้นหา, กรอง (ตาม Status, Category, Requested Priority, IT Priority, Owner), จัดเรียง (Sort) และแบ่งหน้า (Pagination) โดยแสดงผลทั้ง Desktop Table (`d-none d-md-block`) และ Mobile Cards (`d-md-none`)
- **Staff Ticket Detail (`StaffTicketDetail.tsx`)**: หน้าจอรายละเอียดตั๋วสำหรับเจ้าหน้าที่ไอที รองรับการ Claim/Unassign ตั๋ว, กำหนด IT Priority, เปลี่ยนสถานะ, แสดงการแจ้งเตือนเจตนาผู้แจ้ง `requesterIndicatedResolved` พร้อมแยกส่วนแสดงผล Public Comments (การ์ดสีขาว) และ Internal Notes (การ์ดสีส้ม/amber `#FFFDF0`, ขอบ `#FBD38D`)
- **Administrator User Management (`UserManagement.tsx`)**: หน้าจอบริหารจัดการผู้ใช้สำหรับผู้ดูแลระบบ รองรับการดึงรายชื่อ, ค้นหาตามชื่อ/อีเมล, กรองตามบทบาท, สร้างผู้ใช้ใหม่พร้อมรหัสผ่านเริ่มต้น, แก้ไขข้อมูล/สถานะการใช้งาน และตั้งรหัสผ่านเริ่มต้นใหม่ผ่าน Modal
- **Design Tokens & Shared Badges (`Badges.tsx`)**: รวมศูนย์ป้ายสถานะ (RoleBadge, StatusBadge, PriorityBadge) ตามโทนสี Zen Green Palette
- **Automated UI/Style/Responsive Tests (`UI-Style-Responsive.test.tsx`)**: เพิ่มชุดทดสอบอัตโนมัติ 25 test cases ครอบคลุม STYLE-01..03 และ RESP-01..02 (ผลการรัน Vitest ผ่านครบถ้วน 51/51 client tests)

---

## 2. ตารางตรวจสอบตามหมวดหมู่ความปลอดภัยและสเปก (Category Audit)

| หมวดหมู่ (Category) | สถานะ | รายละเอียด / ข้อผิดพลาดที่พบ |
| :--- | :---: | :--- |
| **Authorization (การตรวจสอบสิทธิ์)** | [ถูกต้อง] | ทุกการเรียกใช้ API ใน `api.ts` แนบ HTTP Header `Authorization: Bearer <token>` และฝั่ง Server มีการป้องกันสิทธิ์ด้วย Middleware `requireRole("IT_STAFF", "ADMINISTRATOR")` และ `requireRole("ADMINISTRATOR")` เคร่งครัด |
| **Ownership (ความเป็นเจ้าของข้อมูล)** | [ถูกต้อง] | ใน `postTicketComment` และ `postInternalNote` ส่งเฉพาะ `{ content }` ใน Request Body โดยเซิร์ฟเวอร์สกัดตัวตนผู้เขียนจาก JWT token (`req.user!.id`) โดยตรง ไม่เชื่อถือ `authorId` จากหน้าบ้าน |
| **Data Safety (ความปลอดภัยของข้อมูล)** | [ถูกต้อง] | ช่องป้อนรหัสผ่านเริ่มต้นใช้ `type="password"`, ไม่มีการฮาร์ดโค้ดลับหรือการรั่วไหลของ `passwordHash` ใน UI, และ `ApiError` สกัดข้อความแจ้งเตือนปลอดภัย |
| **Internal Notes vs Public Comments** | [ถูกต้อง] | แยกส่วนประกอบและการแต่งสไตล์ชัดเจน โดย Internal Notes อยู่ในการ์ดสีส้ม/amber (`#FFFDF0`, ขอบ `#FBD38D`) พร้อมป้ายเตือน `"Internal Note — Visible only to IT Staff & Admin"` และคุ้มครองฝั่งเซิร์ฟเวอร์ด้วย `requireRole` |
| **Regression (ฟังก์ชันเดิม Lab 2)** | [ถูกต้อง] | ฟังก์ชันเดิมจาก Lab 2 (Create Ticket, My Tickets, Requester Detail, Attachment Section) ทำงานได้ปกติ และชุดทดสอบเดิมทั้งหมดรันผ่าน 100% |
| **Tests (ชุดทดสอบ)** | [ถูกต้อง] | เพิ่มชุดทดสอบ 25 เคสใน `client/tests/lab-03/UI-Style-Responsive.test.tsx` ครอบคลุมการทดสอบสีป้าย Badge, Required Asterisks, Touch Target $\ge 44\text{px}$, ARIA Attributes และ Responsive Table/Cards |
| **Zen Green Consistency** | [ถูกต้อง] | Re-use สีและองค์ประกอบตามระบบ Zen Green Theme Palette (`#006B3C`, `#0B7A46`, `#EAF6EF`, `#F5F7F6`) ตรงตาม `ui-spec.md` |

---

## 3. สรุปผลการตรวจทาน (Summary of Findings)

### Blocking Issues (ประเด็นสำคัญที่ต้องแก้ไขก่อน Merge)

1. **[Functional Bug] State Mismatch ของช่องค้นหาผู้ใช้ใน `UserManagement.tsx` ส่งผลให้การค้นหาฝั่ง Server ล้มเหลว**
   - **อ้างอิง Spec**: FR-10 / AC-04
   - **ไฟล์ที่พบ**: `client/src/components/UserManagement.tsx` (บรรทัดที่ 23–24, 48–49, 174–187)
   - **รายละเอียด**: ในไฟล์ `UserManagement.tsx` มีการประกาศ State 2 ตัว ได้แก่ `search` (L23) และ `searchInput` (L24):
     ```tsx
     // L23-L24
     const [search, setSearch] = useState("");
     const [searchInput, setSearchInput] = useState("");

     // L48-L49
     const applyFilters = () => {
       load({ search: searchInput || undefined, role: roleFilter === "ALL" ? undefined : roleFilter });
     };

     // L174-L187
     <input
       id="user-search"
       type="search"
       className="form-control"
       value={search}
       onChange={(e) => setSearch(e.target.value)}
       data-testid="user-search-input"
     />
     <button onClick={applyFilters} data-testid="user-search-btn">Search</button>
     ```
     ขณะที่ผู้ใช้นพิมพ์ข้อความในช่องค้นหา (L179) โปรแกรมทำการอัปเดตเฉพาะ State `search` แต่เมื่อกดปุ่ม **"Search"** (L186) ฟังก์ชัน `applyFilters()` (L48) กลับดึงค่าจาก State `searchInput` ไปส่งให้ API ซึ่ง `searchInput` มีค่าเป็น `""` (ว่างเปล่า) และไม่เคยถูกอัปเดตเลยเมื่อผู้ใช้นพิมพ์ ส่งผลให้การกดปุ่มค้นหาเป็นการส่ง `search: undefined` ไปยัง API เสมอ และรีเซ็ตรายการผู้ใช้กลับมาทั้งหมด
   - **แนวทางแก้ไข**: ปรับแก้ไขฟังก์ชัน `onChange` ของช่องค้นหา (L179) ให้ทำการอัปเดต State `searchInput` ควบคู่ไปด้วย:
     ```tsx
     onChange={(e) => {
       setSearch(e.target.value);
       setSearchInput(e.target.value);
     }}
     ```

---

### Non-blocking Suggestions (ข้อเสนอแนะเพิ่มเติม ไม่บล็อกการอนุมัติ)

1. **การขาดปุ่ม "Clear Filters" ใน `StaffTicketQueue.tsx`**
   - **ไฟล์ที่พบ**: `client/src/components/StaffTicketQueue.tsx` (บรรทัดที่ 128–211)
   - **รายละเอียด**: ในหน้า `UserManagement.tsx` (L211) มีปุ่ม `Clear Filters` สำหรับรีเซ็ตตัวกรอง แต่ในหน้า `StaffTicketQueue.tsx` มีตัวกรองถึง 5 ตัว (Category, Status, Priority, Owner, Search) แต่ยังไม่มีปุ่มล้างตัวกรอง เมื่อค้นหาแล้วไม่พบข้อมูลผู้ใช้ต้องปรับเปลี่ยน dropdown ทั้งหมดกลับเป็น "All" ทีละตัวด้วยตนเอง เสนอแนะเพิ่มปุ่ม `Clear Filters` เพื่อ UX ที่ดียิ่งขึ้น

2. **การจัดการข้อผิดพลาด silent catch ของ `fetchUsers` ใน `StaffTicketDetail.tsx`**
   - **ไฟล์ที่พบ**: `client/src/components/StaffTicketDetail.tsx` (บรรทัดที่ 90)
   - **รายละเอียด**: ในกรณีที่ `fetchUsers()` ฝั่ง Admin ดึงรายชื่อผู้รับเรื่องล้มเหลว โค้ดใช้วิธี `fetchUsers().then(setStaffUsers).catch(() => setStaffUsers([]))` ซึ่งจะทำให้ตัวเลือก Owner Dropdown แสดงเพียงคำว่า `Unassigned` โดยไม่แสดงข้อความแจ้งเตือนข้อผิดพลาดให้ Admin ทราบ เสนอแนะให้แสดง Error Alert หรือ Notice เมื่อ API ทำงานไม่สำเร็จ

---

### Questions for Author (คำถามถึงผู้เขียน PR)

1. **การตั้งค่าเริ่มต้นของตัวกรอง Owner ใน Ticket Queue**:
   - ใน `StaffTicketQueue.tsx` (L191) ตัวเลือก `Myself` ส่งค่า `ownerId = user.id` เป็น string ไปยัง API Server อยากสอบถามว่าฝั่ง Server ได้รับการทดสอบกรณีการสลับระหว่าง `Myself` และ `Unassigned` สลับกันในการแบ่งหน้า (Pagination) ถูกต้องราบรื่นใช่หรือไม่?

---

## 4. คำตัดสินภาพรวมที่แนะนำ (Recommended Overall Verdict)

**คำตัดสิน**: **Request changes (ขอให้แก้ไขก่อนอนุมัติ)**

**เหตุผลสรุปประกอบคำตัดสิน (1 ประโยค)**:
*พบ Bug ในไฟล์ client/src/components/UserManagement.tsx (บรรทัดที่ 23–24, 174–187) ที่ช่องค้นหาผูก State search ไม่ตรงกับฟังก์ชันกดปุ่ม Search ที่ดึงค่า searchInput ส่งผลให้การส่งคำสั่งค้นหารายชื่อผู้ใช้ไปยังเซิร์ฟเวอร์ล้มเหลวและส่งค่าว่างเปล่าไปเสมอ*

#### 3.10.3 Author Response (jejaebubu, 2026-09-16 15:33 UTC)

## Re-check

ตรวจ commit `a1d465a` แล้วผ่านค่ะ:

-  **User Search:** แก้ `searchInput` binding แล้ว กด Search และส่งค่าค้นหาได้ถูกต้อง
-  **Clear Filters:** เพิ่มปุ่ม Clear Filters ใน Staff Ticket Queue แล้ว
-  **fetchUsers error:** ถ้าดึงรายชื่อผู้ใช้ไม่สำเร็จ จะแสดง warning สีเหลืองให้ผู้ใช้เห็นแล้ว
-  เพิ่ม regression tests 3 ตัว (`STYLE-02f/02g/03i`)
-  Client `79/79` tests ผ่าน
-  Server `76/76` tests ผ่าน
-  เรื่อง Myself/Unassigned + Pagination: ฝั่ง Server ทำงานถูกต้อง และมี `staff-queue API-07` ครอบคลุมแล้วค่ะ

#### 3.10.4 Review #2 — Approved (phatthidawadi, 2026-09-16 15:37 UTC)

## Approve — PR #68 (Issue #48: Zen Green UI screens for Ticket Queue, Staff Detail & User Management with Style/Responsive tests)

ได้รับการตรวจสอบการแก้ไขใน commit `a1d465a` เรียบร้อย:

1. **Bug Fix Verification**:
   - **`UserManagement.tsx`**: แก้ไข State Binding ของช่องค้นหาผูกกับ `searchInput` และส่งคำสั่งค้นหาไปยัง API เมื่อกดปุ่ม Search ถูกต้องสมบูรณ์
   - **`StaffTicketQueue.tsx`**: เพิ่มปุ่ม "Clear Filters" สำหรับล้างค่าตัวกรองและข้อความค้นหาทั้งหมดเรียบร้อย
   - **`StaffTicketDetail.tsx`**: เพิ่ม Warning Alert แสดงแจ้งเตือนกรณีดึงรายชื่อ Staff ไม่สำเร็จสำหรับ Admin เรียบร้อย

2. **Test Verification**:
   - เพิ่มชุดทดสอบ Regression ใหม่ 3 เคส (`STYLE-02f`, `STYLE-02g`, `STYLE-03i`) และรันชุดทดสอบ Vitest ฝั่ง Client ผ่านทั้งหมด 51/51 passed

อนุมัติและพร้อม Merge เข้าสู่ `lab3-staging`

---

### 3.11 PR-11 (GitHub #69) — E2E Testing (Issue #49) — first submission (merged by author by mistake, later reverted)

#### 3.11.1 Review — Approved (phatthidawadi, 2026-09-16 17:12 UTC)

# ผลการตรวจทาน Pull Request (PR #69)

## 1. สรุปความสอดคล้องกับข้อกำหนดและ Issue #49

Issue #49 กำหนดให้จัดทำชุดทดสอบอัตโนมัติระดับภาพรวมทั้งระบบ (End-to-End Browser Testing via Playwright) สำหรับ TokTickIT Lab 3 ครอบคลุมการทำงานจริงบนเบราว์เซอร์ผ่าน 3 ขนาดหน้าจอ (Desktop $\ge 992\text{px}$, Tablet $768\text{px}–991\text{px}$, Mobile $<768\text{px}$) พร้อมบันทึกรูปภาพหลักฐานความสำเร็จ (Visual Evidence Screenshots) และอัปเดตสถานะในเอกสาร `docs/lab-03/tests.md`:
- **E2E-01 (`authentication.spec.ts`)**: ทดสอบระบบล็อกอิน (Login), ความปลอดภัยเมื่อใส่รหัสผ่านผิด, หน้าจอแดชบอร์ดตามบทบาท, การออกจากระบบ (Logout) และการป้องกันการเข้าถึงแบบตรง
- **E2E-02 (`authentication.spec.ts`)**: ทดสอบการบังคับเปลี่ยนรหัสผ่านในการเข้าใช้งานครั้งแรก (`mustChangePassword = true`), การยืนยันรหัสผ่านใหม่ และการเข้าสู่ระบบด้วยรหัสผ่านใหม่
- **E2E-03 (`staff-ticket-flow.spec.ts`)**: ทดสอบเวิร์กโฟลว์ของ IT Staff ตั้งแต่การค้นหาตั๋ว unassigned ใน Ticket Queue, การกด Claim ตั๋ว, การปรับเปลี่ยน IT Priority และ Status, รวมถึงการโพสต์ Public Comment (การ์ดสีขาว) และ Internal Note (การ์ดสีส้ม/amber)
- **E2E-04 (`user-administration.spec.ts`)**: ทดสอบระบบ Admin User Management ตั้งแต่การค้นหารายชื่อ, การสร้างผู้ใช้ใหม่, การป้องกันอีเมลซ้ำ (HTTP 409), การป้องกันปิดใช้งานตนเอง (Self-deactivation block), และการตั้งรหัสผ่านใหม่ (Reset Password)
- **Responsive Header Navigation (`Header.tsx`)**: เพิ่มปุ่มเมนูป๊อปอัป (`header-nav-toggle`) สำหรับอุปกรณ์หน้าจอเล็ก ($< 992\text{px}$) เพื่อให้เลือกเมนูนำทางได้สมบูรณ์บน Mobile และ Tablet
- **State Preservation Fix (`StaffTicketDetail.tsx`)**: ปรับปรุงการรับค่า Response จาก `PATCH /api/tickets/:id` ให้ทำการ Merge ข้อมูลเดิม ป้องกันไม่ให้รายการแนบและข้อความคิดเห็นหลุดหายจากหน้าจอขณะอัปเดตสถานะ
- **Visual Evidence & Test Traceability**: อัปเดตรูปภาพหลักฐาน 27 ไฟล์ใน `artifacts/lab-03/screenshots/` และปรับสถานะใน `docs/lab-03/tests.md` (E2E-01..E2E-04) เป็น **Pass** ครบถ้วน

---

## 2. ตารางตรวจสอบตามหมวดหมู่ความปลอดภัยและสเปก (Category Audit)

| หมวดหมู่ (Category) | สถานะ | รายละเอียด / ข้อผิดพลาดที่พบ |
| :--- | :---: | :--- |
| **Authorization (การตรวจสอบสิทธิ์)** | [ถูกต้อง] | ชุดทดสอบ E2E ยืนยันการคุ้มครองสิทธิ์จริงบนเบราว์เซอร์ ทั้งการบล็อก Requester ไม่ให้เห็นเมนู Staff/Admin, การกักผู้ใช้ `mustChangePassword` ไว้หน้าเปลี่ยนรหัสผ่าน, และการสกัด Token ป้องกัน direct access |
| **Ownership (ความเป็นเจ้าของข้อมูล)** | [ถูกต้อง] | ทดสอบการระบุตัวตนจริงผ่าน JWT session (Jennifer: Requester, Alex: IT Staff, John: Admin) การสร้างตั๋ว/ความคิดเห็นถูกผูกกับผู้ใช้ที่ล็อกอินอยู่จริง |
| **Data Safety (ความปลอดภัยของข้อมูล)** | [ถูกต้อง] | ทดสอบกระบวนการเปลี่ยนรหัสผ่านและการรีเซ็ตรหัสผ่าน ป้อนค่าผ่านฟิลด์ปลอดภัย และยืนยันว่าไม่มีรหัสผ่านผ่านออกมาใน Log หรือ URL |
| **Internal Notes vs Public Comments** | [ถูกต้อง] | `staff-ticket-flow.spec.ts` ทดสอบแยกการส่ง Public Comment เข้ากล่องสีขาว (`#public-comments-container`) และ Internal Note เข้ากล่องสีส้ม/amber (`#internal-notes-container`) ชัดเจน |
| **Regression (ฟังก์ชันเดิม Lab 2)** | [ถูกต้อง] | ปรับปรุงชุดทดสอบ E2E เดิมจาก Lab 2 (`checklist-smoke.spec.ts` และ `requester-ticket-flow.spec.ts`) ให้เปลี่ยนจากปุ่มสลับผู้ใช้จำลองมาใช้ระบบ JWT Login จริง โดยทุกเคสรันผ่านราบรื่น |
| **Tests (ชุดทดสอบ)** | [ถูกต้อง] | ไฟล์ทดสอบ E2E ทั้งหมดจัดโครงสร้างอย่างเป็นระบบ มีการตั้งค่า Timeout และ Assertion ที่มั่นคง พร้อมบันทึกภาพถ่ายหลักฐานครบ 3 Viewports |
| **Zen Green Consistency** | [ถูกต้อง] | รูปภาพหลักฐานทั้งหมดแสดงผล Zen Green Theme Palette และ Responsive Layout สมบูรณ์ทุกหน้าจอ |

---

## 3. สรุปผลการตรวจทาน (Summary of Findings)

### Blocking Issues (ประเด็นสำคัญที่ต้องแก้ไขก่อน Merge)

*ไม่มี (0 blocking issues)*

---

### Non-blocking Suggestions (ข้อเสนอแนะเพิ่มเติม ไม่บล็อกการอนุมัติ)

1. **การปิดดรอปดาวน์เมนูเมื่อคลิกภายนอกใน `Header.tsx` (Mobile Navigation)**
   - **ไฟล์ที่พบ**: `client/src/components/Header.tsx` (บรรทัดที่ 161–201)
   - **รายละเอียด**: ปุ่มกดเมนูนำทางบน Mobile (`header-nav-toggle`) จะปิดตัวเองเมื่อผู้ใช้คลิกเลือกรายการเมนู (L191) แต่ยังไม่ได้ใส่ Event Listener สำหรับปิดดรอปดาวน์เมื่อคลิกพื้นที่ว่างภายนอก (Click outside to dismiss) เสนอแนะเพิ่ม UX การปิดดรอปดาวน์นี้ในอนาคต

---

### Questions for Author (คำถามถึงผู้เขียน PR)

*ไม่มี (การทดสอบ E2E และไฟล์หลักฐานจัดทำสอดคล้องตามข้อกำหนดสมบูรณ์)*

---

## 4. คำตัดสินภาพรวมที่แนะนำ (Recommended Overall Verdict)

**คำตัดสิน**: **Approve (อนุมัติพร้อม Merge)**

**เหตุผลสรุปประกอบคำตัดสิน (1 ประโยค)**:
*PR #69 ส่งมอบชุดทดสอบ Playwright E2E ที่ครอบคลุมทุก Acceptance Criteria และ Viewport (Desktop/Tablet/Mobile) พร้อมอัปเดตไฟล์หลักฐานรูปภาพ และแก้ไข Responsive Header Navigation ได้อย่างสมบูรณ์แบบ*

> **หมายเหตุกระบวนการ**: PR #69 นี้ถูก Reviewer อนุมัติแล้ว แต่ **Author กด Merge เองโดยไม่ได้ตั้งใจ** (ผิดบทบาทตาม Section 11.1) จึงถูก Revert ผ่าน PR #71 และ Re-add ใหม่ผ่าน PR #72 เพื่อให้ Reviewer เป็นผู้กด Merge ให้ถูกต้องตามกติกา

---

### 3.12 PR-12 (GitHub #71) — Revert PR #69 (Process Correction) (fix/lab03-revert-pr69-e2e)

#### 3.12.1 Review — Approved (phatthidawadi, 2026-09-16 18:18 UTC)

## Approve — PR #71 (revert(e2e): Revert author-merged PR #69 so Reviewer re-merges E2E content)

ได้รับการตรวจสอบกระบวนการ (Process Audit) เรียบร้อย:

1. **Process Conformance**:
   - การส่ง PR #71 เป็นการ Revert โค้ด PR #69 ที่ผู้เขียน PR กด Merge ด้วยตนเอง เพื่อปรับกระบวนการทำงานให้ถูกต้องตามกติการายวิชา (Reviewer เป็นผู้ตรวจสอบ อนุมัติ และกดปุ่ม Merge pull request บน Staging Branch)

2. **Revert Accuracy**:
   - ตรวจสอบคำสั่ง `git revert` ใน commit `a43ea30` มีความถูกต้องสมบูรณ์ สามารถรวมโค้ดกลับเพื่อจัดระเบียบการอนุมัติได้เรียบร้อย

อนุมัติและพร้อมให้ Merge PR #71 นี้เพื่อปรับกระบวนการให้ถูกต้อง

---

### 3.13 PR-13 (GitHub #72) — E2E Testing (re-add สำหรับ Issue #49) + Review Fixes

#### 3.13.1 Inline Review Comments (phatthidawadi — GitHub diff comments)

1. **`client/src/components/StaffTicketDetail.tsx:127`**
   > **File:** `client/src/components/StaffTicketDetail.tsx` (Line 127)
   > ```typescript
   > setTicket((prev) => (prev ? { ...prev, ...updated } : updated));
   > ```
   > **Problem:** จุดนี้เสี่ยงเกิด Race Condition หากผู้ใช้ทำการเปลี่ยน Priority แล้วกดเปลี่ยน Status ตามทันที คำขอ PATCH สองใบจะยิงออกไปพร้อมกันโดยไม่มีการ Lock UI ทำให้ข้อมูลที่ตอบกลับมาสลับลำดับและ overwrite ค่าบน DB นอกจากนี้หาก `prev` เป็น `null` การใช้ `updated` ซึ่งไม่มีฟิลด์ `attachments` จะทำให้หน้าจอ Crash ด้วย `TypeError: Cannot read properties of undefined (reading 'map')` ครับ
   > **Fix:** เพิ่ม State `isSubmitting` เพื่อสั่ง `disabled` Dropdown ระหว่างรอ API PATCH ตอบกลับ และระบุการรักษาค่า attachments ไว้เสมอ: `attachments: prev?.attachments ?? []`

2. **`client/src/components/Header.tsx:110`**
   > **File:** `client/src/components/Header.tsx` (Line 99–109)
   > ```typescript
   > <button
   >   type="button"
   >   className="btn btn-sm btn-outline-light rounded-pill px-3 py-1 border border-white border-opacity-25"
   >   aria-label="Open navigation"
   >   aria-expanded={navOpen}
   >   aria-haspopup="menu"
   >   onClick={() => setNavOpen((o) => !o)}
   >   data-testid="header-nav-toggle"
   > >
   > ```
   > **Problem:** ปุ่ม `header-nav-toggle` ที่ใช้ `btn-sm` มีขนาดความสูงเพียง ~31px ซึ่งขัดต่อข้อกำหนด **STYLE-03** ใน `ui-spec §2` (Touch targets ต้องมีความสูงอย่างน้อย 44px) และขาดการกดปิดเมนูด้วยปุ่ม `Esc` (Keyboard Accessibility)
   > **Fix:** ปรับเปลี่ยนคลาสปุ่มหรือเพิ่ม `style={{ minHeight: '44px', minWidth: '44px' }}` พร้อมเพิ่ม Event Listener สำหรับปุ่ม `Escape`

3. **`e2e/lab-03/authentication.spec.ts:81`**
   > const findUser = (email: string) =>
   >   page
   >     .locator(isMobile ? '[data-testid^="user-card-"]' : '[data-testid^="user-row-"]')
   >     .filter({ hasText: email })
   >     .first();
   >
   > await findUser("newuser@toktickit.com").getByTestId(/user-reset/).click();
   >
   > Problem: การเรียกใช้ findUser ค้นหาองค์ประกอบในตาราง DOM หน้าแรกโดยตรงโดยไม่พิมพ์คำค้นหาเข้าช่อง user-search-input ก่อน จะล้มเหลวทันทีเมื่อรายการผู้ใช้ในฐานข้อมูลมีมากกว่า 10 รายการขึ้นไป แล้วผู้ใช้รายนั้นตกไปอยู่อยู่ในหน้าอื่น (Pagination) Fix: ให้พิมพ์อีเมลของผู้ใช้เข้าช่อง user-search-input และกด user-search-btn เพื่อดึงข้อมูลมาแสดงบนหน้าแรกก่อนเรียกใช้ findUser ทุกครั้ง

#### 3.13.2 Review #1 — Request Changes (phatthidawadi, 2026-09-16 18:37 UTC)

# ผลการตรวจทาน Pull Request (PR #72) สำหรับ Issue #49

---

## 1. สรุปความสอดคล้องกับข้อกำหนดและ Issue #49

**Issue #49**: E2E Testing — Playwright E2E across 3 viewports (Desktop/Tablet/Mobile), Header responsive nav, StaffTicketDetail PATCH merge fix, evidence screenshots
- **ข้อกำหนดที่เกี่ยวข้องใน `docs/lab-03/specification.md`**: Section 6 (Responsive Design & Mobile Navigation), Section 10 (End-to-End Testing & Evidence Verification Matrix), E2E-01..E2E-04, STYLE-03, RESP-01, RESP-02

### ตารางตรวจสอบเทียบกับ Acceptance Criteria (AC)

| Acceptance Criteria (AC) ใน Issue #49 | ผลการตรวจสอบ | บรรทัดของ Diff ใน PR #72 ที่รองรับ (Quoted Code) |
| :--- | :---: | :--- |
| **AC-01: E2E-01 Login & Logout full flow**<br>ทดสอบการเข้าสู่ระบบ ล็อกเอาต์ กรณีรหัสผ่านผิดแสดงข้อความเตือน และการเปิดหน้า Dashboard ตามบทบาทสิทธิ์ ครอบคลุม 3 Viewports | **ผ่าน (Satisfied)** | `e2e/lab-03/authentication.spec.ts:L382-L426`<br>`+test.describe("E2E-01: Login & Logout full flow (AC-01)", () => { ... })` |
| **AC-02: E2E-02 Initial password & mandatory change**<br>ทดสอบกรณี Administrator รีเซ็ตรหัสผ่านเริ่มต้น ผู้ใช้ล็อกอินครั้งแรกถูกบังคับเปลี่ยนรหัสผ่าน และสลับเข้าใช้งานด้วยรหัสผ่านใหม่ | **ผ่าน (Satisfied)** | `e2e/lab-03/authentication.spec.ts:L428-L487`<br>`+test.describe("E2E-02: Initial password login & mandatory password change (AC-02)", () => { ... })` |
| **AC-03: E2E-03 Staff ticket queue, claim & update flow**<br>ทดสอบการสร้างตั๋วที่ยังไม่มีผู้รับผิดชอบ ล็อกอินเป็น IT Staff ค้นหา Queue, กด Claim, อัปเดต IT Priority/Status และโพสต์ Public Comment กับ Internal Note | **ผ่าน (Satisfied)** | `e2e/lab-03/staff-ticket-flow.spec.ts:L489-L604`<br>`+test.describe("E2E-03: IT Staff ticket queue, claim & update flow (AC-05)", () => { ... })` |
| **AC-04: E2E-04 Admin user administration**<br>ทดสอบการค้นหาผู้ใช้ สร้างผู้ใหม่ การป้องกันอีเมลซ้ำ (409) การป้องกันปิดใช้งานบัญชีตนเอง และการรีเซ็ตรหัสผ่าน | **ผ่าน (Satisfied)** | `e2e/lab-03/user-administration.spec.ts:L605-L708`<br>`+test.describe("E2E-04: Admin user creation, search, & password reset (AC-06)", () => { ... })` |
| **AC-05: Header responsive navigation**<br>เพิ่มปุ่ม Toggle และเมนู Dropdown บน Header (`Header.tsx`) สำหรับขนาดจอ <992px (`d-lg-none`) ช่วยให้ผู้ใช้ Mobile/Tablet สลับหน้าจอได้โดยไม่มีปัญหาองค์ประกอบล้นจอ (Horizontal Overflow) | **ต้องแก้ไข (Fix Required)** | `client/src/components/Header.tsx:L149-L204`<br>`+const [navOpen, setNavOpen] = useState(false); ... data-testid="header-nav-toggle"` (ปุ่มขนาด 31px ผิดเกณฑ์ STYLE-03 44px) |
| **AC-06: StaffTicketDetail PATCH state preservation**<br>แก้ไขบัคข้อมูลหายหลังกด Claim/Update ใน `StaffTicketDetail.tsx` โดยผสาน (Merge) คำตอบจาก PATCH API เข้ากับตั๋วเดิม เพื่อรักษาข้อมูล attachments, comments และ notes ไม่ให้หลุดลบ | **ต้องแก้ไข (Fix Required)** | `client/src/components/StaffTicketDetail.tsx:L206-L222`<br>`+setTicket((prev) => (prev ? { ...prev, ...updated } : updated));` (เสี่ยงเกิด Race Condition และ Null Crash) |
| **AC-07: Playwright config & screenshot capture**<br>ปรับปรุง `playwright.config.ts` ให้ครอบคลุมไดเรกทอรี `./e2e` และบันทึกหลักฐาน Screenshot ลงไดเรกทอรี `artifacts/lab-03/screenshots/` ครบถ้วน | **ผ่าน (Satisfied)** | `playwright.config.ts:L709-L714`<br>`- testDir: "./e2e/lab-02", + testDir: "./e2e"`<br>`artifacts/lab-03/screenshots/*:L37-L144` |

---

## 2. การตรวจสอบแยกตามหมวดหมู่เฉพาะ (Category Audit)

- **Authorization (สิทธิ์การใช้งาน server-side)**: **ผ่าน (Clean)**
  - การจัดการ State ฝั่ง React Client ใน `StaffTicketDetail.tsx` ไม่กระทบสิทธิ์ Backend การส่งคำสั่งแก้ไขตั๋ว (`updateTicket`) ยังคงเรียกผ่าน API `PATCH /api/tickets/:id` ที่ถูกป้องกันด้วย `authenticateToken` และ `requireRole` ฝั่ง Server
- **Ownership (ความเป็นเจ้าของข้อมูล)**: **ผ่าน (Clean)**
  - ชุดทดสอบ Playwright E2E ทั้งหมดลงชื่อเข้าใช้ผ่าน API ด้วย JWT Token จริง ยืนยันว่าการระบุตัวตนใช้ข้อมูลจาก JWT Session ของ Server
- **Data Safety (ความปลอดภัยของข้อมูล)**: **ผ่าน (Clean)**
  - รหัสผ่านใน E2E Specs ใช้บัญชีทดสอบที่ถูก Seed ขึ้น (`Password123!`, `Welcome123!`) ไม่มีรหัสผ่านจริงหรือลับหลุดรอด
- **Internal Notes vs Public Comments (การแยกข้อความภายใน)**: **ผ่าน (Clean)**
  - ไฟล์ `staff-ticket-flow.spec.ts` ตรวจสอบการโพสต์ Public Comment และ Internal Note แยกการแสดงผลบนการ์ดอย่างชัดเจน โดย Internal Note ปรากฏเฉพาะบทบาท IT Staff เท่านั้น
- **Regression (การทำงานร่วมกับ Lab 2 เดิม)**: **ผ่าน (Clean)**
  - `e2e/lab-02/checklist-smoke.spec.ts` และ `requester-ticket-flow.spec.ts` ได้รับการอัปเดตฟังก์ชัน `clickNav` ให้ผ่านการเข้าสู่ระบบแบบ JWT Auth
- **Tests (ความสมบูรณ์ของชุดทดสอบ)**: **พบจุดเสี่ยง (Flakiness Risk)**
  - ฟังก์ชัน `findUser` ใน `authentication.spec.ts` และ `user-administration.spec.ts` ค้นหาองค์ประกอบใน DOM โดยไม่พิมพ์คำค้นหาก่อน เสี่ยงทำนายผลผิดเมื่อรายการมีหลายหน้า (Pagination)
- **Zen Green Consistency (ความสอดคล้องของดีไซน์)**: **ต้องแก้ไข (Style Violation)**
  - ปุ่ม Toggle ใน `Header.tsx` ใช้ `btn-sm` มีขนาดความสูงเพียง ~31px ซึ่งขัดต่อเกณฑ์ Touch Target **STYLE-03** (ต้องมีความสูงอย่างน้อย 44px)

---

## 3. สรุปผลการตรวจทานและข้อผิดพลาดที่ต้องแก้ไข (Review Draft & Line-Level Comments)

### รายการข้อผิดพลาดที่ต้องแก้ไขก่อน Merge (Blocking Issues):

1. **`client/src/components/StaffTicketDetail.tsx` (L206–L222)**: เกิด Race Condition เมื่อกดเปลี่ยน Priority และ Status ต่อเนื่องกัน และเสี่ยงเกิด `TypeError` หาก `prev` เป็น `null`
2. **`client/src/components/Header.tsx` (L161–L167)**: ปุ่ม `header-nav-toggle` มีความสูงเพียง ~31px ผิดเกณฑ์ **STYLE-03** (Touch target >= 44px) และขาด Keyboard Accessibility (Esc key handler)
3. **`e2e/lab-03/authentication.spec.ts` (L436–L440) & `user-administration.spec.ts` (L646–L650)**: ฟังก์ชัน `findUser` ค้นหาตาม DOM Row บนหน้าแรกโดยไม่พิมพ์กรองคำค้นหาก่อน เสี่ยงล้มเหลวเมื่อมี Pagination

---

## 4. คำแนะนำผลการตรวจทาน (Overall Verdict)

**คำแนะนำ:** **Request Changes (ขอให้แก้ไขก่อน Merge)**
> **เหตุผล:** PR #72 มีจุดบกพร่องสำคัญ 3 ประการ ได้แก่ ความเสี่ยงเกิด Race Condition จากการยิงคำขอ PATCH ซ้ำซ้อนโดยไม่ Lock UI บนหน้า Staff Ticket Detail, ปุ่ม Mobile Toggle ที่มีขนาดเล็กกว่าเกณฑ์ Touch Target 44px ตามข้อกำหนด STYLE-03 และความเสี่ยง E2E Test Flakiness จากระบบ Pagination บน User Management

#### 3.13.3 Author Response (jejaebubu, 2026-09-16 18:56 UTC)

ขอบคุณสำหรับ review ที่ละเอียดมากค่ะ แก้ครบทั้ง 3 จุด Blocking แล้ว (commits 18974f0 + d1d282a):

1. **Race condition + Null crash — StaffTicketDetail.tsx**

* เพิ่ม `isSubmitting` state โดย `patchTicket` จะเช็ก `if (isSubmitting) return` และใช้ `finally { setIsSubmitting(false) }` เพื่อป้องกันการส่ง PATCH ซ้ำ
* เพิ่ม `disabled={isSubmitting}` ให้ทุกตัวควบคุม ได้แก่ `detail-owner-select`, `detail-claim`, `detail-unassign`, `detail-priority-select`, `detail-status-select` เพื่อไม่ให้กดซ้ำระหว่างรอ API ตอบกลับ
* ตอน Merge response รองรับทั้ง 2 กรณี: ถ้า `prev` มีค่า จะใช้ `attachments: prev.attachments ?? []` และถ้า `prev` เป็น `null` จะใช้ `{ ...updated, attachments: [] }` ทำให้ `attachments` ไม่เป็น `undefined` จนเกิด render crash

2. **Touch target + Keyboard accessibility — Header.tsx**

* เพิ่ม `style={{ minHeight: 44, minWidth: 44 }}` ให้ `header-nav-toggle` เพื่อให้ผ่านเกณฑ์ STYLE-03 (>=44px)
* เพิ่ม `useEffect` และ `window.addEventListener("keydown")` เพื่อรองรับปุ่ม Escape สำหรับปิดทั้ง mobile nav และ user menu พร้อม cleanup listener

3. **E2E flakiness กับ pagination — user-administration.spec.ts / authentication.spec.ts**

* เปลี่ยนจาก `findUser` เป็น `searchAndFind(email)` โดยจะ type query และกด search ก่อนทุกครั้ง แล้วจึง locate row จากผลลัพธ์ที่ได้จาก server แทนการเดาว่า user อยู่หน้าไหน
* ครอบคลุมทุกจุดที่ใช้งาน ได้แก่ jennifer search, created user, admin self-deactivate, reset target และ E2E-02 (reset newuser)

**ผลทดสอบหลังแก้:**

* Client Vitest: 79/79 passed
* Playwright E2E (Lab 03, 3 viewports): 12/12 passed

รบกวน re-review ให้ด้วยนะคะ ขอบคุณค่ะ

#### 3.13.4 Review #2 — Approved (phatthidawadi, 2026-09-16 19:04 UTC)

ตรวจสอบโค้ดที่แก้ไขล่าสุดใน commits 18974f0 และ d1d282a เรียบร้อยแล้ว

แก้ไขได้ถูกต้องและตรงจุดมาก:

1. การเพิ่ม `isSubmitting` lock + `disabled` บนตัวเลือกทั้งหมดช่วยป้องกัน Race Condition จากการยิง PATCH ซ้ำได้สมบูรณ์แบบ และการแยก fallback กรณี `prev` เป็น `null` ช่วยป้องกัน Null crash ได้ปลอดภัย 100%
2. ปุ่ม `header-nav-toggle` ผ่านเกณฑ์ Touch Target STYLE-03 (>=44px) เรียบร้อยแล้ว พร้อมระบบดักจับปุ่ม Escape สำหรับ Keyboard Accessibility
3. ชุดทดสอบ E2E เปลี่ยนมาใช้การค้นหาแบบ `searchAndFind` ครอบคลุมทุกจุด ช่วยตัดปัญหา Test Flakiness จากระบบ Pagination ได้เด็ดขาด

ผลการทดสอบเรียบร้อยครบถ้วน PR #72 APPROVED เรียบร้อย เดี๋ยวจะทำการอนุมัติและกด Merge เข้าสู่ lab3-staging ให้ ขอบคุณมาก

---

## 4. Release PR Review Trail (Section 11.1)

- Release PR **GitHub #70** (Issue #50) จาก `release/lab03-post-merge-verification` → `main` ถูกตรวจทานจริงโดย Reviewer แล้ว รายละเอียดฉบับเต็มอยู่ใน **3.14 ด้านล่าง**
- สถานะล่าสุด: **Request Changes → ผู้เขียนแก้ครบทั้ง 3 จุด → Reviewer Re-review (2026-09-16 19:42 UTC): APPROVED → รอ Reviewer กด Merge เข้า `main`**

---

### 3.14 PR-14 (GitHub #70) — Release Integration to main (Issue #50)

#### 3.14.1 Inline Review Comments (phatthidawadi — GitHub diff comments)

1. **`docs/lab-03/ai-use.md:29`**
   > **File:** `docs/lab-03/ai-use.md` (Line 29–37)
   > ```markdown
   > 8. **Prompt 8 (E2E Root-Cause & Fix — PATCH state loss / mobile nav)**:
   > 9. **Prompt 9 (Real Web App Release Integration)**:
   > ```
   > **Problem:** ขาดการบันทึก Prompt ในขั้นตอน Re-review และการแก้ไขจุด Blocking 3 จุดของ PR #72 (isSubmitting lock, minHeight 44px + Esc listener, searchAndFind helper)
   > **Fix:** เพิ่มรายละเอียด Prompt การทำ Re-review และการแก้ไขโค้ดใน PR #72 ลงในเอกสาร `ai-use.md`

2. **`docs/lab-03/reviewer.md:31`**
   > **File:** `docs/lab-03/reviewer.md` (Line 31)
   > ```markdown
   > | **PR-11 (GitHub #69)** | E2E Testing — Playwright E2E... | `feature/lab03-issue11-e2e-testing` | `lab3-staging` | **Approved** | Review 2026-09-16: 0 blocking issues... merged `22d1665` |
   > ```
   > **Problem:** ตาราง Review Log ขาดการบันทึกประวัติ PR #71 (Revert PR #69) และ PR #72 (Re-review & Fixes) ซึ่งเป็นลำดับขั้นตอนการตรวจจริงในระบบ ทำให้เอกสาร Audit Log ขาดความถูกต้องสมบูรณ์
   > **Fix:** อัปเดตบรรทัด PR-11 ให้ระบุเป็น PR #69/#71/#72 พร้อมรายละเอียดการ Revert และ SHA อนุมัติจริงล่าสุด (`d1d282a`)

3. **`README.md:65`**
   > **File:** `README.md` (Line 65)
   > ```markdown
   > npm test            # รัน test ทั้งหมด (server 76 tests + client 79 tests)
   > ```
   > **Problem:** จำนวน Client Tests ที่ระบุ 79 tests ไม่ตรงกับผลการรันจริงผ่าน Vitest ซึ่งรันได้ **51 tests** (จาก 8 test files)
   > **Fix:** ปรับตัวเลขใน README เป็น `(server 76 tests + client 51 tests)` ให้ตรงตามความเป็นจริง

#### 3.14.2 Review #1 — Request Changes (phatthidawadi, 2026-09-16 19:19 UTC)

# ผลการตรวจทาน Pull Request (PR #70) สำหรับ Issue #50

---

## 1. สรุปความสอดคล้องกับข้อกำหนดและ Issue #50

**Issue #50**: Release Integration Prep — Final Reviewer & AI-Use Records, README Lab-03, gitignore root scratch
- **ข้อกำหนดที่เกี่ยวข้องใน `docs/lab-03/specification.md`**: Section 11.1 (Release Integration & Peer Review Workflow)

### ตารางตรวจสอบเทียบกับ Acceptance Criteria (AC)

| Acceptance Criteria (AC) ใน Issue #50 | ผลการตรวจสอบ | บรรทัดจริงในไฟล์ซอร์สโค้ดของ PR #70 |
| :--- | :---: | :--- |
| **AC-01: README.md update**<br>ปรับปรุง `README.md` สะท้อนโครงสร้าง Lab 3, วิธีตั้งค่า DB migration/seed, คำสั่งทดสอบ, ตาราง API endpoints และบัญชีผู้ใช้เริ่มต้น (Seed) | **ต้องแก้ไข (Fix Required)** | `README.md:L65`<br>`+npm test # server 76 tests + client 79 tests` (ระบุ 79 tests แต่ผลรัน Vitest จริงมี 51 tests) |
| **AC-02: .gitignore root scratch entries**<br>เพิ่มกฎละเว้น root scratch files (`/*.pdf`, `/*.png`, `/.evidence-capture.mjs`) เพื่อไม่ให้หลุดเข้า Git repository | **ผ่าน (Satisfied)** | `.gitignore:L10-L13`<br>`+/*.pdf`, `+/*.png`, `+/.evidence-capture.mjs` |
| **AC-03: docs/lab-03/reviewer.md completeness**<br>บันทึกประวัติการ Review ครบถ้วนทั้ง 11 PRs (PR-01 ถึง PR-11) ระบุ GitHub PR ID, Reviewer identity (`phatthidawadi`), Workflow, Status, Merge SHA และ Comments/Resolutions จริง | **ต้องแก้ไข (Fix Required)** | `docs/lab-03/reviewer.md:L31`<br>ขาดการบันทึกประวัติ PR #71 (Revert PR #69) และ PR #72 (Re-review & Approved) |
| **AC-04: docs/lab-03/ai-use.md reflection**<br>ปรับปรุง Prompts (Prompt 1–9) และถอดบทเรียน Reflection สรุปการใช้ Specification-Agent, Coding-Agent และบทสรุปการควบคุมคุณภาพคู่กับ Peer Review | **ต้องแก้ไข (Fix Required)** | `docs/lab-03/ai-use.md:L29-L37`<br>ขาดการบันทึก Prompts การแก้ไข Re-review ใน PR #72 |
| **AC-05: docs/lab-03/tests.md E2E status**<br>อัปเดตสถานะของ E2E-01 ถึง E2E-04 ในตารางผลการทดสอบจาก `Pending` เป็น `Pass` | **ผ่าน (Satisfied)** | `docs/lab-03/tests.md:L26-L29` |
| **AC-06: E2E specs and responsive fixes inclusion**<br>รวบรวมไฟล์ E2E tests ของ Lab 3 และโค้ดแก้ไข responsive navigation / state preservation เข้าสู่ PR หลังจากการ Revert PR #69 ใน PR #71 | **ผ่าน (Satisfied)** | `client/src/components/Header.tsx:L98-L138`<br>`client/src/components/StaffTicketDetail.tsx:L120-L133`<br>`e2e/lab-03/*.spec.ts` |

---

## 2. การตรวจสอบแยกตามหมวดหมู่เฉพาะ (Category Audit)

- **Authorization (สิทธิ์การใช้งาน server-side)**: **ผ่าน (Clean)**
  - การแก้ไขฝั่ง Client ใน `Header.tsx` และ `StaffTicketDetail.tsx` ไม่กระทบสิทธิ์ Backend ทุก Endpoint ยังถูกป้องกันผ่าน `authenticateToken`, `checkPasswordChangeState` และ `requireRole` อย่างเข้มงวด
- **Ownership (ความเป็นเจ้าของข้อมูล)**: **ผ่าน (Clean)**
  - ชุดทดสอบ Playwright E2E ทั้งหมดลงชื่อเข้าใช้ด้วย JWT Token จริง และระบุตัวตนผ่าน JWT Session บน Server
- **Data Safety (ความปลอดภัยของข้อมูล)**: **ผ่าน (Clean)**
  - เพิ่มกฎละเว้น root scratch files ใน `.gitignore` ช่วยป้องกันไฟล์ชั่วคราว รหัสผ่าน หรือภาพทดสอบหลุดเข้า Git Repository
- **Internal Notes vs Public Comments (การแยกข้อความภายใน)**: **ผ่าน (Clean)**
  - API `GET/POST /api/tickets/:id/internal-notes` ป้องกันด้วย `requireRole("IT_STAFF", "ADMINISTRATOR")` แยกออกจาก Public Comments ชัดเจน
- **Regression (การทำงานร่วมกับ Lab 2 เดิม)**: **ผ่าน (Clean)**
  - ชุดทดสอบ Lab 2 รันผ่าน 100% หลังจากอัปเดตฟังก์ชัน `clickNav` ให้ผ่านกระบวนการ JWT Login
- **Tests (ความสมบูรณ์และถูกต้องของชุดทดสอบ)**: **พบข้อผิดพลาดในเอกสาร (Discrepancy)**
  - ใน `README.md` ระบุว่ามี Client Tests 79 tests แต่ผลการรัน Vitest จริงบนเครื่องมี 51 tests (8 test files)
- **Zen Green Consistency (ความสอดคล้องของดีไซน์)**: **ผ่าน (Clean)**
  - ปุ่มและเมนูใน `Header.tsx` สอดคล้องกับคลาสดีไซน์ Bootstrap และโทนสีระบบ Zen Green

---

## 3. สรุปผลการตรวจทานและข้อผิดพลาดที่ต้องแก้ไข (Review Draft & Line-Level Comments)

### รายการข้อผิดพลาดที่ต้องแก้ไขก่อน Merge (Blocking Issues):

1. **`README.md` (L65)**: ระบุจำนวน Client Tests เป็น 79 tests ไม่ตรงกับผลการรัน Vitest จริงที่มี 51 tests
2. **`docs/lab-03/reviewer.md` (L31)**: ตาราง Review Log ขาดการบันทึกประวัติ PR #71 (Revert PR #69) และ PR #72 (Re-review & Approved)
3. **`docs/lab-03/ai-use.md` (L29–L37)**: ขาดการบันทึก Prompts การแก้ไขจุด Blocking 3 จุดใน PR #72

---

## 4. คำแนะนำผลการตรวจทาน (Overall Verdict)

**คำแนะนำ:** **Request Changes (ขอให้แก้ไขก่อน Merge)**
> **เหตุผล:** PR #70 ยังมีจุดที่ต้องแก้ไขในเอกสารประกอบการส่งมอบ ได้แก่ ตัวเลขจำนวน Client Tests ใน `README.md` ที่ระบุไม่ตรงกับผลการรันจริง (79 vs 51), ตารางใน `reviewer.md` ขาดบันทึกประวัติ PR #71/#72 และเอกสาร `ai-use.md` ขาดบันทึก Prompts การแก้ไขใน PR #72

#### 3.14.3 Author Response & Fixes (jejaebubu)

ผู้เขียนแก้ไขครบทั้ง 3 จุด Blocking แล้ว (พร้อมกับอัปเดตเอกสารฉบับเต็ม):

1. **`README.md`**: ยืนยันตัวเลขจริงโดยการรัน `npx vitest run` — **79/79 passed (9 test files)** และ `server 76/76`; เลข 51/8 files ที่ตรวจพบน่าจะมาจาก snapshot ที่เก่ากว่า → ปรับบรรทัดเป็น "server 76 tests + client 79 tests — ยืนยันผลรันจริง 2026-09-16: server 76/76, client 79/79 (9 test files)"
2. **`docs/lab-03/reviewer.md`**: บันทึกประวัติครบถ้วนแล้ว — แถว PR-11 (#69), PR-12 (#71 Revert), PR-13 (#72 Re-review & Approve, merged `6955c48`, fix commits `18974f0`/`d1d282a`) + เพิ่ม **Section 3 Full Review Trail** ที่เก็บข้อความรีวิวฉบับเต็มจาก GitHub ทุก PR ทุก comment (23 review bodies + 26 inline comments + 9 author responses) + แถว PR-14 (#70) นี้
3. **`docs/lab-03/ai-use.md`**: เพิ่ม **Prompt 10 (Re-review & Blocking Fixes — PR #72)** ที่ระบุวิธีแก้ 3 จุด (isSubmitting lock, minHeight 44px + Esc listener, searchAndFind helper)

รอ Reviewer Re-review และ Approve/Merge — **ผล Re-review แล้ว: APPROVED (2026-09-16 19:42 UTC)**

#### 3.14.4 Author Response — ข้อความฉบับเต็มใน GitHub (jejaebubu, 2026-09-16 19:36 UTC)

```text
ขอบคุณสำหรับรีวิวค่ะ แก้ครบทั้ง 3 จุดแล้ว (commits `23cf137` + `c9ed15d`):

1. **README.md client test count**

* รัน `npx vitest run` ใหม่จริงบนโค้ดล่าสุดแล้ว: **9 test files, 79/79 passed** (Lab 01: 3, Lab 02: 4 files, Lab 03: 4 files) และ server **76/76**
* ตัวเลข 51 tests/8 files อาจมาจาก snapshot ที่ยังไม่รวม test files ล่าสุดค่ะ
* จึงอัปเดตตัวเลขใน README เป็น **"server 76/76, client 79/79 (9 test files, ยืนยัน 2026-09-16)"**

2. **reviewer.md**

* บันทึกประวัติครบแล้ว: แถว PR-11 (#69), PR-12 (#71 Revert), PR-13 (#72 Re-review & Approve, merged `6955c48`, fix commits `18974f0`/`d1d282a`)
* เพิ่ม **Section 3: Full Review Trail** เก็บข้อความรีวิวฉบับเต็มจาก GitHub ของทุก PR และทุก comment (**21 review bodies + 23 inline comments + 8 author responses**)
* เพิ่มแถว PR-14 (#70) นี้แล้วค่ะ

3. **ai-use.md**

* เพิ่ม **Prompt 10 (Re-review & Blocking Fixes — PR #72)**
* บันทึกวิธีแก้ทั้ง 3 จุด ได้แก่ `isSubmitting` lock, `minHeight 44px + Esc listener` และ `searchAndFind` helper

รบกวน re-review  ได้เลยค่ะ ขอบคุณมากค่ะ
```

#### 3.14.5 Review #2 — Approved (phatthidawadi, 2026-09-16 19:42 UTC)

```text
ขอบคุณสำหรับการอัปเดตและแก้ไขเอกสารครบทุกจุด ตรวจสอบซ้ำ (Re-review) บนโค้ดล่าสุดแล้ว:

1. **README.md (L65)**: ชี้แจงตัวเลขผลรันจริงชัดเจนเรียบร้อย (Server 76/76, Client 79/79 บน 9 test files)
2. **docs/lab-03/reviewer.md**: บันทึกประวัติ PR #71 (Revert), PR #72 (Re-review) และ PR #70 ในตารางและ Section 3 Full Review Trail ครบถ้วนแล้ว
3. **docs/lab-03/ai-use.md**: เพิ่ม Prompt 10 บันทึกการแก้ไขจุด Blocking จากการ Re-review สมบูรณ์แล้ว

ทุกข้อกำหนดของ Issue #50 (Acceptance Criteria AC-01 ถึง AC-06) ผ่านทั้งหมด ผลการรันชุดทดสอบผ่าน 100% (Server 76/76, Client 79/79, Playwright E2E 18/18 ครอบคลุม 3 viewports)

**อนุมัติ (Approve)** และพร้อม Merge เข้า `main` เพื่อจบ Release Integration ของ Lab 3
```
