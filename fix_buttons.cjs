const fs = require('fs');

const files = [
  'src/pages/CreateEvent.tsx',
  'src/pages/CreateEventHr.tsx',
  'src/pages/CreateEventPl.tsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Fix button 1 (handleCheckoutFree)
  // Need to replace the whole {isProcessing ? (...) : (...)} block.
  // Instead of complex regex, let's just find and replace the exact string manually, or use a function.

  content = content.replace(
    /\{isProcessing \? \(\s*<span className="flex items-center gap-2">\s*<Loader2 className="w-5 h-5 animate-spin" \/>\s*(Obdelujem\.\.\.|Obrađujem\.\.\.|Przetwarzam\.\.\.)\s*<\/span>\s*\) : \(\s*<span className="flex items-center gap-2">\s*(Ustvari dogodek brezplačno|Stvori događaj besplatno|Utwórz wydarzenie za darmo) <Check className="w-5 h-5" \/>\s*<\/span>\s*\)\}/g,
    `<div className={\`flex items-center gap-2 \${isProcessing ? 'flex' : 'hidden'}\`}>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span>$1</span>
                            </div>
                            <div className={\`flex items-center gap-2 \${!isProcessing ? 'flex' : 'hidden'}\`}>
                              <span>$2</span> <Check className="w-5 h-5" />
                            </div>`
  );

  // Fix button 2 (CheckoutForm component inside CreateEvent)
  content = content.replace(
    /\{isProcessing \|\| isUpdatingPrice \? \(\s*<span className="flex items-center gap-2">\s*<Loader2 className="w-5 h-5 animate-spin" \/>\s*\{isUpdatingPrice \? '.*?' : '(Obdelujem\.\.\.|Obrađujem\.\.\.|Przetwarzam\.\.\.)'\}\s*<\/span>\s*\) : \(\s*<span className="flex items-center gap-2">\s*(Potrdi in ustvari galerijo|Potvrdi i stvori galeriju|Zatwierdź i utwórz galerię) <Check className="w-5 h-5" \/>\s*<\/span>\s*\)\}/g,
    `<div className={\`flex items-center gap-2 \${isProcessing || isUpdatingPrice ? 'flex' : 'hidden'}\`}>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{isUpdatingPrice ? (file.includes('Hr') ? 'Ažuriram cijenu...' : file.includes('Pl') ? 'Aktualizuję cenę...' : 'Osvežujem ceno...') : '$1'}</span>
          </div>
          <div className={\`flex items-center gap-2 \${!(isProcessing || isUpdatingPrice) ? 'flex' : 'hidden'}\`}>
            <span>$2</span> <Check className="w-5 h-5" />
          </div>`
  );

  // Clean up any stray HTML comments I accidentally added
  content = content.replace(/<!-- Obdelujem 1 -->\n/g, '');

  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed', file);
}
