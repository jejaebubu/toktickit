# Lab 3 REST API Specification (ข้อกำหนดการเชื่อมต่อ REST API)

## 1. Authentication & Security Policy
ระบบใช้การพิสูจน์ตัวตนผ่าน HTTP-Only Session Cookie หรือ Bearer Token ที่สร้างขึ้นเมื่อล็อกอินสำเร็จ โดยในทุก Request เซิร์ฟเวอร์จะระบุตัวตนและบทบาท (`REQUESTER`, `IT_STAFF`, `ADMINISTRATOR`) จาก Credentials ที่ผ่านการยืนยันแล้ว

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
        "createdAt": "2026-05-12T09:14:00Z",
        "updatedAt": "2026-05-13T10:30:00Z"
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 87, "totalPages": 9 }
  }
  ```

#### GET /api/tickets/:id
- **คำอธิบาย**: ดึงรายละเอียดตั๋วรายใบ
- **Success Response (`200 OK`)**: ตั๋วพร้อมรายละเอียด Attachments, Public Comments, และ Internal Notes (ถ้ามีสิทธิ์)
- **Error Responses**:
  - `403 Forbidden`: พยายามเข้าถึงตั๋วของผู้อื่น (สำหรับ Requester)
  - `404 Not Found`: ไม่พบตั๋ว

#### PATCH /api/tickets/:id
- **คำอธิบาย**: อัปเดตตั๋ว (Claim ownership, Reassign owner, IT Priority, Status Change)
- **Request Body**:
  ```json
  {
    "ownerId": 5,
    "itPriority": "HIGH",
    "status": "In Progress"
  }
  ```
- **Success Response (`200 OK`)**: วัตถุ Ticket ที่อัปเดตแล้ว

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

#### POST /api/tickets/:id/comments
- **คำอธิบาย**: โพสต์ Public Comment ใหม่
- **Request Body**:
  ```json
  { "content": "We are investigating the issue on your device." }
  ```
- **Success Response (`201 Created`)**

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
- **Error Response (`409 Conflict`)**: เมื่ออีเมลซ้ำในระบบ

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
