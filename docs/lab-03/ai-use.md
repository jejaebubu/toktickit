# Lab 3 AI Assistance & Reflection Log (บันทึกการใช้งาน AI และบทสรุปการเรียนรู้)

## 1. LLM Identification & Configuration
- **Model Used**: Gemini 3.6 Flash (Medium) / Antigravity Agentic AI Assistant
- **Primary Tasks**: Engineering Specification Generation, DB Schema Design & Migration Planning, REST API Contract Definition, Zen Green Component Architecture, Automated Test Writing (API, UI, E2E).

---

## 2. Key Prompt Log (6-10 Selected Prompts)

1. **Prompt 1 (Specification Analysis)**:
   > "อ่าน lab sheet ของ lab3 ให้ละเอียด วิเคราะห์ความต้องการ functional requirements, business rules (BR-01 ถึง BR-13), acceptance criteria และสร้างเอกสาร specification.md"

2. **Prompt 2 (Database Schema Design)**:
   > "วิเคราะห์การปรับปรุง Prisma Schema ใน schema.prisma เพื่อย้าย RequesterUser ไปเป็น User เพิ่ม role (REQUESTER, IT_STAFF, ADMINISTRATOR), เพิ่ม mustChangePassword, ownerId ใน Ticket, PublicComment และ InternalNote"

3. **Prompt 3 (API Contract Design)**:
   > "ออกแบบ REST API Contract สำหรับ Authentication, Mandatory Password Change, IT Staff Ticket Queue with search/filter/pagination, Comments/Notes และ Admin User Management"

4. **Prompt 4 (Backend Middleware & RBAC Enforcement)**:
   > "สร้าง Express middleware สำหรับยืนยันตัวตน (Authentication) และการตรวจสอบสิทธิ์ตามบทบาท (RBAC) เพื่อป้องกันไม่ให้ Requester เข้าถึง Internal Notes หรือ Admin User APIs"

5. **Prompt 5 (Frontend Zen Green Component Development)**:
   > "สร้างส่วนประกอบ React สำหรับ Login, ChangePassword, StaffTicketQueue, StaffTicketDetail และ UserManagement โดยใช้สไตล์ Zen Green Theme และรองรับ Responsive"

6. **Prompt 6 (Automated Test Suite Creation)**:
   > "สร้างชุดทดสอบ Vitest API integration tests, React Testing Library component tests และ Playwright E2E tests สำหรับสอบทานทุก AC ใน Lab 3"

---

## 3. Reflection (สถิตย์บทสรุปและการสะท้อนความคิด)
การใช้งาน AI Specification & Coding Agent ใน Lab 3 ช่วยเร่งกระบวนการออกแบบสถาปัตยกรรมความปลอดภัย (Authentication & RBAC) การพัฒนา API Contract และการสร้างส่วนประกอบหน้าจอที่ซับซ้อน เช่น Ticket Queue และ User Management ที่รองรับ Responsive และ Zen Green Theme ได้อย่างรวดเร็วและเป็นระบบ นอกจากนี้ AI ยังช่วยการันตีความถูกต้องของโค้ดและการสร้างชุดทดสอบครอบคลุมทุก Acceptance Criteria ทำให้การพัฒนามีประสิทธิภาพและน่าเชื่อถือสูง
