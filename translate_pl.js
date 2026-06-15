import * as fs from 'fs';
import * as path from 'path';

async function translateFile(sourcePath, destPath) {
    console.log(`Translating ${sourcePath} -> ${destPath}...`);
    const content = fs.readFileSync(sourcePath, 'utf8');

    const prompt = 'You are an expert software developer and translator.\n' +
        'I have a React component file in Croatian.\n' +
        'You must return the exact same source code, keeping all logic, variable names, component names, and structure intact.\n' +
        'Your task is ONLY to translate the USER-FACING TEXT from Croatian to Polish.\n' +
        'Do not translate variable names, prop names, keys, or any code syntax.\n' +
        'Replace any mentions of URLs like hr.getkliksy.com with pl.getkliksy.com.\n' +
        'Convert prices from EUR (€) to PLN (zł). The equivalent pricing is: 39€ -> 169 zł, 49€ -> 219 zł, 79€ -> 349 zł, 19.99€ -> 89 zł, 24.99€ -> 109 zł, 29.99€ -> 129 zł, 34.99€ -> 159 zł, 55€ -> 239 zł, 69€ -> 299 zł, 109€ -> 459 zł. Leave the numeric structure but just replace currency and amount in the user-facing text. Note that sometimes prices are just plain 39, 49 without currency, you should update those numbers to 169, 219 respectively.\n' +
        'Also, any components like QRDesignsHr should be updated to QRDesignsPl (component names ending in Hr change to Pl).\n' +
        'Any strings starting with "/" like "/zasebnost" or "/pogoji-uporabe" keep them as they are or whatever the Croatian file had.\n' +
        'Output ONLY the raw code without any markdown formatting wrappers. Do not add any text before or after the code.';

    const requestBody = {
        contents: [
            { role: 'user', parts: [{ text: prompt }] },
            { role: 'user', parts: [{ text: content }] }
        ],
        generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 8192
        }
    };

    try {
        const fetch = globalThis.fetch;
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
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
        
        if (translated.startsWith('```')) {
            translated = translated.replace(/^```[a-z]*\n/, '').replace(/\n```$/, '');
        }

        fs.writeFileSync(destPath, translated, 'utf8');
        console.log(`Successfully wrote ${destPath}`);
        return true;
    } catch (err) {
        console.error(`Failed to translate ${sourcePath}:`, err.message);
        return false;
    }
}

async function main() {
    undefined

    for (const [src, dest] of files) {
        if (true) {
            const success = await translateFile(src, dest);
            if (!success) break;
            await new Promise(r => setTimeout(r, 6000));
        }
    }
}

main();
