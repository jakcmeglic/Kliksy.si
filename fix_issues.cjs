const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Fix Predogled button
  content = content.replace(
    /<button onClick=\{\(\) => window\.open\(`\/\$\{event\.id\}`,\s*'_blank'\)\}/g,
    '<button onClick={() => window.open(`/event/${event.id}`, \'_blank\')}'
  );

  // Add "Nov dogodek" button inside the event selector
  // Before:
  //               </select>
  //             ) : (
  content = content.replace(
    /<\/select>\s*\) : \(\s*<h2 className="font-bold tracking-tight text-xl text-gray-900 truncate">/g,
    `</select>
            ) : (
              <h2 className="font-bold tracking-tight text-xl text-gray-900 truncate">`
  );
  
  // Wait, let's just add it below the Predogled button to be safe, or above it.
  // Original had a "Dodaj nov dogodek" button somewhere. Let's see if there was a commented out button or something.
  fs.writeFileSync(file, content);
}
fix('src/pages/Dashboard.tsx');
fix('src/pages/DashboardHr.tsx');
fix('src/pages/DashboardPl.tsx');
