# Lab 4 REST API Specification (ข้อกำหนดการเชื่อมต่อ REST API)

## 1. Authentication & Security Policy
ระบบ TokTickIT ใน Lab 4 สืบทอดและขยายกลไกความมั่นคงปลอดภัยจาก Lab 3:
- **Authentication**: ใช้ Bearer Token (JSON Web Token - JWT) แนบผ่าน HTTP Header `Authorization: Bearer <token>` ทุก Request
- **Identity Enforcement**: ข้อมูลผู้ใช้และบทบาท (`REQUESTER`, `IT_STAFF`, `ADMINISTRATOR`) ถูกถอดรหัสจาก Token ที่ตรวจสอบความถูกต้องแล้วฝั่งเซิร์ฟเวอร์เท่านั้น ห้ามเชื่อถือ ID ผู้ใช้ที่ส่งมากับ Payload
- **Data Isolation & Leakage Prevention**:
  - Requester สามารถเข้าถึงได้เฉพาะ Ticket, Comments และ Actions Taken ของตนเองเท่านั้น
  - หาก Requester พยายามเข้าถึงทรัพยากรของผู้อื่น เซิร์ฟเวอร์ต้องตอบกลับด้วย `404 Not Found` (ห้ามตอบ `403 Forbidden`) เพื่อไม่ให้เปิดเผยการมีอยู่ของข้อมูล
- **Role-Based Access Control (RBAC)**:
  - การเรียกใช้ API ที่สงวนไว้เฉพาะบทบาท เช่น การสร้าง/แก้ไข Actions Taken, IT Staff Dashboard จะถูกตรวจจับด้วย Middleware และตอบกลับด้วย `403 Forbidden` หากบทบาทไม่ตรง

---

## 2. Actions Taken Endpoints

### 2.1 GET /api/tickets/:id/actions-taken
- **คำอธิบาย**: ดึงรายการประวัติ Actions Taken ทั้งหมดภายใต้ตั๋วที่ระบุ
- **Authorization**:
  - `IT_STAFF`, `ADMINISTRATOR`: เรียกดูได้ทุกตั๋ว
  - `REQUESTER`: เรียกดูได้เฉพาะตั๋วที่ตนเองเป็นเจ้าของ (`requesterId == currentUser.id`) หากเป็นตั๋วของผู้อื่น ตอบกลับ `404 Not Found`
- **Path Parameters**:
  - `id` (integer, required): รหัสตั๋วงาน
- **Success Response (`200 OK`)**:
  ```json
  [
    {
      "id": "c1f7a0b2-4d8e-4f1a-9b2c-8e3f4a5b6c7d",
      "ticketId": 12,
      "actionDateTime": "2026-10-30T09:30:00.000Z",
      "actionDescription": "Checked network switch port and re-crimped RJ45 connector",
      "result": "Link light active, ping test stable with 0% packet loss",
      "performedById": 2,
      "performedBy": {
        "id": 2,
        "name": "Michael Chen",
        "email": "michael.chen@toktickit.com",
        "role": "IT_STAFF"
      },
      "assigneeId": 3,
      "assignee": {
        "id": 3,
        "name": "Sarah Johnson",
        "email": "sarah.johnson@toktickit.com",
        "role": "IT_STAFF",
        "isActive": true
      },
      "status": "COMPLETED",
      "followUpRequired": true,
      "followUpNote": "Monitor connection stability over the next 24 hours",
      "attachmentNotes": "speedtest-results.png",
      "createdAt": "2026-10-30T09:35:00.000Z",
      "updatedAt": "2026-10-30T09:35:00.000Z"
    }
  ]
  ```
- **Error Responses**:
  - `401 Unauthorized`: ไม่ได้แนบ Token หรือ Token ไม่ถูกต้อง
  - `404 Not Found`: ไม่พบตั๋วงาน หรือตั๋วเป็นของผู้อื่น (สำหรับ Requester)

---

