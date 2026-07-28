const fs = require('fs');
const path = require('path');

// Crear carpeta de resultados de Allure
const allureDir = path.join(__dirname, '../allure-results');
if (!fs.existsSync(allureDir)) {
    fs.mkdirSync(allureDir, {
        recursive: true
    });
}

// Ruta del JSON generado por Cucumber
const resultsPath = path.join(__dirname, '../reports/cucumber-results.json');

if (fs.existsSync(resultsPath)) {
    var rawData = fs.readFileSync(resultsPath, 'utf8');
    var results = JSON.parse(rawData);

    // Asegurar que es un array
    var features = Array.isArray(results) ? results : [results];

    features.forEach(function (feature) {
        if (feature.elements && Array.isArray(feature.elements)) {
            feature.elements.forEach(function (scenario) {
                // Construir los pasos
                var steps = [];
                if (scenario.steps && Array.isArray(scenario.steps)) {
                    steps = scenario.steps.map(function (step) {
                        var status = 'unknown';
                        var duration = 0;

                        if (step.result) {
                            if (step.result.status) {
                                status = step.result.status;
                            }
                            if (step.result.duration) {
                                duration = step.result.duration;
                            }
                        }

                        return {
                            name: step.name || '',
                            status: status,
                            duration: duration
                        };
                    });
                }

                // Obtener estado del escenario
                var scenarioStatus = 'unknown';
                var scenarioDuration = 0;
                if (scenario.result) {
                    if (scenario.result.status) {
                        scenarioStatus = scenario.result.status;
                    }
                    if (scenario.result.duration) {
                        scenarioDuration = scenario.result.duration;
                    }
                }

                // Crear objeto de resultado Allure
                var result = {
                    name: scenario.name || 'Escenario sin nombre',
                    status: scenarioStatus,
                    steps: steps,
                    duration: scenarioDuration,
                    start: Date.now() - scenarioDuration,
                    stop: Date.now()
                };

                // Guardar en un archivo único por escenario
                var fileName = 'allure-result-' + Date.now() + '-' + Math.random().toString(36).substring(7) + '.json';
                fs.writeFileSync(
                    path.join(allureDir, fileName),
                    JSON.stringify(result, null, 2)
                );
            });
        }
    });

    console.log('✅ Reporte convertido a Allure correctamente');
} else {
    console.log('⚠️ No se encontraron resultados de pruebas en:', resultsPath);
}