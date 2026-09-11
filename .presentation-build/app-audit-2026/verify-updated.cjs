const { chromium } = require('C:/Users/Abdalrahman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const base='http://127.0.0.1:5182/#/';
(async()=>{
  const browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:375,height:812},deviceScaleFactor:2});
  const errors=[], results=[], requests=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(['xhr','fetch'].includes(r.resourceType()))requests.push(r.url());});
  async function go(route){await page.goto(base+route,{waitUntil:'domcontentloaded'});await page.locator('main').waitFor();await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(100);}
  await go('home');
  for(const width of [375,768,1440]){
    await page.setViewportSize({width,height:width===1440?900:812});
    for(const route of ['', 'home','market','chat','future','stories','scholarships','alternatives','profile','personality']){
      await go(route);
      const state=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,title:document.querySelector('h1')?.textContent,text:document.querySelector('main').innerText,dir:document.documentElement.dir,small:[...document.querySelectorAll('button,input,select')].map(e=>({text:e.textContent.trim()||e.getAttribute('aria-label')||e.id,w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height})).filter(e=>e.w<43.9||e.h<43.9)}));
      assert.ok(state.scrollWidth<=width,`Overflow ${route} ${width}`);
      assert.ok(!state.text.includes('قاعدة بيانات شهادات حقيقيّة'),`Unsupported testimonials ${route}`);
      assert.ok(!state.text.includes('مدرّب على'),`Unsupported trained AI ${route}`);
      results.push({route:route||'splash',...state});
      if(width===375)await page.screenshot({path:path.join(__dirname,`updated-${route||'splash'}-375.png`),fullPage:true});
    }
  }
  await page.setViewportSize({width:375,height:812});
  await go('chat');
  await page.getByLabel('ابحث في الدليل').fill('الطّب');
  assert.equal(await page.locator('article').count(),1);
  assert.ok((await page.locator('article').innerText()).includes('أهلية التقديم'));
  await page.getByLabel('ابحث في الدليل').fill('zzzzzz');
  await page.getByRole('button',{name:'عرض جميع الأسئلة'}).click();
  assert.equal(await page.locator('article').count(),6);
  await go('stories');
  await page.getByRole('button',{name:'الكلفة',exact:true}).first().click();
  assert.equal(await page.locator('article').count(),1);
  await page.getByRole('button',{name:'قارن الكلفة',exact:true}).click();
  assert.ok(page.url().endsWith('/roi'));
  await go('scholarships');
  const grantLinks=await page.locator('main a').evaluateAll(es=>es.map(e=>e.href));
  assert.deepEqual(grantLinks,['https://www.dsamohe.gov.jo/','https://dsamohe.gov.jo/external2026/']);
  await go('alternatives');
  assert.equal(await page.locator('main a').count(),2);
  await go('profile');
  await page.getByLabel('الاسم المفضل (اختياري)').fill('طالب التجربة');
  await page.getByRole('button',{name:'حفظ على هذا الجهاز'}).click();
  await page.getByRole('status').filter({hasText:'حُفظ ملفك'}).waitFor();
  await page.reload();
  assert.equal(await page.getByLabel('الاسم المفضل (اختياري)').inputValue(),'طالب التجربة');
  await page.getByRole('button',{name:'English',exact:true}).click();
  assert.equal(await page.locator('html').getAttribute('dir'),'ltr');
  for(const route of ['home','market','chat','future','stories','scholarships','alternatives','profile','personality']){
    await go(route);
    assert.equal(await page.locator('html').getAttribute('lang'),'en');
    const heading=await page.locator('h1').first().innerText();
    assert.ok(!/[\u0600-\u06ff]/.test(heading),`Arabic page heading in English ${route}`);
  }
  await go('personality');
  for(let i=0;i<6;i++)await page.getByRole('button',{name:'It does not interest me right now',exact:true}).click();
  await page.getByRole('heading',{name:'It is fine to still be exploring.'}).waitFor();
  assert.equal(await page.getByText('Examples to start exploring',{exact:true}).count(),0);
  await page.getByRole('button',{name:'Restart the exercise'}).click();
  for(let i=0;i<6;i++)await page.getByRole('button',{name:'I enjoy it',exact:true}).click();
  await page.getByRole('heading',{name:'Examples to start exploring'}).waitFor();
  await go('profile');
  await page.getByRole('button',{name:'العربية',exact:true}).click();
  await page.evaluate(()=>localStorage.removeItem('murshidi.profile'));
  for(const route of ['home','market','scholarships','chat']){
    await go(route);await page.screenshot({path:path.join(__dirname,`updated-${route}-phone.png`)});
  }
  assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(__dirname,'updated-audit.json'),JSON.stringify({results,errors,requests,grantLinks,checks:'passed'},null,2));
  console.log(JSON.stringify({routes:results.length,errors,smallControls:results.filter(r=>r.width===375).map(r=>({route:r.route,small:r.small})),checks:'Search, empty search, cases filter, case navigation, official links, local profile persistence, English pages, interests zero/positive states all passed.'},null,2));
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
