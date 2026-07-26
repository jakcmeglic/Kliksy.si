const fs = require('fs');
let content = fs.readFileSync('src/pages/BlogArticle.tsx', 'utf8');

content = content.replace(/"photo booth zajame fotografije/g, '"Photo booth zajame fotografije');
content = content.replace(/photo booth vs Kliksy/g, 'Photo booth vs Kliksy');
content = content.replace(/photo booth je pritrjen/g, 'Photo booth je pritrjen');
content = content.replace(/<h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6">\s*Photo booth vs Kliksy — podrobna primerjava\s*<\/h2>/, '<h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6">\n              Photo booth vs Kliksy — podrobna primerjava\n            </h2>');

fs.writeFileSync('src/pages/BlogArticle.tsx', content);
console.log("Updated capitalization");
