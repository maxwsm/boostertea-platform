const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/engine/models/CoreSphere');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

files.forEach(f => {
  const p = path.join(dir, f);
  let content = fs.readFileSync(p, 'utf8');
  if (content.includes('15000')) {
    content = content.replace(/sphToCart\(([^,]+),\s*([^,]+),\s*([^,]+),\s*15000\)/g, "sphToCart($1, $2, $3)");
    fs.writeFileSync(p, content);
    console.log('Fixed', f);
  }
});
console.log('CoreSphere fixes applied.');
