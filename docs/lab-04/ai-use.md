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

*(Prompts 6 ถึง 10 จะถูกบันทึกเพิ่มเติมตามลำดับการพัฒนาจริงใน Issue #3 ถึง #11)*

---

## 3. Reflection (บทสรุปและการสะท้อนความคิด)

### 3.1 Specification-Agent (การวางแผนจากโจทย์)
การใช้ AI วิเคราะห์และแปลง Lab Sheet ให้กลายเป็น Engineering Contract ที่รัดกุมก่อนเริ่มเขียนโค้ดช่วยป้องกันปัญหาความเข้าใจคลาดเคลื่อน โดยเฉพาะประเด็นเรื่อง Parent-Child relationship ของ Actions Taken, การรักษาความเป็นส่วนตัวของข้อมูลบน Requester Dashboard (Ownership Protection), และการสร้าง Resolution Gate ที่ Requester สามารถแจ้งว่าปัญหาได้รับการแก้ไขแล้วได้ แต่ไม่สามารถเปลี่ยนสถานะตั๋วเป็น Resolved ได้เองโดยตรง การกำหนดรายละเอียดเหล่านี้ไว้ในระดับสเปกช่วยให้ทีมพัฒนาและ Reviewer มีเกณฑ์ที่ตรงกันอย่างชัดเจน

### 3.2 Coding-Agent (การเขียนโค้ดจริง)
*(จะสรุปบทเรียนและประสบการณ์จากการพัฒนาและแก้ไขข้อผิดพลาดในระหว่างรอบการพัฒนาของแต่ละ Issue)*

### 3.3 สรุป
*(จะสรุปภาพรวมของทั้งสปรินต์เมื่อรวมโค้ดเข้าสู่สาขา main สำเร็จ)*

