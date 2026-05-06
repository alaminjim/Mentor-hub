const fs = require('fs');
const path = require('path');

const directory = 'mentor_hub_client/src/components/service';
const oldUrl = 'mentor-hub-1.onrender.com';
const newUrl = 'mentor-hub-1.onrender.com';

fs.readdirSync(directory).forEach(file => {
  if (file.endsWith('.ts')) {
    const filePath = path.join(directory, file);
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(oldUrl)) {
      console.log(`Updating ${file}...`);
      content = content.split(oldUrl).join(newUrl);
      fs.writeFileSync(filePath, content);
    }
  }
});
