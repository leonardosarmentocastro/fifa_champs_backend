const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authenticationValidator = require('./validator');
const { ENVIRONMENT_VARIABLES } = require('../../internals');

const authenticationService = {
  // Dependency injection
  get authenticationValidator() { return { ...authenticationValidator }; },
  get bcrypt() { return { ...bcrypt }; },
  get ENVIRONMENT_VARIABLES() { return { ...ENVIRONMENT_VARIABLES }; },
  get jwt() { return { ...jwt }; },

  createAuthorizationTokenForUser(savedUser) {
    const error = this.authenticationValidator.validateForCreatingAuthorizationToken(savedUser);
    if (error) throw error;

    // TODO: send all user's public fields.
    const payload = { id: savedUser._id };
    const { options, secret } = this.ENVIRONMENT_VARIABLES.authentication;
    const token = this.jwt.sign(payload, secret, options);

    return token;
  },

  async encryptPassword(password) {
    const salt = 10;
    const encryptPassword = await this.bcrypt.hash(password, salt)
      .catch(() => {
        const error = this.authenticationValidator.ERRORS.PASSWORD_COULDNT_BE_ENCRYPTED;
        throw error;
      });

    return encryptPassword;
  },

  setAuthorizationTokenOnResponse(token, res) {
    const error = this.authenticationValidator.validateForAttachingTokenOnResponse(token);
    if (error) throw error;

    const header = 'Authorization';
    res.set(header, token);
  },
};

module.exports = authenticationService;
