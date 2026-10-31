# Lab 4 Sprint Engineering Specification (ข้อกำหนดทางวิศวกรรมซอฟต์แวร์ TokTickIT Lab 4)

## 1. Sprint Goal (เป้าหมายสปรินต์)
ส่งมอบวงจรการทำงานของระบบบริการตั๋วงาน TokTickIT ที่สมบูรณ์แบบ (Complete Service-Desk Lifecycle) โดยเพิ่มระบบบันทึกการปฏิบัติงาน (Actions Taken) ภายใต้ตั๋วงานสำหรับเจ้าหน้าที่ไอที บังคับใช้กฎการเปลี่ยนสถานะตั๋วงานอย่างเคร่งครัดพร้อม Resolution Gate นำเสนอแดชบอร์ดสรุปข้อมูลเชิงปฏิบัติการที่เหมาะสมกับแต่ละบทบาท (Role-Appropriate Dashboards) สำหรับ Requester, IT Staff และ Administrator ตลอดจนปรับปรุงความมั่นคงปลอดภัย การรองรับการใช้งานบนทุกขนาดหน้าจอ (Responsive) การเข้าถึงที่เท่าเทียม (Accessibility) และรักษาฟังก์ชันการทำงานเดิมจาก Lab 1 ถึง Lab 3 ทั้งหมดโดยไม่มี Regression

## 2. Stakeholder Request Interpretation (การตีความความต้องการของผู้มีส่วนได้ส่วนเสีย)
ผู้มีส่วนได้ส่วนเสียระบุว่า ปัจจุบันระบบ TokTickIT สามารถรับตั๋วงานและสื่อสารระหว่างผู้แจ้งกับเจ้าหน้าที่ไอทีได้แล้ว แต่ยังขาดกลไกที่เชื่อถือได้ในการวางแผน บันทึก และติดตามการลงมือปฏิบัติงานจริง จึงต้องการให้เพิ่มระบบ "Actions Taken" ภายใต้ตั๋วแต่ละใบ โดยตั๋ว 1 ใบอาจมีเจ้าของตั๋วหลัก (Ticket Owner) 1 คน แต่เจ้าหน้าที่ไอทีคนอื่นสามารถเข้ามาช่วยปฏิบัติงานและบันทึกประวัติการทำงานย่อยได้ แต่ละรายการต้องบันทึก วัน-เวลา, รายละเอียดการทำงาน, ผลลัพธ์, ผู้ปฏิบัติงาน (ดึงอัตโนมัติจากระบบ), ระบุว่าต้องติดตามผลต่อหรือไม่ พร้อมบันทึกข้อความติดตามผล (บังคับกรอกเมื่อต้องตามผล) และบันทึกโน้ตเกี่ยวกับไฟล์แนบ ผู้แจ้งเรื่องยังสามารถส่งสัญญาณแจ้งว่าปัญหาได้รับการแก้ไขแล้วได้ แต่เจ้าหน้าที่ไอทีต้องเป็นผู้ตรวจสอบงานและเป็นผู้อนุมัติเปลี่ยนสถานะตั๋วเป็น Resolved อย่างเป็นทางการ นอกจากนี้ ระบบต้องมีหน้า Dashboard ที่กระชับและมีประโยชน์สำหรับทั้ง Requester และ IT Staff เชื่อมโยงไปยังหน้ารายการตั๋วแบบเจาะลึก (Drill-down) ได้ และเก็บกวาดโค้ด/หน้าจอทั้งหมดให้สอดคล้องตามธีม Zen Green

## 3. Scope (ขอบเขตระบบ)
### Included (สิ่งที่รวมในสปรินต์นี้)
- โครงสร้างข้อมูลแบบ Parent-Child: ตั๋ว 1 ใบสามารถมีรายการ Actions Taken ได้หลายรายการ
- ฟังก์ชันบันทึกและแก้ไข Actions Taken สำหรับ IT Staff และ Administrator โดยระบบบันทึกผู้ปฏิบัติงาน (`performedBy`) จากบัญชีที่เข้าสู่ระบบจริงโดยอัตโนมัติ
- การมอบหมายผู้รับผิดชอบ Action Taken (`assignee`) ให้แก่ผู้ใช้บทบาท `IT_STAFF` หรือ `ADMINISTRATOR` ที่มีสถานะ `isActive = true` เท่านั้น พร้อมปฏิเสธการมอบหมายให้บัญชีที่ปิดใช้งานหรือเป็น `REQUESTER`
- การติดตามสถานะของ Action Taken (`PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`) พร้อมการเปลี่ยนสถานะแบบ Complete / Cancel และการแสดง Badge สถานะบนรายการ
- สิทธิ์การเข้าถึงแบบ Read-only สำหรับ Requester ในการดูประวัติ Actions Taken เฉพาะตั๋วที่ตนเองเป็นเจ้าของ
- Ticket Status Transition Matrix ที่สมบูรณ์ ครอบคลุม 8 สถานะ: `New`, `Open`, `In Progress`, `Waiting for Requester`, `Resolved`, `Closed`, `Reopened`, และ `Cancelled`
- Resolution Gate: การระบุเจตนา "Problem Appears Resolved" ของ Requester เป็นเพียงข้อความ Advisory ที่แจ้งเตือนเจ้าหน้าที่ ไม่เปลี่ยนสถานะตั๋วเป็น `Resolved` โดยอัตโนมัติ การตัดสินใจปิดเคสเป็นอำนาจของ IT Staff/Admin และระบบต้องปฏิเสธการเปลี่ยนสถานะเป็น `Resolved` ตราบใดที่ยังมี Action Taken ค้างอยู่ในสถานะ `PENDING` หรือ `IN_PROGRESS`
- Role-Appropriate Dashboards:
  - **IT Staff / Admin Dashboard**: สรุปตัวชี้วัดเชิงปฏิบัติการ (`New`, `Open`, `In Progress`, `Waiting for Requester`, `My Assigned`), รายการตั๋วเร่งด่วน/ล่าสุด, กล่อง Quick Actions และลิงก์ Drill-down ไปยัง Ticket Queue ที่กรองตามสถานะ
  - **Requester Dashboard**: สรุปตัวเลขตั๋วของตนเอง (`My Open Tickets`, `In Progress`, `Resolved`, `Closed`), รายการตั๋วของฉันล่าสุด และลิงก์นำทางไปยัง My Tickets
