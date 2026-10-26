/* ==========================================================================
   Trendy Decorum — Site settings
   Change business details here; every page picks them up automatically.
   ========================================================================== */
window.TD_CONFIG = {
  businessName: "Trendy Decorum",
  ownerName: "Monika",

  // WhatsApp / phone — country code + number, digits only
  whatsappNumber: "16477814940",
  phoneDisplay: "(647) 781-4940",

  instagramHandle: "trendy_decorum",
  facebookUrl: "", // e.g. "https://www.facebook.com/yourpage" — leave empty to hide

  location: "Oshawa, Ontario",
  currencySymbol: "$",
  currencyCode: "CAD",

  /* --------------------------------------------------------------------
     PRODUCTS
     Paste the Google Sheet "Publish to web → CSV" link below.
     While it is empty, the site uses the starter list in data/products.csv.
     See HOW_TO_UPDATE_PRODUCTS.md for step-by-step instructions.
     -------------------------------------------------------------------- */
  productsSheetCsvUrl: "",
  localProductsCsv: "data/products.csv",

  occasions: [
    { name: "Diwali", icon: "🪔", blurb: "Torans, diyas & shubh labh", className: "occ-diwali" },
    { name: "Navratri", icon: "💃", blurb: "Colourful garba-ready décor", className: "occ-navratri" },
    { name: "Karva Chauth", icon: "🌙", blurb: "Elegant festive accents", className: "occ-karva" },
    { name: "Weddings", icon: "💍", blurb: "Mehndi, haldi & sangeet décor", className: "occ-wedding" },
    { name: "Ganesh Chaturthi", icon: "🐘", blurb: "Bappa's welcome décor", className: "occ-ganesh" },
    { name: "Holi", icon: "🎨", blurb: "Bright, joyful hangings", className: "occ-holi" }
  ]
};
