const fs = require('fs');
let content = fs.readFileSync('src/pages/BlogArticle.tsx', 'utf8');

const replacements = [
  {
    target: `"text": "Kliksy je digitalna galerija za poroke ki stane od €39.`,
    replacement: `"text": "Kliksy je digitalna galerija za poroke, ki stane od €39.`
  },
  {
    target: `odkrijte zakaj je Kliksy 10x cenejša alternativa."`,
    replacement: `odkrijte, zakaj je Kliksy 10x cenejša alternativa."`
  },
  {
    target: `cenejšo alternativo ki zajame celotno poroko`,
    replacement: `cenejšo alternativo, ki zajame celotno poroko`
  },
  {
    target: `vključenih rekvizitov in ali je vključen operater.`,
    replacement: `vključenih rekvizitov in od tega, ali je vključen operater.`
  },
  {
    target: `vsi pred isto ozadju, vsi z istimi rekviziti.`,
    replacement: `vse pred istim ozadjem, vse z istimi rekviziti.`
  },
  {
    target: `Preostali 60–70% bo fotografiralo s svojimi telefoni`,
    replacement: `Preostalih 60–70 % bo fotografiralo s svojimi telefoni`
  },
  {
    target: `le 30–40% gostov.`,
    replacement: `le 30–40 % gostov.`
  },
  {
    target: `digitalna rešitev ki reši točno te probleme`,
    replacement: `digitalna rešitev, ki reši točno te probleme`
  },
  {
    target: `Delež gostov ki sodeluje`,
    replacement: `Delež gostov, ki sodelujejo`
  },
  {
    target: `Pri photo boothu nastane vrsta ker je en aparat`,
    replacement: `Pri photo boothu nastane vrsta, ker je en aparat`
  },
  {
    target: `150 photo boothov ki delujejo hkrati`,
    replacement: `150 photo boothov, ki delujejo hkrati`
  },
  {
    target: `Kliksy je dostopen alternativa od €39.`,
    replacement: `Kliksy je dostopna alternativa od €39.`
  },
  {
    target: `preizkusite kako deluje — brez kreditne`,
    replacement: `preizkusite, kako deluje — brez kreditne`
  },
  {
    target: `Vrste 5–15 minut čakanja`,
    replacement: `5–15 minut čakanja v vrsti`
  },
  {
    target: `Le 30–40% gostov ga obišče`,
    replacement: `Le 30–40 % gostov ga obišče`
  },
  {
    target: `Začni z Kliksy`,
    replacement: `Začni s Kliksy`
  },
  {
    target: `prihranite z Kliksy`,
    replacement: `prihranite s Kliksy`
  },
  {
    target: `dobim z Kliksy`,
    replacement: `dobim s Kliksy`
  },
  {
    target: `Osnovni odprti Photo booth`,
    replacement: `Osnovni odprti photo booth`
  }
];

let changedCount = 0;
for (const r of replacements) {
  if (content.includes(r.target)) {
    content = content.replace(r.target, r.replacement);
    changedCount++;
  } else {
    console.warn("Could not find target:", r.target);
  }
}

fs.writeFileSync('src/pages/BlogArticle.tsx', content);
console.log(`Updated ${changedCount} grammar rules.`);
