# TokTickIT - ระบบบริการไอทีช่วยเหลือ (IT Service Desk)

TokTickIT คือเว็บแอปพลิเคชันระบบ IT Service Desk พัฒนาด้วย React, TypeScript, Express, Prisma และ PostgreSQL

## โครงสร้างโปรเจกต์

- `client/`: ระบบหน้าบ้าน (Frontend) พัฒนาด้วย React + TypeScript + Vite + Bootstrap (ธีม Zen Green)
- `server/`: ระบบหลังบ้าน (Backend) พัฒนาด้วย Node.js + Express + TypeScript + Prisma ORM
- `e2e/lab-02/`: ชุดทดสอบ End-to-End (Playwright) สำหรับ Lab 2
- `e2e/lab-03/`: ชุดทดสอบ End-to-End (Playwright) สำหรับ Lab 3 (Login, Staff Ticket Flow, User Administration)
- `e2e/lab-04/`: ชุดทดสอบ End-to-End (Playwright) สำหรับ Lab 4 (Actions Taken, Ticket Resolution Gate, Role Dashboards)
- `docs/lab-01/`: เอกสารประกอบการเรียนและหลักฐานการส่งงาน Lab 1
- `docs/lab-02/`: เอกสารประกอบการเรียนและหลักฐานการส่งงาน Lab 2
- `docs/lab-03/`: เอกสารประกอบการเรียนและหลักฐานการส่งงาน Lab 3
- `docs/lab-04/`: เอกสารประกอบการเรียนและหลักฐานการส่งงาน Lab 4 — `specification.md`, `api-spec.md`, `ui-spec.md`, `tests.md`, `reviewer.md`, `ai-use.md`
- `artifacts/lab-02/screenshots/`: หลักฐานภาพหน้าจอ (screenshots) ของ Lab 2
- `artifacts/lab-03/screenshots/`: หลักฐานภาพหน้าจอ (screenshots) ของ Lab 3
- `artifacts/lab-04/screenshots/`: หลักฐานภาพหน้าจอ Full Page (screenshots) ของ Lab 4 ครบทั้ง 3 viewports (desktop, tablet, mobile) ใน 3 หมวด (actions-taken, dashboards, workflow) รวม 24 ภาพ

## Branch Workflow

- พัฒนาบน feature branch (`feature/lab04-issue*-*`) เสมอ → สร้าง Pull Request เข้า `lab4-staging` → รอ peer review ผ่าน (Approved) → merge (กติกา 1 PR : 1 Issue)
- เมื่อครบทุก Issue แล้วจึง release จาก `release/lab04-staging-to-main` ไปยัง `main` ผ่าน Pull Request (Lab Sheet Section 11.1)

## สิ่งที่ต้องเตรียมก่อนเริ่มรันระบบ

- Node.js (เวอร์ชัน 18 ขึ้นไป)
- เซิร์ฟเวอร์ PostgreSQL Database

## ขั้นตอนการติดตั้งและใช้งาน

### 1. ติดตั้ง dependencies (root, client, server)

```bash
npm install        # root (ใช้สำหรับสคริปต์รวมด้านล่าง)

cd client
npm install
cp .env.example .env
cd ..

cd server
npm install
cp .env.example .env
cd ..
```

ตรวจสอบว่า PostgreSQL ทำงานอยู่ และตั้งค่า `DATABASE_URL` ใน `server/.env` ให้ถูกต้อง

### 2. รัน Migration และ Seed ข้อมูลเริ่มต้น

```bash
cd server
npx prisma migrate dev            # รัน Prisma migrations (รวม schema Lab 1–4)
cd ..
npm run seed                      # รัน Prisma seed (idempotent — รันซ้ำได้ปลอดภัย)
```

### 3. รันในโหมดพัฒนา (server + client พร้อมกัน)

```bash
npm run dev          # รัน server (http://localhost:3000) + client (http://localhost:5173) พร้อมกัน
```

### 4. การรันชุดทดสอบอัตโนมัติ (Unit + API + UI)

```bash
npm test            # รัน unit & integration tests ทั้งหมด (Server 112 passed + Client 96 passed)
```

หรือรันแยกส่วน:

```bash
npm --prefix server test    # API tests (Supertest + Vitest; 21 test files / 112 passed 100%)
npm --prefix client test    # UI tests (Vitest + React Testing Library; 16 test files / 96 passed 100%)
```

### 5. การรันทดสอบ End-to-End (Playwright)

```bash
npm run test:e2e    # รัน seed + build server + E2E 3 viewports (desktop/tablet/mobile)
```

หรือรันเจาะจง Lab 4:
```bash
npx playwright test e2e/lab-04
```

> หมายเหตุ: ชุดทดสอบ E2E ของทั้งระบบรวม 27 runs (Lab 2: 6 runs, Lab 3: 12 runs, Lab 4: 9 runs บน Desktop 1280×800, Tablet 820×1180, Mobile 393×851) ผ่านครบ 100% ปราศจาก Horizontal Overflow

## ผู้ใช้เริ่มต้น (Seed Data)

รหัสผ่านของทุกบัญชีที่ seed สร้างคือ `Password123!`

