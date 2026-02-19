import axios from 'axios';
import fs from 'fs';
import path from 'path';

async function sendSlackMessage() {
    const resultsPath = path.join(process.cwd(), 'test-results/results.json');
    
    if (!fs.existsSync(resultsPath)) return;

    const report = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
    const stats = report.stats;

    // Lógica de color
    const color = stats.failed > 0 ? "#FF0000" : "#36a64f"; 
    const status = stats.failed > 0 ? "🔴 REGRESIÓN FALLIDA" : "🟢 REGRESIÓN EXITOSA";

    const slackPayload = {
        attachments: [{
            color: color,
            title: status,
            fields: [
                { title: "Pasados ✅", value: `${stats.expected}`, short: true },
                { title: "Fallados ❌", value: `${stats.failed}`, short: true },
                { title: "Saltados ⏩", value: `${stats.skipped}`, short: true }
            ],
            footer: `🔗 Reporte: https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`,
            ts: Math.floor(Date.now() / 1000)
        }]
    };

    await axios.post(process.env.SLACK_WEBHOOK_URL!, slackPayload);
}

sendSlackMessage().catch(console.error);