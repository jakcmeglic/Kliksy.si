const fs = require('fs');

function updateLanding(filePath, isHr) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Ensure Helmet import
  if (!content.includes("import { Helmet } from 'react-helmet-async'")) {
    content = content.replace(
      "import React,", 
      "import { Helmet } from 'react-helmet-async';\nimport React,"
    );
    if (!content.includes("import { Helmet }")) { // fallback
      content = "import { Helmet } from 'react-helmet-async';\n" + content;
    }
  }

  // Insert Helmet tags right after return (
  const helmetTagsSi = `
      <Helmet>
        <title>Kliksy — QR koda za poroko | Digitalna foto galerija za goste</title>
        <meta name="description" content="Postavite QR kodo na mize — gostje skenirajo in vse slike gredo v skupno galerijo v realnem času. Popoln dodatek k poročnemu fotografu. Brez aplikacije. Od €39." />
        <meta name="keywords" content="qr koda za poroko, digitalna galerija poroka, foto galerija za poroko, skupna galerija gostov, poročni fotograf, poročni fotograf slovenija, fotografiranje poroke, poročne fotografije, qr koda za slike, aplikacija za slike na poroki, kako zbrati slike z poroke, galerija za dogodek, slike z poroke, foto na poroki" />
        <meta property="og:title" content="Kliksy — QR koda za poroko | Digitalna foto galerija" />
        <meta property="og:description" content="Gostje skenirajo QR kodo in vse slike gredo v eno galerijo v realnem času. Popoln dodatek k poročnemu fotografu. Brez aplikacije. Od €39." />
        <meta property="og:url" content="https://kliksy.si" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://kliksy.si/og-image.jpg" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://kliksy.si" />
      </Helmet>
  `;

  const helmetTagsHr = `
      <Helmet>
        <title>Kliksy — QR kod za vjenčanje | Digitalna foto galerija za goste</title>
        <meta name="description" content="Postavite QR kod na stolove — gosti skeniraju i sve slike idu u zajedničku galeriju u stvarnom vremenu. Savršen dodatak vjenčanom fotografu. Bez aplikacije. Od €39." />
        <meta name="keywords" content="qr kod za vjenčanje, digitalna galerija vjenčanje, foto galerija za vjenčanje, vjenčani fotograf, fotografiranje vjenčanja, skupna galerija gostiju, qr kod za slike" />
        <meta property="og:title" content="Kliksy — QR kod za vjenčanje | Digitalna foto galerija za goste" />
        <meta property="og:description" content="Postavite QR kod na stolove — gosti skeniraju i sve slike idu u zajedničku galeriju u stvarnom vremenu. Savršen dodatak vjenčanom fotografu. Bez aplikacije. Od €39." />
        <meta property="og:url" content="https://hr.getkliksy.com" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://hr.getkliksy.com/og-image.jpg" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://hr.getkliksy.com" />
      </Helmet>
  `;

  const tags = isHr ? helmetTagsHr : helmetTagsSi;

  // We want to insert it after the main top-level <div> or similar in the component.
  // E.g., `return (\n    <div className="min-h-screen...`
  // We'll just replace the first `return (` inside the component
  // Assuming `export default function Landing`
  let match = content.match(/return \(\s*<div/);
  if (match && !content.includes('<Helmet>')) {
    content = content.replace(match[0], `return (\n    <>\n${tags}\n    <div`);
    
    // now we need to close the <> at the very end.
    // finding the last </div>\n  ); or similar
    let lastDivMatch = content.lastIndexOf('</div>\n  );');
    if (lastDivMatch !== -1) {
      content = content.substring(0, lastDivMatch) + '</div>\n    </>\n  );' + content.substring(lastDivMatch + 11);
    } else {
      // simpler approach if we can't find it easily
      let lastMatch = content.lastIndexOf('  );\n}');
      if (lastMatch !== -1) {
        let snippet = content.substring(lastMatch - 15, lastMatch + 10);
        // e.g. "</div>\n  );\n}"
        content = content.substring(0, lastMatch) + '\n    </>\n  );\n}';
      }
    }
  }

  // Also replace some image alts
  // The user said: Add alt tags with keywords to ALL images on landing page
  // We can do a simple regex for `alt="[^"]*"` or `alt={[^}]*}` and replace them,
  // or add alt if missing. 
  // Let's just do a blanket replacement of all `alt="..."` that aren't dynamic
  if (!isHr) {
    content = content.replace(/alt="([^"]*)"/g, (m, p1) => {
      if (p1.includes("qr koda za poroko kliksy")) return m; // already done
      return `alt="${p1} - qr koda za poroko kliksy digitalna galerija poročni fotograf dodatek"`;
    });
  } else {
    content = content.replace(/alt="([^"]*)"/g, (m, p1) => {
      if (p1.includes("qr kod za vjenčanje kliksy")) return m; // already done
      return `alt="${p1} - qr kod za vjenčanje kliksy digitalna galerija vjenčani fotograf dodatak"`;
    });
  }

  fs.writeFileSync(filePath, content);
  console.log("Updated", filePath);
}

updateLanding('src/pages/Landing.tsx', false);
updateLanding('src/pages/LandingHr.tsx', true);
// We might also want to do PL if they want it, but the prompt only explicitly asked for HR version.