### 2.2 POST /api/tickets/:id/actions-taken
- **คำอธิบาย**: สร้างรายการ Action Taken ใหม่ภายใต้ตั๋วงาน
- **Authorization**: เฉพาะ `IT_STAFF` และ `ADMINISTRATOR` เท่านั้น (`REQUESTER` ตอบกลับ `403 Forbidden`)
- **Path Parameters**:
  - `id` (integer, required): รหัสตั๋วงาน
- **Request Body**:
  ```json
  {
    "actionDateTime": "2026-10-30T10:00:00.000Z",
    "actionDescription": "Diagnosing faulty RAM module in slot 2",
    "assigneeId": 3,
    "status": "PENDING",
    "followUpRequired": true,
    "followUpNote": "Check memory dump logs after 48 hours of user operation",
    "attachmentNotes": "memtest-pass-screen.jpg"
  }
  ```
- **Validation Rules**:
  - `actionDescription`: string, required, ความยาว 3–1000 ตัวอักษร
  - `result`: string, optional, nullable — **บังคับให้ไม่เป็นค่าว่างเฉพาะเมื่อ `status == 'COMPLETED'`** (BR-16) สถานะ `PENDING` / `IN_PROGRESS` / `CANCELLED` สามารถละเว้นหรือส่ง `null` ได้
  - `assigneeId`: integer, required, ต้องอ้างอิงผู้ใช้บทบาท `IT_STAFF` หรือ `ADMINISTRATOR` ที่ `isActive = true` เท่านั้น (ห้าม `REQUESTER` / inactive)
  - `status`: enum `PENDING | IN_PROGRESS | COMPLETED | CANCELLED`, optional, default `PENDING`
  - `followUpRequired`: boolean, optional, default `false`
  - `followUpNote`: string, บังคับระบุและห้ามว่าง เมื่อ `followUpRequired == true`
  - `attachmentNotes`: string, optional
  - `actionDateTime`: ISO date string, optional (หากไม่ส่งจะใช้เวลาปัจจุบันของเซิร์ฟเวอร์)
  - `performedById`: **เพิกเฉยค่าที่ส่งมาจาก client** เซิร์ฟเวอร์จะผูกกับ `currentUser.id` เสมอ
