# Lab 2 — รายงานการใช้ AI และข้อคิดเห็น (AI Use and Reflection)

**ผู้ช่วย AI Coding Agent ที่ใช้:** Antigravity (โมเดล Gemini 3.6 Flash / Claude Sonnet 4.6)

## รายการ Prompts สำคัญที่เลือกใช้ (6–10 ข้อ)

| ลำดับ | คำสั่งที่ใช้ (Prompt Summarised) | ผลลัพธ์และการนำไปใช้งาน |
|---|----------------------------------|------------------------|
| 1 | วิเคราะห์โจทย์วิศวกรรมซอฟต์แวร์ Lab 2 และซอยย่อยงานเป็น 9 Issues | AI ช่วยวิเคราะห์ข้อกำหนดในชีตอาจารย์และวางแผนโครงสร้าง 9 Issues ได้สอดคล้องกับตารางคะแนน |
| 2 | ยกร่างเอกสารข้อกำหนดสปรินต์ `specification.md`, `ui-spec.md`, `api-spec.md`, `tests.md` | AI ช่วยเขียนข้อกำหนด BR-01.., AC-01.. (Given-When-Then), REST API และ Zen Green UI Theme |
| 3 | ออกแบบ Prisma Schema สำหรับ `RequesterUser`, `Ticket`, `Attachment`, `RelatedSystem` | AI ออกแบบโมเดลความสัมพันธ์และฟิลด์ต่างๆ สำหรับสร้าง Migration |
| 4 | พัฒนาสคริปต์ `seed.ts` สำหรับใส่ข้อมูลเริ่มต้นอย่างปลอดภัย (Idempotent) | AI เขียนฟังก์ชัน `upsert` สำหรับใส่ข้อมูลหมวดหมู่ ระบบที่เกี่ยวข้อง และผู้ใช้จำลอง |
| 5 | พัฒนา REST API และหน้าจอเลือกผู้ใช้จำลอง (Requester Selector) | AI พัฒนา API `GET /api/requesters` และหน้าจอเปลี่ยน Context ผู้ใช้ |
| 6 | พัฒนาฟังก์ชันสร้างตั๋ว (Create Ticket) พร้อมสุ่มเลขตั๋วและ Validation | AI สร้าง API `POST /api/tickets`, ระบบออกเลข `TKT-2025-XXXXXX` และหน้าฟอร์ม Zen Green |
| 7 | พัฒนาตารางตั๋ว (My Tickets) พร้อม Search, Filter, Sort & Pagination | AI สร้าง API และ UI หน้า My Tickets รองรับพารามิเตอร์ค้นหา กรอง จัดเรียง และแบ่งหน้า |
| 8 | พัฒนาการจัดการไฟล์แนบและสิทธิ์ความเป็นเจ้าของตั๋ว (Soft Removal) | AI สร้าง API เช็คสิทธิ์ 403/404 และระบบ Soft removal ไฟล์แนบพร้อมบันทึกเหตุผล |

## ข้อคิดเห็นและการสะท้อนความคิด (Reflection)

การใช้ AI ใน Lab 2 ช่วยให้การยกร่างเอกสารและสเปกทางวิศวกรรมเป็นระบบมากขึ้น โดยเฉพาะการกำหนด Given-When-Then ใน Acceptance Criteria และการระบุ HTTP Status Codes ใน API Spec ความท้าทายหลักคือการควบคุมไม่ให้ AI เขียนโค้ดข้ามขั้นตอน และการกำกับดูแลให้ PR แต่ละอันมีขนาดเล็กเพื่อให้เพื่อนในกลุ่ม Review ได้อย่างมีประสิทธิภาพ
