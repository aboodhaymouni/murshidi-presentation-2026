import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Presentation,PresentationFile} from '@oai/artifact-tool';
import JSZip from 'jszip';

const DIR=path.dirname(fileURLToPath(import.meta.url)), A=path.join(DIR,'../assets');
const content=JSON.parse(await fs.readFile(path.join(DIR,'content.json'),'utf8'));
const pres=Presentation.create({slideSize:{width:1280,height:720}});
const C={navy:'#013070',dark:'#011F4D',gold:'#C8A04C',ink:'#102C50',muted:'#53657C',white:'#FFFFFF',paper:'#F8FAFC',pale:'#D1DEED',soft:'#EEF3F8'};
const FONT='IBM Plex Sans Arabic';

function txt(s,text,x,y,w,h,size=32,color=C.ink,bold=false,align='right'){
 if(typeof size!=='number')throw new Error('Invalid text size: '+text);
 const safeHeight=Math.max(h,size*1.4*text.split('\n').length+6);
 y-=(safeHeight-h)/2;h=safeHeight;
 const sh=s.shapes.add({name:text.slice(0,45),geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 sh.text=text;
 sh.text.style={typeface:FONT,fontSize:size,color,bold,alignment:align,verticalAlignment:'middle',lineSpacing:1.14,autoFit:'none',wrap:'square',insets:{top:3,bottom:3,left:4,right:4}};
 return sh;
}
async function img(s,file,x,y,w,h,alt,fit='contain'){s.images.add({blob:new Uint8Array(await fs.readFile(file)),contentType:'image/png',alt,fit,position:{left:x,top:y,width:w,height:h}});}
async function base(n,title,dark=false,titleSize=44,titleY=50){
 const s=pres.slides.add();s.background.fill=dark?C.dark:C.paper;
 await img(s,path.join(A,'logo-original.png'),1168,42,58,58,'شعار مُرشِدي الأصلي');
 txt(s,title,60,titleY,1080,94,titleSize,dark?C.white:C.navy,true);
 txt(s,String(n).padStart(2,'0'),60,670,65,30,18,dark?C.pale:C.muted,false,'left');
 return s;
}
async function phone(s,screen,x=8,y=6,h=658){const k=h/1536;await img(s,path.join(DIR,'phone-composites-hd',screen+'.png'),x,y,1024*k,h,'لقطة فعلية عالية الدقة من مُرشِدي داخل إطار iPhone Pro','contain');}
function pair(s,title,body,x,y,w=700,dark=false){txt(s,title,x,y,w,54,34,dark?C.gold:C.navy,true);txt(s,body,x,y+62,w,70,28,dark?C.pale:C.muted);}
function box(s,x,y,w,h,fill=C.white,stroke='#D4DEE9',radius='roundRect'){return s.shapes.add({geometry:radius,position:{left:x,top:y,width:w,height:h},fill,line:{fill:stroke,width:1.3}});}
function label(s,text,x,y,w,dark=false){box(s,x,y,w,40,dark?'#123D76':'#E7EEF6',dark?'#58749B':'#C9D5E3');txt(s,text,x+10,y+3,w-20,31,18,dark?C.white:C.navy,true,'center');}

let s=pres.slides.add();s.background.fill=C.dark;
await img(s,path.join(A,'cover-art.png'),0,0,1280,720,'رسم مفاهيمي لكتاب ومسار تعليمي','cover');
await img(s,path.join(A,'logo-original.png'),1080,60,124,124,'شعار مُرشِدي الأصلي');
txt(s,'مُرشِدي',650,207,555,122,96,C.white,true);
txt(s,'قرار جامعي أوضح',645,337,560,66,45,C.gold,true);
txt(s,'Vcoders',765,424,440,50,34,C.white);
txt(s,'جائزة ولي العهد لأفضل تطبيق خدمات حكومية',640,581,565,42,25,C.pale);
txt(s,'الدورة الخامسة  •  2026',780,625,425,35,23,C.pale);

s=await base(2,content[1].title);
box(s,650,166,555,342,C.white,'#D4DEE9');
label(s,'لحظة الطالب',960,187,220);
txt(s,'بعد التوجيهي يريد جوابًا واضحًا:',680,238,495,48,29,C.navy,true);
const questions=[['يناسبني؟','الميول والاهتمامات'],['أستطيع التقديم؟','الشروط والقبول'],['تستطيع أسرتي تحمّله؟','الرسوم والكلفة']];
questions.forEach((q,i)=>{const y=298+i*66;box(s,681,y,494,54,i===0?'#F3EAD7':C.soft,i===0?'#DFC98F':'#D4DEE9');txt(s,q[0],930,y+6,225,39,23,C.navy,true);txt(s,q[1],701,y+6,220,39,20,C.muted,false,'left');});
box(s,60,166,535,157,C.white,'#D4DEE9');
txt(s,'116,366',85,184,485,70,57,C.navy,true,'center');
txt(s,'ناجحًا في التوجيهي 2026',85,257,485,43,24,C.muted,true,'center');
box(s,60,340,535,168,'#F3EAD7','#DFC98F');
txt(s,'607',85,357,485,82,70,C.gold,true,'center');
txt(s,'تخصصًا مطروحًا لمرحلة البكالوريوس',85,434,485,52,23,C.navy,true,'center');
box(s,70,536,1135,70,C.navy,C.navy);txt(s,'المشكلة: القبول والرسوم والكلفة والسوق لا تجتمع حول الطالب في قرار واحد',92,546,1091,50,26,C.white,true,'center');
txt(s,'المصدر: وزارة التربية والتعليم • وحدة تنسيق القبول الموحد، آب 2026',80,627,1120,30,18,C.muted,false,'center');

s=await base(3,content[2].title,true,42);await phone(s,'home');
label(s,'تطبيق جاهز للاستخدام',830,145,375,true);
pair(s,'1  اكتشف نقطة البداية','أسئلة استكشاف ذاتي تبني قائمة أولية',475,205,730,true);
pair(s,'2  قارن ما يهم القرار','قبول ورسوم وكلفة، ثم مؤشرات سوق عامة',475,333,730,true);
pair(s,'3  ابنِ قائمة مبرّرة','خيارات قصيرة وخطة كلفة وبيانات مؤرخة',475,461,730,true);
box(s,475,583,730,65,'#F3EAD7','#DFC98F');txt(s,'النتيجة: قرار يناقشه الطالب مع أسرته والمرشد',495,590,690,49,25,C.navy,true,'center');

s=await base(4,content[3].title);await phone(s,'compare');
txt(s,'مقارنة واحدة، ثلاثة أسئلة دقيقة',465,160,740,52,33,C.navy,true);
const compareRows=[
 ['شرط التقديم','هل يحق لي التقديم؟'],
 ['حد تنافسي سابق','مرجع تاريخي، وليس وعد قبول'],
 ['رسم رسمي','كم تدفع الأسرة؟ ومن أي سنة؟']
];
compareRows.forEach((r,i)=>{const y=231+i*103;box(s,475,y,730,82,i===1?'#F3EAD7':C.white,i===1?'#DFC98F':'#D4DEE9');txt(s,r[0],906,y+10,270,55,25,C.navy,true);txt(s,r[1],500,y+10,388,55,23,C.muted,false,'left');});
box(s,475,557,730,67,C.navy,C.navy);txt(s,'قائمة قصيرة يمكن تفسيرها والدفاع عنها',500,565,680,50,27,C.white,true,'center');
txt(s,'دليل 2026/2027 • الحدود السابقة معروضة بسنتها • تحقق 10 أيلول 2026',475,635,730,28,18,C.muted,false,'center');

s=await base(5,content[4].title,true);await phone(s,'roi-result');
label(s,'مثال قابل للتعديل',992,153,213,true);
txt(s,'3,051',475,196,730,108,88,C.white,true);
txt(s,'دينارًا سنويًا في هذا المثال',465,304,740,58,38,C.gold,true);
box(s,475,385,730,108,'#123D76','#58749B');
txt(s,'47 د.أ للساعة',850,397,325,43,29,C.white,true);
txt(s,'رقم رسمي',850,441,325,31,19,C.pale);
txt(s,'الساعات والمعيشة السنوية',500,397,325,43,25,C.white,true,'left');
txt(s,'افتراضات الأسرة',500,441,325,31,19,C.pale,false,'left');
txt(s,'تغيير الميزانية يغيّر فجوة التمويل فورًا',465,526,740,57,34,C.gold,true);
txt(s,'مثال علم الحاسوب، الجامعة الأردنية • لا توقع دخل أو عائد مضمون',465,624,740,33,20,C.pale);

s=await base(6,content[5].title,true,42);
const sourceCards=[
 {x:855,title:'القبول الموحد',body:'برامج وشروط\nبلا ميزانية أسرة'},
 {x:455,title:'مواقع الجامعات',body:'رسوم منفصلة\nبلا مقارنة موحّدة'},
 {x:55,title:'إحصاءات العمل',body:'مؤشرات سوق\nبلا ربط بخيار الطالب'}
];
for(const c of sourceCards){box(s,c.x,178,350,142,C.white,'#D4DEE9');txt(s,c.title,c.x+20,193,310,44,27,C.navy,true,'center');txt(s,c.body,c.x+22,241,306,61,21,C.muted,false,'center');txt(s,'↓',c.x+143,323,64,34,25,C.gold,true,'center');}
box(s,160,363,1045,104,'#F3EAD7','#DFC98F');txt(s,'مُرشِدي يضيف سياق الطالب',190,374,985,42,31,C.navy,true,'center');txt(s,'اهتمامات الطالب، ميزانية الأسرة، مقارنة موحّدة، ومصدر مؤرّخ',190,418,985,34,22,C.muted,false,'center');
box(s,160,487,1045,67,'#123D76','#58749B');txt(s,'النتيجة: قائمة قصيرة مع سبب واضح لكل اختيار',190,496,985,49,27,C.white,true,'center');
box(s,160,575,1045,66,'#0A2D61','#58749B');
txt(s,'الاستراتيجية الوطنية للإرشاد المهني والوظيفي، 2024 إلى 2033',182,579,1001,34,21,C.pale,true,'center');
txt(s,'المصدر: وكالة الأنباء الأردنية (بترا) • 16 تموز 2024',182,611,1001,23,16,C.pale,false,'center');
await img(s,path.join(A,'logo-original.png'),1168,42,58,58,'شعار مُرشِدي الأصلي');

s=await base(7,content[6].title);
const audiences=[
 {x:855,tag:'المستفيد',title:'الطالب والأسرة',body:'رحلة القرار الأساسية\nمجانية',foot:'قرار أوضح بلا تكلفة على الطالب',kind:'gold'},
 {x:455,tag:'عميل نختبره',title:'مدرسة أو جامعة',body:'عرض مؤسسي مقترح\nأدوات + تقارير + دعم',foot:'نختبر استعداد الدفع في التجربة',kind:'navy'},
 {x:55,tag:'شريك تمكين مستهدف',title:'جهة تعليمية عامة',body:'وصول للبيانات والمدارس\nوقياس أثر أوسع',foot:'خدمة وطنية مبنية على دليل',kind:'plain'}
];
for(const a of audiences){const fill=a.kind==='gold'?'#F3EAD7':a.kind==='navy'?C.navy:C.white;const stroke=a.kind==='gold'?'#DFC98F':a.kind==='navy'?C.navy:'#D4DEE9';const fg=a.kind==='navy'?C.white:C.navy;box(s,a.x,187,350,378,fill,stroke);label(s,a.tag,a.x+75,209,200,a.kind==='navy');txt(s,a.title,a.x+20,276,310,59,31,fg,true,'center');txt(s,a.body,a.x+25,350,300,91,25,a.kind==='navy'?C.pale:C.ink,true,'center');txt(s,a.foot,a.x+24,478,302,49,19,a.kind==='navy'?C.pale:C.muted,false,'center');}
box(s,145,594,1060,58,C.navy,C.navy);txt(s,'المستفيد يستخدم  ←  نختبر دفع المؤسسة  ←  الجهة العامة تمكّن التوسع',165,601,1020,43,24,C.white,true,'center');

s=await base(8,content[7].title,true);
const revenue=[
 {x:855,tag:'الطالب والأسرة',price:'مجاني',body:'رحلة القرار الأساسية',foot:'بلا تكلفة على المستفيد',kind:'plain'},
 {x:455,tag:'المؤسسة التعليمية',price:'20 دينارًا',body:'لكل مقعد طالب ممول سنويًا',foot:'عرض مقترح: أدوات + تقارير + تدريب',kind:'gold'},
 {x:55,tag:'جهة تعليمية عامة',price:'عقد سنوي',body:'بحسب نطاق الخدمة',foot:'بيانات + دعم + قياس أثر',kind:'plain'}
];
for(const r of revenue){const fill=r.kind==='gold'?'#F3EAD7':C.white;const stroke=r.kind==='gold'?'#DFC98F':'#58749B';box(s,r.x,181,350,316,fill,stroke);label(s,r.tag,r.x+55,204,240,false);txt(s,r.price,r.x+20,264,310,86,r.price.includes('20')?54:43,r.kind==='gold'?C.gold:C.navy,true,'center');txt(s,r.body,r.x+25,355,300,47,24,C.ink,true,'center');txt(s,r.foot,r.x+25,421,300,49,20,C.muted,false,'center');}
box(s,160,522,1045,78,'#123D76','#58749B');txt(s,'1,950 مقعد طالب ممول',625,528,550,54,34,C.white,true);txt(s,'نقطة تعادل مفترضة',190,531,400,48,25,C.gold,true,'left');
txt(s,'فرضيات للاختبار وليست مبيعات: السعر، الكلفة، والتعادل تتغير بنتائج التجربة',160,620,1045,29,19,C.pale,false,'center');

s=await base(9,content[8].title,false,42);
label(s,'100 طالب، 3 مدارس، 6 أسابيع',492,151,295,false);
const impactSteps=[
 {x:855,tag:'1  قبل الاستخدام',title:'خط أساس لكل طالب',body:'مقارنة 3 تخصصات\nالوقت + 6 أسئلة\nوضوح القرار من 5'},
 {x:455,tag:'2  استخدام مُرشِدي',title:'رحلة فعلية موثقة',body:'استكشاف ومقارنة\nخطة كلفة\nحفظ المصادر والسنة'},
 {x:55,tag:'3  بعد الاستخدام',title:'نكرر القياس نفسه',body:'المهمة نفسها\nالأسئلة نفسها\nومقياس الوضوح نفسه'}
];
for(const step of impactSteps){box(s,step.x,211,350,195,C.white,'#D4DEE9');label(s,step.tag,step.x+55,226,240,false);txt(s,step.title,step.x+20,279,310,44,25,C.navy,true,'center');txt(s,step.body,step.x+30,326,290,72,19,C.muted,false,'center');}
box(s,160,427,1045,56,C.navy,C.navy);txt(s,'نقارن كل طالب بنفسه، ثم نعلن عدد الطلبة الذين تحسّنوا',180,434,1005,42,24,C.white,true,'center');
const gates=[['70 طالبًا','يكملون مقارنة موثقة',835],['60 طالبًا','يحسّنون إجابة واحدة من 6',455],['60 طالبًا','يرفعون وضوح القرار نقطة',75]];
for(const [value,name,x] of gates){box(s,x,510,340,105,C.white,'#D4DEE9');txt(s,value,x+15,520,310,43,30,C.navy,true,'center');txt(s,name,x+18,563,304,40,18,C.muted,false,'center');}
txt(s,'أهداف محددة مسبقًا، وليست نتائج محققة. نعدّل التجربة قبل أي توسع إذا لم تتحقق.',120,637,1085,28,18,C.muted,false,'center');

s=await base(10,content[9].title,true,42);
const stages=[
 {x:855,when:'اليوم',title:'تطبيق جاهز للاستخدام',body:'بيانات 2026 موثقة\nوشاشات حقيقية'},
 {x:455,when:'خلال 90 يومًا',title:'تجربة وقياس',body:'استخدام فعلي\nتقرير أثر\nواختبار استعداد الدفع'},
 {x:55,when:'خلال 12 شهرًا',title:'تعادل مفترض',body:'13 مؤسسة\n1,950 مقعدًا ممولًا\n+ 300 طالب تجارب مجانية'}
];
for(const st of stages){box(s,st.x,181,350,318,'#123D76','#58749B');label(s,st.when,st.x+70,202,210,true);txt(s,st.title,st.x+20,264,310,55,30,C.gold,true,'center');txt(s,st.body,st.x+25,337,300,126,24,C.white,true,'center');}
box(s,145,536,1060,83,'#F3EAD7','#DFC98F');txt(s,'طلبنا من اللجنة',950,548,225,48,24,C.navy,true);txt(s,'3 مدارس ومرشدون  +  قناة بيانات تعليمية  +  تقرير أثر',180,548,735,48,25,C.navy,true,'left');
txt(s,'الإيراد يمول تحديث البيانات ودعم المرشد وقياس الأثر',145,635,1060,30,19,C.pale,false,'center');

s=await base(11,content[10].title,false,40);
const team=[
 {x:864,name:'عبد الرحمن\nالهيموني',role:'قيادة الفريق',body:'منطق التطبيق والبيانات\nوالاختبار'},
 {x:465,name:'عبد الرحمن\nالكردي',role:'تجربة المستخدم',body:'الهوية البصرية\nوتنظيم رحلة الطالب'},
 {x:60,name:'زيد\nأبو الشعر',role:'تنفيذ الواجهات',body:'تحويل التصميم\nإلى تجربة قابلة للاستخدام'}
];
for(const t of team){txt(s,t.name,t.x,210,340,116,37,C.navy,true,'center');txt(s,t.role,t.x,354,340,53,29,C.gold,true,'center');txt(s,t.body,t.x,426,340,111,26,C.muted,false,'center');}
box(s,145,586,1060,72,'#F3EAD7','#DFC98F');
txt(s,'مراجعة مشتركة',160,599,190,44,22,C.navy,true,'center');txt(s,'←',365,599,50,44,25,C.gold,true,'center');
txt(s,'واجهة عاملة',430,599,200,44,22,C.navy,true,'center');txt(s,'←',645,599,50,44,25,C.gold,true,'center');
txt(s,'رحلة مفهومة',710,599,200,44,22,C.navy,true,'center');txt(s,'←',925,599,50,44,25,C.gold,true,'center');
txt(s,'بيانات صحيحة',990,599,190,44,22,C.navy,true,'center');

s=pres.slides.add();s.background.fill=C.dark;
await img(s,path.join(A,'cover-art.png'),0,0,1280,720,'رسم مفاهيمي لمسار تعليمي','cover');
await img(s,path.join(A,'logo-original.png'),1087,58,118,118,'شعار مُرشِدي الأصلي');
txt(s,'قبل أن يلتزم الطالب لسنوات،',585,181,620,61,39,C.gold,true);
txt(s,'يرى الملاءمة والقبول والكلفة والسوق\nفي قرار واحد يمكن تفسيره.',515,252,690,154,51,C.white,true);
box(s,665,454,540,66,'#F3EAD7','#DFC98F');txt(s,'هل نبدأ التجربة؟',685,462,500,49,30,C.navy,true,'center');
txt(s,'مُرشِدي  •  Vcoders',720,566,485,50,30,C.pale,true);
txt(s,'شكرًا لكم',930,625,275,36,23,C.white);

let elapsed=0;const stamp=n=>`${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`;
for(let i=0;i<content.length;i++){
 const c=content[i];c.start=stamp(elapsed);elapsed+=c.seconds;c.end=stamp(elapsed);
 pres.slides.items[i].speakerNotes.textFrame.setText(`${c.start} إلى ${c.end} (${c.seconds} ثانية)\n\n${c.script}\n\nالمصادر: ${c.source}\n${[2,3,4].includes(i)?'صورة شاشة حقيقية من النسخة المحلية المحدثة؛ إطار الهاتف فقط صورة توضيحية مولدة.':''}`);
}
if(elapsed!==410)throw new Error(`Timing mismatch: ${elapsed}`);
await fs.writeFile(path.join(DIR,'content-final.json'),JSON.stringify(content,null,2));
await(await PresentationFile.exportPptx(pres)).save(path.join(DIR,'draft-raw.pptx'));
const zip=await JSZip.loadAsync(await fs.readFile(path.join(DIR,'draft-raw.pptx')));
for(const name of Object.keys(zip.files).filter(n=>/^ppt\/(slides\/slide\d+|notesSlides\/notesSlide\d+)\.xml$/.test(n))){
 let xml=await zip.file(name).async('string');
 xml=xml.replace(/<p:(sld|notes)\s/,'<p:$1 xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" ');
 xml=xml.replace(/<a:p>([\s\S]*?)<\/a:p>/g,(full,body)=>{if(!/[\u0600-\u06ff]/.test(body))return full;if(/<a:pPr\b/.test(body))body=body.replace(/<a:pPr\b([^>]*?)(\/?)>/,(all,attrs,end)=>'<a:pPr'+attrs.replace(/\srtl="[^"]*"/g,'')+' rtl="1"'+end+'>');else body='<a:pPr rtl="1"/>'+body;return '<a:p>'+body+'</a:p>';});
 xml=xml.replace(/<a:(rPr|defRPr)([^>]*?)>([\s\S]*?)<\/a:\1>/g,(all,tag,attrs,body)=>{if(!body.includes('<a:cs '))body+=`<a:cs typeface="${FONT}"/>`;return `<a:${tag}${attrs.replace(/\slang="[^"]*"/g,'')} lang="ar-JO">${body}</a:${tag}>`;});
 zip.file(name,xml);
}
await fs.writeFile(path.join(DIR,'draft-rtl.pptx'),await zip.generateAsync({type:'nodebuffer'}));
console.log('Authored 12 slides; 410 seconds plus a 10-second stage buffer; dedicated customer and revenue slides.');
