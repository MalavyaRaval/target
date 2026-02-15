// ============================
// Content Script: content.js
// ============================
// 1️⃣ Map page URL → Facebook items + carbon range
const pageCatalogMap = {

  // TABLE PAGE (35–45 kg)
  "https://www.target.com/p/end-table-traditional-and-classic-white-room-essentials-8482/-/A-92033025": {
    carbonRange: { min: 35, max: 45 },
    items: [
      { link: "https://www.facebook.com/marketplace/item/815071344608357/", image: chrome.runtime.getURL("images/table/img_1.jpg") },
      { link: "https://www.facebook.com/marketplace/item/1958426735101910/", image: chrome.runtime.getURL("images/table/img_2.jpg") },
      { link: "https://www.facebook.com/marketplace/item/953563494289335/", image: chrome.runtime.getURL("images/table/img_3.jpg") },
      { link: "https://www.facebook.com/marketplace/item/1440353310810031/", image: chrome.runtime.getURL("images/table/img_4.jpg") },
      { link: "https://www.facebook.com/marketplace/item/1391991065804703/", image: chrome.runtime.getURL("images/table/img_5.jpg") }
    ]
  },

  // BIKE / CYCLE PAGE (96–200 kg)
  "https://www.target.com/p/schwinn-piston-16-34-kids-39-bike-black-blue-red/-/A-82250975": {
    carbonRange: { min: 96, max: 200 },
    items: [
      { link: "https://www.facebook.com/marketplace/item/1347906603329906/", image: chrome.runtime.getURL("images/cycle/img_1.jpg") },
      { link: "https://www.facebook.com/marketplace/item/3724948051147248/", image: chrome.runtime.getURL("images/cycle/img_2.jpg") },
      { link: "https://www.facebook.com/marketplace/item/2640415463002876/", image: chrome.runtime.getURL("images/cycle/img_3.jpg") },
      { link: "https://www.facebook.com/marketplace/item/2694931177543466/", image: chrome.runtime.getURL("images/cycle/img_4.jpg") },
      { link: "https://www.facebook.com/marketplace/item/1400826144861579/", image: chrome.runtime.getURL("images/cycle/img_5.jpg") }
    ]
  },

  // IPHONE PAGE (70–77 kg)
  "https://www.target.com/p/apple-iphone-12-pro-max-pre-owned-unlocked-gsm-cdma/-/A-90489386": {
    carbonRange: { min: 70, max: 77 },
    items: [
      { link: "https://www.facebook.com/marketplace/item/1217334507194526/", image: chrome.runtime.getURL("images/phone/img_1.jpg") },
      { link: "https://www.facebook.com/marketplace/item/25023563173928287/", image: chrome.runtime.getURL("images/phone/img_2.jpg") },
      { link: "https://www.facebook.com/marketplace/item/1598581514788388/", image: chrome.runtime.getURL("images/phone/img_3.jpg") },
      { link: "https://www.facebook.com/marketplace/item/4514846828801878/", image: chrome.runtime.getURL("images/phone/img_4.jpg") },
      { link: "https://www.facebook.com/marketplace/item/2014206349442913/", image: chrome.runtime.getURL("images/phone/img_5.jpg") }
    ]
  },

  // BLENDER PAGE (10–20 kg)
  "https://www.target.com/p/nutribullet-single-serve-blender-600w-8211-8pc-set/-/A-13969043": {
    carbonRange: { min: 10, max: 20 },
    items: [
      { link: "https://www.facebook.com/marketplace/item/1891620064822608/", image: chrome.runtime.getURL("images/blender/img_1.jpg") },
      { link: "https://www.facebook.com/marketplace/item/1891620064822608/", image: chrome.runtime.getURL("images/blender/img_2.jpg") },
      { link: "https://www.facebook.com/marketplace/item/1613128360034118/", image: chrome.runtime.getURL("images/blender/img_3.jpg") },
      { link: "https://www.facebook.com/marketplace/item/1539508733805273/", image: chrome.runtime.getURL("images/blender/img_4.jpg") },
      { link: "https://www.facebook.com/marketplace/item/1395731885675066/", image: chrome.runtime.getURL("images/blender/img_5.jpg") }
    ]
  },

  // PAN PAGE (1.5–5 kg)
  "https://www.target.com/p/sugift-stainless-steel-fry-pan-set/-/A-1004898454": {
    carbonRange: { min: 1.5, max: 5 },
    items: [
      { link: "https://www.facebook.com/marketplace/item/1086524550275742/", image: chrome.runtime.getURL("images/pan/img_1.jpg") },
      { link: "https://www.facebook.com/marketplace/item/1412756707210197/", image: chrome.runtime.getURL("images/pan/img_2.jpg") },
      { link: "https://www.facebook.com/marketplace/item/838915655364250/", image: chrome.runtime.getURL("images/pan/img_3.jpg") },
      { link: "https://www.facebook.com/marketplace/item/1293860106107963/", image: chrome.runtime.getURL("images/pan/img_4.jpg") },
      { link: "https://www.facebook.com/marketplace/item/2087504268740012/", image: chrome.runtime.getURL("images/pan/img_5.jpg") }
    ]
  }

};



