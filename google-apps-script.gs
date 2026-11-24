/**
 * YES TEETH - Google Apps Script
 * 1) สร้าง Google Sheet ชื่อ "yes teeth Orders"
 * 2) วางโค้ดนี้ใน Extensions > Apps Script
 * 3) Deploy > New deployment > Web app
 *    Execute as: Me | Who has access: Anyone
 * 4) คัดลอก URL /exec ไปใส่ใน script.js
 *
 * หัวตาราง: Order ID | วันที่ | ชื่อลูกค้า | เบอร์โทร | Line ID |
 * ที่อยู่จัดส่ง | รายการสินค้า | ยอดรวม | หมายเหตุ | สถานะ
 */
const SHEET_NAME = "Orders";
const HEADERS = ["Order ID","วันที่","ชื่อลูกค้า","เบอร์โทร","Line ID","ที่อยู่จัดส่ง","รายการสินค้า","ยอดรวม","หมายเหตุ","สถานะ"];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || "{}");
    if (!data.customerName || !data.phone || !data.address || !data.items) {
      throw new Error("ข้อมูลคำสั่งซื้อไม่ครบ");
    }
    const sheet = getSheet_();
    sheet.appendRow([
      data.orderId || ("YT" + Date.now()),
      new Date(),
      data.customerName,
      data.phone,
      data.line || "",
      data.address,
      data.items,
      Number(data.total || 0),
      data.note || "",
      "รอแพ็ค"
    ]);
    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err)})).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput("YES TEETH order endpoint is ready.");
}
