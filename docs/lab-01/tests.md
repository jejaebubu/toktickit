# Lab 1 — แผนการทดสอบและหลักฐานการรัน (Test Plan and Evidence)

ไฟล์ชุดทดสอบทั้งหมดเก็บไว้ในโฟลเดอร์ `server/tests/lab-01/` และ `client/tests/lab-01/`

| ลำดับ | เครื่องมือ (Tool) | รายการทดสอบ (Test Description) | ผลการทดสอบ (Result) |
|---|------|------|--------|
| 1 | Supertest | GET /api/health ส่งคืนสถานะ 200 OK และ { status: "ok", service: "TokTickIT API" } | PASS |
| 2 | Supertest | GET /api/categories ส่งคืนหมวดหมู่เริ่มต้น 4 รายการ เรียงตาม ID | PASS |
| 3 | Vitest | หน้าจอ React แสดงหัวข้อ TokTickIT อย่างถูกต้อง | PASS |
| 4 | Vitest | เมื่อกดปุ่ม Check System แสดงสถานะ Online พร้อมรายการหมวดหมู่ | PASS |
| 5 | Vitest | เมื่อ API มีปัญหา แสดงสถานะ Offline พร้อมข้อความแจ้งเตือนข้อผิดพลาด | PASS |

## ผลการรันชุดทดสอบใน Terminal (Terminal Output)

```
✓ server/tests/lab-01/health.test.ts (1)
  ✓ GET /api/health > returns 200 with status ok and the service name

✓ server/tests/lab-01/categories.test.ts (1)
  ✓ GET /api/categories > returns the four seeded categories in id order

✓ client/tests/lab-01/App.test.tsx (3)
  ✓ App > renders the TokTickIT heading
  ✓ App > shows Online and the seeded categories on success
  ✓ App > shows an Offline error message when the API is unavailable
```
