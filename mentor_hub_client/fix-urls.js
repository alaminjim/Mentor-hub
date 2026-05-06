const fs = require('fs');
const path = require('path');
const files = ['ai.service.ts', 'blog.service.ts', 'category.service.ts', 'dashboard.service.ts', 'stats.service.ts', 'student.service.ts', 'tutor.service.ts'];

files.forEach(f => {
  const p = path.join('src/components/service', f);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    content = content.split('"https://mentor-hub-1.onrender.com"').join('(process.env.BACKEND_URL || "https://mentor-hub-1.onrender.com")');
    fs.writeFileSync(p, content);
    console.log("Updated", p);
  }
});
