# Lab 1 — แผนการทดสอบและหลักฐานการรัน (Test Plan and Evidence)

ไฟล์ชุดทดสอบทั้งหมดเก็บไว้ในโฟลเดอร์ `server/tests/lab-01/` และ `client/tests/lab-01/`

| ลำดับ | เครื่องมือ (Tool) | รายการทดสอบ (Test Description) | ผลการทดสอบ (Result) |
|---|------|------|--------|
| 1 | Supertest | GET /api/health ส่งคืนสถานะ 200 OK และ { status: "ok", service: "TokTickIT API" } | PASS |
| 2 | Supertest | GET /api/categories ส่งคืนหมวดหมู่เริ่มต้น 4 รายการ เรียงตาม ID (ตรวจชื่อ + ลำดับ id ขึ้น) | PASS |
| 3 | Supertest | GET /api/categories เรียงตาม ID ขึ้น ไม่ใช่เรียงตามชื่อ (เพิ่มหมวดหมู่พิเศษเพื่อตรวจสอบ) | PASS |
| 4 | Supertest | GET /api/categories เมื่อไม่มีข้อมูล ส่งคืนอาร์เรย์ว่าง [] | PASS |
| 5 | Supertest | GET /api/categories เมื่อฐานข้อมูลมีปัญหา ส่งคืน 500 พร้อมข้อความปลอดภัย ไม่เปิดเผยรายละเอียด | PASS |
| 6 | Vitest | หน้าจอ React แสดงหัวข้อ TokTickIT อย่างถูกต้อง | PASS |
| 7 | Vitest | เมื่อกดปุ่ม Check System แสดงสถานะ Online พร้อมรายการหมวดหมู่ | PASS |
| 8 | Vitest | เมื่อ API มีปัญหา แสดงสถานะ Offline พร้อมข้อความแจ้งเตือนข้อผิดพลาด | PASS |

## ผลการรันชุดทดสอบใน Terminal (Terminal Output)

```
✓ server/tests/lab-01/categories-error.test.ts (1)
✓ server/tests/lab-01/categories.test.ts (3)
✓ server/tests/lab-01/health.test.ts (1)

Test Files  3 passed (3)
Tests  5 passed (5)

✓ client/tests/lab-01/App.test.tsx (3)
  ✓ App > renders the TokTickIT heading
  ✓ App > shows Online and the seeded categories on success
  ✓ App > shows an Offline error message when the API is unavailable

Test Files  1 passed (1)
Tests  3 passed (3)
```

หมายเหตุ: ชุดทดสอบ server รันซ้ำได้หลายรอบโดยไม่เกิดผลข้างเคียง (test isolation) เนื่องจากหลังทดสอบเคสฐานข้อมูลว่าง ระบบจะคืนค่าข้อมูลหมวดหมู่เป็นอัตโนมัติ