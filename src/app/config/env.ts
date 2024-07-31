export const ENV = {
  PROJECT_NAME: 'LT Manager',

  TOKEN_PREFIX: 'Bearer',
  TOKEN_HEADER_KEY: 'Authorization',

  // DEVELOPMENT
  dev: {
    API_URI: 'http://localhost:3000/api/v1',
  },

  // PRODUCTION
  prod: {
    API_URI: 'http://localhost:3000/api/v1',
  },

  user: {
    EXP_KEY: 'LTManagerUserExp',
    USER_KEY: 'LTManagerUserUK', // Current user connected
    TOKEN_KEY: 'LTManagerUserTK',
  },
};
