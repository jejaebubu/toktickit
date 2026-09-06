# TokTickIT - ระบบบริการไอทีช่วยเหลือ (IT Service Desk)

TokTickIT คือเว็บแอปพลิเคชันระบบ IT Service Desk พัฒนาด้วย React, TypeScript, Express, Prisma และ PostgreSQL

## โครงสร้างโปรเจกต์

- `client/`: ระบบหน้าบ้าน (Frontend) พัฒนาด้วย React + TypeScript + Vite + Bootstrap
- `server/`: ระบบหลังบ้าน (Backend) พัฒนาด้วย Node.js + Express + TypeScript + Prisma
- `e2e/lab-02/`: ชุดทดสอบ End-to-End (Playwright) สำหรับ Lab 2
- `docs/lab-01/`: เอกสารประกอบการเรียนและหลักฐานการส่งงาน Lab 1
- `docs/lab-02/`: เอกสารประกอบการเรียนและหลักฐานการส่งงาน Lab 2 `specification.md`, `tests.md`, `ui-spec.md`, `api-spec.md`, `reviewer.md`, `ai-use.md`
- `artifacts/lab-02/screenshots/`: หลักฐานภาพหน้าจอ (screenshots) ของ Lab 2

## Branch Workflow

- พัฒนาบน feature branch (`feature/lab02-XX-*`) เสมอ → สร้าง Pull Request เข้า `lab2-staging` → รอ peer review ผ่าน (Approved) → merge
- เมื่อครบทุก Issue แล้วจึง release จาก `lab2-staging` ไปยัง `main` ผ่าน Pull Request

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
npx prisma migrate dev --name init   # รันจากโฟลเดอร์ server (ครั้งแรกเท่านั้น)
npm run seed                         # รัน Prisma seed (idempotent — รันซ้ำได้)
```

### 3. รันในโหมดพัฒนา (server + client พร้อมกัน)

```bash
npm run dev          # รัน server (http://localhost:3000) + client (http://localhost:5173) พร้อมกัน
```

### 4. การรันชุดทดสอบอัตโนมัติ (Unit + API + UI)

```bash
npm test            # รัน test ทั้งหมด (server 37 tests + client 23 tests)
```

หรือรันแยก:

```bash
npm --prefix server test    # API tests (Supertest + Vitest)
npm --prefix client test    # UI tests (Vitest + React Testing Library)
```

### 5. การรันทดสอบ End-to-End (Playwright)

```bash
npm run test:e2e    # รัน seed + build server + ทดสอบ 3 viewports (desktop/tablet/mobile)
```

หมายเหตุ: `test:e2e` จะสร้าง ticket ใหม่ระหว่างทดสอบ และบันทึก screenshot ลง
`artifacts/lab-02/screenshots/` เพื่อใช้เป็นหลักฐานส่งงาน (ผลลัพธ์ที่ควรได้: 3 passed)

## Backend API

- `GET  /api/health` — health check
- `GET  /api/categories` — รายการหมวดหมู่
- `GET  /api/requesters` — รายการผู้ใช้ (Development Requester Selector)
- `GET  /api/related-systems` — รายการระบบที่เกี่ยวข้อง
- `POST /api/tickets` — สร้างตั๋ว
- `GET  /api/tickets` — รายการตั๋ว (search/filter/sort/pagination)
- `GET  /api/tickets/:id` — ดูรายละเอียดตั๋ว
- `GET  /api/tickets/:id/attachments` — รายการไฟล์แนบ
- `POST /api/tickets/:id/attachments` — อัปโหลดไฟล์แนบ
- `GET  /api/attachments/:id/download` — ดาวน์โหลดไฟล์แนบ
- `PATCH /api/attachments/:id` — soft remove ไฟล์แนบพร้อมเหตุผล

รายละเอียดเพิ่มเติม: `docs/lab-02/api-spec.md`