# Lab 3 Sprint Engineering Specification (ข้อกำหนดทางวิศวกรรมซอฟต์แวร์ TokTickIT Lab 3)

## 1. Sprint Goal (เป้าหมายสปรินต์)
ส่งมอบระบบ TokTickIT ที่รองรับการยืนยันตัวตนและการกำหนดสิทธิ์การใช้งานตามบทบาทจริง (Role-Based Access Control) สำหรับ 3 บทบาท ได้แก่ Requester, IT Staff และ Administrator รวมถึงการจัดการเวิร์กโฟลว์ตั๋วงานของเจ้าหน้าที่ไอที (IT Staff Ticket Queue & Ticket Detail, IT Priority, Public Comments, Internal Notes) และระบบจัดการบัญชีผู้ใช้งานของผู้ดูแลระบบ (Administrator User Management) โดยยังคงรักษาฟังก์ชันการทำงานเดิมใน Lab 2 และตกแต่งด้วยสไตล์ Zen Green Theme

## 2. Stakeholder Request Interpretation (การตีความความต้องการของผู้มีส่วนได้ส่วนเสีย)
ผู้มีส่วนได้ส่วนเสียต้องการยกระดับความปลอดภัยและความสมบูรณ์ของระบบ TokTickIT โดยยกเลิกปุ่มสลับผู้ใช้จำลอง (Development Requester Selector) และแทนที่ด้วยระบบล็อกอินจริงด้วยอีเมลและรหัสผ่าน ผู้ใช้ใหม่หรือผู้ใช้ที่ถูกรีเซ็ตรหัสผ่านจะต้องบังคับเปลี่ยนรหัสผ่านในการเข้าใช้งานครั้งแรก (Mandatory First-Login Password Change) ระบบต้องคุ้มครองการเข้าถึง API และหน้าจอตามบทบาทและความเป็นเจ้าของข้อมูลอย่างเคร่งครัด เจ้าหน้าที่ไอที (IT Staff) สามารถค้นหา กรอง และรับเคสใน Ticket Queue, ปรับเปลี่ยน IT Priority, ดำเนินการตามสถานะตั๋ว, สื่อสารกับผู้แจ้งผ่าน Public Comments และบันทึกโน้ตภายใน (Internal Notes) ที่เป็นความลับ ส่วนผู้ดูแลระบบ (Administrator) สามารถบริหารจัดการผู้ใช้ (สร้าง, แก้ไข, เปิด/ปิดการใช้งาน, รีเซ็ตรหัสผ่าน) บนหน้าจอ User Management แบบง่ายและปลอดภัย

## 3. Scope (ขอบเขตระบบ)
### Included (สิ่งที่รวมในสปรินต์นี้)
- ระบบ Authentication (Login, Logout, Current User Retrieval, Mandatory Password Change)
- การสืบทอดสิทธิ์และการตรวจสอบสิทธิ์ฝั่งเซิร์ฟเวอร์ (Server-side Role-Based Authorization & Ownership Checks)
- การย้ายข้อมูลผู้แจ้งเรื่องจาก Lab 2 (`RequesterUser`) เข้าสู่โมเดลผู้ใช้จริง (`User`) พร้อมระบบแฮชรหัสผ่านปลอดภัย (bcrypt)
- ระบบตั๋วงานสำหรับ IT Staff: Shared Ticket Queue (ค้นหา, กรอง, จัดเรียง, แบ่งหน้า), Ticket Detail, การ Claim/Reassign ตั๋ว, กำหนด IT Priority, การเปลี่ยนสถานะตามเวิร์กโฟลว์
- ระบบข้อคิดเห็น: Public Comments (มองเห็นได้โดยทุกบทบาท) และ Internal Notes (เฉพาะ IT Staff และ Admin)
- ปุ่มแสดงเจตนา "Problem Appears Resolved" สำหรับ Requester
- หน้าจอบริหารจัดการผู้ใช้สำหรับ Administrator (User List, ค้นหา/กรอง, สร้างผู้ใช้ใหม่พร้อม 1 บทบาท, แก้ไขข้อมูลพื้นฐาน, เปิด/ปิดใช้งานบัญชี, ตั้งรหัสผ่านเริ่มต้นใหม่)
- กฎความปลอดภัยของ Admin: ห้ามปิดใช้งานบัญชีตนเอง, ห้ามระบบขาด Active Admin, ห้ามใช้อีเมลซ้ำ
- ข้อมูล Seed Data แบบ Idempotent สำหรับการทดสอบครบถ้วนทุกบทบาท
- สไตล์ Zen Green Theme และ Responsive Layout (Desktop, Tablet, Mobile)

