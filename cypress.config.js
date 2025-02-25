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
        logAction(message) {
          const logDirectory = path.join(__dirname, 'cypress', 'logs');

          // Generate log file name once per test run
          if (!global.logFilePath) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            global.logFilePath = path.join(logDirectory, `test-log-${timestamp}.txt`);
          }

          // Ensure the log directory exists
          if (!fs.existsSync(logDirectory)) {
            fs.mkdirSync(logDirectory, { recursive: true });
          }

          // Log to the console
          console.log(message);

          // Write to the log file
          fs.appendFileSync(logFilePath, message + '\n');
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
    json: true,
    timestamp: "ddmmyyyy_HHMMss",
    charts: true,
    embeddedScreenshots: true
  },
  screenshotOnRunFailure: true,
  defaultCommandTimeout: 10000
});
