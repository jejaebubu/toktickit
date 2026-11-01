# Lab 4 UI Specification & Design Guidelines (ข้อกำหนดการออกแบบส่วนติดต่อผู้ใช้)

## 1. Design System & Theme Integration (Zen Green Theme)
ระบบยังคงยึดหลักภาษาการออกแบบ **Zen Green Theme** อย่างต่อเนื่อง:
- **Primary Color**: `#006B3C` (Forest Green) — สีหลักของแถบนำทาง, ปุ่มบันทึก, ไอคอนเด่น
- **Secondary / Hover Color**: `#0B7A46` / `#00522E` — สีเมื่อชี้เมาส์หรือคลิก
- **Light Accent**: `#EAF6EF` — สีพื้นหลังของการ์ดตัวชี้วัด, แถบสรุปผล, และ Badge
- **Background**: `#F5F7F6` — สีพื้นหลังหลักของหน้าจอทั้งหมด
- **Surface / Card Background**: `#FFFFFF` พร้อมเส้นขอบ `#E2E8F0` หรือ `#DEE2E6`
- **Text Hierarchy**:
  - Headings & Primary Text: `#1A202C`
  - Secondary / Muted Text: `#6C757D`
  - Required Asterisk: `#E53E3E` (Red)
- **Status Badges**:
  - `New`: สีน้ำเงินสด (`#EBF8FF`, ข้อความ `#2B6CB0`)
  - `Open`: สีเขียวอมฟ้า (`#E6FFFA`, ข้อความ `#234E52`)
  - `In Progress`: สีเหลืองอำพัน (`#FEFCBF`, ข้อความ `#975A16`)
  - `Waiting for Requester`: สีม่วงคราม (`#EBF4FF`, ข้อความ `#4C51BF`)
  - `Resolved`: สีเขียวสดใส (`#C6F6D5`, ข้อความ `#22543D`)
  - `Closed`: สีเทาอ่อน (`#EDF2F7`, ข้อความ `#4A5568`)
  - `Reopened`: สีแดงกุหลาบ (`#FED7D7`, ข้อความ `#9B2C2C`)
  - `Cancelled`: สีส้มอิฐ (`#FFF2E5`, ข้อความ `#C2410C`)
- **Follow-Up Status Badges**:
  - `Follow-Up Required`: สีส้ม/เหลืองเข้ม (`#FFF3CD`, ข้อความ `#856404`) พร้อมไอคอนนาฬิกา
  - `No Follow-Up`: สีเขียวอ่อน (`#D4EDDA`, ข้อความ `#155724`) พร้อมไอคอนเช็คถูก

---

## 2. Screen Specifications

### 2.1 Navigation & Application Shell
- **Header Structure**:
  - แสดงโลโก้ TokTickIT และข้อความระบุระบบ
  - **เมนูนำทางตามบทบาท**:
    - **Requester**: `Dashboard` (หน้า Requester Dashboard), `My Tickets`, `Create Ticket`
    - **IT Staff**: `Dashboard` (หน้า IT Staff Dashboard), `Ticket Queue`, `Create Ticket`
    - **Administrator**: `Dashboard` (หน้า IT Staff Dashboard), `Ticket Queue`, `User Management`, `Create Ticket`
  - **Active Indicator**: เมนูหน้าที่กำลังเปิดอยู่จะเน้นสีพื้นหลัง `#EAF6EF` และตัวอักษร `#006B3C` พร้อมเส้นขีดล่างชัดเจน
  - **User Profile Area**: แสดงชื่อผู้ใช้, Role Badge และ Dropdown สำหรับสลับโปรไฟล์/เปลี่ยนรหัสผ่าน/ออกจากระบบ

---

### 2.2 IT Staff & Administrator Dashboard Screen
- **Greeting & Header**:
  - ข้อความต้อนรับ: `"Welcome back, {User Name}!"` และคำบรรยาย `"Here's what's happening with your queue today."`
  - ปุ่ม `Refresh` ขวามือเพื่อดึงข้อมูลสถิติล่าสุด