| บทบาท | อีเมล | รหัสผ่าน | หน้าที่และสิทธิการใช้งาน |
| :--- | :--- | :--- | :--- |
| Requester | `jennifer@toktickit.com` | `Password123!` | Requester Dashboard, ส่งตั๋ว, ดูตั๋วของตนเอง (Actions Taken read-only, Advisory flag) |
| Requester | `michael@toktickit.com` | `Password123!` | Requester User |
| Requester | `sarah@toktickit.com` | `Password123!` | Requester User |
| Requester | `david.lee@toktickit.com` | `Password123!` | Requester User |
| Requester (inactive) | `inactive.requester@toktickit.com` | `Password123!` | ทดสอบ login ถูกปฏิเสธ 401 |
| IT Staff | `alex.it@toktickit.com` | `Password123!` | IT Staff Dashboard, Ticket Queue, Actions Taken (Create/Edit/Complete/Cancel), Resolution Gate |
| IT Staff | `kevin.it@toktickit.com` | `Password123!` | IT Staff User |
| IT Staff | `emily.it@toktickit.com` | `Password123!` | IT Staff User |
| IT Staff (inactive) | `inactive.it@toktickit.com` | `Password123!` | ทดสอบการปฏิเสธ Assignee ที่ไม่ active (422) |
| Administrator | `admin@toktickit.com` | `Password123!` | IT Staff Dashboard, User Management, Ticket Queue, Full Control |
| Requester (first login) | `newuser@toktickit.com` | `Password123!` | มี `mustChangePassword = true` — บังคับเปลี่ยนรหัสผ่านก่อนเข้าสู่ระบบ |

## ฟีเจอร์หลักของ TokTickIT Lab 4

1. **Actions Taken Lifecycle**:
   - บันทึกประวัติการปฏิบัติงานภายใต้ตั๋วงานสำหรับเจ้าหน้าที่ไอที (Parent-Child)
   - ฟิลด์: วันที่-เวลา, ผู้ปฏิบัติงาน (`performedBy`), ผู้รับมอบหมาย (`assignee`), รายละเอียด (`actionDescription`), ผลลัพธ์ (`result`), สถานะ (`PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`), การติดตามงาน (`followUpRequired`, `followUpNote`), และบันทึกไฟล์แนบ (`attachmentNotes`)
   - กฎ Validation: `result` บังคับกรอกเฉพาะเมื่อ Action เป็น `COMPLETED` (BR-16) และ `followUpNote` บังคับกรอกเมื่อเลือก follow-up
   - ป้องกันการมอบหมายให้ผู้ใช้ที่ไม่ active หรือ Requester ด้วย HTTP 422 Unprocessable Entity
   - Requester สามารถดูประวัติได้แบบ Read-only เพื่อความโปร่งใส (404 no-leak เมื่อเข้าถึงตั๋วผู้อื่น)
2. **Ticket Workflow & Resolution Gate**:
   - 9-state Transition Matrix พร้อมการควบคุมวงจรสถานะตั๋วอย่างเคร่งครัด
   - **Resolution Gate**: บล็อกไม่ให้เจ้าหน้าที่เปลี่ยนสถานะตั๋วเป็น `Resolved` หากยังมี Actions Taken ค้างอยู่ในสถานะ `PENDING` หรือ `IN_PROGRESS` (HTTP 409 `UNRESOLVED_ACTIONS_EXIST`) พร้อม Modal แจ้งเตือนบน UI
   - **Requester Advisory Flag**: Requester สามารถกดแจ้ง "My problem is resolved" เพื่อขึ้นป้าย Advisory ให้เจ้าหน้าที่รับทราบ โดยตั๋วจะไม่ถูกแอบปิดเอง
   - Concurrency Check: ป้องกันการบันทึกทับข้อมูลเก่าด้วย `expectedUpdatedAt` (409 Stale Update)
3. **Role-Appropriate Dashboards**:
   - **IT Staff Dashboard**: ตัวชี้วัดคิวงาน 5 ด้าน (New, Open, In Progress, Waiting for Requester, My Assigned) พร้อม Recent Queue Tickets และ Quick Actions รองรับ Drill-down ไปยัง Ticket Queue แบบฟิลเตอร์อัตโนมัติ
   - **Requester Dashboard**: ตัวชี้วัดตั๋วของตนเอง 4 ด้าน (My Open, In Progress, Resolved, Closed) พร้อม Recent Tickets, Quick Actions (+ Create Ticket, View My Tickets) และ Empty State CTA
4. **Design System & Accessibility (Zen Green & WCAG 2.1 AA)**:
   - ดีไซน์สวยงามตามหลัก Zen Green Theme (`#006B3C` Primary)
   - คอนทราสต์สีผ่านเกณฑ์ WCAG 2.1 AA ($\ge 4.5:1$)
   - Touch Target Sizes ทุกปุ่มและ Form Input $\ge 44 \times 44\text{px}$
   - ฟอร์มมี `aria-required="true"` และเชื่อม Label ด้วย `htmlFor` ถูกต้อง
   - ปราศจาก Horizontal Overflow บนทุก Viewports (Desktop $\ge 1280\text{px}$, Tablet $768\text{px}-1279\text{px}$, Mobile $< 768\text{px}$)

รายละเอียดทางเทคนิคเพิ่มเติม: ดูได้ใน [`docs/lab-04/`](docs/lab-04/) (`specification.md`, `api-spec.md`, `ui-spec.md`, `tests.md`, `reviewer.md`, `ai-use.md`)