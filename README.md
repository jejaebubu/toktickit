# TokTickIT - ระบบบริการไอทีช่วยเหลือ (IT Service Desk)

TokTickIT คือเว็บแอปพลิเคชันระบบ IT Service Desk พัฒนาด้วย React, TypeScript, Express, Prisma และ PostgreSQL

## โครงสร้างโปรเจกต์

- `client/`: ระบบหน้าบ้าน (Frontend) พัฒนาด้วย React + TypeScript + Vite + Bootstrap
- `server/`: ระบบหลังบ้าน (Backend) พัฒนาด้วย Node.js + Express + TypeScript + Prisma
- `docs/lab-01/`: เอกสารประกอบการเรียนและหลักฐานการส่งงาน Lab 1

## สิ่งที่ต้องเตรียมก่อนเริ่มรันระบบ

- Node.js (เวอร์ชัน 18 ขึ้นไป)
- เซิร์ฟเวอร์ PostgreSQL Database

## ขั้นตอนการติดตั้งและใช้งาน

### 1. การติดตั้งฝั่ง Frontend (`client`)

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

ระบบหน้าบ้านจะทำงานที่ URL: `http://localhost:5173`

### 2. การติดตั้งฝั่ง Backend (`server`)

```bash
cd server
npm install
cp .env.example .env
```

ตรวจสอบว่า PostgreSQL ทำงานอยู่ และตั้งค่า `DATABASE_URL` ใน `server/.env` ให้ถูกต้อง

```bash
# รันการย้ายโครงสร้างฐานข้อมูล (Migration) และใส่ข้อมูลเริ่มต้น (Seed)
npx prisma migrate dev --name init
npx prisma db seed

# เริ่มรันระบบหลังบ้านในโหมดพัฒนา
npm run dev
```

ระบบหลังบ้านจะทำงานที่ URL: `http://localhost:3000`

### 3. การรันชุดทดสอบอัตโนมัติ (Automated Tests)

```bash
# รันการทดสอบระบบหน้าบ้าน (Vitest)
cd client
npm test

# รันการทดสอบระบบหลังบ้าน (Supertest)
cd server
npm test
```
