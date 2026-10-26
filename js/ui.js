/* ==========================================================================
   Trendy Decorum — Shared UI (header, order list drawer, cards, toasts)
   ========================================================================== */
(function () {
  const { config: C, money, waLink, productUrl, orderList } = window.TD;

  const ICONS = {
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41Z"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 7h12l1 13H5L6 7Z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8.5V6.8c0-.8.5-1 .9-1H17V2.1L14.2 2C11 2 10.3 4.4 10.3 6v2.5H8v3.8h2.3V22H14v-9.7h2.8l.4-3.8H14Z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>'
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Contact links from config ---------- */
  function wireContactLinks() {
    const igUrl = "https://www.instagram.com/" + C.instagramHandle + "/";
    $$("[data-wa]").forEach((a) => {
      a.href = waLink(a.dataset.waText || `Hi ${C.businessName}! 🪔 I'd like to know more about your décor.`);
      a.target = "_blank"; a.rel = "noopener";
    });
    $$("[data-ig]").forEach((a) => { a.href = igUrl; a.target = "_blank"; a.rel = "noopener"; });
    $$("[data-ig-handle]").forEach((el) => (el.textContent = "@" + C.instagramHandle));
    $$("[data-tel]").forEach((a) => (a.href = "tel:+" + C.whatsappNumber));
    $$("[data-phone]").forEach((el) => (el.textContent = C.phoneDisplay));
    $$("[data-location]").forEach((el) => (el.textContent = C.location));
    $$("[data-fb]").forEach((a) => {
      if (C.facebookUrl) { a.href = C.facebookUrl; a.target = "_blank"; a.rel = "noopener"; }
      else a.remove();
    });
    $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
  }

  /* ---------- Header ---------- */
  function initHeader() {
    const header = $("#site-header");
    const onScroll = () => header && header.classList.toggle("scrolled", scrollY > 10);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });

    const toggle = $("#menu-toggle");
    if (toggle) {
      toggle.addEventListener("click", () => {
        const open = document.body.classList.toggle("menu-open");
        toggle.setAttribute("aria-expanded", open);
      });
      $$("#main-nav a").forEach((a) => a.addEventListener("click", () => {
        document.body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
      }));
    }

    const page = document.body.dataset.page;
    $$("#main-nav a[data-nav]").forEach((a) => a.classList.toggle("active", a.dataset.nav === page));
  }

  /* ---------- Order list drawer ---------- */
  function buildDrawer() {
    document.body.insertAdjacentHTML("beforeend", `
      <div class="drawer-overlay" id="drawer-overlay"></div>
      <aside class="drawer" id="order-drawer" aria-label="Your order list" aria-hidden="true">
        <div class="drawer-head">
          <h2><span>Your</span> Order List</h2>
          <button class="icon-close" id="close-list-btn" aria-label="Close order list">${ICONS.close}</button>
        </div>
        <div class="drawer-body" id="drawer-body"></div>
        <div class="drawer-foot" id="drawer-foot"></div>
      </aside>
      <div class="toast" id="toast" role="status" aria-live="polite"><span id="toast-text"></span><button id="toast-action">View list</button></div>
      <a class="wa-fab" id="whatsapp-fab" data-wa aria-label="Chat on WhatsApp">${ICONS.whatsapp}<span class="wa-label">Chat with us</span></a>
    `);
    $("#drawer-overlay").addEventListener("click", closeDrawer);
    $("#close-list-btn").addEventListener("click", closeDrawer);
    $("#toast-action").addEventListener("click", () => { hideToast(); openDrawer(); });
    $$("#open-list-btn, [data-open-list]").forEach((b) => b.addEventListener("click", openDrawer));
    addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });

    $("#drawer-body").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-act]");
      if (!btn) return;
      const key = btn.dataset.key;
      const item = orderList.items().find((i) => i.key === key);
      if (!item) return;
      if (btn.dataset.act === "inc") orderList.setQty(key, item.qty + 1);
      if (btn.dataset.act === "dec") orderList.setQty(key, item.qty - 1);
      if (btn.dataset.act === "remove") orderList.remove(key);
    });

    renderDrawer();
    orderList.onChange(() => { renderDrawer(); updateCount(true); });
    updateCount(false);
  }

  function renderDrawer() {
    const items = orderList.items();
    const body = $("#drawer-body"), foot = $("#drawer-foot");
    if (!items.length) {
      body.innerHTML = `
        <div class="drawer-empty">
          <div class="big">🪔</div>
          <h3>Your list is empty</h3>
          <p>Add the pieces you love, then send the whole list to us on WhatsApp in one tap.</p>
          <a href="shop.html" class="btn btn-dark" style="margin-top:22px" id="drawer-shop-btn">Browse the collection</a>
        </div>`;
      foot.innerHTML = "";
      return;
    }
    body.innerHTML = items.map((i) => `
      <div class="line-item">
        <a href="product.html?id=${encodeURIComponent(i.id)}"><img src="${esc(i.image)}" alt="${esc(i.name)}" loading="lazy"></a>
        <div>
          <h4>${esc(i.name)}</h4>
          ${i.size ? `<div class="meta">${esc(i.size)}</div>` : ""}
          <div class="qty">
            <button data-act="dec" data-key="${esc(i.key)}" aria-label="Decrease quantity">−</button>
            <span>${i.qty}</span>
            <button data-act="inc" data-key="${esc(i.key)}" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div class="line-right">
          <span class="price">${i.price != null ? money(i.price * i.qty) : '<span class="price ask">Ask</span>'}</span>
          <button class="remove-btn" data-act="remove" data-key="${esc(i.key)}">Remove</button>
        </div>
      </div>`).join("");
    foot.innerHTML = `
      <div class="total-row"><span>Estimated total</span><span class="price">${money(orderList.total())}${orderList.hasUnpriced() ? "+" : ""}</span></div>
      <small>No payment online. Monika will confirm availability, delivery and the final price on WhatsApp. Pay by cash or e-Transfer.</small>
      <a class="btn btn-whatsapp btn-block btn-lg" id="send-list-btn" target="_blank" rel="noopener" href="${waLink(orderList.message())}">${ICONS.whatsapp} Send list on WhatsApp</a>
      <button class="clear-btn" id="clear-list-btn">Clear list</button>`;
    $("#clear-list-btn").addEventListener("click", () => orderList.clear());
  }

  function updateCount(bump) {
    const n = orderList.count();
    $$("[data-list-count]").forEach((el) => {
      el.textContent = n;
      el.classList.toggle("has-items", n > 0);
      if (bump && n > 0) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
    });
  }

  function openDrawer() {
    document.body.classList.add("drawer-open");
    $("#order-drawer").setAttribute("aria-hidden", "false");
  }
  function closeDrawer() {
    document.body.classList.remove("drawer-open");
    const d = $("#order-drawer");
    if (d) d.setAttribute("aria-hidden", "true");
  }

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(text) {
    $("#toast-text").textContent = text;
    $("#toast").classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 3200);
  }
  function hideToast() { $("#toast").classList.remove("show"); }

  /* ---------- Product cards ---------- */
  function priceHTML(p) {
    if (p.price == null) return `<span class="price ask">Message for price</span>`;
    return `<span class="price">${p.hasRange ? "<small>From</small>" : ""}${money(p.price)}</span>`;
  }

  function cardHTML(p, i = 0) {
    const url = productUrl(p);
    return `
      <article class="card reveal" style="--d:${Math.min(i % 4, 3) * 0.08}s">
        <a class="card-media" href="${url}" aria-label="${esc(p.name)}">
          <img src="${esc(p.images[0])}" alt="${esc(p.name)}" loading="lazy" decoding="async">
          ${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ""}
          ${!p.inStock ? `<span class="badge soldout">Sold out</span>` : ""}
        </a>
        <div class="card-body">
          <p class="card-cat">${esc(p.category)}</p>
          <h3 class="card-title"><a href="${url}">${esc(p.name)}</a></h3>
          <div class="card-foot">
            ${priceHTML(p)}
            <button class="add-btn" id="add-${esc(p.id)}" data-add="${esc(p.id)}" aria-label="Add ${esc(p.name)} to order list">${ICONS.plus}</button>
          </div>
        </div>
      </article>`;
  }

  function renderCards(container, products) {
    container.innerHTML = products.map(cardHTML).join("");
    observeReveals(container);
  }

  // One delegated listener per container for quick-add buttons
  function enableQuickAdd(container, getProducts) {
    container.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-add]");
      if (!btn) return;
      e.preventDefault();
      const p = getProducts().find((x) => x.id === btn.dataset.add);
      if (!p) return;
      orderList.add(p, p.sizes[0] || null, 1);
      btn.classList.add("added");
      btn.innerHTML = ICONS.check;
      setTimeout(() => { btn.classList.remove("added"); btn.innerHTML = ICONS.plus; }, 1400);
      toast(`Added “${p.name}”${p.sizes[0] ? " · " + p.sizes[0].label : ""}`);
    });
  }

  function skeletons(container, n = 8) {
    container.innerHTML = Array.from({ length: n }, () => `<div class="skeleton card"></div>`).join("");
  }

  /* ---------- Reveal on scroll ---------- */
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" })
    : null;
  function observeReveals(root = document) {
    $$(".reveal:not(.in)", root).forEach((el) => (io ? io.observe(el) : el.classList.add("in")));
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    buildDrawer();
    wireContactLinks();
    initHeader();
    observeReveals();
  });

  window.TDUI = { ICONS, $, $$, esc, cardHTML, renderCards, enableQuickAdd, skeletons, observeReveals, toast, openDrawer, priceHTML, wireContactLinks };
})();
