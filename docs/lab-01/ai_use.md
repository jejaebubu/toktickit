# Lab 1 — รายงานการใช้ AI และข้อคิดเห็น (AI Use and Reflection)

**ผู้ช่วย AI Coding Agent ที่ใช้:** opencode (AI coding agent CLI)

## รายการ Prompts สำคัญที่เลือกใช้ (6–10 ข้อ)

| ลำดับ | คำสั่งที่ใช้ (Prompt Summarised) | ผลลัพธ์และการนำไปใช้งาน |
|---|----------------------------------|------------------------|
| 1 | วางแผนการพัฒนาระบบ TokTickIT Lab 1 ตามข้อกำหนด 4 Issues | AI สร้างแผนการทำงาน implementation_plan.md และลำดับขั้นตอน Git Workflow |
| 2 | ติดตั้ง dependencies และตั้งค่าโปรเจกต์ React, Vite, Express, Prisma | AI สร้างโครงสร้างโปรเจกต์และไฟล์ตั้งค่าเบื้องต้น |
| 3 | พัฒนา REST API `GET /api/health` สำหรับตรวจสอบสถานะระบบ | AI เขียนโค้ดใน server/src/app.ts และรัน Supertest ผ่าน |
| 4 | สร้าง Prisma Model `Category` และทำการ Seed ข้อมูล 4 หมวดหมู่ | AI สร้าง schema.prisma, migration และ seed.ts โดยใช้ upsert ป้องกันข้อมูลซ้ำ |
| 5 | พัฒนา REST API `GET /api/categories` และเขียนชุดทดสอบ Supertest | AI ดึงข้อมูลจาก PostgreSQL ผ่าน Prisma และเขียนเคสทดสอบใน categories.test.ts |
| 6 | สร้างหน้าจอ React แสดงปุ่ม [Check System] และแสดงผลตามสถานะ | AI เขียนโค้ดใน App.tsx จัดการสถานะ loading, success, error และแสดงผลสวยงาม |
| 7 | เขียนชุดทดสอบ UI ด้วย Vitest สำหรับกรณีโหลดสำเร็จและเกิดข้อผิดพลาด | AI เขียน App.test.tsx และ Mock ฟังก์ชัน API เพื่อทดสอบเคสต่างๆ |

## ข้อคิดเห็นและการสะท้อนความคิด (Reflection)

การใช้ AI Coding Agent ในโปรเจกต์นี้ช่วยลดเวลาในการจัดโครงสร้างไฟล์และการเขียนโค้ดเริ่มต้นได้อย่างมาก สิ่งที่ทำให้ Prompt มีประสิทธิภาพมากขึ้นคือการระบุข้อกำหนดของโจทย์อย่างชัดเจน (เช่น ชื่อ Branch, URL path, ชื่อ field และชนิดข้อมูล) ทั้งนี้ผู้พัฒนาต้องคอยตรวจสอบการทำงานของโค้ดที่สร้างขึ้น รันชุดทดสอบอัตโนมัติด้วยตนเองเสมอ และกำกับการทำ Git Flow ให้ตรงตามเกณฑ์ของวิชา
