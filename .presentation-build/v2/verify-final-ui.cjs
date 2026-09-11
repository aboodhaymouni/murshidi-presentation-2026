const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://127.0.0.1:5185/#/market', { waitUntil: 'networkidle' });
  const body = await page.locator('body').innerText();
  const result = {
    url: page.url(),
    hasJordanianUnemployment: body.includes('معدل البطالة بين الأردنيين') && body.includes('Q2 2026'),
    hasBachelorGraduates: body.includes('منهم خريجو البكالوريوس') && body.includes('2022/2023'),
    hasDatedSnapshotDisclosure: body.includes('نسخة موثقة محفوظة'),
    horizontalOverflowPx: await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
    consoleErrors: errors,
  };
  fs.writeFileSync('.presentation-build/v2/final-ui-verification.json', JSON.stringify(result, null, 2));
  await page.screenshot({ path: '.presentation-build/v2/screens/market-final.png', fullPage: true });
  await browser.close();
  if (!result.hasJordanianUnemployment || !result.hasBachelorGraduates || !result.hasDatedSnapshotDisclosure || result.horizontalOverflowPx > 0 || errors.length) {
    console.error(result); process.exit(1);
  }
  console.log(result);
})();
