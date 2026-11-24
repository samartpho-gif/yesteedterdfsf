YES TEETH — คู่มือเริ่มใช้งาน
================================

ในโฟลเดอร์นี้มี
- index.html             หน้าร้าน / Landing Page
- style.css              รูปแบบและการจัดหน้า
- script.js              ตะกร้าสินค้า + ส่งคำสั่งซื้อไป Google Sheets
- thankyou.html          หน้าขอบคุณหลังสั่งซื้อ
- admin.html / admin.js   หน้าจัดการออเดอร์ หยิบสินค้า และพิมพ์ใบจ่าหน้า
- google-apps-script.gs  โค้ดเชื่อม Google Sheets
- assets/                รูปประกอบสินค้า แยกโฟลเดอร์ไว้แล้ว

ขั้นตอนที่ 1: ตั้งค่า Google Sheets
1. สร้าง Google Sheet ชื่อ "yes teeth Orders"
2. เปิด Extensions > Apps Script
3. ลบโค้ดเดิม แล้วคัดลอกเนื้อหาจาก google-apps-script.gs ไปวาง
4. กด Save
5. กด Deploy > New deployment > เลือก Web app
6. Execute as: Me
7. Who has access: Anyone
8. กด Deploy และอนุญาตสิทธิ์ตามขั้นตอน
9. คัดลอก URL ที่ลงท้าย /exec

ขั้นตอนที่ 2: เชื่อมหน้าเว็บ
1. เปิดไฟล์ script.js
2. แทน PASTE_YOUR_GOOGLE_APPS_SCRIPT_EXEC_URL_HERE ด้วย URL /exec ที่ได้
3. Save แล้วอัปโหลดไฟล์ทั้งหมดขึ้น GitHub

ขั้นตอนที่ 3: Deploy ด้วย Vercel
1. เข้า Vercel แล้วเลือก Add New > Project
2. Import Git Repository ที่อัปโหลดไว้
3. Framework Preset เลือก Other
4. Build Command และ Install Command เว้นว่าง
5. Output Directory ใส่ .
6. กด Deploy แล้วเปิด URL ที่ Vercel สร้างให้

ขั้นตอนที่ 4: ใช้งานหลังบ้านและแพ็คสินค้า
1. เปิด /admin.html
2. เข้า Google Sheets > File > Download > CSV
3. เลือกไฟล์ CSV ในหน้า admin
4. ตรวจสอบชื่อ เบอร์โทร ที่อยู่ และรายการสินค้า
5. กดพิมพ์ใบจ่าหน้าพัสดุ หรือพิมพ์รายการหยิบสินค้า

หมายเหตุสำคัญ
- หน้า admin ใช้วิธีนำเข้า CSV ด้วยตนเอง เพื่อไม่เปิดเผยข้อมูลส่วนตัวของลูกค้าผ่าน URL สาธารณะ
- รูปสินค้าและชื่อสูตรเป็นภาพ/ข้อมูลตัวอย่าง ต้องเปลี่ยนเป็นรูปและข้อมูลสินค้าจริงก่อนส่งงานหรือเปิดขาย
- ราคาในหน้าเว็บเป็นราคาตัวอย่าง: Fresh Mint 89 บาท, Gentle Herbal 99 บาท
- Google Apps Script URL ยังต้องใส่เองใน script.js ก่อนระบบบันทึกออเดอร์จะทำงาน
- หลังแก้ไข Apps Script หากมีการเปลี่ยน deployment ให้ตรวจสอบ URL /exec ล่าสุด

การเปลี่ยนสินค้าและราคา
แก้ชื่อ/ราคาใน script.js ที่ตัวแปร products และแก้ชื่อ/รายละเอียดที่ index.html
รูปสินค้าอยู่ใน assets/ สามารถแทนไฟล์ SVG ด้วยภาพสินค้า .png หรือ .jpg ได้ โดยแก้ src ใน index.html
