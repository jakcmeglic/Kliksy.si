const fs = require('fs');

function injectBeforeHelmet(filePath, divContent) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes(divContent)) {
     console.log('Already injected in ' + filePath);
     return;
  }
  
  if (content.includes('<Helmet>')) {
    content = content.replace('<Helmet>', divContent + '\n      <Helmet>');
    fs.writeFileSync(filePath, content);
    console.log("Injected into " + filePath);
  } else {
    console.log("Could not find <Helmet> in " + filePath);
  }
}

const landingDiv = `<div className="sr-only" aria-hidden="true">
        <h1>QR koda za poroko — Digitalna foto galerija Kliksy</h1>
        <h2>Boljša alternativa photo boothu in foto boothu</h2>
        <h2>Popoln dodatek k poročnemu fotografu</h2>
        <h2>QR koda za rojstni dan, krst in vse dogodke</h2>
        <h2>Digitalna galerija za poroke — brez aplikacije</h2>
        <h2>Photo booth cena vs Kliksy — primerjava</h2>
      </div>`;

injectBeforeHelmet('src/pages/Landing.tsx', landingDiv);

const landingHrDiv = `<div className="sr-only" aria-hidden="true">
        <h1>QR kod za vjenčanje — Digitalna foto galerija Kliksy</h1>
        <h2>Bolja alternativa photo boothu</h2>
        <h2>Savršen dodatak vjenčanom fotografu</h2>
        <h2>QR kod za rođendan, krštenje i sve događaje</h2>
      </div>`;

injectBeforeHelmet('src/pages/LandingHr.tsx', landingHrDiv);
