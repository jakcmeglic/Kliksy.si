const fs = require('fs');

function fixFile(file, processingText, btnText, updatingText) {
  let content = fs.readFileSync(file, 'utf8');

  // Fix handleCheckoutFree
  const btn1Target = `{isProcessing ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              ${processingText}
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              ${btnText} <Check className="w-5 h-5" />
                            </span>
                          )}`;

  const btn1Replacement = `<div className={\`flex items-center gap-2 \${isProcessing ? 'flex' : 'hidden'}\`}>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>${processingText}</span>
                          </div>
                          <div className={\`flex items-center gap-2 \${!isProcessing ? 'flex' : 'hidden'}\`}>
                            <span>${btnText}</span> <Check className="w-5 h-5" />
                          </div>`;

  // Fix CheckoutForm button
  const btn2Target = `{isProcessing || isUpdatingPrice ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            {isUpdatingPrice ? '${updatingText}' : '${processingText}'}
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Potvrdi i stvori galeriju <Check className="w-5 h-5" />
          </span>
        )}`;

  const btn2Replacement = `<div className={\`flex items-center gap-2 \${isProcessing || isUpdatingPrice ? 'flex' : 'hidden'}\`}>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>{isUpdatingPrice ? '${updatingText}' : '${processingText}'}</span>
        </div>
        <div className={\`flex items-center gap-2 \${!(isProcessing || isUpdatingPrice) ? 'flex' : 'hidden'}\`}>
          <span>Potvrdi i stvori galeriju</span> <Check className="w-5 h-5" />
        </div>`;
        
  const btn3Target = `{isProcessing || isUpdatingPrice ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            {isUpdatingPrice ? '${updatingText}' : '${processingText}'}
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Zatwierdź i utwórz galerię <Check className="w-5 h-5" />
          </span>
        )}`;

  const btn3Replacement = `<div className={\`flex items-center gap-2 \${isProcessing || isUpdatingPrice ? 'flex' : 'hidden'}\`}>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>{isUpdatingPrice ? '${updatingText}' : '${processingText}'}</span>
        </div>
        <div className={\`flex items-center gap-2 \${!(isProcessing || isUpdatingPrice) ? 'flex' : 'hidden'}\`}>
          <span>Zatwierdź i utwórz galerię</span> <Check className="w-5 h-5" />
        </div>`;

  content = content.replace(btn1Target, btn1Replacement);
  content = content.replace(btn2Target, btn2Replacement);
  content = content.replace(btn3Target, btn3Replacement);

  fs.writeFileSync(file, content, 'utf8');
}

fixFile('src/pages/CreateEventHr.tsx', 'Obrađujem...', 'Stvori događaj besplatno', 'Ažuriram cijenu...');
fixFile('src/pages/CreateEventPl.tsx', 'Przetwarzam...', 'Utwórz wydarzenie za darmo', 'Aktualizuję cenę...');

console.log('Fixed HR and PL files');
