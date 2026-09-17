const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
lines.forEach((line, i) => {
  if (line.includes('panel-gradient') || line.includes('gradient-') || line.includes('gradient') || line.includes('background') || line.includes('bg-')) {
    if (line.includes('id=') || line.includes('class="panel')) {
      console.log(i+1, line.trim());
    }
  }
});
