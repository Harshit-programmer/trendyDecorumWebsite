const fs = require('fs');
const path = require('path');

const root = 'c:\\dev\\trendyDecorumWebsite';
console.log('Testing Trendy Decorum website files...');

const htmlFiles = ['index.html', 'shop.html', 'product.html', 'about.html', 'contact.html'];
let hasError = false;

htmlFiles.forEach(file => {
  const filePath = path.join(root, file);
  if (!fs.existsSync(filePath)) {
    console.error(`Missing file: ${file}`);
    hasError = true;
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`[OK] ${file} exists (${(content.length / 1024).toFixed(1)} KB)`);

  // Check for broken links to local assets
  const srcMatches = content.matchAll(/(?:src|href)="([^"#?]+(?:\.jpg|\.jpeg|\.png|\.svg|\.css|\.js|\.csv))"/g);
  for (const match of srcMatches) {
    const asset = match[1];
    if (!asset.startsWith('http')) {
      const assetPath = path.join(root, asset.replace(/\//g, path.sep));
      if (!fs.existsSync(assetPath)) {
        console.error(`  [BROKEN LINK in ${file}] -> ${asset}`);
        hasError = true;
      }
    }
  }
});

// Validate CSV parsing
const csvPath = path.join(root, 'data', 'products.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');
const lines = csvContent.trim().split('\n');
console.log(`[OK] products.csv has ${lines.length - 1} products.`);

if (!hasError) {
  console.log('All files, local links, styles and product images verified successfully!');
} else {
  process.exit(1);
}
