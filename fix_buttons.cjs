const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Fix top banner "Nadgradi zdaj" (or HR/PL equivalents)
  content = content.replace(
    /onClick=\{\(\) => setIsUpgradeModalOpen\(true\)\}\s*className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors whitespace-nowrap shadow-sm"/g,
    `onClick={() => navigate(\`/create?eventId=\${event.id}\`)}\n                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors whitespace-nowrap shadow-sm"`
  );

  // Is there any other `setIsUpgradeModalOpen(true)` left in the sidebar or switcher?
  // Let's check the sidebar one:
  // `{event.paymentStatus !== 'paid' && (\n              <li>\n                <button\n                  onClick={() => setIsUpgradeModalOpen(true)}\n                  className="w-full text-left px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-colors text-indigo-600 bg-indigo-50"`
  content = content.replace(
    /onClick=\{\(\) => setIsUpgradeModalOpen\(true\)\}\n\s*className="w-full text-left px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-colors text-indigo-600 bg-indigo-50"/g,
    `onClick={() => navigate(\`/create?eventId=\${event.id}\`)}\n                  className="w-full text-left px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-colors text-indigo-600 bg-indigo-50"`
  );

  fs.writeFileSync(file, content);
  console.log("Fixed buttons in", file);
}

fix('src/pages/Dashboard.tsx');
fix('src/pages/DashboardHr.tsx');
fix('src/pages/DashboardPl.tsx');
