const { chromium } = require('C:/Users/Abdalrahman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const out = __dirname;
const base = 'http://127.0.0.1:5182/#';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 });
  const errors = [], requests = [], routes = ['', 'home','market','chat','future','stories','scholarships','alternatives','profile'];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('request', r => { if (['fetch','xhr'].includes(r.resourceType())) requests.push(r.url()); });
  const report = { viewports: [], controls: [], errors, requests };
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: width === 1440 ? 900 : 812 });
    for (const route of routes) {
      await page.goto(`${base}/${route}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const state = await page.evaluate(() => ({
        title: document.querySelector('h1,h2')?.textContent,
        lang: document.documentElement.lang, dir: document.documentElement.dir,
        viewport: window.innerWidth, scrollWidth: document.documentElement.scrollWidth,
        text: document.body.innerText,
        smallControls: [...document.querySelectorAll('button,a,input')].map(e => ({ text: e.textContent.trim() || e.getAttribute('aria-label') || e.tagName, width: e.getBoundingClientRect().width, height: e.getBoundingClientRect().height })).filter(e => e.width < 44 || e.height < 44),
      }));
      report.viewports.push({ route: route || 'splash', width, ...state });
      if (width === 375) await page.screenshot({ path: path.join(out, `baseline-${route || 'splash'}-375.png`), fullPage: true });
    }
  }
  await page.setViewportSize({ width: 375, height: 812 });
  async function deadControl(route, locator, label) {
    await page.goto(`${base}/${route}`, { waitUntil: 'networkidle' });
    const prior = await page.locator('body').innerText();
    const priorUrl = page.url();
    const pages = page.context().pages().length;
    await locator().first().click();
    await page.waitForTimeout(350);
    report.controls.push({ route, label, changedText: prior !== await page.locator('body').innerText(), changedUrl: priorUrl !== page.url(), newTab: page.context().pages().length !== pages });
  }
  await deadControl('home', () => page.getByRole('button', { name: 'notifications' }), 'notification bell');
  await deadControl('stories', () => page.getByRole('button', { name: 'مشاهدة الفيديو' }), 'story video');
  await deadControl('stories', () => page.getByRole('button', { name: 'تواصل', exact: true }), 'contact graduate');
  await deadControl('stories', () => page.getByRole('button', { name: /مفيد/ }), 'helpful');
  await deadControl('stories', () => page.getByRole('button', { name: 'عرض المزيد من الشهادات' }), 'more stories');
  await deadControl('scholarships', () => page.getByRole('button', { name: 'تقديم الطلب' }), 'apply scholarship');
  await page.goto(`${base}/profile`, { waitUntil: 'networkidle' });
  const labels = (await page.locator('button').allInnerTexts()).map(t => t.replace(/\s+/g, ' ').trim());
  report.profileButtonLabels = labels;
  for (const label of labels.filter(t => !['AR','EN','الرئيسيّة','الحاسبة','سوق العمل','استشارة','ملفّي'].includes(t.trim())).slice(0, 9)) {
    await deadControl('profile', () => page.getByRole('button', { name: label.trim(), exact: true }), label.trim());
  }
  await page.goto(`${base}/chat`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'معدّلي 78 وأرغب بدراسة الطبّ، ما الخيارات المتاحة؟' }).click();
  await page.waitForTimeout(1100);
  report.chatMedicine = await page.locator('body').innerText();
  await page.screenshot({ path: path.join(out, 'chat-medicine-default.png'), fullPage: true });
  await page.goto(`${base}/stories`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'ندم', exact: true }).click();
  report.storiesFilter = await page.locator('body').innerText();
  await page.goto(`${base}/profile`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await page.goto(`${base}/market`, { waitUntil: 'networkidle' });
  report.englishMarket = await page.evaluate(() => ({ lang: document.documentElement.lang, dir: document.documentElement.dir, text: document.body.innerText }));
  await page.screenshot({ path: path.join(out, 'market-english-arabic-content.png'), fullPage: true });
  fs.writeFileSync(path.join(out, 'audit.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ routesChecked: report.viewports.length, errors, requests, controls: report.controls, englishMarket: report.englishMarket, chatMedicine: report.chatMedicine }, null, 2));
  await browser.close();
})().catch(e => { console.error(e); process.exitCode = 1; });
