# Lab 2 Sprint Engineering Specification (ข้อกำหนดทางวิศวกรรมซอฟต์แวร์ TokTickIT Lab 2)

## 1. Sprint Goal (เป้าหมายสปรินต์)
ส่งมอบระบบ TokTickIT ในส่วนของผู้แจ้งเรื่อง (Requester/End User) ในรูปแบบ Minimum Viable Product (MVP) ที่ใช้งานได้จริงและตอบสนองตามหลัก Responsive (Zen Green Theme) โดยผู้ใช้สามารถสลับผู้ใช้จำลอง, สร้างตั๋วแจ้งเรื่องพร้อมแนบไฟล์, รับเลขตั๋วอัตโนมัติ, ค้นหา/กรอง/จัดเรียง/แบ่งหน้าตั๋วของตนเอง, ดูรายละเอียดตั๋วแบบอ่านอย่างเดียว และลบไฟล์แนบแบบ Soft Removal ได้อย่างปลอดภัย

## 2. Stakeholder Request Interpretation (การตีความความต้องการของผู้มีส่วนได้ส่วนเสีย)
แผนกไอทีต้องการระบบรับเรื่องร้องเรียนบริการไอทีที่มีอินเทอร์เฟซสวยงาม ใช้งานง่าย และรองรับ Responsive ผู้แจ้งเรื่องต้องสามารถอธิบายปัญหา เลือกหมวดหมู่ ระบบที่เกี่ยวข้อง ระดับความสำคัญ และแนบหลักฐานประกอบได้ หลังจากส่งเรื่องแล้ว ต้องสามารถติดตามตั๋วของตนเองในหน้า My Tickets ค้นหา ดูรายละเอียด และจัดการไฟล์แนบตามสิทธิ์ได้ โดยมีระบบจำลองผู้ใช้ (Development Requester Selector) สำหรับทดสอบก่อนที่จะนำระบบล็อกอินจริงมาใช้ในสปรินต์ถัดไป

## 3. Scope (ขอบเขตระบบ)
### Included (สิ่งที่รวมในสปรินต์นี้)
- หน้าสลับผู้ใช้จำลอง (Development Requester Selection Screen) และการจัดการ Context ผู้ใช้ที่เลือก
- การสร้างตั๋วแจ้งเรื่อง (Create Ticket Screen) พร้อม Validation และการออกเลขตั๋ว `TKT-2025-XXXXXX`
- การแนบไฟล์หลักฐาน (JPG, PNG, WEBP, PDF ขนาด $\le 5\text{MB}$, สูงสุด 5 ไฟล์/ตั๋ว)
- หน้าแสดงรายการตั๋วของฉัน (My Tickets Screen) พร้อมระบบค้นหา, กรอง, จัดเรียง, แบ่งหน้า (Pagination), Empty State และ No-Results State
- หน้ารายละเอียดตั๋ว (Requester Ticket Detail Screen) แบบ Read-only
- การตรวจสอบสิทธิ์ความเป็นเจ้าของตั๋ว (Requester Ownership Protection)
- การลบไฟล์แนบแบบซ่อน (Soft Removal) พร้อมบันทึกเหตุผลการลบ
- การพัฒนาด้วยธีม Zen Green Theme และ Responsive Layout (Desktop, Tablet, Mobile)

### Excluded (สิ่งที่ยังไม่รวมในสปรินต์นี้)
- ระบบล็อกอินและยืนยันตัวตนจริง (Authentication, Passwords, Session, JWT)
- ระบบและหน้าจอสำหรับเจ้าหน้าที่ไอที (IT Staff Dashboard, Claim Ticket, IT Priority)
- ระบบการสื่อสารและการติดตามงาน (Public Comments, Internal Notes, Actions Taken)
- การเปลี่ยนสถานะตั๋วนอกเหนือจากสถานะเริ่มต้น `New` (เช่น Confirm Resolution, Close, Reopen)
- ระบบบริหารจัดการผู้ใช้และข้อมูลอ้างอิงของผู้ดูแลระบบ (Admin Functions)

