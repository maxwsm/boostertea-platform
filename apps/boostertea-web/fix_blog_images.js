const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, 'content/blog/articles');
const getBlogPostsPath = path.join(__dirname, 'src/web/lib/blog/getBlogPosts.ts');
const wowImagesDir = path.join(__dirname, 'public/blog/wow');

// 1. Get the list of images
const wowImages = fs.readdirSync(wowImagesDir)
  .filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.webp'))
  .map(f => `wow/${f}`);

if (wowImages.length === 0) {
  console.log("No images found!");
  process.exit(1);
}

// 2. Process getBlogPosts.ts
let getBlogPostsContent = fs.readFileSync(getBlogPostsPath, 'utf8');

// Regex to match coverImage: '...', line in getBlogPosts.ts
let imageIndex = 0;
getBlogPostsContent = getBlogPostsContent.replace(/coverImage:\s*['"]([^'"]+)['"]/g, (match, currentImage) => {
  const newImage = wowImages[imageIndex % wowImages.length];
  imageIndex++;
  return `coverImage: '${newImage}'`;
});

fs.writeFileSync(getBlogPostsPath, getBlogPostsContent, 'utf8');
console.log(`Updated getBlogPosts.ts with ${wowImages.length} images.`);

// 3. Process MDX files
if (fs.existsSync(contentDir)) {
  const mdxFiles = fs.readdirSync(contentDir).filter(f => f.endsWith('.mdx'));
  let mdxImageIndex = 0;
  
  for (const mdxFile of mdxFiles) {
    const filePath = path.join(contentDir, mdxFile);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace coverImage in frontmatter
    const newImage = wowImages[mdxImageIndex % wowImages.length];
    content = content.replace(/^coverImage:\s*['"]([^'"]+)['"]/m, `coverImage: "${newImage}"`);
    
    fs.writeFileSync(filePath, content, 'utf8');
    mdxImageIndex++;
  }
  console.log(`Updated ${mdxFiles.length} MDX files.`);
} else {
  console.log("contentDir not found:", contentDir);
}
