const fs = require('fs');
let content = fs.readFileSync('src/pages/BlogArticle.tsx', 'utf8');

content = content.replace(/photo boothom oziroma foto boothom/gi, 'photo boothom');
content = content.replace(/photo bootha ali foto bootha/gi, 'photo bootha');
content = content.replace(/photo boothu, foto boothu/gi, 'photo boothu');
content = content.replace(/Photo booth \/ Foto booth/gi, 'Photo booth');
content = content.replace(/Osnovni odprti photo booth \/ foto booth/gi, 'Osnovni odprti photo booth');

fs.writeFileSync('src/pages/BlogArticle.tsx', content);
console.log("Updated BlogArticle again");
