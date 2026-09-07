# Lab 2 UI Specification (ข้อกำหนดการออกแบบอินเทอร์เฟซ Zen Green Theme)

## 1. Color Tokens & Theme Palette (ชุดสี Zen Green)
- **Primary Green (`#006B3C`)**: ใช้สำหรับ Header ของแอปพลิเคชัน, ปุ่มหลัก (Primary Buttons) และข้อความที่เน้นย้ำความสำคัญ
- **Secondary Green (`#0B7A46`)**: ใช้สำหรับ Active Tabs, Focus Accents, ลิงก์ และสถานะ Hover
- **Pale Green (`#EAF6EF`)**: ใช้สำหรับแท็บที่เลือกอยู่, ข้อความสำเร็จ และพื้นหลังเน้นย้ำเซกชัน
- **Page Background (`#F5F7F6`)**: สีพื้นหลังหน้าเว็บ (Near-white)
- **Surface / Cards (`#FFFFFF`)**: พื้นหลังสีขาวพร้อมเส้นขอบ subtle border และเงาบางๆ
- **Text (`#1F2923`)**: สีตัวอักษร Charcoal-green สบายตา ไม่ใช่สีดำสนิท
- **Editable Field (`#FFFFFF`)**: พื้นหลังขาวพร้อมขอบ Neutral border ชัดเจน
- **Read-Only Field (`#F0F4F2`)**: พื้นหลังโทน Gray-green อ่านง่าย ชัดเจนแต่แก้ไขไม่ได้
- **Error (`#D92D20`)**: สีตัวอักษรและขอบสีแดงเข้ม แสดงใต้ฟิลด์ทันที
- **Warning (`#F79009`)**: สีส้มแอมเบอร์สำหรับ Badge หรือ Callout
- **Success (`#12B76A`)**: สีเขียวสดใสสำหรับการยืนยันและข้อความสำเร็จ

## 2. Typography & Form Layout Rules
- **Labels**: แสดงเหนือกว่่าตัวควบคุม (Inputs/Selects) ตัวหนาเล็กน้อย (Font weight 500/600)
- **Required Marker**: แสดงดอกจันสีแดง `*` ข้างหลังชื่อ Label สำหรับฟิลด์ที่บังคับกรอก
- **Inputs**: ความสูงมาตรฐานเท่ากัน (40px)
- **Buttons**:
  - Primary Button (สีเขียว `#006B3C` ตัวหนังสือขาว)
  - Secondary / Outline Button (ขอบเขียว ตัวหนังสือเขียว)
  - Busy State: เมื่อกำลังรันระบบ ปุ่มจะ Disabled และขึ้นข้อความ `Loading...` หรือไอคอนหมุน

## 3. Screen Layout Specifications

### 3.1 Development Requester Selection Screen
- การ์ดจัดวางตรงกลางหน้าจอ พร้อมไอคอนและหัวข้อ **Select Development Requester**
- กล่องข้อความอธิบาย: *"Select a Development Requester to test requester-specific ticket behavior. This is not a login screen."*
- Dropdown เลือก active users จากระบบ
- ปุ่ม **Continue** นำเข้าสู่ระบบ

### 3.2 Create Ticket Screen
- ส่วนบน: แสดงเลข Ticket Number (Generated / Read-only) และวันที่แจ้ง
- ส่วนกลาง: Dropdown เลือก Category, Related System และ Requested Priority (Low, Medium, High, Urgent)
- ส่วนล่าง: ฟิลด์ Summary (บรรทัดเดียว), Description (หลายบรรทัด)
- ส่วนไฟล์แนบ: พื้นหลัง Drag & drop หรือปุ่มเลือกไฟล์ แนบได้สูงสุด 5 ไฟล์
- ปุ่มยื่นส่ง: ปุ่ม [Submit Ticket] อยู่มุมล่างขวา

### 3.3 My Tickets Screen
- ส่วนบน: Bar ค้นหา (Search Input) และ Dropdown ตัวกรอง (Category, Priority, Status)
- ส่วนกลาง: ตารางรายการตั๋ว (Desktop) หรือ การ์ดตั๋ว (Mobile)
  - Columns: Ticket No., Created Date, Summary, Category, Requested Priority, Status, Last Updated
- ส่วนล่าง: Pagination (Previous, Page Numbers, Next) และตัวเลขสรุปจำนวนตั๋วทั้งหมด

### 3.4 Requester Ticket Detail Screen
- Header: แสดง Ticket Number, Status Badge และปุ่ม Back to My Tickets
- รายละเอียด: แสดงฟิลด์ข้อมูลทั้งหมดเป็น Read-only
- ไฟล์แนบ: รายการไฟล์แนบที่มีอยู่ พร้อมปุ่ม Download และปุ่ม Remove (Soft removal)
- หากไฟล์ถูก Soft-removed: แสดงป้าย `[Removed]` สีเทา พร้อมระบุเหตุผลการลบ และปิดการดาวน์โหลด

## 4. Responsive Viewport Rules
- **Desktop ($\ge 992\text{px}$)**: Layout หลายคอลัมน์ จัดวางกึ่งกลาง ความกว้างสูงสุด 1200px
- **Tablet ($768 - 991\text{px}$)**: Layout 2 คอลัมน์ ขยายความกว้างฟิลด์ Summary และ Description
- **Mobile ($< 768\text{px}$)**: Single column ฟิลด์เรียงซ้อนกันในแนวตั้ง ห้ามมี Horizontal Scrollbar
