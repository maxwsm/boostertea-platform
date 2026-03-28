const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('@/')) {
        content = content.replace(/@\//g, '@myth/');
        fs.writeFileSync(fullPath, content);
        console.log('Updated: ' + fullPath);
      }
    }
  }
}

replaceInDir('/Users/maks/Library/Mobile Documents/com~apple~CloudDocs/ANTI 001/wsm-ecosystem/apps/boostertea-web/src/web/mythbusters');
console.log('All @/ paths replaced with @myth/');
