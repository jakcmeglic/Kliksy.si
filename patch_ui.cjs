const fs = require('fs');

function patch(file, text) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /\{uploadProgress\.total > 0 && \(/,
    `{isConvertingHeic && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex justify-center"
                >
                  <div className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-xs font-medium flex items-center justify-center gap-1.5 shadow-sm border border-amber-100 mb-2">
                     <Loader2 className="w-3.5 h-3.5 animate-spin" />
                     ${text}
                  </div>
                </motion.div>
              )}
              {uploadProgress.total > 0 && !isConvertingHeic && (`
  );
  fs.writeFileSync(file, content);
}

patch('src/pages/GuestView.tsx', 'Pretvarjam HEIC... (to lahko traja nekaj sekund)');
patch('src/pages/GuestViewHr.tsx', 'Pretvaranje HEIC... (ovo može potrajati nekoliko sekundi)');
patch('src/pages/GuestViewPl.tsx', 'Konwertowanie HEIC... (może to zająć kilka sekund)');
