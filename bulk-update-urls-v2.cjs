const fs = require('fs');
const path = require('path');

const rootDir = '.';
const replacements = [
  { old: 'mentor-hub-1.onrender.com', new: 'mentor-hub-1.onrender.com' },
  { old: 'mentor-hub-1.onrender.com', new: 'mentor-hub-1.onrender.com' } // Assuming they might use the same link or they will set it later
];

function walkDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        walkDir(fullPath);
      }
    } else {
      if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js') || fullPath.endsWith('.cjs') || fullPath.endsWith('.md')) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let originalContent = content;
        
        replacements.forEach(r => {
          content = content.split(r.old).join(r.new);
        });

        if (content !== originalContent) {
          console.log(`Updating ${fullPath}...`);
          fs.writeFileSync(fullPath, content);
        }
      }
    }
  });
}

walkDir(rootDir);
console.log('Update complete!');
