const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Fix sidebar so it's sticky on desktop and flows on mobile
  content = content.replace(
    /<aside className="w-full md:w-64 bg-white border-r border-gray-100 flex flex-col shadow-sm z-10">/g,
    `<aside className="w-full md:w-64 md:h-screen md:sticky md:top-0 bg-white border-r border-gray-100 flex flex-col shadow-sm z-10 overflow-y-auto">`
  );

  // Fix main so it doesn't have its own scroll area
  content = content.replace(
    /<main className="flex-1 max-h-screen overflow-y-auto p-4 md:p-8">/g,
    `<main className="flex-1 p-4 md:p-8 min-w-0">`
  );

  fs.writeFileSync(file, content);
  console.log("Fixed scrolling in", file);
}

fix('src/pages/Dashboard.tsx');
fix('src/pages/DashboardHr.tsx');
fix('src/pages/DashboardPl.tsx');
