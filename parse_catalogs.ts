import * as xlsx from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const archiveDir = '/Users/maks/Library/Mobile Documents/com~apple~CloudDocs/ANTI 001 arhiv';
const filesToParse = [
  'Прайс Funny Drops.xlsx',
  'Прайси, Ціноутворення.xlsx',
  'Інвентаризація.xlsx'
];

async function main() {
  console.log('--- PAN GURMAN / FUNNY DROPS CATALOG PARSER ---');
  let masterCatalog = [];

  for (const filename of filesToParse) {
    const filePath = path.join(archiveDir, filename);
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Missing: ${filename}`);
      continue;
    }

    try {
      const workbook = xlsx.readFile(filePath);
      console.log(`\n📄 Parsing: ${filename}`);
      
      for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
        
        console.log(`   - Sheet: ${sheetName} (${data.length} rows)`);
        
        masterCatalog.push({
          source: filename,
          sheet: sheetName,
          rowCount: data.length,
          data: data
        });
      }
    } catch (e) {
      console.error(`Error parsing ${filename}:`, (e as Error).message);
    }
  }

  fs.writeFileSync('./full_pan_gurman.json', JSON.stringify(masterCatalog, null, 2));
  console.log('\n✅ Parsed logs saved to full_pan_gurman.json');
}

main().catch(console.error);
