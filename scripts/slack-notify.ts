import axios from 'axios';
import fs from 'fs';
import path from 'path';

async function sendSlackMessage() {
    const resultsPath = path.join(process.cwd(), 'test-results/results.json');
    
    if (!fs.existsSync(resultsPath)) {
        console.error('LOG: No se encontró results.json en ' + resultsPath);
        return;
    }

    const report = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
    const stats = report.stats;

    // LÓGICA ROBUSTA: Intentamos obtener los fallos de varias formas
    // Playwright varía según configuración: 'unexpected', 'failed' o 'failures'
    const pasados = stats.expected || 0;
    const fallados = stats.unexpected ?? stats.failed ?? stats.failures ?? 0;
    const saltados = stats.skipped || 0;
    const autor = process.env.GITHUB_ACTOR || 'QA Engine';

    const esExitoso = fallados === 0;
    const color = esExitoso ? "#36a64f" : "#FF0000"; 
    const status = esExitoso ? "🟢 REGRESIÓN EXITOSA" : "🔴 REGRESIÓN FALLIDA";

    const slackPayload = {
        attachments: [{
            color: color,
            title: status,
            fields: [
                { title: "Pasados ✅", value: `${pasados}`, short: true },
                { title: "Fallados ❌", value: `${fallados}`, short: true },
                { title: "Saltados ⏩", value: `${saltados}`, short: true },
                { title: "Autor 👤", value: `${autor}`, short: true }
            ],
            footer: `🔗 Reporte: https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`,
            ts: Math.floor(Date.now() / 1000)
        }]
    };

    await axios.post(process.env.SLACK_WEBHOOK_URL!, slackPayload);
}

sendSlackMessage().catch(console.error);