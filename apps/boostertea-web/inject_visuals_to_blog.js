const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, 'content/blog/articles');
const wowImagesDir = path.join(__dirname, 'public/blog/wow');

if (!fs.existsSync(contentDir)) {
    console.error('Content directory not found:', contentDir);
    process.exit(1);
}

const wowImages = fs.readdirSync(wowImagesDir)
    .filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.webp'))
    .map(f => `/blog/wow/${f}`);

if (wowImages.length === 0) {
    console.error('No images found in wow directory!');
    process.exit(1);
}

const mdxFiles = fs.readdirSync(contentDir).filter(f => f.endsWith('.mdx'));

let imageCounter = 0;

mdxFiles.forEach(mdxFile => {
    const filePath = path.join(contentDir, mdxFile);
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove any previously injected calculators or images to avoid duplicates if re-run
    content = content.replace(/<EnergyImpactCalculator \/>/g, '');
    content = content.replace(/!\[Автоматична візуалізація\].*\n/g, '');
    content = content.replace(/<div className="my-8".*?<\/div>\n/gs, '');

    // Split content by headings (##)
    const lines = content.split('\n');
    const newLines = [];
    
    let headingCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
        newLines.push(lines[i]);
        
        // We look for H2 headings inside the content (not frontmatter)
        if (lines[i].startsWith('## ') && !lines[i].includes('---')) {
            headingCount++;
            
            // Wait for one paragraph after heading to inject visual
            let j = i + 1;
            while (j < lines.length && lines[j].trim() === '') {
                newLines.push(lines[j]);
                j++;
            }
            while (j < lines.length && !lines[j].startsWith('#') && lines[j].trim() !== '' && !lines[j].startsWith('<')) {
                newLines.push(lines[j]);
                j++;
            }
            
            i = j - 1; // skip forward
            
            // Logic to inject 2-3 visuals based on heading index
            if (headingCount === 1) {
                // First heading: Inject an image
                const img = wowImages[imageCounter % wowImages.length];
                imageCounter++;
                newLines.push('');
                newLines.push(`<div className="my-10 rounded-3xl overflow-hidden border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">`);
                newLines.push(`  <img src="${img}" alt="BoosterTea Visual" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" />`);
                newLines.push(`</div>`);
                newLines.push('');
            } else if (headingCount === 2) {
                // Second heading: Inject Energy Calculator
                newLines.push('');
                newLines.push('<EnergyImpactCalculator />');
                newLines.push('');
            } else if (headingCount === 3) {
                // Third heading: Inject another image
                const img = wowImages[imageCounter % wowImages.length];
                imageCounter++;
                newLines.push('');
                newLines.push(`<div className="my-10 p-6 md:p-10 rounded-3xl bg-black/40 backdrop-blur-xl border border-[#C4956A]/20">`);
                newLines.push(`  <h4 className="text-2xl text-[#C4956A] font-bold mb-4" style={{ fontFamily: '"Syne", sans-serif' }}>💡 BoosterTea Insight</h4>`);
                newLines.push(`  <p className="text-[#E8DDD0] text-lg leading-relaxed">`);
                newLines.push(`    Екстракти BoosterTea виготовляються за низькотемпературною технологією, що дозволяє зберегти до 98% корисних речовин, в тому числі антиоксидантів та L-теаніну. Це те, що відрізняє нас від звичайного мас-маркет чаю.`);
                newLines.push(`  </p>`);
                newLines.push(`</div>`);
                newLines.push('');
            }
        }
    }
    
    // Sometimes articles have fewer headings. If headingCount was < 2, ensure calculator is at the bottom
    if (headingCount < 2) {
        newLines.push('');
        newLines.push('<EnergyImpactCalculator />');
        newLines.push('');
    }

    fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
});

console.log(`Successfully processed ${mdxFiles.length} MDX files and injected visual context.`);
