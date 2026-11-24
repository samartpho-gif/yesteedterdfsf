let imported = [];
function parseCSV(text) {
  const rows=[]; let row=[], cell="", quoted=false;
  for(let i=0;i<text.length;i++){const c=text[i],n=text[i+1];
    if(c==='"'&&quoted&&n==='"'){cell+='"';i++}
    else if(c==='"') quoted=!quoted;
    else if(c===','&&!quoted){row.push(cell);cell=""}
    else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&n==='\n')i++;row.push(cell);if(row.some(v=>v.trim()))rows.push(row);row=[];cell=""}
    else cell+=c;
  } row.push(cell);if(row.some(v=>v.trim()))rows.push(row);
  const headers=rows.shift().map(h=>h.trim().replace(/^\uFEFF/,""));
  return rows.map(r=>Object.fromEntries(headers.map((h,i)=>[h,(r[i]||"").trim()])));
}
const pick=(o,...names)=>{for(const n of names)if(o[n]!==undefined)return o[n];return ""};
document.getElementById("csv-file").addEventListener("change",async e=>{
  const f=e.target.files[0];if(!f)return;
  imported=parseCSV(await f.text());
  render();
});
function render(){
  const orders=document.getElementById("orders"), labels=document.getElementById("labels");
  document.getElementById("summary").textContent=`นำเข้าข้อมูลแล้ว ${imported.length} รายการ`;
  if(!imported.length){orders.innerHTML="";labels.innerHTML="";return}
  const get=o=>({id:pick(o,"Order ID","รหัสคำสั่งซื้อ","orderId"),date:pick(o,"วันที่","วันเวลา","Timestamp"),name:pick(o,"ชื่อลูกค้า","ชื่อ-นามสกุล","customerName"),phone:pick(o,"เบอร์โทร","เบอร์โทรศัพท์","phone"),address:pick(o,"ที่อยู่จัดส่ง","ที่อยู่","address"),items:pick(o,"รายการสินค้า","สินค้า","items"),total:pick(o,"ยอดรวม","จำนวนเงินรวม","total"),note:pick(o,"หมายเหตุ","note"),status:pick(o,"สถานะ","status")});
  orders.innerHTML=`<table class="order-table"><thead><tr><th>รหัส / วันที่</th><th>ผู้รับ / ที่อยู่</th><th>รายการสินค้า</th><th>ยอดรวม</th><th class="no-print">สถานะ</th></tr></thead><tbody>${imported.map((o,i)=>{const x=get(o);return `<tr><td>${x.id}<br><span class="muted">${x.date}</span></td><td><b>${x.name}</b><br>${x.phone}<br>${x.address}</td><td>${x.items}<br><span class="muted">${x.note}</span></td><td>฿${x.total}</td><td class="no-print"><select class="status-select" data-status="${i}"><option ${x.status==="รอแพ็ค"?"selected":""}>รอแพ็ค</option><option ${x.status==="แพ็คแล้ว"?"selected":""}>แพ็คแล้ว</option><option ${x.status==="จัดส่งแล้ว"?"selected":""}>จัดส่งแล้ว</option></select></td></tr>`}).join("")}</tbody></table>`;
  labels.innerHTML=imported.map(o=>{const x=get(o);return `<article class="shipping-label"><h3>YES TEETH · ใบจ่าหน้าพัสดุ</h3><p><b>ผู้รับ:</b> ${x.name}</p><p><b>โทร:</b> ${x.phone}</p><p><b>ที่อยู่:</b> ${x.address}</p><p><b>เลขคำสั่งซื้อ:</b> ${x.id}</p><div class="pick"><b>รายการหยิบสินค้า</b><p>${x.items}</p><label>□ ตรวจสอบสินค้าและจำนวนครบถ้วน</label><label>□ ตรวจสอบที่อยู่และเบอร์โทร</label><label>□ แพ็คสินค้าเรียบร้อย</label></div></article>`}).join("");
}
document.getElementById("print-labels").onclick=()=>window.print();
document.getElementById("print-pick").onclick=()=>window.print();
