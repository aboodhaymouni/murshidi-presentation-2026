const sharp = require('sharp');
const path = require('node:path');

const input = path.join(__dirname, 'iphone-frame.png');
const output = path.join(__dirname, 'iphone-frame-overlay.png');
const mask = Buffer.from(`<svg width="1024" height="1536" xmlns="http://www.w3.org/2000/svg">
  <defs><mask id="cut">
    <rect width="1024" height="1536" fill="black"/>
    <rect x="181" y="67" width="663" height="1405" rx="118" fill="white"/>
    <rect x="209" y="91" width="607" height="1354" rx="76" fill="black"/>
    <rect x="423" y="104" width="178" height="56" rx="28" fill="white"/>
    <rect x="174" y="330" width="18" height="87" rx="8" fill="white"/>
    <rect x="174" y="421" width="18" height="211" rx="8" fill="white"/>
    <rect x="832" y="470" width="20" height="166" rx="8" fill="white"/>
  </mask></defs>
  <rect width="1024" height="1536" fill="white" mask="url(#cut)"/>
</svg>`);

sharp(input)
  .ensureAlpha()
  .composite([{ input: mask, blend: 'dest-in' }])
  .png()
  .toFile(output)
  .then(() => sharp(output).metadata())
  .then(metadata => console.log(JSON.stringify(metadata)))
  .catch(error => { console.error(error); process.exit(1); });