- การจัดการ Concurrency / Stale-update handling เพื่อป้องกันการบันทึกทับข้อมูลตั๋วพร้อมกัน
- ฐานข้อมูล PostgreSQL ผ่าน Prisma Migration แบบ Non-destructive รักษาข้อมูลเดิมของ Lab 1–3
- ข้อมูลจำลอง (Idempotent Seed Data) ที่ปลอดภัยในการรันซ้ำ รองรับทั้งตั๋วที่มี 0, 1 และหลาย Actions Taken และแสดงตัวเลขบน Dashboard ทั้งที่เป็น 0 และมากกว่า 0
- ปรับปรุง UI ทั้งหมดตามสไตล์ Zen Green Theme, Responsive บน 3 Viewports (Desktop, Tablet, Mobile) และ Accessibility มาตรฐาน
- การทดสอบครอบคลุม Unit, API, Component, Style, E2E (Playwright) และ Full Regression Test จาก Lab 1–3

### Explicitly Excluded (สิ่งที่อยู่นอกเหนือขอบเขตตาม Handout §4.2)
- ระบบนับเวลา SLA อัตโนมัติ, กลไก Escalation Rules และการแจ้งเตือนเมื่อละเมิด SLA (Breach notifications)
- ระบบแจ้งเตือนภายนอก เช่น Email, SMS, LINE Notification หรือ Push notification
- ระบบจัดการอะไหล่ คลังสินค้า การจัดซื้อ หรือการทำบัญชีต้นทุนการบริการ (Inventory / Spare-parts / Cost accounting)
- ระบบบันทึกเวลาทำงานเพื่อคิดค่าจ้างหรือบัญชีเงินเดือน (Time-sheet billing / Payroll)
- เวิร์กโฟลว์การอนุมัติหลายระดับ (Multi-level approvals) และระบบลายเซ็นอิเล็กทรอนิกส์
- เครื่องมือ Business Intelligence ขั้นสูง, ระบบสร้างรายงานแบบกำหนดเอง (Custom report builders) หรือ Data warehouse
- สถาปัตยกรรมคลาวด์ขนาดใหญ่ระดับโปรดักชันและการแยกองค์กรแบบ Multi-tenant
- ฟีเจอร์ใหม่ใดๆ ที่ไม่ได้รับการอนุมัติใน Engineering Contract นี้

## 4. Functional Requirements (ข้อกำหนดเชิงฟังก์ชัน)
- **FR-01**: ระบบต้องอนุญาตให้ IT Staff และ Administrator สามารถสร้างรายการ Action Taken ภายใต้ตั๋วที่ได้รับอนุญาตได้
- **FR-02**: ระบบต้องอนุญาตให้ IT Staff และ Administrator สามารถแก้ไขรายการ Action Taken ที่มีอยู่ได้
- **FR-03**: ระบบต้องผูกผู้ปฏิบัติงาน (`performedBy`) กับผู้ใช้ที่ล็อกอินจริงจากระบบพิสูจน์ตัวตนโดยอัตโนมัติเมื่อสร้าง Action Taken
- **FR-04**: ระบบต้องอนุญาตให้ Requester เข้าดูรายการประวัติ Actions Taken ของตั๋วที่ตนเองเป็นเจ้าของได้แบบอ่านอย่างเดียว (Read-only) และไม่อนุญาตให้สร้างหรือแก้ไข
- **FR-05**: ระบบต้องตรวจสอบความถูกต้องของข้อมูล Action Taken: หากระบุ `followUpRequired = true` ระบบต้องบังคับให้มี `followUpNote`
- **FR-06**: ระบบต้องบังคับใช้ Ticket Status Transition Matrix ตามกฎเกณฑ์ที่กำหนดอย่างเคร่งครัดที่ฝั่ง Backend
- **FR-07**: ระบบต้องรองรับ Resolution Gate โดยให้ Requester สามารถส่งข้อคิดเห็นหรือแจ้งสถานะแนะนำได้ แต่สถานะตั๋วจะยังไม่เปลี่ยนเป็น `Resolved` จนกว่า IT Staff จะเป็นผู้เปลี่ยน
- **FR-08**: ระบบต้องให้บริการ API สำหรับ IT Staff Dashboard ที่คำนวณตัวชี้วัด `New`, `Open`, `In Progress`, `Waiting for Requester`, และ `My Assigned` จากฐานข้อมูลจริง
- **FR-09**: ระบบต้องให้บริการ API สำหรับ Requester Dashboard ที่สรุปตัวชี้วัดเฉพาะตั๋วที่ Requester รายนั้นเป็นเจ้าของ (`My Open`, `In Progress`, `Resolved`, `Closed`)
- **FR-10**: ระบบต้องรองรับการ Drill-down จากการ์ดตัวชี้วัดบน Dashboard ไปยังหน้ารายการตั๋วที่กรองตามสถานะนั้นๆ
- **FR-11**: ระบบต้องตรวจจับและป้องกันข้อขัดแย้งจากการอัปเดตข้อมูลตั๋วพร้อมกัน (Stale/Concurrent Update Conflict Handling)
- **FR-12**: ระบบต้องรักษาฟังก์ชันการทำงานเดิมจาก Lab 1, 2 และ 3 ทั้งหมดให้ทำงานได้อย่างถูกต้อง (Zero Regression)
- **FR-13**: ระบบต้องอนุญาตให้ IT Staff และ Administrator มอบหมาย (`assigneeId`) ให้ผู้ใช้บทบาท `IT_STAFF` หรือ `ADMINISTRATOR` ที่มีสถานะ `isActive = true` เป็นผู้รับผิดชอบ Action Taken และต้องปฏิเสธการมอบหมายให้ผู้ใช้ที่ปิดใช้งานหรือเป็น `REQUESTER` ด้วย `422 Unprocessable Entity`
- **FR-14**: ระบบต้องรองรับการเปลี่ยนสถานะของ Action Taken (`PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`) ผ่าน API และ UI โดยบังคับใช้กฎการเปลี่ยนสถานะของ Action Taken ที่ฝั่ง Backend
- **FR-15**: ระบบต้องบังคับใช้ Resolution Gate ที่ฝั่ง Backend โดยปฏิเสธการเปลี่ยนสถานะตั๋วเป็น `Resolved` ด้วย `409 Conflict` หากยังมี Action Taken ที่มีสถานะ `PENDING` หรือ `IN_PROGRESS` อยู่ภายใต้ตั๋วนั้น

