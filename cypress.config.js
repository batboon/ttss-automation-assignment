const { defineConfig } = require("cypress");
const fs = require('fs');
const path = require('path');

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://www.saucedemo.com",
    setupNodeEvents(on, config) {
      // implement node event listeners here
      const configFilename = `./cypress/config/config.json`;
      const settings = require(configFilename);
      if (settings.env) {
        config.env = {
          ...settings.env,
        };
      }

      // Define custom task to log actions
      on('task', {
        logAction({ message, specFile }) {
          const logDirectory = path.join(__dirname, "cypress", "logs");
          const specName = path.basename(specFile, ".js").replace(/[^a-z0-9]/gi, "_").toLowerCase();

          if (!global.logFiles) {
            global.logFiles = {};
          }
          if (!global.logFiles[specName]) {
            const timestamp = new Date().toISOString().split('.')[0].replace(/[:.]/g, '-');
            global.logFiles[specName] = path.join(logDirectory, `log-${specName}-${timestamp}.txt`);
          }
          const logFilePath = global.logFiles[specName];

          // Ensure the log directory exists
          if (!fs.existsSync(logDirectory)) {
            fs.mkdirSync(logDirectory, { recursive: true });
          }

          // Log to the console
          console.log(message);

          // Write to the log file
          const logMessage = `[${new Date().toISOString()}] ${message}`;
          fs.appendFileSync(logFilePath, logMessage + '\n');
          return null;
        },
      });
      return config;
    },
  },
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: "cypress/report/mochawesome-report",
    overwrite: false,
    html: true,
    json: false,
    timestamp: "ddmmyyyy_HHMMss",
    charts: true,
    embeddedScreenshots: true
  },
  screenshotOnRunFailure: true,
  defaultCommandTimeout: 10000
});
