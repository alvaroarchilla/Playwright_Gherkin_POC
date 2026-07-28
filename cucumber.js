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
            'json:reports/cucumber-results.json' // 👈 Formato correcto
        ],
        paths: ['src/features/**/*.feature'],
        dryRun: false,
        strict: true,
    }

};