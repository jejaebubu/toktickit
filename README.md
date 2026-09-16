# TokTickIT - ระบบบริการไอทีช่วยเหลือ (IT Service Desk)

TokTickIT คือเว็บแอปพลิเคชันระบบ IT Service Desk พัฒนาด้วย React, TypeScript, Express, Prisma และ PostgreSQL

## โครงสร้างโปรเจกต์

- `client/`: ระบบหน้าบ้าน (Frontend) พัฒนาด้วย React + TypeScript + Vite + Bootstrap
- `server/`: ระบบหลังบ้าน (Backend) พัฒนาด้วย Node.js + Express + TypeScript + Prisma
- `e2e/lab-02/`: ชุดทดสอบ End-to-End (Playwright) สำหรับ Lab 2
- `e2e/lab-03/`: ชุดทดสอบ End-to-End (Playwright) สำหรับ Lab 3 (Login, Staff Ticket Flow, User Administration)
- `docs/lab-01/`: เอกสารประกอบการเรียนและหลักฐานการส่งงาน Lab 1
- `docs/lab-02/`: เอกสารประกอบการเรียนและหลักฐานการส่งงาน Lab 2 `specification.md`, `tests.md`, `ui-spec.md`, `api-spec.md`, `reviewer.md`, `ai-use.md`
- `docs/lab-03/`: เอกสารประกอบการเรียนและหลักฐานการส่งงาน Lab 3 — `specification.md`, `api-spec.md`, `ui-spec.md`, `tests.md`, `reviewer.md`, `ai-use.md`
- `artifacts/lab-02/screenshots/`: หลักฐานภาพหน้าจอ (screenshots) ของ Lab 2
- `artifacts/lab-03/screenshots/`: หลักฐานภาพหน้าจอ (screenshots) ของ Lab 3 แยกตาม feature (auth, staff-queue, staff-ticket-detail, user-management) ครอบ desktop/tablet/mobile

## Branch Workflow

- พัฒนาบน feature branch (`feature/lab03-XX-*`) เสมอ → สร้าง Pull Request เข้า `lab3-staging` → รอ peer review ผ่าน (Approved) → merge
- เมื่อครบทุก Issue แล้วจึง release จาก `lab3-staging` ไปยัง `main` ผ่าน Pull Request (Lab Sheet Section 11.1)

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
npx prisma migrate dev            # สร้าง/อัปเดต schema (เครื่องใหม่ครั้งแรกจะสร้าง migrations)
cd ..
npm run seed                      # รัน Prisma seed (idempotent — รันซ้ำได้)
```

### 3. รันในโหมดพัฒนา (server + client พร้อมกัน)

```bash
npm run dev          # รัน server (http://localhost:3000) + client (http://localhost:5173) พร้อมกัน
```

### 4. การรันชุดทดสอบอัตโนมัติ (Unit + API + UI)

```bash
npm test            # รัน test ทั้งหมด (server 76 tests + client 79 tests)
```

หรือรันแยก:

```bash
npm --prefix server test    # API tests (Supertest + Vitest; DB ต้อง reset + seed ก่อน)
npm --prefix client test    # UI tests (Vitest + React Testing Library)
```

### 5. การรันทดสอบ End-to-End (Playwright)

```bash
npm run test:e2e    # รัน seed + build server + ทดสอบ 3 viewports (desktop/tablet/mobile)
```

หมายเหตุ: `test:e2e` จะสร้าง ticket และผู้ใช้ใหม่ระหว่างทดสอบ และบันทึก screenshot ลง
`artifacts/lab-{02,03}/screenshots/` เพื่อใช้เป็นหลักฐานส่งงาน (ผลลัพธ์ที่ควรได้: lab-02 6 passed + lab-03 12 passed = **18 passed** ต่อ 3 viewports)

## ผู้ใช้เริ่มต้น (Seed) สำหรับ Lab 3

| บทบาท | อีเมล | รหัสผ่าน | หมายเหตุ |
| :--- | :--- | :--- | :--- |
| Requester | `jennifer.west@dome-lab.id` | `DomeLab!23` | สร้าง/view tickets |
| IT Staff | `alex.morgan@dome-lab.id` | `DomeLab!23` | Ticket Queue, claim, comment/note |
| Administrator | `john.doe@dome-lab.id` | `DomeLab!23` | User management |

## Backend API

- `POST /api/auth/login` — ล็อกอิน → JWT token
- `POST /api/auth/logout` — ออกจากระบบ
- `GET  /api/auth/me` — ข้อมูลผู้ใช้ปัจจุบัน
- `POST /api/auth/change-password` — เปลี่ยนรหัสผ่าน (บังคับเมื่อ mustChangePassword)
- `GET  /api/categories` — รายการหมวดหมู่
- `GET  /api/related-systems` — รายการระบบที่เกี่ยวข้อง
- `POST /api/tickets` — สร้างตั๋ว
- `GET  /api/tickets` — รายการตั๋ว (search/filter/sort/pagination; Staff เห็น queue ทั้งหมด, Requester เห็นเฉพาะของตนเอง)
- `GET  /api/tickets/:id` — ดูรายละเอียดตั๋ว
- `PATCH /api/tickets/:id` — Staff: claim/assign, itPriority, status, resolution intent (AC-08)
- `GET  /api/tickets/:id/comments` / `POST .../comments` — public comments
- `GET  /api/tickets/:id/internal-notes` / `POST .../internal-notes` — internal notes (IT Staff เท่านั้น)
- `GET  /api/tickets/:id/attachments` — รายการไฟล์แนบ
- `POST /api/tickets/:id/attachments` — อัปโหลดไฟล์แนบ
- `GET  /api/attachments/:id/download` — ดาวน์โหลดไฟล์แนบ
- `DELETE /api/attachments/:id` — soft remove ไฟล์แนบพร้อมเหตุผล
- `GET  /api/admin/users` / `POST /api/admin/users` — รายการ + สร้างผู้ใช้ (Administrator)
- `PATCH /api/admin/users/:id` — เปิด/ปิดใช้งาน, เปลี่ยน role (Administrator)
- `POST /api/admin/users/:id/reset-password` — ตั้งรหัสผ่านใหม่ (Administrator)

รายละเอียดเพิ่มเติม: `docs/lab-03/api-spec.md`