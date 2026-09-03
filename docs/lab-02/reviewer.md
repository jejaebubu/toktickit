# Lab 2 — บันทึกการตรวจโค้ดโดยเพื่อน (Peer Review Record)

**ผู้เขียน (Author):** พัฒนาวดี แสงเงินยอด — 67070505222 — GitHub: @jejaebubu  

## Pull Requests สำหรับ Lab 2 (เรียงตาม 9 Issues)

| PR # | Branch | ผู้ตรวจ (Reviewer) | ผลการประเมิน (Reviewer verdict) |
|------|--------|--------------------|---------------------------------|
| [#11](https://github.com/jejaebubu/toktickit/pull/11) | feature/lab02-01-spec-docs | @Suprawi5227 | Changes requested → Pending Review ⏳ |
| #12 | feature/lab02-02-db-models | (รอ Review) | (รอ Review) |
| #13 | feature/lab02-03-seed-data | (รอ Review) | (รอ Review) |
| #14 | feature/lab02-04-requester-context | (รอ Review) | (รอ Review) |
| #15 | feature/lab02-05-create-ticket-api | (รอ Review) | (รอ Review) |
| #16 | feature/lab02-06-create-ticket-ui | (รอ Review) | (รอ Review) |
| #17 | feature/lab02-07-my-tickets-api | (รอ Review) | (รอ Review) |
| #18 | feature/lab02-08-my-tickets-ui | (รอ Review) | (รอ Review) |
| #19 | feature/lab02-09-ticket-detail-and-attachments | (รอ Review) | (รอ Review) |

---

## ความคิดเห็นและการโต้ตอบกับผู้ตรวจ (Reviewer Comments & Responses)

**PR #11 — @Suprawi5227 (Changes requested):**  
"เอกสารโดยรวมโอเคเลย แต่ตรงส่วนของ API Spec อยากรบกวนให้เพิ่มรายละเอียดของ HTTP Status Code (เช่น 400, 404) ในกรณีที่เกิด Error ด้วยค่ะ ฝากแก้จุดนี้หน่อยนะ ถ้า push แก้มาแล้วบอกด้วยนะคะ เดี๋ยวมาดูให้อีกรอบ"

**การตอบกลับของฉัน (How I responded):**  
"ขอบคุณสำหรับคำแนะนำค่ะ! ได้ทำการเพิ่มรายละเอียด HTTP Status Codes (400 Bad Request, 403 Forbidden, 404 Not Found, 500 Internal Server Error) พร้อมตัวอย่าง JSON Error Response สำหรับทุก Endpoint ในเอกสาร `docs/lab-02/api-spec.md` และตารางสรุปมาตรฐาน Status Code เรียบร้อยแล้วค่ะ ฝากตรวจทานอีกครั้งนะคะ"