- **Success Response (`201 Created`)**:
  ```json
  {
    "id": "d2e8b1c3-5e9f-4a2b-8c3d-9f4a5b6c7d8e",
    "ticketId": 12,
    "actionDateTime": "2026-10-30T10:00:00.000Z",
    "actionDescription": "Diagnosing faulty RAM module in slot 2",
    "result": null,
    "performedById": 2,
    "performedBy": {
      "id": 2,
      "name": "Michael Chen",
      "email": "michael.chen@toktickit.com",
      "role": "IT_STAFF"
    },
    "assigneeId": 3,
    "assignee": {
      "id": 3,
      "name": "Sarah Johnson",
      "email": "sarah.johnson@toktickit.com",
      "role": "IT_STAFF",
      "isActive": true
    },
    "status": "PENDING",
    "followUpRequired": true,
    "followUpNote": "Check memory dump logs after 48 hours of user operation",
    "attachmentNotes": "memtest-pass-screen.jpg",
    "createdAt": "2026-10-30T10:05:00.000Z",
    "updatedAt": "2026-10-30T10:05:00.000Z"
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: ข้อมูลไม่ครบถ้วน หรือ `followUpRequired = true` แต่ไม่ได้ระบุ `followUpNote`
  - `401 Unauthorized`: ไม่ได้เข้าสู่ระบบ
  - `403 Forbidden`: ผู้ใช้เป็นบทบาท Requester
  - `404 Not Found`: ไม่พบตั๋วงานที่ระบุ
  - `422 Unprocessable Entity`: `assigneeId` อ้างอิงผู้ใช้ที่ `isActive = false` หรือมีบทบาท `REQUESTER` ไม่สามารถเป็นผู้รับผิดชอบ Action Taken ได้

---

### 2.3 PATCH /api/tickets/:id/actions-taken/:actionId
- **คำอธิบาย**: แก้ไขรายการ Action Taken ที่มีอยู่เดิม
- **Authorization**: เฉพาะ `IT_STAFF` และ `ADMINISTRATOR` เท่านั้น
- **Path Parameters**:
  - `id` (integer, required): รหัสตั๋วงาน
  - `actionId` (string, required): รหัส Action Taken (UUID)
- **Request Body**:
  ```json
  {
    "actionDescription": "Updated description with serial number of replaced component",
    "result": "System working as expected",
    "assigneeId": 4,
    "status": "COMPLETED",
    "followUpRequired": false,
    "followUpNote": null,
    "attachmentNotes": "updated-notes.png"
  }
  ```
- **Validation Rules**:
  - หาก `followUpRequired` ถูกปรับเป็น `true` จะต้องมี `followUpNote` ที่ไม่ว่าง
  - `result`: string, optional, nullable — หากสถานะหลังแก้ไขเป็น `COMPLETED` ต้องมี `result` ที่ไม่ว่าง (BR-16)
  - `assigneeId`: integer, optional, หากส่งมาต้องเป็นผู้ใช้บทบาท `IT_STAFF` หรือ `ADMINISTRATOR` ที่ `isActive = true`
  - `status`: enum `PENDING | IN_PROGRESS | COMPLETED | CANCELLED`, optional, หากส่งมาต้องเปลี่ยนได้ตาม Action Taken Status Matrix (BR-14) มิฉะนั้นตอบกลับ `400 Bad Request`
  - `performedById` ยังคงถูกเพิกเฉยจาก client และไม่สามารถแก้ไขได้
- **Success Response (`200 OK`)**: ส่งคืนอ็อบเจกต์ ActionTaken ที่อัปเดตแล้ว (รวม `assignee` และ `status`)
- **Error Responses**:
  - `400 Bad Request`: ข้อมูลไม่ถูกต้องตามเกณฑ์ หรือการเปลี่ยนสถานะ Action Taken ผิดกฎ Action Taken Status Matrix
  - `401 Unauthorized`: ไม่ได้เข้าสู่ระบบ
  - `403 Forbidden`: สิทธิ์ไม่เพียงพอ
  - `404 Not Found`: ไม่พบตั๋วหรือ Action Taken นั้น
  - `422 Unprocessable Entity`: `assigneeId` อ้างอิงผู้ใช้ที่ `isActive = false` หรือมีบทบาท `REQUESTER`

---

## 3. Dashboard Endpoints

### 3.1 GET /api/dashboard/staff
- **คำอธิบาย**: ดึงข้อมูลสถิติเชิงปฏิบัติการและตั๋วงานล่าสุดสำหรับ IT Staff และ Administrator
- **Authorization**: เฉพาะ `IT_STAFF` และ `ADMINISTRATOR` เท่านั้น (`REQUESTER` ตอบกลับ `403 Forbidden`)
- **Query Parameters**:
  - ไม่มี (คำนวณจากฐานข้อมูลแบบเรียลไทม์)
- **Success Response (`200 OK`)**:
  ```json
  {
    "metrics": {
      "new": 14,
      "open": 23,
      "inProgress": 18,
      "waitingForRequester": 7,
      "myAssigned": 16
    },
    "recentTickets": [
      {
        "id": 105,
        "ticketNumber": "TKT-2026-000105",
        "title": "Laptop battery drains quickly",
        "status": "In Progress",
        "itPriority": "High",
        "category": { "id": 1, "name": "Hardware" },
        "requester": { "id": 5, "name": "Jennifer Anderson" },
        "owner": { "id": 2, "name": "Michael Chen" },
        "updatedAt": "2026-10-30T09:14:00.000Z"
      }
    ],
    "quickActions": [
      { "id": "create-ticket", "label": "Create Ticket", "url": "/tickets/new" },
      { "id": "search-tickets", "label": "Search Tickets", "url": "/staff/queue" },
      { "id": "my-queue", "label": "My Queue", "url": "/staff/queue?owner=me" }
    ]
  }
  ```
- **Calculation Rules**:
  - `new`: จำนวนตั๋วทั้งหมดที่มี `status == 'New'`
  - `open`: จำนวนตั๋วทั้งหมดที่มี `status == 'Open'`
  - `inProgress`: จำนวนตั๋วทั้งหมดที่มี `status == 'In Progress'`
  - `waitingForRequester`: จำนวนตั๋วทั้งหมดที่มี `status == 'Waiting for Requester'`
  - `myAssigned`: จำนวนตั๋วที่ยังไม่ปิด (`status` ไม่ใช่ `Resolved`, `Closed`, `Cancelled`) ที่มี `ownerId == currentUser.id`
- **Error Responses**:
  - `401 Unauthorized`: ไม่ได้ล็อกอิน
  - `403 Forbidden`: ผู้ใช้เป็น Requester

---

### 3.2 GET /api/dashboard/requester
- **คำอธิบาย**: ดึงข้อมูลสถิติตั๋วของตนเองสำหรับ Requester ผู้ล็อกอิน
- **Authorization**: สำหรับผู้ใช้ที่ผ่านการยืนยันตัวตน (คำนวณเฉพาะตั๋วที่ `requesterId == currentUser.id`)
- **Success Response (`200 OK`)**:
  ```json
  {
    "metrics": {
      "myOpen": 3,
      "inProgress": 2,
      "resolved": 5,
      "closed": 12
    },
    "recentTickets": [
      {
        "id": 105,
        "ticketNumber": "TKT-2026-000105",
        "title": "Laptop battery drains quickly",
        "status": "In Progress",
        "category": { "id": 1, "name": "Hardware" },
        "updatedAt": "2026-10-30T09:14:00.000Z"
      }
    ],
    "quickActions": [
      { "id": "create-ticket", "label": "Create Ticket", "url": "/tickets/new" },
      { "id": "view-tickets", "label": "View My Tickets", "url": "/tickets" }
    ]
  }
  ```
- **Calculation Rules**:
  - `myOpen`: จำนวนตั๋วของตนเองที่มี `status in ['New', 'Open']`
  - `inProgress`: จำนวนตั๋วของตนเองที่มี `status in ['In Progress', 'Waiting for Requester', 'Pending', 'Reopened']`
  - `resolved`: จำนวนตั๋วของตนเองที่มี `status == 'Resolved'`
  - `closed`: จำนวนตั๋วของตนเองที่มี `status in ['Closed', 'Cancelled']`
- **Error Responses**:
  - `401 Unauthorized`: ไม่ได้ล็อกอิน
  - `403 Forbidden`: ผู้ใช้ไม่ใช่ Requester

---

## 4. Ticket Workflow & Resolution Gate Endpoints

### 4.1 PATCH /api/tickets/:id
- **คำอธิบาย**: ปรับปรุงสถานะ ข้อมูลผู้รับผิดชอบ ลำดับความสำคัญ หรือระบุเจตนาของ Requester
- **Headers**:
  - `If-Unmodified-Since` (optional): วันเวลา `updatedAt` ล่าสุดที่ฝั่ง Client ถืออยู่ เพื่อตรวจสอบ Concurrency
- **Request Body (ตัวอย่างกรณี IT Staff เปลี่ยนสถานะ)**:
  ```json
  {
    "status": "Resolved",
    "expectedUpdatedAt": "2026-10-30T09:14:00.000Z"
  }
  ```
- **Request Body (ตัวอย่างกรณี Requester แจ้งเจตนา)**:
  ```json
  {
    "requesterIndicatedResolved": true
  }
  ```
- **Rules & Transition Enforcement**:
  1. หากผู้ส่งเป็น `REQUESTER`:
     - อนุญาตเฉพาะการส่งฟิลด์ `requesterIndicatedResolved: true` บนตั๋วของตนเองเท่านั้น
     - หาก Requester พยายามส่งฟิลด์ `status` เพื่อเปลี่ยนสถานะตั๋วโดยตรง เซิร์ฟเวอร์จะตอบกลับ `403 Forbidden`
  2. หากผู้ส่งเป็น `IT_STAFF` หรือ `ADMINISTRATOR`:
     - ตรวจสอบสถานะปัจจุบันเทียบกับสถานะใหม่ตาม Transition Matrix หากไม่ถูกต้อง ตอบกลับ `400 Bad Request` พร้อมเหตุผล
     - **Resolution Gate**: หากสถานะใหม่คือ `Resolved` เซิร์ฟเวอร์ต้อง query จำนวน Action Taken ของตั๋วที่มี `status in ('PENDING', 'IN_PROGRESS')` ก่อน หากพบอย่างน้อย 1 รายการ ต้องปฏิเสธด้วย `409 Conflict` พร้อม `code: "UNRESOLVED_ACTIONS_EXIST"` และจำนวนรายการที่ค้าง และต้องไม่แก้ไขสถานะตั๋วใดๆ
  3. **Concurrency / Stale Update Check**:
     - หาก Client แนบ `expectedUpdatedAt` และค่าไม่ตรงกับ `ticket.updatedAt` ในฐานข้อมูล เซิร์ฟเวอร์จะตอบกลับ `409 Conflict` เพื่อป้องกันการเขียนทับโดยไม่รู้ตัว
- **Success Response (`200 OK`)**: ส่งคืนอ็อบเจกต์ Ticket ที่อัปเดตแล้ว
- **Error Responses**:
  - `400 Bad Request`: การเปลี่ยนสถานะผิดกฎ Transition Matrix
  - `401 Unauthorized`: ไม่ได้ล็อกอิน
  - `403 Forbidden`: สิทธิ์ไม่ถูกต้อง
  - `404 Not Found`: ไม่พบตั๋วงาน
  - `409 Conflict`: ข้อมูลตั๋วถูกแก้ไขไปแล้วโดยผู้ใช้อื่น (Stale Update) หรือพยายามเปลี่ยนสถานะเป็น `Resolved` ขณะยังมี Action Taken สถานะ `PENDING` / `IN_PROGRESS` ค้างอยู่ (`UNRESOLVED_ACTIONS_EXIST`)

---

## 5. Summary of HTTP Status Codes
| Code | ความหมาย | กรณีการใช้งานใน Lab 4 |
| :--- | :--- | :--- |
| **200 OK** | สำเร็จ | ดึงข้อมูล Dashboard, ดึง Actions Taken, แก้ไขตั๋ว/Action สำเร็จ |
| **201 Created** | สร้างสำเร็จ | สร้าง Action Taken ใหม่สำเร็จ |
| **400 Bad Request** | ข้อมูลไม่ถูกต้อง | `followUpRequired = true` แต่ไม่ระบุ note, เปลี่ยนสถานะขัด Transition Matrix, เปลี่ยนสถานะ Action Taken ผิด Action Taken Status Matrix |
| **401 Unauthorized** | ไม่ได้ยืนยันตัวตน | ไม่ได้แนบ Token, Token หมดอายุ หรือไม่ถูกต้อง |
| **403 Forbidden** | ปฏิเสธสิทธิ์ | Requester พยายามสร้าง Action Taken, เปลี่ยนสถานะตั๋ว หรือเข้า Staff Dashboard |
| **404 Not Found** | ไม่พบข้อมูล | ไม่พบ Ticket/Action หรือ Requester พยายามเปิดดูข้อมูลของผู้อื่น (Data Isolation) |
| **409 Conflict** | ข้อมูลขัดแย้ง | เกิด Stale Update จากการแก้ไขข้อมูลตั๋วพร้อมกัน หรือพยายาม Resolve ตั๋วที่ยังมี Action Taken ค้าง (`PENDING` / `IN_PROGRESS`) |
| **422 Unprocessable Entity** | ข้อมูลผ่านรูปแบบแต่ผิดกฎธุรกิจ | `assigneeId` เป็นผู้ใช้ `REQUESTER` หรือ `isActive = false` ซึ่งไม่สามารถเป็นผู้รับผิดชอบ Action Taken ได้ |
| **500 Internal Server Error** | ข้อผิดพลาดฝั่งเซิร์ฟเวอร์ | ข้อผิดพลาดที่ไม่คาดคิด ตอบกลับด้วย Safe Error Message เสมอ |

