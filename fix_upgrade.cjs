const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Find the top banner upgrade button
  // 678:          {event.paymentStatus !== 'paid' && (
  // 687:                onClick={() => setIsUpgradeModalOpen(true)} 
  // Let's just manually replace these using regex to target event.paymentStatus !== 'paid'
  
  // It's easier if we just write a targeted replace for lines 601, 652, 687
  // But wait, they might have shifted.
  // The ones for unpaid event should go to `/create?eventId=${event.id}`

  // 1. The one inside the event switcher if plan is basic/plus
  content = content.replace(/<button onClick=\{\(\) => setIsUpgradeModalOpen\(true\)\} className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">/g, 
  `<button onClick={() => { if (event.paymentStatus !== 'paid') { navigate(\`/create?eventId=\${event.id}\`); } else { setIsUpgradeModalOpen(true); } }} className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">`);
  
  // 2. The one in the sidebar
  content = content.replace(
    /\{event\.paymentStatus !== 'paid' && \(\s*<li>\s*<button\s*onClick=\{\(\) => setIsUpgradeModalOpen\(true\)\}/g,
    `{event.paymentStatus !== 'paid' && (\n              <li>\n                <button\n                  onClick={() => navigate(\`/create?eventId=\${event.id}\`)}`
  );

  // 3. The one in the top banner
  content = content.replace(
    /onClick=\{\(\) => setIsUpgradeModalOpen\(true\)\}\s*className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition shadow-sm"\s*>\s*Nadgradi v polni paket/g,
    `onClick={() => navigate(\`/create?eventId=\${event.id}\`)}\n                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition shadow-sm"\n                >\n                  Nadgradi v polni paket`
  );
  
  // same for Hr
  content = content.replace(
    /onClick=\{\(\) => setIsUpgradeModalOpen\(true\)\}\s*className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition shadow-sm"\s*>\s*Nadogradi na puni paket/g,
    `onClick={() => navigate(\`/create?eventId=\${event.id}\`)}\n                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition shadow-sm"\n                >\n                  Nadogradi na puni paket`
  );

  // same for Pl
  content = content.replace(
    /onClick=\{\(\) => setIsUpgradeModalOpen\(true\)\}\s*className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition shadow-sm"\s*>\s*Uaktualnij do pełnego pakietu/g,
    `onClick={() => navigate(\`/create?eventId=\${event.id}\`)}\n                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition shadow-sm"\n                >\n                  Uaktualnij do pełnego pakietu`
  );

  fs.writeFileSync(file, content);
  console.log("Fixed upgrades in", file);
}

fix('src/pages/Dashboard.tsx');
fix('src/pages/DashboardHr.tsx');
fix('src/pages/DashboardPl.tsx');
