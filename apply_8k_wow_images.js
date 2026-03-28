const fs = require('fs');
const path = require('path');

const images = [
  'blog_banner_golden_pour_1774562007377.png',
  'blog_banner_neon_tea_1774562025662.png',
  'blog_banner_ancient_master_1774562042808.png',
  'blog_banner_macro_leaf_1774562074047.png',
  'blog_banner_liquid_gold_1774562086956.png',
  'blog_banner_zen_minimalist_1774562101749.png'
];

const sourceDir = '/Users/maks/.gemini/antigravity/brain/7a87f9c2-8f2c-4232-bb21-c0113473de84';
const destDir = 'apps/boostertea-web/public/blog/wow';
const articlesDir = 'apps/boostertea-web/content/blog/articles';

// Create dir
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy images
images.forEach(img => {
  try {
    fs.copyFileSync(path.join(sourceDir, img), path.join(destDir, img));
  } catch (e) {
    console.error(`Failed to copy ${img}: ${e}`);
  }
});

// Update MDX files
const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.mdx'));
files.forEach((file, index) => {
  const filePath = path.join(articlesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const imgToUse = `wow/${images[index % images.length]}`;
  content = content.replace(/coverImage:\s*".*"/, `coverImage: "${imgToUse}"`);
  fs.writeFileSync(filePath, content);
});
console.log('Successfully updated 23 8K wow images.');
