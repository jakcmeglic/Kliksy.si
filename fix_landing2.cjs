const fs = require('fs');

function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Clean up the first messed up return
  const badReturn = `    return (
    <>
      <div className="sr-only" aria-hidden="true">
        <h1>QR koda za poroko — Digitalna foto galerija Kliksy</h1>
        <h2>Boljša alternativa photo boothu in foto boothu</h2>
        <h2>Popoln dodatek k poročnemu fotografu</h2>
        <h2>QR koda za rojstni dan, krst in vse dogodke</h2>
        <h2>Digitalna galerija za poroke — brez aplikacije</h2>
        <h2>Photo booth cena vs Kliksy — primerjava</h2>
      </div>) => clearInterval(interval);`;
      
  if (content.includes(badReturn)) {
    content = content.replace(badReturn, '    return () => clearInterval(interval);');
  }

  const badReturnHr = `    return (
    <>
      <div className="sr-only" aria-hidden="true">
        <h1>QR kod za vjenčanje — Digitalna foto galerija Kliksy</h1>
        <h2>Bolja alternativa photo boothu</h2>
        <h2>Savršen dodatak vjenčanom fotografu</h2>
        <h2>QR kod za rođendan, krštenje i sve događaje</h2>
      </div>) => clearInterval(interval);`;
      
  if (content.includes(badReturnHr)) {
    content = content.replace(badReturnHr, '    return () => clearInterval(interval);');
  }

  // Remove the trailing </>\n  );\n} added by mistake if needed, wait, we actually need to put the div inside the actual return!
  
  fs.writeFileSync(filePath, content);
}

cleanFile('src/pages/Landing.tsx');
cleanFile('src/pages/LandingHr.tsx');
