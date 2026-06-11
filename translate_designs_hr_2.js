import fs from 'fs';

let c = fs.readFileSync('src/components/QRDesignsHr.tsx', 'utf-8');

c = c.split("Poslovni dogodek").join("Poslovni događaj");
c = c.split("Zabiložeite").join("Zabilježite");

fs.writeFileSync('src/components/QRDesignsHr.tsx', c);
console.log("QRDesignsHr extra translations 2 done");
