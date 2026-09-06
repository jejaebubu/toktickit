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
| **UI-01** | UI | AC-02 | แสดงหน้า Requester Selector เมื่อยังไม่ได้เลือกผู้ใช้ | `client/tests/lab-02/RequesterSelector.test.tsx` | Selector Shown | PASS |
| **UI-02** | UI | AC-01 | ฟอร์ม Create Ticket แสดงดอกจันสีแดงและข้อความเตือนเมื่อข้อมูลไม่ครบ | `client/tests/lab-02/CreateTicket.test.tsx` | Validation Shown | PASS |
| **UI-03** | UI | AC-01 | ปุ่ม Submit แสดงสถานะ Busy ขณะกำลังส่งข้อมูล | `client/tests/lab-02/CreateTicket.test.tsx` | Disabled & Loading | PASS |
| **UI-04** | UI | AC-05 | แสดงสถานะ `[Removed]` สำหรับไฟล์แนบที่ถูก Soft-removed | `client/tests/lab-02/AttachmentSection.test.tsx` | Metadata Shown | PASS |
| **UI-05** | UI | FR-05, FR-08 | My Tickets แสดงตาราง (Desktop) พร้อม Ticket No., Date, Summary, Category, Priority, Status และสรุปจำนวนรวม | `client/tests/lab-02/MyTicketsList.test.tsx` | Table/Badges/Total Shown | PASS |
| **UI-06** | UI | FR-06, FR-07 | กล่องค้นหา และ Dropdown ตัวกรอง (Category/Priority/Status) ส่ง Query Params ถูกต้องไปยัง API | `client/tests/lab-02/MyTicketsList.test.tsx` | Correct Params Sent | PASS |
| **UI-07** | UI | FR-08 | Pagination Previous/Next และปุ่มเลขหน้าเปลี่ยนหน้าได้ถูกต้อง (และ Prev Disabled บนหน้าแรก) | `client/tests/lab-02/MyTicketsList.test.tsx` | Page Change Works | PASS |
| **UI-08** | UI | FR-05 | Empty State (ยังไม่มีตั๋ว) และ No-Results State (ค้นหา/กรองไม่เจอ) แสดงข้อความต่างกันถูกต้อง | `client/tests/lab-02/MyTicketsList.test.tsx` | Empty / No-Results Shown | PASS |
| **UI-09** | UI | FR-08 | Dropdown Sort By และปุ่มสลับ Ascending/Descending ส่ง `sort`/`order` ถูกต้อง | `client/tests/lab-02/MyTicketsList.test.tsx` | Sort/Order Correct | PASS |
| **UI-10** | UI | AC-01 | API พัง (500) → แสดงกล่องแจ้งเตือนสีแดง `my-tickets-error` พร้อมข้อความมีเหตุผล | `client/tests/lab-02/MyTicketsList.test.tsx` | Error Alert Shown | PASS |
| **UI-11** | UI | FR-08 | Regression: ค้นหา/กรองใหม่จากหน้าที่ >1 ต้องรีเซ็ตกลับหน้า 1 เสมอ (ไม่ทิ้งผลลัพธ์ว่างเพราะค้างหน้า) | `client/tests/lab-02/MyTicketsList.test.tsx` | Page Reset to 1 | PASS |
| **UI-12** | UI | AC-03 | หน้าจอว่าเปิด Ticket Detail อ่านอย่างเดียว: แสดงหมายเลขตั๋ว, สถานะ, สรุปรายละเอียด, priority, ตารางข้อมูล และส่วน Attachments | `client/tests/lab-02/TicketDetail.test.tsx` | Detail Rendered | PASS |
| **UI-13** | UI | AC-03 | เข้าถึงตั๋วคนอื่น → backend 403 → แสดงกล่องข้อผิดพลาดสีแดงพร้อมปุ่มกลับไป My Tickets | `client/tests/lab-02/TicketDetail.test.tsx` | 403 Alert Shown | PASS |
| **UI-14** | UI | AC-01 | API พัง (500) ตอนโหลด Detail → แสดงกล่องแจ้งเตือนสีแดง `detail-error` | `client/tests/lab-02/TicketDetail.test.tsx` | Error Alert Shown | PASS |
| **UI-15** | UI | AC-04 | อัปโหลดไฟล์: เลือกไฟล์ → POST attachments → รายการอัปเดต + แจ้งผลสำเร็จ | `client/tests/lab-02/AttachmentSection.test.tsx` | Upload Succeeds | PASS |
| **UI-16** | UI | AC-04 | เลือกไฟล์ประเภทไม่ถูกต้อง → แจ้ง Error ไม่ส่งคำขอ API | `client/tests/lab-02/AttachmentSection.test.tsx` | Blocked Locally | PASS |
| **UI-17** | UI | AC-05 | Soft Remove: ต้องระบุเหตุผล ก่อนยืนยัน → DELETE + reason → แสดง `[Removed]` และแจ้งผลสำเร็จ | `client/tests/lab-02/AttachmentSection.test.tsx` | Removed + Notice | PASS |
| **API-06** | API | FR-05 | My Tickets คืนเฉพาะตั๋วของ Requester ปัจจุบัน (Ownership Filtering) พร้อม `meta` | `server/tests/lab-02/my-tickets.api.test.ts` | 200 OK | PASS |
| **API-07** | API | FR-06 | ค้นหา `search` ตรง `ticketNumber` และ `summary` แบบ case-insensitive | `server/tests/lab-02/my-tickets.api.test.ts` | 200 OK, ผลลัพธ์ถูกต้อง | PASS |
| **API-08** | API | FR-07 | กรองด้วย `category`, `priority`, `status` | `server/tests/lab-02/my-tickets.api.test.ts` | 200 OK, เฉพาะรายการที่ตรง | PASS |
| **API-09** | API | FR-08 | จัดเรียง `sort`/`order` และแบ่งหน้า `page`/`limit` พร้อม `totalPages` | `server/tests/lab-02/my-tickets.api.test.ts` | 200 OK, ลำดับ/หน้าถูกต้อง | PASS |
| **API-10** | API | FR-08 | ปฏิเสธพารามิเตอร์ไม่ถูกต้อง (`page=0`, `limit>50`, `sort`/`order`/`priority` ผิด) | `server/tests/lab-02/my-tickets.api.test.ts` | 400 Bad Request | PASS |
| **API-11** | API | AC-03, FR-05 | ปฏิเสธเมื่อไม่มี Header หรือ Requester inactive (Ownership & Active Check) | `server/tests/lab-02/my-tickets.api.test.ts` | 400 Bad Request | PASS |
| **API-12** | API | AC-03 | ดึงรายละเอียดตั๋วสำเร็จ 200 พร้อมข้อมูลครบ (category/relatedSystem/requester/attachments) | `server/tests/lab-02/ticket-detail.api.test.ts` | 200 OK, ข้อมูลถูกต้อง | PASS |
| **API-13** | API | AC-03, AC-04 | ปฏิเสธการดู/อัปโหลด/ลบ ของต้อง Ownership ตรงตาม X-Requester-Id (403) + ไม่พบตั๋ว/ไฟล์ (404) | `server/tests/lab-02/ticket-detail.api.test.ts`, `server/tests/lab-02/attachments.api.test.ts` | 403 / 404 | PASS |
| **API-14** | API | AC-04 | อัปโหลดไฟล์ JPG/PNG/WEBP/PDF สำเร็จ (201), ดาวน์โหลดได้ (200 + Content-Disposition), เกิน 5MB/ผิดประเภท/ครบ 5 ไฟล์ → 400 | `server/tests/lab-02/attachments.api.test.ts` | 201 / 400 | PASS |
| **API-15** | API | AC-05 | Soft Remove (DELETE + reason) สำเร็จ → isRemoved=true; ไฟล์ที่ลบแล้วดาวน์โหลดไม่ได้ (400), ลบไม่ใส่ reason → 400 | `server/tests/lab-02/attachments.api.test.ts` | 200 / 400 | PASS |
| **E2E-01** | E2E | AC-01, AC-03 | ทดสอบการทำงานครบวงจรตั้งแต่สลับผู้ใช้ -> สร้างตั๋ว -> ค้นหาตั๋ว -> ลบไฟล์แนบ | `e2e/lab-02/requester-ticket-flow.spec.ts` | Full Flow Success | PASS |

