import fs from 'fs';
const file = '/Users/ANTI 001/ICLOUD_RESCUE/Desktop_Projects/wsm-ecosystem/apps/boostertea-web/src/web/lib/blog/getBlogPosts.ts';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/\.webp/g, '.png');
fs.writeFileSync(file, content);
console.log('updated getBlogPosts.ts');
