const fs = require('fs');
let content = fs.readFileSync('src/pages/BlogArticle.tsx', 'utf8');

// Replacements
content = content.replace(/photo bootha oziroma foto bootha/gi, 'photo bootha');
content = content.replace(/photo booth oziroma foto booth/gi, 'photo booth');
content = content.replace(/photo booth ali foto booth/gi, 'photo booth');
content = content.replace(/photo boothu oziroma foto boothu/gi, 'photo boothu');
content = content.replace(/photo bootha in foto bootha/gi, 'photo bootha');
content = content.replace(/photo booth in foto booth/gi, 'photo booth');
content = content.replace(/photo boothu in foto boothu/gi, 'photo boothu');
content = content.replace(/foto booth in photo booth/gi, 'photo booth');
content = content.replace(/foto booth ali photo booth/gi, 'photo booth');
content = content.replace(/foto booth oziroma photo booth/gi, 'photo booth');
content = content.replace(/foto bootha oziroma photo bootha/gi, 'photo bootha');
content = content.replace(/foto boothu oziroma photo boothu/gi, 'photo boothu');

fs.writeFileSync('src/pages/BlogArticle.tsx', content);
console.log("Updated BlogArticle");
