const fs = require('fs');

function addNav(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Insert into desktop nav
  if (!content.includes('<Link to="/blog" className="hover:text-gray-900 transition-colors">Blog</Link>')) {
    content = content.replace(
      /<a href="#paketi" className="hover:text-gray-900 transition-colors">Cenik<\/a>/g,
      '<a href="#paketi" className="hover:text-gray-900 transition-colors">Cenik</a>\n            <Link to="/blog" className="hover:text-gray-900 transition-colors">Blog</Link>'
    );
  }

  // Insert into mobile nav
  if (!content.includes('<Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-indigo-600">Blog</Link>')) {
    content = content.replace(
      /<a href="#paketi" onClick=\{\(\) => setIsMobileMenuOpen\(false\)\} className="py-2 hover:text-indigo-600">Cenik<\/a>/g,
      '<a href="#paketi" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-indigo-600">Cenik</a>\n                <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-indigo-600">Blog</Link>'
    );
  }

  fs.writeFileSync(filePath, content);
  console.log("Updated", filePath);
}

addNav('src/pages/Landing.tsx');
addNav('src/pages/LandingHr.tsx');
addNav('src/pages/LandingPl.tsx');

