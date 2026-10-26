# How Monika Can Add & Update Products (Zero Code!)

The **Trendy Decorum** website is built so that Monika can update products, change prices, and add new festival arrivals directly from a **free Google Sheet** on her phone or computer.

---

## ⚡ Option 1: Edit the Starter File Locally (No Setup)

Right now, the site reads products from:
`C:\dev\trendyDecorumWebsite\data\products.csv`

You can open this file in Excel, Notepad, or Google Sheets. Every time you edit and save it, the website updates immediately.

---

## 🚀 Option 2: Connect a Live Google Sheet (Recommended!)

With a Google Sheet, Monika can add a new photo and price while on the go in 30 seconds.

### Step 1: Create a Google Sheet
Create a new Google Sheet with these exact column headers in Row 1:

| name | category | occasions | price | sizes | description | images | featured | badge | in_stock | show | notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |

> **Tip:** You can import `data/products.csv` into Google Sheets to get all 18 starter products immediately!

### Step 2: Publish Sheet to Web as CSV
1. In Google Sheets, click **File** &rarr; **Share** &rarr; **Publish to web**.
2. Change **"Entire Document"** to **"Sheet1"** (or the tab name).
3. Change **"Web page"** to **"Comma-separated values (.csv)"**.
4. Click **Publish** and copy the generated link. It looks like:
   `https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=0&single=true&output=csv`

### Step 3: Paste Link in Config
Open `js/config.js` and paste the link into `productsSheetCsvUrl`:

```javascript
window.TD_CONFIG = {
  businessName: "Trendy Decorum",
  ownerName: "Monika",
  whatsappNumber: "16477814940",
  // ...
  productsSheetCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?output=csv",
  // ...
};
```
Done! Any edit in Google Sheet will reflect on the website within 1–2 minutes.

---

## 📸 How to Add Photos in the Google Sheet

Monika can add photos in two easy ways:

### A) Google Drive Photos (Easiest)
1. Upload product photo to a Google Drive folder.
2. Right-click the photo &rarr; **Share** &rarr; Set General Access to **"Anyone with the link can view"**.
3. Copy link and paste it into the `images` column of the Google Sheet.
   *(The website code automatically converts Google Drive links into fast-loading images!)*

### B) Local Image Files
Put image files in `assets/products/your-item.jpg` and write `assets/products/your-item.jpg` in the `images` column.

If an item has multiple photos, separate them with ` | ` (e.g. `photo1.jpg | photo2.jpg`).

---

## 🏷️ How to Write Sizes and Prices

Monika can offer single prices OR multiple options:

| What she wants | What to write in `price` | What to write in `sizes` | What customers see |
| :--- | :--- | :--- | :--- |
| Fixed price | `35` | *(leave blank)* | **$35** |
| Single vs Pair | `22` | `Single - $12 \| Pair - $22` | **From $12** (buttons for Single & Pair) |
| Multiple sizes | `15` | `Small - $15 \| Medium - $22 \| Large - $30` | **From $15** (buttons for S, M, L) |
| Door sizes | `40` | `36 inch - $40 \| 48 inch - $55` | **From $40** (buttons for 36" & 48") |
| Custom / Contact | *(leave blank)* | *(leave blank)* | **Message for price** |

---

## 🛠️ Other Useful Columns

- **`category`**: Groups items on the catalogue (`Shubh Labh`, `Torans`, `Door & Wall Hangings`, `Garlands & Florals`, `Wall Décor`).
- **`occasions`**: Comma separated (`Diwali, Navratri, Weddings, Karva Chauth, Ganesh Chaturthi`). Used by occasion filters!
- **`featured`**: Type `yes` to show on the homepage.
- **`badge`**: Optional banner text like `Bestseller`, `New`, or `Limited`.
- **`in_stock`**: Set to `no` if sold out. It will display a "Sold out" badge and keep the listing visible.
- **`show`**: Set to `no` to hide a draft product from the website completely.
