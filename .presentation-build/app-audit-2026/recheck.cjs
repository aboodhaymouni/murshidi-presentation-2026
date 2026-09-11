const { chromium } = require('C:/Users/Abdalrahman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs');
const path = require('path');
(async () => {
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:3});
 const report=[];
 for (const route of ['home','market','scholarships','future','stories']) {
   await page.goto('http://127.0.0.1:5182/#/'+route,{waitUntil:'networkidle'});
   await page.evaluate(()=>document.fonts.ready);
   await page.waitForTimeout(2200);
   await page.screenshot({path:path.join(__dirname,'baseline-'+route+'-phone.png')});
   await page.screenshot({path:path.join(__dirname,'baseline-'+route+'-390-full.png'),fullPage:true});
   report.push({route,text:await page.locator('body').innerText()});
 }
 await page.goto('http://127.0.0.1:5182/#/scholarships');
 const before=await page.locator('body').innerText();
 await page.getByRole('button',{name:'تقديم الطلب'}).first().click();
 await page.waitForTimeout(400);
 report.push({recheck:'scholarship apply unchanged',unchanged:before===await page.locator('body').innerText()});
 await page.goto('http://127.0.0.1:5182/#/chat');
 await page.getByRole('button',{name:'معدّلي 78 وأرغب بدراسة الطبّ، ما الخيارات المتاحة؟'}).click();
 await page.waitForTimeout(1100);
 report.push({recheck:'medicine default',defaultResponse:(await page.locator('body').innerText()).includes('نوصي بالخطوات التالية')});
 fs.writeFileSync(path.join(__dirname,'recheck.json'),JSON.stringify(report,null,2));
 console.log('Rechecks and 390px screenshots saved.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
