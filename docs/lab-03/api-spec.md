# Lab 3 REST API Specification (ข้อกำหนดการเชื่อมต่อ REST API)

## 1. Authentication & Security Policy
ระบบใช้การพิสูจน์ตัวตนผ่าน **Bearer Token (JWT)** เพียงกลไกเดียว — Client ต้องแนบ Header `Authorization: Bearer <token>` ในทุก Request (ยกเว้น `POST /api/auth/login`) โดย Token สร้างขึ้นเมื่อล็อกอินสำเร็จ เซิร์ฟเวอร์ระบุตัวตนและบทบาท (`REQUESTER`, `IT_STAFF`, `ADMINISTRATOR`) จาก Token ที่ผ่านการยืนยันแล้วเท่านั้น และ **เพิกเฉยข้อมูลระบุตัวตนที่ส่งมากับ payload/query/header** เช่น `requesterId` เสมอ (ดู BR-03)

**Password Policy (ตรวจสอบฝั่งเซิร์ฟเวอร์ทุก Endpoint ที่ตั้งหรือเปลี่ยนรหัสผ่าน)**:
- ความยาวอย่างน้อย 8 ตัวอักษร
- มีอักษรพิมพ์ใหญ่และพิมพ์เล็กอย่างน้อย 1 ตัว
- มีตัวเลขหรือสัญลักษณ์พิเศษอย่างน้อย 1 ตัว
- หากไม่ผ่านเกณฑ์ → ตอบกลับ `400 Bad Request` พร้อมข้อความแจ้งเกณฑ์ที่ละเมิด

---

## 2. Endpoints & Error Handling Details

### 2.1 Authentication APIs

