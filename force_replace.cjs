const fs = require('fs');

function forceReplace(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Fix all `{isProcessing ? ( <span... ) : ( <span... )}`
  content = content.replace(
    /\{isProcessing \? \(\s*<span className="flex items-center gap-2">\s*<Loader2 className="w-5 h-5 animate-spin" \/>\s*(.+?)\s*<\/span>\s*\) : \(\s*<span className="flex items-center gap-2">\s*(.+?) <Check className="w-5 h-5" \/>\s*<\/span>\s*\)\}/gs,
    `<div className={\`flex items-center gap-2 \${isProcessing ? 'flex' : 'hidden'}\`}>
      <Loader2 className="w-5 h-5 animate-spin" />
      <span>$1</span>
    </div>
    <div className={\`flex items-center gap-2 \${!isProcessing ? 'flex' : 'hidden'}\`}>
      <span>$2</span> <Check className="w-5 h-5" />
    </div>`
  );

  content = content.replace(
    /\{isProcessing \|\| isUpdatingPrice \? \(\s*<span className="flex items-center gap-2">\s*<Loader2 className="w-5 h-5 animate-spin" \/>\s*\{isUpdatingPrice \? '(.+?)' : '(.+?)'\}\s*<\/span>\s*\) : \(\s*<span className="flex items-center gap-2">\s*(.+?) <Check className="w-5 h-5" \/>\s*<\/span>\s*\)\}/gs,
    `<div className={\`flex items-center gap-2 \${isProcessing || isUpdatingPrice ? 'flex' : 'hidden'}\`}>
      <Loader2 className="w-5 h-5 animate-spin" />
      <span>{isUpdatingPrice ? '$1' : '$2'}</span>
    </div>
    <div className={\`flex items-center gap-2 \${!(isProcessing || isUpdatingPrice) ? 'flex' : 'hidden'}\`}>
      <span>$3</span> <Check className="w-5 h-5" />
    </div>`
  );

  fs.writeFileSync(file, content, 'utf8');
}

forceReplace('src/pages/CreateEventHr.tsx');
forceReplace('src/pages/CreateEventPl.tsx');
console.log('Force replaced');