## 5. Business Rules (กฎทางธุรกิจ)
- **BR-01**: Action Taken แต่ละรายการต้องสังกัดตั๋วงาน (Ticket) เพียงใบเดียวเท่านั้น (Parent-Child relationship)
- **BR-02**: เจ้าของตั๋วหลัก (Ticket Owner) เป็นผู้ประสานงานภาพรวมของตั๋ว แต่เจ้าหน้าที่ IT Staff คนอื่นที่มีสิทธิ์เข้าถึงสามารถเข้ามาสร้างและบันทึก Actions Taken ในตั๋วนั้นได้
- **BR-03**: ข้อมูลผู้ปฏิบัติงาน (`performedBy`) ต้องดึงจาก Authenticated Identity ของผู้ใช้ที่กำลังส่ง Request ในขณะนั้นเสมอ ห้ามรับค่า ID ผู้ปฏิบัติงานจาก Client Payload
- **BR-04**: หากมีการกำหนด `followUpRequired = true` ข้อมูล `followUpNote` ต้องไม่เป็นค่าว่าง (Non-empty string) หาก `followUpRequired = false` ฟิลด์ `followUpNote` ต้องเป็น `null` (ระบบต้องล้างข้อความเดิมอัตโนมัติเมื่อปิด follow-up โดยไม่ส่ง note ใหม่มา) และ `actionDescription` ต้องมีความยาว 3–1000 ตัวอักษร
- **BR-05**: สิทธิ์ในการสร้างหรือแก้ไข Actions Taken จำกัดเฉพาะบทบาท `IT_STAFF` และ `ADMINISTRATOR` เท่านั้น สำหรับ `REQUESTER` มีสิทธิ์เปิดอ่านเฉพาะในตั๋วของตนเองเท่านั้น (ห้ามสร้าง/แก้ไข)
- **BR-06**: การเข้าถึงตั๋วที่ Requester ไม่ได้เป็นเจ้าของ ต้องตอบกลับด้วย `404 Not Found` เสมอ เพื่อป้องกันการรั่วไหลของการมีอยู่ของข้อมูล (Data Leakage Prevention)
- **BR-07**: วงจรชีวิตของตั๋ว (Ticket Status) ประกอบด้วย 8 สถานะ ได้แก่: `New`, `Open`, `In Progress`, `Waiting for Requester`, `Resolved`, `Closed`, `Reopened`, และ `Cancelled`
- **BR-08**: การเปลี่ยนสถานะตั๋วต้องเป็นไปตาม Transition Matrix:
  - `New` $\rightarrow$ `Open`, `Cancelled`
  - `Open` $\rightarrow$ `In Progress`, `Waiting for Requester`, `Resolved`, `Cancelled`
  - `In Progress` $\rightarrow$ `Waiting for Requester`, `Resolved`, `Cancelled`
  - `Waiting for Requester` $\rightarrow$ `In Progress`, `Resolved`, `Cancelled`
  - `Resolved` $\rightarrow$ `Closed`, `Reopened`
  - `Reopened` $\rightarrow$ `In Progress`, `Waiting for Requester`, `Resolved`, `Cancelled`
  - `Closed` $\rightarrow$ ไม่มีสถานะถัดไป (Final state)
  - `Cancelled` $\rightarrow$ ไม่มีสถานะถัดไป (Final state)
- **BR-09 (Resolution Gate)**: การระบุเจตนาว่าปัญหาได้รับการแก้ไขแล้วโดย Requester (`requesterIndicatedResolved = true`) เป็นเพียงคำแนะนำ (Advisory Flag) และจะไม่เปลี่ยนสถานะตั๋วเป็น `Resolved` โดยตรง เจ้าหน้าที่ไอทีต้องตรวจสอบผลการปฏิบัติงานใน Actions Taken แล้วเป็นผู้อัปเดตสถานะเป็น `Resolved` ด้วยตนเอง
- **BR-10**: ตัวชี้วัดบน IT Staff Dashboard ต้องคำนวณจากตั๋วทั้งหมดในระบบแบบ Real-time โดย:
  - `New`: ตั๋วที่มีสถานะ New
  - `Open`: ตั๋วที่มีสถานะ Open
  - `In Progress`: ตั๋วที่มีสถานะ In Progress
  - `Waiting for Requester`: ตั๋วที่มีสถานะ Waiting for Requester
  - `My Assigned`: ตั๋วที่ยังไม่ปิด (`Resolved`, `Closed`, `Cancelled`) ที่มี `ownerId` ตรงกับ IT Staff ผู้เรียกดู
