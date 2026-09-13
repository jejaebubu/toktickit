# Lab 2 — บันทึกการตรวจโค้ดโดยเพื่อน (Peer Review Record)

**ผู้เขียน (Author):** พัฒนาวดี แสงเงินยอด — 67070505222 — GitHub: @jejaebubu

**ผู้ตรวจ (Reviewers):**
- @Suprawi5227 — ตรวจ PR docs (PR #11)
- @titayaaa — ตรวจ PR implementation ทั้งหมด (PR #21–#32, #34–#37)

## Pull Requests สำหรับ Lab 2 (ทุก PR ตาม git log — Issue 1-11)

| PR # | Branch | ผู้ตรวจ (Reviewer) | ผลการประเมิน (Reviewer verdict) | Merge commit |
|------|--------|--------------------|---------------------------------|--------------|
| [#11](https://github.com/jejaebubu/toktickit/pull/11) | feature/lab02-01-spec-docs | @Suprawi5227 | Approved (ผลสอบทานตกลงกันนอก GitHub — ไม่มี review event ใน GitHub) | `c5b36f4` |
| [#21](https://github.com/jejaebubu/toktickit/pull/21) | feature/lab02-02-db-models | @titayaaa | Approved (พร้อมข้อสังเกต Data Type) | `d7818a3` |
| [#22](https://github.com/jejaebubu/toktickit/pull/22) | feature/lab02-03-seed-data | @titayaaa | Approved (1 รอบ Changes requested → แก้แล้ว) | `879b008` |
| [#23](https://github.com/jejaebubu/toktickit/pull/23) | feature/lab02-04-requester-context | @titayaaa | Approved (1 รอบ Changes requested → แก้แล้ว) | `b8a8b7b` |
| [#24](https://github.com/jejaebubu/toktickit/pull/24) | feature/lab02-05-create-ticket-api | @titayaaa | Approved (1 รอบ Changes requested → แก้แล้ว) | `c8700b5` |
| [#25](https://github.com/jejaebubu/toktickit/pull/25) | feature/lab02-06-create-ticket-ui | @titayaaa | Approved (1 รอบ Changes requested → แก้แล้ว) | `d78eb61` |
| [#28](https://github.com/jejaebubu/toktickit/pull/28) | feature/lab02-07-my-tickets-api | @titayaaa | Approved (1 รอบ Changes requested → แก้แล้ว) | `92fe50f` |
| [#29](https://github.com/jejaebubu/toktickit/pull/29) | feature/lab02-08-my-tickets-ui | @titayaaa | Approved (1 รอบ Changes requested → แก้แล้ว) | `1ce3f1f` |
| [#30](https://github.com/jejaebubu/toktickit/pull/30) | feature/lab02-09-ticket-detail-attachments | @titayaaa | Approved (คอมเมนต์ inline 4 จุด + ตอบกลับ) | `91dc225` |
| [#31](https://github.com/jejaebubu/toktickit/pull/31) | feature/lab02-10-e2e-visual-evidence | @titayaaa | Approved (คอมเมนต์ 2 จุด + inline 1 จุด + ตอบกลับ) | `93be330` |
| [#32](https://github.com/jejaebubu/toktickit/pull/32) | feature/lab02-11-release-preparation | @titayaaa | Approved (คอมเมนต์ 1 จุด — แก้ PATCH→DELETE ใน README) | `0897788` |
| [#34](https://github.com/jejaebubu/toktickit/pull/34) | feature/lab02-11-polish-labsheet-conformance | @titayaaa | Approved (คอมเมนต์ 4 จุด → แก้ครบ + re-review) | `f576456` |
| [#35](https://github.com/jejaebubu/toktickit/pull/35) | feature/lab02-11-acceptance-checklist | @titayaaa | Approved (รวมผลแก้จากคอมเมนต์ของ PR #33) | `8e9e69e` |
| [#33](https://github.com/jejaebubu/toktickit/pull/33) | lab2-staging → main | @titayaaa | Approved (คอมเมนต์ 6 จุด → แก้ครบ + re-review) | `fac2f82` |
| [#36](https://github.com/jejaebubu/toktickit/pull/36) | fix/lab02-missing-api-05f-test | @titayaaa | Approved (1 จุด → แก้ `if (!removed) return` → `expect(removed).toBeTruthy()` + API-05d) | `ebc6460` |
| [#37](https://github.com/jejaebubu/toktickit/pull/37) | release/lab02-post-merge-verification → main | @titayaaa | Approved (คอมเมนต์ 2 จุด → แก้ครบ) | `5e9000a` |

---

## ความคิดเห็นและการโต้ตอบกับผู้ตรวจ (Reviewer Comments & Responses)

> คอมเมนต์ทั้งหมดด้านล่างคือข้อความจริงจากหน้า GitHub (review + inline comment) ของแต่ละ PR ครบถ้วนไม่ตัดทอน

### PR #11 — docs/lab-02 specs (@Suprawi5227, Approved — นอก GitHub)

**คอมเมนต์ผู้ตรวจ:**  
ผู้ตรวจ (@Suprawi5227) ตรวจเอกสารทั้งชุดและขอให้เพิ่มรายละเอียด HTTP Status Code (400, 403, 404, 500) พร้อมตัวอย่าง Error JSON Response สำหรับทุก Endpoint ใน `api-spec.md` — ข้อความส่งผ่านช่องทางสนทนากลุ่ม (ไม่ใช่ comment บน GitHub)

**การตอบกลับของฉัน:**  
เพิ่มตารางสรุป HTTP Status Codes & Error Standards ครอบคลุมทุก Endpoint ใน `docs/lab-02/api-spec.md` แล้ว และแจ้งผู้ตรวจผ่านช่องทางเดียวกัน

> **หมายเหตุ:** PR #11 **ไม่มี review event / comment ถูกบันทึกใน GitHub** (ตรวจแล้ว: reviews และ comments ว่างเปล่า) — ผลสอบทานตกลงกันและยืนยันนอก GitHub ก่อน merge (`c5b36f4`)

### PR #21 — DB Models (@titayaaa, Approved)

**คอมเมนต์ผู้ตรวจ (Approved):**
"โค้ดรวมๆ ดูดีและครอบคลุมตารางที่จำเป็นครับ (Requester, System, Ticket, Attachment) แต่มีข้อสังเกตเรื่อง Data Type นิดหน่อย: สเปคระบุให้ Priority และ Status เป็น Enum แต่ในนี้ใช้ String และชื่อฟิลด์ในตาราง Attachment ต่างจากสเปคนิดหน่อย (เช่น size vs sizeBytes) แต่โดยรวมโอเคครับ สามารถใช้งานต่อได้ Approved ครับ! ✅"

**การตอบกลับของฉัน:**
รับข้อสังเกตไว้เป็น decision ว่า Lab 2 ใช้ String เก็บ Priority/Status แทน Enum (เพื่อความยืดหยุ่นกับข้อมูลจำลอง) และบันทึกไว้ใน `specification.md` §11 (Assumptions) — merge ทันที

**คอมเมนต์ยืนยันซ้ำ (Approved ครั้งที่ 2):** "โค้ดรวมๆ ดูดีและครอบคลุมตารางที่จำเป็น (Requester, System, Ticket, Attachment) แต่มีข้อสังเกตเรื่อง Data Type นิดหน่อยนะะ สเปคระบุให้ Priority และ Status เป็น Enum แต่ในนี้ใช้ String และชื่อฟิลด์ในตาราง Attachment ต่างจากสเปคนิดหน่อย (เช่น size vs sizeBytes) แต่โดยรวมโอแล้ว สามารถใช้งานต่อได้ Approved ค่า"

→ Approved และ merged (`d7818a3`)

### PR #22 — seed data (@titayaaa, Changes requested → Approved)

**คอมเมนต์ผู้ตรวจ (Changes requested):**
"โค้ดและการใช้ upsert ทำได้ถูกต้องและรองรับ Idempotency ดีแล้ว แต่มีจุดที่ต้องแก้นิดึงง ในไฟล์ seed.ts และ seed.test.ts ยังระบุว่าเป็น Issue 3 อยู่ ซึ่งเราเพิ่งทำการเปลี่ยนเลข Issue ใหม่ (ข้อ Seed Data ตอนนี้คือ Issue 6) รบกวนแก้คอมเมนต์และชื่อ Test จาก Issue 3 เป็นเลขที่อัปเดตแล้วให้หน่อยนะะ แก้เสร็จแล้วเดี๋ยวกด Approve ให้ใหม่ค่า"
**คอมเมนต์ผู้ตรวจ — รอบแรก (DISMISSED):** "โค้ดและการใช้ upsert ทำได้ถูกต้องและรองรับ Idempotency ดีมากครับ แต่มีจุดที่ต้องแก้เล็กน้อยครับ: ในไฟล์ seed.ts และ seed.test.ts ยังระบุว่าเป็น 'Issue 3' อยู่ ซึ่งเราเพิ่งทำการเปลี่ยนเลข Issue ใหม่ (ข้อ Seed Data ตอนนี้คือ Issue 6) รบกวนแก้คอมเมนต์และชื่อ Test จาก Issue 3 เป็นเลขที่อัปเดตแล้วให้หน่อยนะครับ แก้เสร็จแล้วเดี๋ยวผมกด Approve ให้ใหม่ครับ!"
> หมายเหตุ: ผู้ตรวจส่ง review ครั้งแรก (สถานะ DISMISSED บน GitHub) เนื้อหาเดียวกัน แล้วกด re-submit เป็น CHANGES_REQUESTED อีกครั้ง

**การตอบกลับของฉัน:**  
แก้ข้อความอ้างอิงหมายเลข Issue และชื่อ Test ใน `server/prisma/seed.ts` + `server/tests/lab-02/seed.test.ts` จาก "Issue 3" → เลขปัจจุบัน แล้ว rerun tests ผ่านครบ

**คอมเมนต์หลังแก้ (Approved):** "ตรวจสอบเรียบร้อย เดี๋ยว approve และ merge ให้น้า"

→ Approved และ merged (`879b008`)

### PR #23 — Development Requester Context (@titayaaa, Changes requested → Approved)

**คอมเมนต์ผู้ตรวจ (สรุปจาก review body):** "โดยรวมทำออกมาได้ดีและเป็นระเบียบมาก โครงสร้าง RequesterContext และการเชื่อมกับ localStorage ทำได้ถูกต้องเลย แต่อยากรบกวนให้แก้จุดเล็กๆ 2 จุดตามคอมเมนต์ด้านล่างนิดนึงน้า ถ้าแก้เสร็จแล้วกริ๊งมาบอกได้เลย เดี๋ยวมากด Approve ให้"

**คอมเมนต์ 1 — inline `requesters.test.ts`:** "ตรงคอมเมนต์ที่อ้างอิง (BR-09) น่าจะอิงจากเอกสารเวอร์ชันเก่าไหม เพราะกฎเรื่อง ห้ามแสดง Inactive user ในสเปคปัจจุบันมันคือ BR-07 นะ รบกวนแก้เลขให้ตรงกับสเปคล่าสุดด้วยน้า"

**การตอบกลับ:** "อัปเดตตัวเลขคอมเมนต์จาก BR-09 เป็น BR-07 เรียบร้อยแล้ว"

**คอมเมนต์ 2 — inline `app.ts`:** "เห็นมีการเพิ่ม API ของ /api/related-systems เข้ามาในไฟล์นี้ด้วย แต่เหมือนจะยังไม่มีไฟล์ Unit Test สำหรับ API ตัวนี้เลย (เห็นมีแต่ไฟล์ requesters.test.ts) รบกวนเพิ่มเทสของ Related Systems ให้หน่อยน้าา"

**การตอบกลับ:** "เพิ่มไฟล์ Unit Test server/tests/lab-02/related-systems.test.ts สำหรับทดสอบ GET /api/related-systems พร้อมรันผ่าน แล้วค่ะ"

**คอมเมนต์หลังแก้ (Approved):** "Good !!"

→ Approved และ merged (`b8a8b7b`)

### PR #24 — Create Ticket API (@titayaaa, Changes requested → Approved)

**คอมเมนต์ผู้ตรวจ (สรุปจาก review body):** "โค้ดรวมๆ ทำระบบ Create Ticket และรันรหัสตั๋ว TKT ออกมาครบถ้วนเลย แต่อยากรบกวนให้แก้จุดเล็กๆ 2 จุดตามคอมเมนต์ด้านล่างให้ตรงกับเอกสาร API Spec ที่เราตกลงกันไว้หน่อยน้า ถ้าแก้เสร็จแล้ว เดี๋ยวมากด Approve ให้"

**คอมเมนต์ 1 — inline `create-ticket.api.test.ts`:** "ในเอกสาร api-spec.md ให้ส่งไอดีผู้ใช้ผ่าน Mock Auth Header แบบนี้: Authorization: Bearer dev_requester_X แต่เห็นในโค้ดใช้การดึงจาก Header ที่ชื่อ X-Requester-Id แทน รบกวนแก้ตรงนี้ให้ตรงกับสเปคด้วยน้าา ฝั่งหน้าบ้านจะได้ต่อ API เข้ามาถูก"

**การตอบกลับ:** "อัปเดต API หลังบ้านให้รองรับ Mock Auth Header รูปแบบ Authorization: Bearer dev_requester_X ตามสเปกเรียบร้อยแล้ว"

**คอมเมนต์ 2 — inline `app.ts`:** "ตรง Error Message รู้สึกว่าข้อความมันจะเหมาปนกันไปนิดนึง สมมติหน้าบ้านลืมส่งแค่ summary มา แต่มันจะตอบกลับไปว่า 'summary' and 'categoryId' are required. ทั้งๆ ที่เราเช็ก IF แยกกัน ตรงนี้รบกวนแยกข้อความ Error ให้เฉพาะเจาะจงไปเลยดีกว่า ว่าฟิลด์ไหนหายไป คนต่อ API จะได้ไม่งงค่ะ"

**การตอบกลับ:** "ปรับแยกข้อความ Error Message ให้ระบุเฉพาะเจาะจงรายฟิลด์ที่ขาด เช่น Validation failed: 'summary' is required. เพื่อให้หน้าบ้านต่อนำไปใช้งานได้ไม่งงตามที่แนะนำแล้ว

เพิ่ม Unit Test และรันผ่าน 100% แล้ว ฝากเช็คอีกรอบและช่วยกด Approve & Merge ได้เลยนะ"

→ Approved และ merged (`c8700b5`)

### PR #25 — Create Ticket UI (@titayaaa, Changes requested → Approved)

**คอมเมนต์ 1 — inline `CreateTicket.test.tsx`:** "ตรงนี้ import ผิดโฟลเดอร์น้าา ในโปรเจกต์โฟลเดอร์ชื่อว่า contexts (มีตัว s ต่อท้าย) ไม่ใช่ context ฝากแก้เป็น ../../src/contexts/RequesterContext ด้วยน้า (และฝากเช็กในไฟล์ CreateTicketForm.tsx ด้วยว่า import ผิดแบบเดียวกันไหม)"

**การตอบกลับ:** "ตรงนี้ตรวจแล้วน้าา โฟลเดอร์จริงในโปรเจกต์คือ client/src/context นะ ดูได้ทั้งบน lab2-staging (จาก PR #23) และ branch นี้ ใช้ context/RequesterContext.tsx เหมือนกันหมด ทั้ง CreateTicketForm.tsx:11, RequesterSelector.tsx:2, Header.tsx:2 และ App.tsx:2 ถ้าเปลี่ยนเป็น contexts จะทำให้ import พัง + บิลด์/เทส fail ทั้งก้อนเลย ขอไม่แก้ตามนี้นะ แต่มันเป็นโฟลเดอร์ข้าม PR แชร์กันทุกหน้า ถ้าอยาก rename จริงๆ ขอทำเป็น PR แยก review อีกทีดีกว่า"

**คอมเมนต์ 2 — inline `CreateTicket.test.tsx`:** "Key ของ localStorage ในเทสนี้ใช้ชื่อผิด ในไฟล์ RequesterContext (PR 23) ใช้ key ชื่อว่า 'toktickit_dev_requester' น้า ถ้าไม่แก้ตรงนี้ เทสจะไม่ยอมบายพาสหน้า Selection นะ"

**การตอบกลับ:** "ลองดูแล้วนะ key จริงใน RequesterContext.tsx:4 คือ LOCAL_STORAGE_KEY = "toktickit_requester" ไม่ใช่ toktickit_dev_requester ค่ะ และเทสก็ใช้ตัวเดียวกัน CreateTicket.test.tsx:12 localStorage.setItem("toktickit_requester", ...) และ RequesterSelector.test.tsx:76 ก็เช็ค key เดียวกัน เลยไม่มีปัญหาบายพาสหน้า Selection นะ

รันเทสบน branch นี้ผ่านหมดทั้ง 7 ตัว แน่นอน ซึ่งถ้า key ผิด เทสแรก UI-02 จะ fail ทันทีเพราะ modal มาบัง form ค่ะ"

**คอมเมนต์ 3 — inline `CreateTicketForm.tsx`:** "ค่า Priority อันสุดท้ายในโค้ดหน้าบ้านเป็นคำว่า 'URGENT' แต่ในฐานข้อมูล (Prisma Schema) ของเรากำหนดเป็น CRITICAL น้าา ถ้าส่ง URGENT ไปหลังบ้านมันเซฟลง DB ไม่ได้แน่ ๆ ฝากแก้ทั้งใน UI Array และเงื่อนไขต่างๆ เป็น CRITICAL ให้ตรงกับ Database ด้วยนะ"

**การตอบกลับ:** "เช็คแล้วทั้งฝั่งหน้าและหลังเลย ไม่มี CRITICAL ในระบบจริงๆ
- schema.prisma:48 กำหนด requestedPriority String — เป็น string ธรรมดา ไม่มี enum CRITICAL
- server validate ด้วย VALID_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] (server/src/app.ts:88)
- ฝั่ง UI อันสุดท้ายจึงเป็น URGENT ที่ตรงกับหลังบ้านพอดี (CreateTicketForm.tsx:32,266) และ api.ts:30 ก็ typed ตรงกัน

ซึ่งเทส create-ticket.api.test.ts ก็รันผ่านยืนยันว่าค่า URGENT เซฟลง DB ได้จริงด้วย"

> ผู้ตรวจยอมรับคำชี้แจงทั้ง 3 จุด (ไม่มีการ comment เพิ่มเติม) และผลสอบทานสุดท้ายเป็น Approved: "เยี่ยมมม !!"

→ Approved และ merged (`d78eb61`)

### PR #28 — My Tickets API (@titayaaa, Changes requested → Approved)

**คอมเมนต์ผู้ตรวจ (Changes requested):** "โดยรวมโอเคหมดแล้วนะ มีนิดนึง 2 จุดที่ควรปรับ

1. **Performance Issue ใน `generateTicketNumber`**: ตอนนี้ใช้ `findMany` ดึงตั๋วของปีนั้นมาทั้งหมดแล้วค่อยมาลูปหาเลขมากสุด ถ้าอนาคตมีตั๋วเยอะมันจะกินแรมและช้ามาก แนะนำให้เปลี่ยนไปใช้ `findFirst` คู่กับ `orderBy: { ticketNumber: 'desc' }` เพื่อดึงแค่ตั๋วใบล่าสุดมาบวกเลข 1 แทน จะเร็วกว่านะ

2. **บั๊ก 500 Internal Server Error ตอนกรอง `status`**: ตรงเช็กค่า `status` ไม่มีการสร้างลิสต์ดัก (เหมือน `VALID_PRIORITIES`) ถ้าสมมติมีคนยิง API มั่วๆ พ่นค่า Status ที่ไม่อยู่ใน Enum มา Prisma จะ Error และแสดงผล 500 ทันที (แทนที่จะเป็น 400 Bad Request) ฝากเพิ่ม `VALID_STATUSES` มาดักค่าก่อนยัดลง `where` หน่อยน้า"

**การตอบกลับ:**  
(1) ปรับ `generateTicketNumber` เป็น `findFirst` + `orderBy: { ticketNumber: 'desc' }` ดึงเฉพาะใบล่าสุดแล้วบวกเลข (server/src/app.ts)  
(2) ชี้แจงว่า `status` ใน schema เป็น `String` (schema.prisma) มิใช่ Prisma Enum จึงไม่มี path ที่ทำให้เกิด Error 500 เมื่อกรองค่าที่ไม่ตรง — ผลลัพธ์จะได้ค่าว่างตามปกติ (และไม่มี 400/500 เกิดขึ้นจริง) แต่ยังขยาย validation test API-07h ให้ครอบคลุมค่า unknown

**คอมเมนต์หลังแก้ (Approved):** "โอเคหมดทุกจุดแล้ว Approve !!"

→ Approved และ merged (`92fe50f`)

### PR #29 — My Tickets UI (@titayaaa, Changes requested → Approved)

**คอมเมนต์ผู้ตรวจ (สรุปจาก review body):** "ที่เหลือโอเคหมดแล้ว UI สวยแล้วว ถ้าแก้แล้วเดี๋ยวรีวิวให้อีกรอบนะะ"

**คอมเมนต์ 1 — inline `api.ts`:** "ตรงนี้ส่ง query param ชื่อ category แต่เช็คกับ backend (หรือสเปก API) ดีๆ นะ เพราะหลังบ้านรับเป็น category หรือ categoryId (เหมือนตอนฟอร์ม create ticket ที่ใช้ categoryId) ถ้าหลังบ้านรอรับ categoryId เดี๋ยวฟิลเตอร์หมวดหมู่จะไม่ทำงาน"

**การตอบกลับ:** "เช็กกับ backend แล้ว ตรงนี้ใช้ category ถูกต้องแล้ว เพราะตอนดู My Tickets ใช้ category ส่วน categoryId ใช้ตอนสร้าง Ticket เท่านั้น และ UI-06 ก็เช็กให้แล้วว่าส่ง category=2 จริง"

**คอมเมนต์ 2 — inline `api.ts`:** "ตรง headers ส่งทั้ง Authorization และ X-Requester-Id ตรวจดูว่า backend บังคับรับแบบไหนเป็นหลัก จะได้ format ตรงกันและไม่ส่งซ้ำซ้อน"

**การตอบกลับ:** "แก้ให้เหลือ X-Requester-Id ตัวเดียวตามที่ backend ใช้แล้วนะ ทั้งตอนโหลด My Tickets และตอน Create Ticket ไม่มีตัวซ้ำแล้ว"

**คอมเมนต์ 3 — inline `MyTicketsList.tsx`:** "ถ้า user อยู่หน้าที่ 2 แล้วมากรอกคำค้นหาใหม่ ควรมั่นใจว่า setPage(1) ถูกเรียกชัวร์ ๆ ด้วย (ไม่งั้นจะเกิดบั๊ก ค้นหาแล้วผลลัพธ์ว่างเปล่าเพราะหน้าค้างอยู่ที่หน้า 2)"

**การตอบกลับ:** "เช็กแล้วว่าพอค้นหาใหม่ ระบบจะกลับไปหน้า 1 อยู่แล้ว และเพิ่ม UI-11 มาช่วยเทสตรงนี้ด้วย โดยลองจากหน้า 2 แล้วค้นหาใหม่ แล้วเช็กว่า URL กลับเป็น page=1 ซึ่งผ่านแล้ว"

**คอมเมนต์ 4 — inline `MyTicketsList.tsx`:** "ตรงปุ่ม Pagination Prev / Next เช็คกรณีที่ totalPages เป็น 0 หรือ 1 ด้วยนะ ว่าปุ่มควร disable ทั้งคู่ ไม่ให้กดวนหน้าได้"

**การตอบกลับ:** "แก้แล้วว่าถ้ามี 0 หรือ 1 หน้า ปุ่ม Prev/Next จะกดไม่ได้ และเพิ่มการกันไม่ให้เลขหน้าหลุดไปเป็น 0 หรือเกินจำนวนหน้าที่มีด้วย ส่วนถ้าไม่มีข้อมูลเลยก็จะไม่แสดง pagination และแสดง Empty state แทน"

**คอมเมนต์ 5 — inline `MyTicketsList.test.tsx`:** "ลองเพิ่มเทสเคสจำลอง API พัง (Error 500) ดูว่าหน้า UI แสดงกล่องแจ้งเตือนสีแดง (my-tickets-error) ตามที่เขียนไว้ใน component ไหม"

**การตอบกลับ:** "เพิ่ม UI-10 มาเทสกรณี API error แล้ว โดยเช็กว่ากล่อง error แสดงขึ้นมา มีรูปแบบ error ถูกต้อง และมีข้อความบอกสาเหตุให้ user เห็น"

**คอมเมนต์หลังแก้ (Approved):** "โค้ดทำงานได้ครบถ้วนมาก"

→ Approved และ merged (`1ce3f1f`)

### PR #30 — Ticket Detail & Attachments (@titayaaa, Comments → Approved)

**คอมเมนต์ 1 — inline `app.ts`:** "ตอนนี้เก็บไฟล์ลงโฟลเดอร์ในเครื่อง อย่าลืมเช็คว่าโฟลเดอร์ uploads/ ถูกใส่ไว้ใน .gitignore แล้วหรือยัง จะได้ไม่มีไฟล์แนบที่เทสหลุด commit เข้า repo"

**การตอบกลับ:** "เพิ่ม server/uploads/ เข้า .gitignore เรียบร้อยแล้วค่ะ จะได้ไม่เผลอเอาไฟล์ที่ใช้เทสมาคอมมิตขึ้น repo"

**คอมเมนต์ 2 — inline `app.ts`:** "ถ้าเกิด error เรื่องประเภทไฟล์ (Invalid file type) หรือไฟล์เกิน 5 ไฟล์ มี fs.unlink ลบไฟล์ทิ้งถูกต้องดีมาก แต่ถ้าเกิด error นอกเหนือจากนั้น (เช่น DB พังใน catch) ไฟล์อาจค้างอยู่ใน disk ได้ ถ้ามีเวลาลองครอบ cleanup ใน try-catch ให้ครบจะปลอดภัยยิ่งขึ้น"

**การตอบกลับ:** "แก้ให้ cleanup ครบแล้วค่ะ ตอนนี้ถ้าเกิด error ระหว่าง validation หรือสร้างข้อมูลลง DB จะลบไฟล์ออกจากเครื่องให้ด้วย ส่วนถ้าทำงานสำเร็จก็จะเก็บไฟล์ไว้ตามปกติค่ะ"

**คอมเมนต์ 3 — inline `AttachmentSection.tsx`:** "มีการเช็ค validation ฝั่งหน้าเว็บครบถ้วนดีมาก ทั้งเช็คห้ามเกิน 5 ไฟล์และขนาดห้ามเกิน 5MB ก่อนส่งขึ้นเซิร์ฟเวอร์ และตรงช่องเลือกไฟล์ก็มีการรีเซ็ตค่า (e.target.value = "") ทุกครั้งหลังอัปโหลดเสร็จ ทำให้เวลาผู้ใช้จะเลือกอัปโหลดไฟล์เดิมซ้ำอีกรอบก็ทำได้ไม่มีบั๊ก ถือว่าเก็บรายละเอียดได้ดีมาก"

**การตอบกลับ:** "ขอบคุณมากค่ะ ตรง e.target.value = "" ตั้งใจใส่ไว้เพื่อให้ผู้ใช้สามารถเลือกไฟล์เดิมซ้ำได้ ถ้าอัปโหลดไฟล์เดิมอีกครั้งก็ยังทำได้ปกติค่ะ"

**คอมเมนต์ 4 — inline `TicketDetail.tsx`:** "ตอนนี้เช็ค isUnauthorized จาก regex /permission|forbidden/i หรือหาเลข 403 จากข้อความ error ถ้าเป็นไปได้ ให้ตัว api.ts ส่ง status code ออกมาตรงๆ จะแม่นยำกว่าการเช็คข้อความ string เผื่อ backend มีการเปลี่ยน wording ในอนาคต (จุดนี้เป็น nitpick เล็กน้อย ไม่ต้อง block merge ก็ได้น้า"

**การตอบกลับ:** "แก้ตามที่แนะนำแล้วค่ะ จากเดิมที่เช็คจากข้อความ error เปลี่ยนเป็นให้ api.ts ส่ง HTTP status กลับมาด้วย แล้วเช็ค err.status === 403 โดยตรง แบบนี้น่าจะแม่นยำกว่า และไม่ต้องกังวลถ้า backend เปลี่ยนข้อความ error ในอนาคตค่ะ

แก้อยู่ใน commit 9d61909 ค่ะ"

→ Approved และ merged (`91dc225`)

### PR #31 — E2E & Visual Evidence (@titayaaa, Comment 2 จุด + inline 1 จุด → Approved)

**คอมเมนต์ผู้ตรวจ 1 (review body):** "โดยรวมทำได้ดีและรอบคอบมาก 
- Flow ของ Playwright E2E (`requester-ticket-flow.spec.ts`) ครอบคลุมครบทุกสเต็ปตามที่โจทย์กำหนด ตั้งแต่เลือก Requester จนถึง Soft-remove Attachment
- ครอบคลุมทั้ง 3 Viewports (Desktop, Tablet, Mobile) และมีฟังก์ชัน `expectNoHorizontalOverflow` ตรวจเช็คเรื่อง responsive ไม่ให้หน้าเว็บเกิดแนวนอนล้นจอ
- จัดเก็บ Screenshots ครบ 12 รูปตามโครงสร้างโฟลเดอร์ และอัปเดตตาราง Visual Checklist (V-01..V-06) ใน `tests.md` ชัดเจนมาก เยี่ยม!"

**คอมเมนต์ผู้ตรวจ 2 (review body):** "โดยรวมโค้ดครบถ้วนดีมาก"

**คอมเมนต์ 3 — inline `requester-ticket-flow.spec.ts`:** "จุดนี้ฝากนิดนึงน้า ตอนนี้ตัวแปร let project ถูกประกาศไว้ข้างนอกแบบ global แล้วค่อยมาเปลี่ยนค่าข้างใน test ตรงนี้ ตอนนี้รัน worker เดียวอาจจะยังไม่มีปัญหา แต่ถ้าในอนาคตมีเทสเพิ่มหรือรันแบบ parallel ค่าอาจจะตีกันได้

แนะนำส่ง testInfo.project.name เข้าไปในฟังก์ชัน shot() ตรง ๆ หรือเขียนฟังก์ชัน shot ไว้ข้างใน test ไปเลยจะปลอดภัยและ clean กว่า"

**การตอบกลับ:**  
แก้ตามคำแนะนำค่ะ — `shot()` เปลี่ยนเป็นรับ `project` เป็นพารามิเตอร์ตรงๆ ส่วน test ประกาศ `const project = testInfo.project.name;` ภายในตัวเอง (ไม่ใช้ global mutable state — ปลอดภัยต่อ future parallel run) commit `19ac71d` + refresh screenshots `77f12fb` และรัน E2E ผ่าน 3/3 viewport

→ Approved และ merged (`93be330`)

### PR #32 — Release Preparation (@titayaaa, Comment 1 จุด → Approved)

**คอมเมนต์ผู้ตรวจ:** "ตรวจเช็คให้เรียบร้อยแล้วนะ ละเอียดและครบถ้วนมากเลย ทั้ง reviewer.md ที่เก็บหลักฐานการรีวิวครบทั้ง 10 PR ตรงตามจริงทั้งหมด และ README.md ที่อัปเดตคำแนะนำการรัน E2E กับโครงสร้าง Lab 2 ไว้อย่างชัดเจน มีจุดเล็กๆ จุดเดียวตรง README.md ในหัวข้อ Backend API คือตอนนี้เขียนเป็น PATCH /api/attachments/:id ฝากแก้เป็น DELETE /api/attachments/:id ให้ตรงกับ method ใน app.ts นิดนึงน้า"

**การตอบกลับ:**  
แก้ README.md หัวข้อ Backend API จาก `PATCH /api/attachments/:id` → `DELETE /api/attachments/:id` ให้ตรงกับ method จริงใน `app.ts` แล้ว (commit `e60811b`)

**คอมเมนต์หลังแก้ (Approved):** "good !!"

→ Approved และ merged (`0897788`)

### PR #34 — Labsheet Conformance Polish (@titayaaa, 4 จุด → Approved)

**คอมเมนต์ผู้ตรวจ (Changes requested — quote เต็ม):** "โดยรวมทำมาได้ดีมากและครอบคลุม requirements มาก แต่มีจุดที่ต้องแก้ไขหรือปรับปรุงนิดนึงค่ะ

1. **[UX Bug] ข้อความ Error ของไฟล์แนบไม่แสดงในหน้า Success Card**:
   - ใน `CreateTicketForm.tsx` มีการดัก `if (failed.length > 0) setApiError(...)` แต่เนื่องจากมีการ `setCreatedTicket(result)` ไปแล้ว คอมโพเนนต์จึง render หน้า Success Card ทันที ซึ่งในหน้านั้นไม่ได้ render `{apiError}`
   - ทำให้ถ้ามีไฟล์แนบที่อัปโหลดไม่ผ่าน ผู้ใช้จะไม่ทราบเลยว่ามีไฟล์ไหนล้มเหลว
   - **เสนอแนะ:** เพิ่ม `{apiError && <div className="alert alert-warning mt-3">{apiError}</div>}` ในบล็อก `if (createdTicket)` ด้วย

2. **ช่องเลือกไฟล์ `<input type="file">` ไม่ได้ถูก clear DOM value**:
   - ใน `CreateTicketForm.tsx` มีแค่ `setFiles([])` แต่ไม่ได้ clear value ของ native input ทำให้ชื่อไฟล์อาจยังค้างในหน้าจอ
   - **เสนอแนะ:** ใช้ `ref` เช่น `fileInputRef.current.value = ""` ตอน reset form หลัง submit

3. **Client-side validation ตรวจสอบจำนวนไฟล์แนบสูงสุด 5 ไฟล์ (BR-07)**:
   - สเปกระบุว่า Active Attachments สูงสุด 5 ไฟล์/ตั๋ว อยากให้เพิ่ม validation ดักใน `handleFileChange` ด้วยว่าถ้าเลือกไฟล์เกิน 5 ไฟล์ ให้เตือนและไม่อนุญาตให้แนบ เพื่อไม่ให้หลุดไปโดน 400 ที่ฝั่ง Backend

4. **การตรวจสอบ `status` ใน `server/src/app.ts` เป็น Case-sensitive**:
   - `VALID_STATUS.includes(status)` เป็น exact match ถ้า client ส่งมาเป็นตัวพิมพ์เล็ก เช่น `?status=new` จะโดน 400 ทันที เสนอให้ normalize หรือเทียบแบบ case-insensitive เพิ่มเติม

ฝากปรับแก้ตรงนี้อีกนิด แล้วจะรีบกด Approve ให้ทันทีเลยย"

**การตอบกลับ:**  
แก้ครบทั้ง 4 จุดใน commit `20b3af7` — (1) เพิ่ม `upload-api-error` (alert-warning) ในบล็อก Success Card และแยกจาก `api-error` (แดง) (2) เพิ่ม `fileInputRef.current.value = ""` หลัง reset ฟอร์ม (3) เพิ่มเทส UI-23 ครอบคลุม BR-07 (4) normalize status เป็น case-insensitive ใน `app.ts` + เทส API-07k

**คอมเมนต์หลังแก้ (Approved):** "เช็คโค้ดที่แก้เพิ่มรอบนี้ครบทั้ง 4 จุดแล้ว 
1. Warning กล่องส้มในหน้า Success Card แสดงผลเตือนไฟล์ที่อัปโหลดไม่ผ่านได้ถูกต้อง และแยกกับ Error สีแดงชัดเจน
2. การ Reset File Input ด้วย `fileInputRef.current.value = ""` เคลียร์ค่าได้หมดจด
3. จัดการ Validation จำกัดไม่เกิน 5 ไฟล์ตาม BR-07 พร้อมมี Test `UI-23` รองรับ
4. Case-insensitive ใน `status` filter ทำได้ยืดหยุ่นและมี Test `API-07k` ครอบคลุม

เยี่ยมมาก Approve ค่า"

→ Approved และ merged (`f576456`)

### PR #35 — Acceptance Checklist E2E (@titayaaa, Approved)

**คอมเมนต์ผู้ตรวจ (Approved):** "ตรวจเช็กโค้ด Diff และผลการทดสอบของ PR #35 ทั้งหมดให้เรียบร้อยแล้วว
- Logic ฝั่ง Backend ป้องกันการลบซ้ำถูกต้องตาม Business Rules
- UX การเคลียร์ File input และระบบ Auto-refresh ทำงานได้ราบรื่น
- ชุดทดสอบ Unit/API (78 tests) และ E2E Smoke test (6 tests) ผ่านครบถ้วนทุกขนาดหน้าจอ
- เอกสารอัปเดตตรงกับโค้ดจริงทั้งหมด

โค้ดสมบูรณ์ครบถ้วนมาก Approve !!"
> หมายเหตุ: PR นี้คือ branch ที่นำผลแก้จากคอมเมนต์ 6 จุดของ PR #33 (ดูหัวข้อถัดไป) มาอัปเดต staging ก่อน release

→ Approved และ merged เข้า staging (`8e9e69e`)

### PR #33 — Lab 2 Release Integration (lab2-staging → main) (@titayaaa, Comment 6 จุด → Approved)

**คอมเมนต์ผู้ตรวจ (Changes requested — quote เต็ม):** "ตรวจโค้ดดูแล้ว มีจุดที่อยากให้ช่วยแก้ตามนี้น้า

1. client/src/App.tsx
พอสร้างตั๋วเสร็จ หน้า MyTicketsList ด้านล่างมันไม่อัปเดตทันที ต้องกดค้นหาใหม่หรือรีเฟรชถึงจะขึ้น ฝากส่ง callback หรือทำ trigger ให้มันรีเฟรชลิสต์อัตโนมัตินิดนึง

2. server/src/app.ts (เส้น DELETE /api/attachments/:id)
ยังไม่มีเช็คว่าไฟล์ถูกลบไปแล้วหรือยัง ถ้าเผลอยิงลบไฟล์เดิมซ้ำ มันจะไปเขียนทับเหตุผลกับเวลาที่ลบเดิม ฝากเพิ่มเช็ค if (attachment.isRemoved) แล้ว return 400 ดักไว้หน่อย

3. client/src/components/AttachmentSection.tsx
- ตรงเช็คประเภทไฟล์ เช็คแค่ file.type อย่างเดียว บน Windows บางเครื่อง file.type มันส่งมาเป็นค่าว่างทำให้แนบไฟล์ไม่ผ่าน ฝากใส่เช็คนามสกุลไฟล์ .match(/\.(jpg|jpeg|png|webp|pdf)$/i) แบบใน CreateTicketForm ให้เหมือนกัน
- ตรงที่ดัก error ไฟล์ไม่ถูกต้อง ก่อน return อย่าลืมเคลียร์ e.target.value = "" ด้วย ไม่งั้นถ้าผู้ใช้เลือกไฟล์เดิมซ้ำ ตัว onChange จะไม่ทำงาน

4. README.md & PR Description
ยอดเทสยังเขียนว่า 37 กับ 23 tests แต่โค้ดล่าสุดเทสเพิ่มเป็น Server 40 / Client 31 (รวม 71 tests) แล้ว ฝากแก้ตัวเลขใน README กับใน Description ของ PR ให้ตรงกับผลรันจริงหน่อย

5. README.md (ขั้นตอนที่ 2)
คำสั่ง npx prisma migrate dev --name init ถ้ารันจาก root มันจะหา schema ไม่เจอ ฝากแก้ให้มี cd server ให้ชัดเจน เช่น:
bash
cd server
npx prisma migrate dev
cd ..
npm run seed

6. docs/lab-02/reviewer.md
ในตารางยังขาด PR #32, #34 และ PR #33 ของ Issue 11 ฝากเพิ่มให้ครบทุก PR จะได้ตรงกับ git log"

**การตอบกลับ:**  
แก้ครบทั้ง 6 จุดใน staging (merge ผ่าน PR #35, commits `f853315`/`b92f090`/`ae5be6d`) — (1) เพิ่ม `onCreated` callback → `refreshKey` prop ให้ `MyTicketsList` refetch อัตโนมัติหลังสร้างตั๋ว (2) เพิ่ม guard 400 เมื่อ `attachment.isRemoved` + เทส API-05f (3) เพิ่ม fallback เช็คนามสกุล + เคลียร์ `e.target.value` ก่อน return และเทส UI-16b/16c (4) อัปเดต README เป็น Server 40 / Client 31 → ตัวเลขอัปเดตล่าสุด (5) แก้ขั้นตอนเป็น `cd server && npx prisma migrate dev` (6) เพิ่มแถว PR #32/#34/#33/#35 ให้ครบในตาราง

**คอมเมนต์หลังแก้ (Approved):** "ตรวจเช็กโค้ดที่แก้ตามคอมเมนต์ทั้ง 6 จุดเรียบร้อยแล้วน้า แก้ไขได้ถูกต้องครบถ้วนและรอบคอบมากเลย

- ระบบ Auto-refresh ของตั๋วทำงานได้ลื่นไหล
- Backend guard ป้องกันการลบไฟล์แนบซ้ำถูกต้องตามสเปก
- ปรับแต่ง UX ของไฟล์แนบและเคลียร์ค่า input เมื่อ error ได้ดีมาก
- ยอดเทสต์และคำสั่ง Setup ใน README อัปเดตตรงตามโค้ดจริง
- บันทึกตารางและประวัติการรีวิวใน reviewer.md ครบทุก PR

ผ่านเกณฑ์การ Release ของ Lab 2 ครบถ้วนทุกข้อแล้วว"

→ Approved และ merged เข้า `main` (`fac2f82`)

### PR #36 — Missing API-05f test (@titayaaa, 1 จุด → Approved)

**คอมเมนต์ผู้ตรวจ (Changes requested):** "ตรวจโค้ดใน PR #36 แล้ว มีจุดสำคัญที่อยากให้ช่วยแก้นิดนึงก่อน Merge น้า

ในไฟล์ server/tests/lab-02/attachments.api.test.ts (เทส API-05f): ตรงบรรทัด if (!removed) return; ถ้าเวลารันเทสแยกเดี่ยวแล้วหาไฟล์ที่ลบไม่เจอ ตัวเทสจะ return จบไปเลย ทำให้ Vitest มองว่าเทส PASS ทั้งที่ยังไม่ได้รัน expect จริง ๆ (เกิด False Positive)

รบกวนเปลี่ยนจาก if (!removed) return; เป็น:

ts
expect(removed).toBeTruthy();

เพื่อบังคับเช็คว่ามีข้อมูลก่อนยิง API จริง ถ้าไม่มีจะได้ Fail ให้เห็นชัดเจน ไม่ปล่อยผ่านเงียบ ๆ จ้า

แก้จุดนี้จุดเดียวแล้ว Push ขึ้นมาใหม่ได้เลยนะ เดี๋ยวเรากด Approve ให้เลย"

**การตอบกลับ:**  
เปลี่ยน `if (!removed) return;` → `expect(removed).toBeTruthy();` ใน API-05f และพบ pattern เดียวกันใน **API-05d** ด้วยจึงแก้ให้พร้อมกัน — `attachments.api.test.ts` 13/13 ผ่าน, server suite **41/41** (commit `da0db1f`)

→ Approved และ merged เข้า staging (`ebc6460`)

### PR #37 — Post-merge Verification + Report Docs Final Sync (@titayaaa, 2 จุด → Approved)

**คอมเมนต์ผู้ตรวจ (COMMENTED):** "ตรวจเช็กโค้ด Diff และเอกสารใน PR #37 อย่างละเอียดให้แล้วน้า:
- ใน attachments.api.test.ts แก้ปัญหา False Positive ด้วย expect(removed).toBeTruthy(); ครบทั้ง API-05d และ API-05f ได้ถูกต้องและรัดกุมมาก เทสต์ Server 41/41 ผ่านครบถ้วนตรงกับเอกสารแล้ว
- มี 2 จุดเล็ก ๆ ใน docs/lab-02/reviewer.md ที่อยากให้แก้ให้เป๊ะก่อน Merge เข้า main น้า: หัวข้อผู้ตรวจ (Reviewers ด้านบน) บรรทัดของ @titayaaa ยังเขียนว่า (PR #21–#32, #34–#35 และ PR release #33) อยู่ ฝากอัปเดตให้ครอบคลุม PR #36 และ #37 ด้วยน้า (แก้เป็น PR #21–#32, #34–#37)
- ในตาราง แถว PR #37: ช่อง Branch เขียนว่า lab2-staging → main ฝากแก้เป็น release/lab02-post-merge-verification → main ให้ตรงกับชื่อ Head branch จริงบน GitHub
ส่วนเนื้อหาอื่น ๆ ใน README.md และ tests.md ยอดเทสต์ 41/41 ตรงกันครบถ้วนดีมากแล้วว"

**การตอบกลับ:**  
แก้ตามทั้ง 2 จุด: ขอบเขตผู้ตรวจเป็น `PR #21–#32, #34–#37` (ครอบคลุม #36/#37) และแถว PR #37 เปลี่ยน Branch เป็น `release/lab02-post-merge-verification → main` — `docs/lab-02/reviewer.md` update แล้ว (commit `0145fbd`)

**คอมเมนต์หลังแก้ (Approved):** "1. **Test Assertions (`attachments.api.test.ts`)**: 
   - ปรับแก้ใน `API-05d` จาก `if (!removed) return;` เป็น `expect(removed).toBeTruthy();` ช่วยตัดปัญหา False Positive ได้ดีมาก
   - เพิ่มเคส `API-05f` ตรวจสอบการ soft-remove ซ้ำแล้วตอบ 400 Bad Request รัดกุมมาก ทำให้ยอด server test ขึ้นเป็น 41/41 สมบูรณ์
2. **Docs & Spec Synchronization**:
   - อัปเดตตัวอย่างเลขตั๋วจาก `TKT-2025-*` เป็น `TKT-2026-*` ให้ตรงกับปีปัจจุบันที่รันจริงในระบบ
   - ติ๊ก Checklist Definition of Done (§10) ครบทั้ง 6 ข้อเรียบร้อย
   - ซิงก์ตัวเลขผลเทสต์ใน README, tests.md และ reviewer.md ตรงกันทั้งหมดแล้ว
3. **.gitignore**: เพิ่ม `coverage/` ป้องกันโฟลเดอร์เทสต์หลุดขึ้น repo เรียบร้อยดี

เยี่ยมมาก เดี๋ยว Approve และ merge ให้เลยย"

→ Approved และ merge เข้า `main` (`5e9000a` — release รอบสุดท้าย)

---

## สรุป (Summary)

- ทุก PR ในตารางผ่านการ peer review โดยเพื่อน (1–2 รอบ ผล final ทุกตัวเป็น **Approved**) ก่อน merge เข้า `lab2-staging` / `main`
- ทุก PR จับคู่ปิด Issue ของตัวเองผ่าน `Closes #N` และย้ายเป็น **Done** บน GitHub Project board หลังจาก verify จริง
- Release ไป `main` ผ่าน PR release (#33) พร้อมงาน Issue 11 และรอบยืนยัน final (**#36 → #37**) เพื่อให้ main ที่ส่งงานมีเทส 41/41 ตรงเอกสารทุกจุด