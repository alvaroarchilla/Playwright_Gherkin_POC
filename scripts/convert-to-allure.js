const fs = require('fs');
const path = require('path');
const {
    v4: uuidv4
} = require('uuid');
const crypto = require('crypto');

const allureDir = path.join(__dirname, '../allure-results');
if (fs.existsSync(allureDir)) {
    fs.rmSync(allureDir, { recursive: true, force: true });
}
fs.mkdirSync(allureDir, { recursive: true });

const resultsPath = path.join(__dirname, '../reports/cucumber-results.json');
if (!fs.existsSync(resultsPath)) {
    console.log('⚠️ No se encontraron resultados de pruebas en:', resultsPath);
    process.exit(0);
}

const rawData = fs.readFileSync(resultsPath, 'utf8');
let results;
try {
    results = JSON.parse(rawData);
} catch (e) {
    console.error('❌ Error al parsear el JSON de Cucumber:', e.message);
    process.exit(1);
}

const features = Array.isArray(results) ? results : [results];
const featureContainers = {};

features.forEach((feature) => {
    const featureName = feature.name || 'Feature sin nombre';
    const featureTags = feature.tags ? feature.tags.map(t => t.name) : [];

    if (!feature.elements || !Array.isArray(feature.elements)) return;

    // Crear contenedor para la feature
    const containerUuid = uuidv4();
    const container = {
        uuid: containerUuid,
        name: featureName,
        start: Date.now(),
        stop: Date.now(),
        befores: [],
        afters: [],
        children: []
    };
    featureContainers[featureName] = container;

    feature.elements.forEach(scenario => {
        if (scenario.type !== 'scenario' && scenario.type !== 'scenario_outline') return;

        const scenarioName = scenario.name || `Escenario ${scenario.line || ''}`;
        const scenarioTags = scenario.tags ? scenario.tags.map(t => t.name) : [];
        const allTags = [...featureTags, ...scenarioTags];

        const historyId = crypto.createHash('md5')
            .update(featureName + scenarioName)
            .digest('hex');

        // --- PROCESAR PASOS Y DERIVAR ESTADO DEL ESCENARIO ---
        let scenarioStatus = 'passed'; // Asumimos que pasa
        let scenarioDuration = 0;
        let firstErrorMessage = '';
        let firstErrorTrace = '';
        const steps = [];

        if (scenario.steps && Array.isArray(scenario.steps)) {
            scenario.steps.forEach(step => {
                let stepStatus = 'unknown';
                let stepDuration = 0;
                let stepErrorMessage = '';

                if (step.result) {
                    const raw = step.result.status;
                    if (raw === 'passed') stepStatus = 'passed';
                    else if (raw === 'failed') stepStatus = 'failed';
                    else if (raw === 'skipped') stepStatus = 'skipped';
                    else if (raw === 'undefined') stepStatus = 'undefined';
                    else if (raw === 'pending') stepStatus = 'pending';
                    else stepStatus = raw || 'unknown';

                    if (step.result.duration) {
                        stepDuration = Math.floor(step.result.duration / 1e6);
                    }
                    if (step.result.error_message) {
                        stepErrorMessage = step.result.error_message;
                        // Guardar el primer error para el escenario
                        if (!firstErrorMessage) {
                            const parts = stepErrorMessage.split('\n');
                            firstErrorMessage = parts[0] || '';
                            firstErrorTrace = parts.slice(1).join('\n') || '';
                            if (!firstErrorTrace) firstErrorTrace = stepErrorMessage;
                        }
                    }
                }

                const stepName = (step.keyword || '') + (step.name || '');
                const stepObj = {
                    name: stepName,
                    status: stepStatus,
                    duration: stepDuration
                };
                if (stepErrorMessage) {
                    stepObj.statusDetails = {
                        message: stepErrorMessage
                    };
                }
                steps.push(stepObj);

                // Actualizar estado del escenario según el peor estado del paso
                if (stepStatus === 'failed') scenarioStatus = 'failed';
                else if (stepStatus === 'undefined' && scenarioStatus !== 'failed') scenarioStatus = 'undefined';
                else if (stepStatus === 'pending' && scenarioStatus !== 'failed' && scenarioStatus !== 'undefined') scenarioStatus = 'pending';
                else if (stepStatus === 'skipped' && scenarioStatus === 'passed') scenarioStatus = 'skipped';

                // Sumar duración de pasos (excluyendo hooks 'Before' y 'After' si se desea)
                // En este ejemplo sumamos todos los pasos (incluyendo hooks)
                scenarioDuration += stepDuration;
            });
        }

        // Si no hay pasos, estado unknown
        if (steps.length === 0) {
            scenarioStatus = 'unknown';
        }

        // Calcular tiempos de inicio y fin
        const now = Date.now();
        const start = now - scenarioDuration;
        const stop = now;

        // --- CREAR RESULTADO ---
        const resultUuid = uuidv4();
        const result = {
            uuid: resultUuid,
            stage: 'finished',
            historyId: historyId,
            fullName: `${featureName} > ${scenarioName}`,
            labels: [{
                    name: 'feature',
                    value: featureName
                },
                {
                    name: 'suite',
                    value: featureName
                },
                ...allTags.map(tag => ({
                    name: 'tag',
                    value: tag
                }))
            ],
            name: scenarioName,
            status: scenarioStatus,
            statusDetails: {
                message: firstErrorMessage,
                trace: firstErrorTrace
            },
            steps: steps,
            start: start,
            stop: stop
        };

        const resultFile = path.join(allureDir, `${resultUuid}-result.json`);
        fs.writeFileSync(resultFile, JSON.stringify(result, null, 2));

        container.children.push(resultUuid);
    });
});

// --- ESCRIBIR CONTENEDORES ---
Object.values(featureContainers).forEach(container => {
    if (container.children.length > 0) {
        const containerFile = path.join(allureDir, `${container.uuid}-container.json`);
        fs.writeFileSync(containerFile, JSON.stringify(container, null, 2));
    }
});

console.log('✅ Reporte convertido a Allure correctamente');
