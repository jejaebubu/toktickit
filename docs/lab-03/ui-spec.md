# Lab 3 UI Specification & Design Guidelines (ข้อกำหนดการออกแบบส่วนติดต่อผู้ใช้)

## 1. Design System & Theme Integration (Zen Green Theme)
- **Primary Color**: `#006B3C` (Forest Green) - ใช้กับ Header, Primary Buttons, Active Tabs
- **Secondary / Hover Color**: `#0B7A46` / `#00522E`
- **Light Accent / Pale**: `#EAF6EF` - ใช้กับ Background บล็อกข้อมูล, Selected Row, Soft Alert Background
- **Background**: `#F5F7F6` - พื้นหลังหน้าจอหลัก
- **Text & Borders**: Text Primary `#1A202C`, Text Muted `#6C757D`, Border Light `#DEE2E6`
- **Role Badges**:
  - `REQUESTER`: Light Blue / Teal (`#E6F6FF`, Text `#006699`)
  - `IT_STAFF`: Purple / Indigo (`#F0F0FF`, Text `#4B0082`)
  - `ADMINISTRATOR`: Amber / Gold (`#FFF8E6`, Text `#B7791F`)
- **Status Badges**:
  - `New`: Blue (`#EBF8FF`, Text `#2B6CB0`)
  - `Open`: Teal (`#E6FFFA`, Text `#234E52`)
  - `In Progress`: Yellow / Orange (`#FEFCBF`, Text `#975A16`)
  - `Waiting for Requester`: Purple (`#EBF4FF`, Text `#4C51BF`)
  - `Resolved`: Green (`#C6F6D5`, Text `#22543D`)
  - `Closed`: Gray (`#EDF2F7`, Text `#4A5568`)
  - `Reopened`: Red (`#FED7D7`, Text `#9B2C2C`)

---

## 2. Screen Specifications

### 2.1 Login & Mandatory Change Password Screens
- **Login Screen**:
  - โครงสร้าง: Card กึ่งกลางหน้าจอ แสดงโลโก้ TokTickIT
  - Input Fields: Email, Password (พร้อมปุ่ม Toggle ดู/ซ่อน รหัสผ่าน)
  - States: Normal, Validation Error, Busy (Disabled Form + Spinner), Alert Error (กรณี Password ผิดหรือ Account Inactive)
- **Mandatory Change Password Screen**:
  - แสดงข้อความเตือน "You must change your password to continue."
  - Input Fields: Current Password, New Password, Confirm New Password
  - Visual Checklist: รหัสผ่านอย่างน้อย 8 ตัวอักษร, มีอักษรพิมพ์ใหญ่/เล็ก, ตัวเลข/สัญลักษณ์พิเศษ

### 2.2 Application Shell & Header
- **Header Structure**:
  - ด้านซ้าย: Brand Logo "TokTickIT"
  - ตรงกลาง: Navigation Links ตามสิทธิ์ (Requester: My Tickets, Create Ticket; IT Staff: Ticket Queue; Admin: User Management)
  - ด้านขวา: Avatar/User Name, Role Badge, และ Dropdown Menu (Profile, Change Password, Logout)

### 2.3 IT Staff Ticket Queue Screen
- **Toolbar**: Search box (ค้นหาตาม Ticket No. หรือ Summary) + Filter controls (Status, Priority, Category, Owner)
- **Data Table (Desktop $\ge 992\text{px}$)**:
  - Columns: Ticket No., Created Date, Summary, Category, Requested Priority, IT Priority, Status, Owner
  - Pagination bar ด้านล่างพร้อมตัวเลขหน้า
- **Card View (Mobile $< 768\text{px}$)**:
  - แปลงตารางเป็นรายการ Card สไตล์ Zen Green ที่ซ้อนข้อมูลในแนวตั้ง ป้องกัน Horizontal Scrollbar

### 2.4 IT Staff Ticket Detail Screen
- **Sections**:
  - Header Info: Ticket No., Category, Related System, Status, Owner, Requested Priority, IT Priority
  - Operational Controls: Select IT Owner (Claim / Assign), Select IT Priority, Status Action Buttons
  - Summary & Description
  - Communication Tabs/Sections:
    - **Public Comments**: กล่องสีขาว ขอบเขียว อธิบายชัดเจนว่าแชร์กับ Requester
    - **Internal Notes**: กล่องสีเหลืองอ่อน/ครีม (`#FFFDF0`) ขอบสีส้มอ่อน พร้อมป้าย "Internal Note - Visible only to IT Staff & Admin"
  - Attachments list

### 2.5 Administrator User Management Screen
- **Layout**: split view หรือ modal layout
  - รายการ User List Table: Name, Email, Role, Status (`Active` / `Inactive`), Action (Edit / Reset Password)
  - Toolbar: Search input, Role Filter Dropdown, ปุ่ม "+ Create User"
  - Modal / Side Drawer: ฟอร์มสร้าง/แก้ไขผู้ใช้ และฟอร์มตั้งรหัสผ่านเริ่มต้นใหม่

---

## 3. Screenshots Evidence Checklist for Lab 3 PDF
- [x] Login Screen (Normal, Busy, Invalid Credentials, Inactive Account)
- [x] Mandatory First-Login Change Password Screen
- [x] Application Shell (Requester, IT Staff, Admin navigation)
- [x] IT Staff Ticket Queue (Desktop Table & Mobile Responsive Cards)
- [x] IT Staff Ticket Detail (Operational controls, Public Comments, Internal Notes)
- [x] Administrator User Management Screen (User list, Search/Filter, Create User, Edit User, Reset Password)
