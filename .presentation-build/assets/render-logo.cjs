const fs = require('fs');
const sharp = require('C:/Users/Abdalrahman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
(async () => {
  let svg = fs.readFileSync('pdf-source/logo.svg', 'utf8');
  let count = 0;
  svg = svg.replace(/<path fill="#00000[01]"[\s\S]*?\/>/g, () => { count++; return ''; });
  if (count !== 4) throw Error('Expected exactly four corner background paths');
  await sharp(Buffer.from(svg)).resize(1000, 1000).png().toFile('.presentation-build/assets/logo-original.png');
  const { data, info } = await sharp('.presentation-build/assets/logo-original.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const px = (x, y) => Array.from(data.subarray((y*info.width+x)*4, (y*info.width+x)*4+4));
  console.log(JSON.stringify({removedBackgroundPaths:count,width:info.width,height:info.height,corners:[px(0,0),px(999,0),px(0,999),px(999,999)]}));
})();
