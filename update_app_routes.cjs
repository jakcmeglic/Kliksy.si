const fs = require('fs');

let appTsx = fs.readFileSync('src/App.tsx', 'utf8');

if (!appTsx.includes('import BlogList')) {
  appTsx = appTsx.replace(
    "import { AuthProvider } from './components/AuthProvider';",
    "import BlogList from './pages/BlogList';\nimport BlogArticle from './pages/BlogArticle';\nimport { AuthProvider } from './components/AuthProvider';"
  );
}

if (!appTsx.includes('path="/blog"')) {
  appTsx = appTsx.replace(
    '<Route path="/admin" element={<Admin />} />',
    '<Route path="/blog" element={<BlogList />} />\n            <Route path="/blog/photo-booth-najem-cena" element={<BlogArticle />} />\n            <Route path="/admin" element={<Admin />} />'
  );
}

fs.writeFileSync('src/App.tsx', appTsx);
console.log("Updated App.tsx");