- **BR-11**: ตัวชี้วัดบน Requester Dashboard ต้องคำนวณเฉพาะตั๋วที่ `requesterId` ตรงกับผู้ใช้ที่ล็อกอินอยู่เท่านั้น
- **BR-12**: การตรวจจับ Stale Update บนตั๋ว: เมื่อ Client ส่งคำขอแก้ไขสถานะหรือข้อมูลตั๋ว จะต้องตรวจสอบ timestamp `updatedAt` หรือเวอร์ชัน หากข้อมูลบนเซิร์ฟเวอร์เปลี่ยนไปแล้วหลังจากที่ Client โหลดมา ต้องตอบกลับด้วย `409 Conflict`
- **BR-13 (Assignee Eligibility)**: ผู้รับผิดชอบ Action Taken (`assigneeId`) ต้องเป็นผู้ใช้ที่มีบทบาท `IT_STAFF` หรือ `ADMINISTRATOR` และมีสถานะ `isActive = true` เท่านั้น ระบบต้องปฏิเสธการมอบหมายให้ผู้ใช้บทบาท `REQUESTER` หรือบัญชีที่ถูกปิดใช้งานด้วย `422 Unprocessable Entity` การตรวจสอบนี้ต้องบังคับใช้ที่ฝั่ง Backend ไม่ใช่เพียงซ่อนตัวเลือกใน UI
- **BR-14 (Action Taken Status Machine)**: สถานะของ Action Taken มี 4 สถานะ ได้แก่ `PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED` และการเปลี่ยนสถานะต้องเป็นไปตาม matrix ต่อไปนี้:
  - `PENDING` $\rightarrow$ `IN_PROGRESS`, `COMPLETED`, `CANCELLED`
  - `IN_PROGRESS` $\rightarrow$ `COMPLETED`, `CANCELLED`
  - `COMPLETED` $\rightarrow$ ไม่มีสถานะถัดไป (Final state)
  - `CANCELLED` $\rightarrow$ ไม่มีสถานะถัดไป (Final state)
  - การเปลี่ยนสถานะ Action Taken ต้องกระทำโดย `IT_STAFF` หรือ `ADMINISTRATOR` เท่านั้น และห้ามลบรายการ Action Taken (Append-only audit trail)
- **BR-15 (Resolution Gate — Unresolved Actions Block)**: ระบบต้องปฏิเสธการเปลี่ยนสถานะตั๋วเป็น `Resolved` ด้วย `409 Conflict` หากตั๋วนั้นยังมี Action Taken ที่มีสถานะ `PENDING` หรือ `IN_PROGRESS` อยู่แม้แต่รายการเดียว ผู้ใช้ต้องเปลี่ยน Action Taken เหล่านั้นเป็น `COMPLETED` หรือ `CANCELLED` ให้ครบก่อนจึงจะ Resolve ตั๋วได้ การตรวจสอบนี้ต้องกระทำที่ฝั่ง Backend แม้ Client จะข้ามหน้าจอไปก็ตาม (ดู BR-09 สำหรับ Requester Advisory Flag)
- **BR-16 (Result Required Only When Completed)**: ฟิลด์ `result` ของ Action Taken เป็น Nullable ในฐานข้อมูล (`String?`) เนื่องจากงานที่ยังไม่เสร็จ (`PENDING`, `IN_PROGRESS`) ยังไม่มีผลลัพธ์ Backend API ต้องบังคับให้ `result` ไม่เป็นค่าว่างเฉพาะเมื่อ `status == 'COMPLETED'` เท่านั้น การสร้างหรือแก้ไข Action ที่ยังไม่เสร็จสามารถละเว้น `result` ได้โดยไม่ต้องส่งข้อความหลอก

### Authorization Matrix (ตารางสิทธิ์การเข้าถึงตามบทบาท)
| ฟังก์ชัน / การทำงาน | REQUESTER | IT_STAFF | ADMINISTRATOR |
| :--- | :---: | :---: | :---: |
| ดูประวัติ Actions Taken บนตั๋วของตนเอง | ✓ | ✓ | ✓ |
| ดูประวัติ Actions Taken บนตั๋วของผู้อื่น | ✗ (`404`) | ✓ | ✓ |
| สร้าง Action Taken ภายใต้ตั๋ว | ✗ (`403`) | ✓ | ✓ |
| แก้ไข Action Taken ภายใต้ตั๋ว | ✗ (`403`) | ✓ | ✓ |
| มอบหมายผู้รับผิดชอบ Action Taken (`assigneeId`) | ✗ (`403`) | ✓ | ✓ |
| เปลี่ยนสถานะ Action Taken (`PENDING` / `IN_PROGRESS` / `COMPLETED` / `CANCELLED`) | ✗ (`403`) | ✓ | ✓ |
| ลบ Action Taken | ✗ | ✗ | ✗ (Append-only audit trail) |
| ดู IT Staff Dashboard (`/api/dashboard/staff`) | ✗ (`403`) | ✓ | ✓ |
| ดู Requester Dashboard (`/api/dashboard/requester`) | ✓ | ✗ (`403`) | ✗ (`403`) |
| เปลี่ยนสถานะตั๋วงานตาม Transition Matrix | ✗ (`403`) | ✓ | ✓ |
| ส่งสัญญาณแจ้ง "Problem Appears Resolved" | ✓ (เฉพาะตั๋วตนเอง) | ✗ | ✗ |
| ฟังก์ชันเดิม Lab 1-3 (Auth, Queue, Notes, Admin Users) | ตาม Lab 3 | ตาม Lab 3 | ตาม Lab 3 |

