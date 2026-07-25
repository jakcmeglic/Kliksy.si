const fs = require('fs');

function fix(file, lang) {
  let content = fs.readFileSync(file, 'utf8');

  let text = "Nov dogodek";
  if (lang === 'hr') text = "Novi događaj";
  if (lang === 'pl') text = "Nowe wydarzenie";

  content = content.replace(
    /<div className="flex gap-2">\s*<button onClick=\{\(\) => window\.open\(`\/event\/\$\{event\.id\}`/g,
    `<div className="flex flex-col gap-2">
            <button onClick={() => navigate('/create')} className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition">
              <Plus className="w-4 h-4" /> ${text}
            </button>
            <button onClick={() => window.open(\`/event/\${event.id}\``
  );

  // also need to import Plus from lucide-react if not already
  if (!content.includes('Plus,')) {
    content = content.replace(/import \{([^}]+)\} from 'lucide-react';/, "import { $1, Plus } from 'lucide-react';");
  }

  fs.writeFileSync(file, content);
  console.log("Added button to", file);
}

fix('src/pages/Dashboard.tsx', 'si');
fix('src/pages/DashboardHr.tsx', 'hr');
fix('src/pages/DashboardPl.tsx', 'pl');
