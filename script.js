// YES TEETH storefront. ใส่ URL ของ Google Apps Script Web App ที่ลงท้ายด้วย /exec ตรงนี้
const GOOGLE_SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_EXEC_URL_HERE";

const products = {
  "YT-FM100": { name: "YES TEETH Fresh Mint 100 g", price: 89 },
  "YT-GH100": { name: "YES TEETH Gentle Herbal 100 g", price: 99 }
};
const cart = {};
const cartBox = document.getElementById("cart-items");
const totalBox = document.getElementById("cart-total");

function renderCart() {
  const ids = Object.keys(cart).filter(id => cart[id] > 0);
  if (!ids.length) cartBox.innerHTML = '<p class="empty-cart">ยังไม่มีสินค้าในตะกร้า<br>เลือกสินค้าด้านบนเพื่อเริ่มสั่งซื้อ</p>';
  else cartBox.innerHTML = ids.map(id => {
    const p = products[id], qty = cart[id];
    return `<div class="cart-line"><div>${p.name}<small>฿${p.price} × ${qty}</small></div><div class="qty-controls"><button type="button" data-minus="${id}" aria-label="ลดจำนวน">−</button><b>${qty}</b><button type="button" data-plus="${id}" aria-label="เพิ่มจำนวน">+</button></div></div>`;
  }).join("");
  const total = ids.reduce((sum,id) => sum + products[id].price * cart[id], 0);
  totalBox.textContent = "฿" + total.toLocaleString("th-TH");
  return { ids, total };
}
document.querySelectorAll(".add-btn").forEach(btn => btn.addEventListener("click", () => {
  const id = btn.dataset.sku; cart[id] = (cart[id] || 0) + 1; renderCart();
  btn.textContent = "เพิ่มแล้ว ✓"; setTimeout(() => btn.textContent = "เพิ่มลงตะกร้า +", 900);
}));
cartBox.addEventListener("click", e => {
  const id = e.target.dataset.plus || e.target.dataset.minus;
  if (!id) return;
  cart[id] = Math.max(0, (cart[id] || 0) + (e.target.dataset.plus ? 1 : -1));
  renderCart();
});

document.getElementById("order-form").addEventListener("submit", async e => {
  e.preventDefault();
  const { ids, total } = renderCart();
  const status = document.getElementById("form-status");
  if (!ids.length) { status.textContent = "กรุณาเลือกสินค้าอย่างน้อย 1 รายการ"; return; }
  if (GOOGLE_SCRIPT_URL.includes("PASTE_YOUR")) {
    status.textContent = "ยังไม่ได้เชื่อม Google Sheets: กรุณาใส่ URL ของ Apps Script ในไฟล์ script.js ก่อนใช้งานจริง"; return;
  }
  const form = new FormData(e.currentTarget);
  const payload = {
    orderId: "YT" + Date.now(),
    customerName: form.get("customerName").trim(),
    phone: form.get("phone").trim(),
    line: form.get("line").trim(),
    address: form.get("address").trim(),
    items: ids.map(id => `${products[id].name} x ${cart[id]}`).join(" | "),
    total, note: form.get("note").trim()
  };
  const button = e.currentTarget.querySelector("button[type=submit]");
  button.disabled = true; button.textContent = "กำลังบันทึกคำสั่งซื้อ...";
  status.textContent = "กำลังส่งข้อมูล กรุณารอสักครู่";
  try {
    // Apps Script รับข้อมูลแบบ text/plain เพื่อลดปัญหา preflight/CORS
    await fetch(GOOGLE_SCRIPT_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
    sessionStorage.setItem("yesTeethOrder", JSON.stringify(payload));
    window.location.href = "thankyou.html";
  } catch (err) {
    status.textContent = "ส่งข้อมูลไม่สำเร็จ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองอีกครั้ง";
    button.disabled = false; button.textContent = "ยืนยันคำสั่งซื้อ →";
  }
});
renderCart();
