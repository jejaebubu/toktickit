# Lab 2 REST API Specification (ข้อกำหนดการเชื่อมต่อ REST API)

## 1. Authentication & Ownership Header Policy
ใน Lab 2 ใช้ระบบสลับผู้ใช้จำลอง (Development Requester Context) โดยหน้าบ้านจะส่ง Header:
`X-Requester-Id: <id>` ในทุก Request เพื่อยืนยันสิทธิ์ตัวตนของผู้ใช้ที่เลือกอยู่

---

## 2. Endpoints Summary

### 2.1 GET /api/requesters
- **คำอธิบาย**: ดึงรายชื่อ Active Development Requesters ทั้งหมด
- **Response**: `200 OK`
  ```json
  [
    { "id": 1, "name": "Jennifer Anderson", "email": "jennifer@example.com", "isActive": true },
    { "id": 2, "name": "Michael Brown", "email": "michael@example.com", "isActive": true }
  ]
  ```

### 2.2 GET /api/related-systems
- **คำอธิบาย**: ดึงรายชื่อระบบที่เกี่ยวข้องทั้งหมด
- **Response**: `200 OK`
  ```json
  [
    { "id": 1, "name": "Email" },
    { "id": 2, "name": "Campus Wi-Fi" },
    { "id": 3, "name": "VPN" }
  ]
  ```

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
- **Response**: `201 Created`
  ```json
  {
    "id": 101,
    "ticketNumber": "TKT-2025-000101",
    "status": "New",
    "createdAt": "2025-09-03T10:00:00Z"
  }
  ```

### 2.4 GET /api/tickets
- **คำอธิบาย**: ดึงรายการตั๋วของ Requester ปัจจุบัน (ตาม `X-Requester-Id`)
- **Query Parameters**:
  - `search` (string): ค้นหาในเลขตั๋วหรือ Summary
  - `category` (int): กรองตาม Category ID
  - `priority` (string): กรองตาม Priority (`LOW`, `MEDIUM`, `HIGH`, `URGENT`)
  - `status` (string): กรองตาม Status
  - `sort` (string): จัดเรียงตาม field (default: `createdAt`)
  - `order` (string): `asc` หรือ `desc` (default: `desc`)
  - `page` (int): หน้าปัจจุบัน (default: 1)
  - `limit` (int): จำนวนรายการต่อหน้า (default: 10)
- **Response**: `200 OK`
  ```json
  {
    "data": [
      {
        "id": 101,
        "ticketNumber": "TKT-2025-000101",
        "summary": "Cannot connect to campus Wi-Fi",
        "category": { "name": "Network" },
        "requestedPriority": "HIGH",
        "status": "New",
        "createdAt": "2025-09-03T10:00:00Z"
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 1, "totalPages": 1 }
  }
  ```

### 2.5 GET /api/tickets/:id
- **คำอธิบาย**: ดึงรายละเอียดตั๋วรายใบ (ตรวจสอบ Ownership Protection)
- **Response**:
  - `200 OK`: กรณีเป็นเจ้าของตั๋ว
  - `403 Forbidden` / `404 Not Found`: กรณีตั๋วเป็นของ Requester คนอื่น

### 2.6 POST /api/tickets/:id/attachments
- **คำอธิบาย**: อัปโหลดไฟล์แนบ
- **Content-Type**: `multipart/form-data`
- **Response**: `201 Created`

### 2.7 DELETE /api/attachments/:id
- **คำอธิบาย**: Soft-remove ไฟล์แนบ
- **Request Body**: `{ "reason": "Uploaded wrong document" }`
- **Response**: `200 OK`

---

## 3. HTTP Status Codes & Error Formats
- `200 OK`: ดำเนินการสำเร็จ
- `201 Created`: สร้างข้อมูลสำเร็จ
- `400 Bad Request`: Validation ล้มเหลว (ส่งฟิลด์ไม่ครบ/ผิดประเภท)
- `403 Forbidden`: ไม่มีสิทธิ์เข้าถึงตั๋วใบนี้
- `404 Not Found`: ไม่พบข้อมูล
- `500 Internal Server Error`: ข้อผิดพลาดฝั่งเซิร์ฟเวอร์
