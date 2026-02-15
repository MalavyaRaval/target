// ============================
// Content Script: content.js
// ============================

// 1️⃣ Map page URL → Facebook Marketplace items
const pageCatalogMap = {
  // Table page (Target)
  "https://www.target.com/p/end-table-traditional-and-classic-white-room-essentials-8482/-/A-92033025": [
    { link: "https://www.facebook.com/marketplace/item/815071344608357/", image: chrome.runtime.getURL("images/table/img_1.jpg") },
    { link: "https://www.facebook.com/marketplace/item/1958426735101910/", image: chrome.runtime.getURL("images/table/img_2.jpg") },
    { link: "https://www.facebook.com/marketplace/item/953563494289335/", image: chrome.runtime.getURL("images/table/img_3.jpg") },
    { link: "https://www.facebook.com/marketplace/item/1440353310810031/", image: chrome.runtime.getURL("images/table/img_4.jpg") },
    { link: "https://www.facebook.com/marketplace/item/1391991065804703/", image: chrome.runtime.getURL("images/table/img_5.jpg") }
  ],

  // Bike page (Target)
  "https://www.target.com/p/schwinn-piston-16-34-kids-39-bike-black-blue-red/-/A-82250975": [
    { link: "https://www.facebook.com/marketplace/item/1347906603329906/", image: chrome.runtime.getURL("images/cycle/img_1.jpg") },
    { link: "https://www.facebook.com/marketplace/item/3724948051147248/", image: chrome.runtime.getURL("images/cycle/img_2.jpg") },
    { link: "https://www.facebook.com/marketplace/item/2640415463002876/", image: chrome.runtime.getURL("images/cycle/img_3.jpg") },
    { link: "https://www.facebook.com/marketplace/item/2694931177543466/", image: chrome.runtime.getURL("images/cycle/img_4.jpg") },
    { link: "https://www.facebook.com/marketplace/item/1400826144861579/", image: chrome.runtime.getURL("images/cycle/img_5.jpg") }
  ],

  // iPhone page (Target)
  "https://www.target.com/p/apple-iphone-12-pro-max-pre-owned-unlocked-gsm-cdma/-/A-90489386": [
    { link: "https://www.facebook.com/marketplace/item/1217334507194526/", image: chrome.runtime.getURL("images/phone/img_1.jpg") },
    { link: "https://www.facebook.com/marketplace/item/25023563173928287/", image: chrome.runtime.getURL("images/phone/img_2.jpg") },
    { link: "https://www.facebook.com/marketplace/item/1598581514788388/", image: chrome.runtime.getURL("images/phone/img_3.jpg") },
    { link: "https://www.facebook.com/marketplace/item/4514846828801878/", image: chrome.runtime.getURL("images/phone/img_4.jpg") },
    { link: "https://www.facebook.com/marketplace/item/2014206349442913/", image: chrome.runtime.getURL("images/phone/img_5.jpg") }
  ],

  // Blender page (Target)
  "https://www.target.com/p/nutribullet-single-serve-blender-600w-8211-8pc-set/-/A-13969043": [
    { link: "https://www.facebook.com/marketplace/item/1891620064822608/", image: chrome.runtime.getURL("images/blender/img_1.jpg") },
    { link: "https://www.facebook.com/marketplace/item/1891620064822608/", image: chrome.runtime.getURL("images/blender/img_2.jpg") },
    { link: "https://www.facebook.com/marketplace/item/1613128360034118/", image: chrome.runtime.getURL("images/blender/img_3.jpg") },
    { link: "https://www.facebook.com/marketplace/item/1539508733805273/", image: chrome.runtime.getURL("images/blender/img_4.jpg") },
    { link: "https://www.facebook.com/marketplace/item/1395731885675066/", image: chrome.runtime.getURL("images/blender/img_5.jpg") }
  ],

  // Pan page (Target)
  "https://www.target.com/p/sugift-stainless-steel-fry-pan-set/-/A-1004898454": [
    { link: "https://www.facebook.com/marketplace/item/1086524550275742/", image: chrome.runtime.getURL("images/pan/img_1.jpg") },
    { link: "https://www.facebook.com/marketplace/item/1412756707210197/", image: chrome.runtime.getURL("images/pan/img_2.jpg") },
    { link: "https://www.facebook.com/marketplace/item/838915655364250/", image: chrome.runtime.getURL("images/pan/img_3.jpg") },
    { link: "https://www.facebook.com/marketplace/item/1293860106107963/", image: chrome.runtime.getURL("images/pan/img_4.jpg") },
    { link: "https://www.facebook.com/marketplace/item/2087504268740012/", image: chrome.runtime.getURL("images/pan/img_5.jpg") }
  ]
};
// 2️⃣ Clean URL
function getCurrentPageUrl() {
  return window.location.href.split(/[?#]/)[0];
}

// 3️⃣ Ask background to fetch Facebook price
function fetchFacebookPrice(url, index) {
  chrome.runtime.sendMessage(
    { type: "GET_FB_PRICE", url: url },
    (response) => {
      const priceElement = document.getElementById(`price-${index}`);
      if (!priceElement) return;

      if (response && response.price) {
        priceElement.innerText = response.price;
      } else {
        priceElement.innerText = "Unavailable";
      }
    }
  );
}

// 4️⃣ Render catalog
function renderCatalog(items) {

  if (document.getElementById("poc-catalog-container")) return;

  const container = document.createElement("div");
  container.id = "poc-catalog-container";

  container.style.cssText = `
    background: #ffffff;
    border: 1px solid #ddd;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  `;

  container.innerHTML = `
    <h2 style="margin-bottom:20px; font-size:20px; font-weight:600;">
      SF Hacks Suggestions
    </h2>

    <div style="
      display:grid;
      grid-template-columns:repeat(5, 1fr);
      gap:18px;
    ">
      ${items.map((item, index) => `
        <div style="
          border:1px solid #eee;
          padding:12px;
          text-align:center;
          border-radius:10px;
          background:white;
        ">

          <a href="${item.link}" target="_blank" style="text-decoration:none;">
            <div style="
              width:100%;
              aspect-ratio:1/1;
              background:#f6f6f6;
              display:flex;
              align-items:center;
              justify-content:center;
              border-radius:8px;
              margin-bottom:12px;
            ">
              <img src="${item.image}" 
                style="max-width:85%; max-height:85%; object-fit:contain;" />
            </div>
          </a>

          <div id="price-${index}" style="
              font-size:16px;
              font-weight:600;
              margin-bottom:10px;
              color:#111;
          ">
            Loading...
          </div>

          <a href="${item.link}" target="_blank">
            <button style="
              background:#E31837;
              color:white;
              border:none;
              padding:6px 14px;
              border-radius:6px;
              cursor:pointer;
              font-size:13px;
              font-weight:500;
            ">
              View
            </button>
          </a>

        </div>
      `).join("")}
    </div>
  `;

  // Always insert at very top
  document.body.prepend(container);

  // After rendering, fetch prices
  items.forEach((item, index) => {
    fetchFacebookPrice(item.link, index);
  });
}

// 5️⃣ Initialize
function initCatalog() {
  const pageUrl = getCurrentPageUrl();
  const items = pageCatalogMap[pageUrl];
  if (!items) return;

  renderCatalog(items);
}

initCatalog();