## 4. Functional Requirements (ข้อกำหนดเชิงฟังก์ชัน)
- **FR-01**: ระบบต้องมีหน้าจอเลือกผู้ใช้งานจำลอง (Development Requester Selector) เพื่อสลับบริบทผู้ใช้ในการทดสอบ
- **FR-02**: ระบบต้องอนุญาตให้ Requester สร้างตั๋วใหม่โดยกรอก Summary, Description, เลือก Category, Related System และ Requested Priority
- **FR-03**: ระบบต้องสร้างเลขตั๋วที่ไม่ซ้ำกัน (Unique Ticket Number) จากระบบหลังบ้านทันทีที่สร้างตั๋วสำเร็จ
- **FR-04**: ระบบต้องรองรับการแนบไฟล์หลักฐานขณะสร้างตั๋วและในหน้ารายละเอียดตั๋ว
- **FR-05**: ระบบต้องแสดงรายการตั๋วเฉพาะที่ถูกสร้างโดย Requester ที่เลือกอยู่ปัจจุบันในหน้า My Tickets
- **FR-06**: ระบบต้องรองรับการค้นหาตั๋วตามเลขตั๋วหรือข้อความ Summary
- **FR-07**: ระบบต้องรองรับการกรองตั๋วตาม Category, Requested Priority, IT Priority และ Status
- **FR-08**: ระบบต้องรองรับการจัดเรียงตั๋ว (Sorting) และการแบ่งหน้า (Pagination)
- **FR-09**: ระบบต้องปฏิเสธการเข้าถึงตั๋วของ Requester คนอื่น (Ownership Protection)
- **FR-10**: ระบบต้องรองรับการลบไฟล์แนบแบบ Soft Removal โดยบันทึกเหตุผลการลบ และไม่อนุญาตให้ดาวน์โหลดไฟล์ที่ถูกลบไปแล้ว

## 5. Business Rules (กฎทางธุรกิจ)
- **BR-01**: เลขตั๋ว (Ticket Number) ต้องถูกสร้างจากระบบหลังบ้านในรูปแบบ `TKT-YYYY-XXXXXX` และห้ามซ้ำกัน
- **BR-02**: ตั๋วที่ถูกสร้างใหม่ทุกใบจะเริ่มต้นด้วยสถานะ `New` เสมอ
- **BR-03**: ระบบเลือก Requester จำลองใช้เฉพาะการทดสอบใน Lab 2 ไม่ใช่ระบบล็อกอินจริง
- **BR-04**: Requester สามารถมองเห็น ค้นหา และเข้าถึงรายละเอียดได้เฉพาะตั๋วที่เป็นของตนเองเท่านั้น
- **BR-05**: ไฟล์แนบต้องเป็นประเภท JPG, JPEG, PNG, WEBP หรือ PDF เท่านั้น
- **BR-06**: ขนาดไฟล์แนบต้องไม่เกิน 5 MB ต่อไฟล์
- **BR-07**: ตั๋ว 1 ใบมีไฟล์แนบที่ใช้งานอยู่ (Active Attachments) ได้ไม่เกิน 5 ไฟล์
- **BR-08**: การลบไฟล์แนบจะเป็นแบบ Soft Removal เสมอ โดยไฟล์ที่ถูกลบจะยังแสดง Metadata แต่ไม่สามารถดาวน์โหลดหรือดูตัวอย่างได้
- **BR-09**: Requester ที่มีสถานะ Inactive จะต้องไม่ปรากฏในรายการตัวเลือก Development Requester Selector

## 6. UI Specification Summary (สรุปข้อกำหนด UI)
- **Theme Palette**: Zen Green Theme (Primary: `#006B3C`, Secondary: `#0B7A46`, Light/Pale: `#EAF6EF`, Background: `#F5F7F6`)
- **Responsive Layout**:
  - Desktop ($\ge 992\text{px}$): แสดงผลแบบ Multi-column จัดวางเนื้อหาตรงกลาง มีความกว้างสูงสุดเหมาะสม
  - Tablet ($768-991\text{px}$): แสดงผลแบบ Two-column เพิ่มความกว้างให้ Summary และ Description
  - Mobile ($< 768\text{px}$): แสดงผลแบบ Single-column ฟิลด์ซ้อนกันในแนวตั้ง ปุ่มกดง่าย ห้ามมี Horizontal Scrollbar
- **Controls & Validation**:
  - ฟิลด์ที่จำเป็นต้องมีดอกจันสีแดง `*` และแสดงข้อความแจ้งเตือนสีแดงเข้มใต้ฟิลด์ทันที
  - ปุ่มกดต้องมีข้อความชัดเจน และแสดงสถานะ Busy (Disabled + ข้อความ Loading) ขณะประมวลผล

