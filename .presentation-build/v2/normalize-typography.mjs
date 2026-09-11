import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import JSZip from 'jszip';

const dir=path.dirname(fileURLToPath(import.meta.url));
const file=path.join(dir,'draft-rtl.pptx');
const zip=await JSZip.loadAsync(await fs.readFile(file));
const decode=s=>s.replace(/&#(x[0-9a-f]+|\d+);/gi,(_,n)=>String.fromCodePoint(n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):parseInt(n,10)));
let arabicParagraphs=0;
for(const name of Object.keys(zip.files).filter(n=>/^ppt\/slides\/slide\d+\.xml$/.test(n))){
 let xml=await zip.file(name).async('string');
 xml=xml.replace(/<a:p(\s[^>]*)?>([\s\S]*?)<\/a:p>/g,(full,paragraphAttrs='',body)=>{
  const arabic=/[\u0600-\u06ff]/.test(decode(body));
  if(arabic)arabicParagraphs++;
  const spacing='<a:lnSpc><a:spcPct val="116000"/></a:lnSpc><a:spcBef><a:spcPts val="0"/></a:spcBef><a:spcAft><a:spcPts val="0"/></a:spcAft>';
  const fix=(attrs,children='')=>{
   attrs=attrs.replace(/\srtl="[^"]*"/g,'');
   children=children.replace(/<a:(lnSpc|spcBef|spcAft)\b[^>]*>[\s\S]*?<\/a:\1>/g,'');
   return `<a:pPr${attrs} rtl="${arabic?1:0}">${spacing}${children}</a:pPr>`;
  };
  if(/<a:pPr\b[^>]*\/>/.test(body))body=body.replace(/<a:pPr\b([^>]*?)\/>/,(_,attrs)=>fix(attrs));
  else if(/<a:pPr\b/.test(body))body=body.replace(/<a:pPr\b([^>]*)>([\s\S]*?)<\/a:pPr>/,(_,attrs,children)=>fix(attrs,children));
  else body=fix('')+body;
  return `<a:p${paragraphAttrs}>${body}</a:p>`;
 });
 xml=xml.replace(/<a:(rPr|defRPr)\b([^>]*?)(\/?)>/g,(_,tag,attrs,end)=>`<a:${tag}${attrs.replace(/\s(?:spc|kern)="[^"]*"/g,'')} spc="0" kern="0"${end}>`);
 zip.file(name,xml);
}
let presentationXml=await zip.file('ppt/presentation.xml').async('string');
presentationXml=presentationXml.replace(/<p:presentation\b([^>]*)>/,(_,attrs)=>`<p:presentation${attrs.replace(/\sautoCompressPictures="[^"]*"/g,'')} autoCompressPictures="0">`);
zip.file('ppt/presentation.xml',presentationXml);
await fs.writeFile(file,await zip.generateAsync({type:'nodebuffer'}));
console.log(`Typography normalized: ${arabicParagraphs} Arabic paragraphs, natural character spacing, 116% leading.`);