### Excluded (สิ่งที่ยังไม่รวมในสปรินต์นี้)
- ระบบส่งอีเมลคำเชิญ รีเซ็ตรหัสผ่าน หรือการแจ้งเตือน (Email Invitations / Password Reset Link via Email)
- ระบบลงทะเบียนบัญชีด้วยตนเอง (Self-registration)
- การยืนยันตัวตนหลายปัจจัย (MFA / 2FA) หรือ Social Login / Single Sign-On (SSO)
- ฟังก์ชัน Actions Taken ของ IT Staff (ยกยอดไป Lab 4)
- การคำนวณ SLA, Escalation Rules, Dashboards/KPI Analytics
- การจัดการหลายองค์กร (Multi-tenant), แผนก (Departments), หรือบทบาทซ้อน (Multiple roles per user)
- การลบผู้ใช้ (User Deletion), Bulk Operations, Import/Export ข้อมูลผู้ใช้

## 4. Functional Requirements (ข้อกำหนดเชิงฟังก์ชัน)
- **FR-01**: ระบบต้องให้บริการการเข้าสู่ระบบ (Authentication) ด้วย Email และ Password
- **FR-02**: ระบบต้องบังคับให้ผู้ใช้ที่มีสถานะ `mustChangePassword = true` เปลี่ยนรหัสผ่านใหม่ก่อนจึงจะสามารถเข้าใช้งานแอปพลิเคชันปกติได้
- **FR-03**: ระบบต้องมี API ตรวจสอบสถานะผู้ใช้ปัจจุบัน (Current Authenticated User) และ API สำหรับออกจากระบบ (Logout)
- **FR-04**: ระบบต้องใช้ข้อมูลประจำตัวของผู้ใช้ที่ล็อกอินจริง (Authenticated User Identity) ในการระบุความเป็นเจ้าของตั๋วและสิทธิ์การใช้งาน ไม่ใช่จาก `requesterId` ที่ส่งมาจากหน้าบ้าน
- **FR-05**: ระบบต้องจัดสรรหน้าจอและสิทธิ์การทำงานตามบทบาท (Requester, IT Staff, Administrator)
- **FR-06**: ระบบต้องบริการ IT Staff Ticket Queue ที่รองรับการค้นหาตามเลขตั๋ว/คำสรุป, กรองตาม Status, Category, Requested Priority, IT Priority, Owner, จัดเรียง และแบ่งหน้า
- **FR-07**: ระบบต้องรองรับให้ IT Staff สามารถ Claim หรือ Reassign ตั๋ว, ปรับเปลี่ยน IT Priority และอัปเดตสถานะตั๋วตามเวิร์กโฟลว์ที่อนุญาต
- **FR-08**: ระบบต้องรองรับการส่งและแสดงผล Public Comments (มองเห็นได้โดย Requester, IT Staff, Admin) และ Internal Notes (มองเห็นเฉพาะ IT Staff, Admin)
- **FR-09**: ระบบต้องอนุญาตให้ Requester ระบุเจตนาว่าปัญหาได้รับการแก้ไขแล้ว ("Problem Appears Resolved")
- **FR-10**: ระบบต้องรองรับ Administrator User Management ในการดึงรายการผู้ใช้, ค้นหาตามชื่อ/อีเมล, กรองตามบทบาท, สร้างผู้ใช้ใหม่พร้อมรหัสผ่านเริ่มต้น, แก้ไขข้อมูล/สถานะการใช้งาน และตั้งรหัสผ่านเริ่มต้นใหม่

