/* ==========================================================================
   Trendy Decorum — Product data layer
   Loads products from a published Google Sheet (CSV) or the local CSV,
   and manages the visitor's order list (saved in their browser).
   ========================================================================== */
(function () {
  const C = window.TD_CONFIG;

  /* ---------- CSV parsing (handles quotes, commas & new lines in cells) ---------- */
  function parseCSV(text) {
    const rows = [];
    let row = [], field = "", inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; }
          else inQuotes = false;
        } else field += c;
      } else if (c === '"') inQuotes = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else if (c !== "\r") field += c;
    }
    if (field !== "" || row.length) { row.push(field); rows.push(row); }
    return rows;
  }

  function rowsToObjects(rows) {
    if (!rows.length) return [];
    const headers = rows[0].map((h) => h.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""));
    return rows.slice(1)
      .filter((r) => r.some((cell) => cell.trim() !== ""))
      .map((r) => Object.fromEntries(headers.map((h, i) => [h, (r[i] || "").trim()])));
  }

  /* ---------- Helpers ---------- */
  function slugify(s) {
    return String(s).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
  function isYes(v, fallback) {
    if (v == null || String(v).trim() === "") return fallback;
    return /^(y|yes|true|1|✓|✔|x)$/i.test(String(v).trim());
  }
  function toNumber(v) {
    const n = parseFloat(String(v || "").replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : null;
  }
  function splitList(v, sep) {
    return String(v || "").split(sep).map((s) => s.trim()).filter(Boolean);
  }

  // Turns Google Drive share links into direct image links. Other URLs/paths pass through.
  function imageUrl(raw) {
    const s = String(raw || "").trim();
    if (!s) return "";
    if (/drive\.google\.com|docs\.google\.com|googleusercontent\.com/.test(s)) {
      const m = s.match(/\/d\/([a-zA-Z0-9_-]{10,})/) || s.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);
      if (m) return "https://lh3.googleusercontent.com/d/" + m[1] + "=w1400";
    }
    return s;
  }

  // "Single - $15 | Pair - $28"  →  [{label:"Single", price:15}, {label:"Pair", price:28}]
  function parseSizes(raw, basePrice) {
    const parsed = splitList(raw, /\||\n|;/).map((part) => {
      const m = part.match(/^(.*?)\s*[-:=–—]\s*\$?\s*(\d+(?:\.\d+)?)\s*$/);
      if (m && m[1]) return { label: m[1].trim(), price: parseFloat(m[2]) };
      return { label: part, price: basePrice };
    });
    // If there is only one size option and basePrice is set, keep them in sync
    if (parsed.length === 1 && basePrice != null) {
      parsed[0].price = basePrice;
    }
    return parsed;
  }

  function normalize(obj, index) {
    const name = obj.name || obj.product_name || obj.title || "";
    if (!name) return null;
    if (!isYes(obj.show, true)) return null;

    const basePrice = toNumber(obj.price);
    const sizes = parseSizes(obj.sizes || obj.size_prices || obj.variants, basePrice);
    const priced = sizes.filter((s) => s.price != null).map((s) => s.price);
    // If only one size or no sizes, basePrice takes priority
    const price = (sizes.length <= 1 && basePrice != null)
      ? basePrice
      : (priced.length ? Math.min(...priced) : basePrice);
    const images = splitList(obj.images || obj.image || obj.photos || obj.photo, /\||\n|,(?=\s*(?:https?:|assets\/|\/))/).map(imageUrl).filter(Boolean);

    return {
      id: slugify(obj.id || name) || "item-" + index,
      name,
      category: obj.category || "Décor",
      occasions: splitList(obj.occasions || obj.occasion, /,|\|/),
      description: obj.description || "",
      price,
      hasRange: priced.length > 1 && Math.max(...priced) !== Math.min(...priced),
      sizes,
      images: images.length ? images : ["assets/brand/logo.jpg"],
      featured: isYes(obj.featured, false),
      badge: obj.badge || "",
      inStock: isYes(obj.in_stock || obj.instock || obj.available, true),
      order: index
    };
  }

  async function fetchText(url) {
    // Add cachebuster to bypass Google CDN and browser caching
    const sep = url.includes("?") ? "&" : "?";
    const cacheBusted = url + sep + "_t=" + Date.now();
    const res = await fetch(cacheBusted, { cache: "no-cache" });
    if (!res.ok) throw new Error("HTTP " + res.status + " for " + url);
    const text = await res.text();
    if (/^\s*</.test(text)) throw new Error("Got a web page instead of CSV — is the sheet published as CSV?");
    return text;
  }

  let productsPromise = null;
  function loadProducts() {
    if (productsPromise) return productsPromise;
    productsPromise = (async () => {
      let text;
      if (C.productsSheetCsvUrl) {
        try { text = await fetchText(C.productsSheetCsvUrl); }
        catch (err) { console.warn("[Trendy Decorum] Google Sheet failed, using local list:", err); }
      }
      if (!text) text = await fetchText(C.localProductsCsv);

      const seen = new Set();
      return rowsToObjects(parseCSV(text)).map(normalize).filter(Boolean).map((p) => {
        let id = p.id, n = 2;
        while (seen.has(id)) id = p.id + "-" + n++;
        seen.add(id);
        p.id = id;
        return p;
      });
    })();
    return productsPromise;
  }

  /* ---------- Formatting & links ---------- */
  function money(n) {
    if (n == null) return "";
    return C.currencySymbol + (Number.isInteger(n) ? n : n.toFixed(2));
  }
  function waLink(text) {
    return "https://wa.me/" + C.whatsappNumber + (text ? "?text=" + encodeURIComponent(text) : "");
  }
  function productUrl(p) { return "product.html?id=" + encodeURIComponent(p.id); }
  function absoluteUrl(path) { return new URL(path, location.href).href; }

  /* ---------- Order list (localStorage) ---------- */
  const KEY = "td_order_list_v1";
  const listeners = new Set();
  function read() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } }
  function write(items) { localStorage.setItem(KEY, JSON.stringify(items)); listeners.forEach((fn) => fn(items)); }

  const orderList = {
    items: read,
    count: () => read().reduce((n, i) => n + i.qty, 0),
    total: () => read().reduce((n, i) => n + (i.price || 0) * i.qty, 0),
    hasUnpriced: () => read().some((i) => i.price == null),
    add(product, size, qty = 1) {
      const items = read();
      const key = product.id + "|" + (size ? size.label : "");
      const existing = items.find((i) => i.key === key);
      if (existing) existing.qty += qty;
      else items.push({
        key, id: product.id, name: product.name, image: product.images[0],
        size: size ? size.label : "", price: size && size.price != null ? size.price : product.price, qty
      });
      write(items);
    },
    setQty(key, qty) {
      let items = read();
      const it = items.find((i) => i.key === key);
      if (!it) return;
      it.qty = Math.max(0, qty);
      if (it.qty === 0) items = items.filter((i) => i.key !== key);
      write(items);
    },
    remove(key) { write(read().filter((i) => i.key !== key)); },
    clear() { write([]); },
    onChange(fn) { listeners.add(fn); },
    message() {
      const items = read();
      const lines = items.map((i, n) =>
        `${n + 1}. ${i.name}${i.size ? " (" + i.size + ")" : ""} × ${i.qty}${i.price != null ? " — " + money(i.price * i.qty) : ""}`);
      let msg = `Hi ${C.businessName}! 🪔 I'd like to order:\n\n${lines.join("\n")}`;
      if (items.some((i) => i.price != null)) msg += `\n\nEstimated total: ${money(orderList.total())}${orderList.hasUnpriced() ? " + items to confirm" : ""}`;
      msg += `\n\nPickup in ${C.location.split(",")[0]} or delivery? `;
      return msg;
    }
  };
  window.addEventListener("storage", (e) => { if (e.key === KEY) listeners.forEach((fn) => fn(read())); });

  window.TD = { config: C, loadProducts, money, waLink, productUrl, absoluteUrl, slugify, orderList };
})();