#### POST /api/auth/login
- **คำอธิบาย**: เข้าสู่ระบบด้วย Email และ Password
- **Request Body**:
  ```json
  {
    "email": "jennifer@toktickit.com",
    "password": "Password123!"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "user": {
      "id": 1,
      "name": "Jennifer Anderson",
      "email": "jennifer@toktickit.com",
      "role": "REQUESTER",
      "mustChangePassword": false,
      "isActive": true
    },
    "token": "eyJhbGciOi..."
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: อีเมลหรือรหัสผ่านไม่ถูกต้อง หรือบัญชีถูกปิดใช้งาน (`isActive = false`)
  - `400 Bad Request`: รูปแบบข้อมูลไม่ถูกต้อง

#### POST /api/auth/logout
- **คำอธิบาย**: ออกจากระบบและยกเลิกเซสชัน
- **Success Response (`200 OK`)**:
  ```json
  { "message": "Logged out successfully." }
  ```

#### GET /api/auth/me
- **คำอธิบาย**: ดึงข้อมูลผู้ใช้ที่เข้าสู่ระบบปัจจุบัน
- **Success Response (`200 OK`)**:
  ```json
  {
    "user": {
      "id": 1,
      "name": "Jennifer Anderson",
      "email": "jennifer@toktickit.com",
      "role": "REQUESTER",
      "mustChangePassword": false,
      "isActive": true
    }
  }
  ```
- **Error Response (`401 Unauthorized`)**: เมื่อไม่ได้ล็อกอิน

#### POST /api/auth/change-password
- **คำอธิบาย**: เปลี่ยนรหัสผ่านใหม่ (ใช้สำหรับ Mandatory First Login Change และการเปลี่ยนรหัสผ่านปกติ)
- **Request Body**:
  ```json
  {
    "currentPassword": "InitialPassword123!",
    "newPassword": "NewSecurePassword123!"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "message": "Password changed successfully.",
    "user": {
      "id": 1,
      "mustChangePassword": false
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: รหัสผ่านใหม่ไม่ผ่าน Password Policy หรือรหัสผ่านปัจจุบันไม่ถูกต้อง
  - `401 Unauthorized`: ไม่ได้ล็อกอิน

---

### 2.2 IT Staff Ticket Queue & Ticket Management APIs

#### GET /api/tickets
- **คำอธิบาย**: ดึงรายการตั๋วงาน
  - หากสิทธิ์เป็น **Requester**: คืนค่าเฉพาะตั๋วที่เป็นเจ้าของ
  - หากสิทธิ์เป็น **IT Staff / Admin**: คืนค่า Ticket Queue พร้อมการค้นหา/กรอง/จัดเรียง/แบ่งหน้า
- **Query Parameters**: `search`, `category`, `status`, `requestedPriority`, `itPriority`, `ownerId`, `sort`, `order`, `page`, `limit`
- **Success Response (`200 OK`)**:
  ```json
  {
    "tickets": [
      {
        "id": 1,
        "ticketNumber": "TKT-2026-001234",
        "summary": "Laptop battery drains quickly",
        "category": { "name": "Hardware" },
        "relatedSystem": { "name": "Corporate Laptop" },
        "requestedPriority": "MEDIUM",
        "itPriority": "MEDIUM",
        "status": "In Progress",
        "requester": { "id": 1, "name": "Jennifer Anderson", "email": "jennifer@toktickit.com" },
        "owner": { "id": 5, "name": "Michael Brown", "email": "michael@toktickit.com" },
        "requesterIndicatedResolved": false,
        "createdAt": "2026-05-12T09:14:00Z",
        "updatedAt": "2026-05-13T10:30:00Z"
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 87, "totalPages": 9 }
  }
  ```

#### GET /api/tickets/:id
- **คำอธิบาย**: ดึงรายละเอียดตั๋วรายใบ
- **Success Response (`200 OK`)**: ตั๋วพร้อม `requesterIndicatedResolved`, รายละเอียด Attachments, Public Comments, และ Internal Notes (ถ้ามีสิทธิ์)
- **Error Responses**:
  - `404 Not Found`: ไม่พบตั๋ว **หรือ** Requester พยายามเปิดตั๋วของผู้อื่น — ตอบ `404` เหมือนกันทั้งคู่ เพื่อไม่เปิดเผยให้ผู้อื่นรู้ว่าตั๋วนั้นมีอยู่จริง (Handout §6.2 Data Leakage Prevention)
  - `401 Unauthorized`: ไม่ได้ล็อกอิน

#### PATCH /api/tickets/:id
- **คำอธิบาย**: อัปเดตตั๋ว
  - **IT Staff / Admin** (สิทธิ์เต็ม): Claim/Reassign Owner (`ownerId`), IT Priority (`itPriority`), Status Change (`status`)
  - **Requester** (เฉพาะเจ้าของตั๋ว): ระบุเจตนา "Problem Appears Resolved" โดยส่ง `requesterIndicatedResolved: true` (หรือ `false` เพื่อยกเลิก) → เซิร์ฟเวอร์บันทึกค่าและเปลี่ยนสถานะเป็น `Waiting for Requester` เพื่อให้ IT Staff/Admin ตรวจสอบ (BR-05)
- **Request Body (Staff / Admin)**:
  ```json
  {
    "ownerId": 5,
    "itPriority": "HIGH",
    "status": "In Progress"
  }
  ```
- **Request Body (Requester)**:
  ```json
  {
    "requesterIndicatedResolved": true
  }
  ```
- **Success Response (`200 OK`)**: วัตถุ Ticket ที่อัปเดตแล้ว (รวม `requesterIndicatedResolved` และ `status` ล่าสุด)
- **Error Responses**:
  - `404 Not Found`: ตั๋วไม่มี หรือ Requester ไม่ใช่เจ้าของตั๋ว (ไม่เปิดเผยการมีอยู่)
  - `403 Forbidden`: Requester พยายามแก้ไข `ownerId`/`itPriority`/`status` โดยตรง — อนุญาตส่งได้เฉพาะ `requesterIndicatedResolved`
  - `400 Bad Request`: ค่าที่ส่งไม่ถูกต้อง (เช่น `status`/`itPriority` ไม่อยู่ในชุดที่อนุญาต, `ownerId` ไม่ใช่ IT Staff/Admin)
  - `401 Unauthorized`: ไม่ได้ล็อกอิน

---

### 2.3 Comments & Internal Notes APIs

#### GET /api/tickets/:id/comments
- **คำอธิบาย**: ดึง Public Comments ทั้งหมดของตั๋ว
- **Success Response (`200 OK`)**:
  ```json
  [
    {
      "id": 1,
      "content": "Thank you for the update. Please let me know if you need additional information.",
      "author": { "id": 1, "name": "Jennifer Anderson", "role": "REQUESTER" },
      "createdAt": "2026-05-13T11:45:00Z"
    }
  ]
  ```
- **Error Response (`404 Not Found`)**: ตั๋วไม่มี หรือ Requester ไม่ใช่เจ้าของตั๋ว (ไม่เปิดเผยการมีอยู่)

#### POST /api/tickets/:id/comments
- **คำอธิบาย**: โพสต์ Public Comment ใหม่
- **Request Body**:
  ```json
  { "content": "We are investigating the issue on your device." }
  ```
- **Success Response (`201 Created`)**
- **Error Response (`404 Not Found`)**: ตั๋วไม่มี หรือ Requester ไม่ใช่เจ้าของตั๋ว (ไม่เปิดเผยการมีอยู่)

#### GET /api/tickets/:id/internal-notes
- **คำอธิบาย**: ดึง Internal Notes ของตั๋ว (เฉพาะ IT Staff และ Admin)
- **Error Response (`403 Forbidden`)**: เมื่อ Requester เรียกใช้

#### POST /api/tickets/:id/internal-notes
- **คำอธิบาย**: โพสต์ Internal Note (เฉพาะ IT Staff และ Admin)
- **Request Body**:
  ```json
  { "content": "Internal check: Checked logs on server B, reboot scheduled." }
  ```
- **Success Response (`201 Created`)**

---

### 2.4 Administrator User Management APIs

#### GET /api/users
- **คำอธิบาย**: ดึงรายชื่อผู้ใช้ทั้งหมด ( Admin เท่านั้น )
- **Query Parameters**: `search` (ค้นหาตามชื่อ/อีเมล), `role` (`REQUESTER`, `IT_STAFF`, `ADMINISTRATOR`)
- **Success Response (`200 OK`)**:
  ```json
  [
    {
      "id": 1,
      "name": "Jennifer Anderson",
      "email": "jennifer@toktickit.com",
      "role": "REQUESTER",
      "isActive": true,
      "mustChangePassword": false,
      "createdAt": "2026-01-10T00:00:00Z"
    }
  ]
  ```

#### POST /api/users
- **คำอธิบาย**: สร้างผู้ใช้ใหม่พร้อม 1 บทบาทและรหัสผ่านเริ่มต้น ( Admin เท่านั้น )
- **Request Body**:
  ```json
  {
    "name": "Alex Thompson",
    "email": "alex.thompson@toktickit.com",
    "role": "IT_STAFF",
    "isActive": true,
    "initialPassword": "Password123!"
  }
  ```
- **Success Response (`201 Created`)**
- **Error Responses**:
  - `409 Conflict`: อีเมลซ้ำในระบบ
  - `400 Bad Request`: `role` ไม่อยู่ในชุดที่อนุญาต หรือรหัสผ่านเริ่มต้นไม่ผ่าน Password Policy

#### PATCH /api/users/:id
- **คำอธิบาย**: แก้ไขข้อมูลผู้ใช้ (ชื่อ, อีเมล, บทบาท, สถานะการใช้งาน) ( Admin เท่านั้น )
- **Request Body**:
  ```json
  {
    "name": "Alex Thompson",
    "email": "alex.thompson@toktickit.com",
    "role": "IT_STAFF",
    "isActive": false
  }
  ```
- **Success Response (`200 OK`)**
- **Error Responses**:
  - `400 Bad Request`: พยายามปิดใช้งานตนเอง (`self-deactivation`) หรือปิดใช้งาน Admin คนสุดท้าย

#### POST /api/users/:id/reset-password
- **คำอธิบาย**: รีเซ็ตรหัสผ่านเริ่มต้นใหม่ให้ผู้ใช้ โดยจะปรับ `mustChangePassword = true` ( Admin เท่านั้น )
- **Request Body**:
  ```json
  { "initialPassword": "NewInitialPass123!" }
  ```
- **Success Response (`200 OK`)**
- **Error Response (`400 Bad Request`)**: รหัสผ่านเริ่มต้นใหม่ไม่ผ่าน Password Policy
