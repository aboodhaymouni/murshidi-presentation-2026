import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Presentation,PresentationFile} from '@oai/artifact-tool';
import JSZip from 'jszip';

const DIR=path.dirname(fileURLToPath(import.meta.url));
const A=path.join(DIR,'assets');
const content=JSON.parse(await fs.readFile(path.join(DIR,'content.json'),'utf8'));
content[5].script=content[5].script.replace('لدينا نموذج أولي يترجم الفكرة إلى رحلة يمكن عرضها وتجربتها.','لدينا نموذج أولي ببيانات ثابتة يترجم الفكرة إلى رحلة يمكن عرضها وتجربتها.');
const pres=Presentation.create({slideSize:{width:1280,height:720}});
const C={navy:'#013070',dark:'#011F4D',gold:'#C8A04C',ink:'#102C50',muted:'#53657C',white:'#FFFFFF',paper:'#F8FAFC',pale:'#D1DEED'};
const FONT='IBM Plex Sans Arabic';
const manifest=[];
function txt(s,text,x,y,w,h,size=32,color=C.ink,bold=false,align='right'){
 const sh=s.shapes.add({name:`text-${manifest.length}-${text.slice(0,20)}`,geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 sh.text=text;
 sh.text.style={typeface:FONT,fontSize:size,color,bold,alignment:align,verticalAlignment:'middle',autoFit:'none',wrap:'square',insets:{top:0,bottom:0,left:0,right:0}};
 manifest.push({slide:pres.slides.items?.length,text,x,y,w,h,size});
 return sh;
}
async function img(s,file,x,y,w,h,alt,fit='contain',crop){
 s.images.add({blob:new Uint8Array(await fs.readFile(path.join(A,file))),contentType:'image/png',alt,fit,position:{left:x,top:y,width:w,height:h},...(crop?{crop}:{})});
}
async function base(n,title,dark=false){
 const s=pres.slides.add(); s.background.fill=dark?C.dark:C.paper;
 await img(s,'logo-original.png',1160,52,58,58,'شعار مُرشِدي الأصلي');
 txt(s,title,70,62,1060,88,49,dark?C.white:C.navy,true);
 txt(s,String(n).padStart(2,'0'),64,655,60,30,21,dark?C.pale:C.muted,false,'left');
 return s;
}
function sub(s,title,body,x,y,w=520,dark=false){
 txt(s,title,x,y,w,50,34,dark?C.gold:C.navy,true);
 txt(s,body,x,y+54,w,74,28,dark?C.pale:C.muted);
}

let s=pres.slides.add(); s.background.fill=C.dark;
await img(s,'cover-art.png',0,0,1280,720,'رسم مفاهيمي لكتاب ومسار تعليمي مضاء','cover');
await img(s,'logo-original.png',1082,62,122,122,'شعار مُرشِدي الأصلي');
txt(s,'مُرشِدي',665,205,540,128,96,C.white,true);
txt(s,'منصّة دعم القرار الأكاديمي',655,340,550,60,38,C.gold,true);
txt(s,'Vcoders',775,424,430,48,33,C.white);
txt(s,'جائزة ولي العهد لأفضل تطبيق خدمات حكومية',648,579,557,40,25,C.pale);
txt(s,'الدورة الخامسة',680,623,525,36,23,C.pale);

s=await base(2,'قرار واحد، ومعلومات متفرّقة');
txt(s,'شو أدرس؟',70,248,465,140,82,C.navy,true,'center');
txt(s,'سؤال الطالب بعد التوجيهي',75,394,455,48,28,C.muted,false,'center');
const questions=[['الميول','هل يناسبني التخصّص؟'],['القبول','ما الخيارات المتاحة لمعدّلي؟'],['الكلفة','ما الذي تستطيع أسرتي تحمّله؟'],['العمل','ما فرصي بعد التخرّج؟']];
for(let i=0;i<questions.length;i++){
 txt(s,questions[i][0],1040,206+i*88,164,44,29,C.navy,true);
 txt(s,questions[i][1],580,208+i*88,420,44,29,C.muted);
}
txt(s,'الأسرة تحتاج صورة كاملة قبل الالتزام بالمسار',255,592,950,54,32,C.navy,true);

s=await base(3,'عناصر القرار في تجربة واحدة',true);
await img(s,'app-interests.png',75,198,405,406,'لقطة فعلية من اختبار الميول في النموذج الأولي','cover',{left:0,top:0,right:0,bottom:0.535});
txt(s,'لقطة فعلية من النموذج الأولي',70,611,420,36,21,C.pale,false,'center');
sub(s,'ميول الطالب','استكشاف ما يناسب اهتماماته',635,197,570,true);
sub(s,'مقارنة التخصّصات','الكلفة ومؤشرات العمل جنبًا إلى جنب',635,329,570,true);
sub(s,'عائد التعليم','تقديرات تدعم المفاضلة بين البدائل',635,461,570,true);

s=await base(4,'رحلة الطالب داخل مُرشِدي');
await img(s,'app-calculator.png',78,180,326,455,'لقطة فعلية من حاسبة عائد التعليم في النموذج الأولي','cover',{left:0,top:0,right:0,bottom:0.339});
txt(s,'لقطة فعلية من النموذج الأولي',58,641,366,35,20,C.muted,false,'center');
const steps=[['١','ملف الطالب','معدّله، ميزانيته، وميوله'],['٢','مقارنة البدائل','تخصّصات يوازن بينها بوضوح'],['٣','قرار مع الأهل','اختيار يفهم أسبابه وتكاليفه']];
steps.forEach((r,i)=>{txt(s,r[0],1110,204+i*127,90,70,61,C.gold,true); txt(s,r[1],530,207+i*127,530,48,36,C.navy,true);txt(s,r[2],480,262+i*127,580,45,28,C.muted);});
txt(s,'مثال توضيحي ببيانات ثابتة. النتائج تقديرية',475,604,715,38,23,C.muted);

s=await base(5,'المستفيدون والعملاء المحتملون',true);
txt(s,'من يستفيد؟',740,214,465,60,43,C.gold,true);
txt(s,'طلبة التوجيهي',730,304,475,60,42,C.white,true);
txt(s,'وأولياء الأمور',730,370,475,58,37,C.white);
txt(s,'من نختبر معه نموذج العمل؟',65,214,550,60,34,C.gold,true);
txt(s,'جهات حكومية معنية بالتعليم',65,310,550,56,31,C.white,true);
txt(s,'وجامعات أردنية',65,373,550,56,34,C.white);
txt(s,'الوصول المقترح للطلبة عبر المدارس والجامعات',155,552,1050,61,32,C.pale);

s=await base(6,'تميّز مُرشِدي في جمع عناصر القرار');
const vals=[['ما يضيفه مُرشِدي','عنصر القرار'],['اختبار يساعد على الاستكشاف','ميول الطالب'],['مقارنة التخصّصات والجامعات','خيارات الدراسة'],['تقدير الكلفة وعائد التعليم','القدرة المالية'],['مؤشرات تُقرأ مع بقية الخيارات','فرص العمل']];
const table=s.tables.add({rows:5,columns:2,left:80,top:197,width:1120,height:375,columnWidths:[750,370],values:vals});
table.borders.assign({fill:'#DFE6EE',width:1,style:'solid'});
for(let r=0;r<5;r++)for(let c=0;c<2;c++){
 const cell=table.getCell(r,c);cell.fill=r===0?C.navy:(r%2===1?C.white:'#EDF2F8');
 cell.text.style={typeface:FONT,fontSize:r===0?30:29,bold:r===0||c===1,color:r===0?C.white:(c===1?C.navy:C.muted),alignment:'right',verticalAlignment:'middle',insets:{right:25,left:25,top:8,bottom:8}};
}
txt(s,'تجربة عربية ملائمة للسياق الأردني',240,595,960,60,32,C.navy,true);

s=await base(7,'نموذج عمل مقترح',true);
txt(s,'مجاني',65,246,410,109,80,C.gold,true,'center');
txt(s,'للطالب',65,349,410,87,60,C.white,true,'center');
txt(s,'الخدمة الأساسية',65,451,410,44,28,C.pale,false,'center');
sub(s,'عقود حكومية','خدمات إرشاد وتقارير للجهات المعنية',590,195,615,true);
sub(s,'عقود جامعات وشراكات تعليمية','خدمات مؤسسية تدعم رحلة الطالب',555,336,650,true);
txt(s,'المنح لتمويل التطوير والتجربة الأولى',430,508,775,46,29,C.pale);
txt(s,'مبدأ مقترح: الدفع لا يغيّر ترتيب التوصيات',340,591,865,52,29,C.gold,true);

s=await base(8,'الأثر المتوقع وكيف نقيسه');
txt(s,'القيمة التي نستهدفها',675,205,525,65,39,C.navy,true);
sub(s,'للطالب والأسرة','خيارات أوضح وحوار أفضل حول القرار',650,300,550);
sub(s,'للمؤسسات التعليمية','إرشاد أقرب لاحتياجات الطلبة',650,438,550);
txt(s,'في تجربة محدودة مقترحة',65,205,520,65,36,C.navy,true);
['وضوح القرار قبل الاستخدام وبعده','إكمال المقارنة بين التخصّصات','رضا الطلبة وأولياء الأمور'].forEach((v,i)=>txt(s,v,65,315+i*92,520,66,29,C.muted));
txt(s,'نقيس أولًا، ثم نوسّع التجربة وفق النتائج',190,604,1010,51,31,C.navy,true);

s=await base(9,'Vcoders',true);
const team=[
 {x:862,name:'عبد الرحمن\nالهيموني',role:'قيادة الفريق',body:'منطق التطبيق والبيانات\nوالاختبار'},
 {x:463,name:'عبد الرحمن\nالكردي',role:'تجربة المستخدم',body:'الهوية البصرية\nوتنظيم رحلة الطالب'},
 {x:64,name:'زيد\nأبو الشعر',role:'تنفيذ الواجهات',body:'تحويل التصاميم\nإلى تجربة قابلة للاستخدام'}
];
for(const t of team){txt(s,t.name,t.x,218,340,113,37,C.white,true,'center');txt(s,t.role,t.x,358,340,52,30,C.gold,true,'center');txt(s,t.body,t.x,428,340,112,27,C.pale,false,'center');}
txt(s,'أدوار متكاملة لبناء مُرشِدي وتطويره',205,594,1000,56,32,C.white,true);

s=pres.slides.add();s.background.fill=C.dark;
await img(s,'cover-art.png',0,0,1280,720,'رسم مفاهيمي لمسار تعليمي','cover');
await img(s,'logo-original.png',1114,57,94,94,'شعار مُرشِدي الأصلي');
txt(s,'خطوتنا القادمة',635,211,570,80,54,C.gold,true);
txt(s,'تجربة مع\nمؤسسات تعليمية',625,308,580,151,56,C.white,true);
txt(s,'شركاء للتجربة وتوجيه لنموذج العمل',555,483,650,60,31,C.pale);
txt(s,'مُرشِدي، قرار أوضح لمستقبل الطالب',539,600,666,62,32,C.white,true);

const titles=['مُرشِدي','قرار واحد، ومعلومات متفرّقة','عناصر القرار في تجربة واحدة','رحلة الطالب داخل مُرشِدي','المستفيدون والعملاء المحتملون','تميّز مُرشِدي في جمع عناصر القرار','نموذج عمل مقترح','الأثر المتوقع وكيف نقيسه','فريق Vcoders','خطوتنا القادمة'];
let elapsed=0;
const stamp=n=>`${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`;
for(let i=0;i<10;i++){
 const c=content[i];c.title=titles[i];c.start=stamp(elapsed);elapsed+=c.seconds;c.end=stamp(elapsed);
 const note=`${c.start} إلى ${c.end} (${c.seconds} ثانية)\n\n${c.script.replaceAll('؛','،')}\n\nمصادر المحتوى: ${c.source}\n${[0,9].includes(i)?'الصورة الافتتاحية: رسم مفاهيمي مولد. الشعار الأصلي من حزمة التسليم.':''}${[2,3].includes(i)?'لقطة فعلية من واجهات النسخة المرفقة في حزمة التسليم.':''}`;
 pres.slides.items[i].speakerNotes.textFrame.setText(note);
}
await fs.writeFile(path.join(DIR,'content-final.json'),JSON.stringify(content,null,2));
await (await PresentationFile.exportPptx(pres)).save(path.join(DIR,'draft-raw.pptx'));
// Set Arabic paragraph direction and complex-script font explicitly for Office.
const zip=await JSZip.loadAsync(await fs.readFile(path.join(DIR,'draft-raw.pptx')));
for(const name of Object.keys(zip.files).filter(n=>/^ppt\/(slides\/slide\d+|notesSlides\/notesSlide\d+)\.xml$/.test(n))){
 let xml=await zip.file(name).async('string');
 xml=xml.replace(/<p:(sld|notes)\s/, '<p:$1 xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" ');
 xml=xml.replace(/<a:p>([\s\S]*?)<\/a:p>/g,(full,body)=>{
  if(!/[\u0600-\u06ff]/.test(body))return full;
  if(/<a:pPr\b/.test(body))body=body.replace(/<a:pPr\b([^>]*?)(\/?)>/,(all,attrs,end)=>'<a:pPr'+attrs.replace(/\srtl="[^"]*"/g,'')+' rtl="1"'+end+'>');
  else body='<a:pPr rtl="1"/>'+body;
  return '<a:p>'+body+'</a:p>';
 });
 xml=xml.replace(/<a:(rPr|defRPr)([^>]*?)>([\s\S]*?)<\/a:\1>/g,(all,tag,attrs,body)=>{
  if(!body.includes('<a:cs '))body+=`<a:cs typeface="${FONT}"/>`;
  return `<a:${tag}${attrs.replace(/\slang="[^"]*"/g,'')} lang="ar-JO">${body}</a:${tag}>`;
 });
 if(name==='ppt/slides/slide3.xml')xml=xml.replace(/<a:srcRect[^>]*\/>/g,'<a:srcRect l="0" t="0" r="0" b="53500"/>');
 if(name==='ppt/slides/slide4.xml')xml=xml.replace(/<a:srcRect[^>]*\/>/g,'<a:srcRect l="0" t="0" r="0" b="33900"/>');
 xml=xml.replace(/<a:ln([LRTB])\b[^>]*>[\s\S]*?<\/a:ln\1>/g,'<a:ln$1 w="6350"><a:solidFill><a:srgbClr val="DFE6EE"/></a:solidFill></a:ln$1>');
 zip.file(name,xml);
}
await fs.writeFile(path.join(DIR,'draft-rtl.pptx'),await zip.generateAsync({type:'nodebuffer'}));
await fs.writeFile(path.join(DIR,'layout-manifest.json'),JSON.stringify(manifest,null,2));
console.log('Authored 10 slides, 420 seconds.');
