import fs from 'node:fs';
const base=new URL('./',import.meta.url);
let build=fs.readFileSync(new URL('build.mjs',base),'utf8');
build=build.replace('function eighty(){return 88;}','').replace('function cinquante(){return 46;}','').replace('const sixty=60;','').replaceAll('sixty()','60').replaceAll('sixty','60').replaceAll('eighty()','88').replaceAll('cinquante()','46').replaceAll('مرشح العلمي','دليل الفرع العلمي');
fs.writeFileSync(new URL('build.mjs',base),build);
const data=JSON.parse(fs.readFileSync(new URL('content.json',base),'utf8'));
data[5].script=data[5].script.replace('نبدأ بالوصول','نخطط للوصول').replace('ونقيس الاستخدام داخل تجربة محدودة','وسنقيس الاستخدام في التجربة المقترحة').replace('بينما نختبر استعداد المؤسسات للدفع مقابل خدمات إرشاد وتقارير مساندة مقترحة','وسنختبر استعداد المؤسسات للدفع مقابل أدوات للمرشد وتقارير مجمّعة عن رحلة اختيار الطلبة');
data[6].script=data[6].script.replace('المنح تساعد على تمويل البداية','ونسعى لمنح لتمويل البداية');
fs.writeFileSync(new URL('content.json',base),JSON.stringify(data,null,2));
