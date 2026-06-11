import fs from 'fs';

let c = fs.readFileSync('src/components/QRModalHr.tsx', 'utf-8');

c = c.split("QRDesigns").join("QRDesignsHr");
c = c.split("export default function QRModal").join("export default function QRModalHr");
c = c.split("Prenesi QR Lističe").join("Preuzmi QR listiće");
c = c.split("Izberite dizajn za vaše QR lističe. Prenesel se bo PDF dokument formata A4, na katerem bodo 4 lističi (vsak formata A6), pripravljeni za tisk.").join("Odaberite dizajn za vaše QR listiće. Preuzet će se PDF dokument formata A4 na kojem će biti 4 listića (svaki formata A6), spremni za ispis.");
c = c.split("Poročni").join("Vjenčani");
c = c.split("Nevtralni").join("Neutralni");
c = c.split("Poslovni").join("Poslovni");
c = c.split("Rojstnodnevni").join("Rođendanski");
c = c.split("Slika je prazna (napaka pri izrisu)").join("Slika je prazna (pogreška pri iscrtavanju)");
c = c.split("Dogodek").join("Događaj");
c = c.split("Napaka pri generiranju PDF:").join("Pogreška pri generiranju PDF-a:");
c = c.split("Prišlo je do napake pri generiranju PDF-ja:").join("Došlo je do pogreške pri generiranju PDF-a:");
c = c.split("Neznana napaka").join("Nepoznata pogreška");
c = c.split("Poskusite znova ali uporabite drug brskalnik.").join("Pokušajte ponovno ili koristite drugi preglednik.");
c = c.split("PDF je pripravljen! Kliknite 'Prenesi zdaj'.").join("PDF je spreman! Kliknite 'Preuzmi sada'.");
c = c.split("Prekliči").join("Odustani");
c = c.split("Prenesi zdaj").join("Preuzmi sada");
c = c.split("Pripravljam PDF...").join("Pripremam PDF...");
c = c.split("Generiraj PDF (A4)").join("Generiraj PDF (A4)");

fs.writeFileSync('src/components/QRModalHr.tsx', c);
console.log("QRModalHr translated");
