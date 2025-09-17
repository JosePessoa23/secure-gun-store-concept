module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true, // Specify the Node.js environment
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'security',
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',

    // Security rules
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'error',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-non-literal-fs-filename': 'error',
    'security/detect-non-literal-regexp': 'error',
    'security/detect-non-literal-require': 'error',
    'security/detect-object-injection': 'error',
    'security/detect-possible-timing-attacks': 'error',
    'security/detect-pseudoRandomBytes': 'error',
    'security/detect-unsafe-regex': 'error',

    // Custom rules to detect date and time functions
    'no-restricted-syntax': [
      'error',
      {
        selector: 'NewExpression[callee.name="Date"]',
        message: 'Avoid using Date constructor directly. Ensure it is used properly.',
      },
      {
        selector: 'CallExpression[callee.name="setTimeout"]',
        message: 'Avoid using setTimeout. Ensure it is used properly.',
      },
      {
        selector: 'CallExpression[callee.name="setInterval"]',
        message: 'Avoid using setInterval. Ensure it is used properly.',
      },
      {
        selector: 'CallExpression[callee.name="setImmediate"]',
        message: 'Avoid using setImmediate. Ensure it is used properly.',
      },
      {
        selector: 'CallExpression[callee.name="clearTimeout"]',
        message: 'Ensure clearTimeout is used properly.',
      },
      {
        selector: 'CallExpression[callee.name="clearInterval"]',
        message: 'Ensure clearInterval is used properly.',
      },
      {
        selector: 'CallExpression[callee.name="clearImmediate"]',
        message: 'Ensure clearImmediate is used properly.',
      },
      {
        selector: 'CallExpression[callee.object.name="moment"]',
        message: 'Avoid using moment.js. Ensure it is used properly.',
      },
      {
        selector: 'CallExpression[callee.object.name="luxon"]',
        message: 'Avoid using luxon.js. Ensure it is used properly.',
      },
      {
        selector: 'CallExpression[callee.object.name="date-fns"]',
        message: 'Avoid using date-fns. Ensure it is used properly.',
      },
      {
        selector: 'BinaryExpression[operator="*"]',
        message: 'Review multiplication operations for potential salami attacks.',
      },
      {
        selector: 'IfStatement[test.operator="==="]',
        message: 'Ensure strict equality checks are safe and necessary.',
      },
      {
        selector: 'IfStatement > BinaryExpression[left.name="Date"]',
        message: 'Review date-based logic for potential logic bombs.',
      },
      {
        selector: 'CallExpression[callee.name="eval"]',
        message: 'Avoid using eval function.',
      },
      {
        selector: 'TryStatement',
        message: 'Review try-catch blocks for hidden errors or logic bypasses.',
      },
      {
        selector: 'Literal[value=/easteregg|hiddenfeature|secretcode/i]',
        message: 'Potential Easter egg or hidden feature detected. Review this code carefully.',
      },
      {
        selector: 'IfStatement[test.value=/easteregg|hiddenfeature|secretcode/i]',
        message: 'Potential Easter egg or hidden feature detected. Review this code carefully.',
      },
      {
        selector: 'FunctionDeclaration[id.name="undocumentedFunction"]',
        message: 'Ensure all functions are documented and approved.',
      },
      {
        selector: 'ExpressionStatement > AssignmentExpression > MemberExpression[property.name="prototype"]',
        message: 'Avoid modifying prototype of built-in objects. Ensure it is used properly.',
      },
    ],
  },
};
