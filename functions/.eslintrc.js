module.exports = {
  "root": true,
  "env": {
    es6: true,
    node: true,
  },
  "extends": [
    "eslint:recommended",
    "google",
  ],
  "rules": {
    "quotes": 0,
    "max-len": 'off',
  },
  "parserOptions": {
    "ecmaVersion": 8,
    "sourceType": "module",
  },
};
