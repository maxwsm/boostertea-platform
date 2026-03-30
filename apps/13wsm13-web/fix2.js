const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const p = path.join(dir, file);
    const stat = fs.statSync(p);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(p));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) { 
      results.push(p);
    }
  });
  return results;
}

const allFiles = walk(path.join(__dirname, 'src/engine'));

allFiles.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  // Matching sphToCart(arg1, arg2, arg3, arg4) -> sphToCart(arg1, arg2, arg3)
  const regex = /sphToCart\(([^,()]+(?:,[^,()]+)*?)[ ]*,[ ]*([^,()]+(?:,[^,()]+)*?)[ ]*,[ ]*([^,()]+(?:,[^,()]+)*?)[ ]*,[ ]*[^,()]+[ ]*\)/g;
  
  if (content.match(regex)) {
      console.log('Replacing in', f);
      // More robust: just string process
      const lines = content.split('\n');
      for(let i=0; i<lines.length; i++){
          if(lines[i].includes('sphToCart') && lines[i].split(',').length >= 4) {
              // Quick and dirty manual split for simplicity, assuming typical use cases
              lines[i] = lines[i].replace(/sphToCart\(([^,]+),\s*([^,]+),\s*([^,]+),\s*[^)]+\)/g, "sphToCart($1, $2, $3)");
          }
      }
      content = lines.join('\n');
      fs.writeFileSync(f, content);
  }
});
console.log('Global sphToCart replacements done.');
