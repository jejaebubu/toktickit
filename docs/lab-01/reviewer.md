# Lab 1 — บันทึกการตรวจโค้ดโดยเพื่อน (Peer Review Record)

**ผู้เขียน (Author):** พัฒนาวดี แสงเงินยอด — 67070505222 — GitHub: @jejaebubu  
**ผู้ตรวจ (Peer reviewers):**
- ณัฏฐกมล มอญปาน — 67070505215 — GitHub: @natthakamol1130
- ธนากร พหุลรัตน์ — 67070505217 — GitHub: @il0lk3
- อชิรญา อินตา — 67070505229 — GitHub: @Achikan
- ปทิตญา แก้ววิเชียร — 67070505220 — GitHub: @lmaybelgracel
- ภัทร์ธิดาวดี อุ่นคำ — 67070505225 — GitHub: @phatthidawadi
- ชัญญา พูลเขตกิจ — 67070501058 — GitHub: @chanya06

## Pull Requests ที่ฉันเขียน (ได้รับการตรวจโดยเพื่อนคู่ตรวจ)

| PR # | Branch | ผู้ตรวจ (Reviewer) | ผลการประเมิน (Reviewer verdict) |
|------|--------|--------------------|---------------------------------|
| #5   | feature/1-project-foundation | @natthakamol1130 | Approved ✅ |
| #6   | feature/2-health-check | @natthakamol1130 | Approved ✅ |
| #7   | feature/3-category-seed | @il0lk3, @Achikan | Changes requested → Approved ✅ |
| #8   | feature/4-category-list | @phatthidawadi, @lmaybelgracel, @chanya06, @il0lk3 | Commented → Approved ✅ |

ทุก Pull Request ถูก merge เข้า `lab1-staging` แล้วจึง merge เข้า `main` เรียบร้อย

## ความคิดเห็นจากผู้ตรวจที่ได้รับ (Reviewer comments I received)

**PR #5 — @natthakamol1130:**  
"ตรวจสอบโครงสร้างโปรเจกต์ client, server, docs และ README ถูกต้องครบตามเกณฑ์ Issue 1 ผ่าน ข้อแนะนำเล็กน้อย : อย่าลืมเช็ค .env ฝั่ง server ว่าต่อ PostgreSQL ได้เรียบร้อยเพื่อเตรียมพร้อมสำหรับ Issue 3 Approved ค่า เริ่ด"

**PR #6 — @natthakamol1130:**  
"ตรวจสอบโค้ดแล้ว Endpoint GET /api/health ส่งคืนค่า 200 OK และ JSON ถูกต้องตรงตามสเปก โค้ดสะอาด เรียบร้อยดีครับ ผ่านเกณฑ์ Issue 2 พร้อม Merge ได้เลย Approved จ้า"

**PR #7 — @il0lk3 (Changes requested):**  
"การสร้างโมเดล Category และการเขียน Seed ด้วย upsert ทำได้ถูกต้องสมบูรณ์แบบเลยครับ แต่ว่ายังขาดโฟลเดอร์ server/prisma/migrations/ ไปครับ น่าจะลืม git add โฟลเดอร์นี้ รบกวน push โฟลเดอร์ migrations เพิ่มเข้ามาหน่อยนะครับ"

**PR #7 — @Achikan (Changes requested):**  
"รัน npx prisma migrate dev --name init ในเครื่อง และ commit ตัว migration file ขึ้นมาด้วย จะได้ให้เพื่อนรัน migration บนฐานข้อมูลของตัวเองได้"

**PR #8 — @phatthidawadi:**  
"โดยรวมทำได้ดี endpoint ตรงตาม Issue 4 และมีการ handle error พร้อมเพิ่ม test เรียบร้อยแล้ว อยากเสนอเพิ่มเติมว่าใน test อาจเพิ่มกรณีที่มี category หลายรายการและข้อมูลไม่ได้เรียงตาม id เพื่อ verify เรื่อง sorting ให้ชัดเจนขึ้น"

**PR #8 — @lmaybelgracel:**  
"เจเจ้ทำส่วน GET /api/categories ได้ตรงตาม Issue และค่อนข้างครบเลย ทุกการดึงข้อมูลจาก PostgreSQL, เรียง category ตาม id และเลือกเฉพาะ id กับ name ทำให้ response มีรูปแบบชัดเจนดี 👍 ... ถ้าจะปรับปรุงเพิ่มเติม แนะนำให้เพิ่ม test สำหรับกรณีที่ database หรือ query เกิด error และกรณีที่ไม่มี category ใน database ด้วย"