## 5. Business Rules (กฎทางธุรกิจ)
- **BR-01**: เฉพาะผู้ใช้ที่มีสถานะเปิดใช้งาน (`isActive = true`) และระบุ credentials ถูกต้องเท่านั้นที่สามารถพิสูจน์ตัวตนสำเร็จได้
- **BR-02**: ผู้ใช้ที่ต้องเปลี่ยนรหัสผ่าน (`mustChangePassword = true`) ห้ามเข้าถึงหน้าจอการทำงานปกติจนกว่าจะตั้งรหัสผ่านใหม่สำเร็จ
- **BR-03**: การระบุสิทธิ์และการเป็นเจ้าของตั๋ว/ไฟล์แนบของ Requester ถูกตัดสินโดย Authenticated Session/Token จากเซิร์ฟเวอร์เสมอ
- **BR-04**: Public Comments สามารถมองเห็นได้โดย Requester เจ้าของตั๋ว, IT Staff และ Administrator ส่วน Internal Notes มองเห็นเฉพาะ IT Staff และ Administrator เท่านั้น
- **BR-05**: Requester สามารถระบุเจตนาว่าปัญหาได้รับการแก้ไขแล้วได้ แต่ไม่สามารถเปลี่ยนสถานะตั๋วเป็น `Resolved` หรือ `Closed` โดยตรงได้ (หน้าที่เปลี่ยนสถานะเป็นของ IT Staff)
- **BR-06**: บัญชีผู้ใช้งาน 1 บัญชีจะมีเพียง 1 บทบาทเท่านั้น (`REQUESTER`, `IT_STAFF`, หรือ `ADMINISTRATOR`)
- **BR-07**: ห้ามมีอีเมลซ้ำในระบบ (Unique Email Constraint)
- **BR-08**: Administrator ห้ามปิดใช้งานบัญชีตนเอง (`self-deactivation block`)
- **BR-09**: ระบบต้องป้องกันไม่ให้จำนวน Active Administrator เหลือ 0 บัญชี
- **BR-10**: การรีเซ็ตรหัสผ่านโดย Admin จะตั้งค่า `mustChangePassword = true` เสมอ เพื่อบังคับให้ผู้ใช้เปลี่ยนรหัสผ่านในครั้งต่อไปที่เข้าสู่ระบบ
- **BR-11**: ตั๋ว 1 ใบอาจมี IT Staff หรือ Admin เป็น primary Ticket Owner ได้เพียง 1 คน (หรือว่างไว้ unassigned)
- **BR-12**: IT Priority เริ่มต้นจะคัดลอกมาจาก Requested Priority และสามารถแก้ไขได้โดย IT Staff หรือ Admin เท่านั้น
- **BR-13**: สถานะตั๋วที่อนุญาต ได้แก่ `New`, `Open`, `In Progress`, `Waiting for Requester`, `Resolved`, `Closed`, `Reopened`, `Cancelled`

## 6. UI Specification Summary (สรุปข้อกำหนด UI)
- **Theme Palette**: Zen Green Theme (Primary `#006B3C`, Secondary `#0B7A46`, Light `#EAF6EF`, Background `#F5F7F6`, Dark Text `#1A202C`)
- **Application Shell**:
  - แสดงโลโก้ TokTickIT และเมนูนำทางตามบทบาท (Requester: My Tickets, Create Ticket; IT Staff: Ticket Queue; Admin: User Management)
  - มุมขวาบนแสดงชื่อผู้ใช้ บทบาท (Badge) และเมนูดรอปดาวน์สำหรับโปรไฟล์/เปลี่ยนรหัสผ่าน/ออกจากระบบ
- **Responsive Layout**:
  - Desktop ($\ge 992\text{px}$): แสดงผลแบบ Multi-column / Full Table
  - Mobile ($< 768\text{px}$): แปลงการแสดงผล Table เป็น Card-based layout ป้องกัน Horizontal Overflow

## 7. Data Changes (ความเปลี่ยนแปลงของโมเดลข้อมูล)
- เพิ่มโมเดล `User` ใน Prisma Schema:
  - `id`, `name`, `email` (unique), `passwordHash`, `role` (`REQUESTER`, `IT_STAFF`, `ADMINISTRATOR`), `mustChangePassword`, `isActive`, `createdAt`, `updatedAt`
- ปรับปรุงโมเดล `Ticket`:
  - เปลี่ยน `requesterId` ให้เชื่อมกับ `User.id`
  - เพิ่ม `ownerId` (Int?, Foreign Key ถึง `User.id`)
- เพิ่มโมเดล `PublicComment`:
  - `id`, `ticketId`, `authorId`, `content`, `createdAt`
- เพิ่มโมเดล `InternalNote`:
  - `id`, `ticketId`, `authorId`, `content`, `createdAt`

