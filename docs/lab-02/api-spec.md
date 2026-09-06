# Lab 2 REST API Specification (ข้อกำหนดการเชื่อมต่อ REST API)

## 1. Authentication & Ownership Header Policy
ใน Lab 2 ใช้ระบบสลับผู้ใช้จำลอง (Development Requester Context) โดยหน้าบ้านจะส่ง Header:
`X-Requester-Id: <id>` ในทุก Request เพื่อยืนยันสิทธิ์ตัวตนของผู้ใช้ที่เลือกอยู่

---

## 2. Endpoints & Error Handling Details

### 2.1 GET /api/requesters
- **คำอธิบาย**: ดึงรายชื่อ Active Development Requesters ทั้งหมด
- **Success Response (`200 OK`)**:
  ```json
  [
    { "id": 1, "name": "Jennifer Anderson", "email": "jennifer@example.com", "isActive": true },
    { "id": 2, "name": "Michael Brown", "email": "michael@example.com", "isActive": true }
  ]
  ```
- **Error Responses**:
  - `500 Internal Server Error`: เมื่อเซิร์ฟเวอร์/ฐานข้อมูลมีปัญหา
    ```json
    { "error": "Internal Server Error", "message": "Failed to retrieve requesters list." }
    ```

---

### 2.2 GET /api/related-systems
- **คำอธิบาย**: ดึงรายชื่อระบบที่เกี่ยวข้องทั้งหมด
- **Success Response (`200 OK`)**:
  ```json
  [
    { "id": 1, "name": "Email" },
    { "id": 2, "name": "Campus Wi-Fi" },
    { "id": 3, "name": "VPN" }
  ]
  ```
- **Error Responses**:
  - `500 Internal Server Error`: เมื่อเซิร์ฟเวอร์/ฐานข้อมูลมีปัญหา
    ```json
    { "error": "Internal Server Error", "message": "Failed to retrieve related systems." }
    ```

---

### 2.3 POST /api/tickets
- **คำอธิบาย**: สร้างตั๋วแจ้งเรื่องใหม่
- **Request Body**:
  ```json
  {
    "categoryId": 1,
    "relatedSystemId": 2,
    "summary": "Cannot connect to campus Wi-Fi in Library",
    "description": "Getting authentication error when connecting since this morning.",
    "requestedPriority": "HIGH"
  }
  ```
