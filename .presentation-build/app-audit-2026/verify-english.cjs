const {chromium}=require('C:/Users/Abdalrahman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('assert/strict');
const fs=require('fs');
const path=require('path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const context=await browser.newContext({viewport:{width:375,height:812},deviceScaleFactor:2});
 await context.addInitScript(()=>localStorage.setItem('murshidi.lang','en'));
 const page=await context.newPage();
 const results=[];
 for(const width of [375,768,1440]){
  await page.setViewportSize({width,height:812});
  for(const route of ['', 'home','market','chat','future','stories','scholarships','alternatives','profile','personality']){
   await page.goto('http://127.0.0.1:5182/#/'+route,{waitUntil:'domcontentloaded'});
   await page.locator('main').waitFor();
   await page.evaluate(()=>document.fonts.ready);
   const dims=await page.evaluate(()=>({width:innerWidth,doc:document.documentElement.scrollWidth,lang:document.documentElement.lang,dir:document.documentElement.dir}));
   assert.equal(dims.lang,'en');assert.equal(dims.dir,'ltr');assert.ok(dims.doc<=width);
   results.push({route:route||'splash',...dims});
   if(width===375&&['home','profile','personality'].includes(route))await page.screenshot({path:path.join(__dirname,'english-'+route+'-375.png')});
  }
 }
 fs.writeFileSync(path.join(__dirname,'english-audit.json'),JSON.stringify(results,null,2));
 console.log('30 English viewport checks passed.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