## 8. API Contract Summary (สรุป REST API Contract)
- `POST /api/auth/login`: เข้าสู่ระบบ
- `POST /api/auth/logout`: ออกจากระบบ
- `GET /api/auth/me`: ดึงข้อมูลผู้ใช้ปัจจุบัน
- `POST /api/auth/change-password`: เปลี่ยนรหัสผ่านบังคับ/ทั่วไป
- `GET /api/tickets`: ดึงรายการตั๋ว (Requester ได้เฉพาะตั๋วตนเอง; IT Staff/Admin ได้ Ticket Queue พร้อม search/filter/sort/paginate)
- `GET /api/tickets/:id`: ดึงรายละเอียดตั๋ว (เช็คสิทธิ์อ่าน)
- `PATCH /api/tickets/:id`: อัปเดตตั๋ว (Claim, Assign Owner, IT Priority, Status)
- `POST /api/tickets/:id/comments`: โพสต์ Public Comment
- `GET /api/tickets/:id/comments`: ดึง Public Comments
- `POST /api/tickets/:id/internal-notes`: โพสต์ Internal Note (เฉพาะ IT Staff/Admin)
- `GET /api/tickets/:id/internal-notes`: ดึง Internal Notes (เฉพาะ IT Staff/Admin)
- `GET /api/users`: รายชื่อผู้ใช้ (Admin เท่านั้น)
- `POST /api/users`: สร้างผู้ใช้ใหม่ (Admin เท่านั้น)
- `PATCH /api/users/:id`: แก้ไขข้อมูลผู้ใช้/สถานะ (Admin เท่านั้น)
- `POST /api/users/:id/reset-password`: รีเซ็ตรหัสผ่านผู้ใช้ (Admin เท่านั้น)

## 9. Acceptance Criteria (เงื่อนไขการยอมรับ แบบ Given-When-Then)
- **AC-01**: Given ผู้ใช้มีบัญชี Active และรหัสผ่านถูกต้อง, When ล็อกอิน, Then ระบบสร้างสิทธิ์การเข้าใช้งาน ยืนยันบทบาท และเข้าสู่แอปพลิเคชัน
- **AC-02**: Given ผู้ใช้มี `mustChangePassword = true`, When ล็อกอินสำเร็จ, Then ระบบบังคับแสดงหน้าเปลี่ยนรหัสผ่าน ห้ามเข้าหน้าปกติจนกว่าจะเปลี่ยนสำเร็จ
- **AC-03**: Given Requester ล็อกอินอยู่, When พยายามเรียก API Internal Notes หรือ Admin User API, Then เซิร์ฟเวอร์ตอบกลับ 403 Forbidden
- **AC-04**: Given IT Staff เปิด Ticket Queue, When ค้นหา กรองตามสถานะ หรือจัดเรียง, Then ระบบแสดงรายการตั๋วตรงตามเงื่อนไขพร้อม Pagination
- **AC-05**: Given IT Staff กด Claim ตั๋ว, When ยืนยันการรับเรื่อง, Then ระบบบันทึก IT Staff คนนั้นเป็น ownerId ของตั๋ว
- **AC-06**: Given Administrator พยายามปิดใช้งานบัญชีตนเอง, When บันทึกการแก้ไข, Then ระบบปฏิเสธพร้อมแสดงข้อความแจ้งเตือนข้อผิดพลาด
- **AC-07**: Given Administrator พยายามปิดใช้งาน Admin คนสุดท้ายในระบบ, When บันทึกการแก้ไข, Then ระบบปฏิเสธการทำรายการ

## 10. Definition of Done (นิยามความสำเร็จของสปรินต์)
- [x] โค้ดทั้งหมดผ่านการตรวจสอบ Acceptance Criteria ทุกข้อ
- [x] ชุดทดสอบอัตโนมัติ (Unit, API, UI, E2E) รันผ่าน 100% บน branch `main`
- [x] เอกสารประกอบใน `docs/lab-03/` จัดทำสมบูรณ์ทุกไฟล์
- [x] มีการ Peer Review อนุมัติ (Approved) และ Merge ผ่าน Branch `lab3-staging` ตามกติกา
- [x] การแสดงผลบน Desktop, Tablet, Mobile ถูกต้องตามสเปก Zen Green Theme
- [x] รวบรวมเอกสารและรูปภาพหลักฐานจัดทำเป็นไฟล์ PDF 1 ไฟล์ตามรูปแบบการส่งงาน

## 11. Assumptions and Decisions (ข้อสมมติฐานและการตัดสินใจ)
- รหัสผ่านที่สร้างขึ้นใหม่หรือรีเซ็ตโดย Admin จะเข้ารหัสด้วย `bcrypt` ด้วย salt round = 10
- เซสชันการล็อกอินใช้ Signed Cookie / HTTP-Only Cookie หรือ Bearer Token ที่ปลอดภัย
- เมื่อ Admin สั่งตั้งรหัสผ่านใหม่ ค่า `mustChangePassword` จะถูกปรับเป็น `true` โดยอัตโนมัติ