## 6. UI Specification Summary (สรุปข้อกำหนด UI)
- **Zen Green Design System**: ใช้ชุดสีหลัก `#006B3C` (Forest Green), `#0B7A46` (Medium Jade), `#EAF6EF` (Light Tint), พื้นหลัง `#F5F7F6` และสีตัวอักษร `#1A202C`
- **Application Shell & Navigation**:
  - เมนู Dashboard ปรับเปลี่ยนตามบทบาท: Requester แสดงเมนู "Dashboard" (เชื่อมไปหน้า Requester Dashboard) ส่วน IT Staff/Admin แสดงเมนู "Dashboard" (เชื่อมไปหน้า IT Staff Dashboard)
  - มีตัวบอก Active Page Indicator ชัดเจนบน Navigation Bar
- **IT Staff Dashboard Screen**:
  - Metric Cards 5 ใบ (`New`, `Open`, `In Progress`, `Waiting for Requester`, `My Assigned`) แต่ละใบมีไอคอน ตัวเลขสรุป และคลิกเพื่อ Drill-down ไปยัง Ticket Queue พร้อมตั้ง Filter สถานะนั้นโดยอัตโนมัติ
  - ตาราง My Recent Tickets แสดงตั๋วล่าสุด 5 รายการ
  - Quick Actions Panel: ปุ่ม Create Ticket, Search Tickets, My Queue
- **Requester Dashboard Screen**:
  - Metric Cards 4 ใบ (`My Open`, `In Progress`, `Resolved`, `Closed`) พร้อมปุ่ม View all นำทางไป My Tickets ที่ฟิลเตอร์สถานะนั้น
  - รายการตั๋วของฉันล่าสุด และปุ่มด่วนสำหรับสร้างตั๋วใหม่
- **Ticket Detail Actions Taken Section**:
  - จัดวางถัดจากส่วนข้อมูลตั๋วและข้อคิดเห็น โดยมีหัวข้อและ Badge แสดงจำนวนรายการ Actions Taken
  - รายการประวัติแสดงวัน-เวลา, ผู้ปฏิบัติงาน, ผู้รับผิดชอบ (`assignee`), คำอธิบายงาน, ผลลัพธ์, สถานะ Action Taken (Badge `PENDING` / `IN_PROGRESS` / `COMPLETED` / `CANCELLED`), สถานะ Follow-up (พร้อม Follow-up Note ถ้ามี) และ Attachment Notes
  - ปุ่ม "Add Action Taken" สำหรับ IT Staff/Admin เพื่อเปิดฟอร์มหรือ Modal กรอกข้อมูล
  - ฟอร์ม Create/Edit มี Dropdown เลือก `Assignee` โดยแสดงเฉพาะผู้ใช้บทบาท IT Staff/Admin ที่ Active และมีตัวเลือกเปลี่ยนสถานะ Action Taken (Complete / Cancel)
  - เมื่อเปิดสวิตช์ `Follow-Up Required` จะแสดงช่องกรอก `Follow-Up Note` พร้อมสัญลักษณ์ดอกจันสีแดง และระบบตรวจสอบไม่ให้เว้นว่าง
  - สำหรับ Requester: แสดงรายการประวัติเท่านั้นโดยไม่มีปุ่ม Add หรือ Edit
- **Resolution Gate Feedback**:
  - ปุ่ม Resolve จะแสดงคำเตือนและ Modal ยืนยันเมื่อตั๋วยังมี Action Taken ที่ค้างสถานะ `PENDING` หรือ `IN_PROGRESS`
  - หากผู้ใช้ยืนยัน ระบบต้องแสดงข้อความแจ้งว่าต้อง Complete หรือ Cancel Action ที่ค้างก่อน และไม่เปลี่ยนสถานะตั๋ว
- **Responsive & Accessibility**:
  - รองรับหน้าจอ 3 ขนาด: Desktop ($\ge 1280\text{px}$), Tablet ($768\text{px} - 1279\text{px}$), Mobile ($< 768\text{px}$)
  - Touch target บนอุปกรณ์สัมผัสไม่ต่ำกว่า 44x44px
  - คอนทราสต์ของสีข้อความและสีพื้นหลังผ่านเกณฑ์ WCAG AA ($\ge 4.5:1$)
  - รองรับการใช้งานผ่านคีย์บอร์ด (Focus indicators ชัดเจน)

## 7. Data Changes (ความเปลี่ยนแปลงของโมเดลข้อมูล)
### Prisma Schema Increment
```prisma
enum ActionTakenStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

model ActionTaken {
  id                String            @id @default(uuid())
  ticketId          Int
  ticket            Ticket            @relation(fields: [ticketId], references: [id], onDelete: Cascade)
  actionDateTime    DateTime          @default(now())
  actionDescription String            @db.Text
  result            String?           @db.Text
  performedById     Int
  performedBy       User              @relation("ActionTakenPerformer", fields: [performedById], references: [id])
  assigneeId        Int
  assignee          User              @relation("ActionTakenAssignee", fields: [assigneeId], references: [id])
  status            ActionTakenStatus @default(PENDING)
  followUpRequired  Boolean           @default(false)
  followUpNote      String?           @db.Text
  attachmentNotes   String?           @db.Text
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt

  @@index([ticketId])
  @@index([performedById])
  @@index([assigneeId])
  @@index([ticketId, status])
}
```
ความสัมพันธ์เพิ่มเติมใน Model เดิม:
- `Ticket`: เพิ่มความสัมพันธ์ `actionsTaken ActionTaken[]`
- `User`: เพิ่มความสัมพันธ์ `actionsTakenPerformed ActionTaken[] @relation("ActionTakenPerformer")` และ `actionsTakenAssigned ActionTaken[] @relation("ActionTakenAssignee")`

