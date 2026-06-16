const fs = require('fs');

function updateDashboard(filename, title) {
    let content = fs.readFileSync(filename, "utf8");
    const regex = /<h3 className="font-bold text-lg text-gray-900">.*<\/h3>/;
    
    let ownTitle = 'Moje slike';
    let stdTitle = 'Zadnji spomini';
    
    if (filename.includes('Hr')) {
        ownTitle = 'Moje slike';
        stdTitle = 'Zadnje uspomene';
    } else if (filename.includes('Pl')) {
        ownTitle = 'Moje zdjęcia';
        stdTitle = 'Ostatnie wspomnienia';
    }
    
    const replacement = `<h3 className="font-bold text-lg text-gray-900">{event?.guestViewSettings === 'own' ? '${ownTitle}' : '${stdTitle}'}</h3>`;
    
    content = content.replace(regex, replacement);
    fs.writeFileSync(filename, content, "utf8");
    console.log(`Updated ${filename}`);
}

updateDashboard('src/pages/GuestView.tsx');
updateDashboard('src/pages/GuestViewHr.tsx');
updateDashboard('src/pages/GuestViewPl.tsx');
