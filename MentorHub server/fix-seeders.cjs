const fs = require('fs');
const path = require('path');
const dir = 'src/scripts';

fs.readdirSync(dir).filter(f => f.endsWith('.ts')).forEach(f => {
  const p = path.join(dir, f);
  let c = fs.readFileSync(p, 'utf8');
  c = c.split('"https://mentor-hub-1.onrender.com"').join('(process.env.APP_URL || "http://localhost:5000")');
  fs.writeFileSync(p, c);
  console.log("Updated", p);
});