## 7. Data Changes (ความเปลี่ยนแปลงของโมเดลข้อมูล)
- เพิ่ม Prisma Models ใน `schema.prisma`:
  - `RequesterUser`: เก็บข้อมูลผู้ใช้จำลอง (`id`, `name`, `email`, `isActive`, `createdAt`)
  - `Ticket`: เก็บข้อมูลตั๋ว (`id`, `ticketNumber`, `requesterId`, `categoryId`, `relatedSystemId`, `summary`, `description`, `requestedPriority`, `itPriority`, `status`, `createdAt`, `updatedAt`)
  - `Attachment`: เก็บไฟล์แนบ (`id`, `ticketId`, `filename`, `originalName`, `mimeType`, `size`, `isRemoved`, `removeReason`, `removedAt`, `createdAt`)
  - `RelatedSystem`: เก็บระบบอ้างอิง (`id`, `name`, `isActive`, `createdAt`)

## 8. API Contract (สรุป REST API Contract)
- `GET /api/requesters`: ดึงรายชื่อ Active Requesters
- `GET /api/categories`: ดึงรายชื่อ Active Categories
- `GET /api/related-systems`: ดึงรายชื่อ Active Related Systems
- `POST /api/tickets`: สร้างตั๋วแจ้งเรื่องใหม่
- `GET /api/tickets`: ดึงรายการตั๋วของ Requester (รองรับ `requesterId`, `search`, `category`, `priority`, `status`, `sort`, `page`, `limit`)
- `GET /api/tickets/:id`: ดึงรายละเอียดตั๋วรายใบ (เช็ค `requesterId`)
- `POST /api/tickets/:id/attachments`: อัปโหลดไฟล์แนบ
- `GET /api/attachments/:id/download`: ดาวน์โหลดไฟล์แนบ
- `DELETE /api/attachments/:id`: Soft-remove ไฟล์แนบ

## 9. Acceptance Criteria (เงื่อนไขการยอมรับ แบบ Given-When-Then)
- **AC-01**: Given ผู้ใช้กรอกข้อมูลตั๋วถูกต้อง, When กดปุ่มยื่นส่งตั๋ว, Then ระบบสร้างตั๋วสำเร็จ เก็บข้อมูลลง DB และแสดงเลข Ticket Number ทางหน้าจอ
- **AC-02**: Given ผู้ใช้ยังไม่ได้เลือก Development Requester, When พยายามเข้าหน้า My Tickets หรือ Create Ticket, Then ระบบบังคับแสดงหน้า Requester Selector ให้เลือกผู้ใช้ก่อน
- **AC-03**: Given Requester A กำลังใช้งานระบบ, When พยายามเปิดดูตั๋วของ Requester B ผ่าน URL หรือ API, Then ระบบปฏิเสธการเข้าถึงและส่งคืน HTTP 403 Forbidden หรือ 404 Not Found
- **AC-04**: Given ผู้ใช้แนบไฟล์ประเภทที่ไม่อนุญาต หรือขนาดเกิน 5MB, When เลือกอัปโหลดไฟล์, Then ระบบแสดงข้อความแจ้งเตือนข้อผิดพลาดและบล็อกการยื่นส่ง
- **AC-05**: Given ผู้ใช้กดลบไฟล์แนบและกรอกเหตุผลการลบ, When ยืนยันการลบ, Then สถานะไฟล์เปลี่ยนเป็น Soft-removed แสดงรายการ Metadata แต่บล็อกปุ่มดาวน์โหลด

## 10. Definition of Done (นิยามความสำเร็จของสปรินต์)
- [ ] โค้ดทั้งหมดผ่านการตรวจสอบ Acceptance Criteria ทุกข้อ
- [ ] ชุดทดสอบอัตโนมัติ (Unit, API, UI, E2E) รันผ่าน 100% บน branch `main`
- [ ] เอกสารประกอบใน `docs/lab-02/` จัดทำสมบูรณ์ทุกไฟล์
- [ ] มีการ Peer Review อนุมัติ (Approved) และ Merge ผ่าน Branch `lab2-staging` ตามกติกา
- [ ] การแสดงผลบน Desktop, Tablet, Mobile ถูกต้องตามสเปก Zen Green Theme
- [ ] รวบรวมเอกสารและรูปภาพหลักฐานจัดทำเป็นไฟล์ PDF 1 ไฟล์ตามรูปแบบการส่งงาน

## 11. Assumptions and Decisions (ข้อสมมติฐานและการตัดสินใจ)
- กำหนดให้การสลับ Requester ใช้ LocalStorage หรือ React Context ในการจำลองสภาวะการเข้าสู่ระบบ
- กำหนดให้ระบบสุ่ม/สร้าง Ticket Number ใช้รูปแบบปี ค.ศ. ปัจจุบัน ตามด้วยตัวเลขรันอัตโนมัติ 6 หลัก เช่น `TKT-2025-000001`
- การจัดเก็บไฟล์แนบในสภาพแวดล้อมการพัฒนาใน Local ให้เก็บในโฟลเดอร์ `server/uploads/`