เหตุผลที่ต้องมีทั้ง `performedById` และ `assigneeId`: `performedById` คือผู้บันทึกที่ดึงจาก Authenticated Identity (audit) ส่วน `assigneeId` คือผู้ที่ได้รับมอบหมายให้ลงมือทำงานตาม Handout AC-01 / Part 6 ซึ่งต้องตรวจสอบว่าเป็น IT Staff/Admin ที่ Active

### Database Design Decisions & Justifications (ข้อกำหนด Handout §5.1)
1. **Decision 1: Relational Parent-Child Model with Foreign Key Indexing**:
   - *Justification*: เลือกสร้าง Table แยก `ActionTaken` เชื่อมโยงกับ `Ticket` ด้วย Foreign Key `ticketId` พร้อมสร้าง Index บน `ticketId` แทนการเก็บข้อมูลลงใน JSON column ของ Ticket เพื่อรักษาคุณสมบัติ First Normal Form (1NF), ความถูกต้องเชิงสัมพันธ์ (Referential Integrity), ความสามารถในการทำ Query กรองตามผู้ปฏิบัติงานหรือช่วงเวลา และประสิทธิภาพความเร็วในการ Join ข้อมูลสำหรับแดชบอร์ดและการตรวจสอบย้อนกลับ (Auditability)
2. **Decision 2: Optimistic Concurrency Control via Timestamp Verification**:
   - *Justification*: ในขั้นตอนการแก้ไขสถานะตั๋วและ Actions Taken ได้กำหนดให้มีกลไกตรวจสอบ `updatedAt` เพื่อป้องกันปัญหา Stale-update หรือ Lost Update เมื่อมีเจ้าหน้าที่ไอทีหลายคนเปิดดูตั๋วใบเดียวกันพร้อมกัน หาก timestamp ขณะบันทึกไม่ตรงกับข้อมูลล่าสุดในฐานข้อมูล ระบบจะปฏิเสธด้วย `409 Conflict` เพื่อให้ผู้ใช้โหลดข้อมูลล่าสุดก่อนตัดสินใจดำเนินการต่อ
3. **Decision 3: Non-Destructive Migration with Safe Nullable / Default Handling**:
   - *Justification*: การ Migration ต้องไม่ลบหรือดัดแปลงโครงสร้างตั๋วเดิมใน Lab 1–3 ตั๋วที่มีอยู่เดิมจะมีความสัมพันธ์ไปยัง `actionsTaken` เป็นลิสต์ว่าง `[]` โดยอัตโนมัติ ซึ่งสอดคล้องกับพฤติกรรมจริงของตั๋วในอดีต และ Seed Data จะถูกออกแบบให้เป็น Idempotent ด้วยคำสั่ง `upsert` เพื่อให้สามารถรันซ้ำกี่ครั้งก็ได้โดยไม่เกิดข้อผิดพลาดของข้อมูลซ้ำซ้อน
4. **Decision 4: แยก `assigneeId` ออกจาก `performedById` และใช้ Enum `ActionTakenStatus`**:
   - *Justification*: Handout AC-01 และ Part 6 กำหนดให้ Action Taken มี "approved assignee" และต้องทดสอบ "inactive-assignee rejection" จึงต้องแยกผู้รับผิดชอบงาน (`assigneeId`) ออกจากผู้บันทึก (`performedById`) เพื่อให้ตั๋วที่เป็นของเจ้าหน้าที่คนหนึ่งสามารถส่งต่องานให้เจ้าหน้าที่อีกคนทำได้ พร้อมทั้งใช้ Enum แทน String อิสระสำหรับ `status` เพื่อให้ฐานข้อมูลบังคับค่าที่อนุญาต (PENDING, IN_PROGRESS, COMPLETED, CANCELLED) และรองรับการสาธิต Complete/Cancel ตาม Rubric Part 6
5. **Decision 5: Composite Index `[ticketId, status]` สำหรับ Resolution Gate และ Dashboard**:
   - *Justification*: Resolution Gate ต้อง query หา Action Taken ที่ค้างสถานะของตั๋วทุกครั้งที่พยายาม Resolve และ Dashboard/หน้ารายละเอียดต้องกรองตามสถานะบ่อยครั้ง การสร้าง Composite Index ช่วยลดต้นทุนการ query เมื่อจำนวน Actions Taken เพิ่มขึ้นโดยไม่กระทบโครงสร้างข้อมูลเดิม

## 8. API Contract Summary (สรุป REST API Contract)
- `GET /api/tickets/:id/actions-taken`: ดึงรายการ Actions Taken ภายใต้ตั๋ว
- `POST /api/tickets/:id/actions-taken`: สร้าง Action Taken ใหม่ (เฉพาะ IT Staff/Admin, บันทึก `performedById` อัตโนมัติ, รับ `assigneeId` และ `status`, ตรวจสอบ assignee ต้องเป็น IT Staff/Admin ที่ Active)
- `PATCH /api/tickets/:id/actions-taken/:actionId`: แก้ไข Action Taken ที่มีอยู่เดิม รวมถึงมอบหมาย `assigneeId` และเปลี่ยน `status` (เฉพาะ IT Staff/Admin)
- `GET /api/dashboard/staff`: สรุปตัวชี้วัดเชิงปฏิบัติการและรายการตั๋วเร่งด่วนสำหรับ IT Staff/Admin
- `GET /api/dashboard/requester`: สรุปตัวชี้วัดตั๋วและรายการตั๋วสำหรับ Requester ผู้ล็อกอิน
- `PATCH /api/tickets/:id/status` หรือ `PATCH /api/tickets/:id`: อัปเดตสถานะตั๋วตาม Transition Matrix ตรวจสอบ Concurrency และบังคับ Resolution Gate (`409 Conflict` เมื่อยังมี Action ค้าง)
- ดูรายละเอียด Request/Response Schemas, Status Codes และ Error Handling ใน `docs/lab-04/api-spec.md`

