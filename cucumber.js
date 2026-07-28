module.exports = {
    default: {
        require: [
            'src/step-definitions/**/*.ts',
            'src/hooks/**/*.ts'
        ],
        requireModule: ['tsx'],
        format: [
            'summary',
            'progress',
            'json:reports/cucumber-results.json' // Solo el JSON estándar
        ],
        dryRun: false,
        strict: true,
    }
};
