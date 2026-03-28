import fs from 'fs';
import path from 'path';

const basePath = '/Users/maks/Library/Mobile Documents/com~apple~CloudDocs/ANTI 001/wsm-ecosystem/apps/boostertea-web/src/web';

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('wouter')) return;
  
  let original = content;

  // Replace import variations
  content = content.replace(/import\s*{\s*Link\s*}\s*from\s*['"]wouter['"];?/g, "import Link from 'next/link';");
  
  content = content.replace(/import\s*{\s*Link,\s*useLocation\s*}\s*from\s*['"]wouter['"];?/g, "import Link from 'next/link';\nimport { usePathname, useRouter } from 'next/navigation';");
  
  content = content.replace(/import\s*{\s*useLocation\s*}\s*from\s*['"]wouter['"];?/g, "import { usePathname, useRouter } from 'next/navigation';");
  
  content = content.replace(/import\s*{\s*Link,\s*useParams\s*}\s*from\s*['"]wouter['"];?/g, "import Link from 'next/link';\nimport { useParams } from 'next/navigation';");
  
  content = content.replace(/import\s*{\s*Link,\s*useLocation,\s*useSearch\s*}\s*from\s*['"]wouter['"];?/g, "import Link from 'next/link';\nimport { usePathname, useRouter, useSearchParams } from 'next/navigation';");

  // Fix hook usages
  content = content.replace(/const\s+\[\s*location\s*\]\s*=\s*useLocation\(\);?/g, "const location = usePathname() || '/';");
  
  content = content.replace(/const\s+\[\s*location,\s*setLocation\s*\]\s*=\s*useLocation\(\);?/g, "const location = usePathname() || '/';\n  const router = useRouter();\n  const setLocation = router.push;");
  
  content = content.replace(/const\s+search\s*=\s*useSearch\(\);?/g, "const searchParams = useSearchParams();\n  const search = searchParams ? searchParams.toString() : '';");

  if (original !== content) {
    fs.writeFileSync(filePath, content);
    console.log(`Migrated: ${filePath}`);
  }
}

function traverseDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      fixFile(fullPath);
    }
  }
}

console.log('Starting wouter migration sweep...');
traverseDir(basePath);
console.log('Migration complete.');