## 9. Acceptance Criteria (เงื่อนไขการยอมรับ แบบ Given-When-Then)
- **AC-01**: Given ผู้ใช้มีบทบาท IT Staff หรือ Admin และส่งข้อมูล Action Taken ที่ถูกต้อง พร้อมระบุ `assigneeId` ที่เป็น IT Staff/Admin และ Active, When ส่งคำขอสร้าง Action Taken, Then ข้อมูลถูกบันทึกภายใต้ Ticket นั้น โดยระบุผู้ปฏิบัติงานเป็นผู้ที่ล็อกอินอยู่ ผู้รับผิดชอบตาม `assigneeId` ที่ตรวจสอบแล้ว และส่งคืน HTTP 201 Created
- **AC-02**: Given ผู้ใช้มีบทบาท Requester, When พยายามเรียก API เพื่อสร้างหรือแก้ไข Action Taken, Then เซิร์ฟเวอร์ตอบกลับ `403 Forbidden`
- **AC-03**: Given ผู้ใช้ส่งข้อมูล Action Taken โดยระบุ `followUpRequired = true` แต่ไม่ระบุ `followUpNote` หรือระบุเป็นข้อความว่าง, When บันทึกข้อมูล, Then เซิร์ฟเวอร์ปฏิเสธด้วย `400 Bad Request` พร้อมข้อความแจ้งเตือนข้อผิดพลาด
- **AC-04**: Given ผู้ใช้มีบทบาท IT Staff หรือ Admin, When เรียกดู IT Staff Dashboard, Then ระบบส่งคืนตัวชี้วัดการดำเนินงาน (`New`, `Open`, `In Progress`, `Waiting for Requester`, `My Assigned`) ที่คำนวณถูกต้องตรงกับฐานข้อมูล และรายการตั๋วเร่งด่วน
- **AC-05**: Given ผู้ใช้มีบทบาท Requester, When เรียกดู Requester Dashboard, Then ระบบส่งคืนเฉพาะตัวชี้วัดและรายการตั๋วที่ Requester รายนั้นเป็นเจ้าของเท่านั้น
- **AC-06**: Given Requester เข้าสู่ระบบ, When พยายามเรียกดู Dashboard ของ IT Staff (`/api/dashboard/staff`), Then เซิร์ฟเวอร์ตอบกลับ `403 Forbidden`
- **AC-07**: Given ตั๋วอยู่ในสถานะ `New`, When ผู้ใช้พยายามเปลี่ยนสถานะข้ามไปเป็น `Closed` โดยไม่ผ่านกระบวนการ, Then เซิร์ฟเวอร์ปฏิเสธด้วย `400 Bad Request` เนื่องจากละเมิด Transition Matrix
- **AC-08**: Given Requester ส่งสัญญาณ "Problem Appears Resolved", When บันทึกข้อมูล, Then สถานะของตั๋วยังคงเดิม (ไม่เปลี่ยนเป็น `Resolved`) และแสดง Advisory Flag ให้เจ้าหน้าที่ทราบ
- **AC-09**: Given เจ้าหน้าที่เปิดหน้าตั๋วค้างไว้แล้วพยายามอัปเดตสถานะ แต่มีเจ้าหน้าที่คนอื่นอัปเดตตั๋วไปก่อนหน้าแล้ว, When ส่งคำขออัปเดต, Then เซิร์ฟเวอร์ตรวจพบ Stale Update และส่งคืน `409 Conflict`
- **AC-10**: Given ผู้ใช้เปิดใช้งานแอปพลิเคชันบนอุปกรณ์มือถือ (หน้าจอ 375px), When ดูหน้า Dashboard และ Ticket Detail Actions Taken, Then การแสดงผลจัดเรียงอย่างถูกต้อง ไม่มีปุ่มหรือเนื้อหาทับซ้อน (Overlap) และไม่มีการเลื่อนในแนวนอน (No Horizontal Overflow)
- **AC-11**: Given การรันชุดทดสอบ Regression จาก Lab 1, Lab 2 และ Lab 3, When ดำเนินการทดสอบทั้งหมด, Then ทุกชุดทดสอบยังคงรันผ่าน 100%
- **AC-12**: Given ผู้ใช้มีบทบาท IT Staff หรือ Admin, When ส่งคำขอสร้างหรือแก้ไข Action Taken โดยระบุ `assigneeId` ของผู้ใช้ที่ `isActive = false` หรือมีบทบาท `REQUESTER`, Then เซิร์ฟเวอร์ปฏิเสธด้วย `422 Unprocessable Entity` พร้อมข้อความแจ้งว่า assignee ไม่ถูกต้อง และไม่บันทึกข้อมูลใดๆ ลงฐานข้อมูล
- **AC-13**: Given ตั๋วมี Action Taken อย่างน้อย 1 รายการที่มีสถานะ `PENDING` หรือ `IN_PROGRESS`, When IT Staff/Admin พยายามเปลี่ยนสถานะตั๋วเป็น `Resolved` (แม้จะข้ามหน้าจอ UI มาที่ API โดยตรง), Then เซิร์ฟเวอร์ปฏิเสธด้วย `409 Conflict` พร้อมระบุจำนวน Action ที่ยังค้าง และสถานะตั๋วยังคงเดิม
- **AC-14**: Given Action Taken อยู่ในสถานะ `PENDING`, When IT Staff/Admin เปลี่ยนสถานะเป็น `IN_PROGRESS` แล้ว `COMPLETED` หรือ `CANCELLED`, Then การเปลี่ยนสถานะสำเร็จและส่งคืน HTTP 200 แต่เมื่อพยายามเปลี่ยนจาก `COMPLETED` หรือ `CANCELLED` ไปสถานะอื่น ระบบต้องปฏิเสธด้วย `400 Bad Request` ตาม Action Taken Status Matrix (BR-14)
- **AC-15**: Given IT Staff/Admin สร้าง Action Taken ด้วยสถานะ `PENDING` หรือ `IN_PROGRESS`, When ไม่ส่ง `result`, Then ระบบบันทึกสำเร็จด้วย `result = null` (HTTP 201) แต่ถ้าสถานะเป็น `COMPLETED` และไม่ส่ง `result` หรือส่งเป็นค่าว่าง ระบบต้องปฏิเสธด้วย `400 Bad Request` (BR-16)

