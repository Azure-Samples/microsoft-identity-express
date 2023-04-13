
const MsIdExpress = require('../../../dist/index');
const { PerformanceObserver } = require('perf_hooks');
const fs = require('fs');
const path = require('path');

class WebAppAuthClientPerformanceWrapper {
    config;
    webAppAuthClientBuilderInstance;
    perfObserver;

    constructor(config) {
        this.config = config;
        this.webAppAuthClientBuilderInstance = new MsIdExpress.WebAppAuthClientBuilder(config.appSettings).build();

        this.initializePerfObserver();
    }

    getWebAppAuthClientBuilderInstance () {
        return this.webAppAuthClientBuilderInstance;
    }

    initializePerfObserver() {
        const perfObserver = new PerformanceObserver((items) => {
            items.getEntries().forEach((entry) => {
                const data = `${entry.name} ${entry.startTime} ${entry.duration}\n`;
                fs.appendFile(path.join(__dirname, `${this.config.outputPath}`), data, function(err) {
                    if (err) throw err;
                });
            });
        });
        perfObserver.observe({ entryTypes: ['measure'], buffer: true });
    }
    
}

module.exports = WebAppAuthClientPerformanceWrapper;