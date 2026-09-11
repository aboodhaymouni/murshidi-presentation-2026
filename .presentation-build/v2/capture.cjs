const {chromium}=require('playwright');
const fs=require('node:fs/promises');const path=require('node:path');
(async()=>{const out=path.join(__dirname,'screens');await fs.mkdir(out,{recursive:true});const browser=await chromium.launch({channel:'msedge',headless:true});
try{const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:3});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const base='http://127.0.0.1:5183';
const response=await page.request.get(base+'/api/public-data');const data=await response.json();
if(data.sources.filter(s=>['dos-unemployment','tawjihi-2026','admhec-programs','admhec-cutoffs'].includes(s.id)).some(s=>s.status!=='live'))throw Error('Capture requires a successful actual source refresh first.');
for(const route of ['home','compare','roi','market','personality']){
 await page.goto(base+'/#/'+route);await page.locator('main').waitFor();await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(700);
 if(route==='compare')await page.locator('article').first().evaluate(el=>window.scrollTo(0,el.getBoundingClientRect().top+window.scrollY-16));
 await page.screenshot({path:path.join(out,route+'.png')});
 if(route==='roi'){await page.getByRole('button',{name:'احسب الكلفة وقارن بميزانيتي'}).click();await page.waitForTimeout(300);await page.screenshot({path:path.join(out,'roi-result.png')});}
}
await fs.writeFile(path.join(out,'capture-manifest.json'),JSON.stringify({capturedAt:new Date().toISOString(),source:'Actual running updated React application',base,viewport:{width:390,height:844},deviceScaleFactor:3,sources:data.sources,programs:data.programs.length,cutoffs:data.cutoffs.length,errors},null,2));console.log('Captured actual home, compare, calculator/result, market and interests screens.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