## 10. Definition of Done (นิยามความสำเร็จของสปรินต์)
- [ ] เอกสารข้อกำหนดทั้งหมดใน `docs/lab-04/` (`specification.md`, `api-spec.md`, `ui-spec.md`, `tests.md`) ครบถ้วนและสอดคล้องกัน
- [ ] โมเดลข้อมูล Prisma Schema และ Migration ผ่านการทดสอบแบบ Non-destructive ข้อมูลเดิมไม่สูญหาย
- [ ] Idempotent Seed Data รองรับการรันซ้ำอย่างปลอดภัย ครอบคลุมเคส 0, 1 และหลาย Actions Taken และทดสอบค่า Dashboard 0 และไม่เป็น 0 ได้
- [ ] API ทั้งหมดรองรับการตรวจสอบสิทธิ์ RBAC, Data Isolation และ Concurrency Handling อย่างถูกต้อง
- [ ] Action Taken มี `assigneeId` ที่ตรวจสอบสถานะ Active/บทบาท และมี `status` ที่เปลี่ยนได้ตาม Action Taken Status Matrix (Complete / Cancel)
- [ ] Resolution Gate บังคับใช้ที่ Backend: ไม่สามารถ Resolve ตั๋วได้ตราบใดที่ยังมี Action Taken สถานะ `PENDING` หรือ `IN_PROGRESS`
- [ ] หน้าจอ UI ทั้งหมดตกแต่งตามธีม Zen Green, รองรับ 3 Viewports และผ่านการตรวจ Accessibility
- [ ] ชุดทดสอบอัตโนมัติทั้งหมด (Server API, Client UI, Playwright E2E) ผ่าน 100% บนสาขา `main`
- [ ] ชุดทดสอบ Regression ของ Lab 1–3 ทั้งหมดรันผ่าน 100%
- [ ] บันทึกการตรวจทานโค้ด (Peer Review) ใน `docs/lab-04/reviewer.md` มีหลักฐานครบถ้วนทุก PR
- [ ] บันทึกการใช้งาน AI ใน `docs/lab-04/ai-use.md` มี Prompts สำคัญและบทสะท้อน (My Reflection)
- [ ] รวบรวมหลักฐานและรูปภาพผลลัพธ์จัดทำรายงาน PDF 1 ไฟล์ตามลำดับ Answer Part 1 ถึง Part 9

## 11. Assumptions and Decisions (ข้อสมมติฐานและการตัดสินใจ)
1. การระบุผู้ปฏิบัติงาน (`performedById`) ใน Action Taken จะถูกล็อคให้อ้างอิงตาม ID ของผู้ใช้ที่กำลังส่ง Request เสมอ เพื่อความโปร่งใสและการตรวจสอบย้อนหลัง (Auditability)
2. รายการ Actions Taken มีลักษณะเป็นประวัติการปฏิบัติงานที่บันทึกแล้วไม่ควรถูกลบทิ้ง (Append-mostly / No Hard Deletion API) จึงไม่มี Endpoint สำหรับการลบ Action Taken เพื่อรักษาหลักฐานการทำงาน
3. Requester Dashboard จะไม่นำเสนอข้อมูลสรุปของตั๋วคนอื่นเลยแม้แต่ตัวเลขสถิติรวม เพื่อรักษาความเป็นส่วนตัวและความปลอดภัยของข้อมูลตาม Handout §8.2
4. การนับจำนวนตัวชี้วัดบน IT Staff Dashboard สำหรับ "My Assigned" จะนับเฉพาะตั๋วที่สถานะยังไม่สิ้นสุด (`New`, `Open`, `In Progress`, `Waiting for Requester`, `Reopened`) ที่ถูกมอบหมายให้ตนเอง
5. Action Taken ที่สร้างใหม่จะมี `status` เริ่มต้นเป็น `PENDING` และต้องมี `assigneeId` ที่ถูกต้องเสมอ เพื่อให้ Resolution Gate ตรวจจับงานที่ยังไม่เสร็จได้จริง
6. การเปลี่ยนสถานะ Action Taken ใช้ `PATCH /api/tickets/:id/actions-taken/:actionId` ร่วมกับฟิลด์ `status` โดยไม่เพิ่ม Endpoint แยก เพื่อลดความซ้ำซ้อนของ API และรักษารูปแบบเดียวกับ PATCH ที่มีอยู่

