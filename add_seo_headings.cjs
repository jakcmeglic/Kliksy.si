const fs = require('fs');

function updateLanding(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  const seoHeadings = `
      {/* SEO Headings - visually hidden to preserve layout */}
      <div className="sr-only">
        <h1>Digitalna foto galerija za vašo poroko z QR kodo</h1>
        <h2>Popoln dodatek k poročnemu fotografu</h2>
        <h2>Kako deluje Kliksy na poroki</h2>
        <h2>Kliksy za rojstni dan in druge dogodke</h2>
        <h2>Zakaj izbrati Kliksy namesto WhatsApp ali photo bootha</h2>
        <h2>Pogosta vprašanja o Kliksy</h2>
      </div>
  `;

  if (!content.includes('Digitalna foto galerija za vašo poroko z QR kodo')) {
    content = content.replace('</Helmet>', '</Helmet>\n' + seoHeadings);
    fs.writeFileSync(filePath, content);
    console.log("Updated", filePath);
  }
}

updateLanding('src/pages/Landing.tsx');
