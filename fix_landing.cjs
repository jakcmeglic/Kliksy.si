const fs = require('fs');

function updateFile(filePath, divContent) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('sr-only') && content.includes('aria-hidden')) {
    console.log(filePath + ' already updated');
    return;
  }
  content = content.replace(
    'return (',
    'return (\n    <>\n      ' + divContent
  );
  // Also add closing fragment at the very end
  content = content.replace(
    ');\n}',
    '    </>\n  );\n}'
  );
  fs.writeFileSync(filePath, content);
  console.log("Updated", filePath);
}

const landingDiv = `<div className="sr-only" aria-hidden="true">
        <h1>QR koda za poroko — Digitalna foto galerija Kliksy</h1>
        <h2>Boljša alternativa photo boothu in foto boothu</h2>
        <h2>Popoln dodatek k poročnemu fotografu</h2>
        <h2>QR koda za rojstni dan, krst in vse dogodke</h2>
        <h2>Digitalna galerija za poroke — brez aplikacije</h2>
        <h2>Photo booth cena vs Kliksy — primerjava</h2>
      </div>`;

updateFile('src/pages/Landing.tsx', landingDiv);

const landingHrDiv = `<div className="sr-only" aria-hidden="true">
        <h1>QR kod za vjenčanje — Digitalna foto galerija Kliksy</h1>
        <h2>Bolja alternativa photo boothu</h2>
        <h2>Savršen dodatak vjenčanom fotografu</h2>
        <h2>QR kod za rođendan, krštenje i sve događaje</h2>
      </div>`;

updateFile('src/pages/LandingHr.tsx', landingHrDiv);
