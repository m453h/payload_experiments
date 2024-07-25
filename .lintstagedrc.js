const path = require("path");

module.exports = {
  // Since we don't have eslint json/md plugins installed in this app, we can't
  // use the eslint to lint json,md here
  "*.{json,md}": ["prettier --write"],
  "*.{yaml,yml}": "prettier --write",
  "*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}": ["prettier --write"],
};
