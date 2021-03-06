const chalk = require('chalk');
const express = require('express');
const http = require('http');

const { ENVIRONMENT_VARIABLES } = require('../internals');
const { configureShared } = require('../modules/shared');
// Necessary to configure shared singletons before all other dependencies get required because:
// If they ocasionally use the singletons that are being mutated by this configuration,
// they will not take the given changes into consideration.
configureShared.singletons();
const configureWebserver = require('./configure');
const { database } = require('../database');
const router = require('./router');

class Webserver {
  constructor() {
    this.app = null;
    this.router = router;
    this.server = null;
  }

  close() {
    return new Promise((resolve) => {
      const isServerRunning = this.server.listening;
      if (!isServerRunning) {
        resolve();
      }

      this.server.close(() => {
        const message = chalk.green(`
          ######################################
          ###   Server closed successfully!  ###
          ######################################
        `);

        resolve(console.info(message)); // eslint-disable-line
      });
    });
  }

  connectApplicationMiddlewares(app) {
    configureWebserver.connectStaticFileServingMiddlewareForApiDocs(app);
    configureWebserver.connectAuthenticationInterceptorMiddleware(app);
  }

  connectExpressMiddlewares(app) {
    configureWebserver.bodyParser(app);
    configureWebserver.prettifyJsonOutput(app);
    configureWebserver.requestCompression(app);
    configureWebserver.logErrorsOnConsoleDependingOnEnviroment(app);
    configureWebserver.logRequestsOnConsoleDependingOnEnvironment(app);
    configureWebserver.corsWithAuthorizationHeaderEnabled(app);
  }

  connectRoutes(app) {
    this.router.connect(app);
  }

  getErrorOnStartingServerMessage(err, options) {
    const { environment, port } = options;

    const stacktrace = chalk.grey(`
      #####################
      ###  Stacktrace   ###
      #####################

      ${err}
    `);

    const message = chalk.red(`
      ######################################
      ### Error on starting the server   ###
      ######################################

      Failed to start the server
      on port ${chalk.yellow(port)},
      in ${chalk.yellow(environment)} mode.

      -----

      ${stacktrace}
    `);

    return message;
  }

  getServerSuccessfullyStartedMessage(options) {
    const { port, environment } = options;

    const message = chalk.green(`
      ######################################
      ### Server successfully started!  ###
      ######################################

      Server listening
      on port ${chalk.yellow(port)}
      in ${chalk.yellow(environment)} mode.
    `);
    return message;
  }

  async listen() {
    const {
      environment,
      ip,
      port,
    } = ENVIRONMENT_VARIABLES;

    return new Promise((resolve, reject) => {
      const callback = {
        whenServerStartSuccessfully: () => {
          const options = { port, environment };
          const message = this.getServerSuccessfullyStartedMessage(options);

          return resolve(console.info(message)); // eslint-disable-line
        },

        whenServerFailedToStart: (err) => {
          const options = { port, environment };
          const message = this.getErrorOnStartingServerMessage(err, options);

          return reject(message);
        },
      };

      // Start listening to connections.
      // Stores the "server" instance so we can close it manually if we wish to.
      const backlog = 511; // Maximum length of the queue of pending connections.
      this.server =
        this.app.listen(port, ip, backlog, callback.whenServerStartSuccessfully);

      // If the server failed to start, a callback will be fired to tell us that.
      this.server.on('error', callback.whenServerFailedToStart);
    });
  }

  async start() {
    // Run the database
    await database.connect();

    // Run the server
    this.app = express();
    this.server = http.createServer(this.app);
    this.connectExpressMiddlewares(this.app);
    this.connectApplicationMiddlewares(this.app);
    this.connectRoutes(this.app);

    return this.listen();
  }
}

module.exports = Webserver;
