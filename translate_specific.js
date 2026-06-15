import fs from 'fs';

async function translateFile(sourcePath, destPath) {
    console.log(`Translating ${sourcePath} -> ${destPath}...`);
    const sourceCode = fs.readFileSync(sourcePath, 'utf8');
    
    const requestBody = {
        contents: [{
            role: 'user',
            parts: [{ text: "Translate the Croatian text inside this React component into Polish. KEEP ALL REACT CODE, HTML TAGS, INTERPOLATIONS, LOCALE STRINGS (`locale: 'pl'`), PRICES (`zł` values), AND VARIABLES EXACTLY INTACT. Only translate the human-readable Croatian display text. DO NOT wrap the output in markdown code blocks. OUTPUT RAW CODE ONLY:\n\n" + sourceCode }]
        }],
        generationConfig: {
            temperature: 0.1,
        }
    };

    try {
        const fetch = globalThis.fetch;
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });
        const data = await res.json();
        if (data.error) {
            console.error('API Error:', data.error.message);
            return false;
        }
        let translated = data.candidates[0].content.parts[0].text;
        
        translated = translated.replace(/^```tsx?\n/, '').replace(/\n```$/, '');

        fs.writeFileSync(destPath, translated, 'utf8');
        console.log(`Successfully wrote ${destPath}`);
        return true;
    } catch (err) {
        console.error(`Failed to translate ${sourcePath}:`, err.message);
        return false;
    }
}

async function run() {
    const files = [
        ['src/pages/PrivacyHr.tsx', 'src/pages/PrivacyPl.tsx'],
    ];

    for (const [src, dest] of files) {
        await translateFile(src, dest);
    }
}
run();
