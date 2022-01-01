const withTM = require('next-transpile-modules')(['@ljbc1994/design-tokens']); // pass the modules you would like to see transpiled

module.exports = withTM({
  reactStrictMode: true,
});