- **Operational Metric Cards (5 Cards Grid)**:
  - การ์ดประกอบด้วย: `New`, `Open`, `In Progress`, `Waiting for Requester`, และ `My Assigned`
  - รูปแบบการ์ด: ตัวเลขขนาดใหญ่ (32px Bold), ชื่อสถานะ, และลิงก์ Drill-down นำทางไปหน้ารายการ
  - **Drill-down Behavior**:
    - คลิกการ์ด `New` $\rightarrow$ เปิดหน้ารายการตั๋วพร้อม Filter `status=New`
    - คลิกการ์ด `Open` $\rightarrow$ เปิดหน้ารายการตั๋วพร้อม Filter `status=Open`
    - คลิกการ์ด `In Progress` $\rightarrow$ เปิดหน้ารายการตั๋วพร้อม Filter `status=In Progress`
    - คลิกการ์ด `Waiting for Requester` $\rightarrow$ เปิดหน้ารายการตั๋วพร้อม Filter `status=Waiting for Requester`
    - คลิกการ์ด `My Assigned` $\rightarrow$ เปิดหน้ารายการตั๋วพร้อม Filter `owner=me`
- **Content Columns (Two-column layout on Desktop)**:
  - **ซ้าย: Recent Queue Tickets**:
    - แสดงตั๋ว 5 รายการล่าสุดที่อัปเดตในคิวบริการ
    - แต่ละแถวแสดง: หมายเลขตั๋ว, หัวข้อตั๋ว, Status Badge, วันเวลาอัปเดตล่าสุด
    - คลิกที่ตั๋วจะเปิดหน้า Ticket Detail ของตั๋วใบนั้น
    - ลิงก์ `"View all"` ด้านบนขวา นำทางไป Ticket Queue
  - **ขวา: Quick Actions Panel**:
    - ปุ่มการกระทำด่วน:
      - `+ Create Ticket`: นำทางไปหน้าสร้างตั๋วใหม่
      - `🔍 Search Tickets`: นำทางไปหน้า Ticket Queue เพื่อค้นหา
      - `📋 My Queue`: นำทางไปดูตั๋วเฉพาะที่ตนเองเป็นผู้รับผิดชอบ
- **Empty & Loading States**:
  - แสดง Skeleton Loader ขณะกำลังดึงข้อมูล
  - หากไม่มีตั๋วในคิว แสดงภาพประกอบและข้อความ `"No active tickets in your queue."`

---

### 2.3 Requester Dashboard Screen
- **Greeting & Header**:
  - ข้อความต้อนรับ: `"Welcome, {User Name}!"` และคำบรรยาย `"Here's the latest on your requests."`
- **Requester Metric Cards (4 Cards Grid)**:
  - การ์ดประกอบด้วย: `My Open Tickets`, `In Progress`, `Resolved`, `Closed`
  - แต่ละการ์ดมีตัวเลขสรุป และปุ่ม `"View all"` เพื่อไปยังหน้า My Tickets ที่กรองสถานะตามการ์ด
- **Recent Tickets & Quick Actions**:
  - แสดงรายการตั๋วที่ตนเองส่งล่าสุด พร้อมสถานะและวันที่
  - ปุ่ม Quick Action: `+ Create Ticket` และ `📁 View My Tickets`
- **Ownership & Empty State**:
  - หาก Requester ยังไม่เคยสร้างตั๋ว จะแสดง Empty State ชักชวนให้เปิดตั๋วใบแรก พร้อมปุ่มกด `"Submit a new request"`

---

### 2.4 Actions Taken on Ticket Detail Screen
- **Placement & Container**:
  - จัดวางในส่วนล่างของหน้า Ticket Detail ต่อจากรายละเอียดตั๋วและกล่อง Comments/Notes
  - แถบหัวข้อระบุ `"Actions Taken"` พร้อม Badge สีเขียวแสดงจำนวนรายการ เช่น `(3)`
- **Role-Based Controls**:
  - **สำหรับ IT Staff และ Administrator**:
    - มีปุ่ม `"+ Add Action Taken"` สี Zen Green ชัดเจนที่มุมขวาบนของส่วน Actions Taken
    - มีปุ่ม `"Edit"` บนการ์ดประวัติแต่ละรายการ
  - **สำหรับ Requester**:
    - **ไม่แสดง** ปุ่ม `"+ Add Action Taken"` และปุ่ม `"Edit"`
    - แสดงประวัติทั้งหมดในรูปแบบ Read-only เพื่อความโปร่งใสในการตรวจสอบงาน
