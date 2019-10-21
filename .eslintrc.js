module.exports = {
  plugins: ['jest'],
  extends: ['airbnb-base', 'prettier'],
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  rules: {
    strict: ['off'],
  },
};
