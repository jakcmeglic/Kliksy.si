const fs = require('fs');

const files = [
  'src/pages/Login.tsx',
  'src/pages/LoginHr.tsx',
  'src/pages/LoginPl.tsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Fix the login button
  // {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (authMode === 'login' ? 'Prijava' : authMode === 'forgot_password' ? 'Pošalji poveznicu' : 'Registracija')}
  
  content = content.replace(
    /\{loading \? <Loader2 className="w-5 h-5 animate-spin" \/> : \(authMode === 'login' \? '([^']+)' : authMode === 'forgot_password' \? '([^']+)' : '([^']+)'\)\}/g,
    `<div className={\`flex items-center gap-2 \${loading ? 'flex' : 'hidden'}\`}>
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <div className={\`flex items-center gap-2 \${!loading ? 'flex' : 'hidden'}\`}>
                <span>{authMode === 'login' ? '$1' : authMode === 'forgot_password' ? '$2' : '$3'}</span>
              </div>`
  );

  fs.writeFileSync(file, content, 'utf8');
}

console.log('Fixed Login buttons');
