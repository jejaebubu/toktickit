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

7. **Prompt 7 (E2E Browser Testing across Viewports)**:
   > "เขียน Playwright E2E สำหรับ Desktop (≥992px), Tablet (768–991px) และ Mobile (<768px) ครอบ E2E-01..04 (auth, mandatory password change, staff workflow, admin user management) บันทึก screenshots หลักฐาน และอัปเดต docs/lab-03/tests.md"

8. **Prompt 8 (E2E Root-Cause & Fix — PATCH state loss / mobile nav)**:
   > "E2E-03 พังตอนกด Claim ที่ Tablet/Mobile: PATCH /api/tickets/:id ไม่คืน attachments/comments → StaffTicketDetail render crash; และ nav ซ่อนต่ำกว่า 992px — แก้โดย merge response เข้า ticket เดิม และเพิ่ม mobile hamburger menu (header-nav-toggle) ให้เลือกเมนูได้บนทุกขนาดจอ"

9. **Prompt 9 (Real Web App Release Integration)**:
   > "รวม feature branches ทั้งหมดผ่าน lab3-staging ไป main (Section 11.1): reset DB, รันชุดทดสอบทั้งหมด (client Vitest, server Vitest, Playwright E2E) บน staging ให้ผ่าน 100% แล้วสร้าง Release PR พร้อมย้ายทุก GitHub issue ไป Done และอัปเดต reviewer.md / ai-use.md เป็นเวอร์ชันสุดท้าย"

---

## 3. Reflection (บทสรุปและการสะท้อนความคิด)

### 3.1 Specification-Agent (การวางแผนจากโจทย์)
การให้ AI วิเคราะห์ Lab Sheet เป็นสัญญาทางวิศวกรรม (Specification/Engineering Contract) ก่อนเขียนโค้ด ช่วยตรึงขอบเขตงานให้ตรงกับ Business Rules (BR-01..BR-14), Authorization Matrix และ Acceptance Criteria ตั้งแต่ต้น — ลดการทำงานผิดจุด และทำให้ reviewer ตรวจสอบได้จากเอกสารก่อนโค้ด โดยเฉพาะความปลอดภัย (RBAC, 404 no-leak, password boundary) ที่ถูกออกแบบไว้เป็นแนวทางชัดเจน

### 3.2 Coding-Agent (การเขียนโค้ดจริง)
AI เร่งการสร้าง Express middleware (authenticateToken / requireRole / checkPasswordChangeState), REST API, และส่วนประกอบ React (Login, ChangePassword, StaffTicketQueue, StaffTicketDetail, UserManagement) ที่รองรับ Zen Green Theme และ Responsive ได้อย่างรวดเร็วและเป็นระบบ สิ่งที่สำคัญที่สุดที่ได้เรียนรู้: **โค้ดที่เขียนผิดชนิดที่ยากจะหา** (เช่น ใช้ `setTicket(updated)` แทนการ merge ส่งผลให้ attachments/comments หายหลัง PATCH) มีเพียงชุดทดสอบ E2E ที่รันบนเบราว์เซอร์จริง + peer review เท่านั้นที่จะจับได้ — AI ควรถูกใช้เป็นผู้ช่วยตรวจแก้ (verifier/fixer) คู่กับมนุษย์เสมอ

### 3.3 สรุป
การผสานกันของ Specification-Agent (ออกแบบ) และ Coding-Agent (เขียน/ทดสอบ) เข้ากับกระบวนการ 1 PR : 1 Issue, Peer Review ผ่าน GitHub และการผสาน feature branches → lab3-staging → main ช่วยให้ Lab 3 ส่งมอบระบบ Authentication/RBAC, ซอร์ส Staff Ticketing และ Admin User Management ครบทุก AC พร้อมหลักฐานการทำงานจริง (E2E 18/18, client 79/79, server 76/76 และ screenshots 3 viewports) ที่เชื่อถือได้และตรวจสอบย้อนกลับได้