- **Create / Edit Form Controls**:
  - `Action Date/Time`: Input ชนิด datetime-local (ค่าเริ่มต้นคือเวลาปัจจุบัน)
  - `Action Description`: Textarea (บังคับกรอก มีดอกจันสีแดง `*`)
  - `Result`: Textarea สำหรับบันทึกผลการปฏิบัติงาน (บังคับกรอก `*` **เฉพาะเมื่อ `Action Status = COMPLETED`**) หากสถานะเป็น `PENDING`, `IN_PROGRESS` หรือ `CANCELLED` สามารถเว้นว่างได้ และ UI ต้องไม่บล็อกการบันทึก (BR-16)
  - `Assignee`: Dropdown (Select) สำหรับเลือกผู้รับผิดชอบงาน
    - แสดงเฉพาะผู้ใช้บทบาท `IT_STAFF` และ `ADMINISTRATOR` ที่มีสถานะ `isActive = true`
    - **บังคับเลือก** (มีดอกจันสีแดง `*`) และต้องแสดงชื่อพร้อม Badge บทบาทในตัวเลือก
    - ไม่แสดงผู้ใช้บทบาท `REQUESTER` หรือบัญชีที่ถูกปิดใช้งานในรายการ
  - `Action Status`: Dropdown หรือปุ่มเปลี่ยนสถานะของ Action Taken (`PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`)
    - แสดง Badge สถานะปัจจุบันบนการ์ดรายการ พร้อมปุ่ม `Complete` และ `Cancel` สำหรับ IT Staff/Admin
    - ปุ่ม Complete / Cancel ต้องมี Loading state และ Disable ระหว่างบันทึกเพื่อป้องกันการกดซ้ำ
    - เมื่อเปลี่ยนเป็น `COMPLETED` หรือ `CANCELLED` แล้ว ตัวเลือกเปลี่ยนสถานะเพิ่มเติมต้องถูกซ่อน (Final state)
  - `Follow-Up Required?`: สวิตช์เปิด/ปิด หรือ Checkbox
  - `Follow-Up Note`: Textarea สำหรับระบุรายละเอียดการติดตามงาน
    - **Dynamic Behavior**: หากเลือก `Follow-Up Required = true` ช่องนี้จะแสดงขึ้นมาพร้อมดอกจันสีแดง `*` และระบบจะตรวจสอบไม่ให้เว้นว่าง
    - หาก `Follow-Up Required = false` ช่องนี้จะถูกซ่อนหรือปิดการใช้งาน
  - `Attachment Notes`: Input ข้อความสำหรับระบุชื่อไฟล์ ภาพ หรือเอกสารอ้างอิง เช่น `"network-log.txt, switch-photo.jpg"`
  - ปุ่ม `Save Action` (มีสถานะ Loading ป้องกันการกดซ้ำ) และปุ่ม `Cancel`
  - **Validation Feedback**: หากเลือก Assignee ที่ไม่ถูกต้อง (inactive หรือ Requester) ให้แสดง error ใต้ช่อง และหากเซิร์ฟเวอร์ตอบ `422 Unprocessable Entity` ให้แสดงข้อความ error จาก API โดยไม่ล้างข้อมูลที่ผู้ใช้กรอก
- **Actions Taken List Display**:
  - แสดงรายการเรียงจากรายการล่าสุดไปเก่าสุด
  - แต่ละการ์ดแสดง:
    - วัน-เวลาที่ปฏิบัติงาน (จัดรูปแบบอ่านง่าย เช่น `Oct 30, 2026, 10:30 AM`)
    - ผู้ปฏิบัติงาน: ชื่อเจ้าหน้าที่ พร้อม Badge บทบาท `IT_STAFF`
    - ผู้รับผิดชอบ (`Assignee`): ชื่อเจ้าหน้าที่ พร้อม Badge บทบาท
    - Badge สถานะ Action Taken: `PENDING` (เทา/เหลือง), `IN_PROGRESS` (น้ำเงิน), `COMPLETED` (เขียว), `CANCELLED` (เทาเข้ม) พร้อมข้อความไม่ใช้สีเพียงอย่างเดียว (มี label/ไอคอน)
    - รายละเอียดงาน (Description) และผลลัพธ์ (Result)
    - Badge สถานะ Follow-Up พร้อมข้อความบันทึก (ถ้ามี)
    - โน้ตไฟล์แนบ (Attachment Notes) แสดงด้วยไอคอนคลิปหนีบกระดาษ

