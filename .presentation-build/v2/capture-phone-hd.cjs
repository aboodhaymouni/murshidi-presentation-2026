const {chromium}=require('playwright');
const fs=require('node:fs/promises');
const path=require('node:path');
(async()=>{
 const out=path.join(__dirname,'screens-hd');await fs.mkdir(out,{recursive:true});
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:818},deviceScaleFactor:4});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const base='http://127.0.0.1:5183';
  const response=await page.request.get(base+'/api/public-data');
  if(!response.ok())throw Error('App data request failed: '+response.status());
  const data=await response.json();
  for(const route of ['home','compare','roi','market']){
   await page.goto(base+'/#/'+route);await page.locator('main').waitFor();
   await page.evaluate(()=>document.fonts.ready);
   await page.evaluate(()=>Promise.all([...document.images].map(img=>img.decode().catch(()=>{}))));
   await page.waitForTimeout(900);
   if(route==='compare')await page.locator('article').first().evaluate(el=>window.scrollTo(0,el.getBoundingClientRect().top+window.scrollY-16));
   if(route==='roi'){await page.getByRole('button',{name:'احسب الكلفة وقارن بميزانيتي'}).click();await page.waitForTimeout(300);}
   await page.screenshot({path:path.join(out,(route==='roi'?'roi-result':route)+'.png'),animations:'disabled',scale:'device'});
  }
  if(errors.length)throw Error(errors.join('\n'));
  await fs.writeFile(path.join(out,'capture-manifest.json'),JSON.stringify({capturedAt:new Date().toISOString(),base,viewport:{width:390,height:818},deviceScaleFactor:4,source:'Actual running application; no DOM or CSS alterations',programs:data.programs.length,sources:data.sources,errors},null,2));
  console.log('Captured four actual screens at 1560 × 3272 pixels.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
