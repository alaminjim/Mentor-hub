const fs = require('fs');
const path = require('path');
const files = ['ai.service.ts', 'blog.service.ts', 'category.service.ts', 'dashboard.service.ts', 'stats.service.ts', 'student.service.ts', 'tutor.service.ts'];

files.forEach(f => {
  const p = path.join('src/components/service', f);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    content = content.split('"http://localhost:5000"').join('(process.env.BACKEND_URL || "http://localhost:5000")');
    fs.writeFileSync(p, content);
    console.log("Updated", p);
  }
});
