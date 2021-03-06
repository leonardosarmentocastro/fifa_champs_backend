require('dotenv').config(); // Reads the ".env" file at the root of the project and set into "process.env"
const getenv = require('getenv'); // Helper to get and typecast environment variables

// Fallback values.
const DEFAULT = {
  authentication: {
    options: {
      expiresIn: '10y',
    },
    secret: 'authentication-secret-development-fifa-champs',
    token: 'authentication-token-development-fifa-champs',
  },
  environment: 'development',
  ip: '127.0.0.1',
  mongodb: {
    database: {
      name: 'db-development-fifa-champs',
    },
    host: '127.0.0.1',
  },
  port: 8080,
};

// # A
const authentication = {
  options: {
    expiresIn: getenv.string('AUTHENTICATION_OPTIONS_EXPIRES_IN', DEFAULT.authentication.options.expiresIn),
  },
  secret: getenv.string('AUTHENTICATION_SECRET', DEFAULT.authentication.secret),
  token: getenv.string('AUTHENTICATION_TOKEN', DEFAULT.authentication.token),
};

// # E
const environment = getenv.string('ENVIRONMENT', DEFAULT.environment);

// # I
const ip = getenv.string('IP', DEFAULT.ip);

// # M
const mongodb = {
  database: {
    name: getenv.string('MONGODB_DATABASE_NAME', DEFAULT.mongodb.database.name),
  },
  host: getenv.string('MONGODB_HOST', DEFAULT.mongodb.host),
  uri: '',
};
mongodb.uri = `mongodb://${mongodb.host}/${mongodb.database.name}`;


// # P
const port = getenv.string('PORT', DEFAULT.port);

// CONSTANTS
const IS_DEVELOPMENT_ENVIRONMENT = (environment === 'development');
const IS_TEST_ENVIRONMENT = (environment === 'test');
const IS_PRODUCTION_ENVIRONMENT = !(IS_DEVELOPMENT_ENVIRONMENT || IS_TEST_ENVIRONMENT);

const ENVIRONMENT_VARIABLES = {
  authentication,
  environment,
  ip,
  IS_DEVELOPMENT_ENVIRONMENT,
  IS_PRODUCTION_ENVIRONMENT,
  IS_TEST_ENVIRONMENT,
  mongodb,
  port,
};
module.exports = ENVIRONMENT_VARIABLES;
