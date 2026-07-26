const fs = require('fs');

let sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');

if (!sitemap.includes('photo-booth-najem-cena')) {
  const entry = `
  <url>
    <loc>https://kliksy.si/blog/photo-booth-najem-cena</loc>
    <priority>0.8</priority>
    <changefreq>weekly</changefreq>
  </url>`;
  
  sitemap = sitemap.replace('</urlset>', entry + '\n</urlset>');
  fs.writeFileSync('public/sitemap.xml', sitemap);
  console.log("Updated sitemap");
}