## 3. Acceptance Criteria Traceability (การเชื่อมโยง AC กับ Test)
- **AC-01**: ครอบคลุมด้วย API-01, API-02, UI-02, UI-03, UI-14, E2E-01
- **AC-02**: ครอบคลุมด้วย UI-01
- **AC-03**: ครอบคลุมด้วย API-03, API-11, API-12, API-13, UI-12, UI-13, E2E-01
- **AC-04**: ครอบคลุมด้วย API-04, API-13, API-14, UI-15, UI-16
- **AC-05**: ครอบคลุมด้วย API-05, API-15, UI-04, UI-17, E2E-01
- **FR-05** (My Tickets เป็นของตัวเองเท่านั้น): ครอบคลุมด้วย API-06, API-11, UI-05, UI-08
- **FR-06** (ค้นหาตั๋ว): ครอบคลุมด้วย API-07, UI-06
- **FR-07** (กรองตั๋ว): ครอบคลุมด้วย API-08, UI-06
- **FR-08** (เรียงลำดับ & หน้า): ครอบคลุมด้วย API-09, API-10, UI-05, UI-07, UI-09

## 4. E2E & Visual Checklist (Issue 10)

### 4.1 E2E Flow (`npm run test:e2e`)
- รันด้วย Playwright (ชี้อัตโนมัติ: seed → build server → ขึ้น server `:3000` + client Vite `:5173`)
- 3 โปรเจกต์ viewport: desktop (1280×800 ≥992px), tablet (820×1180, 768–991px), mobile (393×851 <768px) — รันตามลำดับด้วย `workers: 1` (กันการชนของ `generateTicketNumber`)
- Flow ครบรอบ: เลือก Developer Requester → สร้าง Ticket → ค้นหาใน My Tickets → เปิด Ticket Detail → อัปโหลด attachment → Soft-remove พร้อมเหตุผล → Back กลับ My Tickets
- Screenshots หลักฐานอยู่ที่ `artifacts/lab-02/screenshots/{create-ticket,my-tickets,ticket-detail}/` (รวม `ticket-detail-removed-<viewport>.png` หลัง soft-remove)

