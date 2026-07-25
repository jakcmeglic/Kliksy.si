const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Fix auth.signOut()
  content = content.replace(/auth\.signOut\(\)/g, 'signOut()');
  
  // Fix deletePhoto(photo) -> handleDeleteImage(photo.id)
  content = content.replace(/deletePhoto\(photo\)/g, 'handleDeleteImage(photo.id)');
  
  // Fix navigate('/upgrade')
  content = content.replace(/navigate\('\/upgrade'\)/g, 'setIsUpgradeModalOpen(true)');
  
  // Fix navigate(`/checkout/${event.id}`)
  content = content.replace(/navigate\(\`\/checkout\/\$\{event\.id\}\`\)/g, 'setIsUpgradeModalOpen(true)');
  
  // Fix gallery grid on mobile to be like GuestView (3 columns) if it's currently 2
  // grid-cols-2 md:grid-cols-4 gap-4 -> grid-cols-3 md:grid-cols-4 gap-2 md:gap-4
  content = content.replace(/className="grid grid-cols-2 md:grid-cols-4 gap-4"/g, 'className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-4"');

  fs.writeFileSync(file, content);
  console.log("Fixed", file);
}

fix('src/pages/Dashboard.tsx');
fix('src/pages/DashboardHr.tsx');
fix('src/pages/DashboardPl.tsx');
