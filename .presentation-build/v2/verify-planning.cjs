const {chromium}=require('playwright');
const fs=require('node:fs/promises');
const path=require('node:path');
const assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const base='http://127.0.0.1:5182/#';
try{
 await page.goto(base+'/roi'); await page.getByRole('button',{name:'احسب الكلفة وقارن بميزانيتي'}).waitFor();
 await page.getByRole('button',{name:'احسب الكلفة وقارن بميزانيتي'}).click();
 assert.ok((await page.locator('main').innerText()).includes('٣٬٠٥١'));
 await page.getByRole('button',{name:'عدّل الافتراضات'}).click();
 await page.getByLabel('ميزانيتك السنوية').fill('2000');
 await page.getByRole('button',{name:'احسب الكلفة وقارن بميزانيتي'}).click();
 assert.ok((await page.locator('main').innerText()).includes('١٬٠٥١'));
 await page.getByRole('button',{name:'عدّل الافتراضات'}).click();
 await page.getByLabel('ميزانيتك السنوية').fill('');
 assert.equal(await page.getByRole('button',{name:'احسب الكلفة وقارن بميزانيتي'}).isDisabled(),true);
 await page.getByLabel('ميزانيتك السنوية').fill('4000');
 await page.getByLabel('ساعات الخطة').fill('0');
 assert.equal(await page.getByRole('button',{name:'احسب الكلفة وقارن بميزانيتي'}).isDisabled(),true);
 await page.goto(base+'/compare');await page.getByRole('button',{name:'تغيير البرنامج 1',exact:true}).click();
 await page.getByRole('textbox').fill('شيءلايوجدهنا');assert.ok((await page.locator('main').innerText()).includes('لا توجد نتائج'));
 await page.getByRole('textbox').fill('الأمن السيبراني');await page.locator('section button[aria-pressed]').first().click();
 const name=await page.locator('article h3').first().innerText();
 await page.locator('article a').first().click();assert.ok((await page.locator('main h2').first().innerText()).includes(name));
 await page.goto(base+'/simulate');await page.getByRole('button',{name:'+ 1 سنة',exact:true}).click();assert.ok((await page.locator('[aria-live]').innerText()).includes('٣٬٠٠٠'));
 const geometry=[];
 for(const width of [375,768,1440]){await page.setViewportSize({width,height:900});for(const route of ['/roi','/compare','/simulate']){await page.goto(base+route);await page.locator('main').waitFor();geometry.push({width,route,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});}}
 assert.equal(geometry.some(x=>x.overflow),false);assert.deepEqual(errors,[]);
 await fs.writeFile(path.join(__dirname,'planning-verification.json'),JSON.stringify({passed:true,checks:['Budget changes affordability and funding gap','Empty/zero inputs rejected','No-results search','Compared program passes to cost plan','Extra year affects scenario','Three viewport sizes'],geometry,errors},null,2));
 console.log('Planning UI: all meaningful checks passed.');
}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
