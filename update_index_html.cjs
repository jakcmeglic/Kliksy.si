const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const schemaData = `
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Kliksy",
      "description": "Digitalna foto galerija za poroke in dogodke z QR kodo. Popoln dodatek k poročnemu fotografu — gostje skenirajo QR kodo in vse slike gredo avtomatično v eno skupno galerijo.",
      "url": "https://kliksy.si",
      "applicationCategory": "Photography",
      "operatingSystem": "Web",
      "inLanguage": "sl",
      "offers": {
        "@type": "Offer",
        "price": "39",
        "priceCurrency": "EUR"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5",
        "reviewCount": "88"
      }
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Kako deluje Kliksy?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Postavite QR kodo na mize — gostje jo skenirajo in slike gredo avtomatično v skupno galerijo v realnem času. Brez aplikacije."
          }
        },
        {
          "@type": "Question",
          "name": "Ali je Kliksy zamenjava za poročnega fotografa?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Ne — Kliksy je popoln dodatek k profesionalnemu poročnemu fotografu. Poročni fotograf ujame ključne trenutke ceremonije in prvega plesa, Kliksy pa zbere spontane fotografije od vseh gostov skozi celotno večer."
          }
        },
        {
          "@type": "Question",
          "name": "Ali rabijo gostje aplikacijo?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Ne — gostje samo skenirajo QR kodo s telefonom. Ni potrebna nobena aplikacija ali registracija."
          }
        },
        {
          "@type": "Question",
          "name": "Koliko stane Kliksy?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Kliksy paketi so na voljo že od €39. Basic paket vključuje 200 fotografij, Pro paket neomejeno fotografij, Premium paket pa neomejeno fotografij in videov."
          }
        },
        {
          "@type": "Question",
          "name": "Za katere dogodke je primeren Kliksy?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Kliksy je primeren za poroke, rojstne dneve, krste, korporativne eventi in vse vrste praznований kjer želi organizator zbrati fotografije od vseh gostov."
          }
        },
        {
          "@type": "Question",
          "name": "Kako dolgo je galerija aktivna?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Odvisno od paketa. Basic paket ima galerijo aktivno 30 dni, Pro in Premium paketa pa trajno."
          }
        },
        {
          "@type": "Question",
          "name": "Kaj je razlika med Kliksy in photo boothom?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Photo booth zajame samo en kotiček večera. Kliksy zbere fotografije od VSEH gostov skozi celotno poroko — vsak kotiček, vsak spontan trenutek, vsaka miza."
          }
        }
      ]
    }
    </script>
`;

if (!html.includes('SoftwareApplication')) {
  html = html.replace('</head>', schemaData + '</head>');
  fs.writeFileSync('index.html', html);
  console.log("Updated index.html");
}
