import fs from 'fs';

let content = fs.readFileSync('src/pages/DashboardHr.tsx', 'utf-8');

const dict = {
  'Upravljaj spomine dogodka.': 'Upravljajte uspomenama s događaja.',
  'Postavke dogodka': 'Postavke događaja',
  'Ime dogodka': 'Ime događaja',
  'poslovni_dogodek': 'poslovni_dogodek', // internal string comparison probably
  'dogodek': 'događaj',
  'dogodka': 'događaja'
};

for (const [slo, hr] of Object.entries(dict)) {
  if(slo === 'poslovni_dogodek') continue; // Don't replace the variable/value enum name
  // Note: Just replace user-facing ones manually.
}

content = content.replace(/Upravljaj spomine dogodka\./g, 'Upravljajte uspomenama događaja.');
content = content.replace(/Postavke dogodka/g, 'Postavke događaja');
content = content.replace(/Ime dogodka/g, 'Ime događaja');
content = content.replace(/dogodka/g, 'događaja');
content = content.replace(/dogodek/g, 'događaj');


fs.writeFileSync('src/pages/DashboardHr.tsx', content);

console.log("DashboardHr more translations done");