// 2️⃣ Clean URL
function getCurrentPageUrl() {
  return window.location.href.split(/[?#]/)[0];
}


// 3️⃣ Generate carbon savings
function generateCarbonSavings(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


// 4️⃣ Fetch Facebook price with timeout logic
function fetchFacebookPrice(url, index, carbonValue) {

  const priceElement = document.getElementById(`price-${index}`);
  const carbonElement = document.getElementById(`carbon-${index}`);

  if (!priceElement || !carbonElement) return;

  let completed = false;

  // 45 second fallback timer
  const timeout = setTimeout(() => {
    if (!completed) {
      completed = true;
      priceElement.innerText = "Unavailable";
      carbonElement.style.display = "block";
    }
  }, 45000);

  chrome.runtime.sendMessage(
    { type: "GET_FB_PRICE", url: url },
    (response) => {

      if (completed) return;

      clearTimeout(timeout);
      completed = true;

      if (response && response.price) {
        priceElement.innerText = response.price;
      } else {
        priceElement.innerText = "Unavailable";
      }

      // Show carbon savings AFTER price loads
      carbonElement.style.display = "block";
    }
  );
}


// 5️⃣ Render catalog
function renderCatalog(pageData) {

  if (document.getElementById("poc-catalog-container")) return;

  const { items, carbonRange } = pageData;

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
      🌱 Sustainable Alternatives Near You
    </h2>

    <div style="
      display:grid;
      grid-template-columns:repeat(5, 1fr);
      gap:18px;
    ">
      ${items.map((item, index) => {

        const carbon = generateCarbonSavings(carbonRange.min, carbonRange.max);

        return `
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
              margin-bottom:6px;
              color:#111;
          ">
            Loading price...
          </div>

          <div id="carbon-${index}" style="
              font-size:13px;
              margin-bottom:12px;
              color:#1B5E20;
              background:#E8F5E9;
              padding:6px 8px;
              border-radius:6px;
              font-weight:500;
              display:none;
          ">
            🌍 Save ${carbon} kg CO₂
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
        `;
      }).join("")}
    </div>
  `;

  document.body.prepend(container);

  // Fetch prices after render
  items.forEach((item, index) => {
    const carbon = generateCarbonSavings(carbonRange.min, carbonRange.max);
    fetchFacebookPrice(item.link, index, carbon);
  });
}


// 6️⃣ Initialize
function initCatalog() {
  const pageUrl = getCurrentPageUrl();
  const pageData = pageCatalogMap[pageUrl];
  if (!pageData) return;

  renderCatalog(pageData);
}

initCatalog();