**PR #8 — @chanya06:**  
"พบจุดที่ควรแก้ใน server/tests/lab-01/categories.test.ts ตอนนี้ยังมี describe.todo() และ it.todo() ของโค้ดเดิมค้างอยู่ และยังมี expect(true).toBe(true) ที่ไม่จำเป็น แนะนำให้ลบส่วน TODO เดิมออก แล้วเหลือ test สำหรับ GET /api/categories เพียงชุดเดียว"

**PR #8 — @il0lk3:**  
"ในส่วนของโลจิกฝั่ง Backend ดึง Prisma พร้อมเรียงข้อมูลทำได้ดีมากครับ Frontend ก็จัดการ State ได้ครบถ้วนเลย 👍 แต่ขอรบกวนแก้เรื่อง UI ข้อความนิดนึงครับ ถ้าให้แสดงคำว่า 'System Status: Online' และมีหัวข้อ 'Supported Request Categories:' ก่อนถึงรายการหมวดหมู่จะดีกว่าไหมครับ"

## การตอบกลับของฉัน (How I responded)

**ตอบ PR #7 (เรื่อง migration):**  
"แก้ไขแล้ว ได้รัน npx prisma migrate dev --name init ต่อ PostgreSQL จริง แล้ว commit โฟลเดอร์ server/prisma/migrations/ (20260812140427_init) ขึ้นมาแล้ว ขอบคุณที่ช่วยเช็คน้าา"

**ตอบ PR #8 / @phatthidawadi (เรื่อง sorting test):**  
"ขอบคุณน้า เพิ่ม test ตามที่เสนอเรียบร้อย — upsert หมวดหมู่เพิ่ม (Printing, Email Support — ชื่อไม่เรียงตามตัวอักษร) แล้ว assert ทุก id ใน response เรียงจากน้อยไปมาก โดยไม่เรียงตามชื่อ และ afterAll ลบข้อมูลทดสอบออก (รันซ้ำได้ ไม่มี side effect)"

**ตอบ PR #8 / @lmaybelgracel (เรื่อง edge case tests):**  
"ขอบคุณน้า เพิ่ม edge case tests ตามที่แนะนำครบทั้ง success และ failure แล้วจ้า — returns an empty array when no categories exist (delete ทั้งหมด → assert 200 + [] → restore seed กลับใน finally) และ categories-error.test.ts ใหม่ mock prisma ให้ findMany reject → assert 500 + { error: "Internal server error" } และยืนยันว่าไม่รั่ว detail ภายใน"

**ตอบ PR #8 / @chanya06 (เรื่อง TODO ค้าง):**  
"ขอบคุณน้า จุดที่แจ้งถูกแล้ว แต่แก้ไปแล้วตั้งแต่ commit แรกของ PR นี้แล้วนะ (cbd20c2) ตอนนี้ไฟล์ categories.test.ts เขียนใหม่หมด ไม่มี describe.todo / it.todo / expect(true).toBe(true) เหลือแล้ว ตรวจด้วย rg ก็ไม่พบ"

**ตอบ PR #8 / @il0lk3 (เรื่อง UI ข้อความ):**  
"ขอบคุณข้อเสนอน้า ปรับ UI ตามที่แนะนำแล้ว (commit 2631f67) — success state แสดง System Status: Online แทนเดิม และเพิ่มหัวข้อ Supported Request Categories: ก่อนรายการหมวดหมู่ พร้อมอัปเดต test ใน App.test.tsx ให้ตรวจข้อความใหม่ด้วย"

---

## Pull Requests ที่ฉันตรวจให้เพื่อนคู่ตรวจ (Reviewed for partner)

**ความคิดเห็นของฉัน (My comment):**  
"ตรวจทานโค้ดแล้ว การเขียน API endpoint และชุดทดสอบถูกต้อง ครบถ้วน อนุมัติครับ"

**การตอบกลับของเพื่อนคู่ตรวจ (Partner's response):**  
"ขอบคุณสำหรับคำแนะนำครับ ทำการ Merge เรียบร้อยแล้วครับ"