---

### 2.5 Ticket Status Workflow & Resolution Gate UI
- **Workflow Action Bar (IT Staff / Admin)**:
  - ปุ่มเปลี่ยนสถานะแสดง **เฉพาะสถานะที่อนุญาตให้เปลี่ยนได้** จากสถานะปัจจุบันตาม Transition Matrix
  - เมื่อเปลี่ยนสถานะสำเร็จ แสดง Toast Notification สีเขียว และอัปเดตข้อมูลบนหน้าจอทันที
  - **Resolution Gate Feedback**:
    - หากตั๋วยังมี Action Taken ที่มีสถานะ `PENDING` หรือ `IN_PROGRESS` อยู่ ปุ่ม `Resolve` ต้องมีไอคอน/ข้อความเตือนว่า `"N action(s) still open"` และไม่แสดงเป็นปุ่มปกติที่กดได้โดยไม่แจ้งเตือน
    - เมื่อผู้ใช้กด `Resolve` ระบบต้องแสดง Modal ยืนยันระบุว่า `"This ticket still has N unresolved action(s). Complete or cancel them before resolving the ticket."` พร้อมรายการ Action ที่ค้าง (ถ้าทำได้) และปุ่ม `Cancel` เป็นค่าเริ่มต้น
    - หากยืนยัน ระบบต้องส่งคำขอไปยัง Backend และแสดง error จาก `409 Conflict` (`UNRESOLVED_ACTIONS_EXIST`) โดยไม่เปลี่ยนสถานะตั๋วบนหน้าจอ
    - ห้ามปิดกั้นเฉพาะที่ UI เท่านั้น: Backend ต้องปฏิเสธเช่นกันเมื่อมีการเรียก API โดยตรง
  - หากเกิด Concurrency Conflict (มีผู้อื่นแก้ตั๋วไปก่อน) แสดง Modal แจ้งเตือน `"Ticket has been updated by another user. Please refresh."` พร้อมปุ่มกดโหลดข้อมูลใหม่
- **Resolution Gate UI (Requester)**:
  - ในหน้าตั๋วของ Requester หากตั๋วยังไม่ปิด และยังไม่ได้ระบุเจตนา จะมีปุ่ม/แบนเนอร์ `"My problem is resolved"`
  - เมื่อคลิก จะแสดงข้อความยืนยัน: `"This will notify IT Staff that your issue is resolved. IT Staff will verify and officially close the ticket."`
  - เมื่อส่งแล้ว สถานะตั๋วจะยังไม่เป็น Resolved แต่จะมี Advisory Badge สีเขียวขึ้นว่า `"Requester indicated problem resolved - Pending Staff Review"`

---

## 3. Responsive Breakpoints & Accessibility
- **Viewports รองรับ**:
  - **Desktop ($\ge 1280\text{px}$)**: แสดงผลตารางเต็ม แดชบอร์ดแบบ 2 คอลัมน์ และการ์ดตัวชี้วัดเรียงแนวนอน 4–5 คอลัมน์
  - **Tablet ($768\text{px} - 1279\text{px}$)**: ปรับการ์ดตัวชี้วัดเป็น 2–3 คอลัมน์ และเรียงกล่องเนื้อหาในแนวตั้ง
  - **Mobile ($< 768\text{px}$)**:
    - การ์ดตัวชี้วัดเรียงเป็น 1 คอลัมน์หรือ 2 คอลัมน์กะทัดรัด
    - แปลงตารางเป็น Card View ในแนวตั้ง
    - ห้ามมีแถบเลื่อนแนวนอน (Zero Horizontal Overflow: `overflow-x: hidden` บน Container)
- **Accessibility (WCAG 2.1 AA)**:
  - Touch target บนทุกปุ่มและลิงก์มีขนาดไม่ต่ำกว่า $44 \times 44\text{px}$
  - สีข้อความมี Contrast Ratio เทียบกับพื้นหลังไม่ต่ำกว่า $4.5:1$
  - มี Visible Focus Ring เมื่อใช้งานผ่านคีย์บอร์ด (ปุ่ม Tab)
  - ทุก Input Field มี Label ผูกด้วย `htmlFor` และมี `aria-required="true"` บนช่องที่บังคับกรอก

