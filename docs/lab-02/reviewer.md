# Lab 2 — บันทึกการตรวจโค้ดโดยเพื่อน (Peer Review Record)

**ผู้เขียน (Author):** พัฒนาวดี แสงเงินยอด — 67070505222 — GitHub: @jejaebubu

**ผู้ตรวจ (Reviewers):**
- @Suprawi5227 — ตรวจ PR docs (PR #11)
- @titayaaa — ตรวจ PR implementation ทั้งหมด 9 ตัว (PR #21–#31)

## Pull Requests สำหรับ Lab 2 (เรียงตาม Issues 1–10)

| PR # | Branch | ผู้ตรวจ (Reviewer) | ผลการประเมิน (Reviewer verdict) | Merge commit |
|------|--------|--------------------|---------------------------------|--------------|
| [#11](https://github.com/jejaebubu/toktickit/pull/11) | feature/lab02-01-spec-docs | @Suprawi5227 | Approved (1 รอบ Changes requested → แก้แล้ว); approval ตกลงกันนอก GitHub แล้วรวมกับคำตอบของกลุ่ม | `c5b36f4` |
| [#21](https://github.com/jejaebubu/toktickit/pull/21) | feature/lab02-02-db-models | @titayaaa | Approved | `d7818a3` |
| [#22](https://github.com/jejaebubu/toktickit/pull/22) | feature/lab02-03-seed-data | @titayaaa | Approved (1 รอบ Changes requested → แก้แล้ว) | `879b008` |
| [#23](https://github.com/jejaebubu/toktickit/pull/23) | feature/lab02-04-requester-context | @titayaaa | Approved (1 รอบ Changes requested → แก้แล้ว) | `b8a8b7b` |
| [#24](https://github.com/jejaebubu/toktickit/pull/24) | feature/lab02-05-create-ticket-api | @titayaaa | Approved (1 รอบ Changes requested → แก้แล้ว) | `c8700b5` |
| [#25](https://github.com/jejaebubu/toktickit/pull/25) | feature/lab02-06-create-ticket-ui | @titayaaa | Approved (1 รอบ Changes requested → แก้แล้ว) | `d78eb61` |
| [#28](https://github.com/jejaebubu/toktickit/pull/28) | feature/lab02-07-my-tickets-api | @titayaaa | Approved (1 รอบ Changes requested → แก้แล้ว) | `92fe50f` |
| [#29](https://github.com/jejaebubu/toktickit/pull/29) | feature/lab02-08-my-tickets-ui | @titayaaa | Approved (1 รอบ Changes requested → แก้แล้ว) | `1ce3f1f` |
| [#30](https://github.com/jejaebubu/toktickit/pull/30) | feature/lab02-09-ticket-detail-attachments | @titayaaa | Approved (คอมเมนต์ + ตอบกลับ) | `91dc225` |
| [#31](https://github.com/jejaebubu/toktickit/pull/31) | feature/lab02-10-e2e-visual-evidence | @titayaaa | Approved (คอมเมนต์ + ตอบกลับ) | `93be330` |

---

## ความคิดเห็นและการโต้ตอบกับผู้ตรวจ (Reviewer Comments & Responses)

### PR #11 — docs/lab-02 specs (@Suprawi5227, Changes requested)

**คอมเมนต์ผู้ตรวจ:**  
"เอกสารโดยรวมโอเคเลย แต่ตรงส่วนของ API Spec อยากรบกวนให้เพิ่มรายละเอียดของ HTTP Status Code (เช่น 400, 404) ในกรณีที่เกิด Error ด้วยค่ะ ฝากแก้จุดนี้หน่อยนะ ถ้า push แก้มาแล้วบอกด้วยนะคะ เดี๋ยวมาดูให้อีกรอบ"

**การตอบกลับของฉัน:**  
"ขอบคุณสำหรับคำแนะนำค่ะ! ได้ทำการเพิ่มรายละเอียด HTTP Status Codes (400 Bad Request, 403 Forbidden, 404 Not Found, 500 Internal Server Error) พร้อมตัวอย่าง JSON Error Response สำหรับทุก Endpoint ในเอกสาร `docs/lab-02/api-spec.md` และตารางสรุปมาตรฐาน Status Code เรียบร้อยแล้วค่ะ ฝากตรวจทานอีกครั้งนะคะ"

→ Approved และ merged ครับ

> **หมายเหตุ:** approval ของ PR #11 ไม่ได้กด Approve บน GitHub (ไม่มี review event ถูกบันทึกในฝั่ง Development ของ PR) — การยอมรับผลสอบทานตกลงกันนอก GitHub โดยผู้ตรวจ (@Suprawi5227) ยืนยันผลผ่านช่องทางติดต่อก่อนทำการ merge แล้ว

### PR #22 — seed data (@titayaaa, Changes requested → Approved)

**คอมเมนต์ผู้ตรวจ:**  
"โค้ดและการใช้ upsert ทำได้ถูกต้องและรองรับ Idempotency ดีแล้ว แต่มีจุดที่ต้องแก้นิดนึง ในไฟล์ seed.ts และ seed.test.ts ยังระบุว่าเป็น 'Issue 3' อยู่ ซึ่งเราเพิ่งทำการเปลี่ยนเลข Issue ใหม่ (Issue 3 กลายเป็น Seed Data ไปแล้ว)"

**การตอบกลับของฉัน:**  
แก้ข้อความอ้างอิงหมายเลข Issue ใน `seed.ts` และ `seed.test.ts` ให้ตรงกับหมายเลขปัจจุบัน แล้ว rerun tests ผ่านครบ

**คอมเมนต์หลังแก้ (Approved):** "ตรวจสอบเรียบร้อย เดี๋ยว approve และ merge ให้น้า"

### PR #23 — Development Requester Context (@titayaaa, Changes requested → Approved)

**คอมเมนต์ 1 — `requesters.test.ts:20`:**  
"ตรงคอมเมนต์ที่อ้างอิง (BR-09) น่าจะอิงจากเอกสารเวอร์ชันเก่าไหม เพราะกฎเรื่องห้ามแสดง Inactive user ในสเปคเปลี่ยนหมายเลขแล้ว"

**การตอบกลับ:** "อัปเดตตัวเลขคอมเมนต์จาก BR-09 เป็น BR-07 เรียบร้อยแล้ว"

**คอมเมนต์ 2 — `app.ts:64`:**  
"เห็นมีการเพิ่ม API ของ /api/related-systems เข้ามาในไฟล์นี้ด้วย แต่เหมือนจะยังไม่มีไฟล์ Unit Test สำหรับ API ตัวนี้เลย"

**การตอบกลับ:** "เพิ่มไฟล์ Unit Test `server/tests/lab-02/related-systems.test.ts` สำหรับทดสอบ GET /api/related-systems พร้อมรันผ่านแล้วค่ะ"

**คอมเมนต์หลังแก้ (Approved):** "Good!!"

### PR #24 — Create Ticket API (@titayaaa, Changes requested → Approved)

**คอมเมนต์ 1 — `create-ticket.api.test.ts:46`:**  
"ในเอกสาร api-spec.md ให้ส่งไอดีผู้ใช้ผ่าน Mock Auth Header แบบนี้: `Authorization: Bearer dev_requester_X` …"

**การตอบกลับ:** "อัปเดต API หลังบ้านให้รองรับ Mock Auth Header รูปแบบ Authorization: Bearer dev_requester_X ตามสเปกเรียบร้อยแล้ว"

**คอมเมนต์ 2 — `app.ts:121`:**  
"ตรง Error Message รู้สึกว่าข้อความมันจะเหมาปนกันไปนิดนึง สมมติหน้าบ้านลืมส่งแค่ summary มา แต่มันจะตอบกลับไปว่า 'summary' และ … เหมารวมกันไปหมด"

**การตอบกลับ:** "ปรับแยกข้อความ Error Message ให้ระบุเฉพาะเจาะจงรายฟิลด์ที่ขาด เช่น Validation failed: 'summary' is required. … เพิ่ม Unit Test และรันผ่าน 100% แล้ว ฝากเช็คอีกรอบและช่วยกด Approve & Merge ได้เลยนะ"

→ Approved แล้ว

### PR #25 — Create Ticket UI (@titayaaa, Changes requested → Approved)

**คอมเมนต์ 1 — `CreateTicket.test.tsx:5`:** "ตรงนี้ import ผิดโฟลเดอร์น้าา ในโปรเจกต์โฟลเดอร์ชื่อว่า contexts (มีตัว s ต่อท้าย) ไม่ใช่ context"

**การตอบกลับ:** "ตรงนี้ตรวจแล้วน้าา โฟลเดอร์จริงในโปรเจกต์คือ client/src/context นะ .. ถ้าเปลี่ยนเป็น contexts จะทำให้ import พัง + บิลด์/เทส fail ทั้งก้อนเลย ขอไม่แก้ตามนี้นะ แต่มันคือโฟลเดอร์ข้าม PR แชร์กันทุกหน้า ถ้าอยาก rename จริงๆ ขอทำเป็น PR แยก"

**คอมเมนต์ 2 — `CreateTicket.test.tsx:12`:** "Key ของ localStorage ในเทสนี้ใช้ชื่อผิด ในไฟล์ RequesterContext (PR #23) ใช้ key ชื่อว่า 'toktickit_dev_…'"

**การตอบกลับ:** "ลองดูแล้วนะ key จริงใน RequesterContext.tsx:4 คือ LOCAL_STORAGE_KEY = "toktickit_requester" … รันเทสบน branch นี้ผ่านหมดทั้ง 7 ตัว แน่นอน ซึ่งถ้า key ผิด เทสแรก UI-02 จะ fail ทันทีเพราะ modal มาบัง form ค่ะ"

**คอมเมนต์ 3 — `CreateTicketForm.tsx:309`:** "ค่า Priority อันสุดท้ายในโค้ดหน้าบ้านเป็นคำว่า 'URGENT' แต่ในฐานข้อมูล (Prisma Schema) ของเรากำหนดเป็น …"

**การตอบกลับ:** "เช็คแล้วทั้งฝั่งหน้าและหลังเลย ไม่มี CRITICAL ในระบบจริงๆ — schema.prisma:48 กำหนด requestedPriority เป็น String ไม่มี enum CRITICAL, server ใช้ VALID_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] (server/src/app.ts:88) และ api.ts:30 typed ตรงกัน … เทสสร้างตั๋วก็ยืนยันว่าค่า URGENT เซฟลง DB ได้จริง"

**คอมเมนต์หลังแก้ (Approved):** "เยี่ยมมม!!"

### PR #28 — My Tickets API (@titayaaa, Changes requested → Approved)

**คอมเมนต์ 1 — Performance ใน `generateTicketNumber`:**  
"ตอนนี้ใช้ findMany ดึงตั๋วของปีนั้นมาทั้งหมดแล้วค่อยมาลูปหาเลขมากสุด ถ้าอนาคตมีตั๋วเยอะมันจะกินแรมและช้ามาก แนะนำให้เปลี่ยนไปใช้ findFirst คู่กับ orderBy: { ticketNumber: 'desc' } เพื่อดึงแค่ตั๋วใบล่าสุดมาบวกเลข 1"

**คอมเมนต์ 2 — บั๊ก 500 ตอนกรอง `status`:**  
"ตรงเช็กค่า status ไม่มีการสร้างลิสต์ดัก (เหมือน VALID_PRIORITIES) ถ้าสมมติมีคนยิง API มั่วๆ พ่นค่า Status ที่ไม่อยู่ใน Enum มา Prisma จะ Error และแสดงผล 500 ทันที (แทนที่จะเป็น 400 Bad Request)"

**การตอบกลับ:**  
แก้คอมเมนต์ทั้ง 2 จุด — ปรับ `generateTicketNumber` เป็น `findFirst` + `orderBy: { ticketNumber: 'desc' }` ดึงเฉพาะใบล่าสุด (server/src/app.ts:142) และชี้แจงว่า `status` ใน schema เป็น `String` (schema.prisma:50) ไม่ใช่ Prisma Enum จึงไม่มี path เกิด Error 500 เมื่อส่งค่าที่ไม่ตรง ผู้ใช้จะได้ผลลัพธ์ว่างเปล่าตามปกติ พร้อมขยายชุด validation test API-07h

**คอมเมนต์หลังแก้ (Approved):** "โอเคหมดทุกจุดแล้ว Approve !!"

### PR #29 — My Tickets UI (@titayaaa, Changes requested → Approved)

**คอมเมนต์ 1 — `api.ts:117`:** "ตรงนี้ส่ง query param ชื่อ category แต่เช็คกับ backend (หรือสเปก API) ดีๆ นะ เพราะหลังบ้านรับเป็น category หรือ categoryId (เห…"

**การตอบกลับของฉัน:** "เช็กกับ backend แล้ว ตรงนี้ใช้ category ถูกต้องแล้ว เพราะตอนดู My Tickets ใช้ category ส่วน categoryId ใช้ตอนสร้าง Ticket เท่านั้น"

**คอมเมนต์ 2 — `api.ts:126`:** "ตรง headers ส่งทั้ง Authorization และ X-Requester-Id ตรวจดูว่า backend บังคับรับแบบไหนเป็นหลัก จะได้ format ตรงกันและไม่ส่งซ้ำ"

**การตอบกลับของฉัน:** "แก้ให้เหลือ X-Requester-Id ตัวเดียวตามที่ backend ใช้แล้วนะ ทั้งตอนโหลด My Tickets และตอน Create Ticket ไม่มีตัวซ้ำแล้ว"

**คอมเมนต์ 3 — `MyTicketsList.tsx:141`:** "ถ้า user อยู่หน้าที่ 2 แล้วมากรอกคำค้นหาใหม่ ควรมั่นใจว่า setPage(1) ถูกเรียกชัวร์ๆ ด้วย (ไม่งั้นจะเกิด …"

**การตอบกลับของฉัน:** "เช็กแล้วว่าพอค้นหาใหม่ ระบบจะกลับไปหน้า 1 อยู่แล้ว และเพิ่ม UI-11 มาช่วยเทสตรงนี้ด้วย โดยลองจากหน้า 2 แ…"

**คอมเมนต์ 4 — `MyTicketsList.tsx:420`:** "ตรงปุ่ม Pagination Prev / Next เช็คกรณีที่ totalPages เป็น 0 หรือ 1 ด้วยนะ ว่าปุ่มควร disable ทั้งคู่"

**การตอบกลับของฉัน:** "แก้แล้วว่าถ้ามี 0 หรือ 1 หน้า ปุ่ม Prev/Next จะกดไม่ได้ และเพิ่มการกันไม่ให้เลขหน้าหลุดไปเป็น 0 หรือเกิน total"

**คอมเมนต์ 5 — `MyTicketsList.test.tsx:1`:** "ลองเพิ่มเทสเคสจำลอง API พัง (Error 500) ดูว่าหน้า UI แสดงกล่องแจ้งเตือนสีแดง (my-tickets-error) ตามที่แ…"

**การตอบกลับของฉัน:** "เพิ่ม UI-10 มาเทสกรณี API error แล้ว โดยเช็กว่ากล่อง error แสดงขึ้นมา มีรูปแบบ error ถูกต้อง และมีข้อค…"

**คอมเมนต์หลังแก้ (Approved):** "โค้ดทำงานได้ครบถ้วนมาก"

### PR #30 — Ticket Detail & Attachments (@titayaaa, Comments → Approved)

**คอมเมนต์ 1 — `app.ts:35`:** "ตอนนี้เก็บไฟล์ลงโฟลเดอร์ในเครื่อง อย่าลืมเช็คว่าโฟลเดอร์ uploads/ ถูกใส่ไว้ใน .gitignore แล้วหรือยัง จะได้ไม่มีไฟล์แนบที่เทสหลุดขึ้น repo"

**การตอบกลับ:** "เพิ่ม server/uploads/ เข้า .gitignore เรียบร้อยแล้วค่ะ"

**คอมเมนต์ 2 — `app.ts:195`:** "ถ้าเกิด error เรื่องประเภทไฟล์ (Invalid file type) หรือไฟล์เกิน 5 ไฟล์ มี fs.unlink ลบไฟล์ทิ้งถูกต้องดีมาก แต่ถ้าเกิด error นอกเหนือจากนั้น …"

**การตอบกลับ:** "แก้ให้ cleanup ครบแล้วค่ะ ตอนนี้ถ้าเกิด error ระหว่าง validation หรือสร้างข้อมูลลง DB จะลบไฟล์ออกจากเครื่องให้ด้วย ส่วนถ้าทำงานสำเร็จก็ไม่ลบ"

**คอมเมนต์ 3 — `AttachmentSection.tsx:55`:** "มีการเช็ค validation ฝั่งหน้าเว็บครบถ้วนดีมาก ทั้งเช็คห้ามเกิน 5 ไฟล์และขนาดห้ามเกิน 5MB ก่อนส่งขึ้นเ… (สงสัยเรื่อง e.target.value …)"

**การตอบกลับ:** "ขอบคุณมากค่ะ ตรง e.target.value = "" ตั้งใจใส่ไว้เพื่อให้ผู้ใช้สามารถเลือกไฟล์เดิมซ้ำได้ ถ้าอัปโหลดไฟล์เดียวกันติดต่อกัน"

**คอมเมนต์ 4 — `TicketDetail.tsx:49`:** "ตอนนี้เช็ค isUnauthorized จาก regex /permission|forbidden/i หรือหาเลข 403 จากข้อความ error ถ้าเป็นไปได้ ให้ …"

**การตอบกลับ:** "แก้ตามที่แนะนำแล้วค่ะ จากเดิมที่เช็คจากข้อความ error เปลี่ยนเป็นให้ api.ts ส่ง HTTP status กลับมาด้วย แล้วเช็ค 403 โดยตรง — แก้อยู่ใน commit 9d61909 ค่ะ"

→ Approved และ merged ครับ

### PR #31 — E2E & Visual Evidence (@titayaaa, Comment → Approved)

**คอมเมนต์ — `requester-ticket-flow.spec.ts:8`:**  
"จุดนี้ฝากนิดนึงน้า ตอนนี้ตัวแปร let project ถูกประกาศไว้ข้างนอกแบบ global แล้วค่อยมาเปลี่ยนค่าข้างใน test … แนะนำส่ง testInfo.project.name เข้าไปในฟังก์ชัน shot() ตรงๆ หรือเขียนฟังก์ชัน shot ไว้ข้างใน test ไปเลยจะปลอดภัยและ clean กว่า"

**การตอบกลับ:**  
แก้ตามคำแนะนำแล้วค่ะ — `shot()` เปลี่ยนเป็นรับ `project` เป็นพารามิเตอร์แรก ส่วน test ประกาศ `const project = testInfo.project.name;` ภายในตัวเอง (ไม่ใช้ global mutable state แล้ว — ปลอดภัยต่อ future parallel run) commit `19ac71d` + refresh screenshots `77f12fb` และรัน E2E ผ่าน 3/3 viewport (desktop/tablet/mobile)

→ Approved และ merged ครับ

---

## สรุป (Summary)

- ทั้ง 10 PR ผ่านการ peer review โดยเพื่อน (1–2 รอบ ผล final ทุกตัวเป็น **Approved**) ก่อน merge เข้า `lab2-staging`
- ทุก PR จับคู่ปิด Issue ของตัวเองผ่าน `Closes #N` และย้ายเป็น **Done** บน GitHub Project board หลังจาก verify จริง
- Release ไป `main` ผ่าน PR release พร้อมกับงาน Issue 11