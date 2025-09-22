// generate-search-index.js (run with Node.js)
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const pages = [
  'index.html',
  'Courses.html',
  'Partners.html',
  'About-Brightemy.html',
  'Blog.html',
  'Contact.html',
  'Sponsor.html',
  'Web-Development-Course.html',
  'Cyber-Security-&-Online-Saftey-Course.html',
  'Microsoft-Office-365-Course.html',
  'Graphic-Design-Course.html',
  'Digital-Marketing-Course.html',
  'Video-Editing-Course.html',
  'Privacy-Policy.html',
  'Partner-Voktis-Group',
  'Partner-Sixteen-Foundation',
  'Terms-&-Conditions.html'
];

const output = [];

pages.forEach(page => {
  const filePath = path.join(__dirname, page);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${page}`);
    return;
  }

  const html = fs.readFileSync(filePath, 'utf-8');
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const title = doc.querySelector('title')?.textContent || page;

  // Grab visible text only
  let content = '';
  doc.body.querySelectorAll('*').forEach(el => {
    if (el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE') {
      content += el.textContent + ' ';
    }
  });

  output.push({
    title: title.trim(),
    link: page,
    filename: path.basename(page, '.html').toLowerCase(), // <-- NEW
    content: content.trim()
  });
});

fs.writeFileSync('search-index.json', JSON.stringify(output, null, 2));
console.log('✅ search-index.json generated successfully');


