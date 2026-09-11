import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';

const build=path.dirname(fileURLToPath(import.meta.url));
const workspace=path.dirname(path.dirname(build));
const out=path.join(workspace,'output/ready-to-submit');
const data=JSON.parse(await fs.readFile(path.join(build,'content-final.json'),'utf8'));
const regular=(await fs.readFile(path.join(build,'../fonts/IBMPlexSansArabic-Regular.ttf'))).toString('base64');
const bold=(await fs.readFile(path.join(build,'../fonts/IBMPlexSansArabic-Bold.ttf'))).toString('base64');
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const pages=Math.ceil(data.length/2);
const html=`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><title>مُرشِدي: نص الإلقاء لمدة 7 دقائق</title><style>
@font-face{font-family:Plex;src:url(data:font/ttf;base64,${regular})} @font-face{font-family:Plex;src:url(data:font/ttf;base64,${bold});font-weight:700}
@page{size:A4;margin:16mm 18mm}*{box-sizing:border-box}body{font-family:Plex,sans-serif;color:#102C50;margin:0;font-size:13.5pt;line-height:1.72}h1{font-size:23pt;line-height:1.35;margin:0 0 4mm}h2{font-size:17pt;line-height:1.45;margin:0 0 2mm}header{border-bottom:2px solid #C8A04C;padding-bottom:5mm;margin-bottom:6mm}.meta{font-size:10.5pt;color:#53657C}.timing{color:#866627;font-size:11.5pt;font-weight:700;direction:ltr;text-align:right;margin-bottom:2mm}section{margin-top:5mm;break-inside:avoid}p{margin:0;text-align:right}article{break-after:page;padding-top:8mm}article:last-child{break-after:auto}footer{font-size:9.5pt;color:#53657C;margin-top:5mm}.num{color:#C8A04C;font-weight:700}bdi{direction:ltr}
</style></head><body>${Array.from({length:pages},(_,p)=>`<article><header><h1>مُرشِدي: نص الإلقاء</h1><div class="meta">فريق <bdi>Vcoders</bdi>، عرض لجنة التقييم الابتكاري والريادي</div>${p===0?'<div class="meta">المدة 7 دقائق بالضبط. انتقال الشرائح يدوي وفق التوقيت.</div><div class="meta">الأرقام المالية المعلّمة «فرضية» ليست عقودًا أو مبيعات محققة.</div>':''}</header>${data.slice(p*2,p*2+2).map(c=>`<section><h2><span class="num">${c.id}.</span> ${esc(c.title)}</h2><div class="timing">${c.start} – ${c.end} &nbsp; (${c.seconds} ثانية)</div><p>${esc(c.script.replaceAll('؛','،'))}</p></section>`).join('')}<footer><bdi>${p+1} / ${pages}</bdi> &nbsp; · &nbsp; نص التدريب، وليس ضمن شرائح العرض للحكّام</footer></article>`).join('')}</body></html>`;
await fs.mkdir(out,{recursive:true});
await fs.writeFile(path.join(build,'rehearsal.html'),html);
await fs.writeFile(path.join(out,'Murshidi-Vcoders-Speaker-Script-7min.md'),'# مُرشِدي: نص الإلقاء أمام الحكّام\n\nالمدة: 7 دقائق بالضبط. فريق Vcoders.\n\n'+data.map(c=>`## ${c.id}. ${c.title}\n\n${c.start} إلى ${c.end} (${c.seconds} ثانية)\n\n${c.script.replaceAll('؛','،')}\n\n**مرجع المتحدث:** ${c.source}\n`).join('\n'));
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
 const page=await browser.newPage();await page.setContent(html,{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);
 await page.pdf({path:path.join(out,'Murshidi-Vcoders-Speaker-Script-7min.pdf'),printBackground:true,preferCSSPageSize:true});
}finally{await browser.close();}
console.log(`Speaker script exported: ${data.length} slides, ${pages} pages, ${data.reduce((s,c)=>s+c.seconds,0)} seconds.`);
