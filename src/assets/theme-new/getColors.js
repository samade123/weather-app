const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const directoryPath = '.'; // replace with your directory path

fs.readdir(directoryPath, async (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  const results = [];

  for (const file of files) {
    const ext = path.extname(file);
    if (ext.toLowerCase() !== '.jpg' && ext.toLowerCase() !== '.jpeg') {
      continue;
    }

    const filePath = path.join(directoryPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      continue;
    }

    try {
      // Get image buffer
      const buffer = await sharp(filePath).toBuffer();

      // Get main color
      const metadata = await sharp(buffer).metadata();
      const color = metadata.hasAlpha ? null : (await sharp(buffer).resize(1, 1).toBuffer())[0].toString(16).toUpperCase().padStart(6, '0');

      // Add result to array
      results.push({
        filename: file,
        color: color
      });

      console.log(`Processed ${file}`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }

  // Write results to JSON file
  fs.writeFileSync('imageColors.json', JSON.stringify(results, null, 2));
});
