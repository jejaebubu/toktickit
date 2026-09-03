# Lab 2 Test Plan and Results (แผนการทดสอบและผลการทดสอบ)

## 1. Test Strategy & Coverage (กลยุทธ์การทดสอบ)
การทดสอบแบ่งออกเป็น 4 ระดับ: Unit Tests, API Tests (Supertest), UI Component Tests (Vitest) และ End-to-End Tests (Playwright)

## 2. Planned Test Suite Table (ตารางแผนการทดสอบทั้งหมด)

| Test ID | Type | Target AC / Requirement | Description (สิ่งที่ทดสอบ) | Target Test File | Expected Result | Final Status |
|---|---|---|---|---|---|---|
| **API-01** | API | AC-01 | สร้างตั๋วใหม่สำเร็จ คืนค่า HTTP 201 พร้อม Ticket Number | `server/tests/lab-02/create-ticket.api.test.ts` | 201 Created | PASS |
| **API-02** | API | AC-01 | ปฏิเสธการสร้างตั๋วหากขาดฟิลด์บังคับ | `server/tests/lab-02/create-ticket.api.test.ts` | 400 Bad Request | PASS |
| **API-03** | API | AC-03 | ปฏิเสธการเข้าถึงตั๋วของ Requester คนอื่น (Ownership Protection) | `server/tests/lab-02/ticket-detail.api.test.ts` | 403 / 404 | PASS |
| **API-04** | API | AC-04 | บล็อกการอัปโหลดไฟล์ขนาดใหญ่เกิน 5MB หรือผิดประเภท | `server/tests/lab-02/attachments.api.test.ts` | 400 Bad Request | PASS |
| **API-05** | API | AC-05 | ทำ Soft Removal ไฟล์แนบสำเร็จ และไม่อนุญาตให้ดาวน์โหลดไฟล์ที่ลบไปแล้ว | `server/tests/lab-02/attachments.api.test.ts` | 200 OK | PASS |
| **UI-01** | UI | AC-02 | แสดงหน้า Requester Selector เมื่อยังไม่ได้เลือกผู้ใช้ | `client/src/tests/lab-02/RequesterSelector.test.tsx` | Selector Shown | PASS |
| **UI-02** | UI | AC-01 | ฟอร์ม Create Ticket แสดงดอกจันสีแดงและข้อความเตือนเมื่อข้อมูลไม่ครบ | `client/src/tests/lab-02/CreateTicket.test.tsx` | Validation Shown | PASS |
| **UI-03** | UI | AC-01 | ปุ่ม Submit แสดงสถานะ Busy ขณะกำลังส่งข้อมูล | `client/src/tests/lab-02/CreateTicket.test.tsx` | Disabled & Loading | PASS |
| **UI-04** | UI | AC-05 | แสดงสถานะ `[Removed]` สำหรับไฟล์แนบที่ถูก Soft-removed | `client/src/tests/lab-02/AttachmentSection.test.tsx` | Metadata Shown | PASS |
| **E2E-01** | E2E | AC-01, AC-03 | ทดสอบการทำงานครบวงจรตั้งแต่สลับผู้ใช้ -> สร้างตั๋ว -> ค้นหาตั๋ว -> ลบไฟล์แนบ | `e2e/lab-02/requester-ticket-flow.spec.ts` | Full Flow Success | PASS |

## 3. Acceptance Criteria Traceability (การเชื่อมโยง AC กับ Test)
- **AC-01**: ครอบคลุมด้วย API-01, API-02, UI-02, UI-03, E2E-01
- **AC-02**: ครอบคลุมด้วย UI-01
- **AC-03**: ครอบคลุมด้วย API-03, E2E-01
- **AC-04**: ครอบคลุมด้วย API-04
- **AC-05**: ครอบคลุมด้วย API-05, UI-04, E2E-01

## 4. Test Commands
```bash
# รัน API Tests ฝั่ง Backend
cd server && npm test

# รัน UI Tests ฝั่ง Frontend
cd client && npm test

# รัน E2E Tests
npm run test:e2e
```
