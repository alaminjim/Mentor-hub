const fs = require('fs');
const path = require('path');

const rootDir = '.';
const oldUrl = 'mentor-hub-1.onrender.com';
const newUrl = 'mentor-hub-1.onrender.com';

function walkDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        walkDir(fullPath);
      }
    } else {
      if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js') || fullPath.endsWith('.cjs')) {
        let content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes(oldUrl)) {
          console.log(`Updating ${fullPath}...`);
          content = content.split(oldUrl).join(newUrl);
          fs.writeFileSync(fullPath, content);
        }
      }
    }
  });
}

walkDir(rootDir);
console.log('Update complete!');
