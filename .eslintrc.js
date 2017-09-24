module.exports = {
    "extends": "airbnb-base",
    "rules": {
      "comma-dangle": ["error", "never"],
      "no-shadow": [2, {"allow": ["callback", "error", "result"]}],
      "global-require": 0,
      "no-param-reassign": 0,
      "arrow-body-style": 0,
      "arrow-parens": 0,
      "func-names": ["error", "as-needed"]
    }
};
