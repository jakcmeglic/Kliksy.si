const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Revert sidebar
  content = content.replace(
    /<aside className="w-full md:w-64 md:h-screen md:sticky md:top-0 bg-white border-r border-gray-100 flex flex-col shadow-sm z-10 overflow-y-auto">/g,
    `<aside className="w-full md:w-64 bg-white border-r border-gray-100 flex flex-col shadow-sm z-10">`
  );

  // Revert main
  content = content.replace(
    /<main className="flex-1 p-4 md:p-8 min-w-0">/g,
    `<main className="flex-1 max-h-screen overflow-y-auto p-4 md:p-8">`
  );

  fs.writeFileSync(file, content);
  console.log("Reverted dashboard layout in", file);
}

fix('src/pages/Dashboard.tsx');
fix('src/pages/DashboardHr.tsx');
fix('src/pages/DashboardPl.tsx');