- **Success Response (`201 Created`)**:
  ```json
  {
    "id": 101,
    "ticketNumber": "TKT-2025-000101",
    "summary": "Cannot connect to campus Wi-Fi in Library",
    "status": "New",
    "createdAt": "2025-09-03T10:00:00Z"
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: เมื่อกรอกข้อมูลไม่ครบถ้วน หรือส่งข้อมูลผิดรูปแบบ
    ```json
    {
      "error": "Bad Request",
      "message": "Validation failed: 'summary' and 'categoryId' are required."
    }
    ```
  - `400 Bad Request` (Invalid Priority):
    ```json
    {
      "error": "Bad Request",
      "message": "Invalid 'requestedPriority'. Must be one of LOW, MEDIUM, HIGH, URGENT."
    }
    ```
  - `500 Internal Server Error`:
    ```json
    { "error": "Internal Server Error", "message": "Failed to create ticket." }
    ```

---

### 2.4 GET /api/tickets
- **คำอธิบาย**: ดึงรายการตั๋วของ Requester ปัจจุบันเท่านั้น (Ownership Filtering บังคับที่ฝั่ง Backend)
- **Headers (บังคับ)**: `X-Requester-Id: <id>` หรือ `Authorization: Bearer dev_requester_<id>`
- **Query Parameters**:
  - `search` (string, optional): ค้นหาแบบ case-insensitive ใน `ticketNumber` หรือ `summary` (contains)
  - `category` (int, optional): กรองตาม `categoryId` (ต้องเป็นจำนวนเต็มบวก)
  - `priority` (string, optional): กรองตาม `requestedPriority` — ต้องเป็น `LOW`, `MEDIUM`, `HIGH`, `URGENT` เท่านั้น
  - `status` (string, optional): กรองตาม `status` — เทียบแบบ case-insensitive (เช่น `new` ตรงกับ `New`) และต้องเป็น `New`, `In Progress`, `Resolved`, `Closed`, `Rejected` เท่านั้น
  - `sort` (string, optional): หนึ่งใน `createdAt` (default), `ticketNumber`, `summary`, `requestedPriority`, `status`
  - `order` (string, optional): `asc` หรือ `desc` (default: `desc`)
  - `page` (int, optional): หมายเลขหน้า เริ่มต้นที่ 1 (default: 1)
  - `limit` (int, optional): จำนวนรายการต่อหน้า อนุญาต `1–50` (default: 10)
- **Success Response (`200 OK`)**:
  ```json
  {
    "tickets": [
      {
        "id": 101,
        "ticketNumber": "TKT-2026-000101",
        "summary": "Cannot connect to campus Wi-Fi",
        "requestedPriority": "HIGH",
        "status": "New",
        "createdAt": "2026-09-03T10:00:00Z",
        "updatedAt": "2026-09-03T10:00:00Z",
        "categoryId": 1,
        "categoryName": "Network",
        "relatedSystemId": 2,
        "relatedSystemName": "Campus Wi-Fi"
      }
    ],
    "meta": { "total": 1, "page": 1, "limit": 10, "totalPages": 1 }
  }
  ```
  - **หมายเหตุ**: เมื่อ `page` เกินจำนวนหน้าที่มี จะคืน `tickets: []` โดย `meta.total` ยังคงเป็นจำนวนจริง
- **Error Responses**:
  - `400 Bad Request`: ไม่มี Header ยืนยันตัวตน / Requester ไม่พบหรือ inactive / พารามิเตอร์ไม่ถูกต้อง
    ```json
    { "error": "Bad Request", "message": "Validation failed: Requester authentication header is required ('Authorization: Bearer dev_requester_X' or 'X-Requester-Id')." }
    ```
    ```json
    { "error": "Bad Request", "message": "Validation failed: 'limit' must be between 1 and 50." }
    ```
    ```json
    { "error": "Bad Request", "message": "Validation failed: 'sort' must be one of createdAt, ticketNumber, summary, requestedPriority, status." }
    ```
  - `500 Internal Server Error`:
    ```json
    { "error": "Internal Server Error", "message": "Failed to retrieve tickets." }
    ```

---

### 2.5 GET /api/tickets/:id
- **คำอธิบาย**: ดึงรายละเอียดตั๋วรายใบ (ตรวจสอบ Ownership Protection)
- **Header จำเป็น**: `X-Requester-Id`
- **Success Response (`200 OK`)**:
  ```json
  {
    "id": 101,
    "ticketNumber": "TKT-2026-000101",
    "summary": "Cannot connect to campus Wi-Fi in Library",
    "description": "Getting authentication error when connecting since this morning.",
    "requestedPriority": "HIGH",
    "itPriority": "MEDIUM",
    "status": "New",
    "createdAt": "2026-09-03T10:00:00.000Z",
    "updatedAt": "2026-09-03T10:00:00.000Z",
    "requester": { "id": 1, "name": "Jennifer Anderson", "email": "jennifer@example.com" },
    "category": { "id": 1, "name": "Network" },
    "relatedSystem": { "id": 2, "name": "Campus Wi-Fi" },
    "attachments": [
      {
        "id": 501,
        "originalName": "wifi_error.png",
        "filename": "uuid.png",
        "mimeType": "image/png",
        "size": 1048576,
        "isRemoved": false,
        "removeReason": null,
        "removedAt": null,
        "createdAt": "2026-09-03T10:05:00.000Z"
      }
    ]
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: ไม่ได้ส่ง `X-Requester-Id`
  - `403 Forbidden`: กรณีพยายามเปิดดูตั๋วของ Requester คนอื่น (Ownership Check Failed)
    ```json
    {
      "error": "Forbidden",
      "message": "Access denied. You do not have permission to view this ticket."
    }
    ```
  - `404 Not Found`: ไม่พบตั๋วตาม ID ที่ระบุ หรือ ID มีรูปแบบไม่ถูกต้อง
    ```json
    { "error": "Not Found", "message": "Ticket with ID 999 not found." }
    ```
  - `500 Internal Server Error`:
    ```json
    { "error": "Internal Server Error", "message": "Failed to retrieve ticket details." }
    ```

---

### 2.6 POST /api/tickets/:id/attachments
- **คำอธิบาย**: อัปโหลดไฟล์แนบประกอบตั๋ว (JPG, PNG, WEBP, PDF ขนาด $\le 5\text{MB}$, สูงสุด 5 ไฟล์ที่ยัง active)
- **Header จำเป็น**: `X-Requester-Id`
- **Content-Type**: `multipart/form-data` (field name: `file`)
- **Success Response (`201 Created`)**:
  ```json
  {
    "id": 501,
    "originalName": "wifi_error.png",
    "filename": "uuid.png",
    "mimeType": "image/png",
    "size": 1048576,
    "isRemoved": false,
    "createdAt": "2026-09-03T10:05:00.000Z"
  }
  ```
- **Error Responses**:
  - `400 Bad Request` (Invalid File Type / File Size Exceeded / Active Limit Exceeded / No file):
    ```json
    {
      "error": "Bad Request",
      "message": "File size exceeds maximum limit of 5MB."
    }
    ```
    ```json
    {
      "error": "Bad Request",
      "message": "Invalid file type. Only JPG, PNG, WEBP, and PDF files are allowed."
    }
    ```
    ```json
    {
      "error": "Bad Request",
      "message": "Maximum active attachments limit (5) reached for this ticket."
    }
    ```
  - `403 Forbidden`: ไม่ใช่เจ้าของตั๋วใบนี้
    ```json
    { "error": "Forbidden", "message": "You do not have permission to add attachments to this ticket." }
    ```
  - `404 Not Found`: ไม่พบตั๋วที่ต้องการอัปโหลดไฟล์แนบ หรือ ID มีรูปแบบไม่ถูกต้อง

---

### 2.7 GET /api/attachments/:id/download
- **คำอธิบาย**: ดาวน์โหลดไฟล์แนบ (วาด Content-Type + `Content-Disposition: attachment` จากขื่อไฟล์ต้นฉบับ)
- **Identification**: `X-Requester-Id` header หรือ `?X-Requester-Id=` query param ก็ได้ (จำเป็นสำหรับลิงก์ `<a download>` ของเบราว์เซอร์ที่ส่ง header ไม่ได้)
- **Success Response (`200 OK`)**: สตรีมไฟล์ไบนารี (กลับไปส่งไฟล์ Content-Type ตาม MIME จริงของไฟล์)
- **Error Responses**:
  - `400 Bad Request`: ไม่ได้ส่ง `X-Requester-Id` หรือไฟล์ถูก Soft-remove แล้ว (`Attachment has been removed and cannot be downloaded.`)
  - `403 Forbidden`: ไม่ใช่เจ้าของไฟล์แนบใบนี้
  - `404 Not Found`: ไม่พบไฟล์แนบตาม ID หรือไฟล์บนดิสก์หายไป

---

### 2.8 DELETE /api/attachments/:id
- **คำอธิบาย**: Soft-remove ไฟล์แนบ พร้อมบันทึกเหตุผลการลบ
- **Header จำเป็น**: `X-Requester-Id`
- **Request Body**:
  ```json
  { "reason": "Uploaded incorrect evidence document" }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "id": 501,
    "originalName": "wifi_error.png",
    "isRemoved": true,
    "removeReason": "Uploaded incorrect evidence document",
    "removedAt": "2026-09-03T10:10:00.000Z"
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: เมื่อไม่ได้ระบุเหตุผลการลบ (`reason`)
    ```json
    { "error": "Bad Request", "message": "'reason' for soft removal is required." }
    ```
  - `403 Forbidden`: ไม่ใช่เจ้าของไฟล์แนบหรือตั๋วใบนี้
    ```json
    { "error": "Forbidden", "message": "You do not have permission to remove this attachment." }
    ```
  - `404 Not Found`: ไม่พบไฟล์แนบตาม ID หรือ ID มีรูปแบบไม่ถูกต้อง

---

## 3. สรุปตาราง HTTP Status Codes & Error Standards

| Status Code | Status Name | คำอธิบายและสภาวะที่เกิด (When to Return) | Format โครงสร้าง Response |
|---|---|---|---|
| **200** | OK | ดำเนินการค้นหา/ดึงข้อมูล/อัปเดต/Soft remove สำเร็จ | JSON Data Object หรือ Array |
| **201** | Created | สร้างตั๋วใหม่ หรือ อัปโหลดไฟล์แนบสำเร็จ | JSON Created Resource Object |
| **400** | Bad Request | ฟิลด์ไม่ครบ, ข้อมูลผิดประเภท, แนบไฟล์เกิน 5MB, แนบไฟล์เกิน 5 ชิ้น, ลบไฟล์ไม่ใส่เหตุผล | `{ "error": "Bad Request", "message": "..." }` |
| **403** | Forbidden | เข้าถึงตั๋วหรือไฟล์แนบของ Requester คนอื่น (Ownership Protection ล้มเหลว) | `{ "error": "Forbidden", "message": "..." }` |
| **404** | Not Found | ไม่พบตั๋ว หรือ ไม่พบไฟล์แนบตาม ID ที่ระบุ | `{ "error": "Not Found", "message": "..." }` |
| **500** | Internal Server Error | เกิดข้อผิดพลาดฝั่งหลังบ้าน หรือ ไม่สามารถเชื่อมต่อ PostgreSQL ได้ | `{ "error": "Internal Server Error", "message": "..." }` |
