const fs = require('fs');
const path = require('path');

const pug = require('pug');

const Prism = require('prismjs');
const loadLanguages = require('prismjs/components/');
loadLanguages(['scss', 'bash']);

const markdownit = require('markdown-it');
const md = markdownit()


fs.readdirSync('./docs/src', {
  recursive: true,
}).forEach(file => {
  if (file.endsWith('.pug') && !file.startsWith('_')) {
    const filePath = path.join('./docs/src', file);
    const outputPath = path.join('./docs', file.replace('.pug', '.html'));

    const compiledFunction = pug.compileFile(filePath, { pretty: true, filters: { 'highlight': (text, options) => {
      const lang = options.lang || 'plaintext';
      return Prism.highlight(text, Prism.languages[lang], lang);
    },
    'markdown-it': (text) => {
      return md.render(text);
    }} });
    const html = compiledFunction();

    fs.writeFileSync(outputPath, html);
  }
});