### 4.2 Visual Checklist (ตรวจสอบตาม ui-spec.md ที่ทุก viewport)
| # | รายการตรวจ | วิธีตรวจ | สถานะ |
|---|---|---|---|
| V-01 | ไม่มี horizontal page scrolling (document ไม่กว้างกว่า viewport) | `expectNoHorizontalOverflow` ในระหว่าง E2E flow (หน้า main + detail) | PASS ทุก viewport |
| V-02 | ปุ่ม/ฟิลด์สำคัญไม่ถูกบัง และคลิกได้ (Selector card → Submit → Row/Card → Download/Remove → Back) | autocheck ผ่านการโต้ตอบจริงใน E2E | PASS ทุก viewport |
| V-03 | Zen Green Theme คงที่ (Primary `#006B3C`, badge/ปุ่ม status) | ตรวจจาก screenshots | PASS |
| V-04 | ฟิลด์ Commerce Edge: Summary/Description เป็น read-only บน Detail | screenshot ticket-detail | PASS |
| V-05 | `[Removed]` badge แสดงหลัง soft-remove + ปุ่ม Download/Remove หายไป | assertion ใน E2E + screenshot ticket-detail-removed | PASS |
| V-06 | Responsive: ตาราง desktop/tablet ↔ การ์ด mobile (<768px), ไม่มี horizontal scrollbar | viewport-specific locator ใน E2E | PASS |

> ผลลัพธ์จริง: E2E-01 ผ่าน 3/3 viewport (2.0s/2.1s/2.7s) — รายละเอียดใน `playwright-report/` (git-ignored)

## 5. Test Commands
```bash
# รัน API Tests ฝั่ง Backend
cd server && npm test

# รัน UI Tests ฝั่ง Frontend
cd client && npm test

# รัน E2E Tests (seed อัตโนมัติ + ขึ้น webserver แล้วรัน 3 viewports)
npm run test:e2e
```
