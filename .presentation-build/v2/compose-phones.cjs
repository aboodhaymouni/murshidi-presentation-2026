const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const buildDir = __dirname;
const screensDir = path.join(buildDir, 'screens-hd');
const outputDir = path.join(buildDir, 'phone-composites-hd');
const framePath = path.join(buildDir, '..', 'assets', 'iphone-frame-overlay.png');
const names = ['home', 'compare', 'roi-result', 'market'];

fs.mkdirSync(outputDir, { recursive: true });

const mask = Buffer.from(`
  <svg width="1214" height="2708" xmlns="http://www.w3.org/2000/svg">
    <rect width="1214" height="2708" rx="152" ry="152" fill="#fff"/>
  </svg>
`);

(async () => {
  const frameMask = Buffer.from('<svg width="2048" height="3072" xmlns="http://www.w3.org/2000/svg"><rect x="362" y="134" width="1326" height="2810" rx="236" fill="#fff"/></svg>');
  const frame = await sharp(framePath).resize(2048,3072).composite([{input:frameMask,blend:'dest-in'}]).png().toBuffer();
  for (const name of names) {
    const screen = await sharp(path.join(screensDir, `${name}.png`))
      .resize(1214, 2546, { fit: 'contain', background: '#FFFFFF' })
      .png()
      .toBuffer();
    const display = await sharp({create:{width:1214,height:2708,channels:4,background:'#FFFFFF'}})
      .composite([{input:screen,left:0,top:162}]).png().toBuffer();
    const clipped = await sharp(display)
      .composite([{ input: mask, blend: 'dest-in' }])
      .png()
      .toBuffer();
    await sharp({
      create: { width: 2048, height: 3072, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
    })
      .composite([
        { input: clipped, left: 418, top: 182 },
        { input: frame, left: 0, top: 0 },
      ])
      .png()
      .toFile(path.join(outputDir, `${name}.png`));
  }
  console.log(`Composed ${names.length} high-resolution iPhones with a complete display and camera clearance.`);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
