const fs = require('fs');
const path = require('path');

function prependUseClient(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      prependUseClient(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (!content.includes('"use client"')) {
        content = '"use client";\n' + content;
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

prependUseClient('/Users/maks/Library/Mobile Documents/com~apple~CloudDocs/ANTI 001/wsm-ecosystem/apps/boostertea-web/src/web/mythbusters');
console.log('Prepended "use client" to all TS/TSX files